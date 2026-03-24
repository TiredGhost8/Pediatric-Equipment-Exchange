"use client";
import Link from "next/link";
import Image from "next/image";

type SideBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideBar({ isOpen, onClose }: SideBarProps) {
    return (
        <>
           <aside className = {` fixed top-0 left-0 h-full w-28 bg-white border-black z-40 transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:static
            flex flex-col border p-4
            `}> 

               <ul className = "flex flex-col pt-16 space-y-2 gap-6 sticky top-5">

                <li className="hover:scale-105 hover:opacity-50"> 
                    <Link href = "/equipment-gallery" className= "flex flex-col items-center gap-1" onClick={onClose}> 
                        <Image src ="/Icons/ItemGalleryIcon.png" alt="" width={40} height={40} />
                        <span className="text-xs text-center text-black">Equipment</span> 
                    </Link> 
                </li>    

                <li className="hover:scale-105 hover:opacity-50"> 
                    <Link href = "/scanner" className= "flex flex-col items-center gap-1" onClick={onClose}>
                        <Image src ="/Icons/QRcodeIcon.png" alt="" width={40} height={40} />
                        <span className="text-xs text-center text-black"> Scanner </span>
                    </Link> 
                </li>

                <li className="hover:scale-105 hover:opacity-50"> <Link href = "/item-intake" className= "flex flex-col items-center gap-1" onClick={onClose}>
                        <Image src="/Icons/AddItemIcon.png" alt="" width={40} height={40} />
                        <span className="text-xs text-center text-black"> Add Item </span>
                    </Link> 
                </li>

                <li className="hover:scale-105 hover:opacity-50"> <Link href = "/admin-page" className= "flex flex-col items-center gap-1" onClick={onClose}>
                        <Image src="/Icons/AdminIcon.png" alt="" width={40} height={40} />
                        <span className="text-xs text-center text-black"> Admin </span>
                    </Link> 
                </li>

                <li> <Link 
            className="flex h-8 w-full items-center justify-center rounded-full bg-rose-400 px-5 transition-colors hover:border-transparent hover:bg-rose-300 md:w-[80px] text-m text-black"
            href="/"
            onClick={onClose}
          >
            Signout
          </Link>
          </li>

        </ul>
        </aside>
    </>
    )
}