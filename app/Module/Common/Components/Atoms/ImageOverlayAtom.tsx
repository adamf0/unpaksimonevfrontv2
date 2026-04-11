import Image from "next/image";

type ImageOverlayProps = {
  src: string;
  alt: string;
  dataAlt?: string;
  className?: string;
};

export default function ImageOverlay({
  src,
  alt,
  dataAlt,
  className = "",
}: ImageOverlayProps) {
  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover mix-blend-overlay opacity-60 scale-105"
        data-alt={dataAlt}
        priority
      />
    </div>
  );
}