import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  Cake,
  CakeSlice,
  CalculatorIcon,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  MessageCircleReply,
  Microwave,
  PackageOpen,
  Users,
} from "lucide-react";

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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex items-center justify-center text-lg font-bold mt-4">
        <span>Pawon 3D</span>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    currentUrl === "/dashboard"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <LayoutDashboard />
                  <Link href="/dashboard">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Akun */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    currentUrl === "/user"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <Users />
                  <Link href="/user">Pengguna</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Inventori */}
              <Collapsible
                defaultOpen={currentUrl.includes("/inventori") ? true : false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger>
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
                          className={
                            currentUrl === "/inventori/olahan-bahan-baku"
                              ? "bg-gray-700 text-white"
                              : "text-gray-700"
                          }
                        >
                          <Link href="/inventori/olahan-bahan-baku">
                            Olahan Bahan Baku
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Produksi */}
              <Collapsible defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger>
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

              {/* Produk */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    currentUrl === "/produk"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <CakeSlice />
                  <Link href="/produk">Produk</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* POS */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    currentUrl === "/pos"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <CalculatorIcon />
                  <Link href="/pos">POS</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Transaksi */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    currentUrl === "/transaksi"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <ClipboardCheck />
                  <Link href="/transaksi">Transaksi</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Ulasan */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={
                    currentUrl === "/ulasan"
                      ? "bg-gray-700 text-white"
                      : "text-gray-700"
                  }
                >
                  <MessageCircleReply />
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
