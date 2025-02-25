import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  category_id: string | null;
  name: string;
  price: number;
  stock: number;
  product_image: string | null;
  is_ready: boolean;
  created_at: string;
  updated_at: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface TransactionDetail {
  product_id: string;
  quantity: number;
  price: number;
}

interface Transaction {
  user_id: string;
  total_amount: number;
  payment_method: "tunai" | "non tunai";
  payment_status: string;
  status: string;
  type: string;
  details: TransactionDetail[];
}

type PageProps = {
  categories: Category[];
  products: Product[];
  auth: {
    user: User;
  };
  flash: {
    success?: string;
    error?: string;
  };
};

const Pos = () => {
  const { categories, products, auth, flash } = usePage<PageProps>().props;

  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories[0]?.id || null
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter produk berdasarkan kategori dan pencarian
  const getFilteredProducts = () => {
    return products
      .filter((product) =>
        activeCategory ? product.category_id === activeCategory : true
      )
      .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  // Operasi keranjang
  const addToCart = (product: Product) => {
    if (!product.is_ready || product.stock < 1) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.id
      );
      const newStock = product.stock - 1;

      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, stock: newStock }
            : item
        );
      }

      return [
        ...currentCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: newStock,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => {
      return currentCart
        .map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: item.quantity - 1,
              stock: item.stock + 1,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handlePayment = () => {
    if (cart.length === 0) return;

    const transactionData = {
      user_id: auth.user.id,
      total_amount: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      payment_method: "tunai",
      details: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    router.post("/transaksi", transactionData, {
      preserveScroll: true,
      onProgress: () => {
        Swal.fire({
          title: "Menyimpan transaksi...",
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
      },
      onSuccess: () => {
        setCart([]);
      },
    });
  };

  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        title: "Sukses!",
        text: flash.success,
        icon: "success",
        confirmButtonColor: "#4CAF50",
      });
    }
    if (flash?.error) {
      Swal.fire({
        title: "Error!",
        text: flash.error,
        icon: "error",
        confirmButtonColor: "#F44336",
      });
    }
  }, [flash]);

  return (
    <AuthenticatedLayout>
      <Head title="Point of Sale" />
      <div className="min-h-[calc(100vh-12rem)] bg-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar kategori */}
          {/* <aside className="lg:w-1/4">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Kategori</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      activeCategory === category.id ? "default" : "outline"
                    }
                    className="w-full text-left"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </aside> */}

          {/* Daftar produk */}
          <main className="flex-1">
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredProducts().map((product) => (
                <Card
                  key={product.id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col"
                >
                  <CardContent className="flex-grow">
                    <h3 className="text-sm font-semibold mb-2">
                      {product.name}
                    </h3>
                    <img
                      src={product.product_image || "/avatars/no-img.jpg"}
                      alt={product.name}
                      className="w-full h-32 object-cover mb-2"
                    />
                    <p className="text-xs text-gray-500">
                      Rp {product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Stok: {product.stock}
                    </p>
                  </CardContent>
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={
                      product.stock < 1 ||
                      cart.some(
                        (item) =>
                          item.productId === product.id &&
                          item.quantity >= product.stock
                      )
                    }
                  >
                    <Plus size={16} />
                  </Button>
                </Card>
              ))}
            </div>
          </main>

          {/* Panel keranjang */}
          <aside className="lg:w-1/3">
            <div className="bg-white shadow rounded-lg p-4 sticky right-6 top-20">
              <h2 className="text-lg font-semibold mb-4">Keranjang</h2>
              {cart.length > 0 ? (
                <div className="space-y-4 relative overflow-y-auto min-h-[calc(100vh-12rem)]">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Minus size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Pastikan produk ada sebelum menambahkan
                            const prod = products.find(
                              (p) => p.id === item.productId
                            );
                            if (prod) addToCart(prod);
                          }}
                          disabled={(() => {
                            const product = products.find(
                              (p) => p.id === item.productId
                            );
                            return product
                              ? item.quantity >= product.stock
                              : false;
                          })()}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="absolute bottom-4 w-full">
                    <div className="border-t pt-4 w-full">
                      <p className="font-semibold mb-4 text-right">
                        Total: Rp{" "}
                        {cart
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                          .toLocaleString()}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handlePayment}
                      disabled={cart.length === 0}
                    >
                      Simpan
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Keranjang kosong</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Pos;
