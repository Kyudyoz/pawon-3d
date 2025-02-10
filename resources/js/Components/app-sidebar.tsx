import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight, Microwave, PackageOpen } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/Components/ui/sidebar";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  let { url: currentUrl } = usePage().props as unknown as { url: string };
  currentUrl = window.location.pathname;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center text-lg font-bold mt-4">
        Pawon3D
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    currentUrl === "/dashboard"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <Link href="/dashboard">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Inventori */}
              <Collapsible
                asChild
                defaultOpen={currentUrl == "/profile" ? true : false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Inventori">
                      <PackageOpen />
                      <span>Inventori</span>

                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            currentUrl === "/inventori/bahan-baku"
                              ? "bg-gray-700 text-white"
                              : "text-gray-700"
                          }
                        >
                          <Link href="/inventori/bahan-baku">Bahan Baku</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            currentUrl === "/profile"
                              ? "bg-gray-700 text-white"
                              : "text-gray-700"
                          }
                        >
                          <Link href="/profile">Olahan Bahan Baku</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Produksi */}
              <Collapsible
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Produksi">
                      <Microwave />
                      <span>Produksi</span>

                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            currentUrl === "/inventori/bahan-baku"
                              ? "bg-gray-700 text-white"
                              : "text-gray-700"
                          }
                        >
                          <Link href="/inventori/bahan-baku">
                            Rencana Produksi
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            currentUrl === "/inventori/olahan-bahan-baku"
                              ? "bg-gray-700 text-white"
                              : "text-gray-700"
                          }
                        >
                          <Link href="/inventori/olahan-bahan-baku">
                            Daftar Produksi
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            currentUrl === "/inventori/olahan-bahan-baku"
                              ? "bg-gray-700 text-white"
                              : "text-gray-700"
                          }
                        >
                          <Link href="/inventori/olahan-bahan-baku">
                            Riwayat Produksi
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* POS */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    currentUrl === "/pos"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <Link href="/pos">POS</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Transaksi */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    currentUrl === "/transaksi"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <Link href="/transaksi">Transaksi</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Ulasan */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    currentUrl === "/ulasan"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <Link href="/ulasan">Ulasan</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
