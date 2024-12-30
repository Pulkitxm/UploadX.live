import { upload_FileOrUrl } from "@/actions/storage/upload";
import { showToast } from "@/components/toast";
import { UploadManagerMinimize, UploadsContext } from "@/state/context/upload";
import { FileUpload } from "@/types/file";
import { UploadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useContext, useRef } from "react";

export default function UploadFileButton() {
  const session = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const isVerified = session.data?.user?.isVerified;
  const { updateUploads } = useContext(UploadsContext);
  const { toggleMinimize } = useContext(UploadManagerMinimize);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    console.log(files);

    if (!files || files.length === 0) {
      return showToast({
        type: "error",
        message: "No files selected"
      });
    }

    toggleMinimize({ minimize: false });
    Array.from(files).forEach((file) => {
      const newUpload: FileUpload = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: "uploading",
        createdAt: new Date()
      };

      updateUploads((prevUploads) => [...prevUploads, newUpload]);

      upload_FileOrUrl(file)
        .then((res) => {
          updateUploads((prevUploads) =>
            prevUploads.map((upload) =>
              upload.id === newUpload.id
                ? {
                    ...upload,
                    status: res.status === "success" ? "completed" : "error"
                  }
                : upload
            )
          );
        })
        .catch(() => {
          updateUploads((prevUploads) =>
            prevUploads.map((upload) =>
              upload.id === newUpload.id
                ? { ...upload, status: "error" }
                : upload
            )
          );
        });
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className={`flex h-10 items-center justify-center gap-1 rounded-md p-4 ${
          isVerified ? "bg-red-400 hover:bg-red-500" : "bg-gray-100"
        } text-gray-500`}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        Upload
        <UploadIcon className="size-4 text-gray-500" />
      </button>
      <input
        type="file"
        className="hidden"
        multiple
        ref={inputRef}
        onChange={handleFileInput}
        required
        min={1}
      />
    </div>
  );
}
