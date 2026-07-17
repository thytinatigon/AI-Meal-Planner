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
      <img className="absolute inset-x-0 top-0 h-[700px] w-full" alt="Group" 
        src="https://c.animaapp.com/mr98ygdi58TZ2c/img/group-1.png" />
      
      <div className="absolute left-[291px] top-[29px] h-[171px] w-[171px] rounded-[85.5px]" />
      
      {/*image-1*/}
      <div className="absolute left-[277px] top-[7px] h-[202px] w-[202px]">
        <img
          className="h-full w-full object-cover"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-1.png"
          alt="Image"
        />
        <img
          className="absolute left-[-19px] top-[13px] h-[86px] w-[88px]"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-1.svg"
          alt="Star"
        />
      </div>
      
      {/*image-2*/}
      <div className="absolute left-[-95px] top-[418px] h-[206px] w-[206px]">
        <img
          className="absolute left-[76px] top-[-40px]"
          src="/svg/Star 2.svg"
          alt="Star"
        />
        <img
          className="h-full w-full rotate-[15deg] object-cover drop-shadow-[-1px_4px_10px_rgba(0,0,0,0.2)]"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-2.png"
          alt="Image"
        />
      </div>  
      
      {/*image-3*/}
      <div className="absolute left-[-28px] top-0 h-[131px] w-[240px]">
        <img
          className="absolute left-[42px] top-0 h-[84px] w-[86px]"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-3.svg"
          alt=""
        />
        <img
          className="h-full w-full rotate-[-24.77deg] object-cover drop-shadow-[-1px_4px_10px_rgba(0,0,0,0.2)]"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-3.png"
          alt="Image"
        />
        <img
          className="absolute left-[157px] top-[47px] h-16 w-[60px]"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-4.svg"
          alt=""
        />
      </div>

      {/*image-4*/}
      <div className="absolute left-[210px] top-[460px] h-[250px] w-[250px]">
        <img
          className="absolute left-[-44px] top-[103px] h-[85px] w-[86px]"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-3.svg"
          alt=""
        />

        <img
          className="h-full w-full object-cover drop-shadow-[-1px_4px_10px_rgba(0,0,0,0.2)]"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-4.png"
          alt="Image"
        />

        <img
          className="absolute left-[117px] top-[10px]"
          src="/svg/Star 7.svg"
          alt=""
        />
      </div>

      <header className="absolute inset-x-0 top-[140px] z-10 flex justify-center">
        <h1
          className="text-center text-[54px] font-normal leading-[47px] text-black [font-family:'Slackey',cursive]"
          style={{
            WebkitTextStroke: "0.5px #FFFFFF",
            paintOrder: "stroke fill",
          }}
        >
          Let's<br />CooK!
        </h1>
      </header>

      <div className="absolute left-1/2 top-[242px] w-[303px] -translate-x-1/2">
        {/* Star trái */}
        <img
          className="absolute left-[-28px] top-[-42px]"
          src="/svg/Star 5.svg"
          alt="Star"
        />

        {/* Star phải */}
        <img
          className="absolute right-[-18px] bottom-[8px] h-[61px] w-14"
          src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-8.svg"
          alt="Star"
        />

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

    </section>
  );
}