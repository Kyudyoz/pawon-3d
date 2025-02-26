import DatePicker from "@/Components/date-picker";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { Filter, Minus, Plus, Trash } from "lucide-react";
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
  schedule: Date;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [payment, setPayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [type, setType] = useState("siap beli");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dp, setDp] = useState(0);

  const handleDateChange = (value: Date | undefined) => {
    setDate(value);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value === "all" ? null : value);
  };

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

  // Operasi keranjang
  const addToCart = (product: Product) => {
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
      payment_method: payment,
      payment_status: paymentStatus,
      dp: dp,
      type: type,
      schedule: date ? format(date, "yyyy-MM-dd") : null,
      details: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log(transactionData);

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
        setPayment("");
        setPaymentStatus("");
        setDp(0);
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
    clearCart();

    setSearchQuery("");
    setActiveCategory(null);
    setPayment("");
    setPaymentStatus("");
    setDate(new Date());
    setDp(0);

    if (value === "order") {
      setType("pesanan");
    }

    if (value === "ready") {
      setType("siap beli");
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Point of Sale" />
      <div className="min-h-[calc(100vh-12rem)] bg-gray-100 p-6">
        <Tabs
          onValueChange={(value) => handleTabChange(value)}
          defaultValue="ready"
          className="w-full mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-200">
            <TabsTrigger value="ready">Siap Beli</TabsTrigger>
            <TabsTrigger value="order">Pesanan</TabsTrigger>
          </TabsList>
          <TabsContent value="ready">
            <div className="flex flex-col lg:flex-row gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Select
                    onValueChange={handleCategoryChange}
                    value={activeCategory ?? ""}
                  >
                    <SelectTrigger>
                      <Filter size={16} />
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <div className="bg-white shadow rounded-lg p-4 sticky right-6 top-32">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold mb-4">Keranjang</h2>
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      size="sm"
                      className="bg-red-500 text-white"
                      disabled={cart.length === 0}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  {cart.length > 0 ? (
                    <div className="flex flex-col min-h-[calc(100vh-16rem)]">
                      {/* Area produk: Scrollable */}
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

                      {/* Bagian bawah: Tidak ikut scroll, selalu di bawah */}
                      <div className="border-t pt-4 px-2">
                        <Label htmlFor="metode-pembayaran">
                          Metode Pembayaran
                        </Label>
                        <div className="mb-2">
                          <Select onValueChange={setPayment} value={payment}>
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
          </TabsContent>
          <TabsContent value="order">
            <div className="flex flex-col lg:flex-row gap-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Select
                    onValueChange={handleCategoryChange}
                    value={activeCategory ?? ""}
                  >
                    <SelectTrigger>
                      <Filter size={16} />
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredProductsOrder().map((product) => (
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
                      </CardContent>
                      <Button onClick={() => addToCart(product)}>
                        <Plus size={16} />
                      </Button>
                    </Card>
                  ))}
                </div>
              </main>

              {/* Panel keranjang */}
              <aside className="lg:w-1/3">
                <div className="bg-white shadow rounded-lg p-4 sticky right-6 top-32">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold mb-4">Keranjang</h2>
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      size="sm"
                      className="bg-red-500 text-white"
                      disabled={cart.length === 0}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  {cart.length > 0 ? (
                    <div className="min-h-[calc(100vh-16rem)] flex flex-col">
                      {/* Daftar produk: area scrollable */}
                      <div className="flex-grow overflow-y-auto space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between px-2"
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

                      {/* Bagian bawah: tidak scrollable dan selalu menempel di bawah */}
                      <div className="mt-4 px-2">
                        <div className="mb-2">
                          <Label htmlFor="schedule" className="block mb-2">
                            Jadwal Pengambilan
                          </Label>
                          <DatePicker
                            value={date}
                            onSelect={handleDateChange}
                            className="w-full"
                          />
                        </div>
                        <Label
                          htmlFor="metode-pembayaran"
                          className="block mb-2"
                        >
                          Pembayaran
                        </Label>
                        <div className="mb-2 grid grid-cols-2 gap-2">
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
                          <Select
                            onValueChange={(value) => setPaymentStatus(value)}
                            value={paymentStatus}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Status Pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="belum lunas">
                                Belum Lunas
                              </SelectItem>
                              <SelectItem value="lunas">Lunas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mb-2">
                          <Label htmlFor="dp" className="block mb-2">
                            DP
                          </Label>
                          <Input
                            id="dp"
                            type="number"
                            value={dp || 0}
                            onChange={(e) =>
                              setDp(parseInt(e.target.value) || 0)
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="border-t pt-4">
                          <p className="font-semibold mb-4 text-right">
                            Total: Rp{" "}
                            {cart
                              .reduce(
                                (sum, item) =>
                                  sum + item.price * item.quantity - dp,
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
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
};

export default Pos;
