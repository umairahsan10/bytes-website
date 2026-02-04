/**
 * Responsive Image Component
 * Automatically serves optimized image formats (WebP with PNG fallback)
 * and appropriate sizes based on viewport
 */

import Image from 'next/image';

interface ResponsiveImageProps {
  src: string; // Base path without extension (e.g., '/assets/newimages/optimized/laptop')
  alt: string;
  sizes: string; // Responsive sizes string
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  fill?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/**
 * ResponsiveImage Component
 * Uses Next.js Image with optimized variants
 * 
 * Example:
 * <ResponsiveImage
 *   src="/assets/newimages/optimized/laptop"
 *   alt="Laptop"
 *   sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
 *   fill
 *   priority
 * />
 */
export default function ResponsiveImage({
  src,
  alt,
  sizes,
  className = '',
  priority = false,
  loading = 'lazy',
  quality = 85,
  fill = false,
  width,
  height,
  style,
}: ResponsiveImageProps) {
  // Extract base path and determine file extension
  const baseSrc = src.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  
  // For Next.js Image optimization, we can use the original path
  // Next.js will handle the optimization automatically
  const imageSrc = `${baseSrc}.png`;

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading}
        style={style}
      />
    );
  }

  if (!width || !height) {
    throw new Error('ResponsiveImage: width and height are required when fill is false');
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={loading}
      style={style}
    />
  );
}
