import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fileToGenerativePart = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
        inlineData: {
          data: reader.result.split(',')[1],
          mimeType: file.type
        }
      });
      reader.readAsDataURL(file);
    });
  };

  const handleProcess = async () => {
    if (!image) return;
    setLoading(true);
    setRecipe(null);

    try {
      const imagePart = await fileToGenerativePart(image);

      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
      const prompt = `Hãy nhìn ảnh tủ lạnh này, liệt kê các nguyên liệu 
và gợi ý 1 món ăn. Trả về JSON hợp lệ (không có markdown), gồm: 
{"dishName": "", "ingredients": [], "instructions": []}`;

      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text();

      const cleanJson = text.replace(/```json|```/g, "").trim();
      setRecipe(JSON.parse(cleanJson));

    } catch (error) {
      console.error(error);
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '540px', margin: '0 auto' }}>
      <h1>🥗 AI Meal Planner</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <img src={preview} alt="Ảnh tủ lạnh"
          style={{ marginTop: 12, width: '100%', borderRadius: 8 }} />
      )}

      <br /><br />
      <button onClick={handleProcess} disabled={loading || !image}>
        {loading ? "AI đang suy nghĩ..." : "Gợi ý món ăn"}
      </button>

      {recipe && (
        <div style={{ marginTop: '20px' }}>
          <h2>Món: {recipe.dishName}</h2>
          <p><b>Nguyên liệu:</b> {recipe.ingredients.join(', ')}</p>
          <h3>Cách làm:</h3>
          <ol>
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;