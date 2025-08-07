"use client";

import { useSearchParams } from "next/navigation";
import { React, useState, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";

// This page expects the analysis data to be in the format:
// { problem: string, description: string, solutions: string[] }
// The data is passed via the 'data' query parameter as a JSON string.

function ResultsPageInner() {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 animate-fadein">
        <h1 className="text-4xl font-heading font-extrabold text-black mb-2 flex items-center gap-2">
          <span role="img" aria-label="no-results">
            ❌
          </span>{" "}
          No Results Found
        </h1>
        <p className="text-muted-foreground mb-6 font-sans">
          There was an issue retrieving your skincare analysis results.
        </p>
        <Button asChild emoji="🔄">
          <a href="/">Try Again</a>
        </Button>
        <MobileNav />
      </div>
    );
  }

  // Example: assuming analysis = { problem: string, description: string, solutions: string[] }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-2 animate-fadein">
      <main className="w-full max-w-2xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-heading font-extrabold text-black text-center tracking-tight mt-8 mb-2 select-none flex items-center gap-2">
          <span role="img" aria-label="results">
            🔬
          </span>{" "}
          Your Results
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-4 font-sans select-none">
          Personalized skin analysis powered by AI.
        </p>
        <div className="w-full grid gap-6 md:grid-cols-2">
          {analysis?.solutions &&
          Array.isArray(analysis.solutions) &&
          analysis.solutions.length > 0 ? (
            analysis.solutions.map(([problem, solutions], idx) => (
              <Card key={problem} emoji="💡">
                <h2 className="text-lg font-heading font-bold mb-2 text-center capitalize text-black tracking-wide select-none flex items-center gap-1">
                  {problem.replace(/_/g, " ")}
                </h2>
                <div className="w-28 h-28 mb-3 flex items-center justify-center bg-secondary rounded-xl overflow-hidden border-2 border-border">
                  <img
                    src={`/${problem}.jpg`}
                    alt={problem}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-base font-sans font-semibold mb-1 text-black w-full text-left">
                  Recommended Solutions:
                </h3>
                <ul className="list-disc list-inside text-left w-full space-y-1 text-muted-foreground text-sm">
                  {Array.isArray(solutions) && solutions.length > 0 ? (
                    solutions.map((sol, i) => <li key={i}>{sol}</li>)
                  ) : (
                    <li>No solutions found.</li>
                  )}
                </ul>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center animate-fadein-slow">
              <h2 className="text-xl font-heading font-bold mb-2 text-black flex items-center gap-1">
                <span role="img" aria-label="no-problems">
                  🎉
                </span>{" "}
                No skin problems detected.
              </h2>
              <p className="text-muted-foreground font-sans">
                Try uploading clearer images or different angles for better
                analysis.
              </p>
            </div>
          )}
        </div>
        <Button asChild emoji="🔁" className="mt-8">
          <a href="/">Try Another Analysis</a>
        </Button>
        <div className="mt-4 text-center text-xs text-muted-foreground select-none animate-fadein-slow">
          <span>
            Your privacy is protected. Images are only used for analysis.
          </span>
        </div>
      </main>
      <MobileNav />
      <style jsx global>{`
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-fadein-slow {
          animation: fadein 1.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsPageInner />
    </Suspense>
  );
}
