// File: src/components/InstructionSteps.jsx
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

export default function InstructionSteps({ recipe }) {
  return (
    <section className="relative h-[786px] overflow-hidden bg-[#5f7d23]">
      {/* Background */}
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/svg/Frame 9.svg"
        alt="Frame"
      />

      {/* Center Container */}
      <div className="absolute left-1/2 top-1/2 h-[705px] w-[320px] -translate-x-1/2 -translate-y-1/2">
        {/* Rectangle 37 */}
        <img
          className="absolute inset-0 h-full w-full"
          src="/svg/Rectangle 37.svg"
          alt="Rectangle 37"
        />

        {/* Content */}
        <Card className="absolute inset-0 rounded-none border-0 bg-transparent shadow-none">
          <CardContent className="relative h-full p-0">
            {/* Header */}
            <header className="pt-[30px] text-center">
              <h2 className="whitespace-pre-line text-[28px] font-normal leading-8 tracking-[1.12px] text-black [font-family:'Chelsea_Market',cursive]">
                {recipe ? recipe.dishName.toUpperCase() : "NAME OF\nTHE DISH"}
              </h2>

              {recipe && (
                <p className="mt-2 text-lg font-bold tracking-widest text-black">
                  🔥 {recipe.calories}
                </p>
              )}
            </header>

            {/* Divider 1 */}
            <div className="absolute left-[22px] top-[112px] h-px w-[273px] rounded-full bg-black" />

            {/* Icons */}
            {recipe?.youtubeLink ? (
              <a href={recipe.youtubeLink} target="_blank" rel="noopener noreferrer">
                <img
                  className="absolute left-[23px] top-[129px] h-[25px] w-9 object-cover hover:scale-110 transition-transform cursor-pointer"
                  src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-6.png"
                  alt="YouTube"
                />
              </a>
            ) : (
              <img
                className="absolute left-[23px] top-[129px] h-[25px] w-9 object-cover opacity-50 grayscale"
                src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-6.png"
                alt="YouTube placeholder"
              />
            )}

            {/* Icon 2: TikTok (image-7.png) */}
            {recipe?.tiktokLink ? (
              <a href={recipe.tiktokLink} target="_blank" rel="noopener noreferrer">
                <img
                  className="absolute left-[17px] top-[176px] h-12 w-12 object-cover hover:scale-110 transition-transform cursor-pointer"
                  src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-7.png"
                  alt="TikTok"
                />
              </a>
            ) : (
              <img
                className="absolute left-[17px] top-[176px] h-12 w-12 object-cover opacity-50 grayscale"
                src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-7.png"
                alt="TikTok placeholder"
              />
            )}

            {/* Divider 2 */}
            <div className="absolute left-[22px] top-[238px] h-px w-[273px] rounded-full bg-black" />

            {/* Instruction List */}
            <ol className="absolute left-[22px] top-[220px] w-[273px] space-y-[22px]">
              {recipe?.instructions?.length ? (
                recipe.instructions.map((stepText, index) => {
                  const bgRectangles = [
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-38.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-39.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-40.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-41.svg",
                    "https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-42.svg",
                  ];

                  return (
                    <li key={index} className="flex items-start gap-3">
                      <div className="relative h-[53px] w-[52px] shrink-0">
                        <img
                          className="h-full w-full"
                          src={bgRectangles[index % bgRectangles.length]}
                          alt=""
                        />

                        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-black">
                          {index + 1}
                        </span>
                      </div>

                      <p className="mt-1 w-[211px] text-[15px] font-medium leading-relaxed text-white drop-shadow-sm">
                        {stepText}
                      </p>
                    </li>
                  );
                })
              ) : (
                <li className="mt-8 text-center italic text-white">
                  Đang chờ AI lên thực đơn...
                </li>
              )}
            </ol>

            {/* Footer */}
            <p className="absolute bottom-[16px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-xl font-bold leading-8 tracking-[0.72px] text-black [font-family:'Chelsea_Market',cursive]">
              hope you make it!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}