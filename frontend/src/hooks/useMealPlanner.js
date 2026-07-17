// File: src/hooks/useMealPlanner.js
import { useState } from "react";

const MOCK_DATA = [
  "Lettuce", "Eggs", "Orange", "Strawberry", "Apple",
  "Bell Pepper", "Tomato", "Eggplant", "Mushroom", "Green Onion", "Milk",
  "Avocado", "Broccoli", "Lemon", "Cilantro", "Meat",
  "Carrot", "Cucumber", "Potato"
];

export const useMealPlanner = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooking, setCooking] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [diet, setDiet] = useState("ăn mặn");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);

  // const [detectedIngredients, setDetectedIngredients] = useState(MOCK_DATA); 
  // const [selectedIngredients, setSelectedIngredients] = useState(MOCK_DATA);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  // HÀM fileToBase64
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
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
      const response = await fetch("http://localhost:5000/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) throw new Error("Lỗi từ server");

      const data = await response.json();
      setDetectedIngredients(data.ingredients);
      setSelectedIngredients(data.ingredients);
    } catch (error) {
      console.error(error);
      alert("Lỗi nhận diện ảnh!");
    } finally {
      setLoading(false);
    }
    

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
  };  

  // Hiện khi bấm nút Cook
  const handleStartCooking = async () => {
    if (selectedIngredients.length === 0) return alert("Hãy chọn ít nhất 1 nguyên liệu!");
    setCooking(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalIngredients: selectedIngredients, diet }),
      });
      if (!response.ok) throw new Error("Lỗi Server");
      
      const data = await response.json();
      setRecipe(data);
      setShowInstructions(true);
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      alert("Đầu bếp AI đang bận!");
    } finally {
      setCooking(false);
    }
  };

  const toggleIngredient = (item) => {
    if (item === "Add more") return;
    setSelectedIngredients((prev) =>
      prev.includes(item)
        ? prev.filter((value) => value !== item)
        : [...prev, item]
    );
  };

  // HÀM MỚI: Cập nhật chữ trực tiếp khi người dùng gõ
  const updateIngredient = (index, newValue) => {
    const oldItem = detectedIngredients[index];
    setDetectedIngredients((prev) => {
      const newList = [...prev];
      newList[index] = newValue;
      return newList;
    });
    setSelectedIngredients((prev) => 
      prev.map((val) => (val === oldItem ? newValue : val))
    );
  };

  // HÀM MỚI: Thêm nguyên liệu
  const addIngredient = (newItem) => {
    if (!newItem.trim()) return; 
    setDetectedIngredients((prev) => [...prev, newItem]);
    setSelectedIngredients((prev) => [...prev, newItem]);
  };

  return {
    image,
    loading,
    recipe,
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