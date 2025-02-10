import Chart from "@/Components/chart";
import DatePicker from "@/Components/date-picker";
import RecentSales from "@/Components/recent-sales";
import SummaryCard from "@/Components/summary-card";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Activity, CreditCard, DollarSign, Filter, Users } from "lucide-react";
import { title } from "process";

const summaryData = [
    { title: "Total Revenue", value: "$ 1,200.00", icon: DollarSign },
    { title: "Total Subscriptions", value: "+120", icon: Users },
    { title: "Sales", value: "+122,234", icon: CreditCard },
    { title: "Active Now", value: "+573", icon: Activity },
];

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="flex items-end justify-between mb-7">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2 items-center">
                    <DatePicker />
                    <Button>
                        <Filter className="w-4 h-4 mr-1" /> Filter
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {summaryData.map((item) => (
                    <SummaryCard
                        key={item.title}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                    />
                ))}
            </div>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Chart />
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                            You made 265 sales this month
                        </CardDescription>
                        <CardContent className="pt-4">
                            <RecentSales />
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
