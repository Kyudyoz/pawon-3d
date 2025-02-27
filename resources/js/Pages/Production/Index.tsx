import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { User } from "@/types";
import { ProductionTable } from "./ProductionTable";
import { format } from "date-fns";

type ProductComposition = {
  product_id: string;
  material_id: string;
  processed_material_id: string;
  material_quantity: number;
  processed_material_quantity: number;
  material_unit: string;
};

type Product = {
  id: string;
  name: string;
  is_ready: boolean;
  product_compositions: ProductComposition[];
};

type Production = {
  id: string;
  // Tambahkan field koneksi produksi dengan transaksi (misalnya)
  transaction_id?: string;
  transaction_detail_id?: string;
  product: Product;
  count: number;
  status: string;
  time: string;
  quantity: number;
  material_quantity: number;
  processed_material_quantity: number;
};

type TransactionDetail = {
  id: string;
  quantity: number;
  price: number;
  is_review: boolean;
  product: Product;
};

type Transaction = {
  id: string;
  user: User;
  total_amount: number;
  dp: number;
  discount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  type: string;
  schedule: Date;
  prize_code: string;
  spin_chance: number;
  details: TransactionDetail[];
};

type PageProps = {
  productions: Production[];
  transactions: Transaction[];
  auth: {
    user: User;
  };
  flash: {
    success?: string;
    error?: string;
  };
};

function Index() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<Production | null>(null);
  const { productions, transactions, flash, auth } = usePage<PageProps>().props;

  const {
    data,
    setData,
    reset,
    processing,
    post,
    put,
    delete: destroy,
    errors,
    clearErrors,
  } = useForm({
    transaction_id: "",
    transaction_detail_id: "",
    product_id: "",
    count: 0,
    status: "",
    time: "",
    quantity: 0,
    material_quantity: 0,
    processed_material_quantity: 0,
  });

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

  useEffect(() => {
    if (!openAdd) {
      reset();
      clearErrors();
    }
  }, [openAdd]);

  useEffect(() => {
    if (!openEdit) {
      reset();
      clearErrors();
    }
  }, [openEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/produksi", {
      onSuccess: () => {
        setOpenAdd(false);
        reset();
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      put(`/produksi/${editData.id}`, {
        onSuccess: () => {
          setOpenEdit(false);
          reset();
        },
      });
    }
  };

  const handleAdd = () => {
    setOpenAdd(true);
    reset();
  };

  const handleEdit = (production: Production) => {
    setEditData(production);
    setData({
      transaction_id: production.transaction_id || "",
      transaction_detail_id: production.transaction_detail_id || "",
      product_id: production.product.id || "",
      count: production.count,
      status: production.status,
      time: production.time,
      quantity: production.quantity,
      material_quantity: production.material_quantity,
      processed_material_quantity: production.processed_material_quantity,
    });
    setOpenEdit(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Hapus produksi?",
      text: "Data produksi ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/produksi/${id}`, {
          onSuccess: () =>
            Swal.fire("Dihapus!", "Data produksi telah dihapus.", "success"),
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Produksi" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Produksi</h1>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={handleAdd}>
            <Plus /> Tambah Produksi
          </Button>
        </div>
      </div>
      <ScrollArea className="whitespace-nowrap rounded-xl border">
        <Card>
          <CardHeader>
            <CardContent className="p-0 px-6">
              <ProductionTable
                productions={productions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </CardHeader>
        </Card>
      </ScrollArea>

      {/* Dialog Tambah Produksi */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Tambah Produksi</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex-grow overflow-y-auto"
            id="form-add"
          >
            {/* Pilih Transaksi */}
            <div>
              <Label htmlFor="transaction_id">Pilih Transaksi</Label>
              <select
                id="transaction_id"
                value={data.transaction_id}
                onChange={(e) => setData("transaction_id", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Pilih Transaksi</option>
                {transactions
                  .filter(
                    (t) =>
                      t.type === "pesanan" &&
                      format(t.schedule, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd")
                  )
                  .map((transaction) => (
                    <option key={transaction.id} value={transaction.id}>
                      {format(transaction.schedule, "dd-MM-yyyy")} -{" "}
                      {transaction.details.length} produk
                    </option>
                  ))}
              </select>
              {errors.transaction_id && (
                <p className="text-red-500 text-sm">{errors.transaction_id}</p>
              )}
            </div>

            {/* Pilih Detail Transaksi */}
            {data.transaction_id && (
              <div>
                <Label htmlFor="detail_id">Pilih Detail Transaksi</Label>
                <select
                  id="detail_id"
                  value={data.transaction_detail_id}
                  onChange={(e) =>
                    setData("transaction_detail_id", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Pilih Detail</option>
                  {(() => {
                    const selectedTransaction = transactions.find(
                      (t) => t.id === data.transaction_id
                    );
                    if (selectedTransaction) {
                      return selectedTransaction.details.map((detail) => (
                        <option key={detail.id} value={detail.id}>
                          {detail.product.name} - Jumlah: {detail.quantity}
                        </option>
                      ));
                    }
                    return null;
                  })()}
                </select>
                {errors.transaction_detail_id && (
                  <p className="text-red-500 text-sm">
                    {errors.transaction_detail_id}
                  </p>
                )}
              </div>
            )}

            {/* Field Produksi */}
            <div>
              <Label htmlFor="count">Jumlah Produksi</Label>
              <Input
                id="count"
                type="number"
                value={data.count}
                onChange={(e) => setData("count", Number(e.target.value))}
                placeholder="Masukkan jumlah produksi"
              />
              {errors.count && (
                <p className="text-red-500 text-sm">{errors.count}</p>
              )}
            </div>
            <div>
              <Label htmlFor="status">Status Produksi</Label>
              <Input
                id="status"
                value={data.status}
                onChange={(e) => setData("status", e.target.value)}
                placeholder="Masukkan status produksi"
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div>
            <div>
              <Label htmlFor="time">Waktu Produksi</Label>
              <Input
                id="time"
                value={data.time}
                onChange={(e) => setData("time", e.target.value)}
                placeholder="Masukkan waktu produksi"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>
            <div>
              <Label htmlFor="quantity">Jumlah Hasil Produksi</Label>
              <Input
                id="quantity"
                type="number"
                value={data.quantity}
                onChange={(e) => setData("quantity", Number(e.target.value))}
                placeholder="Masukkan jumlah hasil produksi"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="material_quantity">
                Jumlah Material Digunakan
              </Label>
              <Input
                id="material_quantity"
                type="number"
                value={data.material_quantity}
                onChange={(e) =>
                  setData("material_quantity", Number(e.target.value))
                }
                placeholder="Masukkan jumlah material yang digunakan"
              />
              {errors.material_quantity && (
                <p className="text-red-500 text-sm">
                  {errors.material_quantity}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="processed_material_quantity">
                Jumlah Material Jadi
              </Label>
              <Input
                id="processed_material_quantity"
                type="number"
                value={data.processed_material_quantity}
                onChange={(e) =>
                  setData("processed_material_quantity", Number(e.target.value))
                }
                placeholder="Masukkan jumlah material yang diproses"
              />
              {errors.processed_material_quantity && (
                <p className="text-red-500 text-sm">
                  {errors.processed_material_quantity}
                </p>
              )}
            </div>
          </form>
          <DialogFooter className="flex-shrink-0">
            <Button
              type="submit"
              form="form-add"
              disabled={processing}
              variant="ghost"
            >
              {processing ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Produksi */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Produksi</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleEditSubmit}
            className="space-y-4 flex-grow overflow-y-auto"
            id="form-edit"
          >
            {/* Pilih Transaksi */}
            <div>
              <Label htmlFor="transaction_id_edit">Pilih Transaksi</Label>
              <select
                id="transaction_id_edit"
                value={data.transaction_id}
                onChange={(e) => setData("transaction_id", e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Pilih Transaksi</option>
                {transactions
                  .filter(
                    (t) =>
                      t.type === "pesanan" &&
                      format(t.schedule, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd")
                  )
                  .map((transaction) => (
                    <option key={transaction.id} value={transaction.id}>
                      {format(transaction.schedule, "dd-MM-yyyy")} -{" "}
                      {transaction.details.length} produk
                    </option>
                  ))}
              </select>
              {errors.transaction_id && (
                <p className="text-red-500 text-sm">{errors.transaction_id}</p>
              )}
            </div>

            {/* Pilih Detail Transaksi */}
            {data.transaction_id && (
              <div>
                <Label htmlFor="detail_id_edit">Pilih Detail Transaksi</Label>
                <select
                  id="detail_id_edit"
                  value={data.transaction_detail_id}
                  onChange={(e) =>
                    setData("transaction_detail_id", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Pilih Detail</option>
                  {(() => {
                    const selectedTransaction = transactions.find(
                      (t) => t.id === data.transaction_id
                    );
                    if (selectedTransaction) {
                      return selectedTransaction.details.map((detail) => (
                        <option key={detail.id} value={detail.id}>
                          {detail.product.name} - Jumlah: {detail.quantity}
                        </option>
                      ));
                    }
                    return null;
                  })()}
                </select>
                {errors.transaction_detail_id && (
                  <p className="text-red-500 text-sm">
                    {errors.transaction_detail_id}
                  </p>
                )}
              </div>
            )}

            {/* Field Produksi */}
            <div>
              <Label htmlFor="count_edit">Jumlah Produksi</Label>
              <Input
                id="count_edit"
                type="number"
                value={data.count}
                onChange={(e) => setData("count", Number(e.target.value))}
                placeholder="Masukkan jumlah produksi"
              />
              {errors.count && (
                <p className="text-red-500 text-sm">{errors.count}</p>
              )}
            </div>
            <div>
              <Label htmlFor="status_edit">Status Produksi</Label>
              <Input
                id="status_edit"
                value={data.status}
                onChange={(e) => setData("status", e.target.value)}
                placeholder="Masukkan status produksi"
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div>
            <div>
              <Label htmlFor="time_edit">Waktu Produksi</Label>
              <Input
                id="time_edit"
                value={data.time}
                onChange={(e) => setData("time", e.target.value)}
                placeholder="Masukkan waktu produksi"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time}</p>
              )}
            </div>
            <div>
              <Label htmlFor="quantity_edit">Jumlah Hasil Produksi</Label>
              <Input
                id="quantity_edit"
                type="number"
                value={data.quantity}
                onChange={(e) => setData("quantity", Number(e.target.value))}
                placeholder="Masukkan jumlah hasil produksi"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="material_quantity_edit">
                Jumlah Material Digunakan
              </Label>
              <Input
                id="material_quantity_edit"
                type="number"
                value={data.material_quantity}
                onChange={(e) =>
                  setData("material_quantity", Number(e.target.value))
                }
                placeholder="Masukkan jumlah material yang digunakan"
              />
              {errors.material_quantity && (
                <p className="text-red-500 text-sm">
                  {errors.material_quantity}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="processed_material_quantity_edit">
                Jumlah Material Jadi
              </Label>
              <Input
                id="processed_material_quantity_edit"
                type="number"
                value={data.processed_material_quantity}
                onChange={(e) =>
                  setData("processed_material_quantity", Number(e.target.value))
                }
                placeholder="Masukkan jumlah material yang diproses"
              />
              {errors.processed_material_quantity && (
                <p className="text-red-500 text-sm">
                  {errors.processed_material_quantity}
                </p>
              )}
            </div>
          </form>
          <DialogFooter className="flex-shrink-0">
            <Button
              type="submit"
              form="form-edit"
              disabled={processing}
              variant="ghost"
            >
              {processing ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}

export default Index;
