"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { PersonImage } from "@/types/index";

interface ImageGalleryProps {
  images: PersonImage[];
  personName: string;
}

export default function ImageGallery({ images, personName }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = images;

  const currentImage = allImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const downloadImage = async () => {
    if (!currentImage) return;

    try {
      const imageUrl = `https://image.tmdb.org/t/p/w780${currentImage.file_path}`;

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${personName.replace(/\s+/g, '_')}_photo_${currentImageIndex + 1}.jpg`;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allImages.map((image, index) => (
          <div key={index} className="group cursor-pointer" onClick={() => openGallery(index)}>
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                alt={`${personName} photo ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gallery Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-black border-none overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white border-none rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft size={24} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white border-none rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight size={24} />
                </Button>
              </>
            )}

            {/* Download Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white border-none rounded-full"
              onClick={downloadImage}
            >
              <Download size={20} />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </span>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {currentImage && (
                <div className="relative max-w-full max-h-full flex items-center justify-center">
                  <Image
                    src={`https://image.tmdb.org/t/p/w780${currentImage.file_path}`}
                    alt={`${personName} photo ${currentImageIndex + 1}`}
                    width={780}
                    height={1170}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
