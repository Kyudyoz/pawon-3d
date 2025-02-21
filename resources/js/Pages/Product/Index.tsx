import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { User } from "@/types";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

type Product = {
  id: number;
  name: string;
  price: number;
};

type PageProps = {
  products: Product[];
  auth: {
    user: User;
  };
};

function Index() {
  const { products: initialProducts } = usePage<PageProps>().props;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(initialProducts);
    setLoading(false);
  }, [initialProducts]);

  return (
    <AuthenticatedLayout>
      <Head title="Produk" />
      <div className="flex items-end justify-between mb-7">
        <h1 className="text-3xl font-bold">Produk</h1>
        <div className="flex gap-2 items-center">
          <Button>
            <Plus className="w-4 h-4 mr-1" /> Tambah Produk
          </Button>
        </div>
      </div>
      <div className="">
        <ScrollArea className="whitespace-nowrap rounded-md border">
          <Card>
            <CardHeader>
              <CardTitle>Produk</CardTitle>
              <CardContent>
                {loading ? (
                  <p>Memuat data...</p>
                ) : products.length === 0 ? (
                  <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.invoice}>
                          <TableCell className="font-medium">
                            {invoice.invoice}
                          </TableCell>
                          <TableCell>{invoice.paymentStatus}</TableCell>
                          <TableCell>{invoice.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            {invoice.totalAmount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                ) : (
                  <ul>
                    {products.map((product) => (
                      <li key={product.id}>
                        {product.name} - Rp{product.price}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </CardHeader>
          </Card>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </AuthenticatedLayout>
  );
}
export default Index;
