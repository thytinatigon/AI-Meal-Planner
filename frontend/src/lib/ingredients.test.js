// File: src/lib/ingredients.test.js
// Chạy: cd frontend && npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeIngredients, toggleIngredient, renameIngredient } from "./ingredients.js";

test("normalizeIngredients: bỏ khoảng trắng, mục rỗng và mục trùng", () => {
  assert.deepEqual(
    normalizeIngredients(["  Trứng ", "", "Cà chua", "Trứng", "   "]),
    ["Trứng", "Cà chua"]
  );
});

test("normalizeIngredients: không phải mảng thì trả về mảng rỗng", () => {
  assert.deepEqual(normalizeIngredients(undefined), []);
  assert.deepEqual(normalizeIngredients("Trứng"), []);
});

test("toggleIngredient: bật mục chưa chọn", () => {
  assert.deepEqual(toggleIngredient(["Trứng"], "Cà chua"), ["Trứng", "Cà chua"]);
});

test("toggleIngredient: tắt mục đang chọn", () => {
  assert.deepEqual(toggleIngredient(["Trứng", "Cà chua"], "Trứng"), ["Cà chua"]);
});

test("renameIngredient: đổi đúng 1 vị trí, không đụng mục trùng tên", () => {
  assert.deepEqual(renameIngredient(["Trứng", "Cà chua"], "Trứng", "Trứng chín"), [
    "Trứng chín",
    "Cà chua",
  ]);
  assert.deepEqual(renameIngredient(["Trứng", "Trứng"], "Trứng", "Trứng chín"), [
    "Trứng chín",
    "Trứng",
  ]);
});

test("renameIngredient: không tìm thấy thì giữ nguyên danh sách", () => {
  const list = ["Trứng"];
  assert.equal(renameIngredient(list, "Cà chua", "X"), list);
});
