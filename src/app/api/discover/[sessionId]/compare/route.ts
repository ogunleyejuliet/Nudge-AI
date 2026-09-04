import { NextRequest, NextResponse } from "next/server";
import {
  getSessionEvaluationsData,
} from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const evaluations = await getSessionEvaluationsData(sessionId);

    const comparisonData = evaluations.map((ev) => {
      const problem = ev.problem;
      const dimensionScores: Record<string, number> = {};
      for (const d of ev.dimensions) {
        dimensionScores[d.dimension] = d.score;
      }
      return {
        evaluationId: ev.id,
        problemId: ev.problemId,
        problemTitle: problem?.title || "Unknown",
        problemDescription: problem?.description || "",
        affectedUsers: problem?.affectedUsers || "",
        whyItMatters: problem?.whyItMatters || "",
        confidence: problem?.confidence || "low",
        overallScore: ev.overallScore,
        overallLabel: ev.overallLabel,
        dimensions: dimensionScores,
        strengths: ev.strengths,
        weaknesses: ev.weaknesses,
        uncertainties: ev.uncertainties,
      };
    });

    return NextResponse.json(comparisonData);
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
