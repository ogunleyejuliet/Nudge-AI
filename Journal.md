# Day 1 Journal

### Product Strategy & Idea Refinement

I started the morning with product strategy. I had a raw app idea, but instead of jumping straight into development, I gave the idea to AI and asked it to challenge it. I asked AI to identify the gaps I had overlooked, question the assumptions behind the idea, and help me refine it into something more useful and realistic.

From that process, I got a refined product idea with a clearer problem, target users, value proposition, and user flow. After refining the idea, I used the refined concept to create a Product Requirements Document (PRD). The PRD helped me break the product down into its actual requirements instead of trying to build everything at once. It gave me a clearer understanding of the features, user flow, technical requirements, and what should be included in the first version.

I then decided to split the development into three phases based on the user flow. Instead of asking AI to build the entire application at once, I wanted each phase to be independently testable. This would make it easier to identify bugs, debug problems, and prevent the AI from becoming overloaded with too many requirements at once.


I started building the first phase using open code ai as my antigravity token finished. I implemented the initial user flow and connected the application to the OpenAI API using API keys stored in the project's environment variables.

After the initial build, I ran the application and tested the flow myself. I checked whether the application behaved as expected, identified issues, and made adjustments where necessary.

### First Git Commit

Once I had tested the first phase and confirmed that the core flow was working, I initialized the Git workflow and made my first commit.

Moving Into Phase 2

After completing and testing Phase 1, I moved on to Phase 2 of the build.

The focus of this phase was taking the problems discovered in Phase 1 and helping the user understand them better before turning one into a product idea.

Expanding on Problems

I added a feature that allows users to expand a problem and read more about it.

Instead of only seeing a short problem card, the user can open the problem to understand:

What the problem is
Who experiences it
Why it matters
The evidence behind it
More context around the opportunity

This makes the problem discovery process more useful because the user can investigate an opportunity before deciding what to build.

Creating a Product Concept

I then added the ability to create a product concept from a selected problem.

Once the user finds a problem they are interested in, they can move from:

Problem → Product Concept

The AI takes the selected problem and generates a structured concept around it, including the target users, proposed solution, key features, MVP scope, user journey, and business model.

This was an important step because the app was no longer just helping users find problems. It was helping them start thinking about what could be built to solve those problems.

Moving Into Phase 3

For Phase 3, I focused on turning the product concept into something the user could save, revisit, and continue working on.

I added the workspace where users can view their saved opportunities, open a product concept, and refine individual sections instead of regenerating the entire concept.

I also added the ability to save and delete opportunities and made sure users could only access their own saved opportunities.

After implementing the features, I tested the complete flow from discovering a problem to creating, refining, and saving a product concept.

This phase completed the main V1 user journey:

Discover → Evaluate → Create → Refine → Save
Day 2
I made a few important changes to my project, Opportunity Lab.

Changed the brand name: I updated the product name and branding to better reflect the direction of the product.
Redesigned the landing page: I redesigned the landing page to make the product clearer, improve the visual experience, and make the main action easier to understand.
Improved the AI model: I updated the AI discovery logic so it produces more specific and useful problems based on the topic selected by the user, instead of giving generic problems that could apply to almost any topic.
Improved opportunity discovery: I added more checks around relevance and diversity so the problems generated are more closely connected to the selected market or topic.