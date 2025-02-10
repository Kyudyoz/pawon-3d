import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const sales = [
    {
        name: "John Doe",
        email: "john@example.com",
        paidAmount: "$ 120.00",
        avatar: "JD",
    },
    {
        name: "Jane Doe",
        email: "jane@example.com",
        paidAmount: "$ 120.00",
        avatar: "JD",
    },
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        paidAmount: "$ 180.00",
        avatar: "AJ",
    },
    {
        name: "Bob Smith",
        email: "bob@example.com",
        paidAmount: "$ 520.00",
        avatar: "BJ",
    },
    {
        name: "Charlie Brown",
        email: "charlie@example.com",
        paidAmount: "$ 120.00",
        avatar: "CB",
    },
];

const RecentSales = () => {
    return (
        <div className="space-y-8">
            {sales.map((sale) => (
                <div key={sale.name} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="" alt="Avatar" />
                        <AvatarFallback>{sale.avatar}</AvatarFallback>
                    </Avatar>

                    <div className="ml-4 space-y-1 text-sm">
                        <p className="font-medium leading-none">{sale.name}</p>
                        <p className="text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className="ml-auto font-medium">{sale.paidAmount}</div>
                </div>
            ))}
        </div>
    );
};

export default RecentSales;
