"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState } from "react";
import FinanceForm from "@/components/FinanceForm";
import FinanceResult from "@/components/FinanceResult";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (formData: any) => {
    try
    {
      setLoading(true);
      setResult(null);

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error)
    {
      console.error("Error analyzing data", error);
    } finally
    {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Financial Planner</h1>

      <FinanceForm onAnalyze={handleAnalyze} />

      {loading && <LoadingSpinner />}
      {result && <FinanceResult data={result} />}
    </main>
  );
}
