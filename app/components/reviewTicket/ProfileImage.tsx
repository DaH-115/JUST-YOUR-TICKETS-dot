import Image from "next/image";

interface ProfileImageProps {
  photoURL?: string | null;
  userDisplayName: string;
}

export default function ProfileImage({
  photoURL,
  userDisplayName,
}: ProfileImageProps) {
  // photoURL이 유효한 문자열인지 확인
  const hasValidPhoto =
    photoURL && typeof photoURL === "string" && photoURL.trim().length > 0;

  const imageSrc = hasValidPhoto
    ? `/api/s3?key=${encodeURIComponent(photoURL)}`
    : "/default-profile.svg";

  return (
    <Image
      src={imageSrc}
      alt={userDisplayName}
      width={24}
      height={24}
      className="mr-1 h-6 w-6 rounded-full border object-cover"
    />
  );
}
