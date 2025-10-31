import fs from "fs";
import path from "path";
import { Product } from "@/types/product";

const filePath = path.join(process.cwd(), "data", "products.json");

export function getAllProducts(): Product[] {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getAllProducts();
  return products.find((p) => p.slug === slug);
}

export function saveProducts(products: Product[]) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

export function addProduct(product: Product) {
  const products = getAllProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(slug: string, updatedFields: Partial<Product>) {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.slug === slug);
  
  if (index === -1) return null;

  products[index] = { ...products[index], ...updatedFields, lastUpdated: new Date().toISOString() };
  saveProducts(products);
  return products[index];
}
