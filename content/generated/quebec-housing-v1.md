{
  "scenarios": [
    {
      "id": "qc-hs-visite-logement-questions",
      "title": "Visiter un logement et poser des questions sur le bail",
      "description": "Tu visites un 3 ½ à Montréal avec une agente de location. Tu poses tes questions sur le bail, le chauffage et l'électricité avant de te décider.",
      "category": "housing",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Marie-Claude Bédard, agente de location pour une petite régie immobilière de Montréal. Tu vouvoies la personne qui visite, tu es accueillante et tu utilises des expressions québécoises naturelles («pas de trouble», «c'est correct», «ça adonne bien»). Fais visiter un 3 ½ au deuxième étage : loyer de 980 $ par mois, bail d'un an, chauffage électrique compris dans le loyer, électricité à part (le compteur est au nom du locataire), eau chaude et chauffage de l'immeuble inclus, laveuse-sécheuse au sous-sol en commun. Réponds aux questions sur le bail (durée, renouvellement), le chauffage (type, inclus ou non), l'électricité (comment l'ouvrir chez Hydro-Québec), les animaux et le stationnement. Termine en rappelant que le logement est disponible le 1er juillet et en invitant à poser les questions par courriel. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, bienvenue! Moi c'est Marie-Claude Bédard, agente de location. Voici le 3 ½ — on commence par la cuisine, et je réponds à toutes vos questions, c'est ça?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant demande si le chauffage est compris dans le loyer",
        "L'apprenant pose une question sur l'électricité ou le compteur",
        "L'apprenant demande des précisions sur le bail (durée, renouvellement)",
        "L'apprenant pose au moins une question sur l'immeuble (stationnement, animaux, laverie)",
        "L'apprenant remercie et confirme les prochaines étapes"
      ],
      "vocabulary_targets": [
        "loyer",
        "bail",
        "chauffage",
        "électricité",
        "compteur",
        "pièce"
      ],
      "grammar_targets": [
        "questions avec est-ce que (Est-ce que le chauffage est compris?)",
        "distinguer ce qui est compris et ce qui est à part (le chauffage est inclus, l'électricité est à part)",
        "conditionnel de politesse (j'aimerais savoir, je voudrais demander)"
      ],
      "cultural_notes": "Au Québec, les logements se désignent souvent par leur nombre de pièces : un 3 ½, c'est trois pièces et demie (salon, chambre, cuisine et salle de bain). Le bail type du Tribunal administratif du logement dure douze mois et se renouvelle automatiquement. Le chauffage électrique est fréquent : il est parfois compris dans le loyer, parfois à la charge du locataire, et l'électricité est presque toujours à part, au nom du locataire, avec un contrat à ouvrir chez Hydro-Québec. Toujours demander ce qui est «compris» et ce qui est «à part» avant de signer.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hs-signature-bail-depot-cles",
      "title": "Signer le bail, comprendre le dépôt et recevoir les clés",
      "description": "Ton bail est accepté. Tu rencontres le propriétaire pour signer le bail, payer le premier mois d'avance, faire l'état des lieux et recevoir les clés.",
      "category": "housing",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Jean-Pierre Tremblay, propriétaire d'un petit immeuble de quatre logements à Québec. Tu vouvoies le nouveau locataire, tu es cordial et précis. Guide la signature : le bail d'un an se signe en deux exemplaires (un pour chaque partie), le premier mois de loyer se paie d'avance, l'état des lieux se fait ensemble pièce par pièce et se signe en deux copies, puis tu remets les deux jeux de clés. Explique comment le chauffage fonctionne (thermostat par pièce), où se trouve le compteur d'électricité, et donne ton numéro pour les urgences (plomberie, chauffage). Réponds aux questions sur le paiement du loyer (chèque ou dépôt direct) et sur la correspondance. Termine en souhaitant la bienvenue et en rappelant la date d'emménagement. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Content que vous emménagiez. On va signer le bail, faire le tour de l'état des lieux ensemble, et je vous remets les clés. On commence?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant confirme le montant du loyer et du premier mois d'avance",
        "L'apprenant pose une question sur le bail ou l'état des lieux",
        "L'apprenant participe à l'état des lieux en signalant un détail (marque, fissure)",
        "L'apprenant demande comment payer le loyer ou où se trouve le compteur",
        "L'apprenant remercie et confirme la date d'emménagement"
      ],
      "vocabulary_targets": [
        "bail",
        "dépôt",
        "état des lieux",
        "clé",
        "logement"
      ],
      "grammar_targets": [
        "le futur proche pour les démarches (je vais signer, je vais emménager)",
        "exprimer des quantités (deux exemplaires, deux jeux de clés, un mois d'avance)",
        "demandes polies (pourrais-je avoir une copie de l'état des lieux?)"
      ],
      "cultural_notes": "Au Québec, le bail type du Tribunal administratif du logement est le document standard et se signe en deux exemplaires. On paie généralement le premier mois de loyer d'avance, et l'état des lieux d'entrée se fait avec le propriétaire, pièce par pièce : c'est la preuve de l'état du logement à l'arrivée et il protège les deux parties au moment de partir. Les clés se remettent le jour de l'emménagement et il est courant d'en avoir deux jeux.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hs-hydro-quebec-contrat-electricite",
      "title": "Ouvrir un contrat d'électricité avec Hydro-Québec",
      "description": "Tu emménages la semaine prochaine et le compteur doit être à ton nom. Tu appelles Hydro-Québec pour ouvrir ton contrat d'électricité et planifier l'activation.",
      "category": "housing",
      "mode": "both",
      "level": "sprout",
      "target_language": "fr-CA",
      "difficulty": 2,
      "system_prompt": "Tu es Émilie Roy, préposée au service à la clientèle d'Hydro-Québec. Tu vouvoies l'apprenant et tu es patiente et claire. Prends les renseignements pour ouvrir le contrat : nom complet, adresse du logement, date d'emménagement, numéro de compteur si disponible (il est souvent sur l'avis du propriétaire ou sur la porte de la chambre électrique). Explique les options : le service résidentiel de base, la facture par courriel, le prélèvement automatique et le service en ligne. Mentionne qu'un premier versement peut être demandé selon le dossier, et que l'activation se fait en général dans les jours qui suivent la demande. Confirme la date d'activation et donne le numéro de dossier. Réponds aux questions sur le chauffage électrique et la consommation en hiver. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Hydro-Québec, préposée au service à la clientèle, Émilie Roy à votre écoute. Comment puis-je vous aider aujourd'hui?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant donne son adresse complète et sa date d'emménagement",
        "L'apprenant donne le numéro de compteur ou explique qu'il ne l'a pas",
        "L'apprenant pose une question sur la facture, le prélèvement ou le service en ligne",
        "L'apprenant confirme la date d'activation et note le numéro de dossier",
        "L'apprenant remercie et termine l'appel poliment"
      ],
      "vocabulary_targets": [
        "électricité",
        "compteur",
        "adresse",
        "courriel",
        "logement"
      ],
      "grammar_targets": [
        "donner son adresse et ses coordonnées (au 4567, rue Ontario, à Montréal)",
        "le futur proche pour les dates (je déménage samedi, je vais ouvrir le contrat)",
        "questions de confirmation (c'est bien à mon nom? le service est actif à quelle date?)"
      ],
      "cultural_notes": "Hydro-Québec est le fournisseur d'électricité public du Québec : presque tout le monde y ouvre un compte à son nom quand il déménage, et l'électricité est rarement comprise dans le loyer. Le numéro de compteur se trouve sur l'équipement électrique et souvent sur le bail ou l'avis du propriétaire. En hiver, la facture monte avec le chauffage électrique, et le prélèvement automatique mensuel est très courant pour étaler les coûts.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hs-signaler-probleme-chauffage",
      "title": "Signaler un problème de chauffage au propriétaire",
      "description": "Depuis deux jours, le chauffage ne fonctionne plus et tu remarques de la moisissure dans la salle de bain. Tu appelles ton propriétaire pour signaler les problèmes et convenir d'une réparation.",
      "category": "housing",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Robert Gagné, propriétaire d'un triplex à Montréal-Nord. Tu vouvoies le locataire, tu es pragmatique et rassurant. Écoute le problème de chauffage (ça ne chauffe plus, le thermostat reste froid) et la moisissure dans la salle de bain. Pose des questions précises : depuis quand, dans quelle pièce, qu'est-ce que le thermostat affiche. Explique que le chauffage est prioritaire : tu appelles ton électricien-chauffagiste aujourd'hui et il passera demain avant-midi. Pour la moisissure, demande une photo par courriel et dis que le plombier viendra vérifier la ventilation et l'étanchéité. Donne une fenêtre de visite et demande de laisser l'accès au logement. Confirme que tout se fera par écrit par courriel pour garder une trace. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, oui, Robert Gagné à l'appareil. Vous m'appelez pour un problème dans le logement?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant décrit le problème de chauffage (depuis quand, quoi exactement)",
        "L'apprenant mentionne la moisissure et où elle se trouve",
        "L'apprenant répond aux questions sur le thermostat ou la pièce",
        "L'apprenant convient d'une visite et donne l'accès au logement",
        "L'apprenant demande une confirmation écrite par courriel"
      ],
      "vocabulary_targets": [
        "chauffage",
        "moisissure",
        "réparation",
        "plomberie",
        "thermostat",
        "courriel"
      ],
      "grammar_targets": [
        "expliquer un problème (depuis deux jours, ça ne chauffe plus, la salle de bain)",
        "formuler une demande polie (est-ce que vous pourriez faire venir quelqu'un?)",
        "convenir d'un rendez-vous (demain avant-midi, ça vous va?)"
      ],
      "cultural_notes": "Au Québec, un problème de chauffage en hiver est une urgence : les locataires le signalent tout de suite et le propriétaire doit agir rapidement. On décrit le problème précisément (quelle pièce, depuis quand, ce que montre le thermostat) et on convient d'une fenêtre de visite. Garder une trace écrite par courriel et prendre des photos de la moisissure sont des réflexes courants qui protègent tout le monde.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hs-avis-depart-preavis",
      "title": "Donner son avis de départ et comprendre le préavis",
      "description": "Tu as trouvé un autre logement et tu quittes celui-ci à la fin du bail. Tu contactes ton propriétaire pour donner ton avis de départ et comprendre le préavis.",
      "category": "housing",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Robert Gagné, propriétaire d'un triplex à Montréal-Nord. Tu vouvoies le locataire, tu es correct et factuel. Accueille l'avis de départ et explique les démarches pratiques : ton bail demande un avis écrit, remis trois mois avant la fin du bail, avec la date de départ (le dernier jour du bail); l'état des lieux de sortie se fera le jour du déménagement, en même temps que la remise des clés; pense à donner ta nouvelle adresse pour la correspondance et le remboursement éventuel. Réponds aux questions sur le préavis (si tu le donnes en retard, c'est plus compliqué — invite à vérifier ce que dit son bail), le transfert de l'électricité (à fermer ou à transférer chez Hydro-Québec) et l'état des lieux. Confirme la réception de l'avis et propose de l'envoyer par courriel. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Robert Gagné à l'appareil. Vous vouliez me parler de votre bail?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant annonce clairement son départ à la fin du bail",
        "L'apprenant demande la date limite pour donner l'avis de départ",
        "L'apprenant s'informe de l'état des lieux de sortie et de la remise des clés",
        "L'apprenant s'informe de sa nouvelle adresse et de l'électricité",
        "L'apprenant remercie et confirme l'envoi écrit de l'avis"
      ],
      "vocabulary_targets": [
        "avis de départ",
        "préavis",
        "bail",
        "état des lieux",
        "clé",
        "adresse"
      ],
      "grammar_targets": [
        "annoncer une décision (j'ai décidé de quitter le logement, je déménage)",
        "parler des délais (trois mois d'avance, d'ici la fin du bail, le 1er juillet)",
        "le conditionnel de politesse (j'aimerais donner mon avis de départ)"
      ],
      "cultural_notes": "Au Québec, l'avis de départ est un document écrit qui se donne au propriétaire dans les délais prévus par le bail, généralement trois mois avant la fin d'un bail d'un an. La date de départ correspond au dernier jour du bail et l'état des lieux de sortie se fait le jour du déménagement, en même temps que la remise des clés. Penser à donner sa nouvelle adresse et à transférer ou fermer son contrat d'électricité complète la liste des bons réflexes.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hs-augmentation-loyer-tal",
      "title": "Comprendre une augmentation de loyer et le rôle du TAL",
      "description": "Ton propriétaire t'annonce une augmentation de loyer de 60 $ par mois. Tu veux comprendre l'avis de modification et savoir comment répondre avant la date limite.",
      "category": "housing",
      "mode": "both",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Martin Côté, propriétaire d'un petit immeuble à Longueuil. Tu vouvoies le locataire, tu es courtois et tu restes factuel. Annonce que tu as remis un avis de modification de loyer : le loyer passe de 950 $ à 1010 $ par mois, soit une augmentation de 60 $. Explique le processus pratique : le locataire a un mois pour répondre; il peut accepter, refuser ou proposer autre chose; si on ne s'entend pas, le Tribunal administratif du logement (TAL) peut fixer l'augmentation en se basant sur les dépenses de l'immeuble. Réponds aux questions sur ce qui justifie l'augmentation (taxes, assurances, travaux de toiture) et sur le formulaire d'avis. Rappelle la date limite de réponse inscrite sur l'avis. Termine en proposant d'en reparler par courriel. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous avez reçu mon avis de modification de loyer, je suppose. On peut en parler si vous avez des questions, bien sûr.",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant confirme le nouveau montant et la hausse mensuelle",
        "L'apprenant demande ce qui justifie l'augmentation",
        "L'apprenant pose une question sur la date limite pour répondre",
        "L'apprenant s'informe du rôle du TAL en cas de désaccord",
        "L'apprenant remercie et dit comment il répondra"
      ],
      "vocabulary_targets": [
        "augmentation de loyer",
        "loyer",
        "formulaire",
        "entente",
        "TAL"
      ],
      "grammar_targets": [
        "parler d'un montant précis (soixante dollars par mois, mille dix dollars)",
        "exprimer son hésitation (je ne sais pas encore, j'aimerais y penser)",
        "poser des questions de clarification (qu'est-ce qui explique cette augmentation?)"
      ],
      "cultural_notes": "Au Québec, une augmentation de loyer s'annonce par un avis de modification de loyer remis au locataire, qui a généralement un mois pour répondre : accepter, refuser ou négocier. Si les deux parties ne s'entendent pas, le Tribunal administratif du logement (TAL) peut fixer l'augmentation selon les dépenses réelles de l'immeuble (taxes, assurances, travaux). Discuter calmement et répondre par écrit avant la date limite sont les réflexes attendus.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hs-voisin-bruit-politesse",
      "title": "Parler poliment à un voisin du bruit et du déneigement",
      "description": "Ton voisin écoute la musique fort le soir et sa voiture bloque l'entrée quand il neige. Tu frappes à sa porte pour en parler gentiment et trouver une entente.",
      "category": "housing",
      "mode": "casual",
      "level": "branch",
      "target_language": "fr-CA",
      "difficulty": 3,
      "system_prompt": "Tu es Steve Paquette, voisin de palier, un gars sympathique qui tutoie tout le monde. Tu utilises des expressions québécoises naturelles («ouin», «correct», «pas de trouble», «c'est ben correct»). Accueille le voisin à la porte, écoute ses deux demandes : la musique un peu forte le soir et la voiture qui bloque l'entrée du stationnement en hiver. Excuse-toi sincèrement («ah ouais, je m'en rendais pas compte, excuse-moi») et propose des solutions : baisser la musique après vingt-deux heures, déplacer la voiture dès ce soir, et déneiger ton entrée ensemble jeudi. Réponds naturellement à ses questions sur ton horaire de travail (tu travailles de soir) et la vie dans l'immeuble. Termine en confirmant l'entente et en remerciant d'être venu en parler. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Ouais, salut! Ça va? Tu voulais me parler de quelque chose?",
      "expected_turns": 6,
      "success_criteria": [
        "L'apprenant explique le problème de bruit sans agressivité",
        "L'apprenant mentionne le problème de déneigement ou de stationnement",
        "L'apprenant répond au tutoiement et garde un ton cordial",
        "L'apprenant propose ou accepte une entente (volume, horaire, déneigement)",
        "L'apprenant remercie et termine la conversation poliment"
      ],
      "vocabulary_targets": [
        "voisin",
        "bruit",
        "déneigement",
        "entente",
        "plainte"
      ],
      "grammar_targets": [
        "s'excuser et répondre aux excuses (je suis désolé, ce n'est pas grave)",
        "suggérer poliment (est-ce que tu pourrais baisser un peu la musique?)",
        "le tutoiement entre voisins (tu, ton, ta) dans une conversation amicale"
      ],
      "cultural_notes": "Entre voisins au Québec, on parle d'abord directement et poliment : frapper à la porte, s'excuser de déranger et expliquer le problème sans agressivité. Le bruit après vingt-deux heures est mal vu, et l'hiver, le déneigement se règle souvent en s'entraidant. Une entente cordiale évite la plainte au propriétaire ou au TAL, qu'on réserve aux cas qui ne se règlent pas.",
      "is_premium": false,
      "is_published": true
    },
    {
      "id": "qc-hs-sous-location-permission-ete",
      "title": "Demander la permission de sous-louer pour l'été",
      "description": "Tu pars trois mois en été pour un stage à l'extérieur et tu veux sous-louer ton logement. Tu présentes ton projet à ton propriétaire et tu proposes un plan avec un sous-locataire.",
      "category": "housing",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Hélène Lacroix, propriétaire d'un immeuble à Sainte-Foy. Tu vouvoies le locataire, tu es professionnelle mais ouverte à discuter. Écoute le projet de sous-location pour l'été (juin, juillet et août) et pose des questions précises : qui est le sous-locataire, quel âge, où travaille-t-il, peut-il fournir des références. Explique tes conditions : le bail reste au nom du locataire principal qui demeure responsable du loyer; le sous-locataire doit respecter le règlement de l'immeuble; un état des lieux sera fait avant et après la sous-location; tout se confirme par une entente écrite. Propose de rencontrer le sous-locataire avant de donner l'accord. Réponds aux questions sur la durée exacte, le paiement du loyer et les assurances. Termine en confirmant que tu attends les références par courriel. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour! Vous m'appelez pour me parler de votre bail, j'imagine? Allez-y, je vous écoute.",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant présente clairement son projet de sous-location (dates, raison)",
        "L'apprenant décrit le sous-locataire et propose des références",
        "L'apprenant pose des questions sur les conditions du propriétaire",
        "L'apprenant s'entend sur un état des lieux avant et après",
        "L'apprenant confirme les prochaines étapes par écrit"
      ],
      "vocabulary_targets": [
        "sous-location",
        "sous-locataire",
        "entente",
        "état des lieux",
        "loyer",
        "bail"
      ],
      "grammar_targets": [
        "présenter un projet (je pars trois mois, je voudrais sous-louer mon logement)",
        "négocier des conditions (je propose que..., est-ce que ça vous conviendrait?)",
        "le conditionnel pour les hypothèses (si le sous-locataire vous convient, on signe)"
      ],
      "cultural_notes": "Au Québec, la sous-location est une pratique courante en été : le locataire principal garde son bail et demeure responsable du loyer, et le sous-locataire occupe le logement pour une période précise. Le propriétaire doit donner son accord et peut poser des conditions, mais il ne peut pas exiger plus que le loyer en cours. Un état des lieux avant et après, des références et une entente écrite protègent les trois parties.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-hs-contester-retenue-depot",
      "title": "Contester une retenue sur le dépôt",
      "description": "À la fin de ton bail, le propriétaire annonce qu'il retiendra une partie du montant pour des dommages. Tu contestes poliment en t'appuyant sur l'état des lieux d'entrée.",
      "category": "housing",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Richard Lemieux, propriétaire d'un appartement à Gatineau. Tu vouvoies le locataire, tu es poli mais ferme au départ. Annonce qu'il faudra retenir une partie du montant versé à l'entrée pour des dommages : une porte rayée et des marques au plancher du salon. Écoute la contestation : le locataire rappelle que l'état des lieux d'entrée notait déjà ces marques et propose de te montrer les photos. Demande de recevoir les photos et le détail par courriel, et propose de revoir l'état des lieux ensemble. Explique que tu veux un décompte clair des dommages avant de décider, et accepte de discuter d'une entente si les photos confirment la version du locataire. Termine en proposant de se reparler après vérification. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Richard Lemieux à l'appareil. Je vous appelle parce qu'on a fait l'état des lieux de sortie hier, et il y a quelques points à discuter.",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant conteste poliment la retenue annoncée",
        "L'apprenant rappelle ce que l'état des lieux d'entrée indiquait",
        "L'apprenant propose une preuve (photos, témoignage) et un décompte",
        "L'apprenant demande une réponse écrite par courriel",
        "L'apprenant maintient un ton calme et propose une entente"
      ],
      "vocabulary_targets": [
        "retenue",
        "décompte",
        "dégât",
        "preuve",
        "inspection"
      ],
      "grammar_targets": [
        "contester poliment (je ne suis pas d'accord, permettez-moi de vous montrer...)",
        "rappeler des faits (l'état des lieux d'entrée indique que la porte était déjà rayée)",
        "demander une preuve écrite (pourriez-vous m'envoyer le décompte par courriel?)"
      ],
      "cultural_notes": "À la fin d'un bail au Québec, l'état des lieux d'entrée est la référence pour juger des dommages : si une marque y était déjà notée, elle ne peut pas être reprochée au locataire. Un propriétaire qui veut retenir un montant doit fournir un décompte clair, et les photos prises à l'entrée sont une preuve précieuse. Discuter calmement, demander l'écrit et proposer une entente évitent souvent d'en arriver au Tribunal administratif du logement.",
      "is_premium": true,
      "is_published": true
    },
    {
      "id": "qc-hs-assurance-habitation-reclamation",
      "title": "Comprendre son assurance habitation et faire une réclamation",
      "description": "Un dégât d'eau dans ta salle de bain a abîmé le plancher du salon. Tu appelles ton assureur pour comprendre ta couverture et faire une réclamation.",
      "category": "housing",
      "mode": "both",
      "level": "bloom",
      "target_language": "fr-CA",
      "difficulty": 4,
      "system_prompt": "Tu es Sophie Martin, agente d'assurance chez un assureur québécois. Tu vouvoies l'apprenant, tu expliques clairement sans jargon. Accueille l'appel pour un dégât d'eau : écoute ce qui s'est passé (la laveuse a fui, le plancher du salon a gonflé). Explique la couverture du locataire : le contenu (tes biens) et la responsabilité civile, avec une franchise de 250 $. Guide la réclamation : numéro de dossier, photos des dégâts et des reçus à envoyer par courriel, puis un expert peut passer cette semaine pour évaluer. Réponds aux questions sur ce qui est couvert (le bâtiment est généralement à la charge de l'assureur du propriétaire, tes biens abîmés sont couverts) et sur le remboursement et les délais. Termine en confirmant les prochaines étapes et le numéro de dossier. Si une phrase de l'apprenant est bancale, reformule-la doucement dans ta réponse avant de poursuivre — jamais de correction brutale.",
      "opening_line": "Bonjour, Sophie Martin, agente d'assurance. Vous appelez pour un dégât d'eau, c'est bien ça? Racontez-moi ce qui s'est passé.",
      "expected_turns": 7,
      "success_criteria": [
        "L'apprenant raconte le dégât d'eau (où, quand, ce qui est abîmé)",
        "L'apprenant pose des questions sur la couverture et la franchise",
        "L'apprenant comprend ce qu'il doit envoyer (photos, reçus, détail)",
        "L'apprenant note le numéro de dossier et les prochaines étapes",
        "L'apprenant remercie et termine l'appel poliment"
      ],
      "vocabulary_targets": [
        "assurance habitation",
        "réclamation",
        "franchise",
        "sinistre",
        "remboursement",
        "preuve"
      ],
      "grammar_targets": [
        "raconter un événement au passé composé (la laveuse a fui, le plancher a gonflé)",
        "poser des questions sur la couverture (est-ce que mes biens sont couverts?)",
        "comprendre un montant (la franchise est de deux cent cinquante dollars)"
      ],
      "cultural_notes": "L'assurance habitation pour locataires est très courante au Québec et souvent exigée par le bail : elle couvre le contenu du logement et la responsabilité civile. En cas de dégât d'eau, on fait vite une réclamation avec des photos et les reçus des biens abîmés, et l'assureur envoie un expert pour évaluer. La franchise (souvent 250 $) reste à la charge du locataire, et le bâtiment lui-même est généralement couvert par l'assureur du propriétaire.",
      "is_premium": true,
      "is_published": true
    }
  ],
  "vocabulary": [
    {
      "id": "vocab-qhs-01",
      "word": "loyer",
      "phonetic": "/lwa.je/",
      "translations": {
        "en": "rent",
        "pa": "ਕਿਰਾਇਆ",
        "hi": "किराया",
        "zh": "租金",
        "es": "alquiler"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "Mon loyer est de 980 $ par mois, chauffage compris.",
        "Le loyer se paie le premier du mois, par chèque ou dépôt direct."
      ],
      "confusion_pairs": [
        "bail",
        "locataire"
      ],
      "fsrs_params": {
        "difficulty": 0.2,
        "stability": 4.8
      }
    },
    {
      "id": "vocab-qhs-02",
      "word": "logement",
      "phonetic": "/lɔʒ.mɑ̃/",
      "translations": {
        "en": "housing",
        "pa": "ਰਿਹਾਇਸ਼",
        "hi": "आवास",
        "zh": "住房",
        "es": "vivienda"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "J'ai trouvé un logement au troisième étage, très lumineux.",
        "Le logement est disponible le 1er juillet."
      ],
      "confusion_pairs": [
        "appartement",
        "maison"
      ],
      "fsrs_params": {
        "difficulty": 0.21,
        "stability": 4.7
      }
    },
    {
      "id": "vocab-qhs-03",
      "word": "bail",
      "phonetic": "/baj/",
      "translations": {
        "en": "lease",
        "pa": "ਪਟਾ",
        "hi": "पट्टा",
        "zh": "租约",
        "es": "contrato de alquiler"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "J'ai signé le bail pour un an, à compter du 1er juillet.",
        "Avant de signer le bail, lis chaque page attentivement."
      ],
      "confusion_pairs": [
        "contrat",
        "loyer"
      ],
      "fsrs_params": {
        "difficulty": 0.22,
        "stability": 4.6
      }
    },
    {
      "id": "vocab-qhs-04",
      "word": "appartement",
      "phonetic": "/a.paʁ.tə.mɑ̃/",
      "translations": {
        "en": "apartment",
        "pa": "ਅਪਾਰਟਮੈਂਟ",
        "hi": "अपार्टमेंट",
        "zh": "公寓",
        "es": "apartamento"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "Son appartement est au centre-ville, près du métro.",
        "On visite un appartement de deux chambres samedi."
      ],
      "confusion_pairs": [
        "logement",
        "condo"
      ],
      "fsrs_params": {
        "difficulty": 0.2,
        "stability": 4.5
      }
    },
    {
      "id": "vocab-qhs-05",
      "word": "clé",
      "phonetic": "/kle/",
      "translations": {
        "en": "key",
        "pa": "ਚਾਬੀ",
        "hi": "चाबी",
        "zh": "钥匙",
        "es": "llave"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "J'ai reçu deux jeux de clés le jour de l'emménagement.",
        "N'oublie pas ta clé, je rentre tard ce soir."
      ],
      "confusion_pairs": [
        "serrure",
        "porte"
      ],
      "fsrs_params": {
        "difficulty": 0.24,
        "stability": 4.4
      }
    },
    {
      "id": "vocab-qhs-06",
      "word": "chauffage",
      "phonetic": "/ʃo.faʒ/",
      "translations": {
        "en": "heating",
        "pa": "ਹੀਟਿੰਗ",
        "hi": "हीटिंग",
        "zh": "暖气",
        "es": "calefacción"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "Le chauffage est électrique et compris dans le loyer.",
        "Depuis deux jours, le chauffage ne fonctionne plus."
      ],
      "confusion_pairs": [
        "thermostat",
        "chauffe-eau"
      ],
      "fsrs_params": {
        "difficulty": 0.23,
        "stability": 4.3
      }
    },
    {
      "id": "vocab-qhs-07",
      "word": "électricité",
      "phonetic": "/e.lɛk.tʁi.si.te/",
      "translations": {
        "en": "electricity",
        "pa": "ਬਿਜਲੀ",
        "hi": "बिजली",
        "zh": "电力",
        "es": "electricidad"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "L'électricité est à part : il faut ouvrir un compte chez Hydro-Québec.",
        "En hiver, l'électricité coûte plus cher à cause du chauffage."
      ],
      "confusion_pairs": [
        "hydro",
        "courant"
      ],
      "fsrs_params": {
        "difficulty": 0.25,
        "stability": 4.2
      }
    },
    {
      "id": "vocab-qhs-08",
      "word": "propriétaire",
      "phonetic": "/pʁɔ.pʁi.je.tɛʁ/",
      "translations": {
        "en": "landlord",
        "pa": "ਮਕਾਨ ਮਾਲਕ",
        "hi": "मकान मालिक",
        "zh": "房东",
        "es": "propietario"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "Le propriétaire habite au rez-de-chaussée de l'immeuble.",
        "J'ai appelé le propriétaire pour signaler une réparation."
      ],
      "confusion_pairs": [
        "locateur",
        "locataire"
      ],
      "fsrs_params": {
        "difficulty": 0.24,
        "stability": 4.1
      }
    },
    {
      "id": "vocab-qhs-09",
      "word": "fenêtre",
      "phonetic": "/fə.nɛtʁ/",
      "translations": {
        "en": "window",
        "pa": "ਖਿੜਕੀ",
        "hi": "खिड़की",
        "zh": "窗户",
        "es": "ventana"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "La fenêtre du salon donne sur la cour.",
        "Il y a un peu d'air froid qui passe par la fenêtre."
      ],
      "confusion_pairs": [
        "vitre",
        "balcon"
      ],
      "fsrs_params": {
        "difficulty": 0.26,
        "stability": 4.0
      }
    },
    {
      "id": "vocab-qhs-10",
      "word": "porte",
      "phonetic": "/pɔʁt/",
      "translations": {
        "en": "door",
        "pa": "ਦਰਵਾਜ਼ਾ",
        "hi": "दरवाज़ा",
        "zh": "门",
        "es": "puerta"
      },
      "level": "seed",
      "category": "housing",
      "example_sentences": [
        "La porte d'entrée se verrouille avec une clé.",
        "Le voisin a frappé à ma porte pour me parler du bruit."
      ],
      "confusion_pairs": [
        "entrée",
        "escalier"
      ],
      "fsrs_params": {
        "difficulty": 0.25,
        "stability": 3.9
      }
    },
    {
      "id": "vocab-qhs-11",
      "word": "dépôt",
      "phonetic": "/de.po/",
      "translations": {
        "en": "deposit",
        "pa": "ਜਮ੍ਹਾਂ",
        "hi": "जमा",
        "zh": "押金",
        "es": "depósito"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "J'ai payé le premier mois d'avance comme dépôt.",
        "Le dépôt s'applique au premier mois de loyer."
      ],
      "confusion_pairs": [
        "acompte",
        "versement"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 3.9
      }
    },
    {
      "id": "vocab-qhs-12",
      "word": "état des lieux",
      "phonetic": "/e.ta de ljø/",
      "translations": {
        "en": "move-in inspection",
        "pa": "ਸਥਿਤੀ ਰਿਪੋਰਟ",
        "hi": "स्थिति रिपोर्ट",
        "zh": "入住检查",
        "es": "inventario del estado"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "On a fait l'état des lieux pièce par pièce à mon arrivée.",
        "L'état des lieux d'entrée note déjà les marques au plancher."
      ],
      "confusion_pairs": [
        "inspection",
        "constat"
      ],
      "fsrs_params": {
        "difficulty": 0.32,
        "stability": 3.7
      }
    },
    {
      "id": "vocab-qhs-13",
      "word": "avis de départ",
      "phonetic": "/a.vi də de.paʁ/",
      "translations": {
        "en": "notice of departure",
        "pa": "ਜਾਣ ਦਾ ਨੋਟਿਸ",
        "hi": "जाने की सूचना",
        "zh": "退租通知",
        "es": "aviso de salida"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "J'ai remis mon avis de départ trois mois avant la fin du bail.",
        "L'avis de départ se donne par écrit au propriétaire."
      ],
      "confusion_pairs": [
        "préavis",
        "résiliation"
      ],
      "fsrs_params": {
        "difficulty": 0.31,
        "stability": 3.6
      }
    },
    {
      "id": "vocab-qhs-14",
      "word": "préavis",
      "phonetic": "/pʁe.a.vi/",
      "translations": {
        "en": "notice period",
        "pa": "ਨੋਟਿਸ ਅਵਧੀ",
        "hi": "नोटिस अवधि",
        "zh": "通知期",
        "es": "preaviso"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Mon bail demande un préavis de trois mois.",
        "Si tu donnes ton préavis en retard, vérifie ton bail."
      ],
      "confusion_pairs": [
        "avis de départ",
        "délai"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 3.6
      }
    },
    {
      "id": "vocab-qhs-15",
      "word": "sous-location",
      "phonetic": "/su.lɔ.ka.sjɔ̃/",
      "translations": {
        "en": "sublet",
        "pa": "ਉਪ-ਕਿਰਾਇਆ",
        "hi": "उप-किराया",
        "zh": "转租",
        "es": "subarriendo"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "La sous-location pour l'été doit être approuvée par le propriétaire.",
        "Il a fait une sous-location pendant ses trois mois d'absence."
      ],
      "confusion_pairs": [
        "colocation",
        "sous-locataire"
      ],
      "fsrs_params": {
        "difficulty": 0.34,
        "stability": 3.5
      }
    },
    {
      "id": "vocab-qhs-16",
      "word": "augmentation de loyer",
      "phonetic": "/ɔɡ.mɑ̃.ta.sjɔ̃ də lwa.je/",
      "translations": {
        "en": "rent increase",
        "pa": "ਕਿਰਾਇਆ ਵਾਧਾ",
        "hi": "किराया वृद्धि",
        "zh": "涨租",
        "es": "aumento de alquiler"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "J'ai reçu un avis d'augmentation de loyer de 40 $ par mois.",
        "L'augmentation de loyer s'explique par les taxes et les assurances."
      ],
      "confusion_pairs": [
        "hausse",
        "majoration"
      ],
      "fsrs_params": {
        "difficulty": 0.33,
        "stability": 3.4
      }
    },
    {
      "id": "vocab-qhs-17",
      "word": "voisin",
      "phonetic": "/vwa.zɛ̃/",
      "translations": {
        "en": "neighbour",
        "pa": "ਗੁਆਂਢੀ",
        "hi": "पड़ोसी",
        "zh": "邻居",
        "es": "vecino"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Mon voisin m'a aidé à déneiger l'entrée.",
        "Parle à ton voisin avant de porter plainte."
      ],
      "confusion_pairs": [
        "voisine",
        "concierge"
      ],
      "fsrs_params": {
        "difficulty": 0.31,
        "stability": 3.5
      }
    },
    {
      "id": "vocab-qhs-18",
      "word": "bruit",
      "phonetic": "/bʁɥi/",
      "translations": {
        "en": "noise",
        "pa": "ਰੌਲਾ",
        "hi": "शोर",
        "zh": "噪音",
        "es": "ruido"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Il y a du bruit de la rue jusqu'à tard le soir.",
        "La musique est trop forte, le bruit traverse le mur."
      ],
      "confusion_pairs": [
        "tapage",
        "vacarme"
      ],
      "fsrs_params": {
        "difficulty": 0.3,
        "stability": 3.4
      }
    },
    {
      "id": "vocab-qhs-19",
      "word": "déneigement",
      "phonetic": "/de.nɛʒ.mɑ̃/",
      "translations": {
        "en": "snow removal",
        "pa": "ਬਰਫ਼ ਹਟਾਉਣਾ",
        "hi": "बर्फ़ हटाना",
        "zh": "除雪",
        "es": "quitanieves"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Le déneigement de l'entrée se fait avant sept heures le matin.",
        "On s'entraide pour le déneigement entre voisins."
      ],
      "confusion_pairs": [
        "déblaiement",
        "pelletage"
      ],
      "fsrs_params": {
        "difficulty": 0.34,
        "stability": 3.3
      }
    },
    {
      "id": "vocab-qhs-20",
      "word": "réparation",
      "phonetic": "/ʁe.pa.ʁa.sjɔ̃/",
      "translations": {
        "en": "repair",
        "pa": "ਮੁਰੰਮਤ",
        "hi": "मरम्मत",
        "zh": "维修",
        "es": "reparación"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Le plombier viendra pour la réparation jeudi avant-midi.",
        "J'ai demandé une réparation pour la fenêtre qui ferme mal."
      ],
      "confusion_pairs": [
        "entretien",
        "rénovation"
      ],
      "fsrs_params": {
        "difficulty": 0.32,
        "stability": 3.3
      }
    },
    {
      "id": "vocab-qhs-21",
      "word": "moisissure",
      "phonetic": "/mwa.zi.syʁ/",
      "translations": {
        "en": "mold",
        "pa": "ਉੱਲੀ",
        "hi": "फफूंदी",
        "zh": "霉菌",
        "es": "moho"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Il y a de la moisissure dans le coin de la salle de bain.",
        "La moisissure apparaît souvent à cause de l'humidité."
      ],
      "confusion_pairs": [
        "humidité",
        "condensation"
      ],
      "fsrs_params": {
        "difficulty": 0.35,
        "stability": 3.2
      }
    },
    {
      "id": "vocab-qhs-22",
      "word": "plomberie",
      "phonetic": "/plɔ̃.bʁi/",
      "translations": {
        "en": "plumbing",
        "pa": "ਪਲੰਬਿੰਗ",
        "hi": "प्लंबिंग",
        "zh": "水管",
        "es": "fontanería"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "L'évier de la cuisine coule, c'est un problème de plomberie.",
        "Le propriétaire a fait vérifier la plomberie de l'immeuble."
      ],
      "confusion_pairs": [
        "tuyauterie",
        "évier"
      ],
      "fsrs_params": {
        "difficulty": 0.33,
        "stability": 3.2
      }
    },
    {
      "id": "vocab-qhs-23",
      "word": "électroménager",
      "phonetic": "/e.lɛk.tʁɔ.me.na.ʒe/",
      "translations": {
        "en": "appliances",
        "pa": "ਘਰੇਲੂ ਉਪਕਰਨ",
        "hi": "घरेलू उपकरण",
        "zh": "家电",
        "es": "electrodomésticos"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Le logement se loue avec les électroménagers : frigo, cuisinière et laveuse.",
        "Les électroménagers sont en bon état, sauf le frigo qui fait du bruit."
      ],
      "confusion_pairs": [
        "appareil",
        "gadget"
      ],
      "fsrs_params": {
        "difficulty": 0.35,
        "stability": 3.1
      }
    },
    {
      "id": "vocab-qhs-24",
      "word": "compteur",
      "phonetic": "/kɔ̃.tœʁ/",
      "translations": {
        "en": "meter",
        "pa": "ਮੀਟਰ",
        "hi": "मीटर",
        "zh": "电表",
        "es": "contador"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "Le numéro du compteur d'électricité est sur le bail.",
        "Hydro-Québec demande le numéro du compteur pour ouvrir le contrat."
      ],
      "confusion_pairs": [
        "disjoncteur",
        "panneau"
      ],
      "fsrs_params": {
        "difficulty": 0.34,
        "stability": 3.1
      }
    },
    {
      "id": "vocab-qhs-25",
      "word": "colocation",
      "phonetic": "/kɔ.lɔ.ka.sjɔ̃/",
      "translations": {
        "en": "shared flat",
        "pa": "ਸਾਂਝਾ ਮਕਾਨ",
        "hi": "साझा मकान",
        "zh": "合租",
        "es": "piso compartido"
      },
      "level": "sprout",
      "category": "housing",
      "example_sentences": [
        "On est en colocation à deux dans un 4 ½.",
        "La colocation, c'est pratique pour partager le loyer."
      ],
      "confusion_pairs": [
        "sous-location",
        "logement partagé"
      ],
      "fsrs_params": {
        "difficulty": 0.36,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-qhs-26",
      "word": "locataire",
      "phonetic": "/lɔ.ka.tɛʁ/",
      "translations": {
        "en": "tenant",
        "pa": "ਕਿਰਾਏਦਾਰ",
        "hi": "किराएदार",
        "zh": "租客",
        "es": "inquilino"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Le locataire doit signaler les problèmes rapidement.",
        "Chaque locataire a son entrée dans le triplex."
      ],
      "confusion_pairs": [
        "locateur",
        "propriétaire"
      ],
      "fsrs_params": {
        "difficulty": 0.4,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-qhs-27",
      "word": "formulaire",
      "phonetic": "/fɔʁ.my.lɛʁ/",
      "translations": {
        "en": "form",
        "pa": "ਫਾਰਮ",
        "hi": "फॉर्म",
        "zh": "表格",
        "es": "formulario"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "J'ai rempli le formulaire d'avis de modification de loyer.",
        "Le formulaire se signe et se remet au propriétaire."
      ],
      "confusion_pairs": [
        "document",
        "demande"
      ],
      "fsrs_params": {
        "difficulty": 0.39,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-qhs-28",
      "word": "assurance habitation",
      "phonetic": "/a.sy.ʁɑ̃s a.bi.ta.sjɔ̃/",
      "translations": {
        "en": "home insurance",
        "pa": "ਘਰ ਬੀਮਾ",
        "hi": "गृह बीमा",
        "zh": "房屋保险",
        "es": "seguro de hogar"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Mon bail exige une assurance habitation pour locataire.",
        "L'assurance habitation couvre mes biens et ma responsabilité."
      ],
      "confusion_pairs": [
        "assurance locataire",
        "assurance vie"
      ],
      "fsrs_params": {
        "difficulty": 0.42,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-qhs-29",
      "word": "réclamation",
      "phonetic": "/ʁe.kla.ma.sjɔ̃/",
      "translations": {
        "en": "claim",
        "pa": "ਦਾਅਵਾ",
        "hi": "दावा",
        "zh": "理赔",
        "es": "reclamación"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "J'ai fait une réclamation après le dégât d'eau.",
        "L'assureur demande des photos pour la réclamation."
      ],
      "confusion_pairs": [
        "demande",
        "plainte"
      ],
      "fsrs_params": {
        "difficulty": 0.41,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-qhs-30",
      "word": "franchise",
      "phonetic": "/fʁɑ̃.ʃiz/",
      "translations": {
        "en": "deductible",
        "pa": "ਕਟੌਤੀ",
        "hi": "कटौती",
        "zh": "免赔额",
        "es": "franquicia"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "La franchise de mon assurance est de 250 $.",
        "Je paie la franchise, l'assureur paie le reste."
      ],
      "confusion_pairs": [
        "déductible",
        "prime"
      ],
      "fsrs_params": {
        "difficulty": 0.43,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qhs-31",
      "word": "sinistre",
      "phonetic": "/si.nistʁ/",
      "translations": {
        "en": "insured loss",
        "pa": "ਨੁਕਸਾਨ ਘਟਨਾ",
        "hi": "हानि घटना",
        "zh": "事故损失",
        "es": "siniestro"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Le dégât d'eau est un sinistre couvert par mon assurance.",
        "Après le sinistre, un expert est venu évaluer les dégâts."
      ],
      "confusion_pairs": [
        "dégât",
        "accident"
      ],
      "fsrs_params": {
        "difficulty": 0.44,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qhs-32",
      "word": "entente",
      "phonetic": "/ɑ̃.tɑ̃t/",
      "translations": {
        "en": "agreement",
        "pa": "ਸਮਝੌਤਾ",
        "hi": "समझौता",
        "zh": "协议",
        "es": "acuerdo"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "On a trouvé une entente pour le déneigement.",
        "Une entente écrite protège le locataire et le propriétaire."
      ],
      "confusion_pairs": [
        "accord",
        "contrat"
      ],
      "fsrs_params": {
        "difficulty": 0.4,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-qhs-33",
      "word": "courriel",
      "phonetic": "/ku.ʁjɛl/",
      "translations": {
        "en": "email",
        "pa": "ਈਮੇਲ",
        "hi": "ईमेल",
        "zh": "电子邮件",
        "es": "correo electrónico"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Envoie-moi les photos par courriel, s'il te plaît.",
        "Je t'ai écrit un courriel avec le détail des réparations."
      ],
      "confusion_pairs": [
        "courrier",
        "message"
      ],
      "fsrs_params": {
        "difficulty": 0.38,
        "stability": 3.0
      }
    },
    {
      "id": "vocab-qhs-34",
      "word": "plainte",
      "phonetic": "/plɛ̃t/",
      "translations": {
        "en": "complaint",
        "pa": "ਸ਼ਿਕਾਇਤ",
        "hi": "शिकायत",
        "zh": "投诉",
        "es": "queja"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Je préfère parler au voisin avant de porter plainte.",
        "La plainte se dépose au Tribunal administratif du logement en dernier recours."
      ],
      "confusion_pairs": [
        "réclamation",
        "protestation"
      ],
      "fsrs_params": {
        "difficulty": 0.42,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qhs-35",
      "word": "dégât",
      "phonetic": "/de.ɡɑ/",
      "translations": {
        "en": "damage",
        "pa": "ਨੁਕਸਾਨ",
        "hi": "क्षति",
        "zh": "损坏",
        "es": "daño"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Il y a un dégât d'eau dans la salle de bain.",
        "Les dégâts au plancher étaient déjà là à mon arrivée."
      ],
      "confusion_pairs": [
        "dommage",
        "défaut"
      ],
      "fsrs_params": {
        "difficulty": 0.43,
        "stability": 2.7
      }
    },
    {
      "id": "vocab-qhs-36",
      "word": "TAL",
      "phonetic": "/te.a.ɛl/",
      "translations": {
        "en": "housing tribunal (TAL)",
        "pa": "ਟੀ.ਏ.ਐੱਲ.",
        "hi": "टी.ए.एल.",
        "zh": "租房法庭",
        "es": "TAL"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Le TAL peut fixer l'augmentation de loyer si on ne s'entend pas.",
        "On a décidé d'aller au TAL pour régler le litige."
      ],
      "confusion_pairs": [
        "tribunal",
        "régie"
      ],
      "fsrs_params": {
        "difficulty": 0.45,
        "stability": 2.6
      }
    },
    {
      "id": "vocab-qhs-37",
      "word": "sous-locataire",
      "phonetic": "/su.lɔ.ka.tɛʁ/",
      "translations": {
        "en": "subtenant",
        "pa": "ਉਪ-ਕਿਰਾਏਦਾਰ",
        "hi": "उप-किराएदार",
        "zh": "转租客",
        "es": "subinquilino"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Le sous-locataire occupera le logement de juin à août.",
        "Le sous-locataire doit fournir des références."
      ],
      "confusion_pairs": [
        "colocataire",
        "locataire"
      ],
      "fsrs_params": {
        "difficulty": 0.44,
        "stability": 2.6
      }
    },
    {
      "id": "vocab-qhs-38",
      "word": "thermostat",
      "phonetic": "/tɛʁ.mɔs.ta/",
      "translations": {
        "en": "thermostat",
        "pa": "ਥਰਮੋਸਟੈਟ",
        "hi": "थर्मोस्टेट",
        "zh": "恒温器",
        "es": "termostato"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Le thermostat est dans le corridor, près de la chambre.",
        "Monte le thermostat à vingt et un degrés en hiver."
      ],
      "confusion_pairs": [
        "chauffe-eau",
        "thermopompe"
      ],
      "fsrs_params": {
        "difficulty": 0.4,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qhs-39",
      "word": "adresse",
      "phonetic": "/a.dʁɛs/",
      "translations": {
        "en": "address",
        "pa": "ਪਤਾ",
        "hi": "पता",
        "zh": "地址",
        "es": "dirección"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Donne ta nouvelle adresse au propriétaire pour la correspondance.",
        "L'adresse du logement est au 4567, rue de la Gauchetière."
      ],
      "confusion_pairs": [
        "adresse civique",
        "adresse postale"
      ],
      "fsrs_params": {
        "difficulty": 0.38,
        "stability": 2.9
      }
    },
    {
      "id": "vocab-qhs-40",
      "word": "pièce",
      "phonetic": "/pjɛs/",
      "translations": {
        "en": "room",
        "pa": "ਕਮਰਾ",
        "hi": "कमरा",
        "zh": "房间",
        "es": "habitación"
      },
      "level": "branch",
      "category": "housing",
      "example_sentences": [
        "Un 3 ½, c'est trois pièces et demie.",
        "La plus grande pièce du logement, c'est le salon."
      ],
      "confusion_pairs": [
        "chambre",
        "salle"
      ],
      "fsrs_params": {
        "difficulty": 0.39,
        "stability": 2.8
      }
    },
    {
      "id": "vocab-qhs-41",
      "word": "retenue",
      "phonetic": "/ʁə.tə.ny/",
      "translations": {
        "en": "withholding",
        "pa": "ਰੋਕੀ ਰਕਮ",
        "hi": "रोकी राशि",
        "zh": "扣留",
        "es": "retención"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "Le propriétaire veut faire une retenue sur le montant pour des dommages.",
        "La retenue doit s'appuyer sur un décompte clair."
      ],
      "confusion_pairs": [
        "déduction",
        "saisie"
      ],
      "fsrs_params": {
        "difficulty": 0.5,
        "stability": 2.5
      }
    },
    {
      "id": "vocab-qhs-42",
      "word": "médiation",
      "phonetic": "/me.dja.sjɔ̃/",
      "translations": {
        "en": "mediation",
        "pa": "ਮੱਧਸਥਤਾ",
        "hi": "मध्यस्थता",
        "zh": "调解",
        "es": "mediación"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "La médiation peut aider à régler le conflit sans aller au TAL.",
        "On a proposé une médiation pour trouver une entente."
      ],
      "confusion_pairs": [
        "conciliation",
        "arbitrage"
      ],
      "fsrs_params": {
        "difficulty": 0.52,
        "stability": 2.4
      }
    },
    {
      "id": "vocab-qhs-43",
      "word": "preuve",
      "phonetic": "/pʁœv/",
      "translations": {
        "en": "proof, evidence",
        "pa": "ਸਬੂਤ",
        "hi": "सबूत",
        "zh": "证据",
        "es": "prueba"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "Les photos de l'état des lieux sont une bonne preuve.",
        "Envoie tes preuves par courriel avant la rencontre."
      ],
      "confusion_pairs": [
        "photo",
        "témoignage"
      ],
      "fsrs_params": {
        "difficulty": 0.5,
        "stability": 2.5
      }
    },
    {
      "id": "vocab-qhs-44",
      "word": "remboursement",
      "phonetic": "/ʁɑ̃.buʁ.sə.mɑ̃/",
      "translations": {
        "en": "reimbursement",
        "pa": "ਵਾਪਸੀ",
        "hi": "वापसी",
        "zh": "报销",
        "es": "reembolso"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "L'assureur a confirmé le remboursement des biens abîmés.",
        "J'attends le remboursement du dépôt par chèque."
      ],
      "confusion_pairs": [
        "dédommagement",
        "crédit"
      ],
      "fsrs_params": {
        "difficulty": 0.51,
        "stability": 2.4
      }
    },
    {
      "id": "vocab-qhs-45",
      "word": "décompte",
      "phonetic": "/de.kɔ̃t/",
      "translations": {
        "en": "itemized breakdown",
        "pa": "ਵੇਰਵਾ",
        "hi": "विवरण",
        "zh": "明细",
        "es": "desglose"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "Demande un décompte détaillé des dommages au propriétaire.",
        "Le décompte liste chaque réparation et son coût."
      ],
      "confusion_pairs": [
        "relevé",
        "détail"
      ],
      "fsrs_params": {
        "difficulty": 0.53,
        "stability": 2.3
      }
    },
    {
      "id": "vocab-qhs-46",
      "word": "inspection",
      "phonetic": "/ɛ̃s.pɛk.sjɔ̃/",
      "translations": {
        "en": "inspection",
        "pa": "ਨਿਰੀਖਣ",
        "hi": "निरीक्षण",
        "zh": "检查",
        "es": "inspección"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "L'inspection de l'immeuble a lieu la semaine prochaine.",
        "L'expert a fait une inspection après le sinistre."
      ],
      "confusion_pairs": [
        "visite",
        "vérification"
      ],
      "fsrs_params": {
        "difficulty": 0.52,
        "stability": 2.3
      }
    },
    {
      "id": "vocab-qhs-47",
      "word": "résiliation",
      "phonetic": "/ʁe.zi.lja.sjɔ̃/",
      "translations": {
        "en": "termination",
        "pa": "ਖਤਮ ਕਰਨਾ",
        "hi": "समापन",
        "zh": "解除",
        "es": "rescisión"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "La résiliation du bail se fait avec un avis de départ.",
        "Il a demandé la résiliation de son bail pour le 1er août."
      ],
      "confusion_pairs": [
        "annulation",
        "fin de bail"
      ],
      "fsrs_params": {
        "difficulty": 0.54,
        "stability": 2.2
      }
    },
    {
      "id": "vocab-qhs-48",
      "word": "indemnité",
      "phonetic": "/ɛ̃.dɛm.ni.te/",
      "translations": {
        "en": "compensation",
        "pa": "ਮੁਆਵਜ਼ਾ",
        "hi": "मुआवज़ा",
        "zh": "赔偿金",
        "es": "indemnización"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "L'assureur versera une indemnité pour les dommages couverts.",
        "L'indemnité couvre la valeur de remplacement des biens."
      ],
      "confusion_pairs": [
        "compensation",
        "dédommagement"
      ],
      "fsrs_params": {
        "difficulty": 0.55,
        "stability": 2.2
      }
    },
    {
      "id": "vocab-qhs-49",
      "word": "litige",
      "phonetic": "/li.tiʒ/",
      "translations": {
        "en": "dispute",
        "pa": "ਵਿਵਾਦ",
        "hi": "विवाद",
        "zh": "纠纷",
        "es": "litigio"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "Le litige porte sur l'augmentation de loyer.",
        "Un litige se règle souvent plus vite par la discussion que devant le tribunal."
      ],
      "confusion_pairs": [
        "différend",
        "conflit"
      ],
      "fsrs_params": {
        "difficulty": 0.56,
        "stability": 2.1
      }
    },
    {
      "id": "vocab-qhs-50",
      "word": "arriérés",
      "phonetic": "/a.ʁje.ʁe/",
      "translations": {
        "en": "arrears",
        "pa": "ਬਕਾਇਆ",
        "hi": "बकाया",
        "zh": "欠款",
        "es": "atrasos"
      },
      "level": "bloom",
      "category": "housing",
      "example_sentences": [
        "Il y a deux mois d'arriérés de loyer à rattraper.",
        "Les arriérés s'accumulent quand on ne paie pas à temps."
      ],
      "confusion_pairs": [
        "retards",
        "dettes"
      ],
      "fsrs_params": {
        "difficulty": 0.58,
        "stability": 2.0
      }
    }
  ]
}