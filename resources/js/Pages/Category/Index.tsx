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
import { CategoryTable } from "./CategoryTable";

type Category = {
  id: string;
  name: string;
};

type PageProps = {
  categories: Category[];
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
  const [editData, setEditData] = useState<Category | null>(null);
  const { categories, flash, auth } = usePage<PageProps>().props;

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
    name: "",
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
    post("/kategori", {
      onSuccess: () => {
        setOpenAdd(false);
        reset();
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      put(`/produk/kategori/${editData.id}`, {
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

  const handleEdit = (category: Category) => {
    setEditData(category);
    setData({
      name: category.name,
    });
    setOpenEdit(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Hapus Kategori?",
      text: "Data kategori ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/produk/kategori/${id}`, {
          onSuccess: () =>
            Swal.fire("Dihapus!", "Data kategori telah dihapus.", "success"),
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Kategori" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Kategori</h1>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={handleAdd}>
            <Plus /> Tambah Kategori
          </Button>
        </div>
      </div>
      <ScrollArea className="whitespace-nowrap rounded-xl border">
        <Card>
          <CardHeader>
            <CardContent className="p-0 px-6">
              <CategoryTable
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </CardHeader>
        </Card>
      </ScrollArea>

      {/* Dialog Tambah Kategori */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama */}
            <div>
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Masukkan nama kategori"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            {/* Tombol Submit */}
            <DialogFooter>
              <Button type="submit" disabled={processing} variant={"ghost"}>
                {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Kategori */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={processing} variant={"ghost"}>
                {processing ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
export default Index;
