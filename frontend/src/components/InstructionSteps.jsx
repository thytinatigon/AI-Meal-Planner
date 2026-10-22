// File: src/components/InstructionSteps.jsx
import { Card, CardContent } from "./ui/card";

const bgRectangles = [
  "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-38.svg",
  "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-39.svg",
  "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-40.svg",
  "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-41.svg",
  "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-42.svg",
];

export default function InstructionSteps({ recipe }) {
  // AI có thể trả sai kiểu => chuẩn hoá trước để không làm màn hình trắng
  const steps = (recipe?.instructions ?? []).filter(
    (step) => typeof step === "string" && step.trim()
  );
  const dishName = recipe?.dishName ? String(recipe.dishName) : "";

  return (
    <section className="relative min-h-screen bg-[#5f7d23] py-10">
      {/* Frame 9 */}
      <img
        src="/svg/Frame 9.svg"
        alt="Frame"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Center */}
      <div className="relative z-10 mx-auto h-[705px] w-[320px]">
        {/* Rectangle 37 */}
        <img
          src="/svg/Rectangle 37.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-fill"
          loading="lazy"
        />

        <Card className="relative rounded-none border-0 bg-transparent shadow-none">
          <CardContent className="relative flex min-h-[705px] flex-col p-0">
            {/* Header */}
            <header className="px-6 pt-8 text-center">
              <h2 className="whitespace-pre-line text-[28px] leading-8 tracking-[1.12px] text-black [font-family:'Chelsea_Market',cursive]">
                {dishName ? dishName.toUpperCase() : "NAME OF\nTHE DISH"}
              </h2>

              {recipe?.calories ? (
                <p className="mt-2 text-[20px] tracking-widest text-black [font-family:'Chelsea_Market',cursive]">
                  {String(recipe.calories)}
                </p>
              ) : null}
            </header>

            {/* Divider */}
            <div className="mx-auto mt-5 h-px w-[273px] bg-black" />

            {/* Icons */}
            <div className="mt-4 flex items-center justify-center gap-6">
              {/* YouTube */}
              {recipe?.youtubeLink ? (
                <a
                  href={recipe.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-[25px] w-9 cursor-pointer object-cover transition-transform hover:scale-110"
                    src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-6.png"
                    alt="YouTube"
                  />
                </a>
              ) : (
                <img
                  className="h-[25px] w-9 object-cover opacity-50 grayscale"
                  src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-6.png"
                  alt="YouTube placeholder"
                />
              )}

              {/* TikTok */}
              {recipe?.tiktokLink ? (
                <a
                  href={recipe.tiktokLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="h-12 w-12 cursor-pointer object-cover transition-transform hover:scale-110"
                    src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-7.png"
                    alt="TikTok"
                  />
                </a>
              ) : (
                <img
                  className="h-12 w-12 object-cover opacity-50 grayscale"
                  src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-7.png"
                  alt="TikTok placeholder"
                />
              )}
            </div>

            {/* Divider */}
            <div className="mx-auto mt-5 h-px w-[273px] bg-black" />

            {/* Instruction List */}
            <ol className="mt-6 space-y-6 px-6">
              {steps.length ? (
                steps.map((stepText, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="relative h-[53px] w-[52px] shrink-0">
                      <img
                        src={bgRectangles[index % bgRectangles.length]}
                        className="h-full w-full"
                        alt=""
                      />

                      <span className="absolute inset-0 flex items-center justify-center text-[40px] text-black [font-family:'Slackey',cursive]">
                        {index + 1}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] leading-[12px] text-black [font-family:'DM_Sans',sans-serif]">
                      {stepText}
                    </p>
                  </li>
                ))
              ) : (
                <li className="py-10 text-center italic text-black">
                  AI is working...
                </li>
              )}
            </ol>

            {/* Footer */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-xl tracking-[0.72px] text-black [font-family:'Chelsea_Market',cursive]">
              hope you make it!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
