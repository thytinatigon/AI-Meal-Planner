// File: backend/test/server.test.js
// Chạy: cd backend && npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

// Các test dưới đây đều bị chặn TRƯỚC khi gọi AI, nên không cần API key thật
process.env.GEMINI_API_KEY ||= 'test-key';
process.env.GROQ_API_KEY ||= 'test-key';

const { app, parseModelJson, splitSteps } = require('../server');
const { RECIPE_SCHEMA, RESPONSE_FORMAT } = require('../services/groqService');

// ==========================================
// Groq phải dùng structured outputs (strict) để không bị 400 json_validate_failed
// ==========================================

test('Groq dùng json_schema strict: true (không dùng json_object)', () => {
  assert.equal(RESPONSE_FORMAT.type, 'json_schema');
  assert.equal(RESPONSE_FORMAT.json_schema.strict, true);
});

test('Schema công thức có đủ field frontend cần và đóng object', () => {
  assert.deepEqual(RECIPE_SCHEMA.required, ['dishName', 'calories', 'instructions']);
  assert.equal(RECIPE_SCHEMA.additionalProperties, false);
  assert.equal(RECIPE_SCHEMA.properties.instructions.type, 'array');
  assert.equal(RECIPE_SCHEMA.properties.instructions.items.type, 'string');
});

// ==========================================
// Tách bước khi model gộp 5 bước vào 1 chuỗi
// ==========================================

test('splitSteps: tách chuỗi gộp "1. ... 2. ..." thành các bước riêng', () => {
  const merged = '1. Rửa cà chua. 2. Đánh trứng. 3. Xào chảo. 4. Nêm nếm. 5. Dọn đĩa.';
  assert.deepEqual(splitSteps([merged]), [
    'Rửa cà chua.',
    'Đánh trứng.',
    'Xào chảo.',
    'Nêm nếm.',
    'Dọn đĩa.',
  ]);
});

test('splitSteps: danh sách bước sẵn đúng thì giữ nguyên', () => {
  const steps = ['Bước một', 'Bước hai', 'Bước ba'];
  assert.deepEqual(splitSteps(steps), steps);
});

test('splitSteps: không cắt nhầm số đo kiểu "2 tbsp"', () => {
  assert.deepEqual(splitSteps(['Mix 2 tbsp oil and 1.5 cups water']), [
    'Mix 2 tbsp oil and 1.5 cups water',
  ]);
});

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const post = async (path, body, headers = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
};

// ==========================================
// Parse JSON do Groq/Gemini trả về
// ==========================================

test('parseModelJson: JSON hợp lệ thì trả về đúng object', () => {
  const recipe = {
    dishName: 'Trứng chiên',
    calories: '350 kcal',
    instructions: ['Bước 1', 'Bước 2'],
  };
  assert.deepEqual(parseModelJson(JSON.stringify(recipe)), recipe);
});

test('parseModelJson: JSON hỏng thì ném lỗi 502 (lỗi phía AI)', () => {
  assert.throws(
    () => parseModelJson('Xin chào, đây không phải JSON'),
    (err) => err.status === 502
  );
});

test('parseModelJson: chuỗi rỗng cũng phải ném lỗi 502', () => {
  assert.throws(
    () => parseModelJson(''),
    (err) => err.status === 502
  );
});

// ==========================================
// Validate input của API quét ảnh
// ==========================================

test('analyze-image: thiếu imageBase64 thì trả 400', async () => {
  const { status, body } = await post('/api/analyze-image', {});
  assert.equal(status, 400);
  assert.equal(typeof body.error, 'string');
});

test('analyze-image: mimeType không phải ảnh thì trả 400', async () => {
  const { status } = await post('/api/analyze-image', {
    imageBase64: 'AAAA',
    mimeType: 'application/pdf',
  });
  assert.equal(status, 400);
});

test('analyze-image: imageBase64 null thì trả 400', async () => {
  const { status } = await post('/api/analyze-image', {
    imageBase64: null,
    mimeType: 'image/jpeg',
  });
  assert.equal(status, 400);
});

// ==========================================
// Validate input của API công thức
// ==========================================

test('generate-recipe: thiếu finalIngredients thì trả 400', async () => {
  const { status, body } = await post('/api/generate-recipe', { diet: 'ăn mặn' });
  assert.equal(status, 400);
  assert.equal(typeof body.error, 'string');
});

test('generate-recipe: finalIngredients rỗng thì trả 400', async () => {
  const { status } = await post('/api/generate-recipe', {
    finalIngredients: [],
    diet: 'ăn mặn',
  });
  assert.equal(status, 400);
});

test('generate-recipe: finalIngredients không phải mảng thì trả 400', async () => {
  const { status } = await post('/api/generate-recipe', {
    finalIngredients: 'Trứng',
    diet: 'ăn mặn',
  });
  assert.equal(status, 400);
});

test('generate-recipe: phần tử rỗng trong finalIngredients thì trả 400', async () => {
  const { status } = await post('/api/generate-recipe', {
    finalIngredients: ['Trứng', '  '],
    diet: 'ăn mặn',
  });
  assert.equal(status, 400);
});

test('generate-recipe: thiếu diet thì trả 400', async () => {
  const { status } = await post('/api/generate-recipe', {
    finalIngredients: ['Trứng'],
  });
  assert.equal(status, 400);
});

// ==========================================
// Lỗi chung: CORS, JSON hỏng, không lộ stack trace
// ==========================================

test('CORS mở: origin lạ vẫn được phục vụ và có header CORS', async () => {
  const res = await fetch(`${baseUrl}/api/generate-recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://evil.example.com' },
    // Payload sai để không gọi AI (tiết kiệm quota), CORS header vẫn được set
    body: JSON.stringify({ finalIngredients: [], diet: 'ăn mặn' }),
  });
  // CORS mở hoàn toàn (không còn whitelist) nên origin nào cũng qua
  assert.equal(res.status, 400);
  assert.equal(res.headers.get('access-control-allow-origin'), '*');
});

test('body gửi lên không phải JSON thì trả 400 JSON, không lộ stack trace', async () => {
  const { status, body } = await post('/api/generate-recipe', '{oops');
  assert.equal(status, 400);
  assert.equal(typeof body.error, 'string');
  assert.equal(body.stack, undefined);
});
