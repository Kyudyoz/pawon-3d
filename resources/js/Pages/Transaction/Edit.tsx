import { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Swal from "sweetalert2";
import { Minus, Plus } from "lucide-react";
import { User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import DatePicker from "@/Components/date-picker";
import { format } from "date-fns";

// Tipe data yang digunakan

interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  product_image: string;
  category_id: string;
  is_ready: boolean;
}

interface TransactionDetail {
  product_id: string;
  quantity: number;
  price: number;
  product: Product[];
}

interface Transaction {
  id: string;
  user_id: string;
  total_amount: number;
  payment_method: string;
  type: string;
  schedule: Date;
  details: TransactionDetail[];
}

type PageProps = {
  transaction: Transaction;
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

const EditTransaction = () => {
  const { transaction, products, flash, categories } =
    usePage<PageProps>().props;

  const initialCart = transaction.details.map((detail) => {
    const productData = products.find((p) => p.id === detail.product_id);
    return {
      productId: detail.product_id,
      name: productData ? productData.name : "",
      price: detail.price,
      quantity: Number(detail.quantity),
      stock: productData ? productData.stock : 0,
    };
  });

  const [cart, setCart] = useState(initialCart);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [payment, setPayment] = useState(transaction.payment_method);
  const [type, setType] = useState(transaction.type);

  const initialDate = transaction.schedule
    ? new Date(transaction.schedule)
    : undefined;

  const [date, setDate] = useState<Date | undefined>(initialDate);
  const addToCart = (product: Product) => {
    if (product.stock < 1) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.id
      );
      const newStock = product.stock - 1;

      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Number(item.quantity) + 1, stock: newStock }
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
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: Number(item.quantity) - 1,
              stock: item.stock + 1,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Filter produk (opsional, jika ingin menambah produk lain)
  const getFilteredProducts = () => {
    return products
      .filter((product) =>
        activeCategory ? product.category_id === activeCategory : true
      )
      .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((product) => product.is_ready);
  };

  const getFilteredProductsOrder = () => {
    return products
      .filter((product) =>
        activeCategory ? product.category_id === activeCategory : true
      )
      .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  // Fungsi untuk update transaksi
  const handleUpdate = () => {
    if (cart.length === 0) return;

    const updatedData = {
      user_id: transaction.user_id,
      total_amount: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      payment_method: payment,
      type: type,
      schedule: date ? format(date, "yyyy-MM-dd") : null,

      details: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    router.put(`/transaksi/${transaction.id}`, updatedData, {
      onSuccess: () => {
        router.get(`/transaksi`);
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

  const handleTabChange = (value: string) => {
    setSearchQuery("");
    setActiveCategory(null);

    if (value === "order") {
      setType("pesanan");
    }

    if (value === "ready") {
      setType("siap beli");
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Edit Transaksi" />
      <div className="min-h-screen bg-gray-100 p-6">
        <Tabs
          onValueChange={(value) => handleTabChange(value)}
          defaultValue={transaction.type === "pesanan" ? "order" : "ready"}
          className="w-full mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-200">
            <TabsTrigger value="ready">Siap Beli</TabsTrigger>
            <TabsTrigger value="order">Pesanan</TabsTrigger>
          </TabsList>
          <TabsContent value="ready">
            <div className="flex flex-col lg:flex-row gap-6">
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
                      <div className="flex-grow">
                        <h3 className="text-sm font-semibold mb-2">
                          {product.name}
                        </h3>
                        <img
                          src={
                            `/` +
                            (product.product_image ?? "avatars/no-img.jpg")
                          }
                          alt={product.name}
                          className="w-full h-32 object-cover mb-2"
                        />
                        <p className="text-xs text-gray-500">
                          Rp {product.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Stok: {product.stock}
                        </p>
                      </div>
                      <Button
                        className="mt-2"
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
                <div className="bg-white shadow rounded-lg p-4 sticky top-32">
                  <h2 className="text-lg font-semibold mb-4">Keranjang</h2>
                  {cart.length > 0 ? (
                    <div className="flex flex-col min-h-[calc(100vh-16rem)]">
                      {/* Area produk: Bisa discroll */}
                      <div className="flex-grow overflow-y-auto space-y-4 px-2">
                        {cart.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} x Rp{" "}
                                {item.price.toLocaleString()}
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
                      </div>

                      {/* Bagian bawah: Tetap di bawah, tidak ikut scroll */}
                      <div className="border-t pt-4 px-2">
                        <Label
                          htmlFor="metode-pembayaran"
                          className="block mb-2"
                        >
                          Metode Pembayaran
                        </Label>
                        <div className="mb-2">
                          <Select
                            onValueChange={(value) => setPayment(value)}
                            value={payment}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Metode Pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tunai">Tunai</SelectItem>
                              <SelectItem value="non tunai">
                                Non Tunai
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="border-t pt-4">
                          <p className="font-semibold text-right">
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
                          className="w-full mt-4"
                          onClick={handleUpdate}
                          disabled={cart.length === 0}
                        >
                          Perbarui Transaksi
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Keranjang kosong</p>
                  )}
                </div>
              </aside>
            </div>
          </TabsContent>
          <TabsContent value="order">
            <div className="flex flex-col lg:flex-row gap-6">
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
                  {getFilteredProductsOrder().map((product) => (
                    <Card
                      key={product.id}
                      className="bg-white shadow rounded-lg p-4 flex flex-col"
                    >
                      <div className="flex-grow">
                        <h3 className="text-sm font-semibold mb-2">
                          {product.name}
                        </h3>
                        <img
                          src={
                            `/` +
                            (product.product_image ?? "avatars/no-img.jpg")
                          }
                          alt={product.name}
                          className="w-full h-32 object-cover mb-2"
                        />
                        <p className="text-xs text-gray-500">
                          Rp {product.price.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => addToCart(product)}
                        className="mt-2"
                      >
                        <Plus size={16} />
                      </Button>
                    </Card>
                  ))}
                </div>
              </main>

              {/* Panel keranjang */}
              <aside className="lg:w-1/3">
                <div className="bg-white shadow rounded-lg p-4 sticky top-32">
                  <h2 className="text-lg font-semibold mb-4">Keranjang</h2>
                  {cart.length > 0 ? (
                    <div className="flex flex-col min-h-[calc(100vh-16rem)]">
                      {/* Area produk: Bisa discroll */}
                      <div className="flex-grow overflow-y-auto space-y-4 px-2">
                        {cart.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} x Rp{" "}
                                {item.price.toLocaleString()}
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
                                  const prod = products.find(
                                    (p) => p.id === item.productId
                                  );
                                  if (prod) addToCart(prod);
                                }}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bagian bawah: Tetap di bawah, tidak ikut scroll */}
                      <div className="border-t pt-4 px-2">
                        <div className="mb-2">
                          <Label htmlFor="schedule" className="block mb-2">
                            Jadwal Pengambilan
                          </Label>
                          <DatePicker
                            value={date}
                            onSelect={(value) => setDate(value)}
                            className="mx-1"
                          />
                        </div>

                        <Label
                          htmlFor="metode-pembayaran"
                          className="block mb-2"
                        >
                          Metode Pembayaran
                        </Label>
                        <div className="mb-2">
                          <Select
                            onValueChange={(value) => setPayment(value)}
                            value={payment}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Metode Pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tunai">Tunai</SelectItem>
                              <SelectItem value="non tunai">
                                Non Tunai
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="border-t pt-4">
                          <p className="font-semibold text-right">
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
                          className="w-full mt-4"
                          onClick={handleUpdate}
                          disabled={cart.length === 0}
                        >
                          Perbarui Transaksi
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Keranjang kosong</p>
                  )}
                </div>
              </aside>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
};

export default EditTransaction;
