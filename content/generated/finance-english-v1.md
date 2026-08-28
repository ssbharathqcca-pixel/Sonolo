{
  "scenarios": [
    {
      "id": "fn-opening-bank-account",
      "title": "Opening a newcomer bank account at a branch",
      "description": "You just landed in Canada and need a bank account for your paycheque. Visit a branch, meet the advisor, and open your first Canadian accounts.",
      "category": "finance",
      "mode": "immigration",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Denise Kim, a new client advisor at a big bank branch in Mississauga. You are welcoming and patient with newcomers. Greet the client, ask what type of account they need (chequing for daily use, savings for building up money), explain the newcomer package (no monthly fee for the first year, free e-transfers, no minimum balance), and ask for two pieces of ID, proof of address, and a Social Insurance Number (SIN). Explain that the debit card arrives in the mail within five to seven business days and that mobile banking can be set up immediately. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi there, welcome to Canada's Choice Bank! I'm Denise. So you're looking to open an account today?",
      "expected_turns": 6,
      "success_criteria": [
        "User states they want to open a bank account",
        "User answers questions about their needs (daily banking, savings)",
        "User asks about fees or the newcomer package",
        "User asks about what documents to bring",
        "User confirms next steps (card delivery, mobile banking)"
      ],
      "vocabulary_targets": [
        "bank",
        "account",
        "teller",
        "deposit",
        "branch"
      ],
      "grammar_targets": [
        "questions with What do I need...? (What do I need to open an account?)",
        "future arrangements (The card will arrive in five to seven days)",
        "polite requests with Could you...? (Could you explain the fees?)"
      ],
      "cultural_notes": "Newcomers in Canada usually open a chequing account for daily spending and a savings account for emergencies. Most banks offer newcomer packages with no monthly fee for the first year. You need two pieces of ID, proof of address, and a Social Insurance Number (SIN) or confirmation of its application. Canadian deposits are insured up to one hundred thousand dollars by the CDIC.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "fn-interac-etransfer-limits",
      "title": "Asking a teller how Interac e-Transfer limits work",
      "description": "You want to send money to a friend for dinner but aren't sure about e-transfer limits. Ask the teller at your credit union how it works.",
      "category": "finance",
      "mode": "both",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Rob Castellano, a teller at a credit union in Ottawa. You are friendly and clear. The client wants to know how Interac e-Transfer works and its limits. Explain the daily limit (three thousand dollars), the per-transfer limit (one thousand dollars), and that transfers between friends are free but business e-transfers have a small fee. Explain the autodeposit feature so money goes straight in without a security question, and remind them to send funds only to people they trust. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, welcome to Horizon Credit Union! What can I help you with today?",
      "expected_turns": 5,
      "success_criteria": [
        "User asks about e-transfer limits",
        "User asks how to send money to someone",
        "User asks about fees or security",
        "User confirms understanding of the daily limit",
        "User thanks the teller and confirms next steps"
      ],
      "vocabulary_targets": [
        "e-transfer",
        "transfer",
        "limit",
        "teller",
        "balance"
      ],
      "grammar_targets": [
        "questions with How much...? / How many...? (How much can I send at once?)",
        "clarifying with So...? (So the daily limit is three thousand?)",
        "giving amounts with per (per transfer, per day)"
      ],
      "cultural_notes": "Interac e-Transfer is the standard way Canadians send money to each other, and it usually arrives within minutes. Banks set daily and per-transfer limits that you can raise by calling or visiting a branch. Autodeposit skips the security question when the recipient's email or phone is registered. E-transfer fraud is common, so only send money to people you know.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "fn-secured-credit-card",
      "title": "Applying for a secured credit card to build a credit score",
      "description": "You have no credit history in Canada and want to start building a credit score. Talk to a bank representative about a secured credit card.",
      "category": "finance",
      "mode": "immigration",
      "level": "sprout",
      "target_language": "en-CA",
      "difficulty": 2,
      "system_prompt": "You are Anita Sharma, a financial services representative at a bank in Surrey. You are encouraging and clear. Explain that a secured credit card helps newcomers build a credit score because there's no credit history yet. Explain how it works: the client deposits five hundred dollars as security, the card limit equals the deposit, and the deposit is returned when the card is closed in good standing. Explain that building credit takes six months to a year of on-time payments, and suggest setting up automatic minimum payments. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, I'm Anita. You mentioned you're interested in getting your first credit card to build credit — great first step.",
      "expected_turns": 6,
      "success_criteria": [
        "User asks how a secured card works",
        "User asks about the deposit and credit limit",
        "User asks how to build their credit score",
        "User asks about fees or interest",
        "User decides whether to apply"
      ],
      "vocabulary_targets": [
        "credit card",
        "credit score",
        "deposit",
        "limit",
        "credit history"
      ],
      "grammar_targets": [
        "questions with How does... work? (How does a secured card work?)",
        "conditionals (If I put down five hundred dollars, what's my limit?)",
        "advice with should (You should pay on time every month)"
      ],
      "cultural_notes": "A secured credit card is the standard first card for newcomers with no Canadian credit history. You deposit money as security, and the card limit usually equals the deposit. Your credit score is built over months of on-time payments, and the two Canadian credit bureaus are Equifax and TransUnion. The deposit is returned when the card is closed in good standing.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "fn-pre-authorized-bill-payments",
      "title": "Setting up pre-authorized bill payments online",
      "description": "You want to stop worrying about due dates and set up automatic bill payments. Walk through the mobile app with a banking specialist.",
      "category": "finance",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Liam O'Connor, a mobile banking specialist at a bank in Halifax. You are helpful and tech-savvy. Walk the client through setting up pre-authorized bill payments in the mobile app: select the payee (Rogers phone bill), enter the account number, choose the payment date (the fifteenth), and confirm. Explain the difference between a pre-authorized debit (the company takes the money) and a bill payment (the bank sends it). Remind them to keep enough money in the account and to watch for notification emails. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hey there, I'm Liam, from the mobile banking team. So you want to set up automatic payments for your bills?",
      "expected_turns": 6,
      "success_criteria": [
        "User asks how to add a payee",
        "User asks about payment dates or amounts",
        "User asks about the difference between bill payment and pre-authorized debit",
        "User confirms the payee and payment date",
        "User asks about what happens if there isn't enough money"
      ],
      "vocabulary_targets": [
        "bill payment",
        "pre-authorized",
        "transfer",
        "account",
        "fee"
      ],
      "grammar_targets": [
        "sequencing instructions (First, select the payee. Then, enter the amount.)",
        "questions with What happens if...? (What happens if I don't have enough money?)",
        "imperatives for steps (Choose the date, confirm the payment)"
      ],
      "cultural_notes": "Most Canadians pay bills through online banking — either a bill payment the bank sends, or a pre-authorized debit the company takes automatically. Setting a payment date a few days after payday avoids overdrafts. Late or missed payments can trigger fees, and some companies charge a penalty for returned payments.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "fn-foreign-exchange-wire",
      "title": "Asking about foreign exchange rates and sending a wire transfer",
      "description": "You need to send money to family abroad. Visit the branch, ask about exchange rates, and arrange an international wire transfer.",
      "category": "finance",
      "mode": "immigration",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Fatima Al-Rashid, a branch manager at a bank in Vancouver. You are precise and professional. The client wants to send money to family abroad and needs a wire transfer. Explain the process: the sender needs the recipient's full name, bank name, account number, and SWIFT code. Give the current USD exchange rate (one point three six CAD per USD) and explain the flat fee (thirty dollars for international wires). Mention that the money usually arrives in two to three business days, and warn about the difference between the advertised rate and the rate plus a margin. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Good morning, welcome! I'm Fatima, the branch manager. You'd like to send money to family outside Canada?",
      "expected_turns": 6,
      "success_criteria": [
        "User asks about the exchange rate",
        "User asks about fees and delivery time",
        "User asks what information is needed for a wire transfer",
        "User confirms the recipient details",
        "User confirms the total cost and timeline"
      ],
      "vocabulary_targets": [
        "foreign exchange",
        "wire transfer",
        "currency",
        "fee",
        "transfer"
      ],
      "grammar_targets": [
        "questions with How long...? / How much...? (How long does a wire take?)",
        "numbers and rates (one point three six)",
        "clarifying details (So I need their SWIFT code and account number?)"
      ],
      "cultural_notes": "Canadians send money abroad through wire transfers, e-transfers (to limited countries), or services like Wise and Western Union. International wires need the recipient's bank details including the SWIFT code, and banks charge a flat fee plus an exchange-rate margin. Rates change daily, and comparing options before sending is common practice.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "fn-credit-card-statement",
      "title": "Understanding a credit card statement and minimum payments",
      "description": "Your first credit card statement arrived and the numbers are confusing. Call customer service and get the minimum payment and interest explained.",
      "category": "finance",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Grace Wong, a customer service representative at a bank in Winnipeg. You are patient and explanatory. The client is confused by their credit card statement. Walk through it: the statement date, the total balance, the minimum payment (the smaller of fifty dollars or five percent), the due date, and the interest rate (nineteen point nine nine percent). Explain that paying only the minimum means interest keeps building, and suggest paying the full balance or setting up automatic payments. Mention that the grace period is twenty-one days if the balance is paid in full. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, Grace here, customer service. You had questions about your credit card statement?",
      "expected_turns": 6,
      "success_criteria": [
        "User asks what the minimum payment means",
        "User asks about the due date or interest",
        "User asks about the statement balance",
        "User asks how to avoid interest",
        "User confirms a plan (full payment, automatic payment)"
      ],
      "vocabulary_targets": [
        "statement",
        "minimum payment",
        "interest",
        "credit card",
        "balance"
      ],
      "grammar_targets": [
        "questions with What does... mean? (What does minimum payment mean?)",
        "explaining with which (The minimum is the smaller of fifty dollars or five percent)",
        "advice with could (You could set up automatic payments)"
      ],
      "cultural_notes": "Canadian credit card statements show a total balance, a minimum payment (usually about three to five percent of the balance), a due date, and the annual interest rate. Paying the full balance each month avoids interest entirely thanks to the grace period. Minimum payments are designed to stretch out the debt — and the interest.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "fn-fraud-alert-suspicious-charge",
      "title": "Calling the bank about a suspicious charge or fraud alert",
      "description": "A charge you don't recognize appeared on your card. Call the bank's 24/7 fraud line and get it investigated.",
      "category": "finance",
      "mode": "both",
      "level": "branch",
      "target_language": "en-CA",
      "difficulty": 3,
      "system_prompt": "You are Marcus Webb, a fraud prevention specialist at a bank's twenty-four-seven fraud line. You are calm and reassuring. The client is calling about a suspicious charge on their card. Ask for the amount (three hundred and forty dollars at an electronics store they didn't visit) and the date. Reassure them that the card has been temporarily blocked, and that a new card will be issued in five to seven business days. Explain that the charge will be reversed within ten business days after the investigation, and that the client should review their recent transactions for anything else suspicious. Remind them to update automatic payments with the new card number. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Thanks for calling the fraud line — this is Marcus. I understand there's a charge on your card you don't recognize. Let's sort it out.",
      "expected_turns": 7,
      "success_criteria": [
        "User describes the suspicious charge clearly",
        "User answers security verification questions",
        "User asks about the investigation and reversal timeline",
        "User asks about the new card",
        "User confirms next steps (review transactions, update payments)"
      ],
      "vocabulary_targets": [
        "fraud",
        "alert",
        "transaction",
        "card",
        "statement"
      ],
      "grammar_targets": [
        "past tense for describing the charge (I saw a charge from yesterday)",
        "questions with When will...? (When will the money come back?)",
        "reassurance with will (The charge will be reversed)"
      ],
      "cultural_notes": "Canadian banks have zero-liability policies for unauthorized transactions when reported promptly. Banks usually block the card, issue a new one, and reverse the charge after a short investigation. Fraud alerts can come as texts, emails, or calls — banks never ask for your PIN or password. Reviewing your statement regularly is standard advice.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "fn-tfsa-opening",
      "title": "Opening a TFSA and asking about contribution limits",
      "description": "Your advisor mentioned a TFSA as a good place to start saving. Meet the investment advisor and open your first Tax-Free Savings Account.",
      "category": "finance",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Yvonne Chen, an investment advisor at a bank in Toronto. You are knowledgeable and encouraging. Explain what a TFSA is — a Tax-Free Savings Account where investment growth and withdrawals are tax-free. Explain the contribution room: the annual limit (seven thousand dollars in 2025) plus any unused room from previous years, and that you must be eighteen or older with a valid SIN. Explain that over-contributing has a one-percent-per-month penalty, and that withdrawing doesn't permanently reduce room — it gets added back the next year. Clarify that the TFSA can hold cash, GICs, or mutual funds, and that it's different from an RRSP. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, I'm Yvonne, one of the advisors here. You wanted to talk about opening a TFSA?",
      "expected_turns": 7,
      "success_criteria": [
        "User asks what a TFSA is and how it's taxed",
        "User asks about contribution limits and their room",
        "User asks about what they can invest in",
        "User asks about penalties for over-contributing",
        "User confirms the opening steps"
      ],
      "vocabulary_targets": [
        "TFSA",
        "contribution room",
        "investment",
        "dividend",
        "savings"
      ],
      "grammar_targets": [
        "questions with How much...? (How much can I contribute?)",
        "explaining rules with must (You must be eighteen or older)",
        "clarifying with So...? (So withdrawals don't reduce my room permanently?)"
      ],
      "cultural_notes": "The TFSA is one of Canada's most useful accounts: growth and withdrawals are tax-free, and contribution room accumulates each year from age eighteen. The annual limit is set by the government (seven thousand dollars in 2025). Over-contributing triggers a one-percent-per-month penalty. TFSAs can hold cash, GICs, stocks, or mutual funds, and bank advisors explain this for free.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "fn-rrsp-retirement",
      "title": "Meeting an advisor to discuss RRSPs and retirement basics",
      "description": "You'd like to start saving for retirement and lower your taxes. Meet a retirement planning advisor and learn how an RRSP works.",
      "category": "finance",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Daniel Fortin, a retirement planning advisor at a bank in Quebec City. You are patient and use plain language. Explain the RRSP — Registered Retirement Savings Plan — where contributions reduce taxable income now and grow tax-deferred until withdrawal. Explain the contribution limit: eighteen percent of last year's earned income, up to the annual cap (thirty-one thousand dollars for 2025), and that unused room carries forward. Explain the Home Buyers' Plan (HBP) allows a withdrawal up to sixty thousand dollars for a first home, repaid over fifteen years, and that money withdrawn later is taxed as income in retirement. Warn that the deadline for contributions to count for a tax year is March 1st. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hello, I'm Daniel, retirement planning. You wanted to learn about RRSPs?",
      "expected_turns": 7,
      "success_criteria": [
        "User asks how RRSPs reduce tax",
        "User asks about contribution limits or the deadline",
        "User asks about the Home Buyers' Plan",
        "User asks about when they can withdraw",
        "User confirms a next step (book a follow-up, set a contribution)"
      ],
      "vocabulary_targets": [
        "RRSP",
        "retirement",
        "investment",
        "tax return",
        "financial advisor"
      ],
      "grammar_targets": [
        "questions with What happens...? (What happens when I withdraw?)",
        "explaining numbers and percentages (Eighteen percent of your income)",
        "conditionals about timing (If I contribute before March 1st, it counts for this year)"
      ],
      "cultural_notes": "The RRSP is a retirement savings vehicle that lowers your taxable income in the year you contribute; withdrawals are taxed later as income. The contribution limit is eighteen percent of earned income up to an annual cap, and the deadline is usually March 1st of the following year. The Home Buyers' Plan lets first-time buyers withdraw up to sixty thousand dollars tax-free if repaid over fifteen years. Bank advisors explain this at no charge.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "fn-personal-loan-line-of-credit",
      "title": "Applying for a small personal loan or line of credit",
      "description": "You want to borrow ten thousand dollars for a car. Sit down with a lending specialist and compare a personal loan with a line of credit.",
      "category": "finance",
      "mode": "both",
      "level": "bloom",
      "target_language": "en-CA",
      "difficulty": 4,
      "system_prompt": "You are Nadia Rahman, a personal lending specialist at a bank in Edmonton. You are professional and clear. The client wants to borrow ten thousand dollars for a car. Explain the options: a fixed-rate personal loan (interest locked for the term, five years at seven point nine percent) or a line of credit (revolving, variable rate around eight point five percent, pay interest only or more). Explain what affects approval: income, credit score, existing debts, and a co-signer if needed. Explain that the loan has fixed monthly payments of about two hundred and two dollars, while the line of credit gives flexibility. Warn about late fees and that missed payments hurt the credit score. If a sentence comes out tangled, restate it smoothly inside your reply before moving on — never correct harshly.",
      "opening_line": "Hi, Nadia Rahman, lending specialist. So you're thinking about borrowing for a car — let's look at your options.",
      "expected_turns": 7,
      "success_criteria": [
        "User asks about loan vs line of credit",
        "User asks about interest rates and monthly payments",
        "User asks about approval requirements",
        "User asks about fees or penalties",
        "User chooses an option or asks for an application"
      ],
      "vocabulary_targets": [
        "loan",
        "line of credit",
        "interest",
        "income",
        "credit score"
      ],
      "grammar_targets": [
        "comparing options (The loan has fixed payments, whereas the line of credit is flexible)",
        "questions with How much would...? (How much would the monthly payment be?)",
        "conditionals (If I get a co-signer, will that help?)"
      ],
      "cultural_notes": "Canadians borrow through personal loans (fixed payments, fixed term) or lines of credit (revolving, flexible). Approval depends on income, credit score, and existing debt. A co-signer with good credit can improve approval chances. Interest rates are quoted annually, and missed payments appear on your credit report for up to six years.",
      "is_premium": true,
      "is_published": true
    }
  ],
  "vocabulary": [
    {
      "id": "vocab-fn-01",
      "word": "bank",
      "phonetic": "/bæŋk/",
      "translations": {"pa": "ਬੈਂਕ", "hi": "बैंक", "zh": "银行", "es": "banco"},
      "level": "seed",
      "category": "finance",
      "example_sentences": ["I need to open a bank account for my paycheque.", "The bank on the corner has an ATM that works all night."],
      "confusion_pairs": ["branch", "credit union"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.8}
    },
    {
      "id": "vocab-fn-02",
      "word": "money",
      "phonetic": "/ˈmʌni/",
      "translations": {"pa": "ਪੈਸਾ", "hi": "पैसा", "zh": "钱", "es": "dinero"},
      "level": "seed",
      "category": "finance",
      "example_sentences": ["I put my money in a savings account to earn interest.", "How much money do you need for the deposit?"],
      "confusion_pairs": ["cash", "funds"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.6}
    },
    {
      "id": "vocab-fn-03",
      "word": "account",
      "phonetic": "/əˈkaʊnt/",
      "translations": {"pa": "ਖਾਤਾ", "hi": "खाता", "zh": "账户", "es": "cuenta"},
      "level": "seed",
      "category": "finance",
      "example_sentences": ["I have a chequing account and a savings account.", "Check your account balance before you buy something."],
      "confusion_pairs": ["chequing", "savings"],
      "fsrs_params": {"difficulty": 0.24, "stability": 4.4}
    },
    {
      "id": "vocab-fn-04",
      "word": "cash",
      "phonetic": "/kæʃ/",
      "translations": {"pa": "ਨਕਦ", "hi": "नकद", "zh": "现金", "es": "efectivo"},
      "level": "seed",
      "category": "finance",
      "example_sentences": ["Do you have enough cash for the taxi?", "I prefer to pay with cash at small stores."],
      "confusion_pairs": ["debit", "money"],
      "fsrs_params": {"difficulty": 0.22, "stability": 4.5}
    },
    {
      "id": "vocab-fn-05",
      "word": "credit",
      "phonetic": "/ˈkrɛdɪt/",
      "translations": {"pa": "ਕ੍ਰੈਡਿਟ", "hi": "क्रेडिट", "zh": "信用", "es": "crédito"},
      "level": "seed",
      "category": "finance",
      "example_sentences": ["Your credit score affects your ability to get a loan.", "Building credit takes time, so start early."],
      "confusion_pairs": ["debit", "loan"],
      "fsrs_params": {"difficulty": 0.25, "stability": 4.3}
    },
    {
      "id": "vocab-fn-06",
      "word": "teller",
      "phonetic": "/ˈtɛlər/",
      "translations": {"pa": "ਟੈਲਰ", "hi": "कैशियर (टेलर)", "zh": "出纳员", "es": "cajero"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["The teller helped me deposit my cheque.", "Ask the teller about the daily withdrawal limit."],
      "confusion_pairs": ["cashier", "advisor"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-fn-07",
      "word": "deposit",
      "phonetic": "/dɪˈpɒzɪt/",
      "translations": {"pa": "ਜਮ੍ਹਾਂ", "hi": "जमा", "zh": "存款", "es": "depósito"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["I made a cash deposit at the ATM.", "The deposit will show in your account by tomorrow."],
      "confusion_pairs": ["withdrawal", "transfer"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-fn-08",
      "word": "withdrawal",
      "phonetic": "/wɪðˈdrɔːəl/",
      "translations": {"pa": "ਨਿਕਾਸੀ", "hi": "निकासी", "zh": "取款", "es": "retiro"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["The maximum withdrawal at this ATM is five hundred dollars.", "I made a withdrawal of two hundred dollars."],
      "confusion_pairs": ["deposit", "transfer"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.9}
    },
    {
      "id": "vocab-fn-09",
      "word": "transfer",
      "phonetic": "/ˈtrænsfər/",
      "translations": {"pa": "ਟ੍ਰਾਂਸਫਰ", "hi": "स्थानांतरण", "zh": "转账", "es": "transferencia"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["I'll transfer the money to your account tonight.", "The transfer takes one business day."],
      "confusion_pairs": ["e-transfer", "wire transfer"],
      "fsrs_params": {"difficulty": 0.31, "stability": 3.9}
    },
    {
      "id": "vocab-fn-10",
      "word": "e-transfer",
      "phonetic": "/ˈiːˌtrænsfər/",
      "translations": {"pa": "ਈ-ਟ੍ਰਾਂਸਫਰ", "hi": "ई-ट्रांसफर", "zh": "电子转账", "es": "transferencia electrónica"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["I sent you an e-transfer for the rent.", "Interac e-transfers usually arrive within minutes."],
      "confusion_pairs": ["wire transfer", "Interac"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.8}
    },
    {
      "id": "vocab-fn-11",
      "word": "balance",
      "phonetic": "/ˈbæləns/",
      "translations": {"pa": "ਬਕਾਇਆ", "hi": "शेष राशि", "zh": "余额", "es": "saldo"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["My account balance is one hundred and fifty dollars.", "Check your balance online before the bill is due."],
      "confusion_pairs": ["available balance", "credit limit"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-fn-12",
      "word": "interest",
      "phonetic": "/ˈɪntrəst/",
      "translations": {"pa": "ਵਿਆਜ", "hi": "ब्याज", "zh": "利息", "es": "interés"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["The savings account pays three percent interest.", "Credit cards charge high interest on unpaid balances."],
      "confusion_pairs": ["compound interest", "rate"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.8}
    },
    {
      "id": "vocab-fn-13",
      "word": "fee",
      "phonetic": "/fiː/",
      "translations": {"pa": "ਫੀਸ", "hi": "शुल्क", "zh": "费用", "es": "cargo"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["There's a monthly fee for this account.", "The ATM charged a fee because it wasn't our bank's machine."],
      "confusion_pairs": ["charge", "penalty"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-fn-14",
      "word": "cheque",
      "phonetic": "/tʃɛk/",
      "translations": {"pa": "ਚੈੱਕ", "hi": "चेक", "zh": "支票", "es": "cheque"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["I wrote a cheque for the first month's rent.", "The bank holds the cheque for five business days."],
      "confusion_pairs": ["chequing account", "bill"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.7}
    },
    {
      "id": "vocab-fn-15",
      "word": "debit",
      "phonetic": "/ˈdɛbɪt/",
      "translations": {"pa": "ਡੈਬਿਟ", "hi": "डेबिट", "zh": "借记", "es": "débito"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["I paid with my debit card at the grocery store.", "Debit comes straight out of your account."],
      "confusion_pairs": ["credit", "e-transfer"],
      "fsrs_params": {"difficulty": 0.31, "stability": 3.9}
    },
    {
      "id": "vocab-fn-16",
      "word": "card",
      "phonetic": "/kɑːrd/",
      "translations": {"pa": "ਕਾਰਡ", "hi": "कार्ड", "zh": "卡", "es": "tarjeta"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["My card was declined at the checkout.", "Keep your card in a safe place."],
      "confusion_pairs": ["debit card", "credit card"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-fn-17",
      "word": "ATM",
      "phonetic": "/ˌeɪtiːˈɛm/",
      "translations": {"pa": "ਏਟੀਐਮ", "hi": "एटीएम", "zh": "自动取款机", "es": "cajero automático"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["I got cash from the ATM on the corner.", "The ATM is out of order today."],
      "confusion_pairs": ["branch", "ABM"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.8}
    },
    {
      "id": "vocab-fn-18",
      "word": "branch",
      "phonetic": "/bræntʃ/",
      "translations": {"pa": "ਬ੍ਰਾਂਚ", "hi": "शाखा", "zh": "分行", "es": "sucursal"},
      "level": "sprout",
      "category": "finance",
      "example_sentences": ["I opened the account at the downtown branch.", "The branch opens at nine thirty."],
      "confusion_pairs": ["ATM", "head office"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-fn-19",
      "word": "credit score",
      "phonetic": "/ˈkrɛdɪt skɔːr/",
      "translations": {"pa": "ਕ੍ਰੈਡਿਟ ਸਕੋਰ", "hi": "क्रेडिट स्कोर", "zh": "信用评分", "es": "puntaje crediticio"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["A good credit score helps you get better interest rates.", "You can check your credit score for free once a year."],
      "confusion_pairs": ["credit history", "credit report"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-fn-20",
      "word": "credit card",
      "phonetic": "/ˈkrɛdɪt kɑːrd/",
      "translations": {"pa": "ਕ੍ਰੈਡਿਟ ਕਾਰਡ", "hi": "क्रेडिट कार्ड", "zh": "信用卡", "es": "tarjeta de crédito"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["I use my credit card for online purchases.", "Pay your credit card balance on time to avoid interest."],
      "confusion_pairs": ["debit card", "line of credit"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-fn-21",
      "word": "minimum payment",
      "phonetic": "/ˈmɪnɪməm ˈpeɪmənt/",
      "translations": {"pa": "ਘੱਟੋ-ਘੱਟ ਭੁਗਤਾਨ", "hi": "न्यूनतम भुगतान", "zh": "最低还款额", "es": "pago mínimo"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["The minimum payment is fifty dollars this month.", "Paying only the minimum means you pay more interest over time."],
      "confusion_pairs": ["statement balance", "full balance"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-fn-22",
      "word": "statement",
      "phonetic": "/ˈsteɪtmənt/",
      "translations": {"pa": "ਸਟੇਟਮੈਂਟ", "hi": "स्टेटमेंट", "zh": "账单", "es": "estado de cuenta"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["Your statement is available online on the first of the month.", "Review your statement for charges you don't recognize."],
      "confusion_pairs": ["receipt", "bill"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-fn-23",
      "word": "fraud",
      "phonetic": "/frɔːd/",
      "translations": {"pa": "ਧੋਖਾਧੜੀ", "hi": "धोखाधड़ी", "zh": "欺诈", "es": "fraude"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["The bank blocked the transaction because it looked like fraud.", "Report fraud to your bank immediately."],
      "confusion_pairs": ["scam", "theft"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-fn-24",
      "word": "alert",
      "phonetic": "/əˈlɜːrt/",
      "translations": {"pa": "ਚੇਤਾਵਨੀ", "hi": "चेतावनी", "zh": "警报", "es": "alerta"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["I set up an alert for any purchase over one hundred dollars.", "The bank sends an alert when your balance is low."],
      "confusion_pairs": ["notification", "warning"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-fn-25",
      "word": "limit",
      "phonetic": "/ˈlɪmɪt/",
      "translations": {"pa": "ਹੱਦ", "hi": "सीमा", "zh": "限额", "es": "límite"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["What's the daily limit for e-transfers?", "You can raise your card limit by calling the bank."],
      "confusion_pairs": ["daily limit", "credit limit"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-fn-26",
      "word": "foreign exchange",
      "phonetic": "/ˈfɒrɪn ɪksˈtʃeɪndʒ/",
      "translations": {"pa": "ਵਿਦੇਸ਼ੀ ਮੁਦਰਾ", "hi": "विदेशी मुद्रा", "zh": "外汇", "es": "divisas"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["The foreign exchange rate changes every day.", "I asked about foreign exchange before my trip to the US."],
      "confusion_pairs": ["currency exchange", "wire transfer"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.9}
    },
    {
      "id": "vocab-fn-27",
      "word": "wire transfer",
      "phonetic": "/ˈwaɪər ˈtrænsfər/",
      "translations": {"pa": "ਵਾਇਰ ਟ੍ਰਾਂਸਫਰ", "hi": "वायर ट्रांसफर", "zh": "电汇", "es": "transferencia bancaria"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["A wire transfer to India takes two business days.", "There's a fee for international wire transfers."],
      "confusion_pairs": ["e-transfer", "international transfer"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-fn-28",
      "word": "currency",
      "phonetic": "/ˈkʌrənsi/",
      "translations": {"pa": "ਮੁਦਰਾ", "hi": "मुद्रा", "zh": "货币", "es": "moneda"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["You can exchange currency at the bank.", "What currency do you need for your trip?"],
      "confusion_pairs": ["foreign exchange", "cash"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-fn-29",
      "word": "bill payment",
      "phonetic": "/bɪl ˈpeɪmənt/",
      "translations": {"pa": "ਬਿੱਲ ਭੁਗਤਾਨ", "hi": "बिल भुगतान", "zh": "账单支付", "es": "pago de facturas"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["I set up bill payments for my phone and internet.", "The bill payment will leave your account today."],
      "confusion_pairs": ["pre-authorized payment", "e-transfer"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-fn-30",
      "word": "pre-authorized",
      "phonetic": "/ˌpriːˈɔːθəraɪzd/",
      "translations": {"pa": "ਪੂਰਵ-ਅਧਿਕਾਰਤ", "hi": "पूर्व-अधिकृत", "zh": "预授权", "es": "preautorizado"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["My rent is pre-authorized from my account on the first.", "Pre-authorized payments save time but watch your balance."],
      "confusion_pairs": ["automatic payment", "recurring payment"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-fn-31",
      "word": "savings",
      "phonetic": "/ˈseɪvɪŋz/",
      "translations": {"pa": "ਬੱਚਤ", "hi": "बचत", "zh": "储蓄", "es": "ahorros"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["I keep my emergency fund in a savings account.", "The savings account gives you a higher interest rate."],
      "confusion_pairs": ["chequing", "investment"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-fn-32",
      "word": "overdraft",
      "phonetic": "/ˈoʊvərdræft/",
      "translations": {"pa": "ਓਵਰਡਰਾਫਟ", "hi": "ओवरड्राफ्ट", "zh": "透支", "es": "sobregiro"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["I went into overdraft by twenty dollars.", "Overdraft protection costs a small monthly fee."],
      "confusion_pairs": ["insufficient funds", "overdraft protection"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-fn-33",
      "word": "loan",
      "phonetic": "/loʊn/",
      "translations": {"pa": "ਕਰਜ਼ਾ", "hi": "लोन", "zh": "贷款", "es": "préstamo"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["I applied for a small personal loan to buy a car.", "The loan has a fixed interest rate for five years."],
      "confusion_pairs": ["mortgage", "line of credit"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-fn-34",
      "word": "line of credit",
      "phonetic": "/laɪn əv ˈkrɛdɪt/",
      "translations": {"pa": "ਕ੍ਰੈਡਿਟ ਲਾਈਨ", "hi": "क्रेडिट लाइन", "zh": "信用额度", "es": "línea de crédito"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["A line of credit lets you borrow up to a limit.", "The line of credit has a lower rate than a credit card."],
      "confusion_pairs": ["loan", "credit card"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-fn-35",
      "word": "credit history",
      "phonetic": "/ˈkrɛdɪt ˈhɪstəri/",
      "translations": {"pa": "ਕ੍ਰੈਡਿਟ ਇਤਿਹਾਸ", "hi": "क्रेडिट इतिहास", "zh": "信用记录", "es": "historial crediticio"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["You need a credit history to rent an apartment.", "Building a credit history starts with your first card."],
      "confusion_pairs": ["credit report", "credit score"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-fn-36",
      "word": "income",
      "phonetic": "/ˈɪnkʌm/",
      "translations": {"pa": "ਆਮਦਨ", "hi": "आय", "zh": "收入", "es": "ingresos"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["The bank asked for proof of income.", "My monthly income is enough to cover the rent."],
      "confusion_pairs": ["salary", "revenue"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-fn-37",
      "word": "proof of employment",
      "phonetic": "/pruːf əv ɪmˈplɔɪmənt/",
      "translations": {"pa": "ਰੋਜ਼ਗਾਰ ਦਾ ਸਬੂਤ", "hi": "रोज़गार का प्रमाण", "zh": "就业证明", "es": "comprobante de empleo"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["Bring proof of employment to the appointment.", "A letter from your employer works as proof of employment."],
      "confusion_pairs": ["pay stub", "letter of employment"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.8}
    },
    {
      "id": "vocab-fn-38",
      "word": "PIN",
      "phonetic": "/pɪn/",
      "translations": {"pa": "ਪਿੰਨ", "hi": "पिन", "zh": "密码", "es": "PIN"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["Never share your PIN with anyone.", "I changed my PIN at the ATM."],
      "confusion_pairs": ["password", "security question"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-fn-39",
      "word": "transaction",
      "phonetic": "/trænˈzækʃən/",
      "translations": {"pa": "ਲੈਣ-ਦੇਣ", "hi": "लेनदेन", "zh": "交易", "es": "transacción"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["The transaction was declined, so I tried again.", "Keep track of your transactions in the app."],
      "confusion_pairs": ["deposit", "purchase"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-fn-40",
      "word": "receipt",
      "phonetic": "/rɪˈsiːt/",
      "translations": {"pa": "ਰਸੀਦ", "hi": "रसीद", "zh": "收据", "es": "recibo"},
      "level": "branch",
      "category": "finance",
      "example_sentences": ["Do you want a receipt for the withdrawal?", "Save your receipt in case of a dispute."],
      "confusion_pairs": ["statement", "invoice"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-fn-41",
      "word": "TFSA",
      "phonetic": "/ˌtiːɛfɛsˈeɪ/",
      "translations": {"pa": "ਟੀਐਫਐਸਏ", "hi": "TFSA", "zh": "免税储蓄账户", "es": "TFSA"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["A TFSA lets your money grow without tax.", "You can withdraw from a TFSA at any time."],
      "confusion_pairs": ["RRSP", "savings account"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-fn-42",
      "word": "RRSP",
      "phonetic": "/ˌɑːrɑːrɛsˈpiː/",
      "translations": {"pa": "ਆਰਆਰਐਸਪੀ", "hi": "RRSP", "zh": "注册退休储蓄计划", "es": "RRSP"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["RRSP contributions lower your taxable income.", "The advisor suggested putting more into my RRSP."],
      "confusion_pairs": ["TFSA", "pension"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    },
    {
      "id": "vocab-fn-43",
      "word": "contribution room",
      "phonetic": "/ˌkɒntrɪˈbjuːʃən ruːm/",
      "translations": {"pa": "ਯੋਗਦਾਨ ਸੀਮਾ", "hi": "योगदान सीमा", "zh": "供款额度", "es": "espacio de contribución"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["Your TFSA contribution room is shown online.", "Check your contribution room before you invest."],
      "confusion_pairs": ["contribution limit", "annual limit"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-fn-44",
      "word": "retirement",
      "phonetic": "/rɪˈtaɪərmənt/",
      "translations": {"pa": "ਰਿਟਾਇਰਮੈਂਟ", "hi": "सेवानिवृत्ति", "zh": "退休", "es": "jubilación"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["It's never too early to save for retirement.", "She plans to retire at sixty-five."],
      "confusion_pairs": ["pension", "RRSP"],
      "fsrs_params": {"difficulty": 0.57, "stability": 2.2}
    },
    {
      "id": "vocab-fn-45",
      "word": "investment",
      "phonetic": "/ɪnˈvɛstmənt/",
      "translations": {"pa": "ਨਿਵੇਸ਼", "hi": "निवेश", "zh": "投资", "es": "inversión"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["The advisor explained different investment options.", "Investments can go down as well as up."],
      "confusion_pairs": ["savings", "speculation"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-fn-46",
      "word": "dividend",
      "phonetic": "/ˈdɪvɪdɛnd/",
      "translations": {"pa": "ਲਾਭਾਂਸ਼", "hi": "लाभांश", "zh": "股息", "es": "dividendo"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["The fund pays a dividend every quarter.", "Dividends are one way to earn from your investment."],
      "confusion_pairs": ["interest", "capital gain"],
      "fsrs_params": {"difficulty": 0.61, "stability": 1.9}
    },
    {
      "id": "vocab-fn-47",
      "word": "mutual fund",
      "phonetic": "/ˈmjuːtʃuəl fʌnd/",
      "translations": {"pa": "ਮਿਉਚੁਅਲ ਫੰਡ", "hi": "म्युचुअल फंड", "zh": "共同基金", "es": "fondo mutuo"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["A mutual fund spreads your money across many companies.", "I put part of my savings into a mutual fund."],
      "confusion_pairs": ["ETF", "GIC"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-fn-48",
      "word": "compound interest",
      "phonetic": "/ˈkɒmpaʊnd ˈɪntrəst/",
      "translations": {"pa": "ਮਿਸ਼ਰਤ ਵਿਆਜ", "hi": "चक्रवृद्धि ब्याज", "zh": "复利", "es": "interés compuesto"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["Compound interest helps your savings grow faster.", "The earlier you start, the more compound interest works for you."],
      "confusion_pairs": ["simple interest", "interest rate"],
      "fsrs_params": {"difficulty": 0.62, "stability": 1.9}
    },
    {
      "id": "vocab-fn-49",
      "word": "financial advisor",
      "phonetic": "/faɪˈnænʃəl ədˈvaɪzər/",
      "translations": {"pa": "ਵਿੱਤੀ ਸਲਾਹਕਾਰ", "hi": "वित्तीय सलाहकार", "zh": "财务顾问", "es": "asesor financiero"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["The financial advisor reviewed my goals.", "Meeting a financial advisor at the bank is free."],
      "confusion_pairs": ["bank teller", "financial planner"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    },
    {
      "id": "vocab-fn-50",
      "word": "tax return",
      "phonetic": "/tæks rɪˈtɜːrn/",
      "translations": {"pa": "ਟੈਕਸ ਰਿਟਰਨ", "hi": "टैक्स रिटर्न", "zh": "报税", "es": "declaración de impuestos"},
      "level": "bloom",
      "category": "finance",
      "example_sentences": ["You can file your tax return online in March.", "A tax return shows your income and deductions."],
      "confusion_pairs": ["tax refund", "T4"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    }
  ]
}