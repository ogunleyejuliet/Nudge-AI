import { NextRequest, NextResponse } from "next/server";
import { refineConceptSection } from "@/lib/ai";
import { REFINABLE_SECTIONS } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, currentContent, problemTitle, problemDescription } = body;

    if (!section || !(section in REFINABLE_SECTIONS)) {
      return NextResponse.json(
        { error: `Invalid section. Must be one of: ${Object.keys(REFINABLE_SECTIONS).join(", ")}` },
        { status: 400 }
      );
    }

    if (currentContent === undefined || currentContent === null) {
      return NextResponse.json(
        { error: "currentContent is required" },
        { status: 400 }
      );
    }

    if (!problemTitle) {
      return NextResponse.json(
        { error: "problemTitle is required" },
        { status: 400 }
      );
    }

    const refined = await refineConceptSection(
      section,
      currentContent,
      problemTitle,
      problemDescription || ""
    );

    return NextResponse.json({ refined });
  } catch (error) {
    console.error("Refine concept error:", error);
    return NextResponse.json(
      { error: "Refinement failed. Please try again." },
      { status: 500 }
    );
  }
}
