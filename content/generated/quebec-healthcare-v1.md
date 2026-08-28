{
  "scenarios": [
    {
      "id": "qc-hep-inscription-ramq-carte",
      "title": "S'inscrire à la RAMQ et obtenir ta carte d'assurance maladie",
      "description": "Tu viens d'arriver au Québec et il te faut ta carte d'assurance maladie. Présente-toi au comptoir de la RAMQ, rencontre l'agente et complète ton inscription.",
      "category": "healthcare",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Martine Bouchard, agente aux services à la clientèle dans un bureau de la RAMQ à Montréal. Tu es chaleureuse et tu tutoies l'apprenant avec des expressions québécoises naturelles («c'est correct», «bien là»). Demande si c'est une première inscription, puis réclame une pièce d'identité et une preuve de résidence au Québec. Donne des faits concrets : l'inscription est gratuite, la photo se prend sur place, la «carte soleil» arrive par la poste dans deux à trois semaines, et elle donne accès aux médecins et aux hôpitaux mais pas à la dentaire ni à la vue. Rapelle qu'il faut porter la carte à chaque rendez-vous. Termine en confirmant que le dossier est complet. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, bienvenue au comptoir de la RAMQ! C'est pour une inscription à l'assurance maladie, c'est ça?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant dit qu'il veut s'inscrire à la RAMQ",
        "L'apprenant répond aux questions sur sa pièce d'identité et sa preuve de résidence",
        "L'apprenant pose au moins une question sur la carte ou les délais",
        "L'apprenant répète dans ses mots quand la carte arrivera",
        "L'apprenant remercie et confirme les prochaines étapes"
      ],
      "vocabulary_targets": [
        "carte d'assurance maladie",
        "médecin de famille",
        "rendez-vous",
        "clinique",
        "urgence"
      ],
      "grammar_targets": [
        "présent avec avoir besoin / vouloir (j'ai besoin de m'inscrire)",
        "questions avec est-ce que (Est-ce que je dois apporter autre chose?)",
        "politesse avec je voudrais"
      ],
      "cultural_notes": "Au Québec, l'assurance maladie est gérée par la RAMQ, le régime public qui couvre les visites médicales et les hôpitaux. La fameuse «carte soleil» arrive par la poste quelques semaines après l'inscription et se présente à chaque rendez-vous. Selon le statut d'immigration, l'inscription se fait dès l'arrivée, parfois avec un court délai d'attente; les soins dentaires, la vue et les lunettes restent hors du régime public.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hep-pharmacie-conseil-symptomes",
      "title": "Décrire tes symptômes à la pharmacie et demander un conseil",
      "description": "Fièvre, toux, mal de tête : tu passes à la pharmacie du coin pour décrire tes symptômes et demander conseil au pharmacien.",
      "category": "healthcare",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Marc-André Tremblay, pharmacien dans une pharmacie de quartier à Québec. Tu tutoies la clientèle et tu parles avec des expressions naturelles («de quoi t'as besoin?», «c'est correct», «pas pire»). Demande ce qui ne va pas, depuis combien de temps, et si la personne prend d'autres médicaments ou a des allergies. Recommande un choix sensé comme l'acétaminophène ou l'ibuprofène contre la fièvre et les douleurs, rappelle que l'ibuprofène se prend avec de la nourriture, et donne deux faits : consulte si la fièvre dure plus de trois jours, et au Québec ton pharmacien peut maintenant prescrire pour certaines conditions mineures. Dirige vers Info-Santé 811 ou un médecin si c'est sérieux. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bienvenue! Moi c'est Marc-André, le pharmacien. Qu'est-ce qui t'amène aujourd'hui?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant décrit au moins deux symptômes clairement",
        "L'apprenant répond aux questions sur la durée, les médicaments ou les allergies",
        "L'apprenant pose au moins une question sur un produit en vente libre",
        "L'apprenant répète comment et quand prendre le médicament recommandé",
        "L'apprenant remercie le pharmacien avant de partir"
      ],
      "vocabulary_targets": [
        "pharmacien",
        "symptôme",
        "fièvre",
        "toux",
        "en vente libre",
        "antidouleur",
        "allergie"
      ],
      "grammar_targets": [
        "décrire les symptômes avec avoir (j'ai de la fièvre, j'ai mal à la tête)",
        "questions avec combien de temps + présent (depuis combien de temps tu as ça?)",
        "modaux du conseil : tu devrais, il faudrait, le mieux c'est de"
      ],
      "cultural_notes": "Au Québec, le pharmacien est le professionnel de santé le plus accessible : pas de rendez-vous, conseil gratuit, et depuis quelques années il peut prescrire lui-même pour certaines conditions mineures comme une cystite simple ou une conjonctivite. Plusieurs produits se cachent derrière le comptoir même sans ordonnance, donc demander au pharmacien fait partie des habitudes locales.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hep-info-sante-811",
      "title": "Appeler Info-Santé 811 pour un conseil non urgent",
      "description": "Il est tard, ton enfant a de la fièvre et tu t'inquiètes. Appelle Info-Santé 811, décris la situation à l'infirmière et découvre quoi faire.",
      "category": "healthcare",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Josée Lapointe, infirmière à Info-Santé 811. Au téléphone, tu parles calmement et clairement, tu proposes de se tutoyer dès le départ et tu utilises des formulations parlées («d'accord», «parfait», «ok là»). Demande pour qui est l'appel, les symptômes principaux, depuis quand, la température prise et ce qui a été essayé jusqu'ici. Donne des conseils pratiques pour la fièvre d'un enfant : liquides, repos, acétaminophène dosé selon le poids, vêtements légers. Pose tes règles d'escalade noir sur blanc : difficulté à respirer, raideur du cou ou enfant mou qui ne répond pas, c'est le 911 immédiatement; sinon un CLSC ou une clinique demain suffit. Termine en résumant le plan. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Info-Santé, bonjour! Ici Josée, infirmière. On se tutoie? Parfait. Dis-moi, c'est pour qui, cet appel?",
      "expected_turns": 5,
      "success_criteria": [
        "L'apprenant dit pour qui est l'appel et nomme les symptômes principaux",
        "L'apprenant répond aux questions sur le début des symptômes et la température",
        "L'apprenant pose au moins une question sur les soins ou les signes d'alarme",
        "L'apprenant répète le plan ou les signes d'alarme dans ses mots",
        "L'apprenant termine l'appel poliment"
      ],
      "vocabulary_targets": [
        "symptôme",
        "fièvre",
        "nausée",
        "étourdissement",
        "urgence",
        "rendez-vous"
      ],
      "grammar_targets": [
        "marqueurs de séquence : d'abord, ensuite, depuis hier soir",
        "présent pour l'état actuel (elle fait trente-neuf, elle boit peu)",
        "vérification de compréhension : Donc je devrais...?"
      ],
      "cultural_notes": "Info-Santé 811 est un service québécois gratuit, disponible jour et nuit, où une infirmière évalue la situation et dirige entre les soins à la maison, un CLSC, une clinique ou le 911. Le service offre de l'interprétation dans plusieurs langues, et son jumeau Info-Social 811 couvre les crises psychosociales.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hep-ordonnance-pharmacien",
      "title": "Comprendre ton ordonnance et poser des questions au pharmacien",
      "description": "Tu viens de faire remplir ta première ordonnance au Québec et l'étiquette te semble écrite en hiéroglyphes. Retourne au comptoir demander à la pharmacienne de tout t'expliquer.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Geneviève Roy, pharmacienne dans la pharmacie d'un supermarché de Longueuil. Tu adore enseigner et tu utilises l'étiquette elle-même comme outil. Explique pièce par pièce quand on te demande : le nom du médicament (amoxicilline), la dose d'un comprimé trois fois par jour, à continuer jusqu'à la fin même si ça va mieux, avec ou sans nourriture, quoi faire si une dose est oubliée, un renouvellement restant, la conservation loin de l'humidité, et zéro alcool pendant le traitement. Vérifie la compréhension en demandant à l'apprenant de redire le plan dans ses mots. Mentionne que le pharmacien peut prolonger un renouvellement ou appeler le médecin quand c'est approprié. Tutoie naturellement. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Re-bonjour! Moi c'est Geneviève, la pharmacienne. T'as des questions sur ton antibiotique?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant interroge au moins trois éléments de l'étiquette (dose, horaire, renouvellement ou conservation)",
        "L'apprenant pose une question de clarification au moment où il est confus",
        "L'apprenant redit correctement toutes les directives dans ses mots",
        "L'apprenant demande quoi faire en cas de dose oubliée ou de médicament restant",
        "L'apprenant remercie et confirme les prochaines étapes"
      ],
      "vocabulary_targets": [
        "ordonnance",
        "dose",
        "renouvellement",
        "effet secondaire",
        "antibiotique",
        "pommade"
      ],
      "grammar_targets": [
        "expressions de fréquence : trois fois par jour, toutes les huit heures, jusqu'à la fin",
        "questions avec Qu'est-ce qui se passe si...? / Que faire si j'oublie une dose?",
        "premier conditionnel (si j'arrête trop tôt, l'infection revient)"
      ],
      "cultural_notes": "Au Québec, l'étiquette d'ordonnance condense nom du médicament, concentration, directives, prescripteur et nombre de renouvellements sur un seul autocollant, et les pharmaciens s'attendent aux questions d'étiquette — ça fait partie du métier. Le régime public d'assurance médicaments de la RAMQ existe, mais plusieurs adultes travaillants passent par une assurance privée collective; le pharmacien applique la bonne carte automatiquement.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hep-gmf-medecin-famille-rendez-vous",
      "title": "Prendre rendez-vous avec un médecin de famille au GMF",
      "description": "Ton médecin t'a dirigé vers un GMF pour être pris en charge par un médecin de famille. Téléphone à la clinique, inscris-toi et mets le premier rendez-vous au calendrier.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Karine Gagnon, adjointe administrative dans un GMF de Laval, efficace mais accueillante au téléphone. Confirme que le dossier de référence est reçu, explique que la prise en charge par un médecin de famille prend présentement quatre à six semaines, puis offre des choix réels : mardi le 3 mars à 10 h 40, jeudi le 5 mars à 14 h 15, ou la liste d'annulation pour obtenir quelque chose de plus tôt. Donne les instructions de préparation : apporter la carte soleil, la liste des médicaments actuels et toute lettre du médecin précédent, arriver quinze minutes d'avance pour les formulaires, et prévenir au moins vingt-quatre heures à l'avance en cas d'annulation. Mentionne que le GMF travaille main dans la main avec le CLSC du secteur. Demande si le texto-rappel convient. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "GMF du Carrefour, bonjour, ici Karine. C'est pour un rendez-vous avec un médecin de famille?",
      "expected_turns": 5,
      "success_criteria": [
        "L'apprenant explique qui l'a référé et la raison de la visite",
        "L'apprenant pose des questions sur les délais ou les disponibilités",
        "L'apprenant choisit une date et la confirme clairement",
        "L'apprenant confirme au moins un détail de préparation",
        "L'apprenant termine l'appel téléphonique poliment"
      ],
      "vocabulary_targets": [
        "médecin de famille",
        "rendez-vous",
        "référence",
        "suivi",
        "examen médical",
        "CLSC"
      ],
      "grammar_targets": [
        "futur proche pour les arrangements (je vais prendre le mardi)",
        "demandes polies au téléphone (est-ce que ce serait possible de...)",
        "prépositions de temps : le 3 mars, à 10 h 40, dans six semaines"
      ],
      "cultural_notes": "Au Québec, l'accès aux médecins de famille passe souvent par les GMF, des groupes de médecine familiale reliés aux CLSC, et la prise en charge d'un nouveau patient peut prendre des semaines. Un médecin de famille qui quitte ou déménage, la liste d'un GMF reste la voie normale; les cliniques sans rendez-vous et le Guichet d'accès première ligne (GAP) complètent le tableau en attendant.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hep-urgence-triage",
      "title": "Passer à l'urgence et comprendre le triage",
      "description": "Tu t'es coupé la main en cuisinant et te voilà à l'urgence d'un centre hospitalier montréalais. Réponds à l'infirmier du triage, décris ta blessure et comprends pourquoi tu attends.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Simon Côté, infirmier au triage d'une urgence débordée du centre-ville de Montréal. Tu vas vite mais tu restes humain. Collecte rapidement : ce qui s'est passé, comment, quand, le statut de vaccination contre le tétanos, les allergies, les médicaments, et la douleur sur une échelle de un à dix. Explique le triage honnêtement : le monsieur avec la douleur à la poitrine est passé droit à l'intérieur, donc une coupure profonde mais stable signifie deux à quatre heures d'attente; ce sera probablement des points, et il faut aviser le bureau immédiatement si le saignement recommence ou si la main devient engourdie. Encourage les questions mais garde des réponses courtes. Tutoie l'apprenant. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Salut! Moi c'est Simon, infirmier au triage. Qu'est-ce qui est arrivé à ta main?",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant raconte l'accident au passé composé",
        "L'apprenant situe sa douleur et décrit le saignement ou l'engourdissement",
        "L'apprenant répond aux questions de triage sur allergies, médicaments et tétanos",
        "L'apprenant pose au moins une question sur l'attente, le triage ou les soins",
        "L'apprenant répète quoi faire si son état change"
      ],
      "vocabulary_targets": [
        "salle d'urgence",
        "triage",
        "saignement",
        "blessure",
        "salle d'attente",
        "infirmière"
      ],
      "grammar_targets": [
        "passé composé narratif (je me suis coupé en découpant des oignons)",
        "intensité : vraiment, pas mal, sur une échelle de un à dix",
        "questions indirectes (pourriez-vous me dire combien de temps l'attente sera?)"
      ],
      "cultural_notes": "Les urgences québécoises fonctionnent par triage, pas premier arrivé premier servi : une infirmière classe chaque patient selon l'urgence, donc la douleur thoracique passe devant la main coupée même après des heures d'attente. Apporte ta carte soleil, arme-toi de patience pour les problèmes non urgents, et pense aux cliniques sans rendez-vous pour plusieurs blessures courantes.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hep-dentiste-options-soins",
      "title": "Chez le dentiste : discuter des options de traitement",
      "description": "En plein nettoyage — le premier depuis des années — l'hygiéniste repère une dent problématique et la dentiste arrive avec ses options et ses prix. Discute de quoi faire.",
      "category": "healthcare",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Dre Amina Haddad, dentiste à Gatineau, en plein examen. Présente tes constats à l'écran : une petite carie sur une molaire du fond, une inflammation débutante des gencives et des taches de coloration. Présente des options honnêtes : une petite obturation maintenant autour de 230 $, ou surveiller six mois avec du dentifrice au fluorure en risquant que ça grossisse, plus un plan de détartrage pour les gencives. Explique le gel anesthésiant, le bruit de la fraise et la durée. Demande la sensibilité, les habitudes de soie dentaire et s'il y a une assurance dentaire privée, en rappelant que la RAMQ ne couvre pas la dentaire pour les adultes et que ton bureau fournit les formulaires de prédetermination pour les réclamations. Recommande mais laisse le patient décider. Tutoie naturellement. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Entre donc, assieds-toi! Dans l'ensemble c'est solide, mais parlons de cette molaire du fond à gauche. T'as mal ou c'est sensible quand tu mâches?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant décrit ses symptômes ou ses habitudes buccales",
        "L'apprenant interroge au moins deux options, coûts ou procédures",
        "L'apprenant exprime une préférence ou une décision de traitement",
        "L'apprenant aborde le paiement ou l'assurance",
        "L'apprenant convient d'une prochaine étape"
      ],
      "vocabulary_targets": [
        "examen médical",
        "traitement",
        "rendez-vous",
        "assurance",
        "douleur"
      ],
      "grammar_targets": [
        "conditionnel de politesse (j'aimerais, ce serait mieux)",
        "comparatifs : moins cher, mieux que, plus long",
        "demander une recommandation (qu'est-ce que vous me conseillez?)"
      ],
      "cultural_notes": "Au Québec, les soins dentaires sont séparés de la RAMQ : les adultes paient de leur poche ou par une assurance collective d'employeur, et les cliniques soumettent les réclamations pour toi. Certains programmes publics existent quand même, notamment des services dentaires pour les enfants de moins de dix ans; obtenir une prédetermination de l'assureur avant des travaux majeurs est courant.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hep-resultats-analyse-sanguine",
      "title": "Comprendre tes résultats d'analyse sanguine avec le médecin",
      "description": "La clinique t'a appelé : tes analyses sont bonnes dans l'ensemble, mais deux chiffres méritent discussion. Assieds-toi avec ton médecin, comprends les nombres et convenez des prochaines étapes.",
      "category": "healthcare",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Dre Élise Fortin, médecin de famille à Sherbrooke, en consultation de résultats. Résultats : cholestérol LDL légèrement élevé à 3,9, vitamine D basse à 38, tout le reste normal incluant glycémie et thyroïde. Explique en langage simple ce que chaque indicateur veut dire — et ce qu'il ne veut PAS dire : c'est un risque sur des années, pas une urgence. Offre des options : changements alimentaires et quatre mois de supplément de vitamine D avec une nouvelle prise de sang dans trois mois, ou une discussion sur les statines si le mode de vie ne suffit pas; mentionne les douleurs musculaires comme effet secondaire connu à signaler. Prends au sérieux les recherches et les inquiétudes de l'apprenant, et terminez en convenant du plan et du rendez-vous de suivi. Tutoie l'apprenant avec chaleur. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Entre donc, assieds-toi. J'ai tes résultats à l'écran. Dans l'ensemble c'est rassurant, y'a juste deux chiffres dont on devrait parler. Tu veux la version courte ou les détails?",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant demande la signification d'au moins deux résultats en langage simple",
        "L'apprenant partage une inquiétude, un symptôme ou une question sur les médicaments",
        "L'apprenant confirme sa compréhension du plan convenu",
        "L'apprenant interroge les changements de mode de vie, le retest ou les délais",
        "L'apprenant accepte un suivi avant la fin de la rencontre"
      ],
      "vocabulary_targets": [
        "prise de sang",
        "diagnostic",
        "condition médicale",
        "dépistage",
        "traitement",
        "suivi"
      ],
      "grammar_targets": [
        "discours indirect (vous dites donc que mon cholestérol est un peu élevé)",
        "conditionnel sur les suites (si mes chiffres baissent, on refait une prise de sang?)",
        "préciser des nombres et des plages (3,9, c'est beaucoup au-dessus de la limite?)"
      ],
      "cultural_notes": "Au Québec, le médecin de famille téléphone surtout quand un résultat sort de l'ordinaire, donc une consultation réservée aux résultats est ta chance de creuser : apporte tes questions et demande une copie imprimée, tu y as droit. Les laboratoires affichent des valeurs de référence en unités métriques qui varient légèrement d'un endroit à l'autre, et la décision partagée autour des statines fait partie de la norme ici.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-hep-sante-mentale-premier-rendez-vous",
      "title": "Premier rendez-vous en santé mentale : dire comment tu te sens",
      "description": "Après des mois à pousser, tu as booké un accueil en santé mentale au CLSC. Raconte honnêtement à l'intervenant à quoi ressemblent tes derniers mois.",
      "category": "healthcare",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Gabriel Bernard, intervenant en santé mentale dans un CLSC de Rosemont. Tu crées la sécurité d'abord : règles de confidentialité, aucun jugement, rythme contrôlé par l'apprenant. Cartographie doucement la situation : ce qui déclenche la démarche aujourd'hui, humeur, sommeil, appétit, énergie, impact au travail ou aux études, réseaux de soutien, consommation d'alcool ou de cannabis, et depuis quand ça se construit. Pose une seule question directe et douce sur les pensées de se faire du mal, et accueille la réponse avec chaleur peu importe laquelle. Offre des pistes réalistes : programme de groupe qui démarre dans deux semaines, liste individuelle de trois à quatre semaines, tarification gratuite ou réduite selon le revenu, et le numéro de crise 9-8-8 ainsi qu'Info-Social 811 à garder en poche. Termine en résumant ce que tu as entendu avec bienveillance. Tutoie naturellement. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bienvenue, entre! Moi c'est Gabriel. Sache que tout ce que tu partages ici reste confidentiel, sauf en cas de danger. C'est quoi qui fait que tu décides de nous parler aujourd'hui?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant décrit ses émotions avec un vocabulaire précis",
        "L'apprenant répond aux questions sur le sommeil, l'énergie ou l'impact quotidien",
        "L'apprenant répond honnêtement à la question de sécurité",
        "L'apprenant pose au moins une question sur les programmes, les listes d'attente ou les coûts",
        "L'apprenant repart avec une prochaine étape comprise"
      ],
      "vocabulary_targets": [
        "anxiété",
        "thérapie",
        "référence",
        "spécialiste",
        "rendez-vous"
      ],
      "grammar_targets": [
        "ça fait + durée + présent (ça fait des mois que je dors mal)",
        "atténuation : un peu, genre de, pas mal, plus ou moins",
        "nommer les émotions précisément : épuisé, à bout, dépassé, à fleur de peau"
      ],
      "cultural_notes": "La santé mentale au Québec combine le médecin de famille, les CLSC avec des intervenants psychosociaux, des organismes communautaires gratuits ou à tarif réduit, et le PAE des employeurs, même si l'attente en thérapie individuelle peut s'étirer sur des semaines. La ligne 9-8-8 dessert maintenant tout le pays, Info-Social 811 couvre les détresses psychosociales, et chercher de l'aide n'a aucune conséquence sur l'immigration ou l'emploi.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-hep-limites-ramq-assurance-privee",
      "title": "Comprendre les limites de la RAMQ et l'assurance privée",
      "description": "Tu as appris à tes dépens que la carte soleil ne couvre pas tout. Visite un courtier d'assurance à Montréal pour comprendre quelle protection complémentaire a du sens pour ta famille.",
      "category": "healthcare",
      "mode": "immigration",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Nadia Charest, courtière indépendante en assurance à Montréal, connue pour son franc-parler. Cartographie d'abord les trous : la RAMQ laisse de côté la dentaire, la vue, l'ambulance, la physiothérapie et les assurances voyage. Explique la particularité québécoise des médicaments : si un employeur offre un régime collectif, l'y adhérer est obligatoire, sinon c'est le régime public de la RAMQ moyennant une prime calculée selon le revenu. Compare honnêtement : une police familiale individuelle tourne autour de 70 à 150 $ par mois, et franchise, coassurance et maximums annuels changent beaucoup la valeur. Décris la réclamation : payer d'avance chez le dentiste, soumettre le reçu ou flasher la carte de l'assureur chez les participants, remboursement en quelques jours. Signale que les conditions préexistantes peuvent comporter des délais de care. Recommande selon la situation familiale entendue. Tutoie l'apprenant. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, moi c'est Nadia, bienvenue! Au téléphone tu me disais qu'une ordonnance t'avait coûté cher parce que ta carte soleil couvre pas ça. On commence où?",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant nomme au moins deux services non couverts par la RAMQ",
        "L'apprenant interroge les primes, la franchise ou le processus de réclamation",
        "L'apprenant décrit sa situation familiale assez pour recevoir une recommandation",
        "L'apprenant compare à voix haute au moins deux options de couverture",
        "L'apprenant prend ou reporte une décision avec une raison claire"
      ],
      "vocabulary_targets": [
        "couverture",
        "assurance",
        "réclamation",
        "franchise",
        "carte d'assurance maladie",
        "urgence"
      ],
      "grammar_targets": [
        "comparatifs de valeur : plus cher que, couvre moins, meilleur deal",
        "modalités de possibilité : ça dépend de, il se peut que, ça pourrait",
        "questions complexes (ça veut dire que je paie d'avance et je me fais rembourser?)"
      ],
      "cultural_notes": "La carte soleil couvre hôpitaux et médecins, mais pas la plupart des soins dentaires, de la vue ni des ambulances — des trous que les nouveaux arrivants découvrent souvent en pleine facture. Particularité québécoise : les médicaments relèvent d'un régime obligatoire, collectif par l'employeur quand offert, sinon public via la RAMQ avec prime selon le revenu. Plusieurs provinces imposent un délai avant la couverture provinciale aux nouveaux résidents; au Québec, l'admissibilité à la RAMQ dépend surtout du statut et de la présence sur le territoire.",
      "is_premium": true,
      "is_published": true
    }
  ],
  "vocabulary": [
    {
      "id": "vocab-qhep-01",
      "word": "médecin",
      "phonetic": "/med.sɛ̃/",
      "translations": {"en": "doctor", "pa": "ਡਾਕਟਰ", "hi": "डॉक्टर", "zh": "医生", "es": "médico"},
      "level": "seed",
      "category": "healthcare",
      "example_sentences": ["Il faut prendre rendez-vous avec le médecin pour renouveler ton ordonnance.", "Demande à la réception quel médecin prend de nouveaux patients."],
      "confusion_pairs": ["docteur", "spécialiste"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.8}
    },
    {
      "id": "vocab-qhep-02",
      "word": "infirmière",
      "phonetic": "/ɛ̃.fiʁ.mjɛʁ/",
      "translations": {"en": "nurse", "pa": "ਨਰਸ", "hi": "नर्स", "zh": "护士", "es": "enfermera"},
      "level": "seed",
      "category": "healthcare",
      "example_sentences": ["Une infirmière a pris ma tension avant que le médecin entre.", "Appelle le CLSC et demande de parler à une infirmière."],
      "confusion_pairs": ["infirmière auxiliaire", "infirmier-praticien"],
      "fsrs_params": {"difficulty": 0.22, "stability": 4.6}
    },
    {
      "id": "vocab-qhep-03",
      "word": "malade",
      "phonetic": "/ma.lad/",
      "translations": {"en": "sick", "pa": "ਬਿਮਾਰ", "hi": "बीमार", "zh": "生病的", "es": "enfermo"},
      "level": "seed",
      "category": "healthcare",
      "example_sentences": ["Je reste à la maison aujourd'hui, je suis malade.", "Mon petit garçon est malade, il vomit depuis ce matin."],
      "confusion_pairs": ["avoir mal", "patiente"],
      "fsrs_params": {"difficulty": 0.2, "stability": 4.5}
    },
    {
      "id": "vocab-qhep-04",
      "word": "douleur",
      "phonetic": "/du.lœʁ/",
      "translations": {"en": "pain", "pa": "ਦਰਦ", "hi": "दर्द", "zh": "疼痛", "es": "dolor"},
      "level": "seed",
      "category": "healthcare",
      "example_sentences": ["J'ai une douleur vive dans le bas du dos.", "Sur une échelle de un à dix, ta douleur est rendue où?"],
      "confusion_pairs": ["mal", "courbature"],
      "fsrs_params": {"difficulty": 0.24, "stability": 4.4}
    },
    {
      "id": "vocab-qhep-05",
      "word": "médicament",
      "phonetic": "/me.di.kɑ.mɑ̃/",
      "translations": {"en": "medicine", "pa": "ਦਵਾਈ", "hi": "दवा", "zh": "药品", "es": "medicamento"},
      "level": "seed",
      "category": "healthcare",
      "example_sentences": ["Prends ton médicament avec de la nourriture, deux fois par jour.", "Certains médicaments donnent de la somnolence, lis l'étiquette."],
      "confusion_pairs": ["médication", "comprimé"],
      "fsrs_params": {"difficulty": 0.25, "stability": 4.3}
    },
    {
      "id": "vocab-qhep-06",
      "word": "carte d'assurance maladie",
      "phonetic": "/kaʁ.t‿a.sy.ʁɑ̃s ma.la.di/",
      "translations": {"en": "health card (RAMQ)", "pa": "ਸਿਹਤ ਕਾਰਡ", "hi": "स्वास्थ्य कार्ड (RAMQ)", "zh": "医疗卡（RAMQ）", "es": "tarjeta de seguro médico"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Apporte ta carte d'assurance maladie à chaque rendez-vous.", "Ma nouvelle carte soleil est arrivée par la poste cette semaine."],
      "confusion_pairs": ["carte soleil", "permis de conduire"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-qhep-07",
      "word": "clinique",
      "phonetic": "/kli.nik/",
      "translations": {"en": "clinic", "pa": "ਕਲੀਨਿਕ", "hi": "क्लिनिक", "zh": "诊所", "es": "clínica"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["La clinique du coin est ouverte jusqu'à neuf ce soir.", "Le samedi matin, la clinique déborde de monde."],
      "confusion_pairs": ["centre hospitalier", "GMF"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.1}
    },
    {
      "id": "vocab-qhep-08",
      "word": "rendez-vous",
      "phonetic": "/ʁɑ̃.de.vu/",
      "translations": {"en": "appointment", "pa": "ਮੁਲਾਕਾਤ (ਡਾਕਟਰੀ)", "hi": "अपॉइंटमेंट", "zh": "预约", "es": "cita"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["J'ai un rendez-vous avec le médecin vendredi.", "C'est-tu possible d'avancer mon rendez-vous à la semaine prochaine?"],
      "confusion_pairs": ["consultation", "disponibilité"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.9}
    },
    {
      "id": "vocab-qhep-09",
      "word": "pharmacie",
      "phonetic": "/faʁ.ma.si/",
      "translations": {"en": "pharmacy", "pa": "ਫ਼ਾਰਮੇਸੀ", "hi": "फ़ार्मेसी", "zh": "药房", "es": "farmacia"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Va chercher ton ordonnance à la pharmacie du centre d'achat.", "La pharmacie livre les renouvellements à domicile."],
      "confusion_pairs": ["dépanneur", "laboratoire"],
      "fsrs_params": {"difficulty": 0.31, "stability": 4.0}
    },
    {
      "id": "vocab-qhep-10",
      "word": "pharmacien",
      "phonetic": "/faʁ.ma.sjɛ̃/",
      "translations": {"en": "pharmacist", "pa": "ਫ਼ਾਰਮਾਸਿਸਟ", "hi": "फ़ार्मासिस्ट", "zh": "药剂师", "es": "farmacéutico"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Demande au pharmacien avant de mélanger deux médicaments.", "Ton pharmacien peut imprimer la liste de tous tes médicaments."],
      "confusion_pairs": ["technicien en pharmacie", "homéopathe"],
      "fsrs_params": {"difficulty": 0.34, "stability": 3.8}
    },
    {
      "id": "vocab-qhep-11",
      "word": "fièvre",
      "phonetic": "/fjɛvʁ/",
      "translations": {"en": "fever", "pa": "ਬੁਖ਼ਾਰ", "hi": "बुखार", "zh": "发烧", "es": "fiebre"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Il fait trente-neuf de fièvre depuis hier soir.", "Si la fièvre dure plus de trois jours, consulte un médecin."],
      "confusion_pairs": ["frissons", "température"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.7}
    },
    {
      "id": "vocab-qhep-12",
      "word": "toux",
      "phonetic": "/tu/",
      "translations": {"en": "cough", "pa": "ਖੰਘ", "hi": "खांसी", "zh": "咳嗽", "es": "tos"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Sa toux l'a réveillé toute la nuit.", "Une cuillerée de miel calme la toux sèche."],
      "confusion_pairs": ["respiration sifflante", "rhume"],
      "fsrs_params": {"difficulty": 0.32, "stability": 3.8}
    },
    {
      "id": "vocab-qhep-13",
      "word": "mal de gorge",
      "phonetic": "/mal də ɡɔʁʒ/",
      "translations": {"en": "sore throat", "pa": "ਗਲੇ ਦਾ ਦਰਦ", "hi": "गले में खराश", "zh": "喉咙痛", "es": "dolor de garganta"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["J'ai mal de gorge et les ganglions gonflés.", "Un gargarisme d'eau salée tiède soulage le mal de gorge."],
      "confusion_pairs": ["angine", "gorge enrouée"],
      "fsrs_params": {"difficulty": 0.35, "stability": 3.6}
    },
    {
      "id": "vocab-qhep-14",
      "word": "allergie",
      "phonetic": "/a.lɛʁ.ʒi/",
      "translations": {"en": "allergy", "pa": "ਐਲਰਜੀ", "hi": "एलर्जी", "zh": "过敏", "es": "alergia"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Elle a une allergie à la pénicilline, vérifie l'étiquette.", "Le pollen du printemps réveille mon allergie chaque année."],
      "confusion_pairs": ["intolérance alimentaire", "sensibilité"],
      "fsrs_params": {"difficulty": 0.36, "stability": 3.5}
    },
    {
      "id": "vocab-qhep-15",
      "word": "urgence",
      "phonetic": "/yʁ.ʒɑ̃s/",
      "translations": {"en": "emergency", "pa": "ਐਮਰਜੈਂਸੀ", "hi": "आपातकालीन स्थिति", "zh": "急诊；紧急情况", "es": "emergencia"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Si la douleur à la poitrine empire, c'est une urgence, fais le 911.", "Pour une fracture, file à l'urgence la plus proche."],
      "confusion_pairs": ["crise", "pressé"],
      "fsrs_params": {"difficulty": 0.35, "stability": 3.7}
    },
    {
      "id": "vocab-qhep-16",
      "word": "salle d'attente",
      "phonetic": "/sal da.tɑ̃t/",
      "translations": {"en": "waiting room", "pa": "ਉਡੀਕ ਘਰ", "hi": "प्रतीक्षा कक्ष", "zh": "候诊室", "es": "sala de espera"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["On a attendu quarante minutes dans la salle d'attente.", "Garde ton enfant près de toi dans la salle d'attente, s'il te plaît."],
      "confusion_pairs": ["accueil", "salle d'urgence"],
      "fsrs_params": {"difficulty": 0.3, "stability": 4.0}
    },
    {
      "id": "vocab-qhep-17",
      "word": "médecin de famille",
      "phonetic": "/med.sɛ̃ də fa.mi.j/",
      "translations": {"en": "family doctor", "pa": "ਫੈਮਿਲੀ ਡਾਕਟਰ", "hi": "फैमिली डॉक्टर", "zh": "家庭医生", "es": "médico de familia"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Notre médecin de famille suit toute la famille depuis dix ans.", "Ça peut prendre des mois de trouver un médecin de famille qui prend des patients."],
      "confusion_pairs": ["médecin sans rendez-vous", "pédiatre"],
      "fsrs_params": {"difficulty": 0.33, "stability": 3.9}
    },
    {
      "id": "vocab-qhep-18",
      "word": "CLSC",
      "phonetic": "/se.ɛl.ɛs.se/",
      "translations": {"en": "community health centre (CLSC)", "pa": "ਕਮਿਊਨਿਟੀ ਹੈਲਥ ਸੈਂਟਰ (CLSC)", "hi": "सामुदायिक स्वास्थ्य केंद्र (CLSC)", "zh": "社区医疗中心（CLSC）", "es": "centro comunitario de salud"},
      "level": "sprout",
      "category": "healthcare",
      "example_sentences": ["Pour un vaccin, prends rendez-vous à ton CLSC.", "Le CLSC du quartier offre des ateliers de grossesse gratuits."],
      "confusion_pairs": ["GMF", "centre hospitalier"],
      "fsrs_params": {"difficulty": 0.37, "stability": 3.5}
    },
    {
      "id": "vocab-qhep-19",
      "word": "symptôme",
      "phonetic": "/sɛ̃p.tom/",
      "translations": {"en": "symptom", "pa": "ਲੱਛਣ", "hi": "लक्षण", "zh": "症状", "es": "síntoma"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Décris chaque symptôme au médecin, même les petits.", "La fièvre est souvent le premier symptôme de la grippe."],
      "confusion_pairs": ["signe", "effet secondaire"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-qhep-20",
      "word": "ordonnance",
      "phonetic": "/ɔʁ.dɔ.nɑ̃s/",
      "translations": {"en": "prescription", "pa": "ਨੁਸਖ਼ਾ", "hi": "पर्चा (नुस्ख़ा)", "zh": "处方", "es": "receta"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Il te faut une ordonnance du médecin pour l'antibiotique.", "Ton ordonnance est prête au comptoir de la pharmacie."],
      "confusion_pairs": ["note du médecin", "médicament en vente libre"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-qhep-21",
      "word": "renouvellement",
      "phonetic": "/ʁə.nu.vɛl.mɑ̃/",
      "translations": {"en": "refill (prescription renewal)", "pa": "ਰੀਫ਼ਿਲ", "hi": "रिफिल (दोबारा भरवाना)", "zh": "续配药", "es": "renovación de la receta"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Demande à ton médecin d'approuver le renouvellement avant que le flacon soit vide.", "Il me reste un renouvellement sur cette ordonnance."],
      "confusion_pairs": ["prolongation", "transfert d'ordonnance"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qhep-22",
      "word": "dose",
      "phonetic": "/doz/",
      "translations": {"en": "dose", "pa": "ਖ਼ੁਰਾਕ (ਦਵਾਈ ਦੀ)", "hi": "खुराक", "zh": "剂量", "es": "dosis"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["La dose, c'est un comprimé deux fois par jour avec de la nourriture.", "Ne change jamais ta dose sans parler au pharmacien."],
      "confusion_pairs": ["dosage", "quantité"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-qhep-23",
      "word": "effet secondaire",
      "phonetic": "/ɛ.fɛ sə.ɡɔ̃.dɛʁ/",
      "translations": {"en": "side effect", "pa": "ਮਾੜਾ ਅਸਰ", "hi": "दुष्प्रभाव", "zh": "副作用", "es": "efecto secundario"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["La somnolence, c'est un effet secondaire courant de ce médicament.", "Appelle la clinique si un effet secondaire devient sévère."],
      "confusion_pairs": ["réaction allergique", "interaction médicamenteuse"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-qhep-24",
      "word": "nausée",
      "phonetic": "/no.ze/",
      "translations": {"en": "nausea", "pa": "ਜੀ ਮਿਚਲਣਾ", "hi": "मतली", "zh": "恶心", "es": "náuseas"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Les antidouleurs forts peuvent causer de la nausée.", "Bois du thé au gingembre si la nausée ne passe pas."],
      "confusion_pairs": ["vomissement", "indigestion"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.8}
    },
    {
      "id": "vocab-qhep-25",
      "word": "étourdissement",
      "phonetic": "/e.tuʁ.di.smɑ̃/",
      "translations": {"en": "dizziness", "pa": "ਚੱਕਰ ਆਉਣੇ", "hi": "चक्कर आना", "zh": "头晕", "es": "mareo"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Un étourdissement peut être un signe de déshydratation.", "Elle a eu des étourdissements après avoir sauté le dîner."],
      "confusion_pairs": ["vertige", "faiblesse"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.8}
    },
    {
      "id": "vocab-qhep-26",
      "word": "éruption cutanée",
      "phonetic": "/e.ʁyp.sjɔ̃ ky.ta.ne/",
      "translations": {"en": "rash", "pa": "ਧੱਫ਼", "hi": "चकत्ते (रैश)", "zh": "皮疹", "es": "sarpullido"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Ce nouveau savon lui a donné une éruption cutanée rouge.", "Montre l'éruption cutanée au médecin avant qu'elle disparaisse."],
      "confusion_pairs": ["urticaire", "démangeaison"],
      "fsrs_params": {"difficulty": 0.45, "stability": 2.9}
    },
    {
      "id": "vocab-qhep-27",
      "word": "saignement",
      "phonetic": "/sɛɲ.mɑ̃/",
      "translations": {"en": "bleeding", "pa": "ਖ਼ੂਨ ਨਿਕਲਣਾ", "hi": "खून बहना", "zh": "出血", "es": "sangrado"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Appuie fermement pour arrêter le saignement.", "Un saignement qui ne s'arrête pas demande des soins immédiats."],
      "confusion_pairs": ["contusion", "caillot"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-qhep-28",
      "word": "blessure",
      "phonetic": "/blɛ.syʁ/",
      "translations": {"en": "injury", "pa": "ਸੱਟ", "hi": "चोट", "zh": "外伤", "es": "lesión"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Signale toute blessure au travail à ton superviseur tout de suite.", "Cette vieille blessure au genou lui fait encore mal."],
      "confusion_pairs": ["plaie", "entorse"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.9}
    },
    {
      "id": "vocab-qhep-29",
      "word": "salle d'urgence",
      "phonetic": "/sal dy.ʁʒɑ̃s/",
      "translations": {"en": "emergency room", "pa": "ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ", "hi": "इमरजेंसी रूम", "zh": "急诊室", "es": "sala de emergencias"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["On l'a transporté à la salle d'urgence de l'hôpital de la Citadelle.", "Prévois une longue attente à la salle d'urgence pour un problème mineur."],
      "confusion_pairs": ["clinique sans rendez-vous", "centre hospitalier"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qhep-30",
      "word": "référence",
      "phonetic": "/ʁe.fe.ʁɑ̃s/",
      "translations": {"en": "referral", "pa": "ਰੈਫ਼ਰਲ", "hi": "रेफ़रल (भेजना)", "zh": "转诊单", "es": "derivación"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Ta référence pour le dermatologue est enfin arrivée.", "Demande combien de temps d'attente il y a après une référence."],
      "confusion_pairs": ["bon (feuille de référence)", "recommandation"],
      "fsrs_params": {"difficulty": 0.49, "stability": 2.8}
    },
    {
      "id": "vocab-qhep-31",
      "word": "spécialiste",
      "phonetic": "/spe.sja.list/",
      "translations": {"en": "specialist", "pa": "ਮਾਹਿਰ ਡਾਕਟਰ", "hi": "विशेषज्ञ डॉक्टर", "zh": "专科医生", "es": "especialista"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Un spécialiste soigne ce que ton médecin de famille ne peut pas traiter.", "Le spécialiste te verra à la clinique externe."],
      "confusion_pairs": ["généraliste", "chirurgien"],
      "fsrs_params": {"difficulty": 0.46, "stability": 3.0}
    },
    {
      "id": "vocab-qhep-32",
      "word": "examen médical",
      "phonetic": "/ɛɡ.za.mɛ̃ me.di.kal/",
      "translations": {"en": "checkup", "pa": "ਜਾਂਚ", "hi": "जांच (रूटीन परीक्षा)", "zh": "体检", "es": "chequeo"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Prends un examen médical annuel même quand tu te sens en forme.", "À l'examen médical, le docteur a mesuré sa tension artérielle."],
      "confusion_pairs": ["bilan de santé", "visite de routine"],
      "fsrs_params": {"difficulty": 0.44, "stability": 3.1}
    },
    {
      "id": "vocab-qhep-33",
      "word": "prise de sang",
      "phonetic": "/pʁiz də sɑ̃/",
      "translations": {"en": "blood test", "pa": "ਖ਼ੂਨ ਦੀ ਜਾਂਚ", "hi": "खून की जांच", "zh": "抽血检查", "es": "análisis de sangre"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["La prise de sang montre que ton fer est un peu bas.", "Jeûne douze heures avant la prise de sang."],
      "confusion_pairs": ["analyse d'urine", "radiographie"],
      "fsrs_params": {"difficulty": 0.48, "stability": 2.8}
    },
    {
      "id": "vocab-qhep-34",
      "word": "traitement",
      "phonetic": "/tʁɛt.mɑ̃/",
      "translations": {"en": "treatment", "pa": "ਇਲਾਜ", "hi": "इलाज", "zh": "治疗", "es": "tratamiento"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["La physiothérapie, c'est le traitement habituel pour cette blessure.", "Le traitement a fait effet en deux semaines."],
      "confusion_pairs": ["guérison", "soins"],
      "fsrs_params": {"difficulty": 0.45, "stability": 3.0}
    },
    {
      "id": "vocab-qhep-35",
      "word": "en vente libre",
      "phonetic": "/ɑ̃ vɑ̃t libʁ/",
      "translations": {"en": "over-the-counter", "pa": "ਬਿਨਾਂ ਨੁਸਖ਼ੇ ਦੀ ਦਵਾਈ", "hi": "बिना पर्चे वाली दवा", "zh": "非处方药", "es": "de venta libre"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["L'ibuprofène, c'est un antidouleur en vente libre.", "Les produits en vente libre ne guérissent pas une infection bactérienne."],
      "confusion_pairs": ["sur ordonnance", "derrière le comptoir"],
      "fsrs_params": {"difficulty": 0.5, "stability": 2.7}
    },
    {
      "id": "vocab-qhep-36",
      "word": "antidouleur",
      "phonetic": "/ɑ̃.ti.du.lœʁ/",
      "translations": {"en": "painkiller", "pa": "ਦਰਦ ਨਿਵਾਰਕ ਦਵਾਈ", "hi": "दर्द निवारक दवा", "zh": "止痛药", "es": "analgésico"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Prends un antidouleur avant que l'anesthésie se dissipe.", "Cet antidouleur-là me donnait le cœur au ventre, alors je mange avant."],
      "confusion_pairs": ["anti-inflammatoire", "myorelaxant"],
      "fsrs_params": {"difficulty": 0.47, "stability": 2.8}
    },
    {
      "id": "vocab-qhep-37",
      "word": "antibiotique",
      "phonetic": "/ɑ̃.ti.bjo.tik/",
      "translations": {"en": "antibiotic", "pa": "ਐਂਟੀਬਾਇਓਟਿਕ", "hi": "एंटीबायोटिक दवा", "zh": "抗生素", "es": "antibiótico"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Finis tout ton antibiotique, même si tu te sens mieux au bout de trois jours.", "Les antibiotiques ne servent à rien contre le rhume."],
      "confusion_pairs": ["antiviral", "probiotique"],
      "fsrs_params": {"difficulty": 0.49, "stability": 2.7}
    },
    {
      "id": "vocab-qhep-38",
      "word": "pommade",
      "phonetic": "/pɔ.mad/",
      "translations": {"en": "ointment", "pa": "ਮਲਮ", "hi": "मरहम", "zh": "药膏", "es": "pomada"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Applique la pommade en mince couche deux fois par jour.", "Cette pommade calme l'éruption cutanée et arrête les démangeaisons."],
      "confusion_pairs": ["crème", "lotion"],
      "fsrs_params": {"difficulty": 0.5, "stability": 2.6}
    },
    {
      "id": "vocab-qhep-39",
      "word": "interprète",
      "phonetic": "/ɛ̃.tɛʁ.pʁɛt/",
      "translations": {"en": "interpreter", "pa": "ਤਰਜੁਮਾਕਾਰ", "hi": "दुभाषिया", "zh": "口译员", "es": "intérprete"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Demande un interprète quand tu prends ton rendez-vous, c'est gratuit.", "Les interprètes des hôpitaux sont formés et tenus au secret professionnel."],
      "confusion_pairs": ["traducteur", "accompagnateur"],
      "fsrs_params": {"difficulty": 0.49, "stability": 2.7}
    },
    {
      "id": "vocab-qhep-40",
      "word": "suivi",
      "phonetic": "/sɥi.vi/",
      "translations": {"en": "follow-up", "pa": "ਫ਼ਾਲੋ-ਅੱਪ", "hi": "फ़ॉलो-अप (अगली जांच)", "zh": "复诊", "es": "consulta de seguimiento"},
      "level": "branch",
      "category": "healthcare",
      "example_sentences": ["Le médecin a fixé le suivi dans deux semaines.", "Apporte tes questions au rendez-vous de suivi."],
      "confusion_pairs": ["examen médical", "première consultation"],
      "fsrs_params": {"difficulty": 0.46, "stability": 2.9}
    },
    {
      "id": "vocab-qhep-41",
      "word": "triage",
      "phonetic": "/tʁi.aʒ/",
      "translations": {"en": "triage", "pa": "ਟ੍ਰਾਈਏਜ਼ (ਤਰਤੀਬ)", "hi": "ट्रायाज (प्राथमिकता)", "zh": "分诊", "es": "triaje"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Le triage met les patients les plus urgents en premier, pas les premiers arrivés.", "Une infirmière fait le triage à l'entrée et prend tes signes vitaux."],
      "confusion_pairs": ["liste d'attente", "priorité"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-qhep-42",
      "word": "diagnostic",
      "phonetic": "/djaɡ.nɔ.sti/",
      "translations": {"en": "diagnosis", "pa": "ਨਿਦਾਨ", "hi": "निदान", "zh": "诊断", "es": "diagnóstico"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Le diagnostic explique enfin des mois de fatigue.", "Demander une deuxième opinion sur un diagnostic, c'est tout à fait normal."],
      "confusion_pairs": ["pronostic", "hypothèse"],
      "fsrs_params": {"difficulty": 0.62, "stability": 1.9}
    },
    {
      "id": "vocab-qhep-43",
      "word": "condition médicale",
      "phonetic": "/kɔ̃.di.sjɔ̃ me.di.kal/",
      "translations": {"en": "medical condition", "pa": "ਬਿਮਾਰੀ ਦੀ ਹਾਲਤ", "hi": "बीमारी (स्थिति)", "zh": "病情", "es": "afección"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Le diabète, c'est une condition médicale qui se gère à tous les jours.", "Mentionne ta condition médicale à chaque nouveau professionnel."],
      "confusion_pairs": ["maladie", "syndrome"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-qhep-44",
      "word": "couverture",
      "phonetic": "/ku.vɛʁ.tyʁ/",
      "translations": {"en": "coverage", "pa": "ਕਵਰੇਜ", "hi": "कवरेज", "zh": "（医保）覆盖范围", "es": "cobertura"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["La couverture publique ne paie pas les soins dentaires pour les adultes.", "Vérifie si ta couverture inclut les lunettes."],
      "confusion_pairs": ["prestations", "admissibilité"],
      "fsrs_params": {"difficulty": 0.6, "stability": 2.0}
    },
    {
      "id": "vocab-qhep-45",
      "word": "assurance",
      "phonetic": "/a.sy.ʁɑ̃s/",
      "translations": {"en": "insurance", "pa": "ਬੀਮਾ", "hi": "बीमा", "zh": "保险", "es": "seguro"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["L'assurance collective du travail couvre souvent la dentaire et la vue.", "Compare les assurances avant de signer quoi que ce soit."],
      "confusion_pairs": ["police d'assurance", "assureur"],
      "fsrs_params": {"difficulty": 0.57, "stability": 2.2}
    },
    {
      "id": "vocab-qhep-46",
      "word": "réclamation",
      "phonetic": "/ʁe.kla.ma.sjɔ̃/",
      "translations": {"en": "claim (insurance)", "pa": "ਕਲੇਮ", "hi": "दावा (क्लेम)", "zh": "报销申请", "es": "reclamación"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Soumets ta réclamation en ligne avec ton reçu.", "Ma réclamation pour la physio a été approuvée en quelques jours."],
      "confusion_pairs": ["reçu", "préautorisation"],
      "fsrs_params": {"difficulty": 0.63, "stability": 1.8}
    },
    {
      "id": "vocab-qhep-47",
      "word": "franchise",
      "phonetic": "/fʁɑ̃.kiz/",
      "translations": {"en": "deductible", "pa": "ਡਿਡਕਟਿਬਲ", "hi": "डिडक्टिबल (पहली रकम)", "zh": "免赔额", "es": "deducible"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Tu paies la franchise d'abord, ensuite le régime prend le relais.", "Une franchise plus haute veut souvent dire une prime mensuelle moindre."],
      "confusion_pairs": ["coassurance", "prime mensuelle"],
      "fsrs_params": {"difficulty": 0.66, "stability": 1.6}
    },
    {
      "id": "vocab-qhep-48",
      "word": "anxiété",
      "phonetic": "/ɑ̃k.zje.te/",
      "translations": {"en": "anxiety", "pa": "ਬੈਚੈਨੀ", "hi": "चिंता (घबराहट)", "zh": "焦虑", "es": "ansiedad"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Respirer lentement aide à calmer mon anxiété.", "Parler de ton anxiété à quelqu'un, ça aide vraiment."],
      "confusion_pairs": ["stress", "crise de panique"],
      "fsrs_params": {"difficulty": 0.58, "stability": 2.1}
    },
    {
      "id": "vocab-qhep-49",
      "word": "thérapie",
      "phonetic": "/te.ʁa.pi/",
      "translations": {"en": "therapy (counselling)", "pa": "ਕਾਉਂਸਲਿੰਗ", "hi": "थेरेपी (काउंसलिंग)", "zh": "心理咨询；治疗", "es": "terapia"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Des organismes communautaires offrent de la thérapie gratuite à court terme.", "La thérapie lui a donné des outils concrets pour gérer son stress."],
      "confusion_pairs": ["psychothérapie", "groupe d'entraide"],
      "fsrs_params": {"difficulty": 0.61, "stability": 1.9}
    },
    {
      "id": "vocab-qhep-50",
      "word": "dépistage",
      "phonetic": "/de.pis.taʒ/",
      "translations": {"en": "screening", "pa": "ਸਕਰੀਨਿੰਗ ਜਾਂਚ", "hi": "स्क्रीनिंग जांच", "zh": "筛查", "es": "prueba de detección"},
      "level": "bloom",
      "category": "healthcare",
      "example_sentences": ["Le dépistage régulier attrape les problèmes tôt, avant les symptômes.", "Au Québec, le dépistage du cancer colorectal commence vers cinquante ans."],
      "confusion_pairs": ["test diagnostique", "vaccination"],
      "fsrs_params": {"difficulty": 0.59, "stability": 2.0}
    }
  ]
}
