// app/finance/page.tsx
"use client";

import { useState } from "react";
import FinanceForm from "@/components/FinanceForm";
import FinanceResult from "@/components/FinanceResult";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function FinancePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async (formData: any) => {
        try
        {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResult(data);
        } catch (error)
        {
            console.error("Error analyzing finance:", error);
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Finance Analyzer</h1>

            {loading && <LoadingSpinner />}

            {!loading && !result && <FinanceForm onAnalyze={handleAnalyze} />}

            {!loading && result && <FinanceResult result={result} />}
        </div>
    );
}
