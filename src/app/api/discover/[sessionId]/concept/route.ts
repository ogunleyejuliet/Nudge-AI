import { NextRequest, NextResponse } from "next/server";
import { generateProductConcept } from "@/lib/ai";
import {
  getProblemDetails,
  getEvaluation,
  saveProductConcept,
  getProductConceptForProblem,
  getSessionProductConceptsList,
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

    const existing = await getProductConceptForProblem(problemId);
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

    const evaluation = await getEvaluation(problemId);
    const evaluationSummary = evaluation
      ? `Overall Score: ${evaluation.overallScore}/10 (${evaluation.overallLabel})\nStrengths: ${evaluation.strengths.join("; ")}\nWeaknesses: ${evaluation.weaknesses.join("; ")}\nUncertainties: ${evaluation.uncertainties.join("; ")}`
      : "No evaluation available.";

    const concept = await generateProductConcept(
      problem.title,
      problem.description,
      problem.affectedUsers,
      problem.whyItMatters,
      evaluationSummary
    );

    const evaluationId = evaluation?.id || "";
    const conceptId = await saveProductConcept(
      problemId,
      sessionId,
      evaluationId,
      concept
    );

    return NextResponse.json({
      id: conceptId,
      problemId,
      sessionId,
      evaluationId,
      concept,
    });
  } catch (error) {
    console.error("Concept generation error:", error);
    return NextResponse.json(
      { error: "Product concept generation failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const concepts = await getSessionProductConceptsList(sessionId);
    return NextResponse.json(concepts);
  } catch (error) {
    console.error("Concept fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
