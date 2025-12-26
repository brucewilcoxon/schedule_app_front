import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = "" }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"}/${cleanPath}`;
  };

  return (
    <>
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 ${className}`}>
        {images.map((imagePath, index) => {
          const imageUrl = getImageUrl(imagePath);
          return (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(imageUrl)}
            >
              <img
                src={imageUrl}
                alt={`${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl, 'Original path:', imagePath);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Full screen image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <CloseIcon className="h-8 w-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ImageGallery;

