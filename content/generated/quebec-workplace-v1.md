{
  "scenarios": [
    {
      "id": "qc-wp-premier-jour-presentation",
      "title": "Premier jour de travail et présentation aux collègues",
      "description": "C'est ton premier jour dans une PME de Montréal. La coordonnatrice RH te fait visiter le bureau et te présente à ton équipe, qui te tutoie d'emblée.",
      "category": "workplace",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Mélanie Fortin, coordonnatrice ressources humaines chez Novatech, une PME de Montréal. Tu vouvoies la nouvelle personne, tu es chaleureuse et tu utilises des expressions québécoises naturelles («c'est correct», «pas de trouble», «bienvenue à bord»). Fais le tour du bureau, présente les collègues (qui tutoient le nouvel employé), explique les formalités : contrat déjà signé, courriel professionnel, heure d'arrivée à huit heures trente, pause de quinze minutes le matin et l'après-midi, et la politique de télétravail deux jours par semaine après la période d'essai. Réponds aux questions sur le poste, l'équipe et la cafétéria. Termine en confirmant que la journée commence à huit heures trente le lendemain. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, bienvenue chez Novatech! Moi c'est Mélanie, coordonnatrice RH. Avez-vous bien dormi? Asseyez-vous, on va faire le tour du bureau ensemble.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant se présente avec son nom et son rôle",
        "L'apprenant répond au vouvoiement avec la RH et au tutoiement avec les collègues",
        "L'apprenant pose au moins une question sur le poste, l'équipe ou le bureau",
        "L'apprenant confirme une formalité (courriel, heure d'arrivée, pause)",
        "L'apprenant remercie et dit au revoir poliment"
      ],
      "vocabulary_targets": [
        "travail",
        "collègue",
        "équipe",
        "gestionnaire",
        "poste"
      ],
      "grammar_targets": [
        "se présenter avec je suis / je m'appelle",
        "questions avec est-ce que (Est-ce que je peux poser une question?)",
        "distinguer le tutoiement (collègues) du vouvoiement (gestionnaire)"
      ],
      "cultural_notes": "Au Québec, le tutoiement est très répandu en milieu de travail, même entre une personne et son gestionnaire, mais on commence souvent par le vouvoiement avec la RH ou en contexte formel. La poignée de main, un «bonjour» à chacun le matin et un «merci, bonne journée» en partant font partie de la politesse locale, tout comme les pauses-café et les 5 à 7 entre collègues.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-wp-questions-paie",
      "title": "Poser des questions sur la paie et les déductions",
      "description": "Ton premier bulletin de paie vient de tomber et les déductions te semblent compliquées. Appelle le service de la paie pour comprendre chaque ligne.",
      "category": "workplace",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Luc Bélanger, conseiller au service de la paie d'une grande épicerie de Québec. Tu vouvoies l'apprenant et tu expliques calmement, ligne par ligne. La paie est déposée aux deux semaines, le jeudi, par dépôt direct. Explique le bulletin : salaire brut en haut, puis les déductions (impôt fédéral, impôt du Québec, cotisation au RRQ, assurance emploi, RQAP), et le salaire net en bas. Rassure : la première paie peut tarder quelques jours à cause du premier traitement. Si l'apprenant remarque une erreur, dis-lui de faire une demande écrite au service de la paie avec son bulletin en pièce jointe. Offre de vérifier un chiffre précis ensemble. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Luc Bélanger, service de la paie. Vous avez des questions sur votre premier bulletin, c'est bien ça?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant demande ce que signifie au moins deux déductions",
        "L'apprenant pose une question sur la fréquence ou la date de la paie",
        "L'apprenant répète dans ses mots la différence entre brut et net",
        "L'apprenant sait quoi faire en cas d'erreur sur son bulletin",
        "L'apprenant remercie et termine l'appel poliment"
      ],
      "vocabulary_targets": [
        "paie",
        "bulletin de paie",
        "salaire net",
        "déduction",
        "formulaire",
        "cotisation"
      ],
      "grammar_targets": [
        "poser des questions avec combien / pourquoi / quand",
        "conditionnel de politesse (j'aimerais comprendre, pourriez-vous...)",
        "nombres et pourcentages (six pour cent, une fois et demie)"
      ],
      "cultural_notes": "Au Québec, la paie se fait généralement aux deux semaines par dépôt direct, et le bulletin de paie détaille des déductions propres à la province : impôt du Québec, cotisation au RRQ (régime de rentes), assurance emploi et RQAP (régime québécois d'assurance parentale). À la fin d'un emploi, l'employeur remet un relevé d'emploi servant à l'assurance emploi.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-wp-horaire-changement-quart",
      "title": "Demander un horaire ou un changement de quart",
      "description": "Tu dois échanger ton quart de soir contre un quart de jour pour des raisons familiales. Parles-en à ta superviseure et trouve une solution.",
      "category": "workplace",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Nathalie Gingras, superviseure dans une pharmacie de Laval. Tu vouvoies l'apprenant, tu es compréhensive mais tu rappelles les règles. Écoute la demande de changement de quart, puis propose des options réelles : le quart de jour de 9 h à 17 h est occupé cette semaine, mais un collègue aimerait échanger son jeudi de jour contre un soir; sinon, le quart de jour est libre à partir de lundi prochain. Rappelle les règles : les changements d'horaire se confirment par écrit au moins cinq jours d'avance, et les heures supplémentaires au-delà de quarante heures se paient une fois et demie. Vérifie que la solution convient à la vie familiale de l'apprenant et confirme le nouvel horaire par courriel. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Nathalie Gingras, superviseure. Vous vouliez me parler de votre horaire, c'est ça?",
      "expected_turns": 5,
      "success_criteria": [
        "L'apprenant explique clairement la raison du changement de quart",
        "L'apprenant pose des questions sur les options proposées",
        "L'apprenant choisit une solution et la confirme",
        "L'apprenant s'informe des règles (préavis, heures supplémentaires)",
        "L'apprenant remercie et convient de la confirmation écrite"
      ],
      "vocabulary_targets": [
        "horaire",
        "quart",
        "congé",
        "heures supplémentaires",
        "superviseur",
        "gestionnaire"
      ],
      "grammar_targets": [
        "futur proche pour les arrangements (je vais travailler de jour)",
        "demandes polies (serait-il possible de changer mon quart?)",
        "prépositions de temps (du lundi au vendredi, de 9 h à 17 h)"
      ],
      "cultural_notes": "Les horaires flexibles sont courants au Québec, mais la Loi sur les normes du travail encadre les changements : l'employeur doit généralement aviser par écrit, les heures supplémentaires se paient à une fois et demie au-delà de quarante heures par semaine, et certains jours fériés donnent droit à un congé payé. Les demandes se confirment souvent par courriel pour garder une trace.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-wp-pause-cafe-conversation",
      "title": "Pause-café et petite conversation avec un collègue",
      "description": "C'est l'heure de la pause et un collègue t'accoste près de la machine à café. Fais de la petite conversation pour apprendre à te connaître.",
      "category": "workplace",
      "mode": "casual",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Simon Girard, commis aux entrepôts, un collègue sympathique. Tu tutoies l'apprenant dès le départ avec des expressions bien de chez nous («correct», «pas pire», «ça va ben»). Fais de la petite conversation légère : demande depuis quand l'apprenant est dans l'équipe, ce qu'il pense du nouveau système de pointage, ce qu'il fait de beau la fin de semaine, et propose-lui un café. Réponds naturellement à ses questions sur l'équipe, les trucs du métier et le meilleur endroit pour manger près du bureau. Reste positif et garde des sujets neutres et professionnels. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Salut! Toi, c'est bien [prénom]? Moi c'est Simon. Tu viens de te joindre à l'équipe, hein? Ça va bien jusqu'à maintenant?",
      "expected_turns": 5,
      "success_criteria": [
        "L'apprenant se présente et répond naturellement au tutoiement",
        "L'apprenant pose au moins une question de petite conversation",
        "L'apprenant répond avec des formules naturelles (ça va bien, pas pire)",
        "L'apprenant accepte ou décline poliment l'offre de café",
        "L'apprenant termine la pause poliment (bonne journée, à tantôt)"
      ],
      "vocabulary_targets": [
        "pause",
        "collègue",
        "travail",
        "équipe",
        "tâche"
      ],
      "grammar_targets": [
        "questions informelles (tu fais quoi de beau? tu es ici depuis quand?)",
        "réponses courtes et naturelles (correct, pas pire, ça va ben)",
        "offres et propositions (tu veux un café? je t'en verse un?)"
      ],
      "cultural_notes": "La petite conversation à la machine à café fait partie de la vie de bureau québécoise : la météo, la fin de semaine et le sport sont des sujets sûrs, tandis que le salaire, la politique et la religion se gardent pour plus tard. Le tutoiement entre collègues est immédiat, et des expressions comme «pas pire» ou «c'est correct» sonnent parfaitement naturelles.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-wp-sante-securite-consignes",
      "title": "Comprendre les consignes de santé et sécurité au travail",
      "description": "Avant de commencer à travailler dans l'entrepôt, tu dois suivre la visite de santé et sécurité. Écoute le coordonnateur, pose tes questions et répète les consignes.",
      "category": "workplace",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Patrick Roy, coordonnateur santé et sécurité dans un entrepôt de distribution de la Rive-Sud. Tu vouvoies l'apprenant et tu es rigoureux mais patient. Fais la visite : sorties de secours, extincteurs, trousse de premiers soins, affichage des consignes et zone des chariots élévateurs. Explique les équipements de protection obligatoires (casque, gilet réfléchissant, chaussures à embout d'acier), la règle d'or de ne jamais travailler sans formation, et le droit de refuser un travail dangereux sans conséquence. Précise qu'il faut remplir un rapport d'incident même pour une petite coupure, et où se trouve le comité santé et sécurité. Invite l'apprenant à redire les trois consignes principales avant de terminer. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Patrick Roy, coordonnateur santé et sécurité. Avant qu'on commence, avez-vous déjà suivi une formation en santé et sécurité au Québec?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant identifie au moins deux équipements de protection obligatoires",
        "L'apprenant répète correctement au moins deux consignes de sécurité",
        "L'apprenant sait où se trouvent les sorties et la trousse de premiers soins",
        "L'apprenant pose une question sur le rapport d'incident ou le droit de refus",
        "L'apprenant confirme avoir compris les trois consignes principales"
      ],
      "vocabulary_targets": [
        "santé et sécurité",
        "équipement de protection",
        "consigne",
        "incident",
        "superviseur",
        "formation"
      ],
      "grammar_targets": [
        "impératif des consignes (portez, signalez, avisez)",
        "obligation avec devoir / il faut (il faut porter le casque)",
        "conditionnel hypothétique (si vous remarquez un danger, avisez votre superviseur)"
      ],
      "cultural_notes": "Au Québec, la santé et la sécurité au travail relèvent de la CNESST, qui exige une formation de base et l'affichage des règles dans chaque milieu. Les travailleurs ont le droit de refuser un travail dangereux sans représailles, et tout incident, même mineur, se déclare par écrit. Les formations SIMDUT sur les produits dangereux sont aussi courantes dans les entrepôts.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-wp-reference-ancien-gestionnaire",
      "title": "Demander une référence à un ancien gestionnaire",
      "description": "Tu as décroché une entrevue et le futur employeur demande des références. Téléphone à ton ancien gestionnaire pour lui demander la permission de le nommer.",
      "category": "workplace",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Éric Bouchard, ancien gestionnaire de l'apprenant dans une chaîne de restaurants. Vous avez gardé un bon contact. Tu vouvoies l'apprenant et tu es ouvert et encourageant. Écoute la demande, puis accepte avec plaisir : tu te souviens très bien de son travail et tu as toujours pu compter sur lui. Demande des détails pratiques : pour quel type de poste, qui va t'appeler (le nom du recruteur et son courriel), et si tu peux parler d'exemples concrets comme la gestion de la caisse et la formation des nouveaux. Rappelle que tu réponds mieux par courriel en semaine. Termine en encourageant l'apprenant pour son entrevue. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Allô? Éric Bouchard, bonjour!",
      "expected_turns": 5,
      "success_criteria": [
        "L'apprenant se rappelle à son ancien gestionnaire poliment",
        "L'apprenant demande la permission de l'utiliser comme référence",
        "L'apprenant explique le poste visé et le type d'emploi",
        "L'apprenant fournit les coordonnées du recruteur ou de l'employeur",
        "L'apprenant remercie chaleureusement et conclut poliment"
      ],
      "vocabulary_targets": [
        "référence",
        "ancien employeur",
        "gestionnaire",
        "courriel",
        "emploi"
      ],
      "grammar_targets": [
        "demandes polies (accepteriez-vous d'être ma référence?)",
        "explications avec parce que / puisque",
        "remercier et conclure (je vous remercie beaucoup, bonne journée)"
      ],
      "cultural_notes": "Au Québec, on demande toujours la permission avant de nommer quelqu'un comme référence, même à un ancien gestionnaire, et on fournit le contexte : le poste visé et le nom de la personne qui appellera. Une référence peut parler d'exemples concrets de rendement et de fiabilité; les recruteurs québécois la vérifient souvent avant de faire une offre.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-wp-invitation-equipe-repas",
      "title": "Répondre à une invitation d'équipe et proposer un plat",
      "description": "Ton équipe organise un repas-partage vendredi midi. Une collègue t'invite et chacun apporte un plat. Discute du menu et confirme ta présence.",
      "category": "workplace",
      "mode": "casual",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Julie Labrie, analyste comptable et ton collègue de bureau. Tu tutoies l'apprenant, tu es enjouée et tu utilises des expressions québécoises («c'est le fun», «correct», «ça me ferait plaisir»). Annonce le repas-partage de vendredi midi à la cafétéria : chacun apporte un plat à partager, l'équipe fournit les boissons et la vaisselle. Demande ce que l'apprenant aimerait apporter, propose qu'il présente un plat de son pays d'origine (tout le monde adore ça), et rappelle d'écrire dans le courriel d'équipe s'il y a des allergies — la fille des ventes est allergique aux arachides. Confirme la présence et le plat, puis parle brièvement du menu des autres collègues. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Hé! Content de te voir. Écoute, on organise un repas-partage vendredi midi à la cafétéria — chaque personne apporte un plat à partager. T'es partant?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant répond à l'invitation de façon naturelle",
        "L'apprenant propose un plat et explique ce que c'est",
        "L'apprenant pose une question sur l'organisation ou le menu",
        "L'apprenant confirme sa présence ou décline poliment",
        "L'apprenant tient compte des allergies mentionnées"
      ],
      "vocabulary_targets": [
        "équipe",
        "collègue",
        "pause",
        "travail",
        "courriel"
      ],
      "grammar_targets": [
        "accepter ou refuser poliment (avec plaisir, je serais là / je suis désolé, je ne peux pas)",
        "proposer (je peux apporter..., je vais faire...)",
        "futur simple ou proche pour le plan (j'apporterai, je vais apporter)"
      ],
      "cultural_notes": "Le repas-partage est une tradition courante des équipes québécoises : chacun apporte un plat et on se régale ensemble à la cafétéria. Les allergies alimentaires se prennent très au sérieux, on les mentionne dans le courriel d'équipe, et un plat du pays d'origine de la nouvelle personne est toujours bien accueilli.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-wp-entrevue-recruteur",
      "title": "Entretien téléphonique avec un recruteur québécois",
      "description": "La firme Talent Québec t'appelle pour un premier entretien téléphonique au sujet du poste de coordonnateur aux opérations. Réponds aux questions et pose les tiennes.",
      "category": "workplace",
      "mode": "immigration",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Maude Tremblay, recruteuse chez Talent Québec. Tu vouvoies l'apprenant, tu es professionnelle mais décontractée. Déroule un entretien téléphonique réaliste : confirme que c'est un bon moment, demande de te présenter brièvement, interroge sur l'expérience la plus récente, une force avec un exemple concret, et la raison de l'intérêt pour le poste. Réponds aux questions de l'apprenant sur le télétravail (deux jours par semaine), la rémunération (la fourchette de 55 000 à 65 000 $ se discute plus tard), et les prochaines étapes (une entrevue en personne la semaine prochaine). Termine en remerciant et en fixant le prochain contact. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Maude Tremblay de la firme Talent Québec. Je vous appelle au sujet de votre candidature pour le poste de coordonnateur aux opérations. C'est toujours un bon moment pour parler?",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant confirme le moment de l'appel poliment",
        "L'apprenant se présente de façon structurée et brève",
        "L'apprenant décrit son expérience avec un exemple concret",
        "L'apprenant pose au moins deux questions au recruteur",
        "L'apprenant remercie et confirme les prochaines étapes"
      ],
      "vocabulary_targets": [
        "entrevue",
        "recrutement",
        "rémunération",
        "poste",
        "contrat",
        "négociation"
      ],
      "grammar_targets": [
        "structurer la réponse avec d'abord, ensuite, finalement",
        "passé composé pour l'expérience (j'ai travaillé, j'ai géré...)",
        "poser des questions au recruteur (quelles sont les prochaines étapes?)"
      ],
      "cultural_notes": "L'entrevue au Québec ressemble à une conversation : on s'y présente brièvement, on donne des exemples concrets de réalisations, et on pose des questions sur le poste et les prochaines étapes. Le salaire peut être discuté ouvertement, la ponctualité est essentielle, et on envoie un courriel de remerciement après la rencontre.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-wp-avantages-sociaux-inscription",
      "title": "Choisir ses avantages sociaux pendant la semaine d'inscription",
      "description": "C'est ta semaine d'inscription aux avantages sociaux, une chance annuelle. Rencontre la conseillère RH, compare les options et fais tes choix avant vendredi.",
      "category": "workplace",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Sophie Leblanc, conseillère en ressources humaines dans une firme de génie-conseil. Tu vouvoies l'apprenant et tu expliques les options sans jargon. Présente la semaine d'inscription annuelle : l'assurance collective (médicaments, dentaire, vue), le régime de retraite avec cotisation de l'employeur, le REER collectif, l'assurance invalidité et l'assurance vie. Explique les points clés : l'assurance collective est obligatoire si l'employeur l'offre, et elle fonctionne avec le régime public d'assurance médicaments de la RAMQ; le coût dépend du choix (individuel ou familial). Réponds aux questions sur les primes, la franchise et le moment où la couverture commence, et rappelle que le formulaire se remplit en ligne avant vendredi. Termine en résumant les choix de l'apprenant. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Sophie Leblanc, ressources humaines. Bienvenue dans votre semaine d'inscription aux avantages sociaux! Avez-vous eu le temps de regarder la trousse qu'on vous a envoyée?",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant nomme au moins deux avantages offerts",
        "L'apprenant compare au moins deux options à voix haute",
        "L'apprenant pose des questions sur les coûts, la franchise ou la date limite",
        "L'apprenant confirme la date limite et le mode d'inscription",
        "L'apprenant fait ou reporte un choix avec une raison claire"
      ],
      "vocabulary_targets": [
        "avantages sociaux",
        "assurance collective",
        "régime de retraite",
        "cotisation",
        "salaire net",
        "prime"
      ],
      "grammar_targets": [
        "comparer les options (plus avantageux, moins cher, couvre plus)",
        "conditionnel (si je cotise davantage, mon employeur...?)",
        "questions de clarification (est-ce que ça inclut ma conjointe?)"
      ],
      "cultural_notes": "Au Québec, la semaine d'inscription aux avantages sociaux revient une fois par an et les décisions engagent pour l'année. L'assurance collective est obligatoire quand l'employeur l'offre — c'est le pendant privé du régime public d'assurance médicaments de la RAMQ — et plusieurs employeurs cotisent au régime de retraite et offrent un REER collectif. Prendre son temps et poser des questions avant la date limite fait partie des bons réflexes.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-wp-bilan-performance-objectifs",
      "title": "Bilan de performance de trois mois et discussion des objectifs",
      "description": "Trois mois après ton embauche, ton gestionnaire te convoque au bilan de performance. Discute de tes forces, de ta rétroaction et de tes objectifs pour la suite.",
      "category": "workplace",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es David Nguyen, gestionnaire d'équipe dans une entreprise de services financiers. Tu vouvoies l'apprenant, tu es direct mais bienveillant. Ouvre le bilan de trois mois : dans l'ensemble, très solide — intégration rapide, bonnes relations avec l'équipe, respect des délais. Donne une rétroaction précise : la qualité des rapports est excellente, mais la prise de parole en réunion reste timide. Invite l'apprenant à partager ses difficultés et ses souhaits, puis co-construisez deux objectifs concrets pour le prochain trimestre (participer à la rencontre hebdomadaire avec une idée, suivre une formation en perfectionnement). Mentionne que l'augmentation au mérite se discute à l'évaluation annuelle, pas maintenant, mais que la performance est suivie. Terminez en fixant une rencontre de suivi dans trois mois. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Merci de venir. On fait le point sur vos trois premiers mois — dans l'ensemble, très solide. On parle de ce qui va bien, de ce qu'on peut ajuster, et de vos objectifs pour la suite. Ça vous va?",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant reçoit la rétroaction et pose une question de précision",
        "L'apprenant partage honnêtement un défi ou un souhait",
        "L'apprenant propose ou accepte des objectifs concrets",
        "L'apprenant s'informe du perfectionnement ou du suivi",
        "L'apprenant remercie et confirme la prochaine rencontre"
      ],
      "vocabulary_targets": [
        "évaluation",
        "rendement",
        "objectif",
        "rétroaction",
        "perfectionnement",
        "délai"
      ],
      "grammar_targets": [
        "discours rapporté (vous m'avez dit que mes rapports sont solides)",
        "exprimer ses défis honnêtement (j'ai eu de la difficulté à...)",
        "formuler des objectifs (je souhaite développer..., mon objectif est de...)"
      ],
      "cultural_notes": "L'évaluation du rendement après trois mois est une pratique courante au Québec : la rétroaction y est directe mais bienveillante, et l'échange vise à fixer des objectifs précis et mesurables plutôt qu'à juger. Le perfectionnement est encouragé, souvent payé par l'employeur, et l'augmentation au mérite se discute généralement à l'évaluation annuelle.",
      "is_premium": true,
      "is_published": true
    }
  ],
  "vocabulary": [
    {
      "id": "vocab-qwp-01",
      "word": "travail",
      "phonetic": "/tʁa.vaj/",
      "translations": {"en": "work", "pa": "ਕੰਮ", "hi": "काम", "zh": "工作", "es": "trabajo"},
      "level": "seed",
      "category": "workplace",
      "example_sentences": ["J'adore mon nouveau travail, l'équipe est super accueillante.", "Le travail commence à huit heures trente le matin."],
      "confusion_pairs": ["boulot", "emploi"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.8}
    },
    {
      "id": "vocab-qwp-02",
      "word": "collègue",
      "phonetic": "/kɔ.lɛɡ/",
      "translations": {"en": "colleague", "pa": "ਸਾਥੀ", "hi": "सहकर्मी", "zh": "同事", "es": "colega"},
      "level": "seed",
      "category": "workplace",
      "example_sentences": ["Ma collègue m'a montré comment remplir le formulaire.", "Parle à un collègue du service de la paie pour cette question."],
      "confusion_pairs": ["confrère", "camarade de travail"],
      "fsrs_params": {"difficulty": 0.22, "stability": 4.6}
    },
    {
      "id": "vocab-qwp-03",
      "word": "patron",
      "phonetic": "/pa.tʁɔ̃/",
      "translations": {"en": "boss", "pa": "ਮਾਲਕ", "hi": "बॉस", "zh": "老板", "es": "jefe"},
      "level": "seed",
      "category": "workplace",
      "example_sentences": ["Mon patron m'a fixé un rendez-vous pour le bilan de trois mois.", "Le patron est en réunion jusqu'à quinze heures."],
      "confusion_pairs": ["gestionnaire", "propriétaire"],
      "fsrs_params": {"difficulty": 0.24, "stability": 4.4}
    },
    {
      "id": "vocab-qwp-04",
      "word": "salaire",
      "phonetic": "/sa.lɛʁ/",
      "translations": {"en": "salary", "pa": "ਤਨਖ਼ਾਹ", "hi": "वेतन", "zh": "工资", "es": "salario"},
      "level": "seed",
      "category": "workplace",
      "example_sentences": ["Le salaire est déposé directement dans mon compte.", "Ton salaire brut, c'est le montant avant les déductions."],
      "confusion_pairs": ["paie", "rémunération"],
      "fsrs_params": {"difficulty": 0.25, "stability": 4.3}
    },
    {
      "id": "vocab-qwp-05",
      "word": "pause",
      "phonetic": "/poz/",
      "translations": {"en": "break", "pa": "ਬ੍ਰੇਕ", "hi": "ब्रेक", "zh": "休息", "es": "descanso"},
      "level": "seed",
      "category": "workplace",
      "example_sentences": ["On prend une pause de quinze minutes à dix heures.", "Tu veux prendre un café pendant la pause?"],
      "confusion_pairs": ["période de repos", "arrêt"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.5}
    },
    {
      "id": "vocab-qwp-06",
      "word": "emploi",
      "phonetic": "/ɑ̃.plwa/",
      "translations": {"en": "job", "pa": "ਨੌਕਰੀ", "hi": "नौकरी", "zh": "工作职位", "es": "empleo"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Elle cherche un nouvel emploi dans le domaine de la comptabilité.", "J'ai signé le contrat pour mon nouvel emploi hier."],
      "confusion_pairs": ["travail", "poste"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-qwp-07",
      "word": "poste",
      "phonetic": "/pɔst/",
      "translations": {"en": "position (job)", "pa": "ਅਹੁਦਾ", "hi": "पद", "zh": "职位", "es": "puesto"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Le poste de coordonnateur est affiché sur le site de l'entreprise.", "Pour ce poste, on demande trois ans d'expérience."],
      "confusion_pairs": ["fonction", "bureau"],
      "fsrs_params": {"difficulty": 0.31, "stability": 3.9}
    },
    {
      "id": "vocab-qwp-08",
      "word": "équipe",
      "phonetic": "/e.kip/",
      "translations": {"en": "team", "pa": "ਟੀਮ", "hi": "टीम", "zh": "团队", "es": "equipo"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["L'équipe des ventes se réunit tous les lundis matin.", "Bienvenue dans l'équipe, on est contents de t'avoir!"],
      "confusion_pairs": ["département", "groupe"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.1}
    },
    {
      "id": "vocab-qwp-09",
      "word": "horaire",
      "phonetic": "/ɔ.ʁɛʁ/",
      "translations": {"en": "schedule", "pa": "ਸਮਾਂ-ਸਾਰਣੀ", "hi": "समय-सारणी", "zh": "时间表", "es": "horario"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Mon horaire varie d'une semaine à l'autre.", "On affiche l'horaire de la semaine le vendredi après-midi."],
      "confusion_pairs": ["emploi du temps", "cadence"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.8}
    },
    {
      "id": "vocab-qwp-10",
      "word": "quart",
      "phonetic": "/kaʁ/",
      "translations": {"en": "shift", "pa": "ਸ਼ਿਫ਼ਟ", "hi": "शिफ्ट", "zh": "班次", "es": "turno"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Je commence mon quart de soir à quinze heures.", "Elle a pris le quart de nuit pour les deux prochaines semaines."],
      "confusion_pairs": ["période", "équipe de nuit"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.9}
    },
    {
      "id": "vocab-qwp-11",
      "word": "congé",
      "phonetic": "/kɔ̃.ʒe/",
      "translations": {"en": "day off", "pa": "ਛੁੱਟੀ", "hi": "छुट्टी", "zh": "休假", "es": "día libre"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Je prends congé vendredi pour une visite chez le médecin.", "Il lui reste dix jours de congé à prendre cette année."],
      "confusion_pairs": ["vacances", "absence"],
      "fsrs_params": {"difficulty": 0.34, "stability": 3.7}
    },
    {
      "id": "vocab-qwp-12",
      "word": "paie",
      "phonetic": "/pɛ/",
      "translations": {"en": "pay (payroll)", "pa": "ਤਨਖ਼ਾਹ", "hi": "वेतन-भुगतान", "zh": "工资发放", "es": "pago"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["La paie est déposée aux deux semaines, le jeudi.", "Si tu as une question sur ta paie, parle au service de la paie."],
      "confusion_pairs": ["salaire", "dépôt direct"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-qwp-13",
      "word": "déduction",
      "phonetic": "/de.dyk.sjɔ̃/",
      "translations": {"en": "deduction", "pa": "ਕਟੌਤੀ", "hi": "कटौती", "zh": "扣款", "es": "deducción"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Les déductions incluent l'impôt et les cotisations.", "Regarde les déductions sur ton bulletin avant de poser des questions."],
      "confusion_pairs": ["retenue", "impôt"],
      "fsrs_params": {"difficulty": 0.35, "stability": 3.6}
    },
    {
      "id": "vocab-qwp-14",
      "word": "formulaire",
      "phonetic": "/fɔʁ.my.lɛʁ/",
      "translations": {"en": "form", "pa": "ਫਾਰਮ", "hi": "फॉर्म", "zh": "表格", "es": "formulario"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Remplis le formulaire d'inscription avant vendredi.", "Il faut signer le formulaire et le retourner au bureau."],
      "confusion_pairs": ["questionnaire", "demande"],
      "fsrs_params": {"difficulty": 0.31, "stability": 3.9}
    },
    {
      "id": "vocab-qwp-15",
      "word": "formation",
      "phonetic": "/fɔʁ.ma.sjɔ̃/",
      "translations": {"en": "training", "pa": "ਸਿਖਲਾਈ", "hi": "प्रशिक्षण", "zh": "培训", "es": "formación"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["La formation en santé et sécurité dure une demi-journée.", "Mon employeur offre une formation en français sur les heures de travail."],
      "confusion_pairs": ["perfectionnement", "atelier"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.8}
    },
    {
      "id": "vocab-qwp-16",
      "word": "entrevue",
      "phonetic": "/ɑ̃.tʁə.vy/",
      "translations": {"en": "interview", "pa": "ਇੰਟਰਵਿਊ", "hi": "इंटरव्यू", "zh": "面试", "es": "entrevista"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["J'ai une entrevue téléphonique jeudi après-midi.", "Prépare des exemples concrets avant ton entrevue."],
      "confusion_pairs": ["entretien", "discussion"],
      "fsrs_params": {"difficulty": 0.35, "stability": 3.6}
    },
    {
      "id": "vocab-qwp-17",
      "word": "contrat",
      "phonetic": "/kɔ̃.tʁa/",
      "translations": {"en": "contract", "pa": "ਇਕਰਾਰਨਾਮਾ", "hi": "अनुबंध", "zh": "合同", "es": "contrato"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Lis bien ton contrat avant de le signer.", "Le contrat précise le salaire et les vacances."],
      "confusion_pairs": ["entente", "lettre d'embauche"],
      "fsrs_params": {"difficulty": 0.36, "stability": 3.5}
    },
    {
      "id": "vocab-qwp-18",
      "word": "courriel",
      "phonetic": "/ku.ʁjɛl/",
      "translations": {"en": "email", "pa": "ਈਮੇਲ", "hi": "ईमेल", "zh": "电子邮件", "es": "correo electrónico"},
      "level": "sprout",
      "category": "workplace",
      "example_sentences": ["Envoie-moi un courriel pour confirmer ta disponibilité.", "Je réponds à mes courriels en début de journée."],
      "confusion_pairs": ["messagerie", "courrier"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-qwp-19",
      "word": "gestionnaire",
      "phonetic": "/ʒɛs.tjɔ.nɛʁ/",
      "translations": {"en": "manager", "pa": "ਪ੍ਰਬੰਧਕ", "hi": "प्रबंधक", "zh": "经理", "es": "gerente"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Mon gestionnaire m'a donné une bonne rétroaction cette semaine.", "La gestionnaire a accepté de discuter de mon horaire."],
      "confusion_pairs": ["chef d'équipe", "directeur"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-qwp-20",
      "word": "superviseur",
      "phonetic": "/sy.pɛʁ.vi.zœʁ/",
      "translations": {"en": "supervisor", "pa": "ਸੁਪਰਵਾਈਜ਼ਰ", "hi": "पर्यवेक्षक", "zh": "主管", "es": "supervisor"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Ton superviseur peut approuver tes heures supplémentaires.", "Signale tout incident à ton superviseur immédiatement."],
      "confusion_pairs": ["contremaître", "gestionnaire"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qwp-21",
      "word": "ressources humaines",
      "phonetic": "/ʁə.suʁs y.mɛn/",
      "translations": {"en": "human resources", "pa": "ਮਨੁੱਖੀ ਸਰੋਤ", "hi": "मानव संसाधन", "zh": "人力资源", "es": "recursos humanos"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Les ressources humaines gèrent l'inscription aux avantages sociaux.", "Pose ta question aux ressources humaines, c'est confidentiel."],
      "confusion_pairs": ["service de la paie", "direction"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-22",
      "word": "bulletin de paie",
      "phonetic": "/byl.tɛ̃ də pɛ/",
      "translations": {"en": "pay stub", "pa": "ਤਨਖ਼ਾਹ ਸਲਿੱਪ", "hi": "वेतन पर्ची", "zh": "工资单", "es": "talón de pago"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Le bulletin de paie montre le salaire brut, les déductions et le net.", "Vérifie ton bulletin de paie pour les heures supplémentaires."],
      "confusion_pairs": ["relevé d'emploi", "fiche de paie (France)"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-qwp-23",
      "word": "jour férié",
      "phonetic": "/ʒuʁ fe.ʁje/",
      "translations": {"en": "statutory holiday", "pa": "ਸਰਕਾਰੀ ਛੁੱਟੀ", "hi": "सार्वजनिक अवकाश", "zh": "法定假日", "es": "día festivo"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Le jour férié est payé même si tu ne travailles pas.", "La fête nationale du Québec, le 24 juin, est un jour férié."],
      "confusion_pairs": ["jour chômé", "congé"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qwp-24",
      "word": "heures supplémentaires",
      "phonetic": "/œʁ sy.ple.mɑ̃.tɛʁ/",
      "translations": {"en": "overtime", "pa": "ਓਵਰਟਾਈਮ", "hi": "ओवरटाइम", "zh": "加班", "es": "horas extra"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Les heures supplémentaires se paient une fois et demie.", "Il fait souvent des heures supplémentaires pendant la période des fêtes."],
      "confusion_pairs": ["temps supplémentaire", "heures travaillées"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-25",
      "word": "santé et sécurité",
      "phonetic": "/sɑ̃.te e se.ky.ʁi.te/",
      "translations": {"en": "health and safety", "pa": "ਸਿਹਤ ਅਤੇ ਸੁਰੱਖਿਆ", "hi": "स्वास्थ्य और सुरक्षा", "zh": "健康与安全", "es": "salud y seguridad"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["La formation en santé et sécurité est obligatoire au Québec.", "Les comités de santé et sécurité inspectent les lieux régulièrement."],
      "confusion_pairs": ["prévention", "premiers soins"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-26",
      "word": "équipement de protection",
      "phonetic": "/e.kip.mɑ̃ də pʁɔ.tɛk.sjɔ̃/",
      "translations": {"en": "protective equipment", "pa": "ਸੁਰੱਖਿਆ ਉਪਕਰਨ", "hi": "सुरक्षा उपकरण", "zh": "防护装备", "es": "equipo de protección"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Porte ton équipement de protection dans la zone de production.", "Les lunettes de sécurité font partie de l'équipement de protection."],
      "confusion_pairs": ["uniforme", "outillage"],
      "fsrs_params": {"difficulty": 0.49, "stability": 2.7}
    },
    {
      "id": "vocab-qwp-27",
      "word": "consigne",
      "phonetic": "/kɔ̃.siɲ/",
      "translations": {"en": "safety instruction", "pa": "ਹਿਦਾਇਤ", "hi": "निर्देश", "zh": "安全须知", "es": "consigna"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["La consigne est claire : jamais d'équipement sans formation.", "Suis les consignes affichées près de la sortie de secours."],
      "confusion_pairs": ["règle", "directive"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qwp-28",
      "word": "incident",
      "phonetic": "/ɛ̃.si.dɑ̃/",
      "translations": {"en": "incident", "pa": "ਘਟਨਾ", "hi": "घटना", "zh": "事故", "es": "incidente"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Tu dois remplir un rapport d'incident même pour une petite coupure.", "On a signalé un incident dans l'entrepôt ce matin."],
      "confusion_pairs": ["accident", "presqu'accident"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-29",
      "word": "référence",
      "phonetic": "/ʁe.fe.ʁɑ̃s/",
      "translations": {"en": "job reference", "pa": "ਹਵਾਲਾ (ਨੌਕਰੀ)", "hi": "संदर्भ (नौकरी)", "zh": "推荐人", "es": "referencia"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Elle m'a demandé deux références pour le nouveau poste.", "Demande la permission avant d'utiliser quelqu'un comme référence."],
      "confusion_pairs": ["recommandation", "certificat de travail"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.8}
    },
    {
      "id": "vocab-qwp-30",
      "word": "ancien employeur",
      "phonetic": "/ɑ̃.sjɛ̃ ɑ̃.plwa.jœʁ/",
      "translations": {"en": "former employer", "pa": "ਪੁਰਾਣਾ ਮਾਲਕ", "hi": "पूर्व नियोक्ता", "zh": "前雇主", "es": "ex empleador"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Mon ancien employeur peut confirmer mes dates de travail.", "J'ai gardé un bon contact avec mon ancien employeur."],
      "confusion_pairs": ["ex-patron", "référence"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-31",
      "word": "télétravail",
      "phonetic": "/te.le.tʁa.vaj/",
      "translations": {"en": "remote work", "pa": "ਰਿਮੋਟ ਕੰਮ", "hi": "दूरस्थ कार्य", "zh": "远程办公", "es": "teletrabajo"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Le télétravail est permis deux jours par semaine.", "Elle préfère le télétravail quand il y a une tempête de neige."],
      "confusion_pairs": ["travail hybride", "travail à distance"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-32",
      "word": "avantages sociaux",
      "phonetic": "/a.vɑ̃.taʒ sɔ.sjo/",
      "translations": {"en": "employee benefits", "pa": "ਲਾਭ (ਭੱਤੇ)", "hi": "लाभ (भत्ते)", "zh": "员工福利", "es": "beneficios"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Les avantages sociaux incluent la dentaire et la vue.", "Ton ancienneté peut influencer les avantages sociaux offerts."],
      "confusion_pairs": ["conditions de travail", "rémunération"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qwp-33",
      "word": "assurance collective",
      "phonetic": "/a.sy.ʁɑ̃s kɔ.lɛk.tiv/",
      "translations": {"en": "group insurance", "pa": "ਸਮੂਹ ਬੀਮਾ", "hi": "समूह बीमा", "zh": "团体保险", "es": "seguro colectivo"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["L'assurance collective couvre les médicaments d'ordonnance.", "L'inscription à l'assurance collective se fait pendant la semaine prévue."],
      "confusion_pairs": ["régime public RAMQ", "assurance individuelle"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.8}
    },
    {
      "id": "vocab-qwp-34",
      "word": "régime de retraite",
      "phonetic": "/ʁe.ʒim də ʁə.tʁɛt/",
      "translations": {"en": "pension plan", "pa": "ਰਿਟਾਇਰਮੈਂਟ ਯੋਜਨਾ", "hi": "पेंशन योजना", "zh": "退休金计划", "es": "plan de jubilación"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Le régime de retraite de l'entreprise comprend une cotisation de l'employeur.", "Tu peux cotiser au régime de retraite dès la première année."],
      "confusion_pairs": ["REER", "fonds de pension"],
      "fsrs_params": {"difficulty": 0.49, "stability": 2.7}
    },
    {
      "id": "vocab-qwp-35",
      "word": "perfectionnement",
      "phonetic": "/pɛʁ.fɛk.sjɔn.mɑ̃/",
      "translations": {"en": "professional development", "pa": "ਪੇਸ਼ਾਵਰ ਵਿਕਾਸ", "hi": "पेशेवर विकास", "zh": "专业发展", "es": "perfeccionamiento"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Le perfectionnement peut se faire sur les heures de travail.", "Elle suit un cours de perfectionnement en gestion de projet."],
      "confusion_pairs": ["formation", "avancement"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-36",
      "word": "rendement",
      "phonetic": "/ʁɑ̃.də.mɑ̃/",
      "translations": {"en": "performance", "pa": "ਪ੍ਰਦਰਸ਼ਨ", "hi": "प्रदर्शन", "zh": "绩效", "es": "rendimiento"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["L'évaluation du rendement a lieu chaque printemps.", "Son rendement s'est beaucoup amélioré ce trimestre."],
      "confusion_pairs": ["productivité", "efficacité"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.8}
    },
    {
      "id": "vocab-qwp-37",
      "word": "évaluation",
      "phonetic": "/e.va.lɥa.sjɔ̃/",
      "translations": {"en": "performance review", "pa": "ਮੁਲਾਂਕਣ", "hi": "मूल्यांकन", "zh": "绩效评估", "es": "evaluación"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["L'évaluation de trois mois fixe tes objectifs pour la suite.", "Prépare tes questions avant l'évaluation."],
      "confusion_pairs": ["bilan de performance", "rétroaction"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qwp-38",
      "word": "objectif",
      "phonetic": "/ɔb.ʒɛk.tif/",
      "translations": {"en": "goal", "pa": "ਟੀਚਾ", "hi": "लक्ष्य", "zh": "目标", "es": "objetivo"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Un bon objectif est précis et mesurable.", "Mon objectif est de terminer la formation avant juin."],
      "confusion_pairs": ["but", "cible"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-qwp-39",
      "word": "délai",
      "phonetic": "/de.lɛ/",
      "translations": {"en": "deadline", "pa": "ਸਮਾਂ-ਸੀਮਾ", "hi": "समय-सीमा", "zh": "截止日期", "es": "plazo"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Le délai pour s'inscrire aux avantages, c'est vendredi.", "Je dois respecter le délai pour la soumission."],
      "confusion_pairs": ["échéance", "retard"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-qwp-40",
      "word": "tâche",
      "phonetic": "/tɑʃ/",
      "translations": {"en": "task", "pa": "ਕੰਮ", "hi": "कार्य", "zh": "任务", "es": "tarea"},
      "level": "branch",
      "category": "workplace",
      "example_sentences": ["Ta première tâche, c'est de vérifier la liste des clients.", "On se partage les tâches selon nos forces."],
      "confusion_pairs": ["responsabilité", "projet"],
      "fsrs_params": {"difficulty": 0.43, "stability": 3.2}
    },
    {
      "id": "vocab-qwp-41",
      "word": "rémunération",
      "phonetic": "/ʁe.my.ne.ʁa.sjɔ̃/",
      "translations": {"en": "compensation", "pa": "ਮੁਆਵਜ਼ਾ", "hi": "पारिश्रमिक", "zh": "薪酬", "es": "remuneración"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["La rémunération comprend le salaire et les avantages sociaux.", "Discute de la rémunération avec les ressources humaines."],
      "confusion_pairs": ["salaire", "compensation totale"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-qwp-42",
      "word": "négociation",
      "phonetic": "/ne.ɡɔ.sja.sjɔ̃/",
      "translations": {"en": "negotiation", "pa": "ਗੱਲਬਾਤ", "hi": "बातचीत", "zh": "谈判", "es": "negociación"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["La négociation du salaire se fait après l'offre d'emploi.", "Une bonne négociation commence par une recherche de marché."],
      "confusion_pairs": ["discussion", "marchandage"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-qwp-43",
      "word": "salaire net",
      "phonetic": "/sa.lɛʁ nɛt/",
      "translations": {"en": "net pay", "pa": "ਸ਼ੁੱਧ ਤਨਖ਼ਾਹ", "hi": "शुद्ध वेतन", "zh": "税后工资", "es": "salario neto"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["Le salaire net, c'est ce qui reste après les déductions.", "Calcule ton salaire net avant de faire ton budget."],
      "confusion_pairs": ["salaire brut", "montant net"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    },
    {
      "id": "vocab-qwp-44",
      "word": "prime",
      "phonetic": "/pʁim/",
      "translations": {"en": "bonus", "pa": "ਬੋਨਸ", "hi": "बोनस", "zh": "奖金", "es": "bono"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["Une prime de fin d'année peut s'ajouter au salaire.", "La prime de quart de nuit est indiquée sur le bulletin."],
      "confusion_pairs": ["boni (Canada)", "commission"],
      "fsrs_params": {"difficulty": 0.57, "stability": 2.2}
    },
    {
      "id": "vocab-qwp-45",
      "word": "cotisation",
      "phonetic": "/kɔ.ti.za.sjɔ̃/",
      "translations": {"en": "contribution", "pa": "ਯੋਗਦਾਨ", "hi": "योगदान", "zh": "缴款", "es": "cotización"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["Les cotisations au régime de retraite sont déduites à chaque paie.", "La cotisation au RQAP apparaît sur ton bulletin de paie."],
      "confusion_pairs": ["contribution", "impôt"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-qwp-46",
      "word": "ancienneté",
      "phonetic": "/ɑ̃.sjɛn.te/",
      "translations": {"en": "seniority", "pa": "ਸੀਨੀਆਰਿਟੀ", "hi": "वरिष्ठता", "zh": "工龄", "es": "antigüedad"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["L'ancienneté détermine l'ordre des vacances dans l'équipe.", "Avec trois ans d'ancienneté, tu as droit à plus de vacances."],
      "confusion_pairs": ["expérience", "séniorité (anglicisme)"],
      "fsrs_params": {"difficulty": 0.61, "stability": 1.9}
    },
    {
      "id": "vocab-qwp-47",
      "word": "préavis",
      "phonetic": "/pʁe.a.vi/",
      "translations": {"en": "notice period", "pa": "ਨੋਟਿਸ ਅਵਧੀ", "hi": "नोटिस अवधि", "zh": "通知期", "es": "preaviso"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["Donne un préavis de deux semaines si tu quittes ton emploi.", "Le préavis de changement d'horaire est de cinq jours."],
      "confusion_pairs": ["avis", "préavis de démission"],
      "fsrs_params": {"difficulty": 0.62, "stability": 1.9}
    },
    {
      "id": "vocab-qwp-48",
      "word": "rétroaction",
      "phonetic": "/ʁe.tʁo.ak.sjɔ̃/",
      "translations": {"en": "feedback", "pa": "ਸੁਝਾਅ", "hi": "प्रतिक्रिया", "zh": "反馈", "es": "retroalimentación"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["La rétroaction de mon gestionnaire m'a aidé à m'améliorer.", "On donne de la rétroaction chaque mois, pas seulement à l'évaluation."],
      "confusion_pairs": ["commentaires", "évaluation"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    },
    {
      "id": "vocab-qwp-49",
      "word": "mentorat",
      "phonetic": "/mɑ̃.tɔ.ʁa/",
      "translations": {"en": "mentorship", "pa": "ਮੈਂਟਰਸ਼ਿਪ", "hi": "मार्गदर्शन", "zh": "导师制", "es": "mentoría"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["L'entreprise propose un programme de mentorat pour les nouveaux.", "Mon mentorat m'aide à comprendre la culture du bureau."],
      "confusion_pairs": ["encadrement", "parrainage"],
      "fsrs_params": {"difficulty": 0.61, "stability": 1.9}
    },
    {
      "id": "vocab-qwp-50",
      "word": "recrutement",
      "phonetic": "/ʁə.kʁyt.mɑ̃/",
      "translations": {"en": "recruiting", "pa": "ਭਰਤੀ", "hi": "भर्ती", "zh": "招聘", "es": "reclutamiento"},
      "level": "bloom",
      "category": "workplace",
      "example_sentences": ["La firme de recrutement m'a contacté pour une entrevue.", "Le processus de recrutement prend environ trois semaines."],
      "confusion_pairs": ["embauche", "sélection"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    }
  ]
}
