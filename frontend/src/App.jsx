// File: src/App.jsx
import { useMealPlanner } from "./hooks/useMealPlanner";
import HeroSection from "./components/HeroSection";
import IngredientCheck from "./components/IngredientCheck";
import InstructionSteps from "./components/InstructionSteps";

export default function App() {
  // Đã dọn dẹp sạch sẽ: Xóa các biến bị lặp lại và dùng đúng tên biến 'image'
  const {
    image, // Sửa 'imagePreview' thành 'image' cho đúng với useMealPlanner
    imagePreview,
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
  } = useMealPlanner();

  return (
    <main
      className="relative mx-auto w-full min-w-100 max-w-100 overflow-hidden bg-white"
      data-model-id="23:16"
    >
      {/* 
        Đã truyền đúng các prop mà HeroSection mới yêu cầu: 
        onImageChange, onProcess, loading, image 
      */}
      <HeroSection 
        onImageChange={handleImageChange} 
        onProcess={handleProcess} 
        loading={loading}
        image={imagePreview}
      />

      {/* HIỆN BƯỚC 1: KHI ĐÃ QUÉT ĐƯỢC NGUYÊN LIỆU (Chưa cần có recipe) */}
      {detectedIngredients && (
        <IngredientCheck 
          detectedIngredients={detectedIngredients} 
          diet={diet} 
          setDiet={setDiet} 
          selectedIngredients={selectedIngredients} 
          toggleIngredient={toggleIngredient} 
          onCookClick={handleStartCooking}
          updateIngredient={updateIngredient}
          addIngredient={addIngredient}
        />
      )}

      {/* HIỆN BƯỚC 2: KHI ĐÃ CÓ RECIPE *VÀ* CỜ SHOW_INSTRUCTIONS BẬT LÊN */}
      {recipe && showInstructions && (
        <InstructionSteps 
          recipe={recipe} 
        />
      )}
      
    </main>
  );
}