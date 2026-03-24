"use client"

import GalleryGrid from "@/components/gallery-logic";
import { mockData } from "@/mock-data";
import SideBar from "@/components/sidebar";
import {useState} from 'react';

export default function EquipmentGallery() {
    const  [open, setOpen] = useState(false);
    
        return (
            <>
            <div className = "flex min-h-screen w-full bg-[#51b6b6]">
                 {/* Mobile Menu Button*/}
                       <button 
                         onClick={() => setOpen(true)}
                         className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow">
                         ☰
                       </button>
                       
                       {/* Overlay (click to close) */}
                         {open && (
                           <div className="fixed inset-0 bg-black/50 z-30 md:hidden"
                           onClick={() => setOpen(false)}
                           />
                         )}
                         <SideBar isOpen={open} onClose={() => setOpen(false)} />
                 
                
                <main className = "flex-1 bg-[#51b6b6]">
                    <div className ="text-2xl p-3"> Gallery Here </div>
                    {/* Passes the mock data to the gallery-logic component */}
                    <div className = "flex-1 p-6">
                        <GalleryGrid items ={mockData} />
                    </div>
                </main>
            </div>  </>
        );
}