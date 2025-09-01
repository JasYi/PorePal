"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResults } from "./ResultsContext";

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [uploadedImages, setUploadedImages] = useState([
    { id: 1, file: null, preview: null },
    { id: 2, file: null, preview: null },
    { id: 3, file: null, preview: null },
  ]);
  const [loading, setLoading] = useState(false);

  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  const exampleDescriptions = [
    "Left Side of Face",
    "Front Facing",
    "Right Side of Face",
  ];

  const router = useRouter();
  const { setResults } = useResults();

  const handleFileChange = (e, id) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, file, preview: previewUrl } : img
        )
      );
    }
  };

  const triggerFileInput = (index) => {
    fileInputRefs[index].current?.click();
  };

  const removeImage = (id) => {
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, file: null, preview: null } : img
      )
    );
  };

  // submit images to backend and get solutions as a response
  const resizeImage = (file, maxSize = 2000, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const longSide = Math.max(width, height);

          if (longSide > maxSize) {
            const scale = maxSize / longSide;
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Image resize failed"));
              }
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    try {
      for (let idx = 0; idx < uploadedImages.length; idx++) {
        const img = uploadedImages[idx];
        if (img.file) {
          const resizedBlob = await resizeImage(img.file, 2000, 0.8);
          formData.append(
            `image${idx + 1}`,
            resizedBlob,
            `image${idx + 1}.jpg`
          );
        }
      }

      const response = await fetch(`${baseUrl}/api/upload_multiple_images`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      setResults(data);
      router.push("/results");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background px-2 pt-2">
      <Hero />
      <main className="w-full max-w-xl flex flex-col items-center gap-6 animate-fadein">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-row gap-3 justify-center w-full">
            {uploadedImages.map((image, index) => (
              <Card key={image.id} emoji={image.preview ? "📸" : "➕"}>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-blue-100 border-2 border-blue-200 group-hover:border-blue-400 transition-all flex items-center justify-center mx-auto">
                  {image.preview ? (
                    <>
                      <Image
                        src={image.preview}
                        alt={`Uploaded image ${image.id}`}
                        fill
                        className="object-cover"
                        priority
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-hot-pink hover:text-white transition-colors"
                        onClick={() => removeImage(image.id)}
                        aria-label="Remove image">
                        <span role="img" aria-label="remove">
                          ❌
                        </span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="w-full h-full flex flex-col items-center justify-center text-electric-blue hover:text-hot-pink transition-colors"
                      onClick={() => triggerFileInput(index)}
                      aria-label="Upload image">
                      <span className="text-3xl mb-1 animate-bounce">📷</span>
                      <span className="text-xs font-semibold">
                        {exampleDescriptions[index]}
                      </span>
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRefs[index]}
                    onChange={(e) => handleFileChange(e, image.id)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <span className="mt-2 text-xs text-foreground font-medium text-center select-none">
                  {image.preview ? "Ready!" : "Tap to add"}
                </span>
              </Card>
            ))}
          </div>
          <Button
            type="submit"
            className={`mt-4 w-full flex items-center justify-center ${
              loading ? "opacity-80 cursor-wait" : ""
            }`}
            emoji="🚀"
            disabled={!uploadedImages.every((img) => img.file) || loading}>
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "See My Results!"
            )}
          </Button>
        </form>
        <div className="mt-6 text-center text-xs text-muted-foreground select-none animate-fadein-slow">
          <span>
            Try different angles for best results. Your images never leave your
            device until you submit.
          </span>
        </div>
      </main>
      {/* <MobileNav /> removed for mobile */}
    </div>
  );
}
