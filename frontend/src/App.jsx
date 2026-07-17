// File: src/App.jsx
import { useMealPlanner } from "./hooks/useMealPlanner";
import HeroSection from "./components/HeroSection";
import IngredientCheck from "./components/IngredientCheck";
import InstructionSteps from "./components/InstructionSteps";

export default function App() {
  const {
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
      className="relative mx-auto w-full min-w-[400px] max-w-[400px] overflow-hidden bg-white"
      data-model-id="23:16"
    >
      <HeroSection 
        onImageChange={handleImageChange} 
        onProcess={handleProcess} 
        loading={loading} 
      />

      {/* HIỆN BƯỚC 1: KHI ĐÃ QUÉT ĐƯỢC NGUYÊN LIỆU (Chưa cần có recipe) */}
      {detectedIngredients && (
        <IngredientCheck 
          // Truyền danh sách quét được vào để giao diện hiển thị
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