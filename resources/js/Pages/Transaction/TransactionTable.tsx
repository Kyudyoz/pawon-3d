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
import { File, FilePen, Trash2 } from "lucide-react";
import { User } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { router } from "@inertiajs/react";

type Production = {
  id: string;
  transaction_id: string;
  count: number;
  status: string;
  time: string;
  quantity: number;
  material_quantity: number;
  processed_material_quantity: number;
};
type Product = {
  id: string;
  name: string;
  product_image: string;
  productions: Production[];
};

type TransactionDetail = {
  id: string;
  transaction_id: string;
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

type TransactionTableProps = {
  transactions: Transaction[];
  onShow: (transaction: Transaction) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TransactionTable({
  transactions,
  onEdit,
  onShow,
  onDelete,
}: TransactionTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "user.name",
      accessorKey: "user.name",
      header: "Nama",
    },
    {
      id: "total_amount",
      header: "Total",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex gap-2">
            <span>Rp. {transaction.total_amount}</span>
          </div>
        );
      },
    },
    {
      id: "payment_status",
      accessorKey: "payment_status",
      header: "Status Pembayaran",
      filterFn: (row, columnId, filterValue) =>
        row.getValue<string>(columnId).toLowerCase() ===
        filterValue.toLowerCase(),
      cell: ({ row }) => {
        const transaction = row.original;
        const [paymentStatus, setPaymentStatus] = React.useState<string>(
          transaction.payment_status
        );
        const handleUpdate = (value: string) => {
          const updatedData = {
            payment_status: value,
          };

          router.put(`/transaksi/${transaction.id}/paymentStatus`, updatedData);
        };
        return (
          <div className="flex gap-2">
            <Select
              onValueChange={(value) => {
                handleUpdate(value);
              }}
              value={paymentStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="belum lunas">Belum Lunas</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },

    {
      accessorKey: "type",
      header: "Tipe Transaksi",
    },
    {
      id: "details",
      header: "Rincian Transaksi",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShow(transaction)}
            >
              <File className="w-4 h-4" /> Lihat Detail
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(transaction.id)}
            >
              <FilePen className="w-4 h-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(transaction.id)}
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      columnVisibility: { type: false },
    },
  });

  return (
    <div className="w-full">
      {/* Filter Pencarian dan Dropdown Filter untuk transaction.type */}
      <div className="flex items-center space-x-4 py-4">
        <Input
          placeholder="Cari..."
          value={
            (table.getColumn("user.name")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("user.name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("type")?.setFilterValue(undefined);
            } else {
              table.getColumn("type")?.setFilterValue(value);
            }
          }}
          value={(table.getColumn("type")?.getFilterValue() as string) ?? "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter Tipe Transaksi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="siap beli">Siap Beli</SelectItem>
            <SelectItem value="pesanan">Pesanan</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("payment_status")?.setFilterValue(undefined);
            } else {
              table.getColumn("payment_status")?.setFilterValue(value);
            }
          }}
          value={
            (table.getColumn("payment_status")?.getFilterValue() as string) ??
            "all"
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter Status Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="belum lunas">Belum Lunas</SelectItem>
            <SelectItem value="lunas">Lunas</SelectItem>
          </SelectContent>
        </Select>
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
