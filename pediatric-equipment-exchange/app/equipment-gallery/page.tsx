import Link from "next/link";
import GalleryGrid from "@/components/gallery-logic";
import { mockData } from "@/mock-data";
import SideBar from "@/components/sidebar";

export default function EquipmentGallery() {
        return (
            <>
            <div className = "flex">
                 <SideBar />
                
                <main className = "flex-1 p-4">
                    <div className ="text-2xl"> Gallery Here </div>
                    <GalleryGrid items ={mockData} />
                </main>
            </div>  </>
        );
}