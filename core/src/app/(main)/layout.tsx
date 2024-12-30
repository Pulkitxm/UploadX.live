import { auth } from "@/auth";
import FileUploader from "@/components/Explorer/FileUploader";
import NotVerified from "@/components/NotVerified";
import Sidebar from "@/components/Sidebar";
import Providers from "@/state/providers";

export default async function MainAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user || session?.user?.email === null) {
    return children;
  }

  return (
    <Providers session={session}>
      <div className="flex h-full flex-col">
        <NotVerified session={session} />
        <FileUploader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
