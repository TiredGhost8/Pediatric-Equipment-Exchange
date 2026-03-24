"use client";

import SideBar from "@/components/sidebar";
import { useForm, SubmitHandler } from "react-hook-form";
import { ItemFields } from "@/mock-item-fields";
import { CONDITION_OPTIONS, STATUS_OPTIONS, CATEGORY_OPTIONS, SUBCATEGORY_OPTIONS, COLOR_OPTIONS,} from "@/item-field-options";
import {useState} from 'react';

export default function ItemIntake() {
  const { register, handleSubmit, formState: { errors } } = useForm<ItemFields>();
  const onSubmit: SubmitHandler<ItemFields> = (data) => console.log(data);
  const  [open, setOpen] = useState(false);
  
  return (

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

      {/* Main content */}
      <div className="flex flex-col md:flex-row w-full gap-3 border-teal-800S px-10 py-10">
        
        {/* left side for images and qr code */}
        <div className="flex-1 flex-col gap-3 md:flex">
          <div className="flex-1 border-3 rounded-2xl border-teal-800 bg-white p-3">
            <p className="text-2xl text-center">Upload images</p>
          </div>

          <div className="flex-1 border-3 rounded-2xl border-teal-800 bg-white p-3">
            <p className="text-2xl text-center">Click to generate QR code</p>
            {/* smaller box */}
            <div className="w-40 h-40 mx-auto border rounded-lg bg-white flex items-center justify-center"></div>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 flex-col md:w-[400px] max-w-full border-2 border-teal-800 bg-white rounded-2xl overflow-y-auto flex min-h-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1 w-full p-4">
            
            <input
              placeholder="*Item Name*"
              className=" bg-rose-400 border border-rose-900 rounded-3xl placeholder-black text-black text-center px-6 py-2 text-3xl hover:shadow-xl"
              {...register("name", { required: "Name is required!" })}
            />
            <p className="text-red-600 text-sm">{errors.name?.message}</p>

            <select
              {...register("category", { required: "Category is required!" })}
              className=" bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category} className="bg-white">{category}</option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.category?.message}</p>

            <select
              {...register("subcategory")}
              className=" bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select a subcategory</option>
              {SUBCATEGORY_OPTIONS.map((subcategory) => (
                <option key={subcategory} value={subcategory} className="bg-white">{subcategory}</option>
              ))}
            </select>

            <select
              {...register("condition", { required: "Condition is required!" })}
              className=" bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select item condition</option>
              {CONDITION_OPTIONS.map((condition) => (
                <option key={condition} value={condition} className="bg-white">{condition}</option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.condition?.message}</p>

            <input
              placeholder="Item description"
              className=" bg-rose-400 border border-black rounded-3xl placeholder-black text-black text-center px-6 py-2 hover:shadow-xl"
              {...register("description")}
            />

            <input
              placeholder="Size"
              className=" bg-rose-400 border border-black rounded-3xl placeholder-black text-black text-center px-6 py-2 hover:shadow-xl"
              {...register("size")}
            />

            <select
              {...register("color", { required: "Color is required!" })}
              className=" bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select a color</option>
              {COLOR_OPTIONS.map((color) => (
                <option key={color} value={color} className="bg-white">{color}</option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.color?.message}</p>

            <select
              {...register("status", { required: "Status is required!" })}
              className=" bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select item status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status} className="bg-white">{status}</option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.status?.message}</p>

            <input
              placeholder="Donor name"
              className=" bg-rose-400 border border-black rounded-3xl placeholder-black text-black text-center px-6 py-2 hover:shadow-xl"
              {...register("donor")}
            />

            <input
              type="submit"
              value="Submit"
              className=" bg-rose-400 border border-black rounded-3xl px-6 py-2 text-2xl hover:bg-rose-300 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </div>
  );
}