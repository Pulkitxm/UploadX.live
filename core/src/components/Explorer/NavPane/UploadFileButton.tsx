import { UploadIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UploadFileButton() {
  const session = useSession();

  const isVerified = session.data?.user?.isVerified;

  return (
    <button
      className={`flex h-10 items-center justify-center gap-1 rounded-md p-4 ${
        isVerified ? "bg-red-400 hover:bg-red-500" : "bg-gray-100"
      } text-gray-500`}
    >
      Upload
      <UploadIcon className="size-4 text-gray-500" />
    </button>
  );
}
