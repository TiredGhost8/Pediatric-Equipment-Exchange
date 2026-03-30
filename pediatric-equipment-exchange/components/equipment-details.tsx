"use client"

import { ItemFields } from "@/field_interfaces";
import Image from "next/image";
import { useState } from 'react';
import SideBar from "@/components/sidebar";
import UpdateStatusPopup from "@/components/update-status-popup";

export default function EquipmentDetails({ item }: { item: ItemFields })  {

  const [open, setOpen] = useState(false); // for mobile menu

  const [statusPageOpen, setStatusPageOpen] = useState(false); // for changing the status

  const [imageIndex, setImageIndex] = useState(0); // for scrolling through images

  // have to send distribution info to update-status-popup in case the item is being returned
  const [distribution, setDistribution] = useState<any>(null);

  const getDistributionEntry = async () => {
    const res = await fetch(`/api/distributions/${item.id}`);
    const data = await res.json();
    setDistribution(data);
    console.log("Distribution data:", data);
  };

  // open popup for changing status
  const openStatusPopup = async () => {
    if(!distribution) { await getDistributionEntry(); }
    setStatusPageOpen(true);   
  }

  // helpers to scroll through images; wrap around when end of array is reached
  const handlePrevImage = () => {
    if (imageIndex > 0) { setImageIndex(imageIndex - 1); }
    else { setImageIndex((item.image_urls.length)-1); }
  }
  const handleNextImage = () => {
    if (imageIndex < (item.image_urls.length - 1)) { 
      setImageIndex(imageIndex + 1); }
    else {setImageIndex(0); }
  }

  // give different statuses different colors
  const getStatusColor = () => {
    switch(item.status) {
      case "Available": return "bg-green-400";
      case "Reserved":  return "bg-yellow-500";
      case "Allocated": return "bg-red-800";
      case "In Processing": return "bg-sky-400";
    }
  }

  return (
    <>
    <div className="flex min-h-screen w-full bg-[#51b6b6]">

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
        
        {/* Main Content */}
        <div className="flex-1 p-8 py-15 mb-10 w-full h-full">

          <h1 className="text-white text-2xl mb-8 text-center bg-rose-400 font-mono">Equipment Details</h1>
        
          {/* Outer grid with 2 columns  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
            {/* Left Column - Image array that can be clicked through*/}
            <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center min-h-[25rem]">
              <Image 
                src={item.image_urls[imageIndex]}
                alt={item.name}
                width={250}
                height={150}
                className="rounded-lg w-full max-w-sm md:max-w-md object-contain"
                priority 
              />
              {/* Buttons to click through the images */}
              <div className="flex justify-between w-full mt-6">
                <button className="text-6xl text-rose-400 flex items-center justify-center hover:opacity-70 hover:cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
                  onClick={handlePrevImage} disabled={item.image_urls.length===1}> ◀ </button>

                  {/* Track which image */}
                  <p className="text-black"> {imageIndex + 1} of {item.image_urls.length} </p>

                <button className="text-6xl text-rose-400 flex items-center justify-center hover:opacity-70 hover:cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed"
                  onClick={handleNextImage} disabled={item.image_urls.length===1}> ▶ </button>
              </div>
            </div> 

            {/* Right column, a flex column split into two boxes */}
            <div className="flex flex-col gap-4 min-h-[30rem]">

              {/* Top right box for Item Details */}
              <div className="bg-white rounded-lg p-4 flex-1 min-h-[30rem]"> 
                <ul className="text-[#132540] text-lg space-y-3 font-mono">
                  <li className="text-3xl text-center mb-6"> <span><strong>Item Name:</strong> {item.name} </span> </li>
                  <li><strong>Category:</strong> {item.category}</li>
                  <li><strong>Subcategory:</strong> {item.subcategory? item.subcategory : "N/A"}</li>
                  <li><strong>Condition:</strong> {item.condition}</li>
                  <li><strong>Size:</strong> {item.size}</li>
                  <li><strong>Color:</strong> {item.color}</li>
                  <li><strong>Description:</strong> {item.description? item.description : "N/A"}</li>
                </ul>
              </div>

              {/* Bottom right box for Status details & Change Status button */}
              <div className="bg-white rounded-lg p-4 flex flex-col gap-3 items-center">
                <h1 className="text-3xl text-center text-black font-bold font-mono"> Current Status: </h1> 
                <span className={`${getStatusColor()} text-center text-white text-xl font-bold font-mono border rounded-xl p-3 w-full`}> {item.status} </span>
                
                {/* Update status button */}
                <button className="bg-rose-400 hover:bg-rose-300 hover:cursor-pointer border rounded-3xl text-white text-xl p-3 font-mono"  
                    onClick={ openStatusPopup }> Update </button> 
              </div>
            </div>
          </div>
        </div>
      
      {/* Popup when Update Status button is clicked */}
      <UpdateStatusPopup
            equipment_id = {item.id}
            // UPDATE LATER: to be the staff member's id from authenticated session ; this is just Dawn's id in the profile table
            staff_member = {"1d9992f0-753a-43db-943d-7ed30741aff9"} 
            //
            distribution_id = {distribution?.id}
            waiver_signed = {distribution?.waiver_signed ?? false}
            current_status = {item.status}
            isOpen = { statusPageOpen }
            onClose = { () => setStatusPageOpen(false)}
          /> 
    </div>
    </>
  );
}