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
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover mix-blend-overlay opacity-60 scale-105"
        data-alt={dataAlt}
      />
    </div>
  );
}