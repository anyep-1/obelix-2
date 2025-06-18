"use client";

import { useEffect, useState } from "react";
import DataQuestion from "@/components/Plan/DataQuestion";
import apiService from "@/app/services/apiServices";

const QuestionPage = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.get("/me").then((res) => {
      setRole(res.user?.role || "");
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="p-6">Memuat data user...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Question</h1>
      <DataQuestion role={role} />
    </div>
  );
};

export default QuestionPage;
