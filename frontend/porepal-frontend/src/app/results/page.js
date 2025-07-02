"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

// This page expects the analysis data to be in the format:
// { problem: string, description: string, solutions: string[] }
// The data is passed via the 'data' query parameter as a JSON string.

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  let analysis = null;
  try {
    analysis = dataParam ? JSON.parse(dataParam) : null;
  } catch (e) {
    analysis = null;
  }

  // Example fallback structure if data is missing
  if (!analysis) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
        <p>There was an issue retrieving your skincare analysis results.</p>
      </div>
    );
  }

  // Example: assuming analysis = { problem: string, description: string, solutions: string[] }
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Skincare Analysis Results</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Problem</h2>
        <p className="mb-2">{analysis.problem || "Unknown problem"}</p>
        <h3 className="text-lg font-semibold mt-4">Description</h3>
        <p className="mb-2">
          {analysis.description || "No description available."}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Recommended Solutions</h3>
        <ul className="list-disc pl-6">
          {(analysis.solutions || []).map((solution, idx) => (
            <li key={idx}>{solution}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
