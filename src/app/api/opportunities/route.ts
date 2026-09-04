import { NextRequest, NextResponse } from "next/server";
import { saveOpportunity, listOpportunities, getEvaluation, getProblemDetails, getSessionData } from "@/lib/db";

function validateUserId(request: NextRequest): string | null {
  const userId = request.headers.get("x-user-id");
  if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return null;
  }
  return userId;
}

export async function GET(request: NextRequest) {
  const userId = validateUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const opportunities = await listOpportunities(userId);
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("List opportunities error:", error);
    return NextResponse.json(
      { error: "Failed to load opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = validateUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sessionId, problemId } = body;

    if (!sessionId || !problemId) {
      return NextResponse.json(
        { error: "sessionId and problemId are required" },
        { status: 400 }
      );
    }

    const problem = await getProblemDetails(problemId);
    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    const evaluation = await getEvaluation(problemId);
    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found. Evaluate the problem first." },
        { status: 400 }
      );
    }

    // Import concept retrieval
    const { getProductConceptForProblem } = await import("@/lib/db");
    const conceptRow = await getProductConceptForProblem(problemId);
    if (!conceptRow) {
      return NextResponse.json(
        { error: "Product concept not found. Generate a concept first." },
        { status: 400 }
      );
    }

    const sessionData = await getSessionData(sessionId);
    const topic = sessionData?.topic || "";

    const result = await saveOpportunity(
      userId,
      sessionId,
      topic,
      {
        id: problem.id,
        title: problem.title,
        description: problem.description,
        affectedUsers: problem.affectedUsers,
        whyItMatters: problem.whyItMatters,
        confidence: problem.confidence,
      },
      problem.evidences,
      problem.inferences,
      problem.assumptions,
      evaluation,
      conceptRow.concept
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Save opportunity error:", error);
    return NextResponse.json(
      { error: "Failed to save opportunity" },
      { status: 500 }
    );
  }
}
