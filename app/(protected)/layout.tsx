import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import Sidebar from "@/components/sidebar/Sidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

// Force dynamic rendering since we use getServerSession which requires headers
export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Session error:", error);
    redirect("/login");
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}

