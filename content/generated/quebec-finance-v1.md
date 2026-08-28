{
  "scenarios": [
    {
      "id": "qc-fn-ouvrir-compte-nouvel-arrivant",
      "title": "Ouvrir un compte bancaire pour nouvel arrivant",
      "description": "Tu viens d'arriver au Canada et tu veux ouvrir ton premier compte bancaire. Tu rencontres la directrice de la succursale pour choisir un compte et comprendre les documents nécessaires.",
      "category": "finance",
      "mode": "immigration",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Karine Lefebvre, directrice de succursale dans une banque canadienne au centre-ville de Montréal. Tu vouvoies la personne, tu es patiente et accueillante. Accueille le nouvel arrivant et propose l'ouverture d'un premier compte : le compte chèques sans frais pendant la première année, la carte de débit, le service bancaire en ligne et l'application mobile, et le dépôt direct pour le salaire. Demande les documents habituels : passeport ou permis de conduire, et une preuve d'adresse; mentionne que le numéro d'assurance sociale peut être demandé pour les comptes qui rapportent des intérêts. Réponds aux questions sur la différence entre compte chèques et compte épargne, les frais, les guichets automatiques et les chèques. Termine en résumant les prochaines étapes : carte envoyée par la poste en cinq jours, code d'accès au service en ligne, et invitation à revenir en cas de question. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, bienvenue! Moi c'est Karine Lefebvre, directrice de la succursale. Vous êtes nouvellement arrivé au Canada? Je peux vous aider à ouvrir votre premier compte.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant se présente et explique qu'il veut ouvrir un compte",
        "L'apprenant demande la différence entre compte chèques et compte épargne",
        "L'apprenant pose une question sur les frais ou la carte de débit",
        "L'apprenant demande quels documents apporter",
        "L'apprenant confirme les prochaines étapes et remercie"
      ],
      "vocabulary_targets": [
        "compte chèques",
        "carte de débit",
        "dépôt direct",
        "succursale",
        "chèque"
      ],
      "grammar_targets": [
        "se présenter et donner ses coordonnées (je m'appelle..., mon adresse est...)",
        "demander poliment (est-ce que vous pourriez m'expliquer la différence?)",
        "le futur proche pour les démarches (je vais ouvrir un compte, je vais recevoir ma carte)"
      ],
      "cultural_notes": "Au Canada, les banques offrent souvent des comptes sans frais pendant la première année pour les nouveaux arrivants. Le compte chèques sert aux dépenses de tous les jours et le compte épargne aux économies; la carte de débit est acceptée presque partout et le salaire se dépose par dépôt direct. On ouvre un compte en succursale ou en ligne avec une pièce d'identité et une preuve d'adresse, et le numéro d'assurance sociale peut être demandé pour les comptes qui rapportent des intérêts.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-fn-virement-interac-limites",
      "title": "Poser des questions sur un virement Interac et ses limites",
      "description": "Tu veux envoyer de l'argent à un ami par virement Interac, mais tu te demandes comment ça marche et quelles sont les limites. Tu poses tes questions à la caissière de ta banque.",
      "category": "finance",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Véronique Gagnon, caissière dans une succursale bancaire à Laval. Tu vouvoies la personne, tu es claire et souriante. Explique le virement Interac : on envoie de l'argent par courriel ou par texto avec une question de sécurité; le destinataire répond à la question et l'argent tombe dans son compte, souvent en quelques minutes. Donne les limites du forfait : trois mille dollars par virement et cinq mille dollars par jour, avec des frais de 1,50 $ par virement au-delà de dix virements par mois. Réponds aux questions sur le dépôt de l'argent, la question de sécurité et ce qui arrive si le virement n'est pas accepté (il expire après trente jours). Termine en proposant de faire un premier virement ensemble depuis l'application. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous avez des questions sur les virements Interac? Je peux vous expliquer comment ça marche, c'est très pratique.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant demande comment fonctionne un virement Interac",
        "L'apprenant pose une question sur la limite par virement ou par jour",
        "L'apprenant s'informe des frais",
        "L'apprenant pose une question sur la question de sécurité ou le dépôt",
        "L'apprenant remercie et confirme qu'il essaiera"
      ],
      "vocabulary_targets": [
        "virement",
        "limite",
        "frais",
        "compte",
        "transaction"
      ],
      "grammar_targets": [
        "poser des questions sur les limites (quelle est la limite par jour?)",
        "comprendre les frais (est-ce que ça coûte quelque chose?)",
        "expliquer une démarche (je veux envoyer un virement à mon propriétaire)"
      ],
      "cultural_notes": "Le virement Interac est le moyen d'envoyer de l'argent le plus courant au Canada : il se fait par courriel ou par texto avec une question de sécurité, et l'argent arrive souvent en quelques minutes. Chaque banque impose des limites par virement et par jour, et des frais peuvent s'appliquer au-delà d'un certain nombre de virements. On l'utilise pour partager une facture, payer un ami ou même verser un acompte.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-fn-carte-credit-garantie-dossier",
      "title": "Demander une carte de crédit garantie pour bâtir son dossier",
      "description": "Tu veux bâtir ton dossier de crédit, mais tu n'as pas encore d'historique au Canada. Tu rencontres une conseillère pour demander une carte de crédit garantie.",
      "category": "finance",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Nadia Benali, conseillère dans une banque à Québec. Tu vouvoies la personne, tu es encourageante et tu expliques sans jargon. Explique la carte de crédit garantie : on dépose un montant de garantie (par exemple 500 $), la limite de crédit est égale à ce dépôt, et la carte sert à faire des achats comme une carte ordinaire. La clé, c'est de payer le solde à temps chaque mois : ça construit le dossier de crédit et la cote de crédit, même sans historique au Canada. Explique la demande : formulaire en ligne ou en succursale, pièce d'identité, et le dépôt se fait au moment de l'ouverture. Réponds aux questions sur les frais, les intérêts et la possibilité de passer à une carte régulière plus tard. Termine en proposant de faire la demande ensemble. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous voulez en savoir plus sur la carte de crédit garantie? Asseyez-vous, je vous explique comment ça fonctionne.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant explique qu'il veut bâtir son dossier de crédit",
        "L'apprenant pose une question sur le dépôt de garantie ou la limite",
        "L'apprenant demande comment payer pour améliorer sa cote",
        "L'apprenant s'informe des étapes de la demande",
        "L'apprenant remercie et confirme qu'il fera la demande"
      ],
      "vocabulary_targets": [
        "carte de crédit",
        "dossier de crédit",
        "garantie",
        "dépôt",
        "limite",
        "cote de crédit"
      ],
      "grammar_targets": [
        "parler de son but (je veux bâtir mon dossier de crédit)",
        "comprendre une condition (la limite est égale à mon dépôt)",
        "poser des questions sur les étapes (comment je fais la demande?)"
      ],
      "cultural_notes": "Au Québec comme ailleurs au Canada, le dossier de crédit est le résumé de l'historique de paiement d'une personne, et la cote de crédit est le chiffre qui le résume. Les nouveaux arrivants commencent souvent avec une carte de crédit garantie : le dépôt de garantie protège la banque et la limite égale le dépôt. Payer le solde à temps chaque mois bâtit le dossier, ce qui aide ensuite à obtenir un prêt ou un logement.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-fn-paiements-preautorises",
      "title": "Configurer des paiements préautorisés pour Hydro et le téléphone",
      "description": "Tu veux que tes factures d'Hydro-Québec et de téléphone se paient toutes seules chaque mois. Tu rencontres un conseiller pour configurer les prélèvements automatiques.",
      "category": "finance",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Samuel Roy, conseiller bancaire à Trois-Rivières. Tu vouvoies la personne, tu es méthodique et rassurant. Explique le prélèvement automatique : une autorisation écrite (le formulaire d'autorisation) qui permet à un fournisseur de prélever le montant de la facture directement sur le compte, à une date fixe chaque mois. Guide la configuration pour Hydro-Québec et la compagnie de téléphone : le numéro de compte du fournisseur, le montant (variable selon la consommation ou fixe), et la date du prélèvement (par exemple le 5 du mois). Rappelle de vérifier le relevé de compte après chaque prélèvement et de garder assez d'argent pour éviter des frais si le compte est à découvert. Explique qu'on peut changer la date ou annuler l'autorisation en avisant le fournisseur par écrit. Réponds aux questions sur les retards et les montants variables. Termine en confirmant les deux autorisations. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous voulez mettre vos paiements d'Hydro-Québec et de téléphone en prélèvement automatique? On va remplir les autorisations ensemble.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant nomme les deux fournisseurs à configurer",
        "L'apprenant pose une question sur le montant ou la date du prélèvement",
        "L'apprenant demande comment vérifier que le prélèvement est bien fait",
        "L'apprenant s'informe de la façon de changer ou d'annuler l'autorisation",
        "L'apprenant confirme les deux autorisations et remercie"
      ],
      "vocabulary_targets": [
        "prélèvement automatique",
        "facture",
        "autorisation",
        "compte",
        "paiement",
        "relevé"
      ],
      "grammar_targets": [
        "expliquer une routine (je paie mes factures chaque mois)",
        "parler d'une date ou d'une fréquence (le 5 de chaque mois)",
        "formuler une demande (j'aimerais mettre ce compte en prélèvement automatique)"
      ],
      "cultural_notes": "Au Québec, le prélèvement automatique est très répandu pour les factures d'électricité, de téléphone et d'assurance : on signe une autorisation et le fournisseur prélève le montant à une date fixe. Le montant peut être variable selon la consommation, comme pour Hydro-Québec en hiver. On vérifie son relevé après chaque prélèvement et on garde assez d'argent au compte pour éviter les frais de découvert.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-fn-transfert-international-frais",
      "title": "Demander un transfert international et poser des questions sur les frais",
      "description": "Tu veux envoyer de l'argent à ta famille dans ton pays d'origine. Tu appelles ta banque pour demander un transfert international et comprendre les frais, le taux et les délais.",
      "category": "finance",
      "mode": "immigration",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Amélie Fortin, conseillère au service des transferts internationaux d'une banque canadienne. Tu vouvoies la personne, tu es précise et patiente. Explique le transfert international : on envoie de l'argent vers une banque dans un autre pays, avec les renseignements du destinataire (nom complet, numéro de compte, code de la banque, et souvent le code SWIFT ou IBAN). Détaille les coûts : des frais de transfert de 25 $, un taux de change appliqué à l'envoi, et parfois des frais de l'intermédiaire ou de la banque du destinataire. Indique le délai : deux à cinq jours ouvrables selon le pays. Demande le montant et le pays de destination, puis confirme le montant total qui sera débité du compte. Réponds aux questions sur la limite par transfert, la façon de suivre l'envoi et ce qu'il faut pour un prochain transfert. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous voulez envoyer de l'argent à l'étranger? Je vais vous expliquer ce qu'il faut comme renseignements et les frais qui s'appliquent.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant indique le montant et le pays de destination",
        "L'apprenant demande les renseignements nécessaires pour le destinataire",
        "L'apprenant pose des questions sur les frais et le taux de change",
        "L'apprenant s'informe du délai de transfert",
        "L'apprenant confirme le montant total et remercie"
      ],
      "vocabulary_targets": [
        "transfert",
        "frais",
        "taux",
        "compte",
        "transaction"
      ],
      "grammar_targets": [
        "donner les renseignements du destinataire (le nom, le numéro de compte, le code de la banque)",
        "poser des questions sur les coûts (combien ça coûte? quel est le taux?)",
        "parler des délais (ça prend combien de jours?)"
      ],
      "cultural_notes": "Envoyer de l'argent à l'étranger est fréquent pour les personnes qui soutiennent leur famille : le transfert bancaire international prend deux à cinq jours ouvrables et coûte des frais fixes, plus un taux de change et parfois des frais de l'intermédiaire. Il faut les renseignements complets du destinataire, dont le code de sa banque (SWIFT ou IBAN). Comparer les frais et le taux avant d'envoyer est un réflexe courant.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-fn-releve-carte-credit",
      "title": "Comprendre un relevé de carte de crédit et le paiement minimum",
      "description": "Tu as reçu ton premier relevé de carte de crédit et tu veux comprendre chaque ligne : le solde dû, la date d'échéance et le paiement minimum. Une conseillère t'explique tout.",
      "category": "finance",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Josée Bouchard, conseillère dans une banque à Sherbrooke. Tu vouvoies la personne, tu expliques calmement et ligne par ligne. Ouvre un relevé de carte de crédit type : la date de facturation, le solde précédent, les achats du mois, les paiements reçus, le solde dû, le paiement minimum, et la date d'échéance (par exemple le 15 du mois). Explique clairement : payer le solde complet avant l'échéance évite les intérêts; payer seulement le paiement minimum, c'est permis, mais des intérêts s'ajoutent sur le reste et la dette peut grossir; un paiement en retard ajoute des frais. Utilise des montants simples dans l'exemple (achats de 320 $, paiement minimum de 25 $). Réponds aux questions sur les intérêts, la date limite et les achats en ligne. Termine en vérifiant que tout est clair. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous avez des questions sur votre relevé de carte de crédit? On peut le regarder ligne par ligne, c'est plus simple comme ça.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant demande ce que signifie le solde dû",
        "L'apprenant pose une question sur le paiement minimum",
        "L'apprenant s'informe de la date d'échéance et des intérêts",
        "L'apprenant répète dans ses mots ce qu'il doit payer",
        "L'apprenant remercie et confirme qu'il comprend"
      ],
      "vocabulary_targets": [
        "relevé",
        "carte de crédit",
        "paiement minimum",
        "échéance",
        "solde",
        "intérêt"
      ],
      "grammar_targets": [
        "lire des montants (deux cent cinquante dollars, le solde dû)",
        "parler d'une date limite (la date d'échéance est le 15)",
        "comprendre une conséquence (si je paie seulement le minimum, des intérêts s'ajoutent)"
      ],
      "cultural_notes": "Au Québec, le relevé de carte de crédit arrive chaque mois avec une date d'échéance fixe. Payer le solde complet avant cette date évite de payer des intérêts; payer seulement le paiement minimum est permis, mais les intérêts s'accumulent sur le solde restant. Le paiement en retard ajoute des frais. Comprendre la différence entre solde dû et paiement minimum est un réflexe de base pour bien gérer sa carte.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-fn-transaction-suspecte",
      "title": "Appeler la banque au sujet d'une transaction suspecte",
      "description": "Tu vois un achat que tu ne reconnais pas sur ton relevé. Tu appelles le centre de sécurité de ta banque pour vérifier la transaction et protéger ton compte.",
      "category": "finance",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Sandra Bouchard, préposée au centre de sécurité d'une banque canadienne. Tu vouvoies la personne, tu es calme, rassurante et méthodique. Accueille l'appel au sujet d'une transaction suspecte. Vérifie l'identité avec des questions de sécurité (nom, date de naissance, dernière transaction connue). Passe en revue les transactions récentes avec l'apprenant : repère l'achat suspect (par exemple un achat en ligne de 400 $ dans un autre pays, fait la nuit dernière). Confirme que cette transaction n'a pas été faite par le titulaire, bloque la carte immédiatement, et explique la suite : une nouvelle carte sera envoyée dans cinq à sept jours, la transaction sera examinée et contestée (réclamation), et un suivi sera fait par courriel. Rassure en disant que le compte est maintenant protégé et invite à vérifier les prochaines transactions. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, merci d'appeler le centre de sécurité de votre banque. Je m'appelle Sandra Bouchard. Vous nous appelez au sujet d'une transaction, c'est bien ça?",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant répond aux questions de sécurité",
        "L'apprenant décrit la transaction suspecte (date, montant, commerçant)",
        "L'apprenant confirme que ce n'est pas lui qui a fait l'achat",
        "L'apprenant demande ce qui arrive à sa carte et à la transaction",
        "L'apprenant note les prochaines étapes et remercie"
      ],
      "vocabulary_targets": [
        "fraude",
        "transaction",
        "carte",
        "compte",
        "solde"
      ],
      "grammar_targets": [
        "raconter un fait au passé composé (j'ai vu un achat que je ne reconnais pas)",
        "décrire un montant et une date (un achat de quatre cents dollars la nuit dernière)",
        "poser des questions de suivi (qu'est-ce qui arrive maintenant? est-ce que ma carte est bloquée?)"
      ],
      "cultural_notes": "Au Canada, les banques ont un centre de sécurité disponible en tout temps pour les transactions suspectes. On vérifie d'abord l'identité de l'appelant, on repère la transaction, puis on bloque la carte et on conteste l'achat. Les questions de sécurité servent à protéger le compte, et une nouvelle carte est envoyée rapidement. Vérifier son relevé régulièrement et signaler tout achat inconnu sont les bons réflexes.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-fn-ouvrir-celi-limites",
      "title": "Ouvrir un CELI et poser des questions sur les limites de cotisation",
      "description": "Tu veux ouvrir un CELI pour épargner, mais tu veux comprendre comment ça fonctionne et connaître ta limite de cotisation. Tu en parles avec une conseillère.",
      "category": "finance",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Isabelle Tremblay, conseillère en gestion de patrimoine dans une banque à Montréal. Tu vouvoies la personne, tu expliques clairement et sans jargon. Explique le CELI (compte d'épargne libre d'impôt) : l'argent versé et les gains ne sont pas imposés, les retraits sont libres et libèrent de l'espace de cotisation pour les années suivantes, et la limite de cotisation cumulée se trouve sur l'avis de cotisation de l'Agence du revenu du Canada. Précise qu'une cotisation au-delà de la limite entraîne une pénalité, et que le plafond de cotisation est fixé chaque année par le gouvernement. Guide l'ouverture du compte : en ligne ou en succursale, puis un dépôt jusqu'à la limite. Réponds aux questions sur la différence avec un compte épargne ordinaire, les retraits et le rendement, en restant factuel sur les placements (aucune recommandation de produit). Termine en résumant ce qu'il faut vérifier avant de cotiser. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous voulez ouvrir un CELI? C'est un compte très utilisé ici — je vous explique comment ça fonctionne et ce qu'il faut savoir sur la limite de cotisation.",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant demande comment fonctionne le CELI",
        "L'apprenant pose une question sur la limite de cotisation",
        "L'apprenant s'informe de la différence avec un compte épargne ordinaire",
        "L'apprenant pose une question sur les retraits ou la pénalité",
        "L'apprenant confirme ce qu'il doit vérifier avant de cotiser"
      ],
      "vocabulary_targets": [
        "CELI",
        "cotisation",
        "plafond",
        "compte épargne",
        "intérêt",
        "rendement"
      ],
      "grammar_targets": [
        "comprendre une règle (la limite de cotisation est indiquée sur l'avis de cotisation)",
        "parler d'un montant (je veux déposer cinq mille dollars)",
        "poser des questions sur les conséquences (qu'est-ce qui arrive si je dépasse la limite?)"
      ],
      "cultural_notes": "Le CELI (compte d'épargne libre d'impôt) est très populaire au Canada : les gains ne sont pas imposés et les retraits sont libres. La limite de cotisation s'accumule chaque année et se vérifie sur l'avis de cotisation de l'Agence du revenu du Canada; cotiser au-delà de la limite entraîne une pénalité. Au Québec, les institutions financières proposent le CELI en succursale et en ligne, et il sert autant à épargner qu'à faire des placements.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-fn-reer-impots-conseiller",
      "title": "Discuter REER et impôts avec un conseiller",
      "description": "La date limite de cotisation au REER approche et tu as des questions sur les impôts. Tu rencontres un conseiller pour comprendre le REER et vérifier ton droit de cotisation.",
      "category": "finance",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Marc-Antoine Bélanger, conseiller fiscal dans une banque de Québec. Tu vouvoies la personne, tu es pédagogue et précis. Explique le REER (régime enregistré d'épargne-retraite) : les cotisations sont déductibles du revenu imposable, le droit de cotisation se trouve sur l'avis de cotisation, et la date limite pour cotiser pour l'année d'imposition est généralement à la fin de février ou au début de mars. Réponds aux questions sur les documents nécessaires (relevé de cotisation, avis de cotisation, déclaration de revenus), sur ce que la déduction change pour l'impôt, et sur la différence avec le CELI, en restant factuel (aucune recommandation de placement). Guide l'étape pratique : vérifier le droit de cotisation sur l'avis, faire une cotisation, et garder le relevé pour la déclaration de revenus. Termine en proposant de revoir les chiffres ensemble et de vérifier les dates. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Merci de prendre le temps de me rencontrer. On peut parler de votre REER et de vos questions d'impôt — je vais vous expliquer comment ça marche.",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant demande comment fonctionne le REER",
        "L'apprenant pose une question sur le droit de cotisation",
        "L'apprenant s'informe de la date limite de cotisation",
        "L'apprenant demande quels documents garder pour ses impôts",
        "L'apprenant remercie et confirme la prochaine étape"
      ],
      "vocabulary_targets": [
        "REER",
        "impôt",
        "cotisation",
        "déclaration",
        "conseiller",
        "remboursement"
      ],
      "grammar_targets": [
        "parler de documents (mon avis de cotisation, ma déclaration de revenus)",
        "poser des questions sur une date limite (jusqu'à quand je peux cotiser?)",
        "exprimer ses besoins (j'aimerais comprendre comment ça affecte mes impôts)"
      ],
      "cultural_notes": "Le REER (régime enregistré d'épargne-retraite) permet de cotiser à la retraite en réduisant le revenu imposable de l'année. Le droit de cotisation est indiqué sur l'avis de cotisation de l'Agence du revenu du Canada, et la date limite pour cotiser pour l'année d'imposition tombe généralement fin février ou début mars. Au Québec, on garde le relevé de cotisation avec sa déclaration de revenus, et le remboursement d'impôt arrive souvent au printemps.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-fn-pret-personnel-marge-credit",
      "title": "Demander un petit prêt personnel ou une marge de crédit",
      "description": "Tu as besoin d'un peu d'argent pour des dépenses imprévues. Tu rencontres une conseillère pour comparer un petit prêt personnel et une marge de crédit, et poser tes questions avant de décider.",
      "category": "finance",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Caroline Desjardins, conseillère en crédit dans une banque à Gatineau. Tu vouvoies la personne, tu es professionnelle et tu expliques les options sans recommander un produit plutôt qu'un autre. Explique la différence entre un prêt personnel et une marge de crédit : le prêt donne un montant fixe remboursé en mensualités fixes sur une durée précise, avec un taux fixe; la marge de crédit donne un montant disponible, on paie des intérêts seulement sur le montant utilisé, et les remboursements sont plus flexibles. Décris ce que la banque vérifie pour une demande : le dossier de crédit, les revenus, la stabilité de l'emploi, et le rapport entre les dettes et les revenus. Prends les renseignements de base (montant désiré de 5 000 $, but général) et propose un exemple de mensualité pour le prêt (environ 145 $ par mois sur trois ans). Réponds aux questions sur le taux, la durée, les frais et le remboursement anticipé. Termine en résumant l'information pour que la personne puisse réfléchir. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous songez à un prêt personnel ou à une marge de crédit? Je peux vous expliquer la différence et ce qu'il faut pour faire une demande.",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant explique son besoin en général",
        "L'apprenant demande la différence entre prêt et marge de crédit",
        "L'apprenant pose des questions sur le taux ou la mensualité",
        "L'apprenant s'informe de ce que la banque vérifie",
        "L'apprenant remercie et dit qu'il y réfléchira"
      ],
      "vocabulary_targets": [
        "prêt",
        "marge de crédit",
        "mensualité",
        "taux",
        "remboursement",
        "dossier de crédit"
      ],
      "grammar_targets": [
        "comparer deux options (le prêt a des mensualités fixes, la marge est plus flexible)",
        "parler de ses revenus et de son emploi (je travaille à temps plein, mon salaire est...)",
        "poser des questions sur le coût (quel est le taux? combien ça me coûte par mois?)"
      ],
      "cultural_notes": "Au Québec, un prêt personnel verse un montant fixe remboursé en mensualités stables, tandis qu'une marge de crédit donne une réserve d'argent souple avec des intérêts seulement sur le montant utilisé. Les banques évaluent le dossier de crédit, les revenus et la stabilité d'emploi avant d'accorder du crédit. Comparer le taux, la mensualité et les conditions avant de signer est la démarche attendue, et il n'y a aucune pénalité à prendre le temps de réfléchir.",
      "is_premium": true,
      "is_published": true
    }
  ],
  "vocabulary": [
    {
      "id": "vocab-qfn-01",
      "word": "compte",
      "phonetic": "/kɔ̃t/",
      "translations": {
        "en": "account",
        "pa": "ਖਾਤਾ",
        "hi": "खाता",
        "zh": "账户",
        "es": "cuenta"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "J'ai ouvert un compte à la banque cette semaine.",
        "Le numéro de mon compte est sur mon relevé."
      ],
      "confusion_pairs": [
        "compte chèques",
        "compte épargne"
      ],
      "fsrs_params": {
        "difficulty": 0.2,
        "stability": 4.8
      }
    },
    {
      "id": "vocab-qfn-02",
      "word": "banque",
      "phonetic": "/bɑ̃k/",
      "translations": {
        "en": "bank",
        "pa": "ਬੈਂਕ",
        "hi": "बैंक",
        "zh": "银行",
        "es": "banco"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "Ma banque a une succursale près du métro.",
        "La banque est ouverte du lundi au vendredi."
      ],
      "confusion_pairs": [
        "succursale",
        "institution"
      ],
      "fsrs_params": {
        "difficulty": 0.21,
        "stability": 4.7
      }
    },
    {
      "id": "vocab-qfn-03",
      "word": "argent",
      "phonetic": "/aʁ.ʒɑ̃/",
      "translations": {
        "en": "money",
        "pa": "ਪੈਸਾ",
        "hi": "पैसा",
        "zh": "钱",
        "es": "dinero"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "J'ai déposé de l'argent à mon compte.",
        "Il me reste un peu d'argent jusqu'à la fin du mois."
      ],
      "confusion_pairs": [
        "espèces",
        "monnaie"
      ],
      "fsrs_params": {
        "difficulty": 0.2,
        "stability": 4.6
      }
    },
    {
      "id": "vocab-qfn-04",
      "word": "carte",
      "phonetic": "/kaʁt/",
      "translations": {
        "en": "card",
        "pa": "ਕਾਰਡ",
        "hi": "कार्ड",
        "zh": "卡",
        "es": "tarjeta"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "Je paie presque tout avec ma carte.",
        "Ma carte est bloquée, je dois appeler la banque."
      ],
      "confusion_pairs": [
        "carte de débit",
        "carte de crédit"
      ],
      "fsrs_params": {
        "difficulty": 0.22,
        "stability": 4.5
      }
    },
    {
      "id": "vocab-qfn-05",
      "word": "dépôt",
      "phonetic": "/de.po/",
      "translations": {
        "en": "deposit",
        "pa": "ਜਮ੍ਹਾਂ",
        "hi": "जमा",
        "zh": "存款",
        "es": "depósito"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "J'ai fait un dépôt de cinq cents dollars.",
        "Le dépôt direct arrive le jeudi matin."
      ],
      "confusion_pairs": [
        "versement",
        "retrait"
      ],
      "fsrs_params": {
        "difficulty": 0.23,
        "stability": 4.4
      }
    },
    {
      "id": "vocab-qfn-06",
      "word": "retrait",
      "phonetic": "/ʁə.tʁɛ/",
      "translations": {
        "en": "withdrawal",
        "pa": "ਨਿਕਾਸੀ",
        "hi": "निकासी",
        "zh": "取款",
        "es": "retiro"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "Je dois faire un retrait au guichet automatique.",
        "Le retrait maximal par jour est de mille dollars."
      ],
      "confusion_pairs": [
        "dépôt",
        "transfert"
      ],
      "fsrs_params": {
        "difficulty": 0.24,
        "stability": 4.3
      }
    },
    {
      "id": "vocab-qfn-07",
      "word": "solde",
      "phonetic": "/sɔld/",
      "translations": {
        "en": "balance",
        "pa": "ਬਕਾਇਆ ਰਕਮ",
        "hi": "शेष राशि",
        "zh": "余额",
        "es": "saldo"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "Quel est le solde de mon compte?",
        "Le solde de ma carte de crédit est de deux cent cinquante dollars."
      ],
      "confusion_pairs": [
        "montant",
        "relevé"
      ],
      "fsrs_params": {
        "difficulty": 0.23,
        "stability": 4.2
      }
    },
    {
      "id": "vocab-qfn-08",
      "word": "intérêt",
      "phonetic": "/ɛ̃.te.ʁɛ/",
      "translations": {
        "en": "interest",
        "pa": "ਵਿਆਜ",
        "hi": "ब्याज",
        "zh": "利息",
        "es": "interés"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "La carte de crédit charge des intérêts sur le solde impayé.",
        "Plus le taux est élevé, plus les intérêts coûtent cher."
      ],
      "confusion_pairs": [
        "taux",
        "frais"
      ],
      "fsrs_params": {
        "difficulty": 0.25,
        "stability": 4.1
      }
    },
    {
      "id": "vocab-qfn-09",
      "word": "guichet",
      "phonetic": "/ɡi.ʃɛ/",
      "translations": {
        "en": "counter, ATM",
        "pa": "ਕਾਊਂਟਰ",
        "hi": "काउंटर",
        "zh": "柜台/取款机",
        "es": "ventanilla"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "Le guichet automatique est à l'intérieur de la succursale.",
        "Je retire de l'argent au guichet le vendredi."
      ],
      "confusion_pairs": [
        "distributeur",
        "comptoir"
      ],
      "fsrs_params": {
        "difficulty": 0.26,
        "stability": 4.0
      }
    },
    {
      "id": "vocab-qfn-10",
      "word": "transaction",
      "phonetic": "/tʁɑ̃.zak.sjɔ̃/",
      "translations": {
        "en": "transaction",
        "pa": "ਲੈਣ-ਦੇਣ",
        "hi": "लेन-देन",
        "zh": "交易",
        "es": "transacción"
      },
      "level": "seed",
      "category": "finance",
      "example_sentences": [
        "J'ai vu une transaction suspecte sur mon relevé.",
        "Chaque transaction apparaît dans mon application bancaire."
      ],
      "confusion_pairs": [
        "opération",
        "paiement"
      ],
      "fsrs_params": {
        "difficulty": 0.25,
        "stability": 3.9
      }
    },
    {
      "id": "vocab-qfn-11",
      "word": "virement",
      "phonetic": "/viʁ.mɑ̃/",
      "translations": {
        "en": "transfer (payment)",
        "pa": "ਟ੍ਰਾਂਸਫਰ",
        "hi": "ट्रांसफर",
        "zh": "转账",
        "es": "transferencia"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Je t'ai envoyé un virement Interac pour le souper.",
        "Le virement est arrivé en quelques minutes."
      ],
      "confusion_pairs": [
        "transfert",
        "dépôt"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 3.9
      }
    },
    {
      "id": "vocab-qfn-12",
      "word": "frais",
      "phonetic": "/fʁɛ/",
      "translations": {
        "en": "fees",
        "pa": "ਫੀਸ",
        "hi": "शुल्क",
        "zh": "费用",
        "es": "cargos"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Il y a des frais pour le transfert international.",
        "Vérifie les frais avant d'envoyer l'argent."
      ],
      "confusion_pairs": [
        "coût",
        "commission"
      ],
      "fsrs_params": {
        "difficulty": 0.31,
        "stability": 3.8
      }
    },
    {
      "id": "vocab-qfn-13",
      "word": "relevé",
      "phonetic": "/ʁəl.ve/",
      "translations": {
        "en": "statement",
        "pa": "ਸਟੇਟਮੈਂਟ",
        "hi": "विवरण पत्र",
        "zh": "对账单",
        "es": "estado de cuenta"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Mon relevé de carte de crédit arrive le 3 de chaque mois.",
        "J'ai vérifié mon relevé, tout est correct."
      ],
      "confusion_pairs": [
        "facture",
        "état de compte"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 3.7
      }
    },
    {
      "id": "vocab-qfn-14",
      "word": "paiement",
      "phonetic": "/pɛ.mɑ̃/",
      "translations": {
        "en": "payment",
        "pa": "ਭੁਗਤਾਨ",
        "hi": "भुगतान",
        "zh": "付款",
        "es": "pago"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "J'ai fait mon paiement de loyer par virement.",
        "Le paiement minimum est indiqué sur le relevé."
      ],
      "confusion_pairs": [
        "versement",
        "transaction"
      ],
      "fsrs_params": {
        "difficulty": 0.29,
        "stability": 3.7
      }
    },
    {
      "id": "vocab-qfn-15",
      "word": "facture",
      "phonetic": "/fak.tyʁ/",
      "translations": {
        "en": "bill, invoice",
        "pa": "ਬਿੱਲ",
        "hi": "बिल",
        "zh": "账单",
        "es": "factura"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "La facture d'Hydro-Québec arrive par courriel.",
        "J'ai réglé ma facture de téléphone hier."
      ],
      "confusion_pairs": [
        "relevé",
        "compte"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 3.6
      }
    },
    {
      "id": "vocab-qfn-16",
      "word": "prélèvement automatique",
      "phonetic": "/pʁe.lɛv.mɑ̃ ɔ.tɔ.ma.tik/",
      "translations": {
        "en": "pre-authorized debit",
        "pa": "ਆਟੋਮੈਟਿਕ ਕਟੌਤੀ",
        "hi": "स्वचालित कटौती",
        "zh": "自动扣款",
        "es": "débito automático"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Mon loyer se paie par prélèvement automatique.",
        "J'ai signé une autorisation pour le prélèvement automatique."
      ],
      "confusion_pairs": [
        "dépôt direct",
        "paiement récurrent"
      ],
      "fsrs_params": {
        "difficulty": 0.34,
        "stability": 3.5
      }
    },
    {
      "id": "vocab-qfn-17",
      "word": "carte de crédit",
      "phonetic": "/kaʁt də kʁe.di/",
      "translations": {
        "en": "credit card",
        "pa": "ਕ੍ਰੈਡਿਟ ਕਾਰਡ",
        "hi": "क्रेडिट कार्ड",
        "zh": "信用卡",
        "es": "tarjeta de crédito"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "J'utilise ma carte de crédit pour les achats en ligne.",
        "La carte de crédit a une limite de deux mille dollars."
      ],
      "confusion_pairs": [
        "carte de débit",
        "carte prépayée"
      ],
      "fsrs_params": {
        "difficulty": 0.33,
        "stability": 3.5
      }
    },
    {
      "id": "vocab-qfn-18",
      "word": "carte de débit",
      "phonetic": "/kaʁt də de.bi/",
      "translations": {
        "en": "debit card",
        "pa": "ਡੈਬਿਟ ਕਾਰਡ",
        "hi": "डेबिट कार्ड",
        "zh": "借记卡",
        "es": "tarjeta de débito"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Avec la carte de débit, l'argent sort directement de mon compte.",
        "Ma carte de débit fonctionne partout au Canada."
      ],
      "confusion_pairs": [
        "carte de crédit",
        "carte Interac"
      ],
      "fsrs_params": {
        "difficulty": 0.32,
        "stability": 3.4
      }
    },
    {
      "id": "vocab-qfn-19",
      "word": "dossier de crédit",
      "phonetic": "/dɔ.sje də kʁe.di/",
      "translations": {
        "en": "credit history",
        "pa": "ਕ੍ਰੈਡਿਟ ਇਤਿਹਾਸ",
        "hi": "क्रेडिट इतिहास",
        "zh": "信用记录",
        "es": "historial de crédito"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Un bon dossier de crédit aide à obtenir un prêt.",
        "Ma carte garantie m'aide à bâtir mon dossier de crédit."
      ],
      "confusion_pairs": [
        "cote de crédit",
        "historique"
      ],
      "fsrs_params": {
        "difficulty": 0.36,
        "stability": 3.3
      }
    },
    {
      "id": "vocab-qfn-20",
      "word": "compte chèques",
      "phonetic": "/kɔ̃t ʃɛk/",
      "translations": {
        "en": "chequing account",
        "pa": "ਚੈਕਿੰਗ ਖਾਤਾ",
        "hi": "चेकिंग खाता",
        "zh": "支票账户",
        "es": "cuenta corriente"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Mon salaire tombe dans mon compte chèques.",
        "Le compte chèques sert aux dépenses de tous les jours."
      ],
      "confusion_pairs": [
        "compte épargne",
        "compte bancaire"
      ],
      "fsrs_params": {
        "difficulty": 0.33,
        "stability": 3.3
      }
    },
    {
      "id": "vocab-qfn-21",
      "word": "compte épargne",
      "phonetic": "/kɔ̃t e.paʁɲ/",
      "translations": {
        "en": "savings account",
        "pa": "ਬੱਚਤ ਖਾਤਾ",
        "hi": "बचत खाता",
        "zh": "储蓄账户",
        "es": "cuenta de ahorros"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Je mets un peu d'argent dans mon compte épargne chaque mois.",
        "Le compte épargne sert à garder mes économies."
      ],
      "confusion_pairs": [
        "compte chèques",
        "CELI"
      ],
      "fsrs_params": {
        "difficulty": 0.35,
        "stability": 3.2
      }
    },
    {
      "id": "vocab-qfn-22",
      "word": "succursale",
      "phonetic": "/sy.kyʁ.sal/",
      "translations": {
        "en": "branch",
        "pa": "ਸ਼ਾਖਾ",
        "hi": "शाखा",
        "zh": "分行",
        "es": "sucursal"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "La succursale ouvre à neuf heures trente.",
        "Je dois aller à la succursale pour signer le formulaire."
      ],
      "confusion_pairs": [
        "banque",
        "agence"
      ],
      "fsrs_params": {
        "difficulty": 0.31,
        "stability": 3.3
      }
    },
    {
      "id": "vocab-qfn-23",
      "word": "dépôt direct",
      "phonetic": "/de.po di.ʁɛkt/",
      "translations": {
        "en": "direct deposit",
        "pa": "ਸਿੱਧੀ ਜਮ੍ਹਾਂ",
        "hi": "सीधा जमा",
        "zh": "直接存款",
        "es": "depósito directo"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "Mon employeur paie par dépôt direct.",
        "Le dépôt direct arrive aux deux semaines."
      ],
      "confusion_pairs": [
        "prélèvement automatique",
        "virement"
      ],
      "fsrs_params": {
        "difficulty": 0.34,
        "stability": 3.2
      }
    },
    {
      "id": "vocab-qfn-24",
      "word": "chèque",
      "phonetic": "/ʃɛk/",
      "translations": {
        "en": "cheque",
        "pa": "ਚੈੱਕ",
        "hi": "चेक",
        "zh": "支票",
        "es": "cheque"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "J'ai écrit un chèque pour le premier mois de loyer.",
        "Le chèque est au nom du propriétaire."
      ],
      "confusion_pairs": [
        "traite",
        "mandat"
      ],
      "fsrs_params": {
        "difficulty": 0.32,
        "stability": 3.1
      }
    },
    {
      "id": "vocab-qfn-25",
      "word": "fraude",
      "phonetic": "/fʁod/",
      "translations": {
        "en": "fraud",
        "pa": "ਧੋਖਾਧੜੀ",
        "hi": "धोखाधड़ी",
        "zh": "欺诈",
        "es": "fraude"
      },
      "level": "sprout",
      "category": "finance",
      "example_sentences": [
        "La banque m'a appelé pour une possible fraude.",
        "Signale tout achat suspect pour éviter la fraude."
      ],
      "confusion_pairs": [
        "vol",
        "arnaque"
      ],
      "fsrs_params": {
        "difficulty": 0.38,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-qfn-26",
      "word": "conseiller",
      "phonetic": "/kɔ̃.sɛ.je/",
      "translations": {
        "en": "advisor",
        "pa": "ਸਲਾਹਕਾਰ",
        "hi": "सलाहकार",
        "zh": "顾问",
        "es": "consejero"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Le conseiller m'a expliqué les options de compte.",
        "J'ai pris rendez-vous avec un conseiller à la banque."
      ],
      "confusion_pairs": [
        "caissier",
        "gestionnaire"
      ],
      "fsrs_params": {
        "difficulty": 0.4,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-qfn-27",
      "word": "limite",
      "phonetic": "/li.mit/",
      "translations": {
        "en": "limit",
        "pa": "ਸੀਮਾ",
        "hi": "सीमा",
        "zh": "限额",
        "es": "límite"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "La limite de virement Interac est de trois mille dollars par jour.",
        "Je peux augmenter la limite de ma carte en ligne."
      ],
      "confusion_pairs": [
        "plafond",
        "maximum"
      ],
      "fsrs_params": {
        "difficulty": 0.39,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-qfn-28",
      "word": "taux",
      "phonetic": "/to/",
      "translations": {
        "en": "rate",
        "pa": "ਦਰ",
        "hi": "दर",
        "zh": "利率",
        "es": "tasa"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Le taux d'intérêt du prêt est de huit pour cent.",
        "Compare les taux avant de choisir une carte."
      ],
      "confusion_pairs": [
        "intérêt",
        "pourcentage"
      ],
      "fsrs_params": {
        "difficulty": 0.42,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-qfn-29",
      "word": "hypothèque",
      "phonetic": "/i.pɔ.tɛk/",
      "translations": {
        "en": "mortgage",
        "pa": "ਗਿਰਵੀਨਾਮਾ",
        "hi": "गिरवी",
        "zh": "房贷",
        "es": "hipoteca"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Le remboursement de l'hypothèque est ma plus grosse mensualité.",
        "J'ai une hypothèque sur ma maison à Québec."
      ],
      "confusion_pairs": [
        "prêt",
        "marge de crédit"
      ],
      "fsrs_params": {
        "difficulty": 0.45,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qfn-30",
      "word": "marge de crédit",
      "phonetic": "/maʁʒ də kʁe.di/",
      "translations": {
        "en": "line of credit",
        "pa": "ਕ੍ਰੈਡਿਟ ਲਾਈਨ",
        "hi": "क्रेडिट लाइन",
        "zh": "信用额度",
        "es": "línea de crédito"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "La marge de crédit me permet d'emprunter jusqu'à un certain montant.",
        "J'ai utilisé une partie de ma marge de crédit."
      ],
      "confusion_pairs": [
        "prêt",
        "découvert"
      ],
      "fsrs_params": {
        "difficulty": 0.44,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qfn-31",
      "word": "prêt",
      "phonetic": "/pʁɛ/",
      "translations": {
        "en": "loan",
        "pa": "ਕਰਜ਼ਾ",
        "hi": "ऋण",
        "zh": "贷款",
        "es": "préstamo"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "J'ai fait une demande de prêt pour ma voiture.",
        "Le prêt se rembourse en mensualités fixes."
      ],
      "confusion_pairs": [
        "marge de crédit",
        "hypothèque"
      ],
      "fsrs_params": {
        "difficulty": 0.41,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-qfn-32",
      "word": "remboursement",
      "phonetic": "/ʁɑ̃.buʁ.sə.mɑ̃/",
      "translations": {
        "en": "repayment, refund",
        "pa": "ਵਾਪਸੀ",
        "hi": "वापसी",
        "zh": "还款/退款",
        "es": "reembolso"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Le remboursement du prêt commence le mois prochain.",
        "Le remboursement de l'impôt arrive au printemps."
      ],
      "confusion_pairs": [
        "paiement",
        "dédommagement"
      ],
      "fsrs_params": {
        "difficulty": 0.42,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qfn-33",
      "word": "mensualité",
      "phonetic": "/mɑ̃.sɥa.li.te/",
      "translations": {
        "en": "monthly payment",
        "pa": "ਮਹੀਨਾਵਾਰ ਕਿਸ਼ਤ",
        "hi": "मासिक किश्त",
        "zh": "月供",
        "es": "mensualidad"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Ma mensualité de prêt est de trois cent vingt dollars.",
        "La mensualité comprend le capital et les intérêts."
      ],
      "confusion_pairs": [
        "versement",
        "échéance"
      ],
      "fsrs_params": {
        "difficulty": 0.43,
        "stability": 2.7
      }
    },
    {
      "id": "vocab-qfn-34",
      "word": "cotisation",
      "phonetic": "/kɔ.ti.za.sjɔ̃/",
      "translations": {
        "en": "contribution",
        "pa": "ਯੋਗਦਾਨ",
        "hi": "अंशदान",
        "zh": "缴款额度",
        "es": "aportación"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Ma limite de cotisation au CELI est sur mon avis de cotisation.",
        "J'ai fait une cotisation à mon REER cette année."
      ],
      "confusion_pairs": [
        "contribution",
        "dépôt"
      ],
      "fsrs_params": {
        "difficulty": 0.44,
        "stability": 2.7
      }
    },
    {
      "id": "vocab-qfn-35",
      "word": "CELI",
      "phonetic": "/se.li/",
      "translations": {
        "en": "tax-free savings account (TFSA)",
        "pa": "ਸੀਈਐੱਲਆਈ",
        "hi": "सी.ई.एल.आई.",
        "zh": "免税储蓄账户",
        "es": "CELI"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Le CELI est un compte d'épargne libre d'impôt.",
        "J'ai déposé cinq mille dollars dans mon CELI."
      ],
      "confusion_pairs": [
        "REER",
        "compte épargne"
      ],
      "fsrs_params": {
        "difficulty": 0.45,
        "stability": 2.6
      }
    },
    {
      "id": "vocab-qfn-36",
      "word": "REER",
      "phonetic": "/ʁe.ɛʁ/",
      "translations": {
        "en": "registered retirement savings plan (RRSP)",
        "pa": "ਆਰ.ਈ.ਈ.ਆਰ.",
        "hi": "आर.ई.ई.आर.",
        "zh": "注册退休储蓄计划",
        "es": "REER"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Le REER permet de cotiser pour la retraite.",
        "La date limite pour cotiser à mon REER approche."
      ],
      "confusion_pairs": [
        "CELI",
        "régime de retraite"
      ],
      "fsrs_params": {
        "difficulty": 0.46,
        "stability": 2.6
      }
    },
    {
      "id": "vocab-qfn-37",
      "word": "impôt",
      "phonetic": "/ɛ̃.po/",
      "translations": {
        "en": "tax",
        "pa": "ਟੈਕਸ",
        "hi": "कर",
        "zh": "税",
        "es": "impuesto"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Une partie de ma paie va aux impôts.",
        "Je fais ma déclaration d'impôt chaque printemps."
      ],
      "confusion_pairs": [
        "taxe",
        "déclaration"
      ],
      "fsrs_params": {
        "difficulty": 0.42,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qfn-38",
      "word": "transfert",
      "phonetic": "/tʁɑ̃s.fɛʁ/",
      "translations": {
        "en": "transfer",
        "pa": "ਟ੍ਰਾਂਸਫਰ",
        "hi": "ट्रांसफर",
        "zh": "转账/汇款",
        "es": "transferencia"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Le transfert international prend quelques jours.",
        "J'ai fait un transfert à ma famille à l'étranger."
      ],
      "confusion_pairs": [
        "virement",
        "envoi"
      ],
      "fsrs_params": {
        "difficulty": 0.4,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-qfn-39",
      "word": "dette",
      "phonetic": "/dɛt/",
      "translations": {
        "en": "debt",
        "pa": "ਕਰਜ਼",
        "hi": "कर्ज़",
        "zh": "债务",
        "es": "deuda"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Je rembourse ma dette de carte de crédit petit à petit.",
        "Une dette trop élevée affecte la cote de crédit."
      ],
      "confusion_pairs": [
        "solde impayé",
        "emprunt"
      ],
      "fsrs_params": {
        "difficulty": 0.44,
        "stability": 2.7
      }
    },
    {
      "id": "vocab-qfn-40",
      "word": "cote de crédit",
      "phonetic": "/kɔt də kʁe.di/",
      "translations": {
        "en": "credit score",
        "pa": "ਕ੍ਰੈਡਿਟ ਸਕੋਰ",
        "hi": "क्रेडिट स्कोर",
        "zh": "信用评分",
        "es": "puntuación de crédito"
      },
      "level": "branch",
      "category": "finance",
      "example_sentences": [
        "Ma cote de crédit s'améliore quand je paie à temps.",
        "Le propriétaire a vérifié ma cote de crédit."
      ],
      "confusion_pairs": [
        "dossier de crédit",
        "pointage"
      ],
      "fsrs_params": {
        "difficulty": 0.47,
        "stability": 2.5
      }
    },
    {
      "id": "vocab-qfn-41",
      "word": "plafond",
      "phonetic": "/pla.fɔ̃/",
      "translations": {
        "en": "ceiling, cap",
        "pa": "ਉਪਰਲੀ ਹੱਦ",
        "hi": "ऊपरी सीमा",
        "zh": "上限",
        "es": "tope"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "Le plafond de cotisation au CELI augmente chaque année.",
        "J'ai atteint mon plafond, je ne peux pas cotiser plus."
      ],
      "confusion_pairs": [
        "limite",
        "maximum"
      ],
      "fsrs_params": {
        "difficulty": 0.5,
        "stability": 2.5
      }
    },
    {
      "id": "vocab-qfn-42",
      "word": "pénalité",
      "phonetic": "/pe.na.li.te/",
      "translations": {
        "en": "penalty",
        "pa": "ਜੁਰਮਾਨਾ",
        "hi": "जुर्माना",
        "zh": "罚款",
        "es": "penalización"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "Il y a une pénalité si je dépasse la limite de cotisation.",
        "Une pénalité s'ajoute quand le paiement est en retard."
      ],
      "confusion_pairs": [
        "amende",
        "frais"
      ],
      "fsrs_params": {
        "difficulty": 0.52,
        "stability": 2.4
      }
    },
    {
      "id": "vocab-qfn-43",
      "word": "garantie",
      "phonetic": "/ɡa.ʁɑ̃.ti/",
      "translations": {
        "en": "security, guarantee",
        "pa": "ਗਾਰੰਟੀ",
        "hi": "गारंटी",
        "zh": "保证金/担保",
        "es": "garantía"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "La carte de crédit garantie exige un dépôt de garantie.",
        "Le dépôt de garantie protège la banque."
      ],
      "confusion_pairs": [
        "caution",
        "assurance"
      ],
      "fsrs_params": {
        "difficulty": 0.51,
        "stability": 2.4
      }
    },
    {
      "id": "vocab-qfn-44",
      "word": "échéance",
      "phonetic": "/e.ʃe.ɑ̃s/",
      "translations": {
        "en": "due date, maturity",
        "pa": "ਨਿਯਤ ਤਾਰੀਖ",
        "hi": "नियत तिथि",
        "zh": "到期日",
        "es": "vencimiento"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "La date d'échéance du paiement est le 15 du mois.",
        "Payer avant l'échéance évite les intérêts."
      ],
      "confusion_pairs": [
        "date limite",
        "échéancier"
      ],
      "fsrs_params": {
        "difficulty": 0.53,
        "stability": 2.3
      }
    },
    {
      "id": "vocab-qfn-45",
      "word": "autorisation",
      "phonetic": "/o.tɔ.ʁi.za.sjɔ̃/",
      "translations": {
        "en": "authorization",
        "pa": "ਇਜਾਜ਼ਤ",
        "hi": "अनुमति",
        "zh": "授权",
        "es": "autorización"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "J'ai signé une autorisation de prélèvement automatique.",
        "L'autorisation indique le montant et la date du prélèvement."
      ],
      "confusion_pairs": [
        "consentement",
        "formulaire"
      ],
      "fsrs_params": {
        "difficulty": 0.52,
        "stability": 2.3
      }
    },
    {
      "id": "vocab-qfn-46",
      "word": "découvert",
      "phonetic": "/de.ku.vɛʁ/",
      "translations": {
        "en": "overdraft",
        "pa": "ਓਵਰਡਰਾਫਟ",
        "hi": "ओवरड्राफ्ट",
        "zh": "透支",
        "es": "descubierto"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "Je suis allé à découvert de deux cents dollars.",
        "Le découvert autorisé a un taux d'intérêt élevé."
      ],
      "confusion_pairs": [
        "marge de crédit",
        "solde négatif"
      ],
      "fsrs_params": {
        "difficulty": 0.54,
        "stability": 2.2
      }
    },
    {
      "id": "vocab-qfn-47",
      "word": "paiement minimum",
      "phonetic": "/pɛ.mɑ̃ mi.ni.mɔm/",
      "translations": {
        "en": "minimum payment",
        "pa": "ਘੱਟੋ-ਘੱਟ ਭੁਗਤਾਨ",
        "hi": "न्यूनतम भुगतान",
        "zh": "最低还款额",
        "es": "pago mínimo"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "Je paie plus que le paiement minimum chaque mois.",
        "Le paiement minimum est de vingt-cinq dollars."
      ],
      "confusion_pairs": [
        "solde dû",
        "paiement intégral"
      ],
      "fsrs_params": {
        "difficulty": 0.55,
        "stability": 2.2
      }
    },
    {
      "id": "vocab-qfn-48",
      "word": "déclaration",
      "phonetic": "/de.kla.ʁa.sjɔ̃/",
      "translations": {
        "en": "tax return",
        "pa": "ਟੈਕਸ ਰਿਟਰਨ",
        "hi": "कर रिटर्न",
        "zh": "报税",
        "es": "declaración"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "Ma déclaration de revenus se fait en ligne.",
        "J'ai besoin de mes relevés pour ma déclaration."
      ],
      "confusion_pairs": [
        "avis de cotisation",
        "formulaire"
      ],
      "fsrs_params": {
        "difficulty": 0.53,
        "stability": 2.3
      }
    },
    {
      "id": "vocab-qfn-49",
      "word": "intérêt composé",
      "phonetic": "/ɛ̃.te.ʁɛ kɔ̃.po.ze/",
      "translations": {
        "en": "compound interest",
        "pa": "ਚੱਕਰਵਿਧੀ ਵਿਆਜ",
        "hi": "चक्रवृद्धि ब्याज",
        "zh": "复利",
        "es": "interés compuesto"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "L'intérêt composé fait grandir l'épargne avec le temps.",
        "Avec l'intérêt composé, les intérêts produisent aussi des intérêts."
      ],
      "confusion_pairs": [
        "intérêt simple",
        "rendement"
      ],
      "fsrs_params": {
        "difficulty": 0.56,
        "stability": 2.1
      }
    },
    {
      "id": "vocab-qfn-50",
      "word": "rendement",
      "phonetic": "/ʁɑ̃d.mɑ̃/",
      "translations": {
        "en": "return (investment)",
        "pa": "ਵਾਪਸੀ (ਨਿਵੇਸ਼)",
        "hi": "प्रतिफल",
        "zh": "收益",
        "es": "rendimiento"
      },
      "level": "bloom",
      "category": "finance",
      "example_sentences": [
        "Le rendement de mon CELI est variable selon les placements.",
        "Le rendement passé ne garantit pas l'avenir."
      ],
      "confusion_pairs": [
        "gain",
        "profit"
      ],
      "fsrs_params": {
        "difficulty": 0.58,
        "stability": 2.0
      }
    }
  ]
}