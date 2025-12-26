import React, { useState, useRef } from "react";
import { Button } from "../@/components/ui/button";
import ImageIcon from "@mui/icons-material/Image";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import { apiClient } from "../api/commonApi";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`最大${maxImages}枚までアップロードできます`);
      return;
    }

    // Check file sizes before uploading (5MB = 5 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const filesArray = Array.from(files).slice(0, remainingSlots);
    
    // Validate file sizes
    const oversizedFiles = filesArray.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      alert(`ファイルサイズが大きすぎます。5MB以下の画像をアップロードしてください。\n\n大きすぎるファイル: ${fileNames}`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const filesToUpload = filesArray;
    setUploading(true);
    setUploadProgress({});

    try {
      const uploadPromises = filesToUpload.map((file) => {
        const fileId = `${file.name}-${file.size}`;
        return uploadImage(file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        });
      });
      const uploadedPaths = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedPaths]);
      setUploadProgress({});
    } catch (error: any) {
      console.error("Image upload error:", error);
      const errorMessage = error.message || "画像のアップロードに失敗しました";
      
      // Provide specific error messages
      if (errorMessage.includes("タイムアウト") || errorMessage.includes("timeout")) {
        alert("アップロードがタイムアウトしました。\n\nファイルサイズが大きすぎるか、ネットワーク接続に問題がある可能性があります。\n\nより小さなファイルサイズでお試しください。");
      } else if (errorMessage.includes("大きすぎ")) {
        alert(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadImage = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",
        },
        timeout: 300000, // 5 minutes timeout for file uploads
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });

      if (response.data && response.data.file_path) {
        return response.data.file_path;
      }
      
      throw new Error("Upload failed: Invalid response");
    } catch (error: any) {
      console.error("Image upload error:", error);
      
      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error("アップロードがタイムアウトしました。ファイルサイズが大きすぎるか、ネットワーク接続に問題がある可能性があります。");
      }
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || "アップロードに失敗しました";
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("サーバーからの応答がありません。ネットワーク接続を確認してください。");
      } else {
        // Error in request setup
        throw new Error(error.message || "アップロードに失敗しました");
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          画像 ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            disabled={uploading}
            className="text-xs"
          >
            {uploading ? (
              <>
                <UploadIcon className="mr-1 h-3 w-3 animate-spin" />
                アップロード中...
              </>
            ) : (
              <>
                <ImageIcon className="mr-1 h-3 w-3" />
                画像を追加
              </>
            )}
          </Button>
        )}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="text-xs text-gray-600 mt-1">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="mb-1">
              <div className="flex justify-between mb-1">
                <span>アップロード中...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((imagePath, index) => {
            // Remove leading slash if present to avoid double slashes
            const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
            // Normalize base URL - remove trailing slash
            const baseUrl = (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, '');
            const imageUrl = imagePath.startsWith("http")
              ? imagePath
              : `${baseUrl}/${cleanPath}`;

            return (
              <div key={index} className="relative group">
                <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            画像をアップロードするには「画像を追加」をクリック
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

