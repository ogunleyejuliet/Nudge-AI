import { NextRequest, NextResponse } from "next/server";
import { evaluateProblem } from "@/lib/ai";
import {
  getProblemDetails,
  saveEvaluation,
  getEvaluation,
  getSessionEvaluationsData,
} from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { problemId } = body;

    if (!problemId) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    const existing = await getEvaluation(problemId);
    if (existing) {
      return NextResponse.json(existing);
    }

    const problem = await getProblemDetails(problemId);
    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    const evaluation = await evaluateProblem(
      problem.title,
      problem.description,
      problem.affectedUsers,
      problem.whyItMatters,
      problem.confidence,
      problem.evidences,
      problem.inferences,
      problem.assumptions
    );

    const evaluationId = await saveEvaluation(
      problemId,
      sessionId,
      evaluation.overallScore,
      evaluation.overallLabel,
      evaluation.overallExplanation,
      evaluation.dimensions,
      evaluation.strengths,
      evaluation.weaknesses,
      evaluation.uncertainties,
      evaluation.needsValidation
    );

    return NextResponse.json({
      id: evaluationId,
      problemId,
      sessionId,
      ...evaluation,
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Evaluation failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      const evals = await getSessionEvaluationsData(sessionId);
      return NextResponse.json(evals);
    }

    const evaluation = await getEvaluation(problemId);
    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluation fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
