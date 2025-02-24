import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Plus, Trash } from "lucide-react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { User } from "@/types";
import { ProcessedMaterialTable } from "./ProcessedMaterialTable";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/Components/ui/command";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/Components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

type Material = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

type ProcessedMaterial = {
  id: string;
  name: string;
  quantity: number;
  processed_material_details: {
    material_id: string;
    material_quantity: number;
    material_unit: string;
  }[];
};

type PageProps = {
  materials: Material[];
  processedMaterials: ProcessedMaterial[];
  auth: {
    user: User;
  };
  flash: {
    success?: string;
    error?: string;
  };
};
const Index = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [editData, setEditData] = useState<ProcessedMaterial | null>(null);
  const [showData, setShowData] = useState<ProcessedMaterial | null>(null);
  const { processedMaterials, materials, flash } = usePage<PageProps>().props;
  const [search, setSearch] = useState("");

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
    processed_material_details: [
      { material_id: "", material_quantity: 0, material_unit: "" },
    ],
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

  const resetForm = () => {
    reset();
    clearErrors();
  };

  const handleAdd = () => {
    setData({
      name: "",
      quantity: 0,
      processed_material_details: [
        { material_id: "", material_quantity: 0, material_unit: "" },
      ],
    });
    setOpenAdd(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post("/inventori/olahan-bahan-baku", {
      onSuccess: () => {
        setOpenAdd(false);
        resetForm();
        setData({
          name: "",
          quantity: 0,
          processed_material_details: [
            { material_id: "", material_quantity: 0, material_unit: "" },
          ],
        });
      },
    });
  };

  const handleShow = (processedMaterial: ProcessedMaterial) => {
    setShowData(processedMaterial);
    setOpenShow(true);
  };

  const handleEdit = (processedMaterial: ProcessedMaterial) => {
    setEditData(processedMaterial);
    setData({
      name: processedMaterial.name,
      quantity: processedMaterial.quantity,
      processed_material_details: processedMaterial.processed_material_details,
    });

    setOpenEdit(true);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editData) {
      put(`/inventori/olahan-bahan-baku/${editData.id}`, {
        onSuccess: () => {
          setOpenEdit(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Hapus Olahan?",
      text: `Data olahan ini akan dihapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/inventori/olahan-bahan-baku/${id}`, {
          onSuccess: () =>
            Swal.fire("Dihapus!", "Data olahan telah dihapus.", "success"),
        });
      }
    });
  };

  const handleAddDetail = () => {
    setData("processed_material_details", [
      ...data.processed_material_details,
      { material_id: "", material_quantity: 0, material_unit: "" },
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = data.processed_material_details.filter(
      (_, i) => i !== index
    );
    setData("processed_material_details", newDetails);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Bahan Baku Olahan" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Bahan Baku Olahan</h1>
        <Button variant="outline" onClick={handleAdd}>
          <Plus /> Tambah Data
        </Button>
      </div>
      <ScrollArea className="rounded-xl border">
        <Card>
          <CardHeader>
            <CardContent className="p-0 px-6">
              <ProcessedMaterialTable
                processedMaterials={processedMaterials}
                onEdit={handleEdit}
                onShow={handleShow}
                onDelete={handleDelete}
              />
            </CardContent>
          </CardHeader>
        </Card>
      </ScrollArea>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Tambah Olahan Bahan Baku</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex-grow overflow-y-auto"
            id="form-add"
          >
            <div className="p-4">
              <div>
                <Label htmlFor="name">Nama Olahan</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Masukkan nama olahan"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  value={data.quantity}
                  onChange={(e) => setData("quantity", Number(e.target.value))}
                  placeholder="Masukkan jumlah"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
              </div>
              <div>
                <Label className="block mt-4 mb-2">Bahan Baku Per Olahan</Label>
                {data.processed_material_details.map((detail, index) => (
                  <div key={index} className="flex gap-2 mt-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full text-left">
                          {materials.find((m) => m.id === detail.material_id)
                            ?.name || "Pilih Bahan Baku"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Cari bahan baku..."
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList>
                            {materials
                              .filter((material) =>
                                material.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              )
                              .map((material) => (
                                <CommandItem
                                  key={material.id}
                                  onSelect={() => {
                                    const newDetails = [
                                      ...data.processed_material_details,
                                    ];
                                    newDetails[index].material_id = material.id;
                                    newDetails[index].material_unit =
                                      material.unit;
                                    setData(
                                      "processed_material_details",
                                      newDetails
                                    );
                                    setSearch("");
                                  }}
                                >
                                  {material.name}
                                </CommandItem>
                              ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="relative w-full">
                      <Input
                        value={detail.material_quantity}
                        onChange={(e) => {
                          const newDetails = [
                            ...data.processed_material_details,
                          ];
                          newDetails[index].material_quantity = Number(
                            e.target.value
                          );
                          setData("processed_material_details", newDetails);
                        }}
                        placeholder="Jumlah"
                      />
                      {detail.material_unit && (
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {detail.material_unit}
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveDetail(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleAddDetail}
                    className="mt-2"
                    variant={"outline"}
                  >
                    + Tambah Bahan Baku
                  </Button>
                </div>
              </div>
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

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Olahan Bahan Baku</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleEditSubmit}
            className="space-y-4 flex-grow overflow-y-auto"
            id="form-edit"
          >
            <div className="p-4">
              <div>
                <Label htmlFor="name">Nama Olahan</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Masukkan nama olahan"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  value={data.quantity}
                  onChange={(e) => setData("quantity", Number(e.target.value))}
                  placeholder="Masukkan jumlah"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
              </div>
              <div>
                <Label className="block mt-4 mb-2">Bahan Baku Per Olahan</Label>
                {data.processed_material_details.map((detail, index) => (
                  <div key={index} className="flex gap-2 mt-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full text-left">
                          {materials.find((m) => m.id === detail.material_id)
                            ?.name || "Pilih Bahan Baku"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Cari bahan baku..."
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList>
                            {materials
                              .filter((material) =>
                                material.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              )
                              .map((material) => (
                                <CommandItem
                                  key={material.id}
                                  onSelect={() => {
                                    const newDetails = [
                                      ...data.processed_material_details,
                                    ];
                                    newDetails[index].material_id = material.id;
                                    newDetails[index].material_unit =
                                      material.unit;
                                    setData(
                                      "processed_material_details",
                                      newDetails
                                    );
                                    setSearch("");
                                  }}
                                >
                                  {material.name}
                                </CommandItem>
                              ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="relative w-full">
                      <Input
                        value={detail.material_quantity}
                        onChange={(e) => {
                          const newDetails = [
                            ...data.processed_material_details,
                          ];
                          newDetails[index].material_quantity = Number(
                            e.target.value
                          );
                          setData("processed_material_details", newDetails);
                        }}
                        placeholder="Jumlah"
                      />
                      {detail.material_unit && (
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {detail.material_unit}
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveDetail(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleAddDetail}
                    className="mt-2"
                    variant={"outline"}
                  >
                    + Tambah Bahan Baku
                  </Button>
                </div>
              </div>
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

      <Dialog open={openShow} onOpenChange={setOpenShow}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Detail Bahan Baku</DialogTitle>
          </DialogHeader>
          {showData && (
            <div className="space-y-4 flex-grow overflow-y-auto p-4">
              <div>
                <Label>Nama Olahan</Label>
                <p>{showData.name}</p>
              </div>
              <div>
                <Label>Jumlah</Label>
                <p>{showData.quantity}</p>
              </div>
              <div>
                <Label className="block mt-4 mb-2">Bahan Baku Per Olahan</Label>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Bahan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satuan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {showData.processed_material_details.map(
                      (detail, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {materials.find((m) => m.id === detail.material_id)
                              ?.name || "Bahan Baku"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {detail.material_quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {detail.material_unit}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
