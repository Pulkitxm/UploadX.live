import { redirect } from "next/navigation";

import { auth } from "@/auth";
import NavPane from "@/components/Explorer/NavPane";
import { ERROR } from "@/types/error";

export default async function HomePage() {
  const session = await auth();
  if (!session || !session?.user) {
    return redirect("/login?error=" + ERROR.UNAUTHORIZED);
  } else {
    return (
      <div>
        <NavPane />
      </div>
    );
  }
}
