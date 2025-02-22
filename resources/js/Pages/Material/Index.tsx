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
import { FilePen, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { User } from "@/types";
import { MaterialTable } from "./MaterialTable";

type Material = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

type PageProps = {
  materials: Material[];
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
  const [editData, setEditData] = useState<Material | null>(null);
  const { materials, flash, auth } = usePage<PageProps>().props;

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
    quantity: 0,
    unit: "",
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
    post("/inventori/bahan-baku", {
      onSuccess: () => {
        setOpenAdd(false);
        reset();
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      put(`/inventori/bahan-baku/${editData.id}`, {
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

  const handleEdit = (material: Material) => {
    setEditData(material);
    setData({
      name: material.name,
      quantity: material.quantity,
      unit: material.unit,
    });
    setOpenEdit(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Hapus Bahan Baku?",
      text: "Data bahan baku ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/inventori/bahan-baku/${id}`, {
          onSuccess: () =>
            Swal.fire("Dihapus!", "Data bahan baku telah dihapus.", "success"),
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Bahan Baku" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Bahan Baku</h1>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={handleAdd}>
            <Plus /> Tambah Bahan Baku
          </Button>
        </div>
      </div>
      <ScrollArea className="whitespace-nowrap rounded border">
        <Card>
          <CardHeader>
            <CardContent className="p-0 px-6">
              {/* <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>{material.unit}</TableCell>
                        <TableCell className="flex justify-end gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(material)}
                          >
                            <FilePen /> Edit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(material.id)}
                          >
                            <Trash2 /> Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table> */}

              <MaterialTable
                materials={materials}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </CardHeader>
        </Card>
      </ScrollArea>

      {/* Dialog Tambah Bahan Baku */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Bahan Baku</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama bahan baku */}
            <div>
              <Label htmlFor="name">Nama Bahan Baku</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Masukkan nama bahan baku"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Input quantity */}
            <div>
              <Label htmlFor="quantity">Jumlah Bahan Baku</Label>
              <Input
                id="quantity"
                value={data.quantity}
                onChange={(e) => setData("quantity", Number(e.target.value))}
                placeholder="Masukkan jumlah bahan baku"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>

            {/* Input Unit */}
            <div>
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                type="text"
                value={data.unit}
                onChange={(e) => setData("unit", e.target.value)}
                placeholder="Masukkan satuan"
              />
              {errors.unit && (
                <p className="text-red-500 text-sm">{errors.unit}</p>
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

      {/* Dialog Edit Bahan Baku */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Bahan Baku</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Bahan Baku</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="quantity">Jumlah Bahan Baku</Label>
              <Input
                id="quantity"
                value={data.quantity}
                onChange={(e) => setData("quantity", Number(e.target.value))}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                value={data.unit}
                onChange={(e) => setData("unit", e.target.value)}
              />
              {errors.unit && (
                <p className="text-red-500 text-sm">{errors.unit}</p>
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
