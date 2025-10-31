"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

export default function SearchProducts({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search products..."
        className="border p-2 mb-4 w-full rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && <p>No products found ❌</p>}
      </div>
    </>
  );
}
