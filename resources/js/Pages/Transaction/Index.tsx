import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

import { Label } from "@/Components/ui/label";

import { ScrollArea } from "@/Components/ui/scroll-area";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { User } from "@/types";
import { TransactionTable } from "./TransactionTable";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

type Product = {
  id: string;
  name: string;
  product_image: string;
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
  prize_code: string;
  spin_chance: number;
  details: TransactionDetail[];
};

type PageProps = {
  transactions: Transaction[];
  auth: {
    user: User;
  };
  flash: {
    success?: string;
    error?: string;
  };
};
const Index = () => {
  const [openShow, setOpenShow] = useState(false);
  const [showData, setShowData] = useState<Transaction | null>(null);
  const { transactions, flash } = usePage<PageProps>().props;

  const { delete: destroy } = useForm();

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

  const handleEdit = (id: string) => {
    router.get(`/transaksi/${id}`);
  };

  const handleShow = (transaction: Transaction) => {
    setShowData(transaction);
    setOpenShow(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Hapus Transaksi?",
      text: `Data transaksi ini akan dihapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/transaksi/${id}`, {
          onSuccess: () =>
            Swal.fire("Dihapus!", "Data transaksi telah dihapus.", "success"),
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Transaksi" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Transaksi</h1>
      </div>
      <ScrollArea className="rounded-xl border">
        <Card>
          <CardHeader>
            <CardContent className="p-0 px-6">
              <TransactionTable
                transactions={transactions}
                onEdit={handleEdit}
                onShow={handleShow}
                onDelete={handleDelete}
              />
            </CardContent>
          </CardHeader>
        </Card>
      </ScrollArea>

      <Dialog open={openShow} onOpenChange={setOpenShow}>
        <DialogContent className="sm:max-w-[60%] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>
          {showData && (
            <ScrollArea className="space-y-4 flex-grow overflow-y-auto p-4">
              <div>
                <Label className="text-sm">Penanggung Jawab</Label>
                <p className="text-sm">{showData.user.name}</p>
              </div>
              <div>
                <Label className="text-sm">Total Harga</Label>
                <p className="text-sm">{showData.total_amount}</p>
              </div>
              <div>
                {showData.details[0] && (
                  <>
                    <Label className="block mt-4 mb-2 text-sm">Rincian</Label>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                            Produk
                          </th>
                          <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                            Gambar
                          </th>
                          <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                            Jumlah
                          </th>
                          <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                            Harga
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {showData.details.map((detail) => (
                          <tr key={detail.id}>
                            <td className="px-6 py-4 text-xs whitespace-nowrap">
                              {detail.product.name}
                            </td>
                            <td className="px-6 py-4 text-xs whitespace-nowrap">
                              <img
                                src={detail.product.product_image}
                                alt={detail.product.name}
                                className="w-10 h-10 object-cover rounded-md"
                              />
                            </td>
                            <td className="px-6 py-4 text-xs whitespace-nowrap">
                              {detail.quantity}
                            </td>
                            <td className="px-6 py-4 text-xs whitespace-nowrap">
                              {detail.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
                {!showData.details[0] && (
                  <p className="px-6 py-4 text-xs text-center whitespace-nowrap">
                    Tidak ada rincian transaksi
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="flex-shrink-0">
            <Button onClick={() => setOpenShow(false)} variant="ghost">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
};
export default Index;
