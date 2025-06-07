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

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState([
    { id: 1, file: null, preview: null },
    { id: 2, file: null, preview: null },
    { id: 3, file: null, preview: null },
  ]);

  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  const exampleDescriptions = [
    "Left Side of Face",
    "Front Facing",
    "Right Side of Face",
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Submitted files:",
      uploadedImages.map((img) => img.file)
    );
    alert("Images submitted successfully!");
  };

  return (
    <div className="container mx-auto py-10 px-4">
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
                          src={`/placeholder.svg?height=200&width=200&text=Example ${image.id}`}
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
