// File: src/components/HeroSection.jsx
import { Button } from "./ui/button";
import { useRef } from "react";

export default function HeroSection({ onImageChange, onProcess, loading, image }) {   
  const fileInputRef = useRef(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section className="relative h-[660px] overflow-hidden bg-[#f8e4cc]">
      <div className="absolute inset-x-0 top-0 h-[611px] bg-[linear-gradient(180deg,rgba(255,255,255,0))]" />
      <img className="absolute inset-x-0 top-0 h-[700px] w-full" alt="Group" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/group-1.png" />
      
      <div className="absolute left-[291px] top-[29px] h-[171px] w-[171px] rounded-[85.5px]" />
      
      {/* Yêu cầu 3: image-1 giới hạn chiều cao hiển thị 124px */}
      <img className="absolute left-[277px] top-[7px] h-[202px] w-[202px] object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-1.png" />
      
      <img className="absolute left-[258px] top-5 h-[86px] w-[88px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-1.svg" />
      <img className="absolute left-[14px] top-0 h-[84px] w-[86px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-3.svg" />
      
      {/* Yêu cầu 4: image-2 rộng 206.65px và nghiêng -9.63 độ */}
      <img className="absolute left-[-100px] top-[418px] h-[206px] w-[206.65px] rotate-[7deg] object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-2.png" />
      
      {/* Yêu cầu 2: image-3 nghiêng 24.77 độ */}
      <img className="absolute left-[-28px] top-0 h-[131px] w-[240px] rotate-[-24.77deg] object-cover drop-shadow-[-1px_4px_10px_rgba(0,0,0,0.2)]" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-3.png" />
      
      <img className="absolute left-[129px] top-[47px] h-16 w-[60px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-4.svg" />
      <img className="absolute left-[166px] top-[563px] h-[85px] w-[86px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-3.svg" />
      
      <img className="absolute left-[210px] top-[460px] h-[250px] w-[250px] object-cover drop-shadow-[-1px_4px_10px_rgba(0,0,0,0.2)]" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-4.png" />

      <header className="absolute inset-x-0 top-[170px] z-10 flex justify-center">
        <h1
          className="h-[71px] whitespace-nowrap text-center text-[60px] font-normal leading-none tracking-normal text-black [font-family:'Londrina_Solid',sans-serif]"
          style={{
            WebkitTextStroke: "7px #fff",
            paintOrder: "stroke fill",
          }}
        >
          LET&#39;S COOK!
        </h1>
      </header>

      <div className="absolute left-1/2 top-[242px] h-[245px] w-[303px] -translate-x-1/2">
        {/* 1. Red background - Thêm hiệu ứng to lên 20% (scale-[1.2]) nếu có ảnh */}
        <div className={`absolute left-1/2 top-[3px] h-[196px] w-[266px] -translate-x-1/2 rotate-[-1.84deg] bg-[#ff0000] transition-transform duration-500 ease-in-out ${image ? "scale-[1.15]" : ""}`} />

        {/* 2. Content card - Cùng to lên 20% để kéo theo rectangle-26 */}
        <div className={`absolute left-1/2 top-[12px] flex h-[174px] w-[250px] -translate-x-1/2 flex-col items-center justify-center overflow-hidden bg-[#F8E4CC] px-5 text-center transition-transform duration-500 ease-in-out ${image ? "scale-[1.15] px-0" : ""}`}>
          
          {/* Texture overlay */}
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-100"
            src="https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-26.svg"
            alt=""
          />

          {/* 3. Logic hiển thị: Nếu CHƯA có ảnh thì hiện chữ, CÓ ảnh thì hiện ảnh */}
          {!image ? (
            <div className="relative z-10">
              <p className="whitespace-pre-line text-[18px] leading-[1.3] text-black [font-family:'Chelsea_Market',cursive]">
                {`Staring blankly at
                the open fridge?
                We’ve got you.`}
              </p>

              <p className="mt-[10px] whitespace-pre-line text-[14px] leading-[16px] text-black [font-family:'DM_Sans',sans-serif]">
                {`Turn your random ingredients
                into a delicious meal in seconds.
                Snap a photo, and let's cook.`}
              </p>
            </div>
          ) : (
            <div className="relative z-10 flex h-full w-full items-center justify-center p-3">
              {/* Ảnh upload được viền trắng, căn giữa */}
              <img 
                src={image} 
                alt="Uploaded fridge" 
                className="h-full w-full object-cover border-[3px] border-white"
              />
            </div>
          )}
          
        </div>
      </div>

      <div className="absolute left-1/2 top-[485px] -translate-x-1/2 flex flex-col items-center gap-3">
  
        {/* 1. THẺ INPUT: Đã thêm ref và giấu đi bằng class "hidden" */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={onImageChange} 
          ref={fileInputRef} 
          className="hidden" 
        />

        {/* 2. NÚT CHỌN ẢNH: Đóng vai trò là cái "điều khiển từ xa" cho thẻ input */}
        {!image ? (
          /* TRƯỜNG HỢP 1: CHƯA CÓ ẢNH -> Chỉ hiện 1 nút UPLOAD */
          <Button 
            type="button" 
            onClick={triggerFileInput} 
            className="flex h-[36px] w-[130px] items-center justify-center rounded-[20px] bg-black text-[22px] tracking-[0.04em] text-white [font-family:'Chelsea_Market',cursive] hover:bg-gray-800"
          >
            UPLOAD
          </Button>
        ) : (
          /* TRƯỜNG HỢP 2: ĐÃ CÓ ẢNH -> Hiện 2 nút REUPLOAD và GENERATE ngang nhau */
          <div className="flex flex-row gap-4">
            {/* Nút Reupload (chọn lại ảnh) */}
            <Button 
              type="button" 
              onClick={triggerFileInput} 
              className="flex h-[36px] w-[140px] items-center justify-center rounded-[20px] bg-black text-[22px] tracking-[0.04em] text-white [font-family:'Chelsea_Market',cursive] hover:bg-gray-800"
            >
              REUPLOAD
            </Button>

            {/* Nút Generate (gọi AI) */}
            <Button 
              type="button" 
              onClick={onProcess} 
              disabled={loading} 
              className="flex h-[36px] w-[140px] items-center justify-center rounded-[20px] bg-black text-[22px] tracking-[0.04em] text-white [font-family:'Chelsea_Market',cursive] hover:bg-gray-800"
            >
              {loading ? "..." : "GENERATE"}
            </Button>
          </div>
        )}
      </div>

      <img className="absolute right-0 top-[407px] h-[61px] w-14" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-8.svg" />
    </section>
  );
}