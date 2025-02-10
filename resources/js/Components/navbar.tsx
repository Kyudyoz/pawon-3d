import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { NavUser } from "./nav-user";
import { usePage } from "@inertiajs/react";
import { User } from "@/types";

const Navbar = () => {
  const { auth } = usePage().props as { auth: { user: User } };

  return (
    <header className="sticky z-10 bg-background supports-[backdrop-filter]:bg-background/60 backdrop-blur top-0 flex shrink-0 items-center gap-2 border-b h-16 px-3">
      <SidebarTrigger />
      <div className="ml-auto">
        <NavUser
          user={auth.user}
          isNavbar
          btnClassName="hover:bg-transparent focus-visible:ring-0"
        />
      </div>
    </header>
  );
};

export default Navbar;
