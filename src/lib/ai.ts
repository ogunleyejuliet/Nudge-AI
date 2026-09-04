import OpenAI from "openai";
import type { AIProblem, EvaluationDimension, DimensionResult, ProductConcept } from "./types";
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "./types";
import { matchDiscoveryDomain } from "./discovery-index";
import type { IndexProblem } from "./discovery-index";

const MOCK_MODE = process.env.OPENAI_MOCK === "true";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Problem Discovery ──

const DISCOVERY_PROMPT = `You are an AI research assistant that discovers SPECIFIC, concrete problems and opportunities in a given market or topic.

WORKFLOW:
1. First, silently enumerate 6-9 concrete subareas within the topic (specific workflows, user segments, or situations where friction happens).
2. Then select 5-6 problems, each drawn from a DIFFERENT subarea.
3. For each problem, name the concrete user segment and the concrete situation in which the pain occurs.

SPECIFICITY BAR — apply the "replace-the-topic test": if replacing the topic with an unrelated noun (e.g. "cryptocurrency") still produces a sentence that makes sense, the problem is too generic. Rewrite it until it only makes sense for THIS topic.

The following generic shapes are FORBIDDEN:
- "Lack of guidance / accessible resources for beginners in X"
- "Time constraints prevent consistent engagement with X"
- "Conflicting and contradictory information about X"
- "High cost of tools and services in X"
- "Difficulty tracking progress and measuring improvement in X"
- Any title that merely fills a blank in a template with the topic name.

A good title names a specific user AND a specific situation, e.g.:
BAD:  "Lack of accessible guidance for beginners in Energy"
GOOD: "Homeowners on variable electricity tariffs struggle to predict monthly bills because prices shift with season and time-of-use windows"
GOOD: "Independent personal trainers struggle to confirm whether clients follow their workout plans between sessions"

RULES FOR EVIDENCE — honesty over appearance:
1. NEVER fabricate sources, URLs, statistics, quotes, or market data.
2. Only list an item in "evidence" if you can attribute it to a well-known, real category of source (e.g. named industry reports, published research, public policy). Do not invent specific reports or authors.
3. If you cannot name evidence honestly, leave "evidence" as an empty array, put your reasoning in "inferences", and set confidence to "low".
4. "confidence" reflects how verifiable the problem is (high = well documented, medium = plausibly documented, low = hypothesis only).

Always set "sourceUrl" to null. Never invent URLs.

Return a JSON object with a "problems" array. Each problem must follow this exact structure:
{
  "problems": [
    {
      "title": "Problem title (specific user + specific situation)",
      "subcategory": "One short subarea label, e.g. 'household electricity costs'",
      "description": "Detailed description including the concrete workflow or situation",
      "affectedUsers": "The SPECIFIC segment that experiences this problem (not 'general users')",
      "whyItMatters": "Why this problem is significant for that segment",
      "confidence": "low|medium|high",
      "evidence": [
        {
          "content": "Honest description of the evidence",
          "source": "Real source name or type",
          "sourceUrl": null,
          "strength": "low|medium|high"
        }
      ],
      "inferences": [
        { "content": "A logical conclusion drawn from the evidence or reasoning above" }
      ],
      "assumptions": [
        { "content": "An assumption that has not been independently verified" }
      ]
    }
  ]
}

Generate exactly 5-6 problems, all from different subareas. Return ONLY valid JSON, no markdown, no code blocks.`;

const MAX_PROBLEMS = 6;
const MAX_PER_SUBCATEGORY = 2;

function toAIProblem(p: IndexProblem): AIProblem {
  return {
    title: p.title,
    description: p.description,
    affectedUsers: p.affectedUsers,
    whyItMatters: p.whyItMatters,
    confidence: "low",
    subcategory: p.subarea,
    evidence: [],
    inferences: [{ content: p.inference }],
    assumptions: [{ content: p.assumption }],
  };
}

// Offline/mock discovery engine. Uses the curated discovery index so every
// problem is topic-specific and carries no fabricated evidence. Unknown or
// unmapped topics return an empty list, which the route converts into a
// clear "be more specific" failure instead of generic guesses.
function buildMockProblems(topic: string): AIProblem[] {
  const domain = matchDiscoveryDomain(topic);
  if (domain) {
    return domain.problems.slice(0, MAX_PROBLEMS).map(toAIProblem);
  }
  return [];
}

// ── Post-processing pipeline ──
// Guardrails applied to LLM output (not the curated mock path): reject the
// known generic template shapes, drop near-duplicate titles, and keep subarea
// variety.

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "are", "they", "their", "them",
  "who", "when", "what", "how", "why", "which", "from", "into", "onto", "over",
  "under", "about", "after", "before", "between", "because", "across", "where",
  "while", "still", "also", "even", "such", "these", "those", "there", "here",
  "then", "than", "can", "will", "would", "should", "could", "has", "have",
  "had", "having", "been", "being", "was", "were", "does", "doing", "did",
]);

function stem(word: string): string {
  if (word.length <= 4) return word;
  return word
    .replace(/(izations|isation|ations|itions|ing|ings|ed|es|s)$/i, "")
    .replace(/(tion|sion)$/, "t");
}

function titleFingerprint(title: string): Set<string> {
  const words = (title.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (w) => w.length > 2 && !STOPWORDS.has(w)
  );
  const unigrams = words.map(stem);
  const grams = new Set<string>();
  for (const w of unigrams) grams.add(`1:${w}`);
  for (let i = 0; i < unigrams.length - 1; i++) {
    grams.add(`2:${unigrams[i]} ${unigrams[i + 1]}`);
  }
  return grams;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
}

const GENERIC_TITLE_PATTERNS: RegExp[] = [
  /^lack of /i,
  /lack of (accessible|clear|good|quality|proper|beginner|reliable)/i,
  /time constraints? (prevent|limits?|make|mean)/i,
  /conflicting and contradictory/i,
  /high cost of /i,
  /difficulty tracking progress/i,
  /difficulty (measuring|monitoring) improvement/i,
  /struggl(e|ing) to (stay|keep|find|get|start|begin|navigate)/i,
];

function isGenericTitle(title: string): boolean {
  return GENERIC_TITLE_PATTERNS.some((re) => re.test(title));
}

function isTooVague(title: string): boolean {
  const significant = (title.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (w) => w.length > 2 && !STOPWORDS.has(w)
  );
  return significant.length < 3;
}

function postProcessProblems(problems: AIProblem[]): AIProblem[] {
  const kept: AIProblem[] = [];

  for (const problem of problems) {
    if (!problem.title || !problem.description) continue;
    if (isGenericTitle(problem.title) || isTooVague(problem.title)) continue;

    const sub = (problem.subcategory || "").trim() || undefined;
    const isDuplicate = kept.some(
      (existing) =>
        jaccard(titleFingerprint(existing.title), titleFingerprint(problem.title)) >= 0.5
    );
    if (isDuplicate) continue;

    const sameSubarea = sub
      ? kept.filter(
          (k) => (k.subcategory || "").trim().toLowerCase() === sub.toLowerCase()
        ).length >= MAX_PER_SUBCATEGORY
      : false;
    if (sameSubarea) continue;

    kept.push(problem);
    if (kept.length >= MAX_PROBLEMS) break;
  }

  return kept;
}

export async function discoverProblems(topic: string): Promise<AIProblem[]> {
  if (MOCK_MODE) {
    return buildMockProblems(topic);
  }

  const response = await openai.chat.completions.create(
    {
      model: "gpt-4o",
      temperature: 0.7,
      max_tokens: 4000,
      messages: [
        { role: "system", content: DISCOVERY_PROMPT },
        {
          role: "user",
          content: `Research the following topic and identify SPECIFIC problems and opportunities: "${topic}"\n\nStart by enumerating concrete subareas within this topic, then pick problems from DIFFERENT subareas. Name specific user segments and concrete situations — never generic templates. Be honest about what is evidence-based versus inferred or assumed.`,
        },
      ],
      response_format: { type: "json_object" },
    },
    { signal: AbortSignal.timeout(60000) }
  );

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const parsed = JSON.parse(content);
  const rawProblems: AIProblem[] = Array.isArray(parsed)
    ? parsed
    : parsed.problems || parsed.data || [];

  const problems = rawProblems.map((p) => ({
    title: p.title || "Untitled Problem",
    description: p.description || "",
    affectedUsers: p.affectedUsers || "General users",
    whyItMatters: p.whyItMatters || "",
    confidence: ["low", "medium", "high"].includes(p.confidence)
      ? p.confidence
      : "low",
    subcategory:
      typeof p.subcategory === "string" && p.subcategory.trim()
        ? p.subcategory.trim()
        : undefined,
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

  return postProcessProblems(problems);
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
