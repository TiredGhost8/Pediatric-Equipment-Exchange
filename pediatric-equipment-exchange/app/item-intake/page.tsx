"use client";

import SideBar from "@/components/sidebar";
import { useForm, SubmitHandler } from "react-hook-form";
import { ItemFields } from "@/field_interfaces";
import {
  CONDITION_OPTIONS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  SUBCATEGORY_OPTIONS,
  COLOR_OPTIONS,
} from "@/item-field-options";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Html5QrcodeScanType,
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

// Supabase client (ONLY for image upload)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ItemIntake() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFields>();

  const [imageUrl, setImageUrl] = useState("");
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false); 
  const [uploading, setUploading] = useState(false);
  const barcodeScannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Barcode scanner effect
  useEffect(() => { // Initialize barcode scanner when the scanner is opened. Cleanup on close or unmount.
    if (!barcodeScannerOpen) return;

    const scanner = new Html5QrcodeScanner( 
      "attach-barcode-reader",
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128, // currently used barcode format
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
      },
      false
    );

    barcodeScannerRef.current = scanner;

    scanner.render( //
      async (decodedText) => {
        const normalizedCode = decodedText.trim();
        if (!normalizedCode) return;

        setBarcodeValue(normalizedCode);
        setBarcodeScannerOpen(false);

        try {
          await scanner.clear();
        } catch {
          // Ignore scanner clear errors on close.
        }
      },
      () => {
        // Expected while camera is searching.
      }
    );

    return () => {
      if (barcodeScannerRef.current) {
        void barcodeScannerRef.current.clear().catch(() => {
          // Ignore scanner clear errors on unmount.
        });
      }
    };
  }, [barcodeScannerOpen]);

  //  Upload image
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("equipment-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("equipment-images")
      .getPublicUrl(fileName);

    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  // Submit → API
  const onSubmit: SubmitHandler<ItemFields> = async (data) => {
    try {
      const res = await fetch("/api/intake/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          image_urls: imageUrl && imageUrl.trim() !== "" ? [imageUrl] : null,
          barcode_value: barcodeValue.trim() === "" ? null : barcodeValue.trim(),
        })
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result.error);
        alert(result.error ?? "Failed to add item");
      } else {
        alert("Item added successfully!");
        reset();
        setImageUrl("");
        setBarcodeValue("");
        setBarcodeScannerOpen(false);
      }
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#51b6b6]">

      <SideBar />

      {/* Main content */}
      <div className="flex flex-col md:flex-row w-full gap-3 border-teal-800S px-10 py-10">

        {/* LEFT SIDE */}
        <div className="flex-1 flex-col gap-3 md:flex">

          {/*  Upload box (UPDATED but same style) */}
          <div className="flex-1 border-3 rounded-2xl border-teal-800 bg-white p-3 flex flex-col items-center justify-center">
            <p className="text-2xl text-center mb-3">Upload images</p>

            {/* hidden input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="fileUpload"
              className="hidden"
            />

            {/* styled button (matches your UI) */}
            <label
              htmlFor="fileUpload"
              className="bg-rose-400 border border-black rounded-3xl px-6 py-2 cursor-pointer hover:bg-rose-300"
            >
              Choose Image
            </label>

            {uploading && (
              <p className="text-center mt-2">Uploading...</p>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                className="mt-4 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Barcode attachment section */}
          <div className="flex-1 border-3 rounded-2xl border-teal-800 bg-white p-3">
            <p className="text-2xl text-center">Attach Barcode</p>
            <p className="mt-2 text-center text-sm text-gray-700">
              Scan a barcode label or type it manually.
            </p>

            <input
              value={barcodeValue}
              onChange={(e) => setBarcodeValue(e.target.value)}
              placeholder="Barcode value"
              className="mt-4 w-full rounded-2xl border border-black px-4 py-2 text-center"
            />

            <div className="mt-3 flex gap-2"> 
              <button
                type="button"
                className="flex-1 rounded-2xl border border-black bg-rose-400 px-4 py-2 text-black hover:bg-rose-300"
                onClick={() => setBarcodeScannerOpen((current) => !current)}
              >
                {barcodeScannerOpen ? "Close Scanner" : "Scan Barcode"}
              </button>

              <button 
                type="button"
                className="rounded-2xl border border-black bg-white px-4 py-2 text-black hover:bg-gray-100"
                onClick={() => setBarcodeValue("")}
              >
                Clear
              </button>
            </div>

            {barcodeScannerOpen && (
              <div className="mt-4 rounded-lg border bg-white p-2">
                <div id="attach-barcode-reader" className="w-full" />
              </div>
            )}

            <p className="mt-3 text-center text-sm text-[#132540]">
              Attached value: <span className="font-semibold">{barcodeValue.trim() === "" ? "None" : barcodeValue.trim()}</span>
            </p>
          </div>
        </div>

        {/* FORM SECTION (UNCHANGED STYLE) */}
        <div className="flex-1 flex-col md:w-[400px] max-w-full border-2 border-teal-800 bg-white rounded-2xl overflow-y-auto flex min-h-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-1 w-full p-4"
          >

            <input
              placeholder="*Item Name*"
              className="bg-rose-400 border border-rose-900 rounded-3xl placeholder-black text-black text-center px-6 py-2 text-3xl hover:shadow-xl"
              {...register("name", { required: "Name is required!" })}
            />
            <p className="text-red-600 text-sm">{errors.name?.message}</p>

            <select
              {...register("category", { required: "Category is required!" })}
              className="bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category} className="bg-white">
                  {category}
                </option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.category?.message}</p>

            <select
              {...register("subcategory")}
              className="bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select a subcategory</option>
              {SUBCATEGORY_OPTIONS.map((subcategory) => (
                <option key={subcategory} value={subcategory} className="bg-white">
                  {subcategory}
                </option>
              ))}
            </select>

            <select
              {...register("condition", { required: "Condition is required!" })}
              className="bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select item condition</option>
              {CONDITION_OPTIONS.map((condition) => (
                <option key={condition} value={condition} className="bg-white">
                  {condition}
                </option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.condition?.message}</p>

            <textarea
              placeholder="Item description"
              className="bg-rose-400 border border-black rounded-3xl placeholder-black text-black text-center px-6 py-2 hover:shadow-xl"
              {...register("description")}
              rows={6}
              cols={20}
            />

            <input
              placeholder="Size"
              className="bg-rose-400 border border-black rounded-3xl placeholder-black text-black text-center px-6 py-2 hover:shadow-xl"
              {...register("size")}
            />

            <select
              {...register("color", { required: "Color is required!" })}
              className="bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select a color</option>
              {COLOR_OPTIONS.map((color) => (
                <option key={color} value={color} className="bg-white">
                  {color}
                </option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.color?.message}</p>

            <select
              {...register("status", { required: "Status is required!" })}
              className="bg-rose-400 border border-black rounded-3xl text-black text-center px-6 py-2 hover:shadow-xl"
            >
              <option value="">Select item status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status} className="bg-white">
                  {status}
                </option>
              ))}
            </select>
            <p className="text-red-600 text-sm">{errors.status?.message}</p>

            <input
              placeholder="Donor name"
              className="bg-rose-400 border border-black rounded-3xl placeholder-black text-black text-center px-6 py-2 hover:shadow-xl"
              {...register("donor")}
            />

            <input
              type="submit"
              value="Submit"
              className="bg-rose-400 border border-black rounded-3xl px-6 py-2 text-2xl hover:bg-rose-300 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </div>
  );
}