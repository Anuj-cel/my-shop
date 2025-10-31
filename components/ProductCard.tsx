"use client";

import Link from "next/link";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-2">{product.category}</p>
      <p className="font-bold">${product.price}</p>

      <Link
        href={`/products/${product.slug}`}
        className="text-blue-600 underline block mt-2"
      >
        View Details
      </Link>
    </div>
  );
}
