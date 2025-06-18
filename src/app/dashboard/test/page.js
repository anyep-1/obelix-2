"use client";
import { useEffect } from "react";

export default function TestPDF() {
  const download = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("to-pdf");

    if (!element) {
      console.log("Element not found");
      return;
    }

    html2pdf().from(element).set({ filename: "test.pdf" }).save();
  };

  return (
    <div className="p-4">
      <button
        onClick={download}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
      <div id="to-pdf" className="p-4 mt-4 bg-white border">
        <h1>Hello World</h1>
        <p>This should be downloaded as PDF</p>
      </div>
    </div>
  );
}
