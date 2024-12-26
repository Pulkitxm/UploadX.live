import React from "react";
import SearchBar from "./Searchbar";
import UploadFileButton from "./UploadFileButton";

export default function NavPane() {
  return (
    <div className="flex gap-4 p-5">
      <SearchBar />
      <UploadFileButton />
    </div>
  );
}
