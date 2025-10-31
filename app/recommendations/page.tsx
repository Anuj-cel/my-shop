import WishlistButton from "./wishlist-button";
import { Product } from "@/types/product";

export const revalidate = 30; 

async function getRecommendedProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) return [];
  const products: Product[] = await res.json();

  
  return products.sort((a, b) => a.price - b.price).slice(0, 3);
}

export default async function RecommendationsPage() {
  const products = await getRecommendedProducts();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Recommended for You</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 rounded shadow bg-white dark:bg-neutral-900"
          >
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-sm text-secondary mb-2">{product.category}</p>
            <p className="text-primary font-bold">${product.price}</p>

            <WishlistButton product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
