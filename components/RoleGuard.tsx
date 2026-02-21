"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: number[]; // 0 for Student, 2 for Lecturer
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(user);
    if (allowedRoles.includes(parsedUser.role)) {
      setAuthorized(true);
    } else {
      toast.error("You are not authorized to view this page.");
      // Redirect to their appropriate dashboard
      if (parsedUser.role === 2) {
        router.push("/lecturer-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router, allowedRoles]);

  if (!authorized) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
