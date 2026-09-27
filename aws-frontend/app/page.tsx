"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Replace this URL with your actual API URL
      const API_URL = "https://kdt90p4fqh.execute-api.us-east-1.amazonaws.com/prod/analyze";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to connect to the AI Brain." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          🧠 AWS Arsenal AI
        </h1>
        <p className="text-slate-500 text-center mb la-6">
          Enter any messy text and let the Cloud Brain extract the data.
        </p>

        <div className="space-y-4">
          <textarea
            className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
            placeholder="Paste your text here (e.g., an invoice or a medical note)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:bg-slate-400"
          >
            {loading ? "AI is Thinking..." : "Analyze with Bedrock AI"}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-slate-900 rounded-xl overflow-hidden">
            <h2 className="text-blue-400 text-sm font-mono mb-2">AI Extraction Result:</h2>
            <pre className="text-green-400 font-mono text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}