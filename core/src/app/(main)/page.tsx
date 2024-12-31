import { redirect } from "next/navigation";

import { auth } from "@/auth";
import FilesList from "@/components/Explorer/FilesList";
import NavPane from "@/components/Explorer/NavPane";
import { ERROR } from "@/types/error";

export default async function HomePage() {
  const session = await auth();
  if (!session || !session?.user) {
    return redirect("/login?error=" + ERROR.UNAUTHORIZED);
  } else {
    return (
      <div className="flex h-full w-full flex-col p-5">
        <NavPane />
        <FilesList />
      </div>
    );
  }
}
