import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/app-sidebar";
import React from "react";
import Navbar from "@/Components/navbar";

export default function AuthenticatedLayout({
    children,
}: React.PropsWithChildren<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Navbar />
                <main className="p-5">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
