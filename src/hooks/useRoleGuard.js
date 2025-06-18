"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiServices";

export default function useRoleGuard(allowedRoles = []) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await apiService.get("/me");
        setMe(res);

        if (!allowedRoles.includes(res.role)) {
          if (res.role === "Admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/dashboard/dashboard");
          }
        }
      } catch {
        router.replace("/");
      } finally {
        setLoading(false); // ⬅️ Selalu dipanggil
      }
    };

    checkRole();
  }, [allowedRoles]);

  return { me, loading };
}
