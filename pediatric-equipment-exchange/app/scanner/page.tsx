"use client";

import SideBar from "@/components/sidebar";
import { useState } from "react";

export default function Scanner() {
    const [open, setOpen] = useState(false); // for mobile menu
    return ( <> 
        <div className = "flex h-screen w-screen">
            <SideBar isOpen={open} onClose={() => setOpen(false)} />
            <main className = "flex-1 p-4">
                <h1 className="text-2xl"> Scan Equipment </h1>
            </main>
        </div>
        </>)
}
