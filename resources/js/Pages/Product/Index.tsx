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
import { ProductTable } from "./ProductTable";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

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

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  category_id: string;
  name: string;
  price: number;
  stock: number;
  product_image: any;
  is_ready: boolean;
  product_compositions: ProductComposition[];
};

type ProductComposition = {
  product_id: string;
  material_id: string;
  processed_material_id: string;
  material_quantity: number;
  processed_material_quantity: number;
  material_unit: string;
};

type PageProps = {
  materials: Material[];
  processedMaterials: ProcessedMaterial[];
  products: Product[];
  categories: Category[];
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
  const [editData, setEditData] = useState<Product | null>(null);
  const [showData, setShowData] = useState<Product | null>(null);
  const { processedMaterials, materials, products, categories, flash } =
    usePage<PageProps>().props;
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    data,
    setData,
    reset,
    processing,
    progress,
    post,
    put,
    delete: destroy,
    errors,
    clearErrors,
  } = useForm({
    category_id: "",
    name: "",
    price: 0,
    stock: 0,
    product_image: null as any,
    is_ready: false as boolean,
    product_compositions: [
      {
        product_id: "",
        material_id: "",
        processed_material_id: "",
        material_quantity: 0,
        processed_material_quantity: 0,
        material_unit: "",
      },
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
    setPreviewImage(null);
  };

  const handleAdd = () => {
    resetForm();
    setData({
      category_id: "",
      name: "",
      price: 0,
      stock: 0,
      product_image: null as any,
      is_ready: false,
      product_compositions: [
        {
          product_id: "",
          material_id: "",
          processed_material_id: "",
          material_quantity: 0,
          processed_material_quantity: 0,
          material_unit: "",
        },
      ],
    });
    setOpenAdd(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post("/produk", {
      onSuccess: () => {
        setOpenAdd(false);
        resetForm();
        setData({
          category_id: "",
          name: "",
          price: 0,
          stock: 0,
          product_image: null as any,
          is_ready: false,
          product_compositions: [
            {
              product_id: "",
              material_id: "",
              processed_material_id: "",
              material_quantity: 0,
              processed_material_quantity: 0,
              material_unit: "",
            },
          ],
        });
      },
    });
  };

  const handleShow = (product: Product) => {
    setShowData(product);
    setOpenShow(true);
  };

  const handleEdit = (product: Product) => {
    resetForm();
    setEditData(product);
    setData({
      category_id: product.category_id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      product_image: product.product_image,
      is_ready: product.is_ready,
      product_compositions: product.product_compositions,
    });

    setOpenEdit(true);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editData) {
      post(`/produk/${editData.id}`, {
        method: "put",
        onSuccess: () => {
          setOpenEdit(false);
          resetForm();
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Hapus Produk?",
      text: `Data produk ini akan dihapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/produk/${id}`, {
          onSuccess: () =>
            Swal.fire("Dihapus!", "Data produk telah dihapus.", "success"),
        });
      }
    });
  };

  const handleAddDetail = () => {
    setData("product_compositions", [
      ...data.product_compositions,
      {
        product_id: "",
        material_id: "",
        material_quantity: 0,
        material_unit: "",
        processed_material_id: "",
        processed_material_quantity: 0,
      },
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = data.product_compositions.filter((_, i) => i !== index);
    setData("product_compositions", newDetails);
  };

  const handleTabChange = (value: string) => {
    setTab(value);

    setData("product_compositions", [
      {
        product_id: "",
        material_id: "",
        material_quantity: 0,
        material_unit: "",
        processed_material_id: "",
        processed_material_quantity: 0,
      },
    ]);
  };

  const defaultTab = (() => {
    const comp = data.product_compositions?.[0];
    if (comp) {
      // Jika material_id tidak ada (null/falsy) dan processed_material_id ada, tampilkan processed_material
      if (!comp.material_id && comp.processed_material_id) {
        return "processed_material";
      }
      // Jika processed_material_id tidak ada dan material_id ada, tampilkan material
      if (comp.material_id && !comp.processed_material_id) {
        return "material";
      }
      // Jika keduanya ada atau keduanya tidak ada, kita bisa memilih default, misalnya "material"
      return "material";
    }
    return "material";
  })();

  return (
    <AuthenticatedLayout>
      <Head title="Produk" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Produk</h1>
        <Button variant="outline" onClick={handleAdd}>
          <Plus /> Tambah Data
        </Button>
      </div>
      <ScrollArea className="rounded-xl border">
        <Card>
          <CardHeader>
            <CardContent className="p-0 px-6">
              <ProductTable
                products={products}
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
            <DialogTitle>Tambah Produk</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex-grow overflow-y-auto"
            id="form-add"
            encType="multipart/form-data"
          >
            <div className="p-4">
              {previewImage && (
                <div className="mb-4 text-center">
                  <img
                    src={previewImage}
                    alt="Preview Gambar"
                    className="max-h-64 object-contain mx-auto rounded-md border border-gray-300"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Masukkan nama produk"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="category_id">Kategori</Label>
                <Select
                  onValueChange={(value) => setData("category_id", value)}
                  value={data.category_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <Input
                        placeholder="Tidak ada kategori"
                        disabled
                        className="cursor-not-allowed"
                      />
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm">{errors.category_id}</p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Harga</Label>
                <Input
                  id="price"
                  value={data.price}
                  onChange={(e) => setData("price", Number(e.target.value))}
                  placeholder="Masukkan harga"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              <div>
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  value={data.stock}
                  onChange={(e) => setData("stock", Number(e.target.value))}
                  placeholder="Masukkan stok"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </div>
              <div>
                <Label htmlFor="product_image">Gambar Produk</Label>
                <Input
                  id="product_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setData("product_image", file);
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setPreviewImage(previewUrl);
                    }
                  }}
                  placeholder="Masukkan gambar produk"
                />
                {errors.product_image && (
                  <p className="text-red-500 text-sm">{errors.product_image}</p>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <Label htmlFor="is_ready">Siap Beli?</Label>
                <Switch
                  className="bg-blue-500"
                  id="is_ready"
                  checked={data.is_ready}
                  onCheckedChange={(value) => setData("is_ready", value)}
                />
                {errors.is_ready && (
                  <p className="text-red-500 text-sm">{errors.is_ready}</p>
                )}
              </div>
              <div>
                <Label className="block mt-4 mb-2">
                  Bahan yang Digunakan (Pilih)
                </Label>
                <Tabs defaultValue="material" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="material"
                      onClick={() => handleTabChange("material")}
                    >
                      Bahan Baku
                    </TabsTrigger>
                    <TabsTrigger
                      value="processed_material"
                      onClick={() => handleTabChange("processed_material")}
                    >
                      Olahan
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="material">
                    {data.product_compositions.map((detail, index) => (
                      <div key={index} className="flex gap-2 mt-2 items-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              {materials.find(
                                (m) => m.id === detail.material_id
                              )?.name || "Pilih Bahan Baku"}
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
                                          ...data.product_compositions,
                                        ];
                                        newDetails[index].material_id =
                                          material.id;
                                        newDetails[index].material_unit =
                                          material.unit;
                                        setData(
                                          "product_compositions",
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
                              const newDetails = [...data.product_compositions];
                              newDetails[index].material_quantity = Number(
                                e.target.value
                              );
                              setData("product_compositions", newDetails);
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
                  </TabsContent>
                  <TabsContent value="processed_material">
                    {data.product_compositions.map((detail, index) => (
                      <div key={index} className="flex gap-2 mt-2 items-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              {processedMaterials.find(
                                (m) => m.id === detail.processed_material_id
                              )?.name || "Pilih Olahan"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Cari olahan..."
                                value={search}
                                onValueChange={setSearch}
                              />
                              <CommandList>
                                {processedMaterials
                                  .filter((processed_material) =>
                                    processed_material.name
                                      .toLowerCase()
                                      .includes(search.toLowerCase())
                                  )
                                  .map((processed_material) => (
                                    <CommandItem
                                      key={processed_material.id}
                                      onSelect={() => {
                                        const newDetails = [
                                          ...data.product_compositions,
                                        ];
                                        newDetails[
                                          index
                                        ].processed_material_id =
                                          processed_material.id;
                                        newDetails[
                                          index
                                        ].processed_material_quantity =
                                          processed_material.quantity;
                                        setData(
                                          "product_compositions",
                                          newDetails
                                        );
                                        setSearch("");
                                      }}
                                    >
                                      {processed_material.name}
                                    </CommandItem>
                                  ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <div className="relative w-full">
                          <Input
                            value={detail.processed_material_quantity}
                            onChange={(e) => {
                              const newDetails = [...data.product_compositions];
                              newDetails[index].processed_material_quantity =
                                Number(e.target.value);
                              setData("product_compositions", newDetails);
                            }}
                            placeholder="Jumlah"
                          />
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
                        + Tambah Olahan
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
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
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleEditSubmit}
            className="space-y-4 flex-grow overflow-y-auto"
            id="form-edit"
            encType="multipart/form-data"
          >
            <div className="p-4">
              {previewImage && (
                <div className="mb-4 text-center">
                  <img
                    src={previewImage}
                    alt="Preview Gambar"
                    className="max-h-64 object-contain mx-auto rounded-md border border-gray-300"
                  />
                </div>
              )}

              {!previewImage &&
                editData?.product_image &&
                typeof editData.product_image === "string" && (
                  <div className="mb-4 text-center">
                    <img
                      src={editData.product_image}
                      alt="Gambar Produk Saat Ini"
                      className="max-h-64 object-contain mx-auto rounded-md border border-gray-300"
                    />
                  </div>
                )}

              <div>
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Masukkan nama produk"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="category_id">Kategori</Label>
                <Select
                  onValueChange={(value) => setData("category_id", value)}
                  value={data.category_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <Input
                        placeholder="Tidak ada kategori"
                        disabled
                        className="cursor-not-allowed"
                      />
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm">{errors.category_id}</p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Harga</Label>
                <Input
                  id="price"
                  value={data.price}
                  onChange={(e) => setData("price", Number(e.target.value))}
                  placeholder="Masukkan harga"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              <div>
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  value={data.stock}
                  onChange={(e) => setData("stock", Number(e.target.value))}
                  placeholder="Masukkan stok"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </div>
              <div>
                <Label htmlFor="product_image">Gambar Produk</Label>
                <Input
                  id="product_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setData("product_image", file);
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setPreviewImage(previewUrl);
                    }
                  }}
                  placeholder="Masukkan gambar produk"
                />
                {errors.product_image && (
                  <p className="text-red-500 text-sm">{errors.product_image}</p>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <Label htmlFor="is_ready">Siap Beli?</Label>
                <Switch
                  className="bg-blue-500"
                  id="is_ready"
                  checked={data.is_ready}
                  onCheckedChange={(value) => setData("is_ready", value)}
                />
                {errors.is_ready && (
                  <p className="text-red-500 text-sm">{errors.is_ready}</p>
                )}
              </div>
              <div>
                <Label className="block mt-4 mb-2">
                  Bahan yang Digunakan (Pilih)
                </Label>
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="material"
                      onClick={() => handleTabChange("material")}
                    >
                      Bahan Baku
                    </TabsTrigger>
                    <TabsTrigger
                      value="processed_material"
                      onClick={() => handleTabChange("processed_material")}
                    >
                      Olahan
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="material">
                    {data.product_compositions.map((detail, index) => (
                      <div key={index} className="flex gap-2 mt-2 items-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              {materials.find(
                                (m) => m.id === detail.material_id
                              )?.name || "Pilih Bahan Baku"}
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
                                          ...data.product_compositions,
                                        ];
                                        newDetails[index].material_id =
                                          material.id;
                                        newDetails[index].material_unit =
                                          material.unit;
                                        setData(
                                          "product_compositions",
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
                              const newDetails = [...data.product_compositions];
                              newDetails[index].material_quantity = Number(
                                e.target.value
                              );
                              setData("product_compositions", newDetails);
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
                  </TabsContent>
                  <TabsContent value="processed_material">
                    {data.product_compositions.map((detail, index) => (
                      <div key={index} className="flex gap-2 mt-2 items-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              {processedMaterials.find(
                                (m) => m.id === detail.processed_material_id
                              )?.name || "Pilih Olahan"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Cari olahan..."
                                value={search}
                                onValueChange={setSearch}
                              />
                              <CommandList>
                                {processedMaterials
                                  .filter((processed_material) =>
                                    processed_material.name
                                      .toLowerCase()
                                      .includes(search.toLowerCase())
                                  )
                                  .map((processed_material) => (
                                    <CommandItem
                                      key={processed_material.id}
                                      onSelect={() => {
                                        const newDetails = [
                                          ...data.product_compositions,
                                        ];
                                        newDetails[
                                          index
                                        ].processed_material_id =
                                          processed_material.id;
                                        newDetails[
                                          index
                                        ].processed_material_quantity =
                                          processed_material.quantity;
                                        setData(
                                          "product_compositions",
                                          newDetails
                                        );
                                        setSearch("");
                                      }}
                                    >
                                      {processed_material.name}
                                    </CommandItem>
                                  ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <div className="relative w-full">
                          <Input
                            value={detail.processed_material_quantity}
                            onChange={(e) => {
                              const newDetails = [...data.product_compositions];
                              newDetails[index].processed_material_quantity =
                                Number(e.target.value);
                              setData("product_compositions", newDetails);
                            }}
                            placeholder="Jumlah"
                          />
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
                        + Tambah Olahan
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
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

      {/* <Dialog open={openShow} onOpenChange={setOpenShow}>
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
      </Dialog>  */}
    </AuthenticatedLayout>
  );
};
export default Index;
