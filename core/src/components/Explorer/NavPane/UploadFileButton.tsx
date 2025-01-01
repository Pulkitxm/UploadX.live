import { UploadIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useContext, useRef } from "react";

import { upload_FileOrUrl } from "@/actions/storage/upload";
import { showToast } from "@/components/toast";
import { FilesContext } from "@/state/context/file";
import { UploadManagerMinimize, UploadsContext } from "@/state/context/upload";
import { ERROR } from "@/types/error";
import { FileUpload } from "@/types/file";

export default function UploadFileButton() {
  const session = useSession();
  const { addFile } = useContext(FilesContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const isVerified = session.data?.user?.isVerified;
  const { updateUploads } = useContext(UploadsContext);
  const { toggleMinimize } = useContext(UploadManagerMinimize);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return showToast({
        type: "error",
        message: ERROR.NO_FILE_SELECTED
      });
    }

    toggleMinimize({
      minimize: false
    });
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
          if (res.status === "error") {
            updateUploads((prevUploads) =>
              prevUploads.map((upload) =>
                upload.id === newUpload.id
                  ? {
                      ...upload,
                      status: "error"
                    }
                  : upload
              )
            );
            return showToast({ type: "error", message: res.error });
          }
          updateUploads((prevUploads) => {
            const newUploads = prevUploads.map((upload) =>
              upload.id === newUpload.id
                ? {
                    ...upload,
                    id: res.data!,
                    status: (res.status === "success" ? "completed" : "error") as FileUpload["status"]
                  }
                : upload
            );
            return newUploads;
          });
          showToast({
            type: "success",
            message: "File uploaded successfully"
          });
          addFile({
            id: res.data!,
            name: file.name,
            size: file.size,
            createdAt: new Date(),
            isPrivate: false,
            isStarred: false
          });
        })
        .catch(() => {
          updateUploads((prevUploads) =>
            prevUploads.map((upload) =>
              upload.id === newUpload.id
                ? {
                    ...upload,
                    status: "error"
                  }
                : upload
            )
          );
          showToast({
            type: "error",
            message: ERROR.UPLOAD_FAILED
          });
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
      <input type="file" className="hidden" multiple ref={inputRef} onChange={handleFileInput} required min={1} />
    </div>
  );
}
