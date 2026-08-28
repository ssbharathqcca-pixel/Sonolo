{
  "scenarios": [
    {
      "id": "hs-viewing-apartment-utilities",
      "title": "Viewing an apartment and asking what utilities are included",
      "description": "You're looking at a basement apartment in downtown Toronto. Walk through the unit with the property manager, ask about utilities, and find out what's included in the rent.",
      "category": "housing",
      "mode": "both",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Gary Chen, a property manager showing a basement apartment in downtown Toronto. You are friendly and approachable. Show the apartment, point out the renovated kitchen, ask about the prospective tenant's move-in date, and answer questions about which utilities are included (heat, water, and electricity are included — internet is not). Mention that the building has coin laundry and that parking is available for an extra seventy-five dollars a month. Arrange the next steps: the application form and a credit check. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi there, welcome! I'm Gary, the property manager. Thanks for coming to see the place — take your time looking around.",
      "expected_turns": 6,
      "success_criteria": [
        "User asks about at least two utilities",
        "User asks about parking or laundry",
        "User asks about the application process",
        "User asks about the move-in date",
        "User thanks the landlord and confirms next steps"
      ],
      "vocabulary_targets": [
        "apartment",
        "utilities",
        "deposit",
        "parking",
        "inspection"
      ],
      "grammar_targets": [
        "questions with are... included? (Is heat included?)",
        "present simple for asking about features (Does the apartment have laundry?)",
        "polite requests with Could you tell me...?"
      ],
      "cultural_notes": "In most Canadian provinces, heat and water are usually included in rent unless the lease says otherwise, but electricity and internet are often the tenant's responsibility. Basement apartments are common in big cities like Toronto and Vancouver, and parking is typically an extra charge. Always ask what's included before signing anything.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hs-signing-lease-deposit-keys",
      "title": "Signing the lease and asking about the deposit and keys",
      "description": "You've decided to take the apartment. Sit down with the leasing agent, sign the lease, pay the deposit, and arrange to pick up the keys.",
      "category": "housing",
      "mode": "both",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Evelyn Foster, a leasing agent for a rental company in Mississauga. You are businesslike but warm. Walk through the lease signing: confirm the monthly rent, the first-and-last-month deposit (July 1st and August 1st), the key deposit (fifty dollars refundable), and the move-in checklist. Explain that the last month's rent deposit is held in trust and applied to the final month, and that keys are handed over on the first day of the lease. Remind about tenant insurance and the utility setup. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, welcome to Lakeshore Rentals! I'm Evelyn. So you've decided to go ahead with the unit — great choice. Let's go through the paperwork.",
      "expected_turns": 6,
      "success_criteria": [
        "User confirms the total deposit amount",
        "User asks about the key deposit or move-in date",
        "User asks about the lease terms or the move-in checklist",
        "User confirms tenant insurance or utility setup",
        "User thanks the agent and confirms the next steps"
      ],
      "vocabulary_targets": [
        "lease",
        "deposit",
        "key",
        "tenant",
        "insurance"
      ],
      "grammar_targets": [
        "confirming with So I pay...? (So I pay first and last month?)",
        "future arrangements (I'll pick up the keys on July 1st)",
        "questions about amounts (How much is the key deposit?)"
      ],
      "cultural_notes": "In Ontario, the standard lease is mandatory and the deposit is legally capped at one month's rent (first and last). The last month's rent deposit must be held in trust and can only be used for the final month, not for damages. A separate key deposit is allowed if refundable. Tenant insurance is strongly recommended, and some landlords require it.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hs-setup-tenant-insurance",
      "title": "Calling to set up tenant insurance before moving in",
      "description": "Your lease requires proof of tenant insurance before move-in. Call an insurance broker and set up coverage for your belongings and liability.",
      "category": "housing",
      "mode": "both",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Maya Patel, an insurance broker at a firm in Vancouver. You are helpful and clear. Explain that tenant insurance covers the tenant's belongings, liability if someone is injured in the unit, and additional living expenses if the unit becomes uninhabitable. Ask about the size of the apartment (one-bedroom, about twenty dollars a month), whether they need to cover specific valuables, and whether they want basic or comprehensive. Note that most landlords require proof of insurance before move-in. Explain that the policy can be cancelled when they move out. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Thanks for calling All-Canada Insurance — this is Maya. So you're looking to set up tenant insurance before you move in?",
      "expected_turns": 5,
      "success_criteria": [
        "User asks about what's covered",
        "User asks about the monthly cost",
        "User asks about the process or proof for the landlord",
        "User provides information about the apartment",
        "User confirms the policy or next steps"
      ],
      "vocabulary_targets": [
        "insurance",
        "lease",
        "apartment",
        "deposit",
        "utilities"
      ],
      "grammar_targets": [
        "questions with What does... cover? (What does the policy cover?)",
        "conditionals about cost (If I add theft coverage, will the price go up?)",
        "prices with about / around (How much is it about?)"
      ],
      "cultural_notes": "Tenant insurance is inexpensive in Canada, usually fifteen to twenty-five dollars a month for a one-bedroom, and it covers your personal belongings, liability if someone is injured in your unit, and additional living expenses if the unit becomes unlivable. Landlords increasingly require proof of coverage, and some buildings mandate it in the lease.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hs-report-broken-appliance-leak",
      "title": "Reporting a broken appliance or leak to the landlord",
      "description": "Your dishwasher stopped working and is leaking onto the kitchen floor. Call the building superintendent and get the problem fixed.",
      "category": "housing",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Henry Kwan, the building superintendent for a highrise in Montreal. You are practical and solution-oriented. Answer the tenant's call about a broken dishwasher that's also leaking onto the kitchen floor. Ask about the issue (when it started, if the water is spreading), then reassure that you'll come up right away to check. Explain that you'll need to turn off the water to the unit temporarily, and that a repair person may need to come tomorrow. Apologize for the inconvenience and offer to help with cleanup. Mention that the landlord covers the cost of all normal repairs. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hello, Henry here, building super. What's going on in your unit?",
      "expected_turns": 6,
      "success_criteria": [
        "User describes the problem clearly and when it started",
        "User answers the super's questions about the issue",
        "User asks about the timeline for the repair",
        "User confirms the plan for the repair visit",
        "User thanks the super and reports the situation"
      ],
      "vocabulary_targets": [
        "maintenance",
        "repair",
        "leak",
        "appliance",
        "landlord"
      ],
      "grammar_targets": [
        "past simple for describing what happened (The dishwasher started leaking yesterday)",
        "present continuous for current state (Water is pooling on the floor)",
        "requests with Can you...? (Can you come take a look?)"
      ],
      "cultural_notes": "Landlords in Canada are responsible for maintaining the property in good repair, including appliances provided in the unit. Tenants should report issues promptly and in writing; email or text is fine and creates a record. The superintendent typically handles urgent repairs, and the landlord covers the cost of all normal maintenance.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hs-giving-notice-move-out",
      "title": "Giving proper 60-day notice to move out",
      "description": "You need to move out of your apartment for a new job. Call the property manager and give the required sixty-day notice.",
      "category": "housing",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Janet Park, the property manager for a rental company in Calgary. You are professional but matter-of-fact. The tenant is calling to give notice to move out. Confirm the date of the notice (today), the move-out date (sixty days from now), and the unit number. Explain that the tenant will need to provide a forwarding address for the deposit return, that the unit will need to be professionally cleaned, and that a move-out inspection is scheduled for the last day. Remind the tenant about the notice period (sixty days is the legal minimum in Alberta). If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Good morning, you've reached Janet at Riverbend Properties. How can I help you?",
      "expected_turns": 5,
      "success_criteria": [
        "User clearly states they want to give notice to move out",
        "User confirms the move-out date and unit number",
        "User asks about the move-out process (cleaning, inspection)",
        "User asks about the deposit return",
        "User thanks the manager and confirms next steps"
      ],
      "vocabulary_targets": [
        "notice",
        "deposit",
        "lease",
        "inspection",
        "move-out"
      ],
      "grammar_targets": [
        "future with will for plans (I'll move out on July 31st)",
        "confirming with So I need to...? (So I need to give sixty days' notice?)",
        "polite explanations (I'm moving to a new job in another city)"
      ],
      "cultural_notes": "In most Canadian provinces, tenants must give written notice at least sixty days before the last day of the tenancy. The landlord must return the deposit within a certain period, which varies by province, minus any lawful deductions. A move-out inspection is standard, and the tenant has the right to be present during it.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hs-lease-renewal-negotiation",
      "title": "Negotiating a lease renewal and asking about the rent increase",
      "description": "Your lease is up for renewal and the landlord is proposing a three percent rent increase. Call and discuss your options.",
      "category": "housing",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Derek Walsh, the landlord of a small three-unit building in Hamilton. You are friendly but want to stay on budget. The tenant is asking about renewing the lease. You're offering a one-year renewal with a three percent increase (from twelve hundred to twelve thirty-six). Explain that operating costs have gone up, but that three percent is below the current guideline. Offer a two-year option at two and a half percent each year for stability. Invite the tenant to share their budget concerns. If they ask about market rates, mention that similar units in the building are renting for thirteen hundred. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, Derek Walsh speaking. You wanted to talk about renewing the lease?",
      "expected_turns": 6,
      "success_criteria": [
        "User asks about the rent increase amount",
        "User asks about the lease terms (one-year vs two-year)",
        "User expresses their budget concerns or counters",
        "User asks about the guideline or market rates",
        "User confirms or declines the renewal"
      ],
      "vocabulary_targets": [
        "renewal",
        "rent increase",
        "lease",
        "negotiation",
        "clause"
      ],
      "grammar_targets": [
        "comparatives (higher than, below the guideline)",
        "conditionals for negotiation (If I sign a two-year lease, can you keep the increase at two percent?)",
        "polite disagreement (I was hoping for a smaller increase)"
      ],
      "cultural_notes": "Ontario's rent increase guideline changes yearly, and landlords can apply above the guideline only with LTB approval. Units built after 2018 are exempt from rent control in Ontario. Most provinces have some form of rent increase regulation, and proper written notice at least ninety days in advance is required for any increase.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hs-noisy-neighbor-complaint",
      "title": "Talking to a noisy neighbor politely but firmly",
      "description": "Loud music from the upstairs apartment is keeping you awake every night. Knock on your neighbor's door and have a polite but firm conversation.",
      "category": "housing",
      "mode": "casual",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Alex Romero, a neighbor who lives in the apartment above the caller. You are unaware that your music is too loud. You are friendly and cooperative. When the tenant knocks and explains the noise, apologize sincerely and offer to turn down the bass and keep quiet after ten PM. Offer to exchange phone numbers so the tenant can text you directly if the noise is ever a problem again. Explain that you work late shifts and sometimes forget to turn the volume down. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, Alex here. Sorry, I was just listening to some music. What's up?",
      "expected_turns": 5,
      "success_criteria": [
        "User introduces themselves as a neighbor",
        "User clearly but politely explains the noise issue",
        "User asks for a specific change (lower volume, quiet after 10 PM)",
        "User accepts the apology or offers to exchange numbers",
        "User thanks the neighbor for understanding"
      ],
      "vocabulary_targets": [
        "noise",
        "neighbor",
        "complaint",
        "lease",
        "disturbance"
      ],
      "grammar_targets": [
        "polite requests with Would you mind...? (Would you mind turning the music down?)",
        "I'm sorry but... for polite complaints",
        "making suggestions (Could you maybe keep it down after ten?)"
      ],
      "cultural_notes": "In Canada, most municipalities have noise bylaws that prohibit excessive noise between 11 PM and 7 AM. It's considered polite to talk to a neighbor directly before involving the landlord or police. The friendly-first approach — a note or a polite knock — is standard Canadian etiquette. Landlords can also enforce quiet hours in the lease.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "hs-rent-control-ltb-questions",
      "title": "Asking about rent control and the Landlord and Tenant Board",
      "description": "Your landlord is planning a large rent increase and you're not sure about your rights. Call a tenant advocate and ask about rent control and the LTB.",
      "category": "housing",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Priya Desai, a tenant advocate working at a community legal clinic in Ontario. You are knowledgeable but careful not to give legal advice. Explain the role of the Landlord and Tenant Board (LTB) as the tribunal that resolves disputes, and what rent control means — the annual guideline increase that limits how much a landlord can raise rent. Explain that units built after 2018 are exempt from rent control, and that landlords need LTB approval for increases above the guideline. Describe the basic process: first try to negotiate with the landlord, then file a T1 (rent increase) or T6 (maintenance) form with the LTB. Recommend the FMTA or ACORN as resources for more guidance. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, I'm Priya, a tenant advocate. You mentioned you had questions about rent control or the Landlord and Tenant Board — what's going on?",
      "expected_turns": 7,
      "success_criteria": [
        "User asks about rent control or the annual guideline",
        "User asks about the LTB process or forms",
        "User asks about their specific situation",
        "User asks about resources for tenants",
        "User thanks the advocate and summarizes their understanding"
      ],
      "vocabulary_targets": [
        "tribunal",
        "hearing",
        "dispute",
        "clause",
        "by-law"
      ],
      "grammar_targets": [
        "questions with What happens if...? (What happens if the landlord doesn't follow the rules?)",
        "passive voice for processes (A hearing is scheduled by the LTB)",
        "clarifying (So if my unit was built after 2018, rent control doesn't apply?)"
      ],
      "cultural_notes": "The Landlord and Tenant Board (LTB) is the Ontario tribunal that resolves disputes between landlords and tenants. Rent control applies to most units built before November 15, 2018, with the annual guideline increase set by the province each year. The LTB has significant backlogs, so cases can take months. Tenant advocacy groups like the FMTA and ACORN provide free information, and tenants cannot be evicted for contacting the LTB.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "hs-disputing-damage-deduction",
      "title": "Disputing an unfair damage deduction when moving out",
      "description": "Your landlord deducted two hundred dollars from your deposit for carpet cleaning and nail holes. You disagree — call the property manager and dispute the charges.",
      "category": "housing",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Sarah Kendrick, the property manager handling a move-out. The tenant has moved out and a two hundred dollar deduction was taken from the deposit for carpet cleaning and nail holes in the wall. The tenant is calling to dispute. You are professional but firm. Explain that the carpet cleaning receipt shows professional cleaning was needed, and the nail holes require patching and painting. Listen to the tenant's side — they may have already cleaned the carpet or have photos showing no damage. Offer to review new evidence if the tenant provides it, and note that the deposit breakdown was sent by email. Suggest that if they disagree, they can contact the LTB for a hearing. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hello, Sarah at Bayshore Properties. You're calling about the deposit deduction on your move-out, right?",
      "expected_turns": 7,
      "success_criteria": [
        "User explains why they disagree with the deduction",
        "User provides evidence or reasoning for their claim",
        "User asks about the breakdown of the charges",
        "User asks about the dispute process",
        "User decides on a next step (accept, provide evidence, or escalate)"
      ],
      "vocabulary_targets": [
        "damage",
        "deduction",
        "dispute",
        "compensation",
        "inventory"
      ],
      "grammar_targets": [
        "past tense for describing what they did before moving out (I cleaned the carpet myself)",
        "hypotheticals (If I provide photos from move-in, would that help?)",
        "clarifying amounts (What exactly was the two hundred dollars for?)"
      ],
      "cultural_notes": "In Ontario, landlords can only deduct from the deposit for actual damages beyond normal wear and tear. Normal wear includes minor scuffs, faded paint, and small nail holes from picture frames. Carpet cleaning is not automatically the tenant's responsibility unless the lease specifies it. Tenants have the right to request a move-out inspection and to dispute deductions at the LTB, and the landlord must provide receipts for any claimed deductions.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "hs-sublet-permission-summer",
      "title": "Asking the landlord for permission to sublet for the summer",
      "description": "You're going back to your home country for two months this summer and want to sublet your apartment. Call your landlord and ask for permission.",
      "category": "housing",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Frank O'Brien, a landlord in a triplex in Kitchener. The tenant is asking to sublet for the summer months (June to August). You are cautious but open to the idea. Ask about who the subletter is (the tenant's cousin from out of town), whether they have a job or references, and whether they can pass a credit check. Explain that the lease says subletting requires written consent, and that the tenant remains responsible for the unit even during the sublet. Offer to review the subletter's application and references. Suggest a sublet agreement addendum with the move-in and move-out inspection. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hello, Frank here. You wanted to talk about subletting your unit for the summer?",
      "expected_turns": 7,
      "success_criteria": [
        "User explains the reason for subletting",
        "User describes the potential subletter's background",
        "User asks about the landlord's conditions or process",
        "User confirms the subletter will provide references",
        "User agrees on the next steps (application form, addendum)"
      ],
      "vocabulary_targets": [
        "sublet",
        "lease",
        "clause",
        "reference",
        "property"
      ],
      "grammar_targets": [
        "asking for permission (Would you approve a sublet for the summer?)",
        "explaining circumstances (I'm going back to my home country for two months)",
        "responsibilities (So I'm still responsible even if the subletter damages something?)"
      ],
      "cultural_notes": "In Ontario, tenants have the right to sublet with the landlord's consent, which cannot be unreasonably withheld. The tenant remains fully responsible for the unit during the sublet period. The landlord may ask for a credit check and references on the subletter, and a sublet agreement should include a move-in and move-out inspection to avoid disputes. Subletting without permission can lead to eviction.",
      "is_premium": true,
      "is_published": true
    }
  ],
  "vocabulary": [
    {
      "id": "vocab-hs-01",
      "word": "lease",
      "phonetic": "/liːs/",
      "translations": {"pa": "ਕਿਰਾਇਆ ਸਮਝੌਤਾ", "hi": "किराया समझौता (लीज़)", "zh": "租约", "es": "contrato de alquiler"},
      "level": "seed",
      "category": "housing",
      "example_sentences": ["Make sure you read the lease carefully before signing.", "The lease says pets are not allowed without permission."],
      "confusion_pairs": ["rental agreement", "contract"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.8}
    },
    {
      "id": "vocab-hs-02",
      "word": "rent",
      "phonetic": "/rɛnt/",
      "translations": {"pa": "ਕਿਰਾਇਆ", "hi": "किराया", "zh": "租金", "es": "alquiler"},
      "level": "seed",
      "category": "housing",
      "example_sentences": ["Rent is due on the first of every month.", "My rent went up by thirty dollars this year."],
      "confusion_pairs": ["lease", "monthly payment"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.6}
    },
    {
      "id": "vocab-hs-03",
      "word": "landlord",
      "phonetic": "/ˈlændlɔːrd/",
      "translations": {"pa": "ਮਕਾਨ ਮਾਲਿਕ", "hi": "मकान मालिक", "zh": "房东", "es": "propietario"},
      "level": "seed",
      "category": "housing",
      "example_sentences": ["Talk to your landlord if something needs fixing.", "Our landlord is pretty good about maintenance."],
      "confusion_pairs": ["property manager", "superintendent"],
      "fsrs_params": {"difficulty": 0.24, "stability": 4.4}
    },
    {
      "id": "vocab-hs-04",
      "word": "tenant",
      "phonetic": "/ˈtɛnənt/",
      "translations": {"pa": "ਕਿਰਾਇਆਦਾਰ", "hi": "किरायेदार", "zh": "租客", "es": "inquilino"},
      "level": "seed",
      "category": "housing",
      "example_sentences": ["The tenant before us lived here for five years.", "As a tenant, you have the right to a safe apartment."],
      "confusion_pairs": ["renter", "leaseholder"],
      "fsrs_params": {"difficulty": 0.25, "stability": 4.3}
    },
    {
      "id": "vocab-hs-05",
      "word": "apartment",
      "phonetic": "/əˈpɑːrtmənt/",
      "translations": {"pa": "ਅਪਾਰਟਮੈਂਟ", "hi": "अपार्टमेंट", "zh": "公寓", "es": "apartamento"},
      "level": "seed",
      "category": "housing",
      "example_sentences": ["We found a nice two-bedroom apartment near the subway.", "The apartment has a lot of natural light."],
      "confusion_pairs": ["condo", "unit"],
      "fsrs_params": {"difficulty": 0.22, "stability": 4.5}
    },
    {
      "id": "vocab-hs-06",
      "word": "deposit",
      "phonetic": "/dɪˈpɒzɪt/",
      "translations": {"pa": "ਜ਼ਮਾਨਤ", "hi": "जमा (सिक्योरिटी डिपॉज़िट)", "zh": "押金", "es": "depósito"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["I paid first and last month's deposit when I signed the lease.", "The deposit is held in trust until you move out."],
      "confusion_pairs": ["down payment", "first and last"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-hs-07",
      "word": "key",
      "phonetic": "/kiː/",
      "translations": {"pa": "ਚਾਬੀ", "hi": "चाबी", "zh": "钥匙", "es": "llave"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["I picked up the keys from the landlord's office on June 1st.", "Don't lose the key — there's a fifty-dollar replacement fee."],
      "confusion_pairs": ["key fob", "key card"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.1}
    },
    {
      "id": "vocab-hs-08",
      "word": "utilities",
      "phonetic": "/juːˈtɪlɪtiz/",
      "translations": {"pa": "ਉਪਯੋਗਿਤਾਵਾਂ", "hi": "उपयोगिताएँ (बिजली-पानी)", "zh": "水电暖等费用", "es": "servicios públicos"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["Are heat and water included in the rent?", "We pay our own utilities for electricity and internet."],
      "confusion_pairs": ["services", "bills"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.9}
    },
    {
      "id": "vocab-hs-09",
      "word": "furnished",
      "phonetic": "/ˈfɜːrnɪʃt/",
      "translations": {"pa": "ਫਰਨੀਚਰ ਵਾਲਾ", "hi": "फ़र्नीशर वाला", "zh": "带家具的", "es": "amueblado"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["The apartment comes furnished with a bed and a sofa.", "We rented it unfurnished and bought our own furniture."],
      "confusion_pairs": ["unfurnished", "semi-furnished"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.8}
    },
    {
      "id": "vocab-hs-10",
      "word": "parking",
      "phonetic": "/ˈpɑːrkɪŋ/",
      "translations": {"pa": "ਪਾਰਕਿੰਗ", "hi": "पार्किंग", "zh": "停车位", "es": "estacionamiento"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["Parking is available for an extra seventy-five dollars a month.", "The building has underground parking for residents."],
      "confusion_pairs": ["garage", "driveway"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-hs-11",
      "word": "balcony",
      "phonetic": "/ˈbælkəni/",
      "translations": {"pa": "ਬਾਲਕੋਨੀ", "hi": "बालकनी", "zh": "阳台", "es": "balcón"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["The balcony is big enough for a small table and chairs.", "We love sitting on the balcony in the summer."],
      "confusion_pairs": ["patio", "terrace"],
      "fsrs_params": {"difficulty": 0.31, "stability": 3.9}
    },
    {
      "id": "vocab-hs-12",
      "word": "maintenance",
      "phonetic": "/ˈmeɪntənəns/",
      "translations": {"pa": "ਰੱਖ-ਰਖਾਅ", "hi": "रखरखाव", "zh": "维护", "es": "mantenimiento"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["Submit a maintenance request online for any repairs.", "The building has a maintenance team that works weekdays."],
      "confusion_pairs": ["repairs", "upkeep"],
      "fsrs_params": {"difficulty": 0.34, "stability": 3.7}
    },
    {
      "id": "vocab-hs-13",
      "word": "repair",
      "phonetic": "/rɪˈpɛr/",
      "translations": {"pa": "ਮੁਰੰਮਤ", "hi": "मरम्मत", "zh": "修理", "es": "reparación"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["The super did a quick repair on the leaky faucet.", "For major repairs, call the landlord right away."],
      "confusion_pairs": ["fix", "renovation"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.8}
    },
    {
      "id": "vocab-hs-14",
      "word": "leak",
      "phonetic": "/liːk/",
      "translations": {"pa": "ਚੋਅ", "hi": "रिसाव", "zh": "漏水", "es": "fuga"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["There's a leak under the kitchen sink.", "The leak damaged the floor, so the landlord needs to fix it."],
      "confusion_pairs": ["flood", "drip"],
      "fsrs_params": {"difficulty": 0.34, "stability": 3.7}
    },
    {
      "id": "vocab-hs-15",
      "word": "appliance",
      "phonetic": "/əˈplaɪəns/",
      "translations": {"pa": "ਉਪਕਰਨ", "hi": "उपकरण", "zh": "家用电器", "es": "electrodoméstico"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["The fridge and stove are included in the apartment.", "The washing machine is a shared appliance in the basement."],
      "confusion_pairs": ["fridge", "stove"],
      "fsrs_params": {"difficulty": 0.35, "stability": 3.6}
    },
    {
      "id": "vocab-hs-16",
      "word": "notice",
      "phonetic": "/ˈnoʊtɪs/",
      "translations": {"pa": "ਨੋਟਿਸ", "hi": "नोटिस", "zh": "通知", "es": "aviso"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["I need to give sixty days' notice before I move out.", "The landlord posted a notice about the fire alarm test."],
      "confusion_pairs": ["warning", "notification"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.8}
    },
    {
      "id": "vocab-hs-17",
      "word": "insurance",
      "phonetic": "/ɪnˈʃʊrəns/",
      "translations": {"pa": "ਬੀਮਾ", "hi": "बीमा", "zh": "保险", "es": "seguro"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["Tenant insurance covers your belongings in case of a fire.", "The landlord asked for proof of insurance before move-in."],
      "confusion_pairs": ["coverage", "policy"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.7}
    },
    {
      "id": "vocab-hs-18",
      "word": "inspection",
      "phonetic": "/ɪnˈspɛkʃən/",
      "translations": {"pa": "ਨਿਰੀਖਣ", "hi": "निरीक्षण", "zh": "检查", "es": "inspección"},
      "level": "sprout",
      "category": "housing",
      "example_sentences": ["The move-in inspection showed a scratch on the floor.", "We have a move-out inspection scheduled for Friday."],
      "confusion_pairs": ["walkthrough", "checklist"],
      "fsrs_params": {"difficulty": 0.35, "stability": 3.6}
    },
    {
      "id": "vocab-hs-19",
      "word": "sublet",
      "phonetic": "/sʌbˈlɛt/",
      "translations": {"pa": "ਉਪ-ਕਿਰਾਇਆ", "hi": "सबलेट / उप-किराया", "zh": "转租", "es": "subarriendo"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["I'm looking for someone to sublet my apartment for the summer.", "The lease says subletting needs written permission from the landlord."],
      "confusion_pairs": ["sublease", "assignment"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-hs-20",
      "word": "eviction",
      "phonetic": "/ɪˈvɪkʃən/",
      "translations": {"pa": "ਬੇਦਖਲੀ", "hi": "बेदखली", "zh": "驱逐", "es": "desalojo"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["An eviction notice is serious and can affect your rental history.", "The tenant was evicted for not paying rent for three months."],
      "confusion_pairs": ["removal", "termination"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.9}
    },
    {
      "id": "vocab-hs-21",
      "word": "damage",
      "phonetic": "/ˈdæmɪdʒ/",
      "translations": {"pa": "ਨੁਕਸਾਨ", "hi": "नुकसान", "zh": "损坏", "es": "daño"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["Normal wear and tear is not the same as damage.", "The tenant is responsible for damage beyond normal use."],
      "confusion_pairs": ["wear and tear", "destruction"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-hs-22",
      "word": "deduction",
      "phonetic": "/dɪˈdʌkʃən/",
      "translations": {"pa": "ਕਟੌਤੀ", "hi": "कटौती", "zh": "扣款", "es": "deducción"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The landlord took a deduction from the deposit for cleaning.", "Ask for receipts if the landlord makes a deduction."],
      "confusion_pairs": ["refund", "chargeback"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-hs-23",
      "word": "renewal",
      "phonetic": "/rɪˈnuːəl/",
      "translations": {"pa": "ਨਵਿਆਉਣ", "hi": "नवीनीकरण", "zh": "续约", "es": "renovación"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["My lease renewal came with a four percent increase.", "I'm thinking about signing a two-year renewal this time."],
      "confusion_pairs": ["extension", "renewal agreement"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-hs-24",
      "word": "rent increase",
      "phonetic": "/rɛnt ˈɪnkriːs/",
      "translations": {"pa": "ਕਿਰਾਇਆ ਵਾਧਾ", "hi": "किराया वृद्धि", "zh": "涨租", "es": "aumento de alquiler"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The rent increase is higher than the provincial guideline.", "A rent increase needs proper written notice of at least ninety days."],
      "confusion_pairs": ["rent hike", "rent adjustment"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-hs-25",
      "word": "negotiation",
      "phonetic": "/nɪˌɡoʊʃiˈeɪʃən/",
      "translations": {"pa": "ਗੱਲਬਾਤ", "hi": "बातचीत", "zh": "协商", "es": "negociación"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["There's room for negotiation if you sign a longer lease.", "I tried to negotiate a lower rent increase."],
      "confusion_pairs": ["discussion", "bargaining"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-hs-26",
      "word": "complaint",
      "phonetic": "/kəmˈpleɪnt/",
      "translations": {"pa": "ਸ਼ਿਕਾਇਤ", "hi": "शिकायत", "zh": "投诉", "es": "queja"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["I filed a noise complaint with the building management.", "Put your complaint in writing so there's a record."],
      "confusion_pairs": ["grievance", "noise complaint"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-hs-27",
      "word": "noise",
      "phonetic": "/nɔɪz/",
      "translations": {"pa": "ਰੌਲਾ", "hi": "शोर", "zh": "噪音", "es": "ruido"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The noise from the construction next door is really loud.", "There was a lot of noise from the party upstairs."],
      "confusion_pairs": ["sound", "disturbance"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-hs-28",
      "word": "disturbance",
      "phonetic": "/dɪˈstɜːrbəns/",
      "translations": {"pa": "ਖਲਬਲੀ", "hi": "गड़बड़ी", "zh": "干扰", "es": "molestia"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The disturbance woke me up at two in the morning.", "If the disturbance continues, call the non-emergency police line."],
      "confusion_pairs": ["nuisance", "disruption"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-hs-29",
      "word": "neighbor",
      "phonetic": "/ˈneɪbər/",
      "translations": {"pa": "ਗੁਆਂਢੀ", "hi": "पड़ोसी", "zh": "邻居", "es": "vecino"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["Our neighbor is very friendly and watches our apartment when we're away.", "The neighbor downstairs complains about footsteps."],
      "confusion_pairs": ["resident", "neighbouring tenant"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-hs-30",
      "word": "property",
      "phonetic": "/ˈprɒpərti/",
      "translations": {"pa": "ਜਾਇਦਾਦ", "hi": "संपत्ति", "zh": "房产", "es": "propiedad"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The property includes a small backyard and a storage locker.", "The property manager handles all the buildings on this street."],
      "confusion_pairs": ["premises", "building"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-hs-31",
      "word": "pest control",
      "phonetic": "/pɛst kənˈtroʊl/",
      "translations": {"pa": "ਕੀਟ ਨਿਯੰਤਰਣ", "hi": "कीट नियंत्रण", "zh": "害虫防治", "es": "control de plagas"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The building has a pest control visit every three months.", "Report pests to the landlord so they can arrange treatment."],
      "confusion_pairs": ["extermination", "infestation"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.8}
    },
    {
      "id": "vocab-hs-32",
      "word": "termination",
      "phonetic": "/ˌtɜːrmɪˈneɪʃən/",
      "translations": {"pa": "ਸਮਾਪਤੀ", "hi": "समाप्ति", "zh": "终止", "es": "terminación"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The lease termination date is July 31st.", "Early termination of the lease costs one month's rent."],
      "confusion_pairs": ["end of lease", "cancellation"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-hs-33",
      "word": "clause",
      "phonetic": "/klɔːz/",
      "translations": {"pa": "ਧਾਰਾ", "hi": "खंड (धारा)", "zh": "条款", "es": "cláusula"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["There's a clause in the lease about visitors staying more than two weeks.", "Read the termination clause carefully before signing."],
      "confusion_pairs": ["section", "term"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-hs-34",
      "word": "co-signer",
      "phonetic": "/ˈkoʊˌsaɪnər/",
      "translations": {"pa": "ਸਹਿ-ਹਸਤਾਖਰਕਾਰ", "hi": "सह-हस्ताक्षरकर्ता", "zh": "共同签署人", "es": "cofirmante"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["My dad is my co-signer because I'm a student with no credit history.", "The landlord requires a co-signer if the tenant's income is too low."],
      "confusion_pairs": ["guarantor", "co-tenant"],
      "fsrs_params": {"difficulty": 0.49, "stability": 2.7}
    },
    {
      "id": "vocab-hs-35",
      "word": "occupancy",
      "phonetic": "/ˈɒkjʊpənsi/",
      "translations": {"pa": "ਕਬਜ਼ਾ", "hi": "कब्ज़ा", "zh": "入住", "es": "ocupación"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The occupancy date is the day you can move in.", "Maximum occupancy for this unit is two people per bedroom."],
      "confusion_pairs": ["possession", "move-in date"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.8}
    },
    {
      "id": "vocab-hs-36",
      "word": "elevator",
      "phonetic": "/ˈɛlɪveɪtər/",
      "translations": {"pa": "ਲਿਫਟ", "hi": "लिफ़्ट", "zh": "电梯", "es": "ascensor"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The elevator is broken again, and I live on the tenth floor.", "There's a service elevator for moving furniture."],
      "confusion_pairs": ["lift", "escalator"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-hs-37",
      "word": "laundry",
      "phonetic": "/ˈlɔːndri/",
      "translations": {"pa": "ਕਪੜੇ ਧੋਣ ਦਾ ਕਮਰਾ", "hi": "कपड़े धोने का कमरा", "zh": "洗衣房", "es": "lavandería"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["There's a coin laundry room in the basement.", "The building has laundry facilities on every second floor."],
      "confusion_pairs": ["washing machine", "dryer"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-hs-38",
      "word": "superintendent",
      "phonetic": "/ˌsuːpərɪnˈtɛndənt/",
      "translations": {"pa": "ਸੁਪਰਡੈਂਟ", "hi": "सुपरिंटेंडेंट", "zh": "楼管", "es": "superintendente"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["The super lives in the building and handles emergencies.", "Knock on the super's door if you have an urgent problem."],
      "confusion_pairs": ["super", "building manager"],
      "fsrs_params": {"difficulty": 0.49, "stability": 2.7}
    },
    {
      "id": "vocab-hs-39",
      "word": "reference",
      "phonetic": "/ˈrɛfərəns/",
      "translations": {"pa": "ਹਵਾਲਾ", "hi": "संदर्भ (सिफ़ारिश)", "zh": "推荐信", "es": "referencia"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["My previous landlord gave me a good reference.", "The rental application asks for two references from past landlords."],
      "confusion_pairs": ["letter of recommendation", "character reference"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-hs-40",
      "word": "move-out",
      "phonetic": "/ˈmuːvaʊt/",
      "translations": {"pa": "ਬਾਹਰ ਜਾਣਾ", "hi": "बाहर जाना", "zh": "搬出", "es": "mudanza de salida"},
      "level": "branch",
      "category": "housing",
      "example_sentences": ["I scheduled the move-out inspection for the last day of the month.", "The move-out checklist includes cleaning the oven and fridge."],
      "confusion_pairs": ["move-out inspection", "vacate"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.8}
    },
    {
      "id": "vocab-hs-41",
      "word": "tribunal",
      "phonetic": "/traɪˈbjuːnəl/",
      "translations": {"pa": "ਅਦਾਲਤ", "hi": "न्यायाधिकरण", "zh": "仲裁庭", "es": "tribunal"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["The Landlord and Tenant Board is the tribunal that handles disputes.", "You can file a case with the tribunal online."],
      "confusion_pairs": ["board", "court"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-hs-42",
      "word": "hearing",
      "phonetic": "/ˈhɪrɪŋ/",
      "translations": {"pa": "ਸੁਣਵਾਈ", "hi": "सुनवाई", "zh": "听证会", "es": "audiencia"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["The LTB hearing is scheduled for next month.", "Both the landlord and tenant can speak at the hearing."],
      "confusion_pairs": ["mediation", "meeting"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-hs-43",
      "word": "dispute",
      "phonetic": "/dɪˈspjuːt/",
      "translations": {"pa": "ਵਿਵਾਦ", "hi": "विवाद", "zh": "纠纷", "es": "disputa"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["There's a dispute about the damage deposit deduction.", "Mediation is a way to resolve a dispute without going to court."],
      "confusion_pairs": ["disagreement", "conflict"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    },
    {
      "id": "vocab-hs-44",
      "word": "compensation",
      "phonetic": "/ˌkɒmpənˈseɪʃən/",
      "translations": {"pa": "ਮੁਆਵਜ਼ਾ", "hi": "मुआवज़ा", "zh": "赔偿", "es": "compensación"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["The tenant asked for compensation for the days without heat.", "The landlord offered compensation for the inconvenience."],
      "confusion_pairs": ["reimbursement", "damages"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-hs-45",
      "word": "inventory",
      "phonetic": "/ˈɪnvəntɔːri/",
      "translations": {"pa": "ਸੂਚੀ", "hi": "सूची", "zh": "物品清单", "es": "inventario"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["Make an inventory of everything in the apartment before you move in.", "The move-in inventory lists the condition of each item."],
      "confusion_pairs": ["list", "checklist"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    },
    {
      "id": "vocab-hs-46",
      "word": "depreciation",
      "phonetic": "/dɪˌpriːʃiˈeɪʃən/",
      "translations": {"pa": "ਮੁੱਲ ਘਟਣਾ", "hi": "मूल्य ह्रास", "zh": "折旧", "es": "depreciación"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["Carpets have a depreciation value over time in rental law.", "The landlord deducted for depreciation on the old furniture."],
      "confusion_pairs": ["wear and tear", "devaluation"],
      "fsrs_params": {"difficulty": 0.63, "stability": 1.8}
    },
    {
      "id": "vocab-hs-47",
      "word": "penalty",
      "phonetic": "/ˈpɛnəlti/",
      "translations": {"pa": "ਜੁਰਮਾਨਾ", "hi": "जुर्माना", "zh": "罚款", "es": "multa"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["Breaking the lease early has a penalty of one month's rent.", "There's a penalty for late payment of rent."],
      "confusion_pairs": ["fine", "fee"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-hs-48",
      "word": "renovation",
      "phonetic": "/ˌrɛnəˈveɪʃən/",
      "translations": {"pa": "ਨਵੀਨੀਕਰਨ", "hi": "नवीनीकरण", "zh": "翻新", "es": "renovación"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["The landlord is doing renovations on the kitchen next month.", "During the renovation, the water will be turned off for two days."],
      "confusion_pairs": ["remodel", "upgrade"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    },
    {
      "id": "vocab-hs-49",
      "word": "by-law",
      "phonetic": "/ˈbaɪlɔː/",
      "translations": {"pa": "ਉਪ-ਬੰਦ", "hi": "उप-नियम", "zh": "地方法规", "es": "ordenanza municipal"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["The city by-law says no loud music after 11 PM.", "The building has a by-law against smoking in common areas."],
      "confusion_pairs": ["regulation", "rule"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-hs-50",
      "word": "mediation",
      "phonetic": "/ˌmiːdiˈeɪʃən/",
      "translations": {"pa": "ਵਿਚੋਲਗੀ", "hi": "मध्यस्थता", "zh": "调解", "es": "mediación"},
      "level": "bloom",
      "category": "housing",
      "example_sentences": ["Mediation is a free service offered by the LTB.", "The mediator helps both sides reach an agreement."],
      "confusion_pairs": ["arbitration", "negotiation"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    }
  ]
}