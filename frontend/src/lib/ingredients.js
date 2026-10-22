// File: src/lib/ingredients.js
// Các hàm thuần xử lý danh sách nguyên liệu (dùng trong hook + test)

/** Bỏ khoảng trắng, mục rỗng và mục trùng */
export const normalizeIngredients = (list) =>
  [
    ...new Set(
      (Array.isArray(list) ? list : [])
        .map((item) => String(item ?? "").trim())
        .filter(Boolean)
    ),
  ];

/** Bật/tắt một nguyên liệu trong danh sách đã chọn */
export const toggleIngredient = (list, item) =>
  list.includes(item) ? list.filter((value) => value !== item) : [...list, item];

/** Đổi tên nguyên liệu (đúng 1 vị trí, không đụng mục trùng tên khác) */
export const renameIngredient = (list, oldItem, newValue) => {
  const index = list.indexOf(oldItem);
  if (index === -1) return list;
  const next = [...list];
  next[index] = newValue;
  return next;
};
