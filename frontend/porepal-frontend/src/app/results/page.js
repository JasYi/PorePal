"use client";

import { useSearchParams } from "next/navigation";
import { React, useState } from "react";

// This page expects the analysis data to be in the format:
// { problem: string, description: string, solutions: string[] }
// The data is passed via the 'data' query parameter as a JSON string.

export default function ResultsPage() {
  const searchParams = useSearchParams();
  // const [data, setData] = useState({});
  const dataParam = searchParams.get("data");
  let analysis = null;
  try {
    analysis = dataParam ? JSON.parse(dataParam) : null;

    console.log(analysis);

    // setData(analysis);
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
      <h1 className="text-3xl font-bold text-center mb-6">
        Your Skin Analysis Results
      </h1>
      <div className="grid gap-8 md:grid-cols-2">
        {analysis?.solutions &&
        Array.isArray(analysis.solutions) &&
        analysis.solutions.length > 0 ? (
          analysis.solutions.map(([problem, solutions], idx) => (
            <div
              key={problem}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2 text-center capitalize">
                {problem.replace(/_/g, " ")}
              </h2>
              {/* Example image for the skin problem */}
              <div className="w-40 h-40 mb-4 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={`/examples/${problem}.jpg`}
                  alt={problem}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = `/${problem}.jpg`;
                  }}
                />
              </div>
              <h3 className="text-lg font-medium mb-2 text-left w-full">
                Recommended Solutions:
              </h3>
              <ul className="list-disc list-inside text-left w-full space-y-1">
                {Array.isArray(solutions) && solutions.length > 0 ? (
                  solutions.map((sol, i) => <li key={i}>{sol}</li>)
                ) : (
                  <li>No solutions found.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No skin problems detected.
            </h2>
            <p>
              Try uploading clearer images or different angles for better
              analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
