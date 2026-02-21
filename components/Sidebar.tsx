"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Zap,
  HelpCircle,
  User,
  LogOut,
  BookOpen,
  X,
  Upload,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setRole(parsed.role);
    }
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      href: role === 2 ? "/lecturer-dashboard" : "/dashboard",
      icon: LayoutDashboard,
    },
    { name: "My Materials", href: "/materials", icon: FileText },
    ...(role === 2
      ? [] // Lecturers might not need flashcards/quizzes in sidebar if they assume student role mainly consumes them, but requirements say "Access to summaries (read-only)" for lecturers. keeping generic for now or hiding?
      : // User Request: "Student Dashboard ... Flashcards & quizzes". Lecturer Dashboard ... "View/manage uploaded materials".
        // Let's keep common items but maybe conditionalize if strictly requested.
        // For now, let's keep them accessible but prioritize Dashboard distinction.
        [
          { name: "Flashcards", href: "/flashcards", icon: Zap },
          { name: "Quizzes", href: "/quiz", icon: HelpCircle },
        ]),
    { name: "Account", href: "/settings", icon: User },
  ];

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[var(--border)] flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
      >
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          {/* Logo */}
          {/* <div className="flex items-center justify-center h-16 border-b border-gray-200"> */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">StudyMate</span>
          </div>
          {/* </div> */}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--secondary)] text-[var(--primary)] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[var(--primary)]"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Upload */}
        {/* Quick Upload - Lecturer Only (Role 2) */}
        {role === 2 && (
          <div className="mx-4 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Upload size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Quick Upload
              </span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              Drop files here or click to upload
            </p>
            <button
              onClick={() => navigateTo("/upload")}
              className="w-full py-2 px-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Material
            </button>
          </div>
        )}

        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={async () => {
              try {
                await api.post("/logout");
              } catch (e) {
                console.error("Logout error", e);
              }
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
