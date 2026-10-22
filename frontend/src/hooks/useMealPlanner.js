// File: src/hooks/useMealPlanner.js
import { useState } from "react";
import { normalizeIngredients, toggleIngredient as toggleInList, renameIngredient } from "../lib/ingredients";

// Đổi backend mà không sửa code: đặt VITE_API_URL trong frontend/.env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Lấy thông báo lỗi của server (backend trả { error: "..." }) để hiện cho người dùng
const readServerError = async (response, fallback) => {
  const data = await response.json().catch(() => null);
  return data?.error || fallback;
};

export const useMealPlanner = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [cooking, setCooking] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [diet, setDiet] = useState("ăn mặn");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);


  // const [detectedIngredients, setDetectedIngredients] = useState(MOCK_DATA); 
  // const [selectedIngredients, setSelectedIngredients] = useState(MOCK_DATA);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Bạn hãy chọn đúng file ảnh nhé!");
      e.target.value = ""; // Cho phép chọn lại cùng file sau khi báo lỗi
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // HÀM fileToBase64
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // Không có onerror thì Promise treo mãi, nút GENERATE kẹt "..." vĩnh viễn
      reader.onerror = () => reject(new Error("Không đọc được file ảnh!"));
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.onerror = () => reject(new Error("Ảnh không hợp lệ hoặc không được trình duyệt hỗ trợ!"));
        img.src = event.target.result;
        
        img.onload = () => {
          // Tạo một khung vẽ Canvas ẩn
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Tính toán tỷ lệ để thu nhỏ ảnh (Tối đa 800px)
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          // Vẽ ảnh đã thu nhỏ lên Canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Xuất ảnh ra định dạng JPEG với chất lượng 70% (0.7)
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
          
          // Trả về chuỗi Base64 y hệt như cũ để khớp với Backend
          resolve({
            imageBase64: compressedDataUrl.split(",")[1],
            mimeType: "image/jpeg",
          });
        };
      };
    });
  };

  const handleProcess = async () => {
    // Vẫn giữ check ảnh để UI logic không bị lỗi
    if (!image) {
      alert("Bạn hãy chọn 1 tấm ảnh tượng trưng để test nhé!");
      return;
    }
    
    setLoading(true);
    setDetectedIngredients(null);
    setRecipe(null);
    setShowInstructions(false);

    try {
      const imageData = await compressImage(image);
      const response = await fetch(`${API_URL}/api/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) throw new Error(await readServerError(response, "Lỗi từ server"));

      const data = await response.json();
      // Bỏ mục rỗng và mục trùng trước khi hiện ra danh sách
      const ingredients = normalizeIngredients(data.ingredients);
      setDetectedIngredients(ingredients);
      setSelectedIngredients(ingredients);
    } catch (error) {
      console.error(error);
      alert(error.message || "Lỗi nhận diện ảnh!");
    } finally {
      setLoading(false);
    }
  };

    // ==========================================
    // ✅ DÙNG MOCK DATA (DỮ LIỆU GIẢ LẬP) ĐỂ TEST UI
    // ==========================================
    // setTimeout(() => {
    //   const mockIngredients = [
    //     "Rau xà lách", "Trứng", "Quả cam", "Dâu tây", "Quả táo",
    //     "Ớt chuông", "Cà chua", "Cà tím", "Nấm", "Hành lá", "Sữa",
    //     "Quả bơ", "Súp lơ xanh", "Quả chanh", "Rau mùi", "Thịt",
    //     "Cà rốt", "Dưa chuột", "Khoai tây"
    //   ];
      
    //   setDetectedIngredients(mockIngredients);
    //   setSelectedIngredients(mockIngredients); // Tự động tick chọn hết
    //   setLoading(false);
    // }, 1500);   

  // Hiện khi bấm nút Cook
  const handleStartCooking = async () => {
    // Bỏ mục rỗng (người dùng xoá hết chữ) và mục trùng trước khi gửi AI
    const finalIngredients = normalizeIngredients(selectedIngredients);
    if (finalIngredients.length === 0) return alert("Hãy chọn ít nhất 1 nguyên liệu!");
    setCooking(true);
    
    try {
      const response = await fetch(`${API_URL}/api/generate-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalIngredients, diet }),
      });
      if (!response.ok) throw new Error(await readServerError(response, "Lỗi Server"));
      
      const data = await response.json();
      setRecipe(data);
      setShowInstructions(true);
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert(error.message || "Đầu bếp AI đang bận!");
    } finally {
      setCooking(false);
    }
  };

  const toggleIngredient = (item) => {
    setSelectedIngredients((prev) => toggleInList(prev, item));
  };

  // HÀM MỚI: Cập nhật chữ trực tiếp khi người dùng gõ
  const updateIngredient = (index, newValue) => {
    if (!detectedIngredients) return;
    const oldItem = detectedIngredients[index];
    setDetectedIngredients((prev) =>
      prev.map((value, i) => (i === index ? newValue : value))
    );
    // Chỉ đổi đúng 1 vị trí, không đụng các mục trùng tên khác
    setSelectedIngredients((prev) => renameIngredient(prev, oldItem, newValue));
  };

  // HÀM MỚI: Thêm nguyên liệu (không thêm trùng tên đã có)
  const addIngredient = (newItem) => {
    const item = newItem.trim();
    if (!item) return;
    setDetectedIngredients((prev) => (prev.includes(item) ? prev : [...prev, item]));
    setSelectedIngredients((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  return {
    loading,
    imagePreview,
    recipe,
    cooking,
    detectedIngredients,
    diet,
    setDiet,
    selectedIngredients,
    showInstructions,
    handleImageChange,
    handleProcess,
    toggleIngredient,
    handleStartCooking,
    updateIngredient,
    addIngredient
  };
};