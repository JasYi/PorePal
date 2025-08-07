"use client";

import React, { useState, useRef } from "react";
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

export default function Home() {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create an array of promises for reading files
    const imagePromises = uploadedImages.map((img) => {
      if (!img.file) return null;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(img.file);
      });
    });
    // Wait for all files to be read
    const images_out = (await Promise.all(imagePromises)).filter(Boolean);
    const payload = { images: images_out };
    console.log(payload);
    fetch("http://localhost:3000/api/upload_multiple_images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        // Redirect to /results with the analysis data
        router.push(
          `/results?data=${encodeURIComponent(JSON.stringify(data))}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background px-2 pt-2">
      <Hero />
      <main className="w-full max-w-xl flex flex-col items-center gap-6 animate-fadein">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-row gap-3 justify-center w-full">
            {uploadedImages.map((image, index) => (
              <Card key={image.id} emoji={image.preview ? "📸" : "➕"}>
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-blue-100 border-2 border-blue-200 group-hover:border-blue-400 transition-all mx-auto">
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
            className="mt-4 w-full"
            emoji="🚀"
            disabled={!uploadedImages.every((img) => img.file)}>
            {loading ? "Analyzing..." : "See My Results!"}
          </Button>
        </form>
        <div className="mt-6 text-center text-xs text-muted-foreground select-none animate-fadein-slow">
          <span>
            Try different angles for best results. Your images never leave your
            device until you submit.
          </span>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
