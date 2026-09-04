import OpenAI from "openai";
import type { AIProblem } from "./types";

const MOCK_MODE = process.env.OPENAI_MOCK === "true";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI research assistant that helps discover problems and opportunities in a given market or topic.

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

Return your response as a JSON array of problems. Each problem must follow this exact structure:
[
  {
    "title": "Problem title (concise)",
    "description": "Detailed description of the problem",
    "affectedUsers": "Who experiences this problem",
    "whyItMatters": "Why this problem is significant",
    "confidence": "low|medium|high",
    "evidence": [
      {
        "content": "Description of the evidence",
        "source": "Source name or type (e.g., 'Industry Report', 'Published Research')",
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
      { role: "system", content: SYSTEM_PROMPT },
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
