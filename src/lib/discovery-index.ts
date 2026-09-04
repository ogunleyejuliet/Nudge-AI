export interface IndexProblem {
  subarea: string;
  title: string;
  affectedUsers: string;
  description: string;
  whyItMatters: string;
  inference: string;
  assumption: string;
}

export interface Domain {
  keywords: string[];
  problems: IndexProblem[];
}

// Curated, domain-grounded subarea problems used only for the offline/mock
// discovery engine. Every entry names a concrete user segment, a concrete
// situation, and a concrete pain. None of them carry fabricated sources:
// they are hypotheses (inference + assumption) with no retrieved evidence.
export const DISCOVERY_INDEX: Domain[] = [
  {
    keywords: ["energy", "electricity", "utility", "solar", "power"],
    problems: [
      {
        subarea: "household electricity costs",
        title:
          "Homeowners on variable electricity tariffs struggle to predict monthly energy bills because prices shift with seasons and time-of-use windows.",
        affectedUsers:
          "Homeowners on variable or time-of-use electricity tariffs",
        description:
          "Residential utility pricing varies by season, time-of-day, and market price. Households on variable tariffs receive bills that arrive after the fact, leaving them unable to adjust usage or budget for the month ahead.",
        whyItMatters:
          "Unpredictable energy bills create budgeting stress and can strain households with fixed incomes, yet most residential energy tools only summarize past usage.",
        inference:
          "Dynamic pricing structures shift financial risk onto consumers without any matching forecasting tool, so bill-shock is a recurring, well-understood pain in residential energy.",
        assumption:
          "Households would adopt a forecasting tool that connects to their meter or billing data.",
      },
      {
        subarea: "solar installation assessment",
        title:
          "Homeowners considering rooftop solar struggle to compare installer quotes because payback estimates are rarely calculated the same way twice.",
        affectedUsers:
          "Homeowners researching rooftop solar installations",
        description:
          "Solar installers present different system sizes, panel wattages, and savings assumptions, so consumers cannot compare payback periods that match their own roof, shade, and usage. Quotes usually depend on the installer's own modeling tool.",
        whyItMatters:
          "Incomparable quotes lead to decision paralysis or purchases that are later regretted once real bills diverge from the estimate.",
        inference:
          "A standardized, roof- and usage-aware payback calculation would remove the most confusing variable in residential solar purchasing.",
        assumption:
          "Consumers would trust a third-party estimator over numbers produced by the installer selling the system.",
      },
      {
        subarea: "backup power for cold-storage businesses",
        title:
          "Small food businesses that rely on refrigeration struggle to size backup power for outages, so generators are either oversized or fail when actually needed.",
        affectedUsers:
          "Small restaurants, cafés, pharmacies, and cold-storage operators",
        description:
          "Power disruptions cause food loss and missed service. Operators in this segment buy generators without matching capacity to the real equipment load, so investments are either wasted or non-functional at the moment of an outage.",
        whyItMatters:
          "Unsized or poorly maintained backup power destroys perishable inventory and interrupts revenue exactly when the grid fails.",
        inference:
          "Load-aware backup planning is a recurring, unaddressed workflow for appliance-heavy small businesses that depend on continuity.",
        assumption:
          "Small operators would pay for an outage-risk assessment before committing to a generator purchase.",
      },
      {
        subarea: "multi-tenant energy attribution",
        title:
          "Property managers of multi-tenant buildings struggle to attribute energy waste between tenants, common areas, and equipment because they see one aggregated utility bill.",
        affectedUsers:
          "Property managers of multi-tenant commercial buildings",
        description:
          "Without per-zone metering, managers receive a single aggregated energy cost and cannot tell which tenant, unit, or asset drives consumption peaks, inflating operating costs and tenant disputes.",
        whyItMatters:
          "Unattributed energy waste hides where efficiency investment actually pays back, and creates noisy disagreements over shared utilities.",
        inference:
          "Sub-meter level insight is the missing layer between one utility bill and actionable retrofit or allocation decisions in commercial property.",
        assumption:
          "Landlords will invest in sub-metering where the data enables cost allocation back to tenants.",
      },
      {
        subarea: "residential energy storage economics",
        title:
          "Households pairing solar with battery storage struggle to estimate whether the storage pays back under their own usage pattern and tariff.",
        affectedUsers:
          "Households adding battery storage to existing rooftop solar",
        description:
          "Battery economics depend on time-of-use spreads, export rates, and the share of generation the household actually self-consumes. Households cannot easily model these against their own meter profile before spending on storage gear.",
        whyItMatters:
          "Poorly informed storage purchases have long payback tails and erode trust in the technology after installation.",
        inference:
          "Personalized storage sizing and payback models are missing for the residential segment that increasingly owns solar.",
        assumption:
          "Households keep a similar usage pattern and tariff structure in the years after purchase.",
      },
      {
        subarea: "submetered utility billing transparency",
        title:
          "Tenants on submetered utility billing struggle to verify their share because charges arrive without meter readings, allocation method, or a simple dispute path.",
        affectedUsers:
          "Tenants in submetered multi-family buildings",
        description:
          "Submetered renters receive billed amounts with little transparency into the readings, the per-unit allocation, or added fees. Disputing an incorrect bill requires slow back-and-forth with the landlord or a billing intermediary.",
        whyItMatters:
          "Opaque billing erodes trust between tenants, landlords, and utility intermediaries, and generates a steady stream of complaints.",
        inference:
          "Verifiable, meter-linked billing data would resolve the most common dispute trigger in submetered housing.",
        assumption:
          "Submetering firms could open access to reading data under regulatory or market pressure.",
      },
    ],
  },
  {
    keywords: ["fitness", "wellness", "gym", "training", "workout", "exercise"],
    problems: [
      {
        subarea: "personal trainer client adherence",
        title:
          "Independent personal trainers struggle to confirm whether clients follow their workout and nutrition plans between sessions, so progress stalls are hard to diagnose.",
        affectedUsers:
          "Independent personal trainers coaching clients one-to-one",
        description:
          "Trainers program workouts in apps or on paper, then rely on client memory and self-report to judge adherence. When a client does not progress, the trainer cannot tell whether the plan, the execution, or compliance is the problem.",
        whyItMatters:
          "Invisible non-adherence damages client results and retention, which directly hits a trainer's income.",
        inference:
          "Adherence visibility between sessions is a recurring gap in 1:1 coaching software.",
        assumption:
          "Clients will log adherence if the process is fast and the data is private to their coach.",
      },
      {
        subarea: "gym member retention",
        title:
          "Small gym and studio owners struggle to predict which members will lapse because churn signals are scattered across separate attendance, check-in, and payment tools.",
        affectedUsers:
          "Owners of small gyms and boutique fitness studios",
        description:
          "Attendance, check-ins, and payments live in separate systems, so a slowing visit cadence is only noticed after a member cancels. Retention outreach is reactive instead of preventive.",
        whyItMatters:
          "Losing a member costs several months of revenue and far more than keeping one, yet studios act on churn only when it has already happened.",
        inference:
          "A churn-risk signal built from check-in cadence would let owners intervene before cancellation.",
        assumption:
          "Busy owners would act on automated churn alerts if they came with ready-to-send outreach.",
      },
      {
        subarea: "return-to-training programming",
        title:
          "Adults returning to training after a long break struggle to set a realistic ramp-up because generic apps assume linear progression and ignore age, injury history, and prior baseline.",
        affectedUsers:
          "Adults over 40 returning to structured exercise after a break",
        description:
          "Returning exercisers self-prescribe intensity. Mainstream fitness apps push linear progression without considering injury history or a deconditioned baseline, which raises the risk of strain and dropout.",
        whyItMatters:
          "Injury or discouragement derails most return-to-exercise attempts, a large and underserved segment.",
        inference:
          "Injury-aware, conservative progression is a clear differentiator absent from mass-market fitness apps.",
        assumption:
          "Returning adults would disclose injury and health history to receive safer programming.",
      },
      {
        subarea: "boutique studio scheduling",
        title:
          "Boutique studio instructors struggle to balance class demand with instructor availability, overbooking popular classes while off-peak slots stay empty.",
        affectedUsers:
          "Instructor leads at boutique fitness studios",
        description:
          "Scheduling is assembled manually across spreadsheets and messaging. Popular times fill unevenly, instructors burn out, and off-peak capacity generates nothing.",
        whyItMatters:
          "Uneven utilization leaves revenue unused and drives staff turnover in a labor-tight industry.",
        inference:
          "Demand-aware class scheduling is a concrete workflow pain for studio operators that current scheduling tools do not solve.",
        assumption:
          "Studios would adopt scheduling automation if it integrated with calendars and payroll.",
      },
      {
        subarea: "training-load-aligned nutrition",
        title:
          "Amateur athletes struggle to align nutrition tracking with fluctuating training load because macro calculators are static while weekly exercise volume swings.",
        affectedUsers:
          "Amateur endurance and strength athletes preparing for events",
        description:
          "Diet apps calculate targets from a fixed profile, but training demands change week to week. Athletes end up under-fuelled before hard sessions and over-fed in recovery weeks.",
        whyItMatters:
          "Fueling lag behind training load impairs session quality, recovery, and performance around key workouts.",
        inference:
          "Training-load-aware nutrition planning is an unmet integration between wearables, training apps, and food trackers.",
        assumption:
          "Athletes will log nutrition if the plan adjusts automatically to their logged training load.",
      },
      {
        subarea: "home gym equipment selection",
        title:
          "Home gym owners struggle to buy equipment that fits their space and goals because footprint, noise, and load specs are rarely comparable across brands.",
        affectedUsers:
          "People building home gyms on a budget",
        description:
          "Buyers stitch together specs from listings and reviews, misjudging footprint and capacity. Returning heavy, bulky gear is costly, so mistakes are expensive to correct.",
        whyItMatters:
          "Equipment mispurchases waste budget and delay training by weeks, a frequent and unaddressed purchasing pain.",
        inference:
          "A spec-normalized comparison layer for fitness equipment remains uncovered by marketplace filters.",
        assumption:
          "Home gym buyers value comparable specifications over brand loyalty.",
      },
    ],
  },
  {
    keywords: ["education", "learning", "teaching", "school", "student", "course"],
    problems: [
      {
        subarea: "parent-teacher communication on at-risk students",
        title:
          "Primary school teachers struggle to keep parents informed about struggling students because grade, attendance, and behavior data are scattered across separate tools.",
        affectedUsers:
          "Primary school teachers with classes of 20-30 students",
        description:
          "Gradebooks, attendance systems, and behavior logs do not talk to each other. Assembling a unified picture of an at-risk student takes manual work, so parents hear about issues late.",
        whyItMatters:
          "Early, coherent communication is the main lever for turning around struggles, and it is currently dependent on teacher memory and spare time.",
        inference:
          "A unified, auto-assembled student snapshot would remove the manual assembly that delays parent outreach.",
        assumption:
          "Schools are willing to integrate existing classroom tools into a single view.",
      },
      {
        subarea: "higher-education course selection",
        title:
          "Undergraduates struggle to choose courses that fit their goals because catalogs hide workload, prerequisite chains, and the advice of students who took them before.",
        affectedUsers:
          "Undergraduate students choosing courses each term",
        description:
          "Course catalogs list titles and credits but not real workload, difficulty, or how sequential courses actually connect. Students choose based on names and rumors.",
        whyItMatters:
          "Poor choices cause schedule conflicts, delayed graduation, and courses dropped after the refund window.",
        inference:
          "Workload- and path-aware course guidance is an unmet layer over static university catalogs.",
        assumption:
          "Institutions would share anonymized course-outcome signals to power better guidance.",
      },
      {
        subarea: "tutoring accountability",
        title:
          "Private tutors struggle to demonstrate measurable progress to parents because session notes, assessments, and completed homework are not linked into one trajectory.",
        affectedUsers:
          "Private tutors working with school-age students",
        description:
          "Tutors track sessions in notes and spreadsheets while parents rely on intuition about whether tutoring is working. When results lag, the tutor cannot show exactly what improved and what did not.",
        whyItMatters:
          "Lack of visible progress is a leading reason families end tutoring relationships that are actually working.",
        inference:
          "A progress-trajectory view built from assessments and session records would strengthen tutor retention.",
        assumption:
          "Tutors will record structured session data if the tool reduces their administrative time.",
      },
      {
        subarea: "exam-prep weak-topic diagnosis",
        title:
          "Professional licensure candidates struggle to find their real weak topics because practice-test platforms report an overall score without isolating the specific areas that fail.",
        affectedUsers:
          "Candidates preparing for professional or licensure exams",
        description:
          "Practice results summarize a composite score. Candidates cannot tell whether their gap is in one topic or spread across many, so they re-study everything instead of the failing areas.",
        whyItMatters:
          "Diffuse study time is the most inefficient preparation pattern and directly extends the path to passing.",
        inference:
          "Topic-level weak-spot diagnosis from practice performance is a simple, high-value layer over existing question banks.",
        assumption:
          "Candidates trust topic-level analytics over their own guesswork about weaknesses.",
      },
      {
        subarea: "small-school master scheduling",
        title:
          "Small school administrators struggle to build a master schedule that respects teacher constraints, room capacity, and student choices, producing conflicts every term.",
        affectedUsers:
          "Administrators at small and independent schools",
        description:
          "Constructing a non-conflicting timetable is a combinatorial problem solved by hand on spreadsheets. Conflicts surface after publication and are resolved through painful manual swaps.",
        whyItMatters:
          "Scheduling conflicts cascade into room changes, teacher dissatisfaction, and course enrollment losses each term.",
        inference:
          "Constraint-aware scheduling guidance would remove the highest-burnout task on a school administrator's calendar.",
        assumption:
          "Administrators would adopt a scheduling tool that understands teachers, rooms, and course chains.",
      },
      {
        subarea: "adult language retention",
        title:
          "Adult language learners struggle to retain vocabulary after structured classes end because spaced-review tools are disconnected from the curriculum they follow.",
        affectedUsers:
          "Adult learners in structured evening or group language courses",
        description:
          "Spaced repetition works only when review items match what the class actually covered. Standalone flashcard apps drift from the syllabus, so learners re-encounter the hardest words too late.",
        whyItMatters:
          "Vocabulary decay is the dominant reason adults stall at intermediate level in a second language.",
        inference:
          "Curriculum-synced spaced review is an unmet integration point for organized adult language learning.",
        assumption:
          "Language schools would adopt a companion review tool that matches their lesson plans.",
      },
    ],
  },
  {
    keywords: ["finance", "financial", "money", "investing", "budget", "bank", "tax"],
    problems: [
      {
        subarea: "small business cash flow forecasting",
        title:
          "Small business owners struggle to forecast cash flow when revenue arrives irregularly and invoice delays hide which clients cause the gaps.",
        affectedUsers:
          "Owners of small service and product businesses",
        description:
          "Invoices are paid late and cash arrives in lumps. Spreadsheet forecasts are outdated within days, so owners discover shortfalls too late to adjust spending.",
        whyItMatters:
          "Cash-flow surprise is the top cause of small business failure, and late discovery makes otherwise healthy businesses insolvent.",
        inference:
          "Invoice-level, probabilistic cash forecasting is a concrete and recurring need for owner-operated businesses.",
        assumption:
          "Owners would connect their accounting and invoicing tools if the forecast required little setup.",
      },
      {
        subarea: "small-capital retail investing",
        title:
          "Beginner investors with small capital struggle to build cost-weighted diversification because minimums, fees, and fractional rules are opaque across brokerages.",
        affectedUsers:
          "First-time retail investors building portfolios from small recurring amounts",
        description:
          "Diversification requires spreading small sums across many assets, but fees and minimums eat tiny positions. Beginner guides rarely model cost-weighted allocation clearly.",
        whyItMatters:
          "Bad early allocation habits persist for years and erode returns through avoidable fees.",
        inference:
          "Cost-weighted, minimum-aware portfolio construction is a gap for the growing small-balance investor segment.",
        assumption:
          "Platforms will expose fee and minimum data in a comparable format.",
      },
      {
        subarea: "couples household finance coordination",
        title:
          "Couples merging finances struggle to agree on a joint budget because each partner arrives with different accounts, habits, and risk tolerance.",
        affectedUsers:
          "Couples merging household finances",
        description:
          "Joint budgeting forces reconciliation of two separate account sets and two different spending styles. Existing tools treat a household as a single budget rather than a negotiation.",
        whyItMatters:
          "Money disagreements are a leading source of relationship stress, and existing tools do not model two owners.",
        inference:
          "A two-owner household model with explicit 'mine, yours, ours' rules is an unmet shape for money tools.",
        assumption:
          "Couples would complete a joint setup flow together if it produced a shared plan.",
      },
      {
        subarea: "banking product fee transparency",
        title:
          "Consumers struggle to compare bank and card products because fee structures, rewards tiers, and interest terms are presented differently across providers.",
        affectedUsers:
          "Consumers choosing checking, savings, or card products",
        description:
          "Each provider formats fees and terms its own way, so comparing two cards requires translating documents. The best product for a specific spending pattern is hard to identify.",
        whyItMatters:
          "Poor product choice costs consumers real money in fees and lost rewards over years of use.",
        inference:
          "A normalized, usage-matched comparison layer for banking products remains a persistent consumer gap.",
        assumption:
          "Providers would expose standardized fee data voluntarily or under openness pressure.",
      },
      {
        subarea: "side-income tax compliance",
        title:
          "Freelancers with multiple income sources struggle to estimate quarterly taxes because deductions, payments, and business expenses are scattered across platforms.",
        affectedUsers:
          "Freelancers earning side income across several platforms",
        description:
          "Income arrives from gig marketplaces, invoicing tools, and direct clients. Tracking each source into a quarterly estimate is manual, and underpayment penalties compound the error.",
        whyItMatters:
          "Estimation mistakes produce underpayment penalties and unexpected tax bills, a recurring and stressful problem.",
        inference:
          "Source-consolidated quarterly tax estimation is a concrete automation gap for multi-source earners.",
        assumption:
          "Freelancers will aggregate income data across platforms in exchange for a confident estimate.",
      },
      {
        subarea: "employee financial wellbeing support",
        title:
          "Employers struggle to offer financial wellbeing benefits that move employee outcomes because generic education content ignores each person's actual situation.",
        affectedUsers:
          "People managers and HR teams running employee benefits",
        description:
          "Offering self-serve webinars and articles changes little, because the pain points differ entirely between someone with debt, someone saving for a home, and someone choosing an insurance plan.",
        whyItMatters:
          "Inert benefits waste budget and do nothing for retention, while personal financial stress measurably reduces productivity.",
        inference:
          "Situation-matching financial guidance is the missing layer between a benefits catalog and real employee outcomes.",
        assumption:
          "Employees will engage with benefits tools that triage based on their specific financial situation.",
      },
    ],
  },
  {
    keywords: ["agriculture", "farm", "farming", "crop", "livestock", "grower"],
    problems: [
      {
        subarea: "smallholder price transparency",
        title:
          "Smallholder farmers struggle to know a fair market price for their crops because local buyers set prices with no reference to broader market data.",
        affectedUsers:
          "Smallholder farmers selling through local intermediaries",
        description:
          "Buyers name a price for a harvest with no published benchmark, and farmers lack the market context to negotiate. Individual farmers cannot easily compare what similar produce fetches elsewhere.",
        whyItMatters:
          "Information asymmetry silently transfers income from producers to intermediaries in markets served by thousands of smallholders.",
        inference:
          "Accessible price-reference data is a widely documented enabler for better farm gate outcomes.",
        assumption:
          "Farmers would use and trust a price benchmark delivered in a simple, mobile-friendly form.",
      },
      {
        subarea: "irrigation scheduling",
        title:
          "Vegetable growers using drip irrigation struggle to schedule water under variable weather because soil-moisture readings and forecast data are not combined into one decision.",
        affectedUsers:
          "Vegetable growers operating drip-irrigated plots",
        description:
          "Watering decisions currently combine guesswork about soil state and weather. Overwatering wastes water and leaches nutrients; underwatering stresses crops before symptoms appear.",
        whyItMatters:
          "Precision irrigation directly controls yield, water cost, and crop quality for small and mid-size growers.",
        inference:
          "A moisture-plus-forecast watering recommendation is a concrete improvement over calendar-based scheduling.",
        assumption:
          "Growers would accept sensor-informed scheduling if it reduced their daily decision load.",
      },
      {
        subarea: "crop disease early warning",
        title:
          "Fruit growers struggle to catch disease at an early stage because scouting is manual and symptoms only appear after the pathogen has spread.",
        affectedUsers:
          "Fruit and orchard growers managing disease-susceptible crops",
        description:
          "Field scouting depends on regular visual inspection. By the time leaf or fruit symptoms are visible, treatment options are fewer and costlier, and neighboring trees are already exposed.",
        whyItMatters:
          "Late detection multiplies crop loss and raises chemical input costs in the same season.",
        inference:
          "Model-led scouting alerts tuned to local weather and crop stage could shift detection earlier than visual-only routines.",
        assumption:
          "Growers would act on automated alerts they can verify with a quick field check.",
      },
      {
        subarea: "farm labor scheduling",
        title:
          "Dairy and livestock operators struggle to schedule labor around milking, feeding, and vet windows during seasonal peaks without over-hiring.",
        affectedUsers:
          "Operators of mid-size dairy and livestock operations",
        description:
          "Workload peaks around calving, shearing, or harvest collide with fixed daily chores. Scheduling is done by memory across a small crew, leaving periods both overstaffed and understaffed.",
        whyItMatters:
          "Labor is the largest controllable cost on most farms, and mismatch drives overtime or missed chores.",
        inference:
          "Season-aware chore scheduling is an operational workflow for which farm-specific software is scarce.",
        assumption:
          "Farm operators would adopt software that resembles their chore calendar rather than general time tracking.",
      },
      {
        subarea: "post-harvest cold-chain",
        title:
          "Market gardeners struggle to reduce post-harvest loss because temperature conditions on the field-to-market trip are never measured or verified.",
        affectedUsers:
          "Market gardeners shipping fresh produce to wholesale or retail",
        description:
          "Produce sits in trucks and staging areas without temperature monitoring. Spoilage is only discovered at the point of sale, and there is no record of where the chain broke.",
        whyItMatters:
          "Post-harvest loss is a direct margin killer for fresh produce with short shelf life.",
        inference:
          "Simple, verifiable temperature logging across the short field-to-market chain is a practical, unaddressed need.",
        assumption:
          "Growers would pay a subscription that meaningfully reduces shrinkage.",
      },
      {
        subarea: "input purchasing comparison",
        title:
          "Row-crop farmers struggle to compare seed, fertilizer, and chemical quotes because pricing changes with timing, volume, and dealer terms offered differently by each supplier.",
        affectedUsers:
          "Row-crop farmers making seasonal input purchases",
        description:
          "Input quotes depend on lock-in timing, order volume, and credit terms. Comparing across dealers requires manual normalization, and early-lock discounts reward whoever tracks the window.",
        whyItMatters:
          "Inputs are the largest annual cost, and a small percentage difference is significant at farm scale.",
        inference:
          "Normalized, time-aware input comparison is a concrete purchasing workflow pain in agriculture.",
        assumption:
          "Dealers would publish structured quotes to stay in consideration.",
      },
    ],
  },
  {
    keywords: ["health", "healthcare", "medical", "clinic", "patient", "care"],
    problems: [
      {
        subarea: "chronic condition care adherence",
        title:
          "Patients managing chronic conditions like diabetes or hypertension struggle to follow daily care plans because instructions arrive from multiple providers in conflicting formats.",
        affectedUsers:
          "Patients managing diabetes, hypertension, or similar chronic conditions",
        description:
          "Medication, diet, exercise, and self-monitoring instructions come from a primary care doctor, a specialist, and a pharmacist, each formatted differently. The patient must reconcile them into a daily routine around a full workday.",
        whyItMatters:
          "Instruction conflicts and recall gaps are a measurable driver of non-adherence that worsens long-term outcomes.",
        inference:
          "A unified, schedule-shaped care plan is a recurring gap for the large and growing chronic-condition population.",
        assumption:
          "Providers would sign off on a consolidated plan if the patient brings it to visits.",
      },
      {
        subarea: "family caregiving coordination",
        title:
          "Family caregivers struggle to coordinate medications, appointments, and symptoms for an aging parent across separate clinicians and pharmacies.",
        affectedUsers:
          "Adult children coordinating care for aging parents",
        description:
          "Care responsibilities spread across multiple specialists, pharmacists, and home schedules. Medication lists drift between visits, and symptom changes are reported inconsistently.",
        whyItMatters:
          "Care coordination errors are a leading cause of preventable hospital readmissions among older adults.",
        inference:
          "A shared, clinician-reviewed care timeline is an unmet coordinating layer for informal caregivers.",
        assumption:
          "Clinicians will review a caregiver-maintained record if it is concise and structured.",
      },
      {
        subarea: "primary care message triage",
        title:
          "Independent primary care clinics struggle to triage patient messages because inboxes mix urgent symptoms, refill requests, and administrative questions.",
        affectedUsers:
          "Nurses and staff at independent primary care clinics",
        description:
          "Patient portals deliver everything into one queue. Staff must manually classify each message, and genuinely urgent symptoms can sit behind refills during busy periods.",
        whyItMatters:
          "Slow triage of urgent symptoms is a patient-safety risk and a major source of staff burnout.",
        inference:
          "Message-classification triage is a concrete workflow improvement for clinics without analyst teams.",
        assumption:
          "Clinics would act on a triage queue if classification accuracy is trustworthy and overrideable.",
      },
      {
        subarea: "post-discharge recovery follow-up",
        title:
          "Patients discharged after surgery struggle to follow recovery instructions without structured checks on wound, medication, and mobility between follow-ups.",
        affectedUsers:
          "Patients discharged after orthopedic or general surgery",
        description:
          "After discharge, patients self-manage wound care, pain medication, and movement targets with a single printed sheet. Complications are detected late, usually at the scheduled follow-up.",
        whyItMatters:
          "The days after discharge carry the highest readmission risk, and structured remote checks substantially reduce it.",
        inference:
          "Structured, automated recovery check-ins are a proven and under-deployed layer in post-surgical care.",
        assumption:
          "Patients will complete brief daily recovery check-ins after discharge.",
      },
      {
        subarea: "mental health waitlist engagement",
        title:
          "Community mental health providers struggle to keep wait-listed referrals engaged because intake paperwork is repeated and response times are slow.",
        affectedUsers:
          "Staff at community mental health providers with long waitlists",
        description:
          "Referrals wait weeks while eligibility forms are re-submitted and information is re-collected. Some clients disengage before their first session, extending waitlists further.",
        whyItMatters:
          "Lost referrals both harm the client and waste clinician capacity in an under-resourced system.",
        inference:
          "Simplified, structured intake and waitlist check-ins would preserve referrals that currently fall out.",
        assumption:
          "Providers could adopt a lightweight intake tool without duplicating their EMR.",
      },
      {
        subarea: "small clinic claims reconciliation",
        title:
          "Small clinics struggle to reconcile insurance claims and denials because billing tools assume dedicated staff that they do not have.",
        affectedUsers:
          "Solo practitioners and small clinics managing their own billing",
        description:
          "Claim submission requires matching codes, modifiers, and documentation to complex payer rules. Small clinics carry this themselves, and denials arrive weeks later with little explanation of what to fix.",
        whyItMatters:
          "Un-reconciled denials delay revenue for months and consume scarce clinical time.",
        inference:
          "Denial-forecasting and code-guidance for small clinics is a concrete, repetitive administrative pain.",
        assumption:
          "Small clinics would adopt billing support that integrates with their existing system.",
      },
    ],
  },
  {
    keywords: ["travel", "tourism", "trip", "hotel", "flight"],
    problems: [
      {
        subarea: "disrupted itinerary rebooking",
        title:
          "Frequent business travelers struggle to rebook disrupted itineraries because airline and hotel change policies differ and compensation rules are buried in fine print.",
        affectedUsers:
          "Business travelers flying several times a month",
        description:
          "When a flight is cancelled or delayed, travelers must re-plan across carriers with different rebooking windows and fee rules, while deciding whether they are owed compensation. The math must happen in minutes at an airport.",
        whyItMatters:
          "Disruption recovery consumes the most stressful and lowest-value minutes of a business trip.",
        inference:
          "Policy-normalized rebooking guidance for live disruptions is an unmet layer over fragmented airline policies.",
        assumption:
          "Travelers would let a tool read their itinerary and travel history to speed rebooking.",
      },
      {
        subarea: "group trip planning",
        title:
          "Friends planning a group trip struggle to settle on dates, budgets, and lodging because preferences and availability are spread across messaging threads.",
        affectedUsers:
          "Friend groups planning multi-person trips",
        description:
          "Dates, budgets, and lodging ideas live across chat messages. Comparisons are informal, decisions are made late, and someone usually ends up subsidizing the compromise.",
        whyItMatters:
          "Coordination overhead is the main reason planned group trips either stall or lose participants.",
        inference:
          "A shared, constrained decision surface for dates and lodging is a missing coordination tool for group travel.",
        assumption:
          "Groups will move one decision into a tool if it saves real back-and-forth.",
      },
      {
        subarea: "budget-matched destination selection",
        title:
          "Budget travelers struggle to find destinations that fit a strict budget because search results rank by popularity and price rather than by cost of living fit.",
        affectedUsers:
          "Travelers planning trips with a hard budget for a destination",
        description:
          "Flights and hotels can be found by price, but the total cost of eating, transport, and activities at a destination is almost invisible. A 'cheap flight' city can still be an expensive week.",
        whyItMatters:
          "Destination-fit miscalculation turns a planned budget trip into an overspend before departure.",
        inference:
          "Total-cost-of-visit comparison is a genuine gap in destination discovery interfaces.",
        assumption:
          "Travelers trust estimated daily cost benchmarks when clearly labeled as estimates.",
      },
      {
        subarea: "accessibility verification",
        title:
          "Travelers with mobility needs struggle to verify wheelchair access for hotels and transit because accessibility claims are self-declared and rarely verified.",
        affectedUsers:
          "Travelers using wheelchairs or with limited mobility",
        description:
          "Accessibility information is provided by properties themselves without standard verification. Travelers discover stair-only entrances and narrow bathrooms after booking.",
        whyItMatters:
          "A missed accessibility detail can force re-booking or cancellations at the destination itself.",
        inference:
          "Verified, standardized accessibility data is a persistent and underserved information gap in travel.",
        assumption:
          "Properties would participate in verification to win an accessible-travel audience.",
      },
      {
        subarea: "short-term rental operations",
        title:
          "Small short-term rental hosts struggle to coordinate cleaning, check-in, and maintenance across bookings without resorting to property-management software.",
        affectedUsers:
          "Hosts managing a few short-term rental properties",
        description:
          "Hosts email cleaners, message guests, and track maintenance manually between bookings. Gaps show up as double bookings, late check-in details, or unresolved damage claims.",
        whyItMatters:
          "Operational slips directly produce negative reviews and chargeback disputes for small hosts.",
        inference:
          "A lightweight, single-property operations layer is an unmet need between DIY spreadsheets and enterprise PM tools.",
        assumption:
          "Small hosts would adopt scheduling automation that connects to their booking channel.",
      },
      {
        subarea: "travel insurance comparison",
        title:
          "Travelers struggle to compare travel insurance policies because coverage triggers and exclusions vary widely across providers.",
        affectedUsers:
          "Travelers buying insurance before international trips",
        description:
          "Coverage differences hinge on definitions of pre-existing conditions, trip cancellation triggers, and excluded activities. Summary tables collapse these into vague categories that differ in practice.",
        whyItMatters:
          "Claim denials from mismatched expectations are common and expensive, and occur exactly when the traveler is worst off.",
        inference:
          "Trigger-level policy comparison is a persistent transparency gap in travel insurance.",
        assumption:
          "Travelers would use a comparison built on actual policy wording rather than marketing summaries.",
      },
    ],
  },
  {
    keywords: ["commerce", "ecommerce", "e-commerce", "online store", "seller", "retail", "shop"],
    problems: [
      {
        subarea: "multi-channel return logistics",
        title:
          "Independent e-commerce sellers struggle to manage returns because carriers, refund windows, and restocking rules differ by marketplace.",
        affectedUsers:
          "Independent sellers operating across several online marketplaces",
        description:
          "Each marketplace sets its own return window, label handling, and fee terms. Sellers reconcile returns manually and lose money when they miss a window or an inspection rule.",
        whyItMatters:
          "Returns are the highest-touch, lowest-margin part of small online selling, and mistakes compound across channels.",
        inference:
          "Channel-normalized return handling is a concrete operational gap for multi-marketplace sellers.",
        assumption:
          "Sellers would automate return intake if it integrated with each marketplace.",
      },
      {
        subarea: "inventory forecasting for seasonal demand",
        title:
          "Small online retailers struggle to forecast inventory for seasonal demand spikes when they lack enough sales history for demand planning.",
        affectedUsers:
          "Small online retailers with short or seasonal sales history",
        description:
          "Demand-planning tools assume years of data. Newer stores forecast by guesswork, over-ordering stock that ties up cash or under-ordering at the exact peak.",
        whyItMatters:
          "Stock-out or overstock at season peaks is the fastest way for a smaller retailer to lose a season's profit.",
        inference:
          "Low-data-friendly seasonal forecasting is an unaddressed niche between spreadsheets and enterprise planning software.",
        assumption:
          "Small retailers would feed order and supplier data into a forecast if setup is quick.",
      },
      {
        subarea: "shipping cost optimization",
        title:
          "Direct-to-consumer brands struggle to choose shipping carriers because rates depend on box size, zone, and volume tiers published in incompatible formats.",
        affectedUsers:
          "Direct-to-consumer brands shipping small volumes",
        description:
          "Carrier rates vary by dimensional weight, destination zone, and monthly volume, presented in different formats per provider. Brands discover the cheapest option only after shipping history exists.",
        whyItMatters:
          "Shipping is often the largest cost-per-order for DTC brands, and small mispicks erode thin margins.",
        inference:
          "A normalized multi-carrier rate comparison is a persistent need for brands below enterprise volume.",
        assumption:
          "Carriers will expose structured rates through integration feeds.",
      },
      {
        subarea: "review trustworthiness",
        title:
          "Consumers struggle to judge product quality from reviews because incentivized and fabricated reviews distort overall ratings.",
        affectedUsers:
          "Consumers making purchase decisions from online reviews",
        description:
          "Ratings mix verified purchases with incentivized and sometimes purchased reviews. Consumers cannot separate signal from noise, and decisive negative details appear buried in text reviews.",
        whyItMatters:
          "Distorted reviews lead to mispurchases and erode trust in marketplaces as a whole.",
        inference:
          "Credibility-weighted review synthesis is a well-documented and enduring consumer pain in e-commerce.",
        assumption:
          "Consumers would trust a synthesis that flags reviews needing scrutiny.",
      },
      {
        subarea: "checkout abandonment diagnosis",
        title:
          "Independent store owners struggle to diagnose why carts are abandoned because analytics tools are built for teams with marketing analysts.",
        affectedUsers:
          "Independent online store owners without marketing analysts",
        description:
          "Abandoned-cart analytics exists but speaks in funnels, sessions, and segments that a solo owner must interpret against feature updates they made weeks earlier.",
        whyItMatters:
          "Unclear diagnostics leave the largest measurable revenue loss in e-commerce unattended.",
        inference:
          "Plain-language abandonment diagnostics with linked hypotheses is an unmet layer over raw analytics.",
        assumption:
          "Owners will act on a diagnosis that explains the most likely cause in plain terms.",
      },
      {
        subarea: "marketplace compliance tracking",
        title:
          "Marketplace sellers struggle to track changing listing and compliance rules across platforms, risking penalties and delistings.",
        affectedUsers:
          "Sellers active on multiple online marketplaces",
        description:
          "Policies on identifiers, photos, prohibited claims, and tax documentation change with little notice, and each marketplace notifies separately. Sellers miss updates and get listings removed or accounts flagged.",
        whyItMatters:
          "A single compliance slip can interrupt revenue on a channel that took months to build.",
        inference:
          "Cross-platform policy-change tracking is a concrete, recurring operational pain for diversified sellers.",
        assumption:
          "Sellers would monitor a consolidated policy feed instead of each inbox.",
      },
    ],
  },
  {
    keywords: ["small business", "small businesses", "business", "owner", "entrepreneur"],
    problems: [
      {
        subarea: "loyalty program administration",
        title:
          "Bricks-and-mortar small businesses struggle to run loyalty programs without point-of-sale integration, so most fall back to paper stamps or abandoned apps.",
        affectedUsers:
          "Local stores and cafés without a modern point-of-sale",
        description:
          "Meaningful loyalty requires tracking repeat visits against purchases, which their register cannot do. Standalone loyalty apps require staff to operate a second device, so adoption collapses after launch.",
        whyItMatters:
          "Repeat customers are the most profitable revenue source for local business, and retention programs mostly fail to launch properly.",
        inference:
          "Loyalty that works without POS integration is an unmet pattern for the largest share of physical retail.",
        assumption:
          "Staff would issue and honor a loyalty flow that takes seconds at the register.",
      },
      {
        subarea: "bookkeeping reconciliation",
        title:
          "Small business owners struggle to reconcile bookkeeping against payments across cash, cards, and invoices without a dedicated bookkeeper.",
        affectedUsers:
          "Owner-operators handling their own books",
        description:
          "Sales arrive through a card terminal, invoices, and cash while purchases come from multiple sources. Reconciling the ledger monthly is tedious and error-prone, and errors surface only at tax time.",
        whyItMatters:
          "Reconciliation mistakes cause misreported income, missed deductions, and tax-season scramble.",
        inference:
          "Automated reconciliation that tolerates messy, mixed payment sources is a concrete unmet need.",
        assumption:
          "Owners will connect their banking and payment feeds despite setup effort.",
      },
      {
        subarea: "local advertising attribution",
        title:
          "Small service businesses struggle to tell whether local advertising works because calls, walk-ins, and online leads are not connected.",
        affectedUsers:
          "Local service businesses spending on local ads",
        description:
          "Ads produce phone calls, walk-ins, and online bookings, but each arrives through a different channel. Without attribution the owner cannot tell which spend drives revenue, so budgeting is guesswork.",
        whyItMatters:
          "Advertising is often the largest controllable expense, and misallocation silently burns local budget.",
        inference:
          "Quote-worthy calls and walk-ins are high-signal but unconnected for local service businesses.",
        assumption:
          "Owners would adopt call tracking if it required no change to their phone number.",
      },
      {
        subarea: "software stack sprawl",
        title:
          "Small business owners struggle to manage a proliferation of subscription tools for booking, payments, and messaging that overlap and multiply costs.",
        affectedUsers:
          "Small business owners subscribing to multiple single-purpose tools",
        description:
          "Booking, invoicing, payments, and customer messaging each start as a separate subscription that grows in price. The stack becomes costly, overlapping, and hard for staff to operate.",
        whyItMatters:
          "Subscription creep quietly absorbs margin that a small business can rarely recover.",
        inference:
          "Stack consolidation and overlap detection is an emerging but unserved management need for small businesses.",
        assumption:
          "Owners would consolidate if migration between duplicated tools were low-friction.",
      },
      {
        subarea: "first-employee administration",
        title:
          "First-time small business employers struggle with payroll, leave, and compliance paperwork when hiring their first employees.",
        affectedUsers:
          "Small business owners hiring their first employees",
        description:
          "Running payroll, tracking leave, and meeting employment rules arrive as a sudden administrative wall. Owners learn requirements by discovering them through mistakes or penalties.",
        whyItMatters:
          "Compliance mistakes create fines and employee disputes at the exact moment the business scales past the owner's solo workflow.",
        inference:
          "Guided, jurisdiction-aware first-hire administration is a clearly under-tooled transition point.",
        assumption:
          "New employers will adopt guided administration if it replaces spreadsheet-based attempts.",
      },
      {
        subarea: "systematic customer feedback capture",
        title:
          "Service small businesses struggle to collect and act on feedback systematically because reviews scatter across Google, Yelp, and social mentions.",
        affectedUsers:
          "Service businesses like salons, repair shops, and consultancies",
        description:
          "Feedback arrives through review sites, social messages, and in-person conversation. Owners cannot aggregate it into a picture of what to fix, and repeated complaints go unnoticed.",
        whyItMatters:
          "Unresolved patterns of complaint silently drive churn and reviews downward.",
        inference:
          "Cross-channel feedback aggregation is a concrete, attainable layer for review-heavy service businesses.",
        assumption:
          "Owners would respond through one inbox if reviews were pulled together.",
      },
    ],
  },
  {
    keywords: ["remote work", "remote", "distributed", "work from home", "asynchronous"],
    problems: [
      {
        subarea: "asynchronous decision continuity",
        title:
          "Distributed teams struggle with asynchronous decisions because context hides inside long chat threads that new members cannot search or trust.",
        affectedUsers:
          "New members and contributors on asynchronous remote teams",
        description:
          "Decisions and their reasoning live across chat threads, docs, and recordings. A new contributor cannot reconstruct why a decision was made, so they re-ask, duplicate work, or guess.",
        whyItMatters:
          "Decision context loss is a compounding productivity cost in teams that communicate mostly in writing.",
        inference:
          "An indexed decision ledger is a concrete missing layer between chat history and team memory.",
        assumption:
          "Teams will invest in documenting decisions if capture is automatic rather than manual.",
      },
      {
        subarea: "meeting necessity signal",
        title:
          "Distributed managers struggle to cut meeting load because they lack signals about whether a synchronous discussion is actually needed.",
        affectedUsers:
          "Managers of fully distributed teams",
        description:
          "Calendars fill with recurring meetings that once made sense in an office. Without awareness of which decisions could move async, managers keep meetings out of inertia and watch focus time shrink.",
        whyItMatters:
          "Meeting load is the most-cited driver of reduced deep work in remote-first companies.",
        inference:
          "Meeting-pressure visibility with an async alternative is a concrete lever managers lack.",
        assumption:
          "Managers would act on meeting-pressure insights rather than defaulting to existing calendars.",
      },
      {
        subarea: "time-zone collaboration windows",
        title:
          "Remote teams spread across time zones struggle to find overlapping working windows, causing review and decision latency.",
        affectedUsers:
          "Engineers and reviewers on globally distributed teams",
        description:
          "Code reviews and approvals stall when the requester's day ends before the reviewer's begins. Teams waste hours coordinating a window that shifts as daylight saving changes.",
        whyItMatters:
          "Cross-zone latency is a structural throughput tax on distributed product teams.",
        inference:
          "Window-aware handoff and review scheduling is a concrete, repetitive coordination pain.",
        assumption:
          "Teams would adapt handoff patterns if they were shown their real delay hotspots.",
      },
      {
        subarea: "remote onboarding",
        title:
          "Remote-first companies struggle to onboard new hires without office osmosis, leading to slower ramp-up and a sense of disconnection.",
        affectedUsers:
          "HR and engineering managers onboarding remote hires",
        description:
          "New remote hires lack incidental learning from nearby desks: how tools are used, who owns what, and how decisions actually happen. Onboarding checklists cover accounts, not working norms.",
        whyItMatters:
          "Longer ramp-up on a remote hire directly delays team output and raises early regrettable turnover.",
        inference:
          "Norm-rich, structured onboarding is the primary lever remote companies have instead of physical osmosis.",
        assumption:
          "Managers would invest in onboarding content if it measurably shortened ramp-up.",
      },
      {
        subarea: "home office ergonomics",
        title:
          "Remote employees struggle to know whether their home setup is harming posture because no one inspects home workstations the way offices once did.",
        affectedUsers:
          "Remote employees working from improvised home setups",
        description:
          "Laptops sit on kitchen tables and couches for months. Without an office ergonomics review, pain builds slowly and shows up as medical visits or absenteeism much later.",
        whyItMatters:
          "Preventable musculoskeletal strain is a growing, invisible cost for remote workforces.",
        inference:
          "Self-serve, guided remote ergonomic assessment is an out-of-office wellbeing gap that employers do not yet cover.",
        assumption:
          "Employees will complete an ergonomics self-assessment and follow low-cost corrections.",
      },
      {
        subarea: "distance-based team wellbeing sensing",
        title:
          "First-time remote managers struggle to assess workload and wellbeing at a distance because the informal cues of an office have disappeared.",
        affectedUsers:
          "First-time managers of distributed reports",
        description:
          "Managers once noticed strain through presence and casual conversation. Remotely, workload signals hide in muted participation and late output, and managers realize an issue only in bad one-on-ones.",
        whyItMatters:
          "Late detection of overload leads to burnout and attrition that remote managers cannot recover quickly.",
        inference:
          "Lightweight, respectful workload signal sensing is an unmet need for new remote managers.",
        assumption:
          "Employees would share wellbeing signals if presented as anonymous, aggregated, and consent-based.",
      },
    ],
  },
  {
    keywords: ["mental health", "mental", "therapy", "therapist", "wellbeing", "counseling"],
    problems: [
      {
        subarea: "waitlist bridge support",
        title:
          "Therapy providers struggle to offer useful support to clients on long waitlists because there is no structured between-session layer once intake is complete.",
        affectedUsers:
          "Therapists and clinics with long client waitlists",
        description:
          "Clients finish intake and then wait weeks with no contact. Whatever readiness they built at referral decays, and providers re-start from zero when the slot opens.",
        whyItMatters:
          "Waitlist decay wastes limited clinical capacity in a system already short on providers.",
        inference:
          "A structured waitlist bridge is a concrete, low-cost layer between intake and first session.",
        assumption:
          "Providers would roll out waitlist tools that require minimal clinical time per client.",
      },
      {
        subarea: "mood check-in interpretation",
        title:
          "People using self-directed mood and wellbeing apps struggle to interpret daily tracking into recognizable patterns or next steps.",
        affectedUsers:
          "Users of self-directed mental wellbeing apps",
        description:
          "Mood journals output numbers and streaks without context. A user sees days marked 'low' but cannot tell what environment, sleep, or load changes preceded them, so the data does not inform action.",
        whyItMatters:
          "Uninterpreted tracking data drives disengagement from wellbeing tools within weeks.",
        inference:
          "Pattern-level interpretation of personal mood logs is an unmet layer on top of popular journaling apps.",
        assumption:
          "Users would share context tags (sleep, load, social) to receive better pattern feedback.",
      },
      {
        subarea: "benefits triage",
        title:
          "Employees struggle to find the right mental health support tier because benefits portals list programs without guiding users through triage.",
        affectedUsers:
          "Employees using workplace mental health benefits",
        description:
          "Portals present EAPs, therapy networks, coaching, and self-serve tools as a flat list. An employee in crisis does not know which entry point matches their level of need, so many take the wrong path or none.",
        whyItMatters:
          "Misrouted help delays access at exactly the moment speed matters most.",
        inference:
          "Situation-based triage is the missing routing layer for mental health benefit catalogs.",
        assumption:
          "Employees will answer a quick triage flow before selecting a benefit path.",
      },
      {
        subarea: "informal caregiver burnout",
        title:
          "Informal caregivers struggle to notice their own burnout while managing care routines for a family member.",
        affectedUsers:
          "People providing daily care to a family member at home",
        description:
          "Care schedules, appointments, and escalation duties crowd out rest and self-monitoring. Caregivers recognize exhaustion only at a crisis point, and no tool frames the caregiver's own wellbeing as data.",
        whyItMatters:
          "Caregiver burnout often triggers the same demand for services the caregiver was preventing.",
        inference:
          "A caregiver-facing load-and-wellbeing view is an underserved segment distinct from patient-facing apps.",
        assumption:
          "Caregivers would log a small daily load signal if the tool frames it as protecting their care ability.",
      },
      {
        subarea: "between-session engagement for teletherapy",
        title:
          "Teletherapy clinicians struggle to keep engagement alive between sessions because homework tools are basic and disconnected from the therapy they deliver.",
        affectedUsers:
          "Teletherapy clinicians using manual homework assignments",
        description:
          "Between-session practice is assigned as verbal or PDF instructions. Clinicians cannot see whether a client attempted the work, so each session re-litigates the previous one.",
        whyItMatters:
          "Outcome research ties progress to between-session practice, which current teletherapy tools do not support well.",
        inference:
          "Session-linked practice tracking is a concrete gap in the teletherapy tooling stack.",
        assumption:
          "Clients will complete short, structured between-session activities tied to a known method.",
      },
      {
        subarea: "adolescent anxiety resource credibility",
        title:
          "Parents of adolescents with anxiety struggle to find credible, age-appropriate guidance because online content mixes clinical advice with influencer material.",
        affectedUsers:
          "Parents seeking guidance for an anxious teenager",
        description:
          "Search results blend licensed mental-health writing, unregulated apps, and personal content marketed to parents. Parents cannot distinguish clinical recommendations from anecdote, so actionable first steps are unclear.",
        whyItMatters:
          "Misinformation and unclear first steps delay professional help during a sensitive developmental window.",
        inference:
          "Curated, evidence-tagged guidance for parents of anxious teens is underserved by both clinical portals and open content.",
        assumption:
          "Parents would choose a clearly sourced guidance source over ambiguous search results.",
      },
    ],
  },
];

export function matchDiscoveryDomain(topic: string): Domain | null {
  const normalized = topic.toLowerCase().trim();
  for (const domain of DISCOVERY_INDEX) {
    for (const keyword of domain.keywords) {
      if (normalized.includes(keyword)) {
        return domain;
      }
    }
  }
  return null;
}