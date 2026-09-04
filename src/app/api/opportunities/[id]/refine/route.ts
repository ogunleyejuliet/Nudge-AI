import { NextRequest, NextResponse } from "next/server";
import { getOpportunity, updateOpportunityConcept } from "@/lib/db";
import { refineConceptSection } from "@/lib/ai";
import { REFINABLE_SECTIONS } from "@/lib/types";
import type { ProductConcept } from "@/lib/types";

function validateUserId(request: NextRequest): string | null {
  const userId = request.headers.get("x-user-id");
  if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return null;
  }
  return userId;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = validateUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { section } = body;

    if (!section || !(section in REFINABLE_SECTIONS)) {
      return NextResponse.json(
        { error: `Invalid section. Must be one of: ${Object.keys(REFINABLE_SECTIONS).join(", ")}` },
        { status: 400 }
      );
    }

    const opportunity = await getOpportunity(userId, id);
    if (!opportunity) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const concept = opportunity.concept as ProductConcept;
    const currentContent = concept[section as keyof ProductConcept];

    if (currentContent === undefined || currentContent === null) {
      return NextResponse.json(
        { error: `Section "${section}" has no content to refine` },
        { status: 400 }
      );
    }

    const refined = await refineConceptSection(
      section,
      currentContent as string | string[],
      opportunity.problem.title,
      opportunity.problem.description
    );

    const updatedConcept = { ...concept, [section]: refined };
    const updated = await updateOpportunityConcept(userId, id, updatedConcept);

    if (!updated) {
      return NextResponse.json({ error: "Failed to save refined section" }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Refine section error:", error);
    return NextResponse.json(
      { error: "Refinement failed. Please try again." },
      { status: 500 }
    );
  }
}
