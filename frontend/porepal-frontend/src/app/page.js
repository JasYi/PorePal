"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
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
    fetch("http://127.0.0.1:8000/upload_multiple_images", {
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
    <div className="container mx-auto py-10 px-4">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-20 transition-opacity duration-300 opacity-60">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <h1 className="text-white mt-4">Analyzing your skin...</h1>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">PorePal</h1>
        <p className="text-muted-foreground text-center mb-8">
          Use AI to find the best skincare products for your face!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {uploadedImages.map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">
                    {exampleDescriptions[index]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="relative aspect-square mb-4 bg-muted rounded-md overflow-hidden">
                    {image.preview ? (
                      <>
                        <Image
                          src={image.preview || "/placeholder.svg"}
                          alt={`Uploaded image ${image.id}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          type="button"
                          onClick={() => removeImage(image.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <Image
                          src={`/example${image.id}.jpeg?height=200&width=200&text=Example ${image.id}`}
                          alt={`Example for image ${image.id}`}
                          width={150}
                          height={150}
                          className="object-cover mb-2"
                        />
                        <p className="text-xs text-center text-muted-foreground">
                          Example image
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRefs[index]}
                    onChange={(e) => handleFileChange(e, image.id)}
                    accept="image/*"
                    className="hidden"
                  />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    type="button"
                    variant={image.preview ? "outline" : "default"}
                    className="w-full"
                    onClick={() => triggerFileInput(index)}>
                    <Upload className="mr-2 h-4 w-4" />
                    {image.preview ? "Change Image" : "Upload Image"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={!uploadedImages.every((img) => img.file)}>
              Submit All Images
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
