# AI Meal Planner — "Let's Cook!"

Chụp ảnh tủ lạnh, AI nhận ra nguyên liệu rồi gợi ý một món ăn kèm công thức nấu.

## App làm gì

1. **Chụp/chọn ảnh** nguyên liệu (`HeroSection`). Ảnh được nén ngay trên trình duyệt bằng canvas xuống tối đa 800×800 JPEG trước khi gửi.
2. **Nhận diện nguyên liệu**: `POST /api/analyze-image` với `{ imageBase64, mimeType }` → Gemini trả `{ ingredients: string[] }` (tên nguyên liệu bằng tiếng Anh).
3. **Chỉnh danh sách** (`IngredientCheck`): tick/bỏ tick, sửa tên, thêm nguyên liệu, chọn chế độ ăn.
4. **Tạo công thức**: `POST /api/generate-recipe` với `{ finalIngredients, diet }` → Groq trả `{ dishName, calories, instructions: string[] }` (luôn 5 bước), hiển thị ở `InstructionSteps`.

Toàn bộ state và 2 lời gọi API nằm trong `frontend/src/hooks/useMealPlanner.js`.

## Công nghệ

| Phía | Dùng gì |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 (qua `@tailwindcss/postcss`), Radix UI, lucide-react |
| Backend | Node.js + Express 5 (CommonJS, không có bước build), `cors`, `dotenv`, `express-rate-limit` |
| AI | Gemini `gemini-3.1-flash-lite` (`@google/generative-ai`), Groq `openai/gpt-oss-20b` (`groq-sdk`, structured outputs `json_schema` strict) |
| Test | `node:test` có sẵn của Node, không dùng framework ngoài |

## Cấu trúc thư mục

```
ai-meal-planner/
├── backend/                      # Express API
│   ├── server.js                 # 2 route, validate input, rate limit, xử lý lỗi
│   ├── services/
│   │   ├── geminiService.js      # gọi Gemini + retry
│   │   └── groqService.js        # gọi Groq + schema công thức + retry
│   ├── test/server.test.js       # test node:test
│   └── .env.example
├── frontend/                     # Vite + React
│   ├── src/
│   │   ├── App.jsx               # nối 3 màn hình
│   │   ├── main.jsx              # điểm khởi chạy
│   │   ├── index.css             # Tailwind v4 (@import + @theme)
│   │   ├── assets/               # 3 ảnh hero (webp)
│   │   ├── components/           # HeroSection, IngredientCheck, InstructionSteps, ui/
│   │   ├── hooks/useMealPlanner.js
│   │   └── lib/ingredients.js    # hàm thuần + test cạnh bên
│   ├── public/                   # svg/ảnh tĩnh
│   └── .env.example
└── AGENTS.md                     # quy ước cho AI agent làm việc trong repo
```

## Chạy local

Cần **Node.js** (đã chạy thử với Node 24) và 2 API key (Gemini, Groq). Chạy 2 terminal riêng.

### Backend (cổng 5000)

```bash
cd backend
npm install
cp .env.example .env    # rồi điền GEMINI_API_KEY và GROQ_API_KEY
npm start               # hoặc: node server.js
```

Kiểm tra: `POST http://localhost:5000/api/generate-recipe` với body `{}` trả `400` kèm `{"error": ...}`.

### Frontend (cổng 5173)

```bash
cd frontend
npm install
cp .env.example .env    # tùy chọn: chỉ cần khi backend không chạy ở localhost:5000
npm run dev
```

Mở `http://localhost:5173`. Backend phải đang chạy thì bấm nút mới có dữ liệu.

## Biến môi trường

Chỉ ghi tên biến, **không commit giá trị thật**. File mẫu: `backend/.env.example`, `frontend/.env.example`.

| Biến | Nơi đặt | Bắt buộc | Mặc định | Ý nghĩa |
|---|---|---|---|---|
| `GEMINI_API_KEY` | `backend/.env` (và env của server khi deploy) | có | — | key cho Gemini |
| `GROQ_API_KEY` | `backend/.env` (và env của server khi deploy) | có | — | key cho Groq |
| `PORT` | env của server | không | `5000` | cổng backend; nền tảng deploy thường tự cấp |
| `RATE_LIMIT_MAX` | env của server | không | `10` | số request/phút/IP cho mỗi API AI |
| `VITE_API_URL` | `frontend/.env` (và env lúc **build** khi deploy) | không | `http://localhost:5000` | địa chỉ backend |

`VITE_API_URL` là biến **build-time**: đổi xong phải build lại frontend mới có tác dụng.

## Test, lint, build

```bash
# backend
cd backend
npm test          # 19 test (validate input, parse JSON, tách bước, CORS, rate limit)

# frontend
cd frontend
npm test          # 6 test (chuẩn hoá/tick/đổi tên nguyên liệu)
npm run lint      # eslint
npm run build     # xuất dist/
```

Không có test tự động cho UI: cần mở app và bấm thử thật.

## Giới hạn đã biết

- **Rate limit**: 10 request/phút/IP cho `/api/analyze-image` và `/api/generate-recipe`, dùng chung một bộ đếm; vượt thì trả `429` + `Retry-After`. Đổi bằng `RATE_LIMIT_MAX`.
- **Kích thước body**: tối đa `10mb`. Ảnh đã nén ở client nên thực tế nhỏ hơn nhiều; vượt thì `413`.
- **Quota Groq free tier**: khoảng 8000 token/phút, tương đương ~5 lần tạo công thức/phút. Vượt thì Groq trả `429`, `groqService` thử lại 3 lần rồi báo lỗi.
- **Gemini**: thử lại 2 lần khi gặp `429`/`503`.
- **Không có xác thực người dùng**: ai biết URL backend cũng gọi được API. CORS đang mở hoàn toàn (chỉ chặn được trình duyệt, không chặn `curl`).
- **Công thức bị cắt còn tối đa 5 bước** (`splitSteps`), vì layout chỉ có 5 ô.
- Nếu AI trả JSON không hợp lệ, backend trả `502` thay vì crash.
- Không lưu gì vào database: mọi thứ nằm trong state của trình duyệt, tải lại trang là mất.

## Deploy

- Backend deploy trên Render: `https://ai-meal-planner-backend-wvk9.onrender.com`
- Frontend là site tĩnh: `npm run build` rồi deploy thư mục `dist/`, nhớ đặt `VITE_API_URL` trỏ tới backend **trước khi build**.

## Ghi chú

- Không commit `.env`, key, `node_modules`, `dist`.
- UI text, prompt AI và comment trong code dùng tiếng Việt (riêng tên nguyên liệu/công thức do AI trả về là tiếng Anh theo prompt).
