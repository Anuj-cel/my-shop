import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, addProduct } from "@/lib/products";
import { Product } from "@/types/product";
import { getTokenPayloadFromRequest } from '@/lib/auth';
export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
 const payload = getTokenPayloadFromRequest(req);
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

    const body = await req.json();

    const newProduct: Product = {
      id: Date.now().toString(),
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      category: body.category,
      inventory: body.inventory,
      lastUpdated: new Date().toISOString(),
    };

    addProduct(newProduct);

    return NextResponse.json(
      { message: "Product added", product: newProduct },
      { status: 201 }
    );

}
