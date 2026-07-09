// File: src/components/InstructionSteps.jsx
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

export default function InstructionSteps({ recipe }) {
  return (
    <section className="relative h-[786px] bg-[#5f7d23] overflow-y-auto pb-10">
      <img className="absolute inset-0 h-full w-full object-cover" alt="Frame" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/frame-9.svg" />
      <img className="absolute left-[65px] top-[159px] h-[25px] w-9 object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-6.png" />
      <img className="absolute left-[59px] top-[206px] h-12 w-12 object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-7.png" />
      
      <Card className="absolute left-1/2 top-[45px] w-[320px] -translate-x-1/2 rounded-none border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="mx-auto w-[273px]">
            <header className="mb-3 pt-[14px] text-center">
              <h2 className="text-[28px] font-normal leading-8 tracking-[1.12px] text-black">
                {recipe ? recipe.dishName.toUpperCase() : "NAME OF\nTHE DISH"}
              </h2>
              {recipe && (
                <p className="text-[#ffe181] font-bold text-lg mt-2 tracking-widest drop-shadow-md">
                  🔥 {recipe.calories}
                </p>
              )}
            </header>
            
            <img className="mb-6 h-px w-[273px]" alt="Line" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/line-6.svg" />
            <img className="mb-4 h-px w-[273px]" alt="Line" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/line-7.svg" />
            
            <ol className="space-y-[22px] relative z-10">
              {recipe && recipe.instructions ? (
                recipe.instructions.map((stepText, index) => {
                  const bgRectangles = [
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-38.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-39.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-40.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-41.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-42.svg"
                  ];
                  const rectSrc = bgRectangles[index % bgRectangles.length];
                  
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <div className="relative h-[53px] w-[52px] shrink-0">
                        <img className="h-full w-full" alt="Rectangle" src={rectSrc} />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <p className="mt-1 w-[211px] font-sans text-[15px] font-medium text-white leading-relaxed drop-shadow-sm">
                        {stepText}
                      </p>
                    </li>
                  );
                })
              ) : (
                <li className="text-white text-center italic mt-10">Đang chờ AI lên thực đơn...</li>
              )}
            </ol>
            
            <Separator className="mt-5 bg-transparent" />
            <p className="mt-4 text-center text-xl font-bold leading-8 tracking-[0.72px] text-[#ffe181] drop-shadow-md pb-10">
              hope you make it! 👩‍🍳
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}