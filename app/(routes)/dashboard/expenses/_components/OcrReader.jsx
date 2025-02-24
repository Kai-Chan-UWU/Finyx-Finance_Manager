'use client';
import React, { useState } from "react";
import { ScanLine } from "lucide-react";
import OCRProcessor from "./OCRProcessor";

function OcrReader() {
  const [isOcrSectionOpen, setIsOcrSectionOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOcrSectionOpen(!isOcrSectionOpen)}
        className="border-2 border-green-200 rounded-full h-14 w-14 flex items-center justify-center bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
      >
        <ScanLine className="text-green-600 w-6 h-6" />
      </button>

      {isOcrSectionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OCRProcessor onClose={() => setIsOcrSectionOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default OcrReader;