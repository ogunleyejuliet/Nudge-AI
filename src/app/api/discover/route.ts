import { NextRequest, NextResponse } from "next/server";
import { discoverProblems } from "@/lib/ai";
import {
  startResearch,
  completeResearch,
  failResearch,
  saveAIProblems,
} from "@/lib/db";

const VAGUE_TOPICS = new Set([
  "ideas",
  "problems",
  "opportunities",
  "products",
  "apps",
  "software",
  "technology",
  "tech",
  "business idea",
  "business ideas",
  "things",
  "some",
  "stuff",
]);

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

    const normalized = trimmedTopic.toLowerCase();
    if (
      trimmedTopic.length < 4 ||
      VAGUE_TOPICS.has(normalized) ||
      VAGUE_TOPICS.has(normalized.replace(/[!.,?]+$/, ""))
    ) {
      return NextResponse.json(
        {
          error:
            "That topic is too broad. Try a more specific one, for example 'small business accounting' instead of 'business'.",
        },
        { status: 422 }
      );
    }

    const sessionId = await startResearch(trimmedTopic);

    try {
      const aiProblems = await discoverProblems(trimmedTopic);

      if (!aiProblems || aiProblems.length === 0) {
        await failResearch(
          sessionId,
          "No specific problems found. Try a more detailed topic."
        );
        return NextResponse.json(
          {
            error:
              "No specific problems found for this topic. Try something more specific, for example 'household energy bill forecasting' instead of 'energy'.",
            sessionId,
          },
          { status: 422 }
        );
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
      const timedOut =
        /timeout|timed out|abort/i.test(message);
      return NextResponse.json(
        {
          error: timedOut
            ? "Research timed out. Please try again with a more specific topic."
            : "Research failed. Please check your OPENAI_API_KEY environment variable.",
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
