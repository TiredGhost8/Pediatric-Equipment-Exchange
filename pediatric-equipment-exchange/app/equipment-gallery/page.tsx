import Link from "next/link";
import { mockData } from "@/mock-data";
import EquipmentCard from "@/components/equipment-card";

export default function Gallery() {
        return (
            <>
            <div className ="text-2xl"> Gallery Here </div>
            <div> 
            <div>
                <input type="text" placeholder="Search inventory..." />
            </div>

            <ul>
                {mockData.map((item, key) => {
                    return (
                    <li key = {item.id}>
                    <EquipmentCard item ={item} /> 
                    </li> 
                    );
                })}
            </ul>
            </div>
            <div> <Link href= {"/scanner"}> Go to Scan Page </Link> </div> </>
        );
}