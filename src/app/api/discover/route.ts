import { NextRequest, NextResponse } from "next/server";
import { discoverProblems } from "@/lib/ai";
import {
  startResearch,
  completeResearch,
  failResearch,
  saveAIProblems,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const trimmedTopic = topic.trim();
    if (trimmedTopic.length > 200) {
      return NextResponse.json(
        { error: "Topic must be 200 characters or less" },
        { status: 400 }
      );
    }

    const sessionId = await startResearch(trimmedTopic);

    try {
      const aiProblems = await discoverProblems(trimmedTopic);

      if (!aiProblems || aiProblems.length === 0) {
        await failResearch(sessionId, "No problems found for this topic");
        return NextResponse.json({
          sessionId,
          status: "completed",
          problemCount: 0,
        });
      }

      await saveAIProblems(sessionId, aiProblems);
      await completeResearch(sessionId);

      return NextResponse.json({
        sessionId,
        status: "completed",
        problemCount: aiProblems.length,
      });
    } catch (aiError) {
      const message =
        aiError instanceof Error ? aiError.message : "AI research failed";
      await failResearch(sessionId, message);
      return NextResponse.json(
        {
          error:
            "Research failed. Please check your OPENAI_API_KEY environment variable.",
          sessionId,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Discovery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
