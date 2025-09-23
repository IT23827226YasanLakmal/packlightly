
import ProductCard from "./ProductCard";
import { useProductStore } from "@/store/productStore";
import { Product } from "@/types";

interface ProductGridProps {
  products?: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const storeProducts = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);

  const displayProducts = products || storeProducts;

  if (loading) return <div className="p-4 text-center">Loading products...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
      {displayProducts.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">No products found.</div>
      ) : (
        displayProducts.map((product) => (
          <ProductCard
            key={typeof product._id === 'string' ? product._id : product.name}
            imageLink={product.imageLink}
            title={product.name}
            rating={4}
            ecoRating={product.eco}
            description={product.description}
          />
        ))
      )}
    </div>
  );
}
