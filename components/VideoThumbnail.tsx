"use client";

import { useState } from "react";

interface VideoThumbnailProps {
  thumbnailUrl: string | null | undefined;
  alt: string;
  className?: string;
  placeholder?: string;
}

export default function VideoThumbnail({
  thumbnailUrl,
  alt,
  className = "w-full h-full object-cover",
  placeholder = "No thumbnail",
}: VideoThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (!thumbnailUrl || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-gray-400 text-xs">{placeholder}</span>
      </div>
    );
  }

  return (
    <img
      src={thumbnailUrl}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

