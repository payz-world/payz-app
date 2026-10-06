type PayzLogoProps = {
  className?: string;
  decorative?: boolean;
};

export default function PayzLogo({ className = "", decorative = false }: PayzLogoProps) {
  return (
    <img
      className={`payz-brand-logo${className ? ` ${className}` : ""}`}
      src={`${import.meta.env.BASE_URL}payz-logo-cropped.png`}
      alt={decorative ? "" : "payz"}
      aria-hidden={decorative || undefined}
      width={1134}
      height={774}
    />
  );
}
