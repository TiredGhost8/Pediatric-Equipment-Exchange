
"use client";

import SideBar from "@/components/sidebar";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
    Html5QrcodeScanner,
    Html5QrcodeScanType,
    Html5QrcodeSupportedFormats,
} from "html5-qrcode";

export default function Scanner() {
    const router = useRouter();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const hasNavigatedRef = useRef(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.CODE_128, // current primary barcode format for equipment IDs
                    Html5QrcodeSupportedFormats.CODE_39,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.ITF,
                ],
            },
            false
        );

        scannerRef.current = scanner;

        scanner.render(
            async (decodedText) => {
                if (hasNavigatedRef.current) return;
                hasNavigatedRef.current = true;

                try {
                    await scanner.clear();
                } catch {
                    // Keep navigation flow even if cleanup throws.
                }

                router.push(`/items/[id]${decodedText}`);
            },
            () => {
                // Expected when no code is detected in a frame.
            }
        );

        return () => {
            if (scannerRef.current) {
                void scannerRef.current.clear().catch(() => {
                    // Ignore cleanup errors when unmounting.
                });
            }
        };
    }, [router]);

    return (
        <div className="flex min-h-screen w-full bg-[#51b6b6]">
            <SideBar />

            <main className="flex-1 p-4 md:p-8">
                <h1 className="text-2xl font-semibold text-[#132540]">Scan Equipment</h1>
                <p className="mt-2 text-sm text-[#132540]">
                    Point your camera at a QR code or barcode to open that equipment record.
                </p>

                <section className="mt-6 max-w-xl rounded-2xl bg-white/85 p-4 shadow-lg">
                    <div id="qr-reader" className="w-full" />
                </section>
            </main>
        </div>
    );
}
