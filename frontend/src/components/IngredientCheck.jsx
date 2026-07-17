// File: src/components/IngredientCheck.jsx
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

const stripes = Array.from({ length: 5 }, (_, index) => index);
const decorativeStars = [
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-10.svg", alt: "Star", className: "absolute top-[278px] left-[-16px] w-[90px] h-[92px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-10.svg", alt: "Star", className: "absolute top-[84px] right-[-10px] w-[90px] h-[92px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-10.svg", alt: "Star", className: "absolute top-[398px] right-0 w-[90px] h-[92px] z-10" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-5.svg", alt: "Star", className: "absolute top-[9px] left-0 w-[80px] h-[110px] z-10" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-17.svg", alt: "Star", className: "absolute top-[1px] left-[49px] w-[42px] h-11" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-17.svg", alt: "Star", className: "absolute top-[180px] right-[10px] w-[42px] h-11" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-18.svg", alt: "Star", className: "absolute top-[360px] left-0 w-10 h-[39px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-22.svg", alt: "Star", className: "absolute top-[26px] right-[40px] w-[49px] h-[51px] z-10" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-22.svg", alt: "Star", className: "absolute top-[148px] right-[-24px] w-[58px] h-[51px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-13.svg", alt: "Star", className: "absolute top-[252px] left-[-4px] w-[50px] h-12" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-13.svg", alt: "Star", className: "absolute top-[426px] left-[34px] w-[51px] h-12 z-10" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-15.svg", alt: "Star", className: "absolute top-[-10px] left-[-16px] w-[49px] h-[51px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-21.svg", alt: "Star", className: "absolute top-[736px] left-[10px] w-[89px] h-[90px] z-10" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-22.svg", alt: "Star", className: "absolute top-[600px] right-[28px] w-[49px] h-[51px] z-10" }
];

// FIX 1: Đổi 'recipe' thành 'detectedIngredients'
export default function IngredientCheck({ 
  detectedIngredients, diet, setDiet, selectedIngredients, 
  toggleIngredient, onCookClick, updateIngredient, addIngredient
}) {
  const [ghostText, setGhostText] = useState("");
  const handleGhostSubmit = () => {
    if (ghostText.trim()) {
      addIngredient(ghostText.trim()); // Đẩy lên mảng thật
      setGhostText(""); // Reset dòng bóng ma về rỗng để nhường chỗ cho món tiếp theo
    }
  };

  return (
    <section className="relative h-[986px] object-cover">
      <img className="absolute top-[-70px] left-[-14px] h-full w-full" alt="Rectangle" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-33.svg" />
      <div className="absolute left-[18px] w-full flex items-stretch gap-9">
        {stripes.map((stripe) => (
          <div key={`stripe-${stripe}`} className="h-[872px] w-[50px] bg-[#ff0000]" />
        ))}
      </div>
      <img className="absolute top-[-18px] left-[18px] h-[21px] w-[378px]" alt="Group" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/group-7.png" />
      
      <img className="absolute left-[192px] h-[84px] -translate-x-1/2 rotate-[-5deg] shadow-[0_4px_4px_-2px_rgba(0,0,0,0.3)] object-cover z-10" alt="Clipped image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/clipped-image-20260703-232401-1.png" />
      
      {decorativeStars.map((star, index) => (
        <img key={`decorative-star-${index}`} className={star.className} alt={star.alt} src={star.src} />
      ))}


      <Card className="absolute left-1/2 top-[70px] w-[303px] -translate-x-1/2 border-0 bg-transparent shadow-none">
        <CardContent className="relative h-[411px] p-0">
          <div className="absolute top-[-14px] h-[395px] w-[297px] rotate-[-2deg] bg-[#3e740f]" />
          
          <div className="relative ml-[12px] h-[369px] w-[270px] bg-cover bg-center"
              style={{backgroundImage:"url(https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-26.svg)",
          }}>
            <div className="inset-x-0 pt-[24px] w-full text-center px-4 z-10">
              <h2 className="text-[28px] font-normal leading-8 tracking-[1.12px] text-black font-chelsea">
                INGREDIENT<br />CHECK
              </h2>
            </div>

            {/* KHU VỰC CHỨA NGUYÊN LIỆU */}
            <ul className="w-full flex flex-col px-[20px] mt-[6px] max-h-[252px] overflow-y-auto z-10">
              {detectedIngredients && detectedIngredients.length > 0 ? (
                // BẮT BUỘC dùng index thay vì item để làm key, giúp ô nhập liệu không bị mất focus khi gõ
                detectedIngredients.map((item, index) => {
                  const selected = selectedIngredients.includes(item);
                  
                  return (
                    <li key={index} className="mb-1 border-b-[0.2px] border-black pl-[14px] pb-[2px]">
                      <div className="flex w-full items-center gap-2">
                        {/* Phần 1: Nút bấm riêng biệt chỉ dùng để check/uncheck */}
                        <button 
                          type="button" 
                          onClick={() => toggleIngredient(item)} 
                          className="flex-shrink-0 mt-[4px]"
                        >
                          <span className={`block h-2 w-2 rounded ${selected ? "bg-[#3e740f]" : "bg-[#9ea298]"}`} />
                        </button>
                        
                        {/* Phần 2: Ô Input thuần túy để người dùng gõ/sửa thoải mái */}
                        <input 
                          type="text"
                          value={item}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          className="font-sans text-[20px] font-normal leading-[normal] text-black bg-transparent border-none outline-none w-full"
                        />
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="font-sans text-[16px] text-gray-500 italic">Đang chờ nguyên liệu...</li>
              )}

              {/* Dòng Add more */}
              {detectedIngredients && (
              <li className="mb-1 border-b-[0.2px] border-black pl-[14px] pb-[2px]">
                <div className="flex w-full items-center gap-2 opacity-50 focus-within:opacity-100 transition-opacity">
                  <div className="flex-shrink-0 mt-[4px] flex items-center justify-center h-2 w-2 rounded border-[0.5px] border-dashed border-black"></div>
                  <input 
                    type="text"
                    value={ghostText}
                    onChange={(e) => setGhostText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGhostSubmit()}
                    onBlur={handleGhostSubmit}
                    placeholder="Add more..."
                    className="font-sans text-[20px] font-normal leading-[normal] text-black bg-transparent border-none outline-none w-full italic placeholder:text-gray-700"
                  />
                </div>
              </li>
            )}
            </ul>
          </div>
          
        </CardContent>
      </Card>


      {/* KHU VỰC NOTE & DIET */}
      <div className="absolute left-14 top-[500px] h-[292px] w-[292px] rotate-2 bg-[#ffe181]">
        <div className="absolute top-[-50px] left-[130px]">
          <img className="h-[90px] object-cover z-10" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-5.png" />
          <div className="absolute bottom-[5px] left-[5px] h-2 w-2 rounded-sm bg-[#54250b33]" />
        </div>
        <div className="mt-[40px] whitespace-nowrap text-center font-chelsea text-3xl tracking-widest">NOTE</div>
        
        <div className="flex w-full mt-[10px] px-[30px] flex-col gap-3 z-10">
          {["ăn mặn", "ăn chay"].map((item) => {
            const checked = diet === item;
            
            return (
              <button key={item} type="button" onClick={() => setDiet(item)} className="flex items-center text-left gap-3 group">
                
                <div className="relative flex h-6 w-6 items-center justify-center">
                  {/* 1. Thay <Checkbox> bằng 1 cái <div> bình thường vẽ viền đứt khúc */}
                  <div className={`h-6 w-6 border-black border-dashed ${checked ? 'border' : 'border'}`}></div>
                  
                  {/* 2. Giữ nguyên dấu tick xanh lá tự vẽ */}
                  {checked && (
                    <span className="pointer-events-none absolute text-[40px] leading-none text-[#4e9f08] -mt-2">
                      ✓
                    </span>
                  )}
                </div>
                
                <span className="font-sans text-[22px] font-normal leading-[normal] capitalize text-black group-hover:opacity-80 transition-opacity">
                  {item === "ăn mặn" ? "Thịt/Cá" : "Ăn Chay"}
                </span>
                
              </button>
            );
          })}
        </div>
      </div>
      

      <Button type="button" 
        onClick={onCookClick} 
        className="absolute left-1/2 top-[815px] -translate-x-1/2 rounded-[18px] bg-black px-7 py-2 text-white text-xl tracking-wide font-chelsea hover:bg-gray-800 transition-all z-20 shadow-lg">
        COOK
      </Button>
    </section>
  );
}