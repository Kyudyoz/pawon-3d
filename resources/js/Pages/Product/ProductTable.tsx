import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Croissant, FilePen, Trash2 } from "lucide-react";

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
type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onShow: (product: Product) => void;
  onDelete: (id: string) => void;
};

export function ProductTable({
  products,
  onEdit,
  onShow,
  onDelete,
}: ProductTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Produk",
    },
    {
      id: "product_image",
      header: "Gambar",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">
            {product.product_image ? (
              <img
                src={`storage/${product.product_image}`}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-md"
              />
            ) : (
              <img
                src="/avatars/no-img.jpg"
                alt={product.name}
                className="w-10 h-10 object-cover rounded-md"
              />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Harga",
    },
    {
      accessorKey: "stock",
      header: "Stok",
    },
    {
      id: "is_ready",
      header: "Siap Beli?",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">{product.is_ready ? "Ya" : "Tidak"}</div>
        );
      },
    },
    {
      id: "details",
      header: "Komposisi",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onShow(product)}>
              <Croissant className="w-4 h-4" /> Lihat Detail
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
              <FilePen className="w-4 h-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      {/* Input Pencarian */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama produk..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      {/* Tabel */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "actions" ? "text-right" : ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
