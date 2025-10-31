import { notFound } from "next/navigation";
import { Product } from "@/types/product";

export const revalidate = 60; 

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`, {
    next: { revalidate: 60 } 
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; 

  const product = await getProduct(slug);

  if (!product) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <p className="text-gray-600 mb-4">{product.description}</p>

      <div className="text-xl font-semibold mb-2">
        Price: ${product.price}
      </div>

      <div className="mb-2">
        Category: <span className="font-medium">{product.category}</span>
      </div>

      <div
        className={`font-medium ${
          product.inventory < 5 ? "text-red-500" : "text-green-600"
        }`}
      >
        Inventory: {product.inventory}
      </div>

      
    </div>
  );
}
