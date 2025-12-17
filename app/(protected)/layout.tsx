import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/components/sidebar/Sidebar";
import MobileSidebar from "@/components/sidebar/MobileSidebar";

// Force dynamic rendering since we use getServerSession which requires headers
export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

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

