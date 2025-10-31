import SearchProducts from "@/components/SearchProducts";
import { Product } from "@/types/product";

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "force-cache", 
  });
  return res.json();
}

export default async function HomePage() {
  const products: Product[] = await getProducts();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
      <SearchProducts products={products} />
    </main>
  );
}
