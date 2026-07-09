// File: src/components/IngredientCheck.jsx
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

const stripes = Array.from({ length: 5 }, (_, index) => index);
const decorativeStars = [
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-3.svg", alt: "Star", className: "absolute top-[506px] right-0 w-[62px] h-[85px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-10.svg", alt: "Star", className: "absolute top-[724px] left-0 w-[90px] h-[92px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-10.svg", alt: "Star", className: "absolute top-[791px] right-0 w-[90px] h-[92px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-10.svg", alt: "Star", className: "absolute top-[1102px] right-0 w-[90px] h-[92px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-5.svg", alt: "Star", className: "absolute top-[689px] left-0 w-[54px] h-[81px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-17.svg", alt: "Star", className: "absolute top-[691px] left-[49px] w-[42px] h-11" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-17.svg", alt: "Star", className: "absolute top-[896px] right-[11px] w-[42px] h-11" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-18.svg", alt: "Star", className: "absolute top-[1035px] left-0 w-10 h-[39px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-22.svg", alt: "Star", className: "absolute top-[728px] right-[27px] w-[49px] h-[51px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-22.svg", alt: "Star", className: "absolute top-[860px] right-0 w-[30px] h-[51px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-13.svg", alt: "Star", className: "absolute top-[928px] left-0 w-[45px] h-12" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-13.svg", alt: "Star", className: "absolute top-[1142px] left-[34px] w-[51px] h-12" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-15.svg", alt: "Star", className: "absolute top-[1148px] right-[48px] w-[49px] h-[51px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-21.svg", alt: "Star", className: "absolute top-[1476px] left-[9px] w-[89px] h-[90px]" },
  { src: "https://c.animaapp.com/mr98ygdi58TZ2c/img/star-22.svg", alt: "Star", className: "absolute top-[1351px] right-[28px] w-[49px] h-[51px]" }
];

export default function IngredientCheck({ recipe, diet, setDiet, selectedIngredients, toggleIngredient }) {
  return (
    <section className="relative h-[986px]">
      <img className="absolute inset-0 h-full w-full" alt="Rectangle" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-33.svg" />
      <div className="absolute left-[22px] top-[41px] flex items-stretch gap-9">
        {stripes.map((stripe) => (
          <div key={`stripe-${stripe}`} className="h-[934px] w-[50px] bg-[#ff0000]" />
        ))}
      </div>
      <img className="absolute left-[22px] top-5 h-[21px] w-[378px]" alt="Group" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/group-7.png" />
      <img className="absolute left-1/2 top-[32px] h-[113px] w-[170px] -translate-x-1/2 object-cover" alt="Clipped image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/clipped-image-20260703-232401-1.png" />
      
      {decorativeStars.map((star, index) => (
        <img key={`decorative-star-${index}`} className={star.className} alt={star.alt} src={star.src} />
      ))}

      <Card className="absolute left-1/2 top-[98px] w-[303px] -translate-x-1/2 border-0 bg-transparent shadow-none">
        <CardContent className="relative h-[411px] p-0">
          <div className="absolute left-[3px] top-2 h-[395px] w-[297px] rotate-[-3.09deg] bg-[#3e740f]" />
          <img className="absolute left-[15px] top-[21px] h-[369px] w-[277px] object-cover" alt="Rectangle" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/rectangle-26.svg" />
          
          <div className="absolute inset-x-0 top-[43px] text-center px-4">
            <h2 className="text-[28px] font-normal leading-8 tracking-[1.12px] text-black pt-4">
              {recipe ? recipe.dishName : "CHỜ ẢNH CỦA BẠN..."}
            </h2>
            <h2 className="text-[28px] font-normal leading-8 tracking-[1.12px] text-black pt-4">
              INGREDIENT<br />CHECK
            </h2>
          </div>
          
          <ul className="absolute left-[97px] top-[111px] flex w-[150px] flex-col gap-0.5 max-h-[200px] overflow-y-auto">
            {recipe && recipe.ingredients ? (
              recipe.ingredients.map((item) => {
                const selected = selectedIngredients.includes(item);
                return (
                  <li key={item}>
                    <button type="button" onClick={() => toggleIngredient(item)} className="flex w-full items-center gap-2 text-left">
                      <span className={`h-2 w-2 flex-shrink-0 rounded ${selected ? "bg-[#3e740f]" : "bg-[#9ea298]"}`} />
                      <span className="font-sans text-[18px] font-normal leading-[normal] truncate">{item}</span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="font-sans text-[16px] text-gray-500 italic">Đang chờ nguyên liệu...</li>
            )}
          </ul>

          <div className="absolute left-20 top-[139px] flex w-60 flex-col gap-[31px] pointer-events-none">
            <img className="h-px w-full" alt="Line" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/line-2.svg" />
            <img className="h-px w-full" alt="Line" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/line-2.svg" />
            <img className="h-px w-full" alt="Line" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/line-4.svg" />
            <img className="h-px w-full" alt="Line" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/line-4.svg" />
            <img className="h-px w-full" alt="Line" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/line-4.svg" />
          </div>
        </CardContent>
      </Card>

      <div className="absolute left-14 top-[588px] h-[292px] w-[292px] rotate-2 bg-[#ffe181]" />
      <div className="absolute left-1/2 top-[639px] -translate-x-1/2 whitespace-nowrap text-center text-xl font-bold tracking-widest">NOTE</div>
      <div className="absolute left-[201px] top-[622px] h-1 w-1 rounded-sm bg-[#54250b33]" />
      <img className="absolute left-[188px] top-[537px] h-[109px] w-[89px] object-cover" alt="Image" src="https://c.animaapp.com/mr98ygdi58TZ2c/img/image-5.png" />
      
      <div className="absolute left-[100px] top-[684px] flex w-[150px] flex-col gap-3">
        {["ăn mặn", "ăn chay"].map((item) => {
          const checked = diet === item;
          return (
            <button key={item} type="button" onClick={() => setDiet(item)} className="flex items-center text-left gap-3">
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Checkbox checked={checked} className="h-6 w-6 rounded-none border-black data-[state=checked]:border-black data-[state=checked]:bg-transparent" />
                {checked && <span className="pointer-events-none absolute text-[40px] leading-none text-[#4e9f08]">✓</span>}
              </div>
              <span className="font-sans text-[22px] font-normal leading-[normal] capitalize">
                {item === "ăn mặn" ? "Thịt/Cá" : "Ăn Chay"}
              </span>
            </button>
          );
        })}
      </div>

      <Button type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="absolute left-1/2 top-[904px] -translate-x-1/2 rounded-[20px] bg-black px-6 py-[3px] text-white">
        COOK
      </Button>
    </section>
  );
}