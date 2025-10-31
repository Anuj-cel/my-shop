import { Product } from "@/types/product";

export const dynamic = "force-dynamic"; 

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store", 
  });

  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export default async function DashboardPage() {
  const products = await getProducts();

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.inventory < 5).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Inventory Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded bg-gray-200">
          <p className="text-gray-700">Total Products</p>
          <h2 className="text-2xl font-bold">{totalProducts}</h2>
        </div>

        <div className="p-4 rounded bg-red-200">
          <p className="text-gray-700">Low Stock Items (&lt; 5)</p>
          <h2 className="text-2xl font-bold">{lowStock}</h2>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Product Inventory</h2>

      <table className="w-full bg-white border">
        <thead>
          <tr className="border-b bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Inventory</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.category}</td>
              <td
                className={`p-2 ${
                  p.inventory < 5 ? "text-red-600 font-bold" : "text-green-600"
                }`}
              >
                {p.inventory}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
