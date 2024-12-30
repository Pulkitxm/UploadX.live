"use client";

import React from "react";
import SearchBar from "@/components/Explorer/NavPane/Searchbar";
import UploadFileButton from "@/components/Explorer/NavPane/UploadFileButton";

export default function NavPane() {
  return (
    <div className="flex gap-4 p-5">
      <SearchBar />
      <UploadFileButton />
    </div>
  );
}
