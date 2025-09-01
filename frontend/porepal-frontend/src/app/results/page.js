"use client";

import { React, Suspense } from "react";
import { useResults } from "../ResultsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import { useState } from "react";

// This page expects the analysis data to be in the format:
// { problem: string, description: string, solutions: string[] }
// The data is passed via the 'data' query parameter as a JSON string.

function ResultsPageInner() {
  const { results: analysis } = useResults();

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

  // Gather all unique labels and solutions
  const labels = new Array();
  const solutions = new Array();

  if (analysis && Array.isArray(analysis.solutions)) {
    analysis.solutions.forEach((sol) => {
      labels.push(sol[0]);
      solutions.push(sol[1]);
    });
  }

  const [cardPage, setCardPage] = useState(0);
  const totalCards = labels.length;

  if (labels.length > 0) {
    // get information for current page
    const currentLabel = labels[cardPage];
    const currentSolutions = solutions[cardPage];
    const imagesToShow = analysis.images[currentLabel];
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
          <div className="w-full flex flex-col items-center gap-4">
            <h2 className="text-2xl font-heading font-bold mb-2 text-center capitalize text-black tracking-wide select-none flex items-center gap-1">
              {currentLabel.replace(/_/g, " ")}
            </h2>
            <Card emoji="🖼️">
              <div className="w-full flex flex-wrap gap-6 justify-center">
                {imagesToShow.map((img, idx) => {
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="image-container w-48 h-48 mb-3 flex items-center justify-center bg-secondary rounded-xl overflow-hidden border-2 border-border">
                        <img
                          src={`data:image/jpeg;base64,${img}`}
                          alt={`Analyzed skin`}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mx-auto">
                <h3 className="text-base font-sans font-semibold mb-1 text-black w-full text-left">
                  Solutions:
                </h3>
                <ul className="list-disc list-inside text-left w-full space-y-1 text-muted-foreground text-sm">
                  {currentSolutions.map((sol, i) => (
                    <li key={i}>{sol}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  onClick={() => setCardPage((p) => Math.max(0, p - 1))}
                  disabled={cardPage === 0}
                  emoji="⬅️"
                >
                  Previous
                </Button>
                <span className="text-sm font-semibold">
                  {cardPage + 1} / {totalCards}
                </span>
                <Button
                  onClick={() =>
                    setCardPage((p) => Math.min(totalCards - 1, p + 1))
                  }
                  disabled={cardPage === totalCards - 1}
                  emoji="➡️"
                >
                  Next
                </Button>
              </div>
            </Card>
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
          .image-container {
            width: 12rem;
            height: 12rem;
          }
          @media (max-width: 640px) {
            .image-container {
              width: 7rem;
              height: 7rem;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsPageInner />
    </Suspense>
  );
}
