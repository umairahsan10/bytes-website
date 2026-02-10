'use client';

import Image, { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

/**
 * OptimizedImage component that automatically:
 * - Converts PNG/JPG images to WebP format
 * - Provides responsive image sizes for mobile devices
 * - Implements lazy loading for non-priority images
 * - Optimizes image quality and performance
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fill = false,
  sizes,
  quality = 85,
  loading,
  objectFit = 'cover',
  onLoad
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Only try WebP conversion for string paths, not for imported images
    if (typeof src === 'string') {
      // Try to use WebP version if available
      const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      
      // Check if WebP version exists
      if (webpSrc !== src) {
        const img = new window.Image();
        img.onload = () => setImgSrc(webpSrc);
        img.onerror = () => setImgSrc(src); // Fallback to original
        img.src = webpSrc;
      }
    }
    // For imported images (StaticImageData), use as-is
  }, [src]);

  // Default responsive sizes if not provided
  const defaultSizes = sizes || (
    fill 
      ? '100vw' 
      : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  );

  const imageProps: any = {
    src: imgError ? src : imgSrc,
    alt: alt || '', // Ensure alt is always defined for accessibility
    className,
    priority,
    quality,
    onLoad,
    onError: () => setImgError(true),
    loading: loading || (priority ? 'eager' : 'lazy'),
    style: objectFit ? { objectFit } : undefined,
    ...(priority && { fetchPriority: 'high' as const }), // Hint browser to prioritize critical images
  };

  if (fill) {
    imageProps.fill = true;
    imageProps.sizes = defaultSizes;
  } else {
    imageProps.width = width;
    imageProps.height = height;
    if (width && height) {
      imageProps.sizes = defaultSizes;
    }
  }

  return <Image {...imageProps} alt={alt || ''} />;
}
