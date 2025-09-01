interface ProductCardProps {
  imageUrl: string;
  title: string;
  rating: number;
  ecoRating: number;
}

export default function ProductCard({ imageUrl, title, rating, ecoRating }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-3 pb-3">
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      <div>
        <p className="text-[#0e1b13] text-base font-medium leading-normal">{title}</p>
        <p className="text-[#4e976b] text-sm font-normal leading-normal">
          {rating.toFixed(1)} • Eco-Rating: {ecoRating}
        </p>
      </div>
    </div>
  );
}
