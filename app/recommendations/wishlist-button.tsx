"use client";

import { useState } from "react";
import { Product } from "@/types/product";

export default function WishlistButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => setAdded(true)}
      disabled={added}
      className={`mt-3 w-full px-3 py-2 rounded text-sm transition 
        ${added ? "bg-secondary text-white" : "bg-primary text-white"}
      `}
    >
      {added ? "Added ❤️" : "Add to Wishlist"}
    </button>
  );
}
