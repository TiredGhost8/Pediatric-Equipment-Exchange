import GalleryGrid from "@/components/gallery-logic";
import { mockData } from "@/mock-data";
import SideBar from "@/components/sidebar";

export default function EquipmentGallery() {
        return (
            <>
            <div className = "flex h-screen">
                 <SideBar />
                
                <main className = "flex-1">
                    <div className ="text-2xl p-3"> Gallery Here </div>
                    <GalleryGrid items ={mockData} />
                </main>
            </div>  </>
        );
}