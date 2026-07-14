// File: src/App.jsx
import { useMealPlanner } from "./hooks/useMealPlanner";
import HeroSection from "./components/HeroSection";
import IngredientCheck from "./components/IngredientCheck";
import InstructionSteps from "./components/InstructionSteps";

export default function App() {
  const {
    imagePreview,
    loading,
    recipe,
    diet,
    setDiet,
    selectedIngredients,
    handleImageChange,
    handleProcess,
    toggleIngredient
  } = useMealPlanner();

  return (
    <main
      className="relative mx-auto min-h-[2432px] w-full min-w-[400px] max-w-[400px] overflow-hidden bg-white"
      data-model-id="23:16"
    >
      <HeroSection 
        onImageChange={handleImageChange} 
        onProcess={handleProcess} 
        loading={loading} 
        image={imagePreview}
      />

      {/* Chỉ hiển thị các phần dưới khi đã có kết quả từ AI */}
      <IngredientCheck 
        recipe={recipe} 
        diet={diet} 
        setDiet={setDiet} 
        selectedIngredients={selectedIngredients} 
        toggleIngredient={toggleIngredient} 
      />

      <InstructionSteps 
        recipe={recipe} 
      />
    </main>
  );
}