"use client";

import { useEffect, useState } from "react";
import DataToolsAssessment from "@/components/Plan/DataToolsAssesment";
import apiService from "@/app/services/apiServices";
import LoadingSpinner from "@/components/all/LoadingSpinner";

const ToolsAssessmentPage = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await apiService.get("/me");
      console.log("Role user dari API:", res.user?.role); // DEBUG
      setRole(res.user?.role || "");
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tools Assessment</h1>
      <DataToolsAssessment role={role} />
    </div>
  );
};

export default ToolsAssessmentPage;
