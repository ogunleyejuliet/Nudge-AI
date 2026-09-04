import { NextRequest, NextResponse } from "next/server";
import { selectProblemById } from "@/lib/db";

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

    selectProblemById(problemId, sessionId);

    return NextResponse.json({ success: true, selectedProblemId: problemId });
  } catch (error) {
    console.error("Selection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
