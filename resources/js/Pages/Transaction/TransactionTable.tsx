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
      accessorKey: "payment_status",
      header: "Status Pembayaran",
    },
    {
      accessorKey: "status",
      header: "Status Transaksi",
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
    },
  });

  return (
    <div className="w-full">
      {/* Input Pencarian */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama produk..."
          value={
            (table.getColumn("user.name")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("user.name")?.setFilterValue(e.target.value)
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
