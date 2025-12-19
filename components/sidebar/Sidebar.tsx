"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  KanbanSquare,
  BarChart3,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Videos", href: "/videos", icon: Video },
  { name: "Kanban", href: "/kanban", icon: KanbanSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Upload", href: "/upload", icon: Upload },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 dark:bg-gray-950 text-white border-r border-gray-800 dark:border-gray-800">
      <div className="flex h-16 items-center justify-center border-b border-gray-800 dark:border-gray-700 px-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Sanctum Creative
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gray-800 dark:bg-gray-700 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 dark:border-gray-700 p-4">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

