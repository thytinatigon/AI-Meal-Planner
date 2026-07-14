// File: src/hooks/useMealPlanner.js
import { useState } from "react";

export const useMealPlanner = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [diet, setDiet] = useState("ăn mặn");
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); 
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const fileToBase64 = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve({
          imageBase64: reader.result.split(",")[1],
          mimeType: file.type,
        });
      reader.readAsDataURL(file);
    });
  };

  const handleProcess = async () => {
    if (!image) {
      alert("Bạn chưa chọn ảnh nào!");
      return;
    }
    setLoading(true);

    try {
      const imageData = await fileToBase64(image);
      const response = await fetch("http://localhost:5000/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...imageData, diet }),
      });

      if (!response.ok) throw new Error("Lỗi từ server");

      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, kiểm tra lại Backend nhé!");
    } finally {
      setLoading(false);
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

  return {
    image,
    imagePreview,
    loading,
    recipe,
    diet,
    setDiet,
    selectedIngredients,
    handleImageChange,
    handleProcess,
    toggleIngredient
  };
};