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
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { FilePen, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type User = {
  id: string;
  name: string;
  username: string;
  role: string;
};

type PageProps = {
  users: User[];
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
  const [editData, setEditData] = useState<User | null>(null);
  const { users } = usePage<PageProps>().props;
  const { flash } = usePage<PageProps>().props;

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
    username: "",
    password: "",
    role: "",
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
    post("/user", {
      onSuccess: () => {
        setOpenAdd(false);
        reset();
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editData) {
      put(`/user/${editData.id}`, {
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

  const handleEdit = (user: User) => {
    setEditData(user);
    setData({
      name: user.name,
      username: user.username,
      password: "",
      role: user.role,
    });
    setOpenEdit(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Hapus Pengguna?",
      text: "Data pengguna ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(`/user/${id}`, {
          onSuccess: () =>
            Swal.fire("Dihapus!", "Data pengguna telah dihapus.", "success"),
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Pengguna" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Pengguna</h1>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={handleAdd}>
            <Plus /> Tambah Pengguna
          </Button>
        </div>
      </div>
      <ScrollArea className="whitespace-nowrap rounded-md border">
        <Card>
          <CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p>Tidak ada pengguna</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="flex justify-end gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <FilePen /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 /> Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </ScrollArea>

      {/* Dialog Tambah Pengguna */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nama */}
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Masukkan nama"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Input Username */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                placeholder="Masukkan username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Masukkan password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Pilihan Role */}
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) => setData("role", value)}
                value={data.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produksi">Produksi</SelectItem>
                  <SelectItem value="kasir">Kasir</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
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

      {/* Dialog Edit Pengguna */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
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
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password (opsional)</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) => setData("role", value)}
                value={data.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {data.role === "pemilik" && (
                    <>
                      <SelectItem value="pemilik">Pemilik</SelectItem>
                    </>
                  )}
                  <SelectItem value="produksi">Produksi</SelectItem>
                  <SelectItem value="kasir">Kasir</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
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
