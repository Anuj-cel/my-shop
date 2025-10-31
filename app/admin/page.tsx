"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    inventory: ""
  });

 
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {});
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    setLoading(false);

    if (res.ok) {
      setLoggedIn(true);
      const updated = await fetch("/api/products");
      setProducts(await updated.json());
    } else {
      const err = await res.json();
      alert(err.error || "Login failed");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        inventory: Number(form.inventory)
      })
    });
    setLoading(false);

    if (res.ok) {
      const p = await res.json();
      setProducts((prev) => [...prev, p]);
      alert("Product added");
      setForm({ name: "", slug: "", description: "", price: "", category: "", inventory: "" });
    } else {
      alert("Failed to add product");
    }
  }

  async function updateProduct(slug: string, key: string, val: number) {
    const res = await fetch(`/api/products/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: val })
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.slug === slug ? updated : p)));
    } else {
      alert("Update failed — probably not logged in");
    }
  }


  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Password"
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white dark:bg-neutral-900 p-6 rounded shadow">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            required
            className="p-2 border rounded bg-background text-foreground"
            placeholder={key}
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <button
          className="col-span-2 bg-primary text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      <table className="w-full border bg-white dark:bg-neutral-900 rounded">
        <thead>
          <tr className="bg-primary-light text-primary text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2 w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.inventory}</td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-green-600 text-white px-2 rounded text-sm"
                  onClick={() => updateProduct(p.slug, "inventory", p.inventory + 1)}
                >
                  + Stock
                </button>
                <button
                  className="bg-red-600 text-white px-2 rounded text-sm"
                  onClick={() => updateProduct(p.slug, "inventory", p.inventory - 1)}
                >
                  - Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
