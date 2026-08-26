{
  "scenarios": [
    {
      "id": "register-family-doctor-first-visit",
      "title": "Register as a new patient at a family doctor's office",
      "description": "You just moved to the neighbourhood and need a regular doctor. Walk into a family health centre, meet the receptionist, and register as a new patient.",
      "category": "healthcare",
      "mode": "both",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Priya Sandhu, the front-desk receptionist at Maple Grove Family Health Centre in Calgary. You are friendly and patient with newcomers. Ask if they are registering as a new patient, whether they have a provincial health card, their contact information, and any medications or allergies to put on file. Offer useful facts: the clinic is accepting new patients, Dr. Chen and Dr. Osei are taking them, the first appointment is a Meet-and-Greet checkup, and the clinic has walk-in evenings on Tuesdays and Thursdays. Book them a first appointment before ending the call or conversation. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Good morning, welcome to Maple Grove Family Health Centre \u2014 are you hoping to register with a doctor today?",
      "expected_turns": 6,
      "success_criteria": [
        "User states they want to register as a new patient",
        "User responds to questions about health card, contact info, and medications or allergies",
        "User asks at least one question about the clinic, doctors, or hours",
        "User confirms or requests a first appointment time",
        "User closes politely with thanks"
      ],
      "vocabulary_targets": [
        "family doctor",
        "walk-in clinic",
        "health card",
        "appointment",
        "clinic"
      ],
      "grammar_targets": [
        "present simple with need and want (I need to see a doctor)",
        "Wh- questions (Which doctors are taking new patients?)",
        "polite requests with Could I...?"
      ],
      "cultural_notes": "In Canada, most routine care goes through a family doctor, but many people without one use walk-in clinics, which take patients without appointments. Clinics ask for your provincial health card at every visit, and finding a doctor accepting new patients can take time, so registering early pays off.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "pharmacy-symptoms-otc",
      "title": "Describe your symptoms and ask about over-the-counter medicine",
      "description": "You have a fever, cough, and headache and want relief fast. Talk to the pharmacist, describe your symptoms, and ask which over-the-counter medicine is right for you.",
      "category": "healthcare",
      "mode": "both",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Marcus Thibodeau, the pharmacist at a busy corner drugstore in Ottawa. You are approachable and explain things in plain language. Ask what symptoms the customer has, how long they have lasted, and whether they take other medications or have any allergies. Recommend a sensible option such as acetaminophen or ibuprofen for fever and aches, remind them ibuprofen should be taken with food, and share facts: see a doctor if the fever lasts more than three days, and pharmacists in many provinces can prescribe for minor ailments. Steer them to a doctor or telehealth if anything sounds serious. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Hi there, welcome in \u2014 I'm Marcus, the pharmacist. What's bothering you today?",
      "expected_turns": 6,
      "success_criteria": [
        "User describes at least two symptoms clearly",
        "User answers questions about duration, other medications, or allergies",
        "User asks at least one question about an over-the-counter product",
        "User repeats back how and when to take the recommended medicine",
        "User thanks the pharmacist before leaving"
      ],
      "vocabulary_targets": [
        "pharmacist",
        "symptom",
        "fever",
        "cough",
        "over-the-counter",
        "painkiller",
        "allergy"
      ],
      "grammar_targets": [
        "describing symptoms with I have / I feel...",
        "How long have you had...? present perfect questions",
        "modals of advice: should, could, it's better to..."
      ],
      "cultural_notes": "Canadian pharmacists are highly accessible frontline health providers \u2014 no appointment needed \u2014 and in several provinces they can now prescribe for minor ailments like pink eye or UTIs. Many medications sit behind the counter even when no prescription is required, so asking the pharmacist is normal and free.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "call-health-link-advice",
      "title": "Call Health Link for non-emergency health advice",
      "description": "It's late at night, your child has a fever and you're worried. Call the provincial telehealth line, describe the symptoms to the nurse, and find out what to do next.",
      "category": "healthcare",
      "mode": "both",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Tanya Boudreau, a registered nurse answering the provincial Health Link telehealth line (dial 811 in several provinces). You speak calmly and clearly because phone calls remove body language. Ask who you are speaking about, the main symptoms, when they started, temperature readings, and anything tried so far. Give practical self-care advice for a child's fever: fluids, rest, children's acetaminophen dosed by weight, and light clothing. State your escalation rules plainly: trouble breathing, a stiff neck, or unresponsiveness means hang up and dial 911; otherwise a family doctor or walk-in clinic tomorrow is fine. End by summarizing the plan. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Health Link, this is Tanya, I'm a registered nurse. Can you tell me what's going on tonight?",
      "expected_turns": 5,
      "success_criteria": [
        "User states who the call is about and the main symptoms",
        "User answers the nurse's questions about timing and temperature",
        "User asks at least one question about care or warning signs",
        "User repeats back the plan or warning signs in their own words",
        "User ends the call appropriately"
      ],
      "vocabulary_targets": [
        "symptom",
        "fever",
        "nausea",
        "dizziness",
        "emergency",
        "appointment"
      ],
      "grammar_targets": [
        "sequencing words: first, then, since last night",
        "present continuous for current symptoms (she is throwing up)",
        "checking understanding: So I should...?"
      ],
      "cultural_notes": "Most provinces run a free 24/7 telehealth nurse line \u2014 Health Link at 811 in Alberta, 811 in BC, Telehealth Ontario at 1-866-797-0000 \u2014 for advice when it's not an emergency. Nurses there routinely direct callers between home care, a clinic the next day, or 911, and interpretation is available in dozens of languages.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hospital-emergency-triage",
      "title": "Get through the emergency room wait and understand triage",
      "description": "You cut your hand badly while cooking and headed to a city hospital. Answer the triage nurse's questions, describe the injury, and find out why you're waiting.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Jordan Kowalski, the triage nurse at a downtown hospital emergency department. You are efficient but kind, moving fast because the department is slammed. Rapidly collect: what happened, how the injury occurred, when, tetanus status, allergies, medications, and pain on a scale of one to ten. Explain triage honestly: the man clutching his chest went straight back, so a deep-but-stable hand laceration means a two-to-four-hour wait; stitches are likely, and the user should tell the desk immediately if bleeding restarts or the hand goes numb. Encourage questions but keep replies short. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Hi, I'm Jordan, the triage nurse \u2014 what happened to your hand?",
      "expected_turns": 7,
      "success_criteria": [
        "User explains how the injury happened using past tenses",
        "User rates pain and describes bleeding or numbness clearly",
        "User answers triage questions about allergies, medications, and tetanus",
        "User asks at least one question about the wait, triage, or treatment",
        "User restates what to do if symptoms change"
      ],
      "vocabulary_targets": [
        "emergency room",
        "triage",
        "bleeding",
        "injury",
        "waiting room",
        "nurse"
      ],
      "grammar_targets": [
        "past simple and past continuous narration (I was cutting onions when...)",
        "intensity: really, quite, on a scale of one to ten",
        "indirect questions (Could you tell me how long the wait is?)"
      ],
      "cultural_notes": "Canadian emergency rooms run on triage, not first-come-first-served: a nurse ranks every arrival by urgency, so chest pain jumps ahead of a cut hand even after hours of waiting. Bring your health card, expect long waits for non-urgent problems, and know that urgent care centres handle many injuries faster than big-city ERs.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "understand-prescription-label",
      "title": "Understand a prescription label and ask the pharmacist questions",
      "description": "You picked up your first Canadian prescription and the label is confusing. Go back to the counter and have the pharmacist walk you through it.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Grace Lin, the pharmacist at a supermarket pharmacy in Winnipeg. You love teaching and use the actual label as your teaching tool. Walk through it piece by piece when asked: the drug name amoxicillin, the dosage of one capsule three times a day, taken until finished even if feeling better, with or without food, what to do about a missed dose, one refill remaining, storage away from humidity, and avoiding alcohol. Check understanding by asking the user to say the plan back to you in their own words. Mention that pharmacists can extend refills or call the doctor when appropriate. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Hi again \u2014 I'm Grace, the pharmacist. Did you have questions about the antibiotic we just filled for you?",
      "expected_turns": 6,
      "success_criteria": [
        "User asks about at least three parts of the label (dose, timing, refills, or storage)",
        "User asks a clarifying question when confused",
        "User correctly restates the full directions in their own words",
        "User asks what to do about a missed dose or leftover pills",
        "User thanks the pharmacist and confirms next steps"
      ],
      "vocabulary_targets": [
        "prescription",
        "dosage",
        "refill",
        "side effect",
        "antibiotic",
        "ointment"
      ],
      "grammar_targets": [
        "frequency expressions: twice a day, every eight hours, until finished",
        "Wh- questions about instructions (What if I miss a dose?)",
        "first conditional (If I forget a dose, what happens?)"
      ],
      "cultural_notes": "Prescription labels in Canada pack the drug name, strength, directions, prescriber, and refill count onto one sticker, and pharmacists expect label questions \u2014 it's part of the job. Provinces differ on paying for prescriptions: provincial plans often cover seniors, children, and low-income households, while many working adults rely on private drug plans through employers.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "book-specialist-referral-followup",
      "title": "Book a specialist referral follow-up by phone",
      "description": "Your family doctor sent a referral to a knee specialist weeks ago. Phone the specialist's office and get the follow-up appointment on the calendar.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Devon Marchand, the booking clerk at Lakeview Orthopaedic Specialists in Mississauga. You are brisk but helpful on the phone. Confirm the referral arrived from Dr. Osei, explain the surgeon's current wait is six to eight weeks for consultations, then offer real choices: Tuesday March 3rd at 10:40 a.m., Thursday March 5th at 2:15 p.m., or the cancellation list for something sooner. Give preparation instructions: bring the health card, a list of current medications, and any imaging CDs, arrive fifteen minutes early for paperwork, and the X-ray was already attached. Ask if they want the reminder text. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Thanks for holding, this is Devon calling back from Lakeview Orthopaedics \u2014 you left a message about a referral?",
      "expected_turns": 5,
      "success_criteria": [
        "User states who referred them and the reason for the visit",
        "User asks about wait times or available appointment slots",
        "User chooses a date and confirms it clearly",
        "User asks or confirms at least one preparation detail",
        "User closes the phone call politely"
      ],
      "vocabulary_targets": [
        "referral",
        "specialist",
        "follow-up",
        "appointment",
        "checkup"
      ],
      "grammar_targets": [
        "future arrangements with going to and will",
        "polite phone requests (I was wondering if...)",
        "prepositions of time: on Tuesday, at 2:15, in six weeks"
      ],
      "cultural_notes": "Specialists in Canada almost never take self-referrals: your family doctor sends one, then the specialist's office books you, and waits of weeks to many months are normal for non-urgent consults. Offices commonly run cancellation lists, and asking politely to be called on one is standard practice.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "dental-checkup-treatment-options",
      "title": "Talk through treatment options at a dental checkup",
      "description": "Midway through your first dental cleaning in years, the hygienist flags a problem tooth and the dentist joins with options and prices. Discuss what to do.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Dr. Amara Osei, a dentist in Halifax mid-checkup. You show findings on the screen: one small cavity in a back molar, early gum inflammation, and staining. Lay out honest options: a small filling now around $230, watching it six months with fluoride toothpaste and risking it growing, plus a scaling plan for the gums. Explain freezing, the noise, and the time involved. Ask about sensitivity, flossing habits, and whether they have dental insurance, noting most patients pay privately or through work plans and your front desk provides predetermination forms for claims. Recommend but let the patient choose. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Everything looks pretty solid overall, but let's talk about that bottom molar on the left \u2014 any sensitivity or pain when you chew?",
      "expected_turns": 6,
      "success_criteria": [
        "User describes symptoms or dental habits in response to questions",
        "User asks about at least two treatment options, costs, or procedures",
        "User expresses a preference or decision about treatment",
        "User asks or confirms something about payment or insurance",
        "User books or agrees on a next step"
      ],
      "vocabulary_targets": [
        "checkup",
        "treatment",
        "appointment",
        "insurance",
        "pain"
      ],
      "grammar_targets": [
        "would like / I think I'll for decisions",
        "comparatives: less expensive, better than, sooner",
        "asking for recommendations (What would you recommend?)"
      ],
      "cultural_notes": "Dental care is separate from provincial health coverage in Canada: adults pay out of pocket or through employer benefit plans, so clinics quote fees and submit insurance claims for you. A federal dental care program has been rolling out for eligible families, and getting a predetermination from your insurer before bigger work is common.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "interpret-bloodwork-results",
      "title": "Go over bloodwork results with your doctor",
      "description": "Your clinic called saying your annual bloodwork is mostly fine but flagged two items. Sit down with your doctor, understand the numbers, and agree on next steps.",
      "category": "healthcare",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Dr. Rachel Bernstein, a family physician in Toronto reviewing annual labs. Results: LDL cholesterol mildly elevated at 3.9, vitamin D low at 38, everything else normal including glucose and thyroid. Explain in plain language what each flag means and what it doesn't mean \u2014 this is risk over years, not a crisis. Offer options: dietary changes and four months of vitamin D supplementation with a repeat test in three months, or adding a statin discussion if lifestyle fails, and mention muscle aches as a known side effect to report. Invite the patient's own research and worries seriously, and close by agreeing on the plan and booking the follow-up. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Come on in \u2014 I've got your bloodwork up on screen. Overall it's reassuring news, though two numbers are worth discussing. Want the quick version or the details?",
      "expected_turns": 7,
      "success_criteria": [
        "User asks what at least two flagged results mean in plain language",
        "User shares a concern, symptom, or question about medication options",
        "User confirms understanding of the agreed plan",
        "User asks about lifestyle changes, retesting, or timelines",
        "User agrees on a follow-up before the visit ends"
      ],
      "vocabulary_targets": [
        "bloodwork",
        "diagnosis",
        "condition",
        "screening",
        "treatment",
        "follow-up"
      ],
      "grammar_targets": [
        "reported speech (So you're saying my cholesterol is slightly high)",
        "conditionals about outcomes (If my levels drop, we retest later)",
        "clarifying numbers and ranges (Is 3.9 much above the limit?)"
      ],
      "cultural_notes": "Canadian family doctors typically phone only about abnormal results, so a booked review is your chance to dig in \u2014 bring questions and ask for printed copies, which you're entitled to. Labs report in metric units, reference ranges vary slightly between provinces, and shared decision-making about options like statins is standard practice here.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "mental-health-intake-appointment",
      "title": "Describe how you're feeling at a mental health intake appointment",
      "description": "After months of pushing through, you booked an intake at a community mental health clinic. Tell the counsellor honestly what the last few months have been like.",
      "category": "healthcare",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Sam Whitehorse, an intake counsellor at a community mental health centre in Saskatoon. You create safety first: confidentiality rules, no judgment, and the user controls pacing. Gently map the situation: what prompted reaching out now, mood, sleep, appetite, energy, work or school impact, supports, alcohol or cannabis use, and how long this has been building. Screen safety softly with one direct question about thoughts of self-harm, and respond warmly to whatever answer comes. Offer realistic paths: group program starting in two weeks, individual counselling waitlist of three to four weeks, sliding-scale fees, and a same-day crisis line number to keep. Close by summarizing what you heard in caring language. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Thanks for coming in \u2014 I'm Sam, and I know walking through that door isn't easy. Everything you share here stays confidential unless there's a safety risk. So, what made you decide to reach out now?",
      "expected_turns": 6,
      "success_criteria": [
        "User describes feelings and experiences using emotion vocabulary",
        "User answers questions about sleep, energy, or daily impact",
        "User responds honestly to the safety question",
        "User asks at least one question about programs, waitlists, or cost",
        "User leaves with a stated next step they understood"
      ],
      "vocabulary_targets": [
        "anxiety",
        "counselling",
        "referral",
        "specialist",
        "appointment"
      ],
      "grammar_targets": [
        "present perfect continuous (I've been sleeping badly for months)",
        "softening language: kind of, a little, more or less",
        "naming feelings precisely: overwhelmed, drained, on edge"
      ],
      "cultural_notes": "Mental health care in Canada blends family-doctor referrals, community agencies with free or sliding-scale counselling, and workplace Employee Assistance Programs, though waits for individual therapy can stretch for weeks. Crisis lines across the country now funnel to Talk Suicide Canada at 9-8-8, and seeking help carries no immigration or employment consequences.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "health-coverage-gaps-private-insurance",
      "title": "Ask about health coverage gaps and private insurance",
      "description": "You learned the hard way that your health card doesn't cover everything. Visit an insurance broker and figure out what supplemental coverage actually makes sense for your family.",
      "category": "healthcare",
      "mode": "immigration",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Nadia Karim, an independent insurance broker in Edmonton known for straight talk. Map the gaps first: provincial plans skip most dental, vision, prescription drugs, ambulance fees, physiotherapy, and travel medical top-ups. Compare paths fairly: joining a spouse's employer group plan if available is usually cheapest, individual plans run roughly $70 to $150 monthly for a family, and deductibles, co-pays, and annual maximums change value a lot. Explain claims: pay upfront at the dentist, submit the receipt or flash the insurer's card at participating providers, reimbursement in days. Flag honestly that pre-existing conditions can carry waiting periods, and newcomers in some provinces face a coverage gap before provincial care even starts. Recommend based on their family situation. If a sentence comes out tangled, restate it smoothly inside your reply before moving on \u2014 never correct harshly.",
      "opening_line": "Hi, I'm Nadia \u2014 thanks for coming by. On the phone you mentioned your health card didn't cover a prescription and it stung a bit. Where would you like to start?",
      "expected_turns": 7,
      "success_criteria": [
        "User names at least two services provincial coverage does not pay for",
        "User asks about premiums, deductibles, or the claims process",
        "User describes their family situation well enough to get a recommendation",
        "User compares at least two coverage options aloud",
        "User reaches or defers a decision with a clear reason"
      ],
      "vocabulary_targets": [
        "coverage",
        "insurance",
        "claim",
        "deductible",
        "health card",
        "emergency"
      ],
      "grammar_targets": [
        "comparatives for value: more expensive than, covers less, better deal",
        "modals of possibility: may, might, could for coverage rules",
        "complex questions (Does that mean I'd pay upfront and get reimbursed?)"
      ],
      "cultural_notes": "Provincial health cards cover hospital and physician care but not most dental, vision, drugs, or ambulances \u2014 gaps newcomers from systems with broader public coverage often discover mid-bill. New residents in several provinces wait up to three months before provincial coverage starts, making private interim coverage worth considering, and employer benefits remain the most common supplement.",
      "is_premium": true,
      "is_published": true
    }
  ],
  "vocabulary": [
    {
      "id": "vocab-hep-01",
      "word": "doctor",
      "phonetic": "/\u02c8d\u0251\u02d0kt\u0259r/",
      "translations": {
        "pa": "\u0a21\u0a3e\u0a15\u0a1f\u0a30",
        "hi": "\u0921\u0949\u0915\u094d\u091f\u0930",
        "zh": "\u533b\u751f",
        "es": "m\u00e9dico / m\u00e9dica"
      },
      "level": "seed",
      "category": "healthcare",
      "example_sentences": [
        "Ask the receptionist which doctor is taking new patients.",
        "My family doctor has treated me for ten years."
      ],
      "confusion_pairs": [
        "nurse practitioner",
        "specialist"
      ],
      "fsrs_params": {
        "difficulty": 0.2,
        "stability": 4.8
      }
    },
    {
      "id": "vocab-hep-02",
      "word": "nurse",
      "phonetic": "/n\u025c\u02d0rs/",
      "translations": {
        "pa": "\u0a28\u0a30\u0a38",
        "hi": "\u0928\u0930\u094d\u0938",
        "zh": "\u62a4\u58eb",
        "es": "enfermero / enfermera"
      },
      "level": "seed",
      "category": "healthcare",
      "example_sentences": [
        "A nurse checked my blood pressure before the doctor came in.",
        "Call the clinic and ask to speak with the nurse."
      ],
      "confusion_pairs": [
        "nurse practitioner",
        "personal support worker"
      ],
      "fsrs_params": {
        "difficulty": 0.22,
        "stability": 4.6
      }
    },
    {
      "id": "vocab-hep-03",
      "word": "sick",
      "phonetic": "/s\u026ak/",
      "translations": {
        "pa": "\u0a2c\u0a3f\u0a2e\u0a3e\u0a30",
        "hi": "\u092c\u0940\u092e\u093e\u0930",
        "zh": "\u751f\u75c5\u7684",
        "es": "enfermo / enferma"
      },
      "level": "seed",
      "category": "healthcare",
      "example_sentences": [
        "I'm calling in sick to work this morning.",
        "She stayed home sick with a bad cold."
      ],
      "confusion_pairs": [
        "unwell",
        "nauseous"
      ],
      "fsrs_params": {
        "difficulty": 0.2,
        "stability": 4.5
      }
    },
    {
      "id": "vocab-hep-04",
      "word": "pain",
      "phonetic": "/pe\u026an/",
      "translations": {
        "pa": "\u0a26\u0a30\u0a26",
        "hi": "\u0926\u0930\u094d\u0926",
        "zh": "\u75bc\u75db",
        "es": "dolor"
      },
      "level": "seed",
      "category": "healthcare",
      "example_sentences": [
        "I have a sharp pain in my lower back.",
        "Tell the nurse where the pain is and how bad it feels."
      ],
      "confusion_pairs": [
        "ache",
        "soreness"
      ],
      "fsrs_params": {
        "difficulty": 0.24,
        "stability": 4.4
      }
    },
    {
      "id": "vocab-hep-05",
      "word": "medicine",
      "phonetic": "/\u02c8medsn/",
      "translations": {
        "pa": "\u0a26\u0a35\u0a3e\u0a08",
        "hi": "\u0926\u0935\u093e",
        "zh": "\u836f\u54c1",
        "es": "medicamento"
      },
      "level": "seed",
      "category": "healthcare",
      "example_sentences": [
        "Take this medicine with food twice a day.",
        "Some cold medicines make you drowsy, so read the label."
      ],
      "confusion_pairs": [
        "medication",
        "supplement"
      ],
      "fsrs_params": {
        "difficulty": 0.25,
        "stability": 4.3
      }
    },
    {
      "id": "vocab-hep-06",
      "word": "health card",
      "phonetic": "/\u02c8hel\u03b8 k\u0251\u02d0rd/",
      "translations": {
        "pa": "\u0a38\u0a3f\u0a39\u0a24 \u0a15\u0a3e\u0a30\u0a21",
        "hi": "\u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u0915\u093e\u0930\u094d\u0921",
        "zh": "\u533b\u7597\u5361",
        "es": "tarjeta de salud"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "Always carry your health card with you to appointments.",
        "The clerk will ask for your health card before the visit."
      ],
      "confusion_pairs": [
        "driver's licence",
        "private insurance card"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 4.0
      }
    },
    {
      "id": "vocab-hep-07",
      "word": "clinic",
      "phonetic": "/\u02c8kl\u026an\u026ak/",
      "translations": {
        "pa": "\u0a15\u0a32\u0a40\u0a28\u0a3f\u0a15",
        "hi": "\u0915\u094d\u0932\u093f\u0928\u093f\u0915",
        "zh": "\u8bca\u6240",
        "es": "cl\u00ednica"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "The clinic down the street is open until nine tonight.",
        "There's usually a long line at the clinic on Saturday mornings."
      ],
      "confusion_pairs": [
        "doctor's office",
        "hospital"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 4.1
      }
    },
    {
      "id": "vocab-hep-08",
      "word": "appointment",
      "phonetic": "/\u0259\u02c8p\u0254\u026antm\u0259nt/",
      "translations": {
        "pa": "\u0a05\u0a2a\u0a3e\u0a07\u0a70\u0a1f\u0a2e\u0a48\u0a02\u0a1f",
        "hi": "\u0905\u092a\u0949\u0907\u0902\u091f\u092e\u0947\u0902\u091f",
        "zh": "\u9884\u7ea6",
        "es": "cita"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "I booked an appointment to see my doctor on Friday.",
        "Can I move my appointment to next week?"
      ],
      "confusion_pairs": [
        "booking",
        "walk-in visit"
      ],
      "fsrs_params": {
        "difficulty": 0.32,
        "stability": 3.9
      }
    },
    {
      "id": "vocab-hep-09",
      "word": "pharmacy",
      "phonetic": "/\u02c8f\u0251\u02d0rm\u0259si/",
      "translations": {
        "pa": "\u0a2b\u0a3e\u0a30\u0a2e\u0a47\u0a38\u0a40",
        "hi": "\u092b\u093e\u0930\u094d\u092e\u0947\u0938\u0940",
        "zh": "\u836f\u623f",
        "es": "farmacia"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "Pick up your prescription at the pharmacy on Main Street.",
        "The pharmacy can deliver refills to your door."
      ],
      "confusion_pairs": [
        "drugstore",
        "laboratory"
      ],
      "fsrs_params": {
        "difficulty": 0.31,
        "stability": 4.0
      }
    },
    {
      "id": "vocab-hep-10",
      "word": "pharmacist",
      "phonetic": "/\u02c8f\u0251\u02d0rm\u0259s\u026ast/",
      "translations": {
        "pa": "\u0a2b\u0a3c\u0a3e\u0a30\u0a2e\u0a3e\u0a38\u0a3f\u0a38\u0a1f",
        "hi": "\u092b\u093c\u093e\u0930\u094d\u092e\u093e\u0938\u093f\u0938\u094d\u091f",
        "zh": "\u836f\u5242\u5e08",
        "es": "farmac\u00e9utico / farmac\u00e9utica"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "Ask the pharmacist before mixing cold medicine with other drugs.",
        "The pharmacist can print a list of all your medications."
      ],
      "confusion_pairs": [
        "pharmacy technician",
        "chemist (UK)"
      ],
      "fsrs_params": {
        "difficulty": 0.34,
        "stability": 3.8
      }
    },
    {
      "id": "vocab-hep-11",
      "word": "fever",
      "phonetic": "/\u02c8fi\u02d0v\u0259r/",
      "translations": {
        "pa": "\u0a2c\u0a41\u0a16\u0a3c\u0a3e\u0a30",
        "hi": "\u092c\u0941\u0916\u093e\u0930",
        "zh": "\u53d1\u70e7",
        "es": "fiebre"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "He has a fever of thirty-nine degrees.",
        "If the fever lasts more than three days, see a doctor."
      ],
      "confusion_pairs": [
        "chills",
        "high temperature"
      ],
      "fsrs_params": {
        "difficulty": 0.33,
        "stability": 3.7
      }
    },
    {
      "id": "vocab-hep-12",
      "word": "cough",
      "phonetic": "/k\u0254\u02d0f/",
      "translations": {
        "pa": "\u0a16\u0a70\u0a18",
        "hi": "\u0916\u093e\u0902\u0938\u0940",
        "zh": "\u54b3\u55fd",
        "es": "tos"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "Her cough kept her awake most of the night.",
        "A spoonful of honey can settle a dry cough."
      ],
      "confusion_pairs": [
        "wheeze",
        "sore throat"
      ],
      "fsrs_params": {
        "difficulty": 0.32,
        "stability": 3.8
      }
    },
    {
      "id": "vocab-hep-13",
      "word": "sore throat",
      "phonetic": "/s\u0254\u02d0r \u03b8ro\u028at/",
      "translations": {
        "pa": "\u0a17\u0a32\u0a47 \u0a26\u0a3e \u0a26\u0a30\u0a26",
        "hi": "\u0917\u0932\u0947 \u092e\u0947\u0902 \u0916\u0930\u093e\u0936",
        "zh": "\u5589\u5499\u75db",
        "es": "dolor de garganta"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "I have a sore throat and swollen glands.",
        "Gargling warm salt water can ease a sore throat."
      ],
      "confusion_pairs": [
        "strep throat",
        "hoarse voice"
      ],
      "fsrs_params": {
        "difficulty": 0.35,
        "stability": 3.6
      }
    },
    {
      "id": "vocab-hep-14",
      "word": "allergy",
      "phonetic": "/\u02c8\u00e6l\u0259rd\u0292i/",
      "translations": {
        "pa": "\u0a10\u0a32\u0a30\u0a1c\u0a40",
        "hi": "\u090f\u0932\u0930\u094d\u091c\u0940",
        "zh": "\u8fc7\u654f",
        "es": "alergia"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "She has a penicillin allergy, so check the label.",
        "Spring pollen makes my allergy flare up every April."
      ],
      "confusion_pairs": [
        "food intolerance",
        "sensitivity"
      ],
      "fsrs_params": {
        "difficulty": 0.36,
        "stability": 3.5
      }
    },
    {
      "id": "vocab-hep-15",
      "word": "emergency",
      "phonetic": "/\u026a\u02c8m\u025c\u02d0rd\u0292\u0259nsi/",
      "translations": {
        "pa": "\u0a10\u0a2e\u0a30\u0a1c\u0a48\u0a02\u0a38\u0a40",
        "hi": "\u0906\u092a\u093e\u0924\u0915\u093e\u0932\u0940\u0928 \u0938\u094d\u0925\u093f\u0924\u093f",
        "zh": "\u6025\u8bca\uff1b\u7d27\u6025\u60c5\u51b5",
        "es": "emergencia"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "If the chest pain gets worse, that's an emergency \u2014 call 911.",
        "Go to the nearest emergency department for a broken bone."
      ],
      "confusion_pairs": [
        "urgent care",
        "crisis"
      ],
      "fsrs_params": {
        "difficulty": 0.35,
        "stability": 3.7
      }
    },
    {
      "id": "vocab-hep-16",
      "word": "waiting room",
      "phonetic": "/\u02c8we\u026at\u026a\u014b ru\u02d0m/",
      "translations": {
        "pa": "\u0a09\u0a21\u0a40\u0a15 \u0a18\u0a30",
        "hi": "\u092a\u094d\u0930\u0924\u0940\u0915\u094d\u0937\u093e \u0915\u0915\u094d\u0937",
        "zh": "\u5019\u8bca\u5ba4",
        "es": "sala de espera"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "We waited forty minutes in the waiting room.",
        "Please keep children with you in the waiting room."
      ],
      "confusion_pairs": [
        "lobby",
        "triage area"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 4.0
      }
    },
    {
      "id": "vocab-hep-17",
      "word": "family doctor",
      "phonetic": "/\u02c8f\u00e6m\u0259li \u02c8d\u0251\u02d0kt\u0259r/",
      "translations": {
        "pa": "\u0a2b\u0a48\u0a2e\u0a3f\u0a32\u0a40 \u0a21\u0a3e\u0a15\u0a1f\u0a30",
        "hi": "\u092b\u0948\u092e\u093f\u0932\u0940 \u0921\u0949\u0915\u094d\u091f\u0930",
        "zh": "\u5bb6\u5ead\u533b\u751f",
        "es": "m\u00e9dico de familia"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "Our family doctor knows everyone's medical history.",
        "It can take months to find a family doctor who's accepting patients."
      ],
      "confusion_pairs": [
        "walk-in doctor",
        "pediatrician"
      ],
      "fsrs_params": {
        "difficulty": 0.33,
        "stability": 3.9
      }
    },
    {
      "id": "vocab-hep-18",
      "word": "walk-in clinic",
      "phonetic": "/\u02c8w\u0254\u02d0k\u026an \u02c8kl\u026an\u026ak/",
      "translations": {
        "pa": "\u0a35\u0a3e\u0a15-\u0a07\u0a28 \u0a15\u0a32\u0a40\u0a28\u0a3f\u0a15",
        "hi": "\u0935\u0949\u0915-\u0907\u0928 \u0915\u094d\u0932\u093f\u0928\u093f\u0915",
        "zh": "\u514d\u9884\u7ea6\u8bca\u6240",
        "es": "cl\u00ednica sin cita previa"
      },
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": [
        "Walk-in clinics take patients without appointments.",
        "I used a walk-in clinic while searching for a family doctor."
      ],
      "confusion_pairs": [
        "urgent care centre",
        "appointment-only clinic"
      ],
      "fsrs_params": {
        "difficulty": 0.37,
        "stability": 3.5
      }
    },
    {
      "id": "vocab-hep-19",
      "word": "symptom",
      "phonetic": "/\u02c8s\u026ampt\u0259m/",
      "translations": {
        "pa": "\u0a32\u0a71\u0a1b\u0a23",
        "hi": "\u0932\u0915\u094d\u0937\u0923",
        "zh": "\u75c7\u72b6",
        "es": "s\u00edntoma"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Tell the doctor every symptom, even the small ones.",
        "A fever is often the first symptom of the flu."
      ],
      "confusion_pairs": [
        "sign",
        "side effect"
      ],
      "fsrs_params": {
        "difficulty": 0.44,
        "stability": 3.1
      }
    },
    {
      "id": "vocab-hep-20",
      "word": "prescription",
      "phonetic": "/pr\u026a\u02c8skr\u026ap\u0283n/",
      "translations": {
        "pa": "\u0a28\u0a41\u0a38\u0a16\u0a3c\u0a3e",
        "hi": "\u092a\u0930\u094d\u091a\u093e (\u0928\u0941\u0938\u094d\u0916\u093c\u093e)",
        "zh": "\u5904\u65b9",
        "es": "receta"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "You need a prescription from a doctor for antibiotics.",
        "Your prescription is ready at the pharmacy counter."
      ],
      "confusion_pairs": [
        "referral note",
        "over-the-counter medicine"
      ],
      "fsrs_params": {
        "difficulty": 0.46,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-hep-21",
      "word": "refill",
      "phonetic": "/\u02c8ri\u02d0f\u026al/",
      "translations": {
        "pa": "\u0a30\u0a40\u0a2b\u0a3f\u0a32",
        "hi": "\u0930\u093f\u092b\u093c\u093f\u0932 (\u0926\u094b\u092c\u093e\u0930\u093e \u092d\u0930\u0935\u093e\u0928\u093e)",
        "zh": "\u7eed\u914d\u836f",
        "es": "renovaci\u00f3n de receta"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Ask your doctor to approve a refill before the bottle runs out.",
        "I have one refill left on this prescription."
      ],
      "confusion_pairs": [
        "renewal",
        "transfer"
      ],
      "fsrs_params": {
        "difficulty": 0.45,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-hep-22",
      "word": "dosage",
      "phonetic": "/\u02c8do\u028as\u026ad\u0292/",
      "translations": {
        "pa": "\u0a16\u0a3e\u0a30\u0a15 (\u0a16\u0a41\u0a30\u0a3e\u0a95)",
        "hi": "\u0916\u0941\u0930\u093e\u0915",
        "zh": "\u5242\u91cf",
        "es": "dosis"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "The dosage is one tablet twice a day with food.",
        "Never change your dosage without asking the pharmacist."
      ],
      "confusion_pairs": [
        "strength",
        "quantity"
      ],
      "fsrs_params": {
        "difficulty": 0.47,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-hep-23",
      "word": "side effect",
      "phonetic": "/\u02c8sa\u026ad \u026a\u02ccfekt/",
      "translations": {
        "pa": "\u0a2e\u0a3e\u0a5c\u0a3e \u0a05\u0a38\u0a30",
        "hi": "\u0926\u0941\u0937\u094d\u092a\u094d\u0930\u092d\u093e\u0935",
        "zh": "\u526f\u4f5c\u7528",
        "es": "efecto secundario"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Drowsiness is a common side effect of this medication.",
        "Call the clinic if a side effect becomes severe."
      ],
      "confusion_pairs": [
        "allergic reaction",
        "drug interaction"
      ],
      "fsrs_params": {
        "difficulty": 0.46,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-hep-24",
      "word": "nausea",
      "phonetic": "/\u02c8n\u0254\u02d0zi\u0259/",
      "translations": {
        "pa": "\u0a1c\u0a40 \u0a2e\u0a3f\u0a1a\u0a32\u0a23\u0a3e",
        "hi": "\u092e\u0924\u0932\u0940 (\u091c\u0940 \u092e\u093f\u091a\u0932\u093e\u0939\u091f)",
        "zh": "\u6076\u5fc3",
        "es": "n\u00e1useas"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Strong painkillers can cause nausea.",
        "Sip ginger tea if the nausea won't settle."
      ],
      "confusion_pairs": [
        "vomiting",
        "indigestion"
      ],
      "fsrs_params": {
        "difficulty": 0.48,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-hep-25",
      "word": "dizziness",
      "phonetic": "/\u02c8d\u026azin\u0259s/",
      "translations": {
        "pa": "\u0a1a\u0a71\u0a15\u0a30 \u0a06\u0a09\u0a23\u0a47",
        "hi": "\u091a\u0915\u094d\u0915\u0930 \u0906\u0928\u093e",
        "zh": "\u5934\u6655",
        "es": "mareo"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Dizziness can be a sign of dehydration.",
        "She felt sudden dizziness after skipping lunch."
      ],
      "confusion_pairs": [
        "lightheadedness",
        "vertigo"
      ],
      "fsrs_params": {
        "difficulty": 0.48,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-hep-26",
      "word": "rash",
      "phonetic": "/r\u00e6\u0283/",
      "translations": {
        "pa": "\u0a27\u0a71\u0a2b\u0a3c",
        "hi": "\u091a\u0915\u0924\u094d\u0924\u0947 (\u0930\u0948\u0936)",
        "zh": "\u76ae\u75b9",
        "es": "sarpullido"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "The new detergent gave him a red rash.",
        "Show the doctor the rash before it fades."
      ],
      "confusion_pairs": [
        "hives",
        "itching"
      ],
      "fsrs_params": {
        "difficulty": 0.45,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-hep-27",
      "word": "bleeding",
      "phonetic": "/\u02c8bli\u02d0d\u026a\u014b/",
      "translations": {
        "pa": "\u0a16\u0a3c\u0a42\u0a28 \u0a28\u0a3f\u0a15\u0a32\u0a23\u0a3e",
        "hi": "\u0916\u0942\u0928 \u092c\u0939\u0928\u093e",
        "zh": "\u51fa\u8840",
        "es": "sangrado"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Apply firm pressure to stop the bleeding.",
        "Bleeding that won't stop needs immediate care."
      ],
      "confusion_pairs": [
        "bruising",
        "clotting"
      ],
      "fsrs_params": {
        "difficulty": 0.46,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-hep-28",
      "word": "injury",
      "phonetic": "/\u02c8\u026and\u0292\u0259ri/",
      "translations": {
        "pa": "\u0a38\u0a71\u0a1f",
        "hi": "\u091a\u094b\u091f",
        "zh": "\u5916\u4f24",
        "es": "lesi\u00f3n"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Report any workplace injury to your supervisor right away.",
        "The knee injury flares up whenever it rains."
      ],
      "confusion_pairs": [
        "wound",
        "sprain"
      ],
      "fsrs_params": {
        "difficulty": 0.47,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-hep-29",
      "word": "emergency room",
      "phonetic": "/\u026a\u02c8m\u025c\u02d0rd\u0292\u0259nsi ru\u02d0m/",
      "translations": {
        "pa": "\u0a10\u0a2e\u0a30\u0a1c\u0a48\u0a02\u0a38\u0a40 \u0a35\u0a3f\u0a2d\u0a3e\u0a17",
        "hi": "\u0907\u092e\u0930\u091c\u0947\u0902\u0938\u0940 \u0930\u0942\u092e",
        "zh": "\u6025\u8bca\u5ba4",
        "es": "sala de emergencias"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "They rushed him to the emergency room at St. Paul's Hospital.",
        "Expect a long wait at the emergency room for minor problems."
      ],
      "confusion_pairs": [
        "urgent care centre",
        "walk-in clinic"
      ],
      "fsrs_params": {
        "difficulty": 0.45,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-hep-30",
      "word": "referral",
      "phonetic": "/r\u026a\u02c8f\u025c\u02d0r\u0259l/",
      "translations": {
        "pa": "\u0a30\u0a48\u0a2b\u0a30\u0a32",
        "hi": "\u0930\u0947\u092b\u093c\u0930\u0932 (\u092d\u0947\u091c\u0928\u093e)",
        "zh": "\u8f6c\u8bca\u5355",
        "es": "derivaci\u00f3n"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Your referral to the skin specialist came through.",
        "Ask how long the referral wait list usually is."
      ],
      "confusion_pairs": [
        "requisition",
        "recommendation letter"
      ],
      "fsrs_params": {
        "difficulty": 0.49,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-hep-31",
      "word": "specialist",
      "phonetic": "/\u02c8spe\u0283\u0259l\u026ast/",
      "translations": {
        "pa": "\u0a2e\u0a3e\u0a39\u0a3f\u0a30 \u0a21\u0a3e\u0a15\u0a1f\u0a30",
        "hi": "\u0935\u093f\u0936\u0947\u0937\u091c\u094d\u091e \u0921\u0949\u0915\u094d\u091f\u0930",
        "zh": "\u4e13\u79d1\u533b\u751f",
        "es": "especialista"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "A specialist handles problems your family doctor can't treat.",
        "The specialist will see you at the outpatient clinic."
      ],
      "confusion_pairs": [
        "general practitioner",
        "surgeon"
      ],
      "fsrs_params": {
        "difficulty": 0.46,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-hep-32",
      "word": "checkup",
      "phonetic": "/\u02c8t\u0283ek\u028cp/",
      "translations": {
        "pa": "\u0a1c\u0a3e\u0a02\u0a1a",
        "hi": "\u091c\u093e\u0902\u091a (\u0930\u0941\u091f\u0940\u0928 \u092a\u0930\u0940\u0915\u094d\u0937\u093e)",
        "zh": "\u4f53\u68c0",
        "es": "chequeo"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Book a yearly checkup even when you feel healthy.",
        "At the checkup, the doctor measured her blood pressure."
      ],
      "confusion_pairs": [
        "annual physical",
        "screening test"
      ],
      "fsrs_params": {
        "difficulty": 0.44,
        "stability": 3.1
      }
    },
    {
      "id": "vocab-hep-33",
      "word": "bloodwork",
      "phonetic": "/\u02c8bl\u028cdw\u025c\u02d0rk/",
      "translations": {
        "pa": "\u0a16\u0a3c\u0a42\u0a28 \u0a26\u0a40 \u0a1c\u0a3e\u0a02\u0a1a",
        "hi": "\u0916\u0942\u0928 \u0915\u0940 \u091c\u093e\u0902\u091a",
        "zh": "\u8840\u6db2\u68c0\u67e5",
        "es": "an\u00e1lisis de sangre"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "The bloodwork shows your iron is a bit low.",
        "Fast for twelve hours before the bloodwork."
      ],
      "confusion_pairs": [
        "urine test",
        "imaging scan"
      ],
      "fsrs_params": {
        "difficulty": 0.48,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-hep-34",
      "word": "treatment",
      "phonetic": "/\u02c8tri\u02d0tm\u0259nt/",
      "translations": {
        "pa": "\u0a07\u0a32\u0a3e\u0a1c",
        "hi": "\u0907\u0932\u093e\u091c",
        "zh": "\u6cbb\u7597",
        "es": "tratamiento"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Physiotherapy is the usual treatment for this injury.",
        "The treatment worked within two weeks."
      ],
      "confusion_pairs": [
        "cure",
        "therapy session"
      ],
      "fsrs_params": {
        "difficulty": 0.45,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-hep-35",
      "word": "over-the-counter",
      "phonetic": "/\u02cc\u0259\u028av\u0259r \u00f0\u0259 \u02c8ka\u028ant\u0259r/",
      "translations": {
        "pa": "\u0a2c\u0a3f\u0a28\u0a3e\u0a02 \u0a28\u0a41\u0a38\u0a16\u0a3c\u0a47 \u0a26\u0a40 \u0a26\u0a35\u0a3e\u0a08",
        "hi": "\u092c\u093f\u0928\u093e \u092a\u0930\u094d\u091a\u0947 \u0935\u093e\u0932\u0940 \u0926\u0935\u093e",
        "zh": "\u975e\u5904\u65b9\u836f",
        "es": "de venta libre"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Ibuprofen is an over-the-counter pain reliever.",
        "Over-the-counter remedies won't clear a bacterial infection."
      ],
      "confusion_pairs": [
        "prescription-only medicine",
        "behind-the-counter product"
      ],
      "fsrs_params": {
        "difficulty": 0.5,
        "stability": 2.7
      }
    },
    {
      "id": "vocab-hep-36",
      "word": "painkiller",
      "phonetic": "/\u02c8pe\u026ank\u026al\u0259r/",
      "translations": {
        "pa": "\u0a26\u0a30\u0a26 \u0a28\u0a3f\u0a35\u0a3e\u0a30\u0a15 \u0a26\u0a35\u0a3e\u0a08",
        "hi": "\u0926\u0930\u094d\u0926 \u0928\u093f\u0935\u093e\u0930\u0915 \u0926\u0935\u093e",
        "zh": "\u6b62\u75db\u836f",
        "es": "analg\u00e9sico"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Take a painkiller before the freezing wears off.",
        "That painkiller upset my stomach, so now I always eat first."
      ],
      "confusion_pairs": [
        "anti-inflammatory",
        "muscle relaxant"
      ],
      "fsrs_params": {
        "difficulty": 0.47,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-hep-37",
      "word": "antibiotic",
      "phonetic": "/\u02cc\u00e6ntiba\u026a\u02c8\u0251\u02d0t\u026ak/",
      "translations": {
        "pa": "\u0a10\u0a70\u0a1f\u0a40\u0a2c\u0a3e\u0a07\u0a13\u0a1f\u0a3f\u0a15",
        "hi": "\u090f\u0902\u091f\u0940\u092c\u093e\u092f\u094b\u091f\u093f\u0915 \u0926\u0935\u093e",
        "zh": "\u6297\u751f\u7d20",
        "es": "antibi\u00f3tico"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Finish all the antibiotic, even if you feel better on day three.",
        "Antibiotics don't help colds caused by viruses."
      ],
      "confusion_pairs": [
        "antiviral",
        "probiotic"
      ],
      "fsrs_params": {
        "difficulty": 0.49,
        "stability": 2.7
      }
    },
    {
      "id": "vocab-hep-38",
      "word": "ointment",
      "phonetic": "/\u02c8\u0254\u026antm\u0259nt/",
      "translations": {
        "pa": "\u0a2e\u0a32\u0a2e",
        "hi": "\u092e\u0930\u0939\u092e",
        "zh": "\u836f\u818f",
        "es": "pomada"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Apply the ointment in a thin layer twice a day.",
        "This ointment soothes the rash and stops the itching."
      ],
      "confusion_pairs": [
        "cream",
        "lotion"
      ],
      "fsrs_params": {
        "difficulty": 0.5,
        "stability": 2.6
      }
    },
    {
      "id": "vocab-hep-39",
      "word": "interpreter",
      "phonetic": "/\u026an\u02c8t\u025c\u02d0rpr\u0259t\u0259r/",
      "translations": {
        "pa": "\u0a24\u0a30\u0a1c\u0a41\u0a2e\u0a3e\u0a15\u0a3e\u0a30",
        "hi": "\u0926\u0941\u092d\u093e\u0937\u093f\u092f\u093e",
        "zh": "\u53e3\u8bd1\u5458",
        "es": "int\u00e9rprete"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "Request an interpreter when you book the appointment \u2014 it's free.",
        "Hospital interpreters are trained and bound by confidentiality."
      ],
      "confusion_pairs": [
        "translator",
        "patient advocate"
      ],
      "fsrs_params": {
        "difficulty": 0.49,
        "stability": 2.7
      }
    },
    {
      "id": "vocab-hep-40",
      "word": "follow-up",
      "phonetic": "/\u02c8f\u0251\u02d0lo\u028a\u028cp/",
      "translations": {
        "pa": "\u0a2b\u0a3e\u0a32\u0a4b-\u0a05\u0a71\u0a2a \u0a2e\u0a41\u0a32\u0a3e\u0a15\u0a3e\u0a24",
        "hi": "\u092b\u0949\u0932\u094b-\u0905\u092a (\u0905\u0917\u0932\u0940 \u091c\u093e\u0902\u091a)",
        "zh": "\u590d\u8bca",
        "es": "consulta de seguimiento"
      },
      "level": "branch",
      "category": "healthcare",
      "example_sentences": [
        "The doctor scheduled a follow-up for two weeks out.",
        "Bring your questions to the follow-up visit."
      ],
      "confusion_pairs": [
        "checkup",
        "initial consultation"
      ],
      "fsrs_params": {
        "difficulty": 0.46,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-hep-41",
      "word": "triage",
      "phonetic": "/tri\u02c8\u0251\u02d0\u0292/",
      "translations": {
        "pa": "\u0a1f\u0a4d\u0a30\u0a3e\u0a08\u0a0f\u0a1c (\u0a24\u0a30\u0a24\u0a40\u0a2c \u0a26\u0a3e \u0a15\u0a4d\u0a30\u0a2e)",
        "hi": "\u091f\u094d\u0930\u093e\u092f\u093e\u091c (\u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e \u0924\u092f \u0915\u0930\u0928\u093e)",
        "zh": "\u5206\u8bca",
        "es": "triaje"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Triage puts the most urgent patients first, not the earliest arrivals.",
        "A nurse does triage at the door and checks your vital signs."
      ],
      "confusion_pairs": [
        "waiting list",
        "priority queue"
      ],
      "fsrs_params": {
        "difficulty": 0.6,
        "stability": 2.0
      }
    },
    {
      "id": "vocab-hep-42",
      "word": "diagnosis",
      "phonetic": "/\u02ccda\u026a\u0259\u0261\u02c8no\u028as\u026as/",
      "translations": {
        "pa": "\u0a28\u0a3f\u0a26\u0a3e\u0a28",
        "hi": "\u0928\u093f\u0926\u093e\u0928",
        "zh": "\u8bca\u65ad",
        "es": "diagn\u00f3stico"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "The diagnosis finally explained months of tiredness.",
        "Asking for a second opinion on a diagnosis is completely normal."
      ],
      "confusion_pairs": [
        "prognosis",
        "symptom pattern"
      ],
      "fsrs_params": {
        "difficulty": 0.62,
        "stability": 1.9
      }
    },
    {
      "id": "vocab-hep-43",
      "word": "condition",
      "phonetic": "/k\u0259n\u02c8d\u026a\u0283n/",
      "translations": {
        "pa": "\u0a2c\u0a3f\u0a2e\u0a3e\u0a30\u0a40 \u0a26\u0a40 \u0a39\u0a3e\u0a32\u0a24",
        "hi": "\u0938\u094d\u0925\u093f\u0924\u093f (\u092c\u0940\u092e\u093e\u0930\u0940)",
        "zh": "\u75c5\u60c5",
        "es": "afecci\u00f3n"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Diabetes is a condition you manage every single day.",
        "Tell every new provider about your existing condition."
      ],
      "confusion_pairs": [
        "illness",
        "syndrome"
      ],
      "fsrs_params": {
        "difficulty": 0.58,
        "stability": 2.1
      }
    },
    {
      "id": "vocab-hep-44",
      "word": "coverage",
      "phonetic": "/\u02c8k\u028cv\u0259r\u026ad\u0292/",
      "translations": {
        "pa": "\u0a15\u0a35\u0a47\u0a1c",
        "hi": "\u0915\u0935\u0930\u0947\u091c",
        "zh": "\uff08\u533b\u4fdd\uff09\u8986\u76d6\u8303\u56f4",
        "es": "cobertura"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Provincial coverage doesn't pay for most dental work.",
        "Check whether your coverage includes prescription glasses."
      ],
      "confusion_pairs": [
        "benefits",
        "eligibility"
      ],
      "fsrs_params": {
        "difficulty": 0.6,
        "stability": 2.0
      }
    },
    {
      "id": "vocab-hep-45",
      "word": "insurance",
      "phonetic": "/\u026an\u02c8\u0283\u028a\u0259r\u0259ns/",
      "translations": {
        "pa": "\u0a2c\u0a40\u0a2e\u0a3e",
        "hi": "\u092c\u0940\u092e\u093e",
        "zh": "\u4fdd\u9669",
        "es": "seguro"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Private insurance through work often covers dental and vision.",
        "Compare insurance plans carefully before you sign up."
      ],
      "confusion_pairs": [
        "policy",
        "benefits provider"
      ],
      "fsrs_params": {
        "difficulty": 0.57,
        "stability": 2.2
      }
    },
    {
      "id": "vocab-hep-46",
      "word": "claim",
      "phonetic": "/kle\u026am/",
      "translations": {
        "pa": "\u0a15\u0a32\u0a47\u0a2e",
        "hi": "\u0926\u093e\u0935\u093e (\u0915\u094d\u0932\u0947\u092e)",
        "zh": "\u62a5\u9500\u7533\u8bf7",
        "es": "reclamaci\u00f3n"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Submit the claim online with your receipt.",
        "My claim for the physiotherapy sessions was approved within days."
      ],
      "confusion_pairs": [
        "receipt",
        "pre-authorization"
      ],
      "fsrs_params": {
        "difficulty": 0.63,
        "stability": 1.8
      }
    },
    {
      "id": "vocab-hep-47",
      "word": "deductible",
      "phonetic": "/d\u026a\u02c8d\u028ckt\u0259bl/",
      "translations": {
        "pa": "\u0a21\u0a3f\u0a21\u0a15\u0a1f\u0a3f\u0a2c\u0a32",
        "hi": "\u0921\u093f\u0921\u0915\u094d\u091f\u093f\u092c\u0932 (\u092a\u0939\u0932\u0940 \u0930\u0915\u092e)",
        "zh": "\u514d\u8d54\u989d",
        "es": "deducible"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "You pay the deductible first, then the plan kicks in.",
        "A higher deductible usually means a cheaper monthly premium."
      ],
      "confusion_pairs": [
        "co-payment",
        "monthly premium"
      ],
      "fsrs_params": {
        "difficulty": 0.66,
        "stability": 1.6
      }
    },
    {
      "id": "vocab-hep-48",
      "word": "anxiety",
      "phonetic": "/\u00e6\u014b\u02c8za\u026a\u0259ti/",
      "translations": {
        "pa": "\u0a2c\u0a48\u0a1a\u0a48\u0a28\u0a40",
        "hi": "\u091a\u093f\u0902\u0924\u093e (\u0918\u092c\u0930\u093e\u0939\u091f)",
        "zh": "\u7126\u8651",
        "es": "ansiedad"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Deep breathing takes the edge off my anxiety.",
        "Talking to someone about your anxiety really does help."
      ],
      "confusion_pairs": [
        "stress",
        "panic attack"
      ],
      "fsrs_params": {
        "difficulty": 0.58,
        "stability": 2.1
      }
    },
    {
      "id": "vocab-hep-49",
      "word": "counselling",
      "phonetic": "/\u02c8ka\u028ans\u0259l\u026a\u014b/",
      "translations": {
        "pa": "\u0a15\u0a3e\u0a09\u0a02\u0a38\u0a32\u0a3f\u0a70\u0a17",
        "hi": "\u0915\u093e\u0909\u0902\u0938\u0932\u093f\u0902\u0917",
        "zh": "\u5fc3\u7406\u54a8\u8be2",
        "es": "consejer\u00eda"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Short-term counselling is free through some community agencies.",
        "Counselling gave her practical tools for handling stress."
      ],
      "confusion_pairs": [
        "psychotherapy",
        "peer support group"
      ],
      "fsrs_params": {
        "difficulty": 0.61,
        "stability": 1.9
      }
    },
    {
      "id": "vocab-hep-50",
      "word": "screening",
      "phonetic": "/\u02c8skri\u02d0n\u026a\u014b/",
      "translations": {
        "pa": "\u0a38\u0a15\u0a4d\u0a30\u0a40\u0a28\u0a3f\u0a70\u0a17 \u0a1c\u0a3e\u0a02\u0a1a",
        "hi": "\u0938\u094d\u0915\u094d\u0930\u0940\u0928\u093f\u0902\u0917 \u091c\u093e\u0902\u091a",
        "zh": "\u7b5b\u67e5",
        "es": "prueba de detecci\u00f3n"
      },
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": [
        "Regular screening catches problems early, before symptoms appear.",
        "Screening for colon cancer usually starts at fifty in Canada."
      ],
      "confusion_pairs": [
        "diagnostic test",
        "vaccination"
      ],
      "fsrs_params": {
        "difficulty": 0.59,
        "stability": 2.0
      }
    }
  ]
}
