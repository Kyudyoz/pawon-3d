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

type ProcessedMaterialTableProps = {
  processedMaterials: ProcessedMaterial[];
  onEdit: (processedMaterial: ProcessedMaterial) => void;
  onShow: (processedMaterial: ProcessedMaterial) => void;
  onDelete: (id: string) => void;
};

export function ProcessedMaterialTable({
  processedMaterials,
  onEdit,
  onShow,
  onDelete,
}: ProcessedMaterialTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns: ColumnDef<ProcessedMaterial>[] = [
    {
      accessorKey: "name",
      header: "NamaOlahan",
    },
    {
      accessorKey: "quantity",
      header: "Jumlah",
    },
    {
      id: "details",
      header: "Bahan Baku",
      cell: ({ row }) => {
        const processedMaterial = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShow(processedMaterial)}
            >
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
        const processedMaterial = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(processedMaterial)}
            >
              <FilePen className="w-4 h-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(processedMaterial.id)}
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: processedMaterials,
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
          placeholder="Cari nama bahan baku..."
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
