import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug, updateProduct } from "@/lib/products";
import { getTokenPayloadFromRequest } from '@/lib/auth';
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params; 

  try {
    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const payload = getTokenPayloadFromRequest(req);
if (!payload || payload.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

  const { slug } = await context.params;

  try {
    const data = await req.json();
    console.log("Updating product:", slug, data);

    const updated = updateProduct(slug, data);

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated ✅", product: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
