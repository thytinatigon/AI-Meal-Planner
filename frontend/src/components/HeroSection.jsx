// File: src/components/HeroSection.jsx
import { Button } from "./ui/button";

export default function HeroSection({ onImageChange, onProcess, loading }) {
  return (
    <section className="relative h-[660px] overflow-hidden bg-[#f8e4cc]">
      <div className="absolute inset-x-0 top-0 h-[611px] bg-[linear-gradient(180deg,rgba(255,255,255,0))]" />
      <img className="absolute inset-x-0 top-0 h-[700px] w-full" alt="Group" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/group-1.png" />
      
      <div className="absolute left-[291px] top-[29px] h-[171px] w-[171px] rounded-[85.5px]" />
      <img className="absolute left-[277px] top-[7px] h-[202px] w-[123px] object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-1.png" />
      <img className="absolute left-[258px] top-5 h-[86px] w-[88px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-1.svg" />
      <img className="absolute left-[14px] top-0 h-[84px] w-[86px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-3.svg" />
      <img className="absolute left-0 top-[418px] h-[276px] w-[157px] object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-2.png" />
      <img className="absolute left-0 top-0 h-[194px] w-[244px] object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-3.png" />
      <img className="absolute left-[129px] top-[47px] h-16 w-[60px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-4.svg" />
      <img className="absolute left-[166px] top-[583px] h-[85px] w-[86px]" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-3.svg" />
      <img className="absolute left-[188px] top-[467px] h-[296px] w-[212px] object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-4.png" />

      <header className="absolute inset-x-0 top-[167px] z-10 flex justify-center">
        <h1 className="h-[71px] whitespace-nowrap text-center text-6xl font-normal leading-[normal] tracking-tight">
          LET&#39;S COOK!
        </h1>
      </header>

      <div className="absolute left-1/2 top-[246px] h-[245px] w-[303px] -translate-x-1/2">
        <div className="absolute left-[3px] top-[5px] h-[235px] w-[297px] rotate-[-1.84deg] bg-[#ff0000]" />
        <img className="absolute left-[15px] top-[13px] h-[220px] w-[277px] object-cover" alt="Rectangle" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-26.svg" />
      </div>
      <img className="absolute left-[86px] top-[265px] h-[210px] w-[231px] object-cover" alt="Anh chup man hinh" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/a-nh-chu-p-ma-n-hi-nh-2026-06-26-lu-c-21-13-07-1.png" />

      <div className="absolute left-1/2 top-[512px] -translate-x-1/2 flex flex-col items-center gap-3">
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          onChange={onImageChange} 
          className="w-[200px] text-sm"
        />
        <Button type="button" onClick={onProcess} disabled={loading} className="rounded-[20px] bg-black px-5 py-[3px] text-white">
          {loading ? "AI ĐANG NGHĨ..." : "UPLOAD & COOK"}
        </Button>
      </div>

      <img className="absolute right-0 top-[407px] h-[61px] w-14" alt="Star" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/star-8.svg" />
    </section>
  );
}