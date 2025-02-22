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
import { FilePen, Trash2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  username: string;
  role: string;
};

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
};

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
              <FilePen className="w-4 h-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(user.id)}
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
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
          placeholder="Cari nama pengguna..."
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
