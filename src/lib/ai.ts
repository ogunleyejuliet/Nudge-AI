import OpenAI from "openai";
import type { AIProblem, EvaluationDimension, DimensionResult, ProductConcept } from "./types";
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "./types";

const MOCK_MODE = process.env.OPENAI_MOCK === "true";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Problem Discovery ──

const DISCOVERY_PROMPT = `You are an AI research assistant that helps discover problems and opportunities in a given market or topic.

Your task is to identify real, meaningful problems that people or businesses face in the given topic area.

CRITICAL RULES:
1. NEVER fabricate sources, URLs, statistics, quotes, customer experiences, or market data.
2. Clearly distinguish between:
   - EVIDENCE: Information that can be traced to a known type of source (industry reports, published research, public statements, known market patterns)
   - INFERENCE: Logical conclusions you draw from evidence
   - ASSUMPTION: Things you believe to be true but cannot verify
3. If reliable evidence cannot be established, mark the confidence as "low" and explicitly note the lack of evidence.
4. For each piece of evidence, provide a realistic source type and name, but do NOT fabricate specific URLs.
5. Base problems on well-known industry patterns and widely-reported challenges.

Return your response as a JSON object with a "problems" array. Each problem must follow this exact structure:
{
  "problems": [
    {
      "title": "Problem title (concise)",
      "description": "Detailed description of the problem",
      "affectedUsers": "Who experiences this problem",
      "whyItMatters": "Why this problem is significant",
      "confidence": "low|medium|high",
      "evidence": [
        {
          "content": "Description of the evidence",
          "source": "Source name or type",
          "sourceUrl": null,
          "strength": "low|medium|high"
        }
      ],
      "inferences": [
        {
          "content": "A logical conclusion drawn from the evidence"
        }
      ],
      "assumptions": [
        {
          "content": "An assumption that has not been independently verified"
        }
      ]
    }
  ]
}

Generate exactly 4-6 problems. Return ONLY valid JSON, no markdown, no code blocks.`;

function buildMockProblems(topic: string): AIProblem[] {
  const t = topic;
  return [
    {
      title: `Lack of accessible guidance for beginners in ${t}`,
      description: `Newcomers to ${t} consistently struggle to find clear, beginner-friendly guidance that isn't overly technical or sales-driven. Most educational content assumes prior knowledge, leaving novices lost and discouraged.`,
      affectedUsers: "Beginners and newcomers exploring this space",
      whyItMatters:
        "The onboarding friction prevents many potential users from adopting solutions in this space, representing a significant unmet market need.",
      confidence: "medium",
      evidence: [
        {
          content:
            "A well-documented general pattern across consumer education: users report high drop-off rates when learning resources assume prior knowledge.",
          source: "General industry observation",
          sourceUrl: null,
          strength: "low",
        },
        {
          content:
            "Multiple popular online communities consistently field the same beginner questions repeatedly, suggesting a persistent gap in accessible learning content.",
          source: "Community forum pattern analysis",
          sourceUrl: null,
          strength: "medium",
        },
      ],
      inferences: [
        {
          content:
            "The recurring pattern of duplicate beginner questions indicates the available resources do not adequately address the novice audience.",
        },
      ],
      assumptions: [
        {
          content: "Beginners would be willing to pay for better-structured guidance if it solved their core problem.",
        },
      ],
    },
    {
      title: `Time constraints prevent consistent engagement with ${t}`,
      description: `People interested in ${t} report that they lack the time to engage consistently. Existing tools and resources often require significant time investment, making it difficult to maintain momentum.`,
      affectedUsers: "Busy professionals and parents with limited free time",
      whyItMatters:
        "Time pressure is one of the most frequently cited reasons for abandoning attempts to improve in this area, suggesting a strong opportunity for time-efficient solutions.",
      confidence: "high",
      evidence: [
        {
          content:
            "Time scarcity is consistently reported in consumer surveys across many hobby-adjacent and self-improvement categories.",
          source: "Consumer behavior research (general)",
          sourceUrl: null,
          strength: "medium",
        },
        {
          content:
            "Products designed around short, focused sessions have seen widespread adoption across multiple domains, indicating demand for time-efficient approaches.",
          source: "Product adoption patterns",
          sourceUrl: null,
          strength: "medium",
        },
      ],
      inferences: [
        {
          content:
            "A solution that delivers meaningful progress in 5-10 minute sessions would likely outperform existing longer-format approaches.",
        },
      ],
      assumptions: [
        {
          content: "The time constraint is the primary barrier rather than cost or motivation.",
        },
      ],
    },
    {
      title: `Conflicting and contradictory information about best practices in ${t}`,
      description: `Consumers of content related to ${t} are overwhelmed by contradictory advice from different experts and sources. This makes it hard to know which approach to follow and erodes trust in the space.`,
      affectedUsers: "Enthusiasts and practitioners trying to follow best practices",
      whyItMatters:
        "The fragmentation of information creates decision fatigue and can lead users to abandon the topic or spend resources on ineffective approaches.",
      confidence: "medium",
      evidence: [
        {
          content:
            "Across rapidly evolving fields, a common consumer pain point is the proliferation of competing expert opinions without clear consensus.",
          source: "Information consumer behavior",
          sourceUrl: null,
          strength: "low",
        },
        {
          content:
            "Users frequently express frustration about contradictory guidance in online discussions and community forums.",
          source: "Community discussion analysis",
          sourceUrl: null,
          strength: "low",
        },
      ],
      inferences: [
        {
          content:
            "A curated, evidence-based decision framework would help users cut through the noise and make confident choices.",
        },
      ],
      assumptions: [
        {
          content: "Users would trust a third-party curation layer over individual expert opinions.",
        },
      ],
    },
    {
      title: `High cost of quality tools and services in ${t}`,
      description: `The most effective tools and professional services in this space are expensive, putting them out of reach for many potential users. Lower-cost alternatives are often significantly less effective.`,
      affectedUsers: "Budget-conscious consumers and small-scale practitioners",
      whyItMatters:
        "Cost is a well-established barrier across many categories, and a more accessible option could capture a large underserved market segment.",
      confidence: "low",
      evidence: [
        {
          content:
            "Price sensitivity is a widely documented general barrier in consumer markets, particularly for discretionary spending categories.",
          source: "General economic principle",
          sourceUrl: null,
          strength: "low",
        },
      ],
      inferences: [
        {
          content: "A cost-effective alternative could win significant market share by addressing the affordability gap.",
        },
      ],
      assumptions: [
        {
          content: "The quality gap between premium and budget solutions cannot be closed with innovative delivery models.",
        },
      ],
    },
    {
      title: `Difficulty tracking progress and measuring improvement in ${t}`,
      description: `Users struggle to objectively track their progress and know whether they're actually improving. Most tools offer either too much manual tracking or no meaningful feedback loops.`,
      affectedUsers: "Goal-oriented individuals who want visible improvement",
      whyItMatters:
        "Visible progress is a key motivator. Without reliable feedback, users lose motivation and disengage, even when they are technically improving.",
      confidence: "medium",
      evidence: [
        {
          content:
            "Behavior change research emphasizes the importance of feedback loops and visible progress markers for sustained engagement.",
          source: "Behavioral science research",
          sourceUrl: null,
          strength: "medium",
        },
      ],
      inferences: [
        {
          content: "A solution with automated, visible progress tracking would increase user retention and satisfaction.",
        },
      ],
      assumptions: [
        {
          content: "Users prefer automated tracking over manual logging, despite privacy considerations.",
        },
      ],
    },
  ];
}

export async function discoverProblems(topic: string): Promise<AIProblem[]> {
  if (MOCK_MODE) {
    return buildMockProblems(topic);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 4000,
    messages: [
      { role: "system", content: DISCOVERY_PROMPT },
      {
        role: "user",
        content: `Research the following topic and identify real problems and opportunities: "${topic}"\n\nFocus on genuine pain points, unmet needs, and market opportunities. Be honest about what is evidence-based versus inferred or assumed.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const parsed = JSON.parse(content);
  const problems: AIProblem[] = Array.isArray(parsed)
    ? parsed
    : parsed.problems || parsed.data || [];

  return problems.map((p) => ({
    title: p.title || "Untitled Problem",
    description: p.description || "",
    affectedUsers: p.affectedUsers || "General users",
    whyItMatters: p.whyItMatters || "",
    confidence: ["low", "medium", "high"].includes(p.confidence)
      ? p.confidence
      : "low",
    evidence: Array.isArray(p.evidence)
      ? p.evidence.map((e: AIProblem["evidence"][0]) => ({
          content: e.content || "",
          source: e.source || "Unknown",
          sourceUrl: e.sourceUrl || null,
          strength: ["low", "medium", "high"].includes(e.strength)
            ? e.strength
            : "low",
        }))
      : [],
    inferences: Array.isArray(p.inferences)
      ? p.inferences.map((i: AIProblem["inferences"][0]) => ({
          content: i.content || "",
        }))
      : [],
    assumptions: Array.isArray(p.assumptions)
      ? p.assumptions.map((a: AIProblem["assumptions"][0]) => ({
          content: a.content || "",
        }))
      : [],
  }));
}

// ── Opportunity Evaluation ──

function buildEvaluationPrompt(): string {
  const dims = (["problemSeverity", "frequency", "userPain", "existingAlternatives", "marketPotential", "competition", "evidenceStrength", "opportunityPotential"] as EvaluationDimension[]).map(d => {
    return `  - "${d}": "${DIMENSION_DESCRIPTIONS[d]}"`;
  }).join("\n");

  return `You are an AI evaluation assistant. You will assess a business opportunity based on the available evidence.

IMPORTANT: Your scores are AI-assisted assessments, NOT objective market truth. Label uncertainty clearly.

EVALUATION DIMENSIONS (score each 1-10):
${dims}

SCORING RULES:
- Score 1-3: Low/Weak
- Score 4-6: Moderate
- Score 7-8: Strong
- Score 9-10: Very Strong

For "existingAlternatives": Score HIGH (7-10) if few alternatives exist (big gap). Score LOW (1-3) if well-addressed.
For "competition": Score HIGH (7-10) if competition is low (open market). Score LOW (1-3) if highly competitive.
For "evidenceStrength": Score based on how strong the provided evidence is.

Return a JSON object with this exact structure:
{
  "dimensions": [
    {
      "dimension": "problemSeverity",
      "score": 7,
      "explanation": "Why this score (1-2 sentences)",
      "supportingEvidence": "Specific evidence or reasoning",
      "evidenceType": "evidence|inference|assumption"
    }
  ],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "uncertainties": ["uncertainty 1"],
  "needsValidation": ["what needs to be validated 1"],
  "overallLabel": "Strong|Moderate|Weak Opportunity",
  "overallExplanation": "2-3 sentence summary of the overall assessment"
}

Return ONLY valid JSON, no markdown.`;
}

function buildMockEvaluation(
  problem: { title: string; description: string; affectedUsers: string; whyItMatters: string; confidence: string; evidences: Array<{ strength: string }>; inferences: Array<{ content: string }>; assumptions: Array<{ content: string }> }
): { dimensions: DimensionResult[]; strengths: string[]; weaknesses: string[]; uncertainties: string[]; needsValidation: string[]; overallScore: number; overallLabel: string; overallExplanation: string } {
  const evCount = problem.evidences?.length || 0;
  const highEv = problem.evidences?.filter((e) => e.strength === "high").length || 0;

  const evidenceBase = problem.confidence === "high" ? 7 : problem.confidence === "medium" ? 5 : 3;

  const dims: DimensionResult[] = [
    { dimension: "problemSeverity", score: problem.confidence === "high" ? 7 : 5, label: DIMENSION_LABELS.problemSeverity, explanation: `Based on available evidence, this appears to be a ${problem.confidence}-severity problem for affected users.`, supportingEvidence: problem.whyItMatters, evidenceType: "inference" },
    { dimension: "frequency", score: 6, label: DIMENSION_LABELS.frequency, explanation: "This problem is encountered regularly by affected users based on the described patterns.", supportingEvidence: problem.description, evidenceType: "inference" },
    { dimension: "userPain", score: problem.confidence === "high" ? 7 : 6, label: DIMENSION_LABELS.userPain, explanation: "Users experience meaningful frustration from this problem based on the evidence provided.", supportingEvidence: problem.description, evidenceType: "inference" },
    { dimension: "existingAlternatives", score: 5, label: DIMENSION_LABELS.existingAlternatives, explanation: "Some alternatives exist but they do not fully address the core problem.", supportingEvidence: problem.description, evidenceType: "assumption" },
    { dimension: "marketPotential", score: 6, label: DIMENSION_LABELS.marketPotential, explanation: "The affected user base appears to be meaningful in size.", supportingEvidence: problem.affectedUsers, evidenceType: "inference" },
    { dimension: "competition", score: 6, label: DIMENSION_LABELS.competition, explanation: "The competitive landscape has room for differentiated solutions.", supportingEvidence: "Based on the identified gap in existing alternatives", evidenceType: "inference" },
    { dimension: "evidenceStrength", score: evidenceBase, label: DIMENSION_LABELS.evidenceStrength, explanation: `${evCount} pieces of evidence found, ${highEv} with high strength. Evidence is primarily inferential.`, supportingEvidence: `Evidence count: ${evCount}, high-strength: ${highEv}`, evidenceType: "evidence" },
    { dimension: "opportunityPotential", score: Math.round((evidenceBase + 6 + 6) / 3), label: DIMENSION_LABELS.opportunityPotential, explanation: "Moderate opportunity potential based on available evidence.", supportingEvidence: "Calculated from problem evidence and market signals", evidenceType: "inference" },
  ];

  const overallScore = Math.round(dims.reduce((sum, d) => {
    const weights: Record<string, number> = { problemSeverity: 0.15, frequency: 0.12, userPain: 0.15, existingAlternatives: 0.12, marketPotential: 0.15, competition: 0.10, evidenceStrength: 0.10, opportunityPotential: 0.11 };
    return sum + d.score * (weights[d.dimension] || 0.125);
  }, 0) * 10) / 10;

  return {
    dimensions: dims,
    strengths: [
      "Problem is clearly defined and affects a specific user group",
      problem.confidence !== "low" ? "Moderate to strong evidence supports this problem" : "Some evidence exists, though it needs strengthening",
    ],
    weaknesses: [
      problem.confidence === "low" ? "Limited evidence base — claims need validation" : "Evidence is primarily inferential rather than directly sourced",
      "Market size and willingness to pay are unvalidated",
    ],
    uncertainties: [
      "How large is the actual addressable market?",
      "What is the willingness-to-pay of affected users?",
    ],
    needsValidation: [
      "Conduct user interviews with 10-15 affected users",
      "Validate willingness to pay through surveys or landing page tests",
      "Benchmark against existing alternatives in the space",
    ],
    overallScore,
    overallLabel: overallScore >= 7 ? "Strong Opportunity" : overallScore >= 5 ? "Moderate Opportunity" : "Weak Opportunity",
    overallExplanation: `This opportunity scores ${overallScore}/10. ${
      overallScore >= 7
        ? "The evidence suggests a meaningful gap in the market with strong potential."
        : overallScore >= 5
          ? "There is potential here, but several key assumptions need validation before proceeding."
          : "The opportunity is limited based on available evidence. Consider exploring adjacent problems."
    } This is an AI-assisted assessment and should be validated with real market research.`,
  };
}

export async function evaluateProblem(
  title: string,
  description: string,
  affectedUsers: string,
  whyItMatters: string,
  confidence: string,
  evidences: Array<{ content: string; source: string; strength: string }>,
  inferences: Array<{ content: string }>,
  assumptions: Array<{ content: string }>
): Promise<{ dimensions: DimensionResult[]; strengths: string[]; weaknesses: string[]; uncertainties: string[]; needsValidation: string[]; overallScore: number; overallLabel: string; overallExplanation: string }> {
  if (MOCK_MODE) {
    return buildMockEvaluation({ title, description, affectedUsers, whyItMatters, confidence, evidences, inferences, assumptions });
  }

  const evidenceSummary = evidences.map(e => `- [${e.strength}] ${e.content} (Source: ${e.source})`).join("\n");
  const inferenceSummary = inferences.map(i => `- ${i.content}`).join("\n");
  const assumptionSummary = assumptions.map(a => `- ${a.content}`).join("\n");

  const prompt = buildEvaluationPrompt();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.5,
    max_tokens: 3000,
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: `Evaluate this opportunity:\n\nTitle: ${title}\nDescription: ${description}\nAffected Users: ${affectedUsers}\nWhy It Matters: ${whyItMatters}\nConfidence: ${confidence}\n\nEvidence:\n${evidenceSummary || "None provided"}\n\nInferences:\n${inferenceSummary || "None"}\n\nAssumptions:\n${assumptionSummary || "None"}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);

  const validDimensions: EvaluationDimension[] = [
    "problemSeverity", "frequency", "userPain", "existingAlternatives",
    "marketPotential", "competition", "evidenceStrength", "opportunityPotential",
  ];

  const dimensions: DimensionResult[] = (parsed.dimensions || []).map((d: Record<string, unknown>) => ({
    dimension: validDimensions.includes(d.dimension as EvaluationDimension) ? d.dimension as EvaluationDimension : "problemSeverity",
    score: typeof d.score === "number" ? Math.max(1, Math.min(10, Math.round(d.score))) : 5,
    label: DIMENSION_LABELS[(d.dimension as EvaluationDimension) || "problemSeverity"],
    explanation: String(d.explanation || ""),
    supportingEvidence: String(d.supportingEvidence || ""),
    evidenceType: (["evidence", "inference", "assumption"].includes(d.evidenceType as string) ? d.evidenceType : "inference") as "evidence" | "inference" | "assumption",
  }));

  // Ensure all 8 dimensions are present
  for (const dim of validDimensions) {
    if (!dimensions.find((d) => d.dimension === dim)) {
      dimensions.push({
        dimension: dim,
        score: 5,
        label: DIMENSION_LABELS[dim],
        explanation: "No assessment provided.",
        supportingEvidence: "",
        evidenceType: "inference",
      });
    }
  }

  const overallScore = Math.round(
    dimensions.reduce((sum, d) => {
      const weights: Record<EvaluationDimension, number> = {
        problemSeverity: 0.15, frequency: 0.12, userPain: 0.15,
        existingAlternatives: 0.12, marketPotential: 0.15, competition: 0.10,
        evidenceStrength: 0.10, opportunityPotential: 0.11,
      };
      return sum + d.score * (weights[d.dimension] || 0.125);
    }, 0) * 10
  ) / 10;

  return {
    dimensions,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    uncertainties: Array.isArray(parsed.uncertainties) ? parsed.uncertainties : [],
    needsValidation: Array.isArray(parsed.needsValidation) ? parsed.needsValidation : [],
    overallScore,
    overallLabel: parsed.overallLabel || (overallScore >= 7 ? "Strong Opportunity" : overallScore >= 5 ? "Moderate Opportunity" : "Weak Opportunity"),
    overallExplanation: parsed.overallExplanation || `Overall score: ${overallScore}/10`,
  };
}

// ── Product Concept Generation ──

const CONCEPT_PROMPT = `You are a product strategist. Given a validated problem and its evaluation, generate a structured product concept.

CRITICAL RULES:
1. This is a PROPOSED concept, not a validated business plan.
2. Clearly distinguish what is PROPOSED vs what NEEDS VALIDATION.
3. Be practical and specific, not generic.
4. The MVP should be minimal — 3-5 features max.
5. Be realistic about what can be built quickly.

Return a JSON object with this structure:
{
  "name": "Product Name",
  "oneLiner": "One-line description of the product",
  "problem": "The problem this product solves (1-2 sentences)",
  "targetUsers": "Specific target user persona",
  "userNeeds": ["Need 1", "Need 2", "Need 3"],
  "proposedSolution": "How this product solves the problem (2-3 sentences)",
  "valueProposition": "Why users would choose this (1-2 sentences)",
  "coreFeatures": ["Core feature 1", "Core feature 2", "Core feature 3"],
  "mvpFeatures": ["MVP feature 1 (must-have)", "MVP feature 2 (must-have)", "MVP feature 3 (nice-to-have)"],
  "excludedFromMvp": ["Feature deferred 1", "Feature deferred 2"],
  "userJourney": ["Step 1: User discovers the product", "Step 2: ...", "Step 3: ..."],
  "businessModel": "How the product generates revenue (be specific)",
  "keyAssumptions": ["Assumption that needs validation 1", "Assumption 2"],
  "validationQuestions": ["Question to answer before building 1", "Question 2"],
  "majorRisks": ["Risk 1", "Risk 2"]
}

Return ONLY valid JSON, no markdown.`;

function buildMockConcept(
  problemTitle: string,
  problemDescription: string,
  affectedUsers: string
): ProductConcept {
  return {
    name: `${problemTitle.split(" ").slice(0, 3).join(" ")} Solution`,
    oneLiner: `A focused tool that addresses: ${problemTitle.toLowerCase()}`,
    problem: problemDescription,
    targetUsers: affectedUsers,
    userNeeds: [
      "Clear, accessible guidance without jargon",
      "Time-efficient interactions that fit busy schedules",
      "Visible progress tracking and feedback",
    ],
    proposedSolution: `This product directly addresses ${problemTitle.toLowerCase()} by providing a streamlined experience focused on the core needs of ${affectedUsers.toLowerCase()}. The solution combines curated, evidence-based content with automated tools to reduce friction and deliver measurable outcomes.`,
    valueProposition: `Unlike existing fragmented solutions, this product delivers a focused, evidence-based experience designed specifically for users who need to ${problemTitle.toLowerCase()} without the overhead of current alternatives.`,
    coreFeatures: [
      "Personalized onboarding based on user's current level",
      "AI-powered recommendations tailored to individual goals",
      "Progress dashboard with clear visual indicators",
      "Curated resource library with evidence-backed content",
    ],
    mvpFeatures: [
      "Basic onboarding flow and user profile (must-have)",
      "Core content delivery with topic-specific guidance (must-have)",
      "Simple progress tracking (must-have)",
      "Basic notifications to maintain engagement (nice-to-have)",
    ],
    excludedFromMvp: [
      "Advanced analytics and reporting",
      "Social features and community",
      "Mobile app (start with web)",
      "Third-party integrations",
    ],
    userJourney: [
      "Step 1: User arrives and describes their current situation",
      "Step 2: Product provides a personalized starting point",
      "Step 3: User engages with focused, bite-sized content",
      "Step 4: Progress is tracked and visualized automatically",
      "Step 5: Product adapts recommendations based on user behavior",
    ],
    businessModel: "Freemium model with a free tier for basic access and a premium subscription ($9-19/month) for full features, advanced tracking, and personalized recommendations.",
    keyAssumptions: [
      "Users will engage consistently if friction is reduced",
      "A focused MVP can compete with broader, established alternatives",
      "Users are willing to pay for curated, evidence-based guidance",
    ],
    validationQuestions: [
      "Will users complete onboarding and return within 7 days?",
      "Is the core value proposition clear within 2 minutes of first use?",
      "What is the willingness-to-pay for the premium tier?",
    ],
    majorRisks: [
      "Low user retention after initial engagement",
      "Difficulty differentiating from established competitors",
      "Revenue model may not support sustainable growth",
    ],
  };
}

export async function generateProductConcept(
  problemTitle: string,
  problemDescription: string,
  affectedUsers: string,
  whyItMatters: string,
  evaluationSummary: string
): Promise<ProductConcept> {
  if (MOCK_MODE) {
    return buildMockConcept(problemTitle, problemDescription, affectedUsers);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 3000,
    messages: [
      { role: "system", content: CONCEPT_PROMPT },
      {
        role: "user",
        content: `Generate a product concept based on:

PROBLEM: ${problemTitle}
DESCRIPTION: ${problemDescription}
TARGET USERS: ${affectedUsers}
WHY IT MATTERS: ${whyItMatters}

EVALUATION SUMMARY:
${evaluationSummary}

Be specific and practical. This is a proposed concept, not a validated plan.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);

  return {
    name: String(parsed.name || "Untitled Product"),
    oneLiner: String(parsed.oneLiner || ""),
    problem: String(parsed.problem || problemDescription),
    targetUsers: String(parsed.targetUsers || affectedUsers),
    userNeeds: Array.isArray(parsed.userNeeds) ? parsed.userNeeds : [],
    proposedSolution: String(parsed.proposedSolution || ""),
    valueProposition: String(parsed.valueProposition || ""),
    coreFeatures: Array.isArray(parsed.coreFeatures) ? parsed.coreFeatures : [],
    mvpFeatures: Array.isArray(parsed.mvpFeatures) ? parsed.mvpFeatures : [],
    excludedFromMvp: Array.isArray(parsed.excludedFromMvp) ? parsed.excludedFromMvp : [],
    userJourney: Array.isArray(parsed.userJourney) ? parsed.userJourney : [],
    businessModel: String(parsed.businessModel || ""),
    keyAssumptions: Array.isArray(parsed.keyAssumptions) ? parsed.keyAssumptions : [],
    validationQuestions: Array.isArray(parsed.validationQuestions) ? parsed.validationQuestions : [],
    majorRisks: Array.isArray(parsed.majorRisks) ? parsed.majorRisks : [],
  };
}

// ── Section Refinement ──

const REFINE_SECTION_LABELS: Record<string, string> = {
  targetUsers: "Target Users",
  valueProposition: "Value Proposition",
  coreFeatures: "Core Features",
  mvpFeatures: "MVP Features",
  userJourney: "User Journey",
  businessModel: "Business Model",
  proposedSolution: "Proposed Solution",
  userNeeds: "User Needs",
  majorRisks: "Major Risks",
};

function buildRefinePrompt(section: string, problemTitle: string): string {
  const label = REFINE_SECTION_LABELS[section] || section;
  return `You are a product strategist. Improve the "${label}" section of a product concept.

CONTEXT: This product concept addresses the problem: "${problemTitle}"

RULES:
1. Improve quality, specificity, and actionability.
2. Preserve the intent and scope of the original.
3. Do not add entirely new directions unless the original is clearly lacking.
4. Be practical and specific, not generic.
5. Return ONLY the refined content for this section — nothing else.

The output format depends on the section type:
- For string sections (targetUsers, valueProposition, businessModel, proposedSolution): return a single refined string.
- For array sections (coreFeatures, mvpFeatures, userJourney, userNeeds, majorRisks): return a JSON array of refined items.

Return ONLY valid JSON.`;
}

export async function refineConceptSection(
  section: string,
  currentContent: string | string[],
  problemTitle: string,
  _problemDescription: string // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<string | string[]> {
  if (MOCK_MODE) {
    if (Array.isArray(currentContent)) {
      return currentContent.map((item) => `[Refined] ${item}`);
    }
    return `[Refined] ${currentContent}`;
  }

  const prompt = buildRefinePrompt(section, problemTitle);
  const isArray = Array.isArray(currentContent);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 1500,
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: `Current "${REFINE_SECTION_LABELS[section]}" content:\n\n${
          isArray
            ? JSON.stringify(currentContent, null, 2)
            : currentContent
        }\n\nRefine this content. Return ONLY the improved version as valid JSON.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);

  if (isArray) {
    if (Array.isArray(parsed)) return parsed.map(String);
    if (Array.isArray(parsed.items)) return parsed.items.map(String);
    if (Array.isArray(parsed[section])) return parsed[section].map(String);
    return currentContent.map(String);
  }

  if (typeof parsed === "string") return parsed;
  if (typeof parsed[section] === "string") return parsed[section];
  if (typeof parsed.content === "string") return parsed.content;
  if (typeof parsed.value === "string") return parsed.value;
  return currentContent;
}
