import Image from "next/image";

interface AvatarProps {
  userDisplayName: string;
  photoKey?: string;
  previewSrc?: string | null;
}

export default function Avatar({
  userDisplayName,
  photoKey,
  previewSrc = null,
}: AvatarProps) {
  const src = previewSrc
    ? previewSrc
    : photoKey
      ? `/api/s3?key=${encodeURIComponent(photoKey)}`
      : "/images/fallback-avatar.png";

  return (
    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full">
      <Image
        src={src}
        alt={userDisplayName}
        fill
        sizes="100%"
        className="object-cover"
      />
    </div>
  );
}
