import { Loader2 } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

import { FilesContext } from "@/state/context/file";

export default function SearchBar() {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchQuery, setSearchQuery } = useContext(FilesContext);

  const ICON = loading ? Loader2 : FaSearch;

  return (
    <div
      className="relative flex h-10 w-full items-center gap-2 rounded-md border-2 border-gray-300 px-4 py-2"
      onClick={() => inputRef.current?.focus()}
    >
      <ICON
        className={`h-4 w-4 cursor-pointer text-gray-500 ${loading ? "animate-spin" : ""}`}
        onClick={(prev) => setLoading(!prev)}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for files"
        className="h-full flex-grow border-none bg-transparent outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
