import Image from "next/image";

interface ProfileImageProps {
  photoURL: string | undefined;
  userDisplayName: string;
}

export default function ProfileImage({
  photoURL,
  userDisplayName,
}: ProfileImageProps) {
  const src = photoURL
    ? `/api/s3?key=${encodeURIComponent(photoURL)}`
    : "/images/fallback-avatar.png";

  return (
    <Image
      src={src}
      alt={userDisplayName}
      width={24}
      height={24}
      className="mr-1 h-6 w-6 rounded-full border object-cover"
    />
  );
}
