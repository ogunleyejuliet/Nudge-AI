# Opportunity Lab

AI-powered product discovery platform that helps users find, evaluate, and structure real problems into actionable product concepts.

## What It Does

You enter a topic or market. The AI researches the space, surfaces real problems with supporting evidence, helps you evaluate which ones are worth pursuing, and turns your selected opportunity into a structured product concept — with a name, solution, MVP scope, business model, and more. You can refine individual sections, save your work, and return to it later.

## Why It Exists

**The problem:** Most people skip straight to building solutions without understanding whether the problem is real, validated, or worth solving. Existing tools either generate random ideas without evidence or provide overwhelming market research without actionable structure.

**Who it is for:** Solo founders, product managers, and anyone exploring new product ideas who wants a structured, evidence-based approach to evaluating opportunities before committing to building.

## User Flow

```
Topic
→ Discover Problems
→ Explore Problem
→ Select Problem
→ Evaluate Opportunity
→ Create Product Concept
→ Refine
→ Save
```

Each step builds on the previous one. Users always know where they are and can go back to review earlier decisions.

## Core Features & Product Decisions

- **Problem Discovery:** Helps users find potential problems within a topic instead of generating random startup ideas. Returns 4-6 problems with descriptions, affected users, and confidence levels.

- **Problem Exploration:** Users can expand a problem and understand it before deciding to pursue it. Each problem shows supporting evidence, inferences, and assumptions — clearly distinguished.

- **Evidence Classification:** Every piece of research is tagged as evidence, inference, or assumption. This forces honesty about what is actually known versus what is assumed.

- **Problem Selection:** Users explicitly choose one problem to evaluate. This creates a clear decision point and prevents scattered focus.

- **Opportunity Evaluation:** Scores the selected problem across 8 dimensions (severity, frequency, pain, market, competition, etc.) with a weighted overall score. Helps users assess an opportunity before jumping into a solution.

- **Product Concept Generation:** Turns a selected problem into a structured product concept with 15 sections — name, solution, features, MVP scope, user journey, business model, risks, assumptions, and validation questions.

- **Section-Level Refinement:** Allows users to refine specific parts of a concept instead of regenerating everything. Each section can be independently improved while preserving the rest.

- **Saved Opportunities:** Lets users return to ideas they have already explored. Opportunities are persisted with full context — problem, evidence, evaluation, and concept.

- **Workspace:** A dedicated space to view, manage, and continue working on saved opportunities. Includes status tracking and last-updated timestamps.

## Development Phases

The product was divided into three phases based on the user flow. This made development easier to test, debug, and manage with AI.

**Phase 1: Discover** — Topic input, AI research, problem generation with evidence, problem selection.

**Phase 2: Evaluate & Define** — Opportunity scoring across 8 dimensions, product concept generation, comparison view.

**Phase 3: Refine & Workspace** — Section-level AI refinement, save/load opportunities, workspace with CRUD operations.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env` and set:

- `OPENAI_API_KEY` — Your OpenAI API key (required for live AI responses)
- `OPENAI_MOCK=true` — Enable mock mode for testing without API credits

### Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, OpenAI API
