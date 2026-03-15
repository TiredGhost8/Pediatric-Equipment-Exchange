
import EquipmentCard from "@/components/equipment-card";
import { ItemFields } from "@/mock-item-fields";

interface Props {
  items: ItemFields[];
}

export default function GalleryGrid( {items}: Props) {
    return (
            <>
            <div> 
                <div className = "px-4">
                    <input type="text" placeholder="Search inventory..." />
                </div>
        
                <div className = "mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 bg-teal-200 p-6">
                    {items.map((item) => {
                        return (
                        <div key = {item.id}>
                        <EquipmentCard item ={item} /> 
                        </div> 
                        );
                    })
                    }
                </div> 
            </div>
            </>)
}