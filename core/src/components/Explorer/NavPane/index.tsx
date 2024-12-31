"use client";

import React, { useContext } from "react";
import { TbReload } from "react-icons/tb";

import SearchBar from "@/components/Explorer/NavPane/Searchbar";
import UploadFileButton from "@/components/Explorer/NavPane/UploadFileButton";
import { Button } from "@/components/ui/button";
import { FilesContext } from "@/state/context/file";

export default function NavPane() {
  const { reload } = useContext(FilesContext);

  return (
    <div className="flex gap-4 p-5">
      <SearchBar />
      <Button variant="outline" onClick={reload} className="h-full rounded-lg p-2">
        <TbReload className="h-full w-5" />
      </Button>
      <UploadFileButton />
    </div>
  );
}
