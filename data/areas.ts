import { serviceSlugs, type ServiceSlug } from '@/data/services';

export const areaSlugs = [
  // 1. Έδρα & Όμοροι Δήμοι
  'kallithea',
  'nea-smyrni',
  'palaio-faliro',
  'moschato-tavros',
  'agios-dimitrios',
  // 2. Κέντρο Αθήνας (Ανά Γειτονιά & Δήμο)
  'koukaki-neos-kosmos',
  'pagkrati-mets',
  'kolonaki-syntagma',
  'ampelokipoi-goudi-ilisia',
  'kypseli-patisia-galatsi',
  'petralona-thiseio-gkazi',
  'zografou',
  'vyronas-kaisariani',
  'dafni-ymittos',
  // 3. Νότια Προάστια
  'alimos',
  'ilioupoli',
  'argyroupoli-elliniko',
  'glyfada',
  'voula-vari-vouliagmeni',
  // 4. Βόρεια Προάστια
  'marousi',
  'chalandri',
  'agia-paraskevi',
  'cholargos-papagou',
  'psychiko-filothei',
  'vrilissia-melissia-penteli',
  'kifisia-ekali-erythraia',
  'nea-ionia-irakleio-pefki',
  // 5. Δυτικά Προάστια
  'peristeri',
  'aigaleo-chaidari',
  'ilion-petroupoli',
  // 6. Πειραιάς & Ανατολική Αττική
  'peiraias',
  'nikaia-korydallos-keratsini',
  'pallini-gerakas-glyka-nera',
  'paiania-koropi-spata',
  // Regional hub slugs kept for backwards compatibility & broad regional searches
  'athina-kentro',
  'notia-proastia',
  'glyfada-voula',
  'nea-smyrni-faliro',
  'voreia-proastia',
  'marousi-chalandri',
  'kifisia-ekali',
  'dytika-proastia',
  'anatoliki-attiki',
] as const;

export type AreaSlug = (typeof areaSlugs)[number];

export type AreaSector = 'hq' | 'central' | 'south' | 'north' | 'west' | 'piraeus-east' | 'regional';

export interface AreaInfo {
  slug: AreaSlug;
  sector: AreaSector;
  name: Record<'el' | 'en', string>;
  genitive: Record<'el' | 'en', string>;
  isHq?: boolean;
  neighborhoods: Record<'el' | 'en', string[]>;
  localContext: Record<'el' | 'en', string>;
}

export const areas: Record<AreaSlug, AreaInfo> = {
  // === 1. ΕΔΡΑ & ΟΜΟΡΟΙ ΔΗΜΟΙ ===
  kallithea: {
    slug: 'kallithea',
    sector: 'hq',
    isHq: true,
    name: { el: 'Καλλιθέα', en: 'Kallithea' },
    genitive: { el: 'στην Καλλιθέα', en: 'in Kallithea' },
    neighborhoods: {
      el: ['Καλλιθέα Κέντρο', 'Χαροκόπου', 'Τζιτζιφιές', 'Λόφος Σικελίας', 'Αγία Ελεούσα', 'Χρυσάκη', 'Λόφος Φιλαρέτου'],
      en: ['Central Kallithea', 'Charokopou', 'Tzitzifies', 'Lofos Sikelias', 'Agia Eleousa', 'Chrysaki', 'Lofos Filaretou'],
    },
    localContext: {
      el: 'Με έδρα στη Λ. Συγγρού 196 στην Καλλιθέα, βρισκόμαστε δίπλα σας μέσα σε λίγα λεπτά για αυτοψία. Γνωρίζουμε από πρώτο χέρι τις πολυκατοικίες της Καλλιθέας — από τα ρετιρέ και τις ταράτσες στη Χαροκόπου και την Αγία Ελεούσα μέχρι τα κτίρια κοντά στη θάλασσα στις Τζιτζιφιές.',
      en: 'Based at 196 Syngrou Ave in Kallithea, we can be at your property within minutes for an on-site inspection. We know Kallithea apartment buildings firsthand, from penthouses and flat roofs in Charokopou and Agia Eleousa to coastal blocks in Tzitzifies.',
    },
  },

  'nea-smyrni': {
    slug: 'nea-smyrni',
    sector: 'hq',
    name: { el: 'Νέα Σμύρνη', en: 'Nea Smyrni' },
    genitive: { el: 'στη Νέα Σμύρνη', en: 'in Nea Smyrni' },
    neighborhoods: {
      el: ['Πλατεία Νέας Σμύρνης', 'Άνω Νέα Σμύρνη', 'Αγία Φωτεινή', 'Αγία Παρασκευή Ν. Σμύρνης', 'Χρυσάκη', 'Άλσος Νέας Σμύρνης', 'Φάρος'],
      en: ['Nea Smyrni Square', 'Ano Nea Smyrni', 'Agia Foteini', 'Agia Paraskevi', 'Alsos', 'Faros'],
    },
    localContext: {
      el: 'Ακριβώς δίπλα στην έδρα μας στη Λ. Συγγρού, εξυπηρετούμε καθημερινά όλη τη Νέα Σμύρνη. Οι πολυκατοικίες γύρω από την Πλατεία, το Άλσος και την Άνω Νέα Σμύρνη έχουν συχνά ταράτσες με παλιές ασφαλτικές μεμβράνες, ηλιακούς θερμοσίφωνες και διαμερίσματα που ανακαινίζονται για ιδιοκατοίκηση.',
      en: 'Right next door to our Syngrou Ave base, we work across Nea Smyrni every day. Apartment buildings around the Square, the Grove and Ano Nea Smyrni frequently need roof waterproofing renewal, parapet repairs and careful apartment or bathroom renovations.',
    },
  },

  'palaio-faliro': {
    slug: 'palaio-faliro',
    sector: 'hq',
    name: { el: 'Παλαιό Φάληρο', en: 'Palaio Faliro' },
    genitive: { el: 'στο Παλαιό Φάληρο', en: 'in Palaio Faliro' },
    neighborhoods: {
      el: ['Φλοίσβος', 'Μπάτης', 'Έδεμ', 'Αμφιθέα', 'Αγία Βαρβάρα', 'Τροκαντερό', 'Κοψαχείλα'],
      en: ['Flisvos', 'Batis', 'Edem', 'Amfithea', 'Agia Varvara', 'Trocadero', 'Kopsacheila'],
    },
    localContext: {
      el: 'Σε απόσταση λίγων λεπτών μέσω της Λ. Συγγρού και της Αμφιθέας, καλύπτουμε όλο το Παλαιό Φάληρο. Η θαλάσσια αύρα σε Φλοίσβο, Μπάτη και Έδεμ επιβαρύνει τις ταράτσες, τα στηθαία των μπαλκονιών και τα σίδερα οπλισμού, απαιτώντας ανθεκτική στεγανοποίηση και προσεκτική επισκευή σοβάδων.',
      en: 'Just minutes down Syngrou and Amfitheas Ave, we cover all of Palaio Faliro. Sea air along Flisvos, Batis and Edem accelerates wear on flat roofs, balcony parapets and exposed reinforcement steel, calling for durable waterproofing and thorough plaster repairs.',
    },
  },

  'moschato-tavros': {
    slug: 'moschato-tavros',
    sector: 'hq',
    name: { el: 'Μοσχάτο & Ταύρος', en: 'Moschato & Tavros' },
    genitive: { el: 'στο Μοσχάτο & τον Ταύρο', en: 'in Moschato & Tavros' },
    neighborhoods: {
      el: ['Μοσχάτο Κέντρο', 'Παραλία Μοσχάτου', 'Ταύρος', 'Άγιος Ιωάννης Ρέντης (Όρια)', 'Ηλεκτρικός Μοσχάτου'],
      en: ['Central Moschato', 'Moschato Seafront', 'Tavros', 'Moschato Station'],
    },
    localContext: {
      el: 'Άμεση πρόσβαση από την Καλλιθέα σε όλο το Μοσχάτο και τον Ταύρο. Τα κτίρια της περιοχής — τόσο οι οικογενειακές διπλοκατοικίες και πολυκατοικίες όσο και τα ισόγεια καταστήματα και επαγγελματικοί χώροι — παρουσιάζουν συχνά ανάγκες στεγάνωσης ταράτσας, επισκευής υγρασιών και ανακαίνισης.',
      en: 'Directly bordering our Kallithea base, we reach Moschato and Tavros immediately. Local two-storey homes, apartment blocks and ground-floor commercial units often require flat roof waterproofing, damp treatment and interior refurbishment.',
    },
  },

  'agios-dimitrios': {
    slug: 'agios-dimitrios',
    sector: 'hq',
    name: { el: 'Άγιος Δημήτριος (Μπραχάμι)', en: 'Agios Dimitrios (Brachami)' },
    genitive: { el: 'στον Άγιο Δημήτριο', en: 'in Agios Dimitrios' },
    neighborhoods: {
      el: ['Άγιος Δημήτριος Κέντρο', 'Ασύρματος', 'Μοναστήρι', 'Σούλι', 'Ανθέων', 'Μετρό Δάφνης / Αγ. Δημητρίου'],
      en: ['Agios Dimitrios Center', 'Asyrmatos', 'Monastiri', 'Souli', 'Antheon'],
    },
    localContext: {
      el: 'Εξυπηρετούμε καθημερινά τον Άγιο Δημήτριο (Μπραχάμι) σε λίγα λεπτά από την έδρα μας. Οι πολλές οικογενειακές πολυκατοικίες και μονοκατοικίες της περιοχής χρειάζονται συχνά μόνωση ταράτσας κάτω από ηλιακούς, επισκευή στηθαίων, ανακαίνιση μπάνιου και φρεσκάρισμα εσωτερικών και εξωτερικών τοίχων.',
      en: 'We serve Agios Dimitrios (Brachami) daily within minutes from our base. The area’s family apartment buildings and houses frequently call for roof waterproofing around solar heaters, parapet repairs, bathroom renovations and interior or exterior painting.',
    },
  },

  // === 2. ΚΕΝΤΡΟ ΑΘΗΝΑΣ (ΑΝΑ ΓΕΙΤΟΝΙΑ & ΔΗΜΟ) ===
  'koukaki-neos-kosmos': {
    slug: 'koukaki-neos-kosmos',
    sector: 'central',
    name: { el: 'Κουκάκι & Νέος Κόσμος', en: 'Koukaki & Neos Kosmos' },
    genitive: { el: 'στο Κουκάκι & τον Νέο Κόσμο', en: 'in Koukaki & Neos Kosmos' },
    neighborhoods: {
      el: ['Κουκάκι', 'Μακρυγιάννη', 'Φιλοπάππου', 'Νέος Κόσμος', 'Φιξ', 'Άγιος Σώστης', 'Κυνοσάργους'],
      en: ['Koukaki', 'Makrygianni', 'Filopappou', 'Neos Kosmos', 'Fix', 'Agios Sostis', 'Kynosargous'],
    },
    localContext: {
      el: 'Πάνω στον άξονα της Λ. Συγγρού, βρισκόμαστε στο Κουκάκι, στου Φιξ και στον Νέο Κόσμο μέσα σε 5 λεπτά. Οι πολυκατοικίες της περιοχής έχουν έντονη ζήτηση για ανακαινίσεις μπάνιου και κουζίνας, βαψίματα διαμερισμάτων, αποκατάσταση παλιών ξύλινων παντζουριών και στεγανοποίηση ταρατσών.',
      en: 'Right up Syngrou Ave, we reach Koukaki, Fix and Neos Kosmos in 5 minutes. Apartment blocks here see strong demand for bathroom and kitchen renovations, flat repainting, wooden shutter restoration and terrace waterproofing.',
    },
  },

  'pagkrati-mets': {
    slug: 'pagkrati-mets',
    sector: 'central',
    name: { el: 'Παγκράτι & Μετς', en: 'Pagkrati & Mets' },
    genitive: { el: 'στο Παγκράτι & το Μετς', en: 'in Pagkrati & Mets' },
    neighborhoods: {
      el: ['Παγκράτι Κέντρο', 'Πλατεία Βαρνάβα', 'Προφήτης Ηλίας', 'Άλσος Παγκρατίου', 'Μετς', 'Καλλιμάρμαρο', 'Άγιος Αρτέμιος'],
      en: ['Pagkrati Center', 'Varnava Square', 'Profitis Ilias', 'Pagkrati Grove', 'Mets', 'Kallimarmaro', 'Agios Artemios'],
    },
    localContext: {
      el: 'Στο Παγκράτι και το Μετς οι κλασικές αθηναϊκές πολυκατοικίες δεκαετίας ’60 και ’70 παρουσιάζουν συχνά υγρασίες σε ρετιρέ και φωταγωγούς, ξεφλουδισμένους σοβάδες σε μπαλκόνια, παλιά μπάνια που χρειάζονται ολική ανακαίνιση και ψηλοτάβανα διαμερίσματα με ξύλινες εσωτερικές πόρτες και ντουλάπες.',
      en: 'In Pagkrati and Mets, classic 1960s and 1970s Athens apartment blocks frequently face penthouse roof leaks, peeling balcony plaster, dated bathrooms needing full renovation, and high-ceilinged flats with traditional interior woodwork.',
    },
  },

  'kolonaki-syntagma': {
    slug: 'kolonaki-syntagma',
    sector: 'central',
    name: { el: 'Κολωνάκι, Σύνταγμα & Ιστορικό Κέντρο', en: 'Kolonaki, Syntagma & Historic Center' },
    genitive: { el: 'στο Κολωνάκι & το Κέντρο της Αθήνας', en: 'in Kolonaki & Historic Athens' },
    neighborhoods: {
      el: ['Κολωνάκι', 'Λυκαβηττός', 'Σύνταγμα', 'Πλάκα', 'Μοναστηράκι', 'Εξάρχεια', 'Νεάπολη'],
      en: ['Kolonaki', 'Lycabettus', 'Syntagma', 'Plaka', 'Monastiraki', 'Exarcheia', 'Neapoli'],
    },
    localContext: {
      el: 'Εξυπηρετούμε κατοικίες, ρετιρέ και επαγγελματικούς χώρους/γραφεία σε Κολωνάκι, Λυκαβηττό, Σύνταγμα και Εξάρχεια. Δίνουμε ιδιαίτερη προσοχή στην καθαριότητα των κοινόχρηστων χώρων, στο προσεκτικό βάψιμο παλιών αρχοντικών διαμερισμάτων, στη συντήρηση ξύλινων παντζουριών/περγκολών και στη στεγάνωση δωμάτων με στενά περάσματα.',
      en: 'We serve residences, penthouses and professional offices across Kolonaki, Lycabettus, Syntagma and Exarcheia. We pay special attention to keeping common areas spotless, repainting high-ceilinged flats, restoring wooden shutters and pergolas, and waterproofing complex rooftops.',
    },
  },

  'ampelokipoi-goudi-ilisia': {
    slug: 'ampelokipoi-goudi-ilisia',
    sector: 'central',
    name: { el: 'Αμπελόκηποι, Γουδή & Ιλίσια', en: 'Ampelokipoi, Goudi & Ilisia' },
    genitive: { el: 'στους Αμπελόκηπους, το Γουδή & τα Ιλίσια', en: 'in Ampelokipoi, Goudi & Ilisia' },
    neighborhoods: {
      el: ['Αμπελόκηποι', 'Πανόρμου', 'Γουδή', 'Ιλίσια', 'Μέγαρο Μουσικής', 'Ερυθρός Σταυρός', 'Κουντουριώτικα'],
      en: ['Ampelokipoi', 'Panormou', 'Goudi', 'Ilisia', 'Megaro Mousikis', 'Erythros Stavros'],
    },
    localContext: {
      el: 'Στις πυκνοκατοικημένες πολυκατοικίες σε Αμπελόκηπους, Πανόρμου, Γουδή και Ιλίσια αναλαμβάνουμε στεγανοποιήσεις ταρατσών πολυκατοικιών, ολικές ανακαινίσεις μικρών μπάνιων και κουζινών, αλλαγή δαπέδων σε γκαρσονιέρες/διαμερίσματα και καθαρούς ελαιοχρωματισμούς.',
      en: 'Across the apartment blocks of Ampelokipoi, Panormou, Goudi and Ilisia, we handle communal roof waterproofing, compact bathroom and kitchen renovations, floor replacements in studios and flats, and clean interior repainting.',
    },
  },

  'kypseli-patisia-galatsi': {
    slug: 'kypseli-patisia-galatsi',
    sector: 'central',
    name: { el: 'Κυψέλη, Πατήσια & Γαλάτσι', en: 'Kypseli, Patisia & Galatsi' },
    genitive: { el: 'στην Κυψέλη, τα Πατήσια & το Γαλάτσι', en: 'in Kypseli, Patisia & Galatsi' },
    neighborhoods: {
      el: ['Κυψέλη', 'Φωκίωνος Νέγρη', 'Άνω Κυψέλη', 'Άνω & Κάτω Πατήσια', 'Γαλάτσι', 'Πεδίον του Άρεως', 'Πλατεία Αμερικής'],
      en: ['Kypseli', 'Fokionos Negri', 'Ano Kypseli', 'Patisia', 'Galatsi', 'Pedion tou Areos'],
    },
    localContext: {
      el: 'Στην Κυψέλη, τα Πατήσια και το Γαλάτσι πολλές παλιές πολυκατοικίες και διαμερίσματα ανακαινίζονται ριζικά μετά από χρόνια. Αναλαμβάνουμε ξήλωμα παλιών μπάνιων και κουζινών, επισκευή πεσμένων σοβάδων και ρωγμών σε ταβάνια, αφαίρεση μούχλας/υγρασίας, σπατουλάρισμα και στεγανοποίηση ταρατσών.',
      en: 'In Kypseli, Patisia and Galatsi, many older apartments and buildings are being refurbished after years of wear. We strip out dated bathrooms and kitchens, repair fallen ceiling plaster and cracks, treat damp and mould, smooth textured surfaces and waterproof flat roofs.',
    },
  },

  'petralona-thiseio-gkazi': {
    slug: 'petralona-thiseio-gkazi',
    sector: 'central',
    name: { el: 'Πετράλωνα, Θησείο & Γκάζι', en: 'Petralona, Thiseio & Gkazi' },
    genitive: { el: 'στα Πετράλωνα, το Θησείο & το Γκάζι', en: 'in Petralona, Thiseio & Gkazi' },
    neighborhoods: {
      el: ['Άνω Πετράλωνα', 'Κάτω Πετράλωνα', 'Θησείο', 'Γκάζι', 'Κεραμεικός', 'Μεταξουργείο', 'Βοτανικός'],
      en: ['Ano Petralona', 'Kato Petralona', 'Thiseio', 'Gkazi', 'Kerameikos', 'Metaxourgeio'],
    },
    localContext: {
      el: 'Δίπλα στην Καλλιθέα μέσω της Πειραιώς και της Χαμοστέρνας, εξυπηρετούμε άμεσα τα Άνω και Κάτω Πετράλωνα, το Θησείο και τον Κεραμεικό. Η περιοχή συνδυάζει χαμηλές μονοκατοικίες με εσωτερικές αυλές και ξύλινα παντζούρια μαζί με πολυκατοικίες που χρειάζονται μόνωση ταράτσας, επισκευή εξωτερικών τοίχων και ανακαίνιση.',
      en: 'Minutes from Kallithea via Peiraios and Chamosternas, we serve Ano and Kato Petralona, Thiseio and Kerameikos. The neighbourhood mixes low houses with courtyards and wooden shutters alongside apartment blocks needing roof waterproofing, exterior plaster repair and interior renovation.',
    },
  },

  zografou: {
    slug: 'zografou',
    sector: 'central',
    name: { el: 'Ζωγράφου', en: 'Zografou' },
    genitive: { el: 'στου Ζωγράφου', en: 'in Zografou' },
    neighborhoods: {
      el: ['Ζωγράφου Κέντρο', 'Άνω Ιλίσια', 'Γουδή (Όρια)', 'Πολυτεχνειούπολη', 'Αγία Μαρίνα', 'Άγιος Θωμάς'],
      en: ['Zografou Center', 'Ano Ilisia', 'Agia Marina', 'Agios Thomas'],
    },
    localContext: {
      el: 'Στου Ζωγράφου οι πολυκατοικίες και τα φοιτητικά ή οικογενειακά διαμερίσματα παρουσιάζουν συνεχή ανάγκη για λειτουργικές ανακαινίσεις μπάνιου (μετατροπή μπανιέρας σε ντουζιέρα), ανανέωση κουζίνας, γρήγορο και καθαρό βάψιμο, καθώς και στεγανοποίηση ταρατσών και μπαλκονιών.',
      en: 'In Zografou, apartment buildings and student or family flats regularly need practical bathroom renovations (bathtub-to-shower conversions), kitchen updates, clean repainting, and roof or balcony waterproofing.',
    },
  },

  'vyronas-kaisariani': {
    slug: 'vyronas-kaisariani',
    sector: 'central',
    name: { el: 'Βύρωνας & Καισαριανή', en: 'Vyronas & Kaisariani' },
    genitive: { el: 'στον Βύρωνα & την Καισαριανή', en: 'in Vyronas & Kaisariani' },
    neighborhoods: {
      el: ['Βύρωνας', 'Νέα Ελβετία', 'Καρέας', 'Καισαριανή', 'Σκοπευτήριο', 'Μεταμόρφωση Βύρωνα'],
      en: ['Vyronas', 'Nea Elvetia', 'Kareas', 'Kaisariani', 'Skopeftirio'],
    },
    localContext: {
      el: 'Στον Βύρωνα, τον Καρέα και την Καισαριανή, κοντά στους πρόποδες του Υμηττού, η χειμερινή υγρασία και οι βροχές δοκιμάζουν τις ταράτσες, τις εξωτερικές σκάλες και τους τοίχους. Αναλαμβάνουμε υγρομόνωση και θερμομόνωση ταράτσας, επισκευές σοβάδων, ανακαινίσεις μπάνιου και ελαιοχρωματισμούς.',
      en: 'In Vyronas, Kareas and Kaisariani along the foot of Mount Hymettus, winter damp and rain test flat roofs, outdoor stairs and exterior walls. We handle roof waterproofing and thermal insulation, plaster repairs, bathroom renovations and painting.',
    },
  },

  'dafni-ymittos': {
    slug: 'dafni-ymittos',
    sector: 'central',
    name: { el: 'Δάφνη & Υμηττός', en: 'Dafni & Ymittos' },
    genitive: { el: 'στη Δάφνη & τον Υμηττό', en: 'in Dafni & Ymittos' },
    neighborhoods: {
      el: ['Δάφνη', 'Πλατεία Καλογήρων', 'Υμηττός', 'Άγιος Ιωάννης', 'Χαραυγή'],
      en: ['Dafni', 'Kalogiron Square', 'Ymittos', 'Agios Ioannis', 'Charavgi'],
    },
    localContext: {
      el: 'Δίπλα στην έδρα μας, εξυπηρετούμε τη Δάφνη και τον Υμηττό σε λίγα λεπτά. Αναλαμβάνουμε τόσο πολυκατοικίες όσο και παλαιότερες διπλοκατοικίες με αυλές για μόνωση ταράτσας, επισκευή στηθαίων και πεζοδρομίων, ανακαίνιση μπάνιου/κουζίνας και βαψίματα.',
      en: 'Minutes from our base, we serve Dafni and Ymittos for both apartment buildings and two-storey homes with courtyards, handling roof waterproofing, parapet and sidewalk repairs, bathroom or kitchen renovations and painting.',
    },
  },

  // === 3. ΝΟΤΙΑ ΠΡΟΑΣΤΙΑ ===
  alimos: {
    slug: 'alimos',
    sector: 'south',
    name: { el: 'Άλιμος (Καλαμάκι)', en: 'Alimos (Kalamaki)' },
    genitive: { el: 'στον Άλιμο', en: 'in Alimos' },
    neighborhoods: {
      el: ['Καλαμάκι', 'Άνω Καλαμάκι', 'Εκτελωνιστών', 'Κεφαλληνίων', 'Κυθηρίων', 'Αμπελάκια', 'Τράχωνες'],
      en: ['Kalamaki', 'Ano Kalamaki', 'Ekteloniston', 'Kefallinion', 'Ampelakia', 'Trachones'],
    },
    localContext: {
      el: 'Στον Άλιμο και το Καλαμάκι, οι παραθαλάσσιες πολυκατοικίες και οι κατοικίες στο Άνω Καλαμάκι αντιμετωπίζουν έντονη ηλιοφάνεια και υγρασία από τη θάλασσα. Εφαρμόζουμε λευκές ανακλαστικές μονώσεις ταρατσών, στεγανοποίηση μπαλκονιών και ζαρντινιέρων, συντήρηση ξύλινων περγκολών και ποιοτικές εξωτερικές και εσωτερικές βαφές.',
      en: 'In Alimos and Kalamaki, coastal apartment blocks and homes in Ano Kalamaki face strong sun and sea humidity. We apply reflective white roof membranes, waterproof balconies and planters, maintain wooden pergolas and deliver durable exterior and interior painting.',
    },
  },

  ilioupoli: {
    slug: 'ilioupoli',
    sector: 'south',
    name: { el: 'Ηλιούπολη', en: 'Ilioupoli' },
    genitive: { el: 'στην Ηλιούπολη', en: 'in Ilioupoli' },
    neighborhoods: {
      el: ['Κέντρο Ηλιούπολης', 'Αγία Μαρίνα', 'Άνω Ηλιούπολη', 'Αστυνομικά', 'Χαλικάκι', 'Κάτω Ηλιούπολη', 'Νησάκι'],
      en: ['Central Ilioupoli', 'Agia Marina', 'Ano Ilioupoli', 'Astynomika', 'Chalikaki', 'Kato Ilioupoli'],
    },
    localContext: {
      el: 'Στην Ηλιούπολη, ειδικά στα ψηλότερα σημεία (Άνω Ηλιούπολη, Αστυνομικά) κοντά στο βουνό, ο αέρας και οι θερμοκρασιακές διαφορές απαιτούν γερή θερμομόνωση και στεγάνωση ταράτσας, μόνωση πιλοτής, επισκευή εξωτερικών τοίχων και προσεγμένες ανακαινίσεις διαμερισμάτων.',
      en: 'In Ilioupoli, particularly in the higher neighborhoods near the mountain (Ano Ilioupoli, Astynomika), wind and temperature swings call for solid roof thermal insulation and waterproofing, pilotis ceiling insulation, exterior wall repairs and apartment renovations.',
    },
  },

  'argyroupoli-elliniko': {
    slug: 'argyroupoli-elliniko',
    sector: 'south',
    name: { el: 'Αργυρούπολη & Ελληνικό', en: 'Argyroupoli & Elliniko' },
    genitive: { el: 'στην Αργυρούπολη & το Ελληνικό', en: 'in Argyroupoli & Elliniko' },
    neighborhoods: {
      el: ['Αργυρούπολη Κέντρο', 'Νέα Αλεξάνδρεια', 'Ελληνικό', 'Σούρμενα', 'Άνω Ελληνικό', 'Κάτω Ελληνικό'],
      en: ['Argyroupoli Center', 'Nea Alexandreia', 'Elliniko', 'Sourmena', 'Ano Elliniko', 'Kato Elliniko'],
    },
    localContext: {
      el: 'Εξυπηρετούμε άμεσα την Αργυρούπολη, τα Σούρμενα και το Ελληνικό μέσω της Λ. Βουλιαγμένης. Αναλαμβάνουμε στεγανοποίηση και θερμομόνωση ταρατσών (κάτω από ηλιακούς και φωτοβολταϊκά), στεγάνωση μπαλκονιών χωρίς ξήλωμα, ολικές ανακαινίσεις μπάνιου και κουζίνας, και ελαιοχρωματισμούς.',
      en: 'We reach Argyroupoli, Sourmena and Elliniko quickly via Vouliagmenis Ave, providing roof waterproofing and thermal insulation around solar units, tile-over balcony waterproofing, full bathroom and kitchen renovations, and painting.',
    },
  },

  glyfada: {
    slug: 'glyfada',
    sector: 'south',
    name: { el: 'Γλυφάδα', en: 'Glyfada' },
    genitive: { el: 'στη Γλυφάδα', en: 'in Glyfada' },
    neighborhoods: {
      el: ['Γλυφάδα Κέντρο', 'Άνω Γλυφάδα', 'Τερψιθέα', 'Αιξωνή', 'Γκολφ Γλυφάδας', 'Ευρυάλη', 'Πυρνάρι'],
      en: ['Central Glyfada', 'Ano Glyfada', 'Terpsithea', 'Aixoni', 'Glyfada Golf', 'Evryali', 'Pyrnari'],
    },
    localContext: {
      el: 'Στη Γλυφάδα, την Άνω Γλυφάδα και την Τερψιθέα αναλαμβάνουμε κατοικίες, μεζονέτες, πολυκατοικίες και επαγγελματικούς χώρους. Εφαρμόζουμε λευκές επαλειφόμενες μεμβράνες και αφρό πολυουρεθάνης σε ταράτσες, στεγανοποίηση σε χτιστές ζαρντινιέρες και βεράντες, συντήρηση ξύλινων περγκολών και ποιοτικές βαφές και ανακαινίσεις.',
      en: 'Across Glyfada, Ano Glyfada and Terpsithea we work on apartments, maisonettes and commercial properties, applying white liquid roof membranes and sprayed polyurethane foam, waterproofing built-in planters and terraces, maintaining wooden pergolas, and executing clean renovations and painting.',
    },
  },

  'voula-vari-vouliagmeni': {
    slug: 'voula-vari-vouliagmeni',
    sector: 'south',
    name: { el: 'Βούλα, Βάρη & Βουλιαγμένη', en: 'Voula, Vari & Vouliagmeni' },
    genitive: { el: 'στη Βούλα, τη Βάρη & τη Βουλιαγμένη', en: 'in Voula, Vari & Vouliagmeni' },
    neighborhoods: {
      el: ['Βούλα', 'Άνω Βούλα', 'Πανόραμα Βούλας', 'Βουλιαγμένη', 'Καβούρι', 'Βάρη', 'Βάρκιζα', 'Δίλοφο'],
      en: ['Voula', 'Ano Voula', 'Panorama Voulas', 'Vouliagmeni', 'Kavouri', 'Vari', 'Varkiza'],
    },
    localContext: {
      el: 'Στις κατοικίες και τις πολυκατοικίες σε Βούλα, Βάρη, Βάρκιζα και Βουλιαγμένη η εγγύτητα στη θάλασσα και ο δυνατός ήλιος απαιτούν υλικά που αντέχουν στην αλμύρα και την υπεριώδη ακτινοβολία: στεγάνωση ταρατσών, ζαρντινιέρων και εξωτερικών σκαλών, συντήρηση ξύλινων κουφωμάτων/περγκολών, αρμολόγηση πέτρινων αυλών και εξωτερικές βαφές.',
      en: 'For homes and apartment buildings in Voula, Vari, Varkiza and Vouliagmeni, sea air and intense sun demand materials that withstand salt and UV: roof, planter and outdoor stair waterproofing, wooden shutter and pergola care, stone courtyard repointing and durable exterior painting.',
    },
  },

  // === 4. ΒΟΡΕΙΑ ΠΡΟΑΣΤΙΑ ===
  marousi: {
    slug: 'marousi',
    sector: 'north',
    name: { el: 'Μαρούσι', en: 'Marousi' },
    genitive: { el: 'στο Μαρούσι', en: 'in Marousi' },
    neighborhoods: {
      el: ['Μαρούσι Κέντρο', 'Παράδεισος Αμαρουσίου', 'Πολύδροσο', 'Αγία Φιλοθέη', 'Ψαλίδι', 'Νέα Φιλοθέη', 'Ανάβρυτα'],
      en: ['Marousi Center', 'Paradeisos', 'Polydroso', 'Agia Filothei', 'Psalidi', 'Anavryta'],
    },
    localContext: {
      el: 'Στο Μαρούσι εξυπηρετούμε τόσο κατοικίες και πολυκατοικίες όσο και γραφεία και επαγγελματικούς χώρους. Αναλαμβάνουμε θερμομόνωση και στεγανοποίηση ταρατσών, μόνωση πιλοτής, επισκευή και βαφή γραφείων και διαμερισμάτων, καθώς και ανακαινίσεις μπάνιου και κουζίνας.',
      en: 'In Marousi we serve residential buildings, family homes and commercial offices alike, providing roof thermal insulation and waterproofing, pilotis insulation, office and apartment repainting, and bathroom or kitchen renovations.',
    },
  },

  chalandri: {
    slug: 'chalandri',
    sector: 'north',
    name: { el: 'Χαλάνδρι', en: 'Chalandri' },
    genitive: { el: 'στο Χαλάνδρι', en: 'in Chalandri' },
    neighborhoods: {
      el: ['Χαλάνδρι Κέντρο', 'Κάτω Χαλάνδρι', 'Πάτημα Χαλανδρίου', 'Τούφα', 'Πολύδροσο Χαλανδρίου', ' Ριζάρειος', 'Μεταμόρφωση Χαλανδρίου'],
      en: ['Chalandri Center', 'Kato Chalandri', 'Patima Chalandriou', 'Toufa', 'Polydroso', 'Rizareios'],
    },
    localContext: {
      el: 'Στο Χαλάνδρι, το Κάτω Χαλάνδρι και το Πάτημα, οι πολυκατοικίες και οι μεζονέτες αντιμετωπίζουν αυξημένη χειμερινή υγρασία και κρύο. Εφαρμόζουμε ψεκαζόμενο αφρό πολυουρεθάνης και λευκές στεγανωτικές μεμβράνες σε ταράτσες, στεγάνωση μπαλκονιών και ζαρντινιέρων, ανακαινίσεις μπάνιου και προσεγμένους ελαιοχρωματισμούς.',
      en: 'Across Chalandri, Kato Chalandri and Patima, apartment blocks and maisonettes experience colder, damper winters. We apply sprayed polyurethane foam and white waterproof membranes on roofs, seal balconies and planters, renovate bathrooms and repaint interiors and facades.',
    },
  },

  'agia-paraskevi': {
    slug: 'agia-paraskevi',
    sector: 'north',
    name: { el: 'Αγία Παρασκευή', en: 'Agia Paraskevi' },
    genitive: { el: 'στην Αγία Παρασκευή', en: 'in Agia Paraskevi' },
    neighborhoods: {
      el: ['Πλατεία Αγίας Παρασκευής', 'Κοντόπευκο', 'Τσακός', 'Πευκάκια', 'Αϊ-Γιάννης', 'Παράδεισος', 'Σταυρός'],
      en: ['Agia Paraskevi Square', 'Kontopefko', 'Tsakos', 'Pefkakia', 'Ai-Giannis', 'Stavros'],
    },
    localContext: {
      el: 'Στην Αγία Παρασκευή (Κοντόπευκο, Τσακός, Αϊ-Γιάννης) οι πολυκατοικίες και οι μονοκατοικίες χρειάζονται αξιόπιστη θερμομόνωση ταράτσας και πιλοτής για τον χειμώνα, επισκευή στηθαίων και αρμών, καθώς και ανακαινίσεις μπάνιου/κουζίνας και βαψίματα.',
      en: 'In Agia Paraskevi (Kontopefko, Tsakos, Ai-Giannis), apartment buildings and detached homes need dependable roof and pilotis thermal insulation for winter, parapet and joint repairs, bathroom or kitchen renovations and painting.',
    },
  },

  'cholargos-papagou': {
    slug: 'cholargos-papagou',
    sector: 'north',
    name: { el: 'Χολαργός & Παπάγου', en: 'Cholargos & Papagou' },
    genitive: { el: 'στον Χολαργό & στου Παπάγου', en: 'in Cholargos & Papagou' },
    neighborhoods: {
      el: ['Χολαργός', 'Άνω Χολαργός', 'Παπάγου', 'Φανέρωμένη', 'Πεντάγωνο'],
      en: ['Cholargos', 'Ano Cholargos', 'Papagou', 'Faneromeni'],
    },
    localContext: {
      el: 'Στον Χολαργό και στου Παπάγου εξυπηρετούμε οικογενειακές πολυκατοικίες και μονοκατοικίες με έμφαση στην καθαρή δουλειά: στεγανοποίηση ταρατσών και μπαλκονιών, επισκευή σοβάδων και ρωγμών, συντήρηση ξύλινων παντζουριών/περγκολών, ανακαινίσεις μπάνιου και ελαιοχρωματισμούς.',
      en: 'In Cholargos and Papagou we serve family apartment buildings and houses with a focus on neat workmanship: roof and balcony waterproofing, plaster and crack repairs, wooden shutter and pergola restoration, bathroom renovations and painting.',
    },
  },

  'psychiko-filothei': {
    slug: 'psychiko-filothei',
    sector: 'north',
    name: { el: 'Ψυχικό & Φιλοθέη', en: 'Psychiko & Filothei' },
    genitive: { el: 'στο Ψυχικό & τη Φιλοθέη', en: 'in Psychiko & Filothei' },
    neighborhoods: {
      el: ['Παλαιό Ψυχικό', 'Νέο Ψυχικό', 'Φιλοθέη', 'Φάρος Ψυχικού', 'Αγία Σοφία'],
      en: ['Palaio Psychiko', 'Neo Psychiko', 'Filothei', 'Faros Psychikou', 'Agia Sofia'],
    },
    localContext: {
      el: 'Σε Παλαιό Ψυχικό, Νέο Ψυχικό και Φιλοθέη αναλαμβάνουμε κατοικίες και διαμερίσματα που απαιτούν ιδιαίτερη προσοχή στη λεπτομέρεια: στεγανοποίηση ταρατσών, φεγγιτών και χτιστών ζαρντινιέρων, αποκατάσταση ξύλινων παντζουριών και περγκολών, αρμολόγηση πέτρινων αυλών και προσεγμένες βαφές.',
      en: 'In Palaio Psychiko, Neo Psychiko and Filothei we work on homes and apartments that call for close attention to detail: waterproofing roofs, skylights and built-in planters, restoring wooden shutters and pergolas, repointing stone courtyards and careful interior and exterior painting.',
    },
  },

  'vrilissia-melissia-penteli': {
    slug: 'vrilissia-melissia-penteli',
    sector: 'north',
    name: { el: 'Βριλήσσια, Μελίσσια & Πεντέλη', en: 'Vrilissia, Melissia & Penteli' },
    genitive: { el: 'στα Βριλήσσια, τα Μελίσσια & την Πεντέλη', en: 'in Vrilissia, Melissia & Penteli' },
    neighborhoods: {
      el: ['Βριλήσσια', 'Άνω Βριλήσσια', 'Μελίσσια', 'Νέα Πεντέλη', 'Παλαιά Πεντέλη', 'Πάτημα Βριλησσίων'],
      en: ['Vrilissia', 'Ano Vrilissia', 'Melissia', 'Nea Penteli', 'Palaia Penteli'],
    },
    localContext: {
      el: 'Στα Βριλήσσια, τα Μελίσσια και την Πεντέλη οι χαμηλές θερμοκρασίες, η υγρασία και ο παγετός τον χειμώνα κάνουν απαραίτητη τη συνδυαστική θερμομόνωση και στεγανοποίηση σε ταράτσες, κεραμοσκεπές και πιλοτές, καθώς και την επισκευή εξωτερικών σοβάδων και ξύλινων κατασκευών.',
      en: 'In Vrilissia, Melissia and Penteli, winter cold, damp and frost make combined thermal insulation and waterproofing essential on flat roofs, tiled roof junctions and pilotis ceilings, alongside exterior render repairs and outdoor wood care.',
    },
  },

  'kifisia-ekali-erythraia': {
    slug: 'kifisia-ekali-erythraia',
    sector: 'north',
    name: { el: 'Κηφισιά, Νέα Ερυθραία & Εκάλη', en: 'Kifisia, Nea Erythraia & Ekali' },
    genitive: { el: 'στην Κηφισιά, τη Νέα Ερυθραία & την Εκάλη', en: 'in Kifisia, Nea Erythraia & Ekali' },
    neighborhoods: {
      el: ['Κηφισιά', 'Κεφαλάρι', 'Πολιτεία', 'Στροφύλι', 'Νέα Ερυθραία', 'Καστρί', 'Εκάλη', 'Δροσιά'],
      en: ['Kifisia', 'Kefalari', 'Politeia', 'Strofyli', 'Nea Erythraia', 'Kastri', 'Ekali', 'Drosia'],
    },
    localContext: {
      el: 'Στις μονοκατοικίες, μεζονέτες και πολυκατοικίες σε Κηφισιά, Πολιτεία, Νέα Ερυθραία και Εκάλη αναλαμβάνουμε ολοκληρωμένη θερμομόνωση και στεγανοποίηση δωμάτων, στεγάνωση ζαρντινιέρων δίπλα σε κήπους και πισίνες, συντήρηση ξύλινων παντζουριών και περγκολών, πλακοστρώσεις αυλών και ελαιοχρωματισμούς.',
      en: 'For detached houses, maisonettes and apartment blocks in Kifisia, Politeia, Nea Erythraia and Ekali, we handle complete roof insulation and waterproofing, garden and poolside planter waterproofing, wooden shutter and pergola restoration, courtyard paving and painting.',
    },
  },

  'nea-ionia-irakleio-pefki': {
    slug: 'nea-ionia-irakleio-pefki',
    sector: 'north',
    name: { el: 'Νέα Ιωνία, Ηράκλειο & Πεύκη', en: 'Nea Ionia, Irakleio & Pefki' },
    genitive: { el: 'στη Νέα Ιωνία, το Ηράκλειο & την Πεύκη', en: 'in Nea Ionia, Irakleio & Pefki' },
    neighborhoods: {
      el: ['Νέα Ιωνία', 'Περισσός', 'Πευκάκια', 'Καλογρέζα', 'Ηράκλειο Αττικής', 'Πεύκη', 'Λυκόβρυση', 'Μεταμόρφωση'],
      en: ['Nea Ionia', 'Perissos', 'Pefkakia', 'Kalogreza', 'Irakleio', 'Pefki', 'Lykovrissi', 'Metamorfosi'],
    },
    localContext: {
      el: 'Στη Νέα Ιωνία, το Ηράκλειο, την Πεύκη και τη Μεταμόρφωση εξυπηρετούμε πολυκατοικίες, διπλοκατοικίες και επαγγελματικούς χώρους για μόνωση ταράτσας (αποξήλωση παλιών μεμβρανών, πολυουρεθάνη, επαλειφόμενα), ολική ανακαίνιση μπάνιου και κουζίνας, μερεμέτια σοβάδων και βαψίματα.',
      en: 'Across Nea Ionia, Irakleio, Pefki and Metamorfosi, we serve apartment buildings, two-storey houses and commercial spaces for roof waterproofing, full bathroom and kitchen renovations, plaster repairs and painting.',
    },
  },

  // === 5. ΔΥΤΙΚΑ ΠΡΟΑΣΤΙΑ ===
  peristeri: {
    slug: 'peristeri',
    sector: 'west',
    name: { el: 'Περιστέρι', en: 'Peristeri' },
    genitive: { el: 'στο Περιστέρι', en: 'in Peristeri' },
    neighborhoods: {
      el: ['Περιστέρι Κέντρο', 'Ανθούπολη', 'Μπουρνάζι', 'Λόφος Αξιωματικών', 'Άγιος Αντώνιος', 'Κηπούπολη', 'Νέα Ζωή'],
      en: ['Peristeri Center', 'Anthoupoli', 'Bournazi', 'Lofos Axiomatikon', 'Agios Antonios', 'Kipoupoli'],
    },
    localContext: {
      el: 'Στο Περιστέρι (Άγιος Αντώνιος, Ανθούπολη, Μπουρνάζι, Λόφος Αξιωματικών) εξυπηρετούμε άμεσα μέσω Κηφισού. Αναλαμβάνουμε στεγανοποίηση και θερμομόνωση ταρατσών σε πολυκατοικίες και διπλοκατοικίες, ανακαινίσεις μπάνιου και κουζίνας, επισκευή υγρασιών/μούχλας και καθαρούς ελαιοχρωματισμούς.',
      en: 'In Peristeri (Agios Antonios, Anthoupoli, Bournazi, Lofos Axiomatikon), with quick access via Kifisou Ave, we handle roof waterproofing and thermal insulation on apartment blocks and family houses, bathroom and kitchen renovations, damp treatment and painting.',
    },
  },

  'aigaleo-chaidari': {
    slug: 'aigaleo-chaidari',
    sector: 'west',
    name: { el: 'Αιγάλεω & Χαϊδάρι', en: 'Aigaleo & Chaidari' },
    genitive: { el: 'στο Αιγάλεω & το Χαϊδάρι', en: 'in Aigaleo & Chaidari' },
    neighborhoods: {
      el: ['Αιγάλεω', 'Μπαρουτάδικο', 'Λιούμη', 'Χαϊδάρι', 'Δάσος Χαϊδαρίου', 'Αγία Βαρβάρα'],
      en: ['Aigaleo', 'Baroutadiko', 'Chaidari', 'Dasos Chaidariou', 'Agia Varvara'],
    },
    localContext: {
      el: 'Στο Αιγάλεω, το Χαϊδάρι και την Αγία Βαρβάρα αναλαμβάνουμε μονώσεις ταρατσών (με νέα τσιμεντοκονία ρύσεων, αφρό πολυουρεθάνης ή λευκή μεμβράνη), επισκευή πεσμένων σοβάδων και σκουριασμένων σιδήρων, ανακαίνιση μπάνιου και βαφή διαμερισμάτων και καταστημάτων.',
      en: 'In Aigaleo, Chaidari and Agia Varvara we carry out roof waterproofing (new slope screed, polyurethane foam or white liquid membrane), fallen ceiling plaster and rebar repairs, bathroom renovations, and flat or shop repainting.',
    },
  },

  'ilion-petroupoli': {
    slug: 'ilion-petroupoli',
    sector: 'west',
    name: { el: 'Ίλιον & Πετρούπολη', en: 'Ilion & Petroupoli' },
    genitive: { el: 'στο Ίλιον & την Πετρούπολη', en: 'in Ilion & Petroupoli' },
    neighborhoods: {
      el: ['Ίλιον', 'Πετρούπολη', 'Άνω Πετρούπολη', 'Άγιοι Ανάργυροι', 'Καματερό', 'Παλατιανή'],
      en: ['Ilion', 'Petroupoli', 'Ano Petroupoli', 'Agioi Anargyroi', 'Kamatero'],
    },
    localContext: {
      el: 'Σε Ίλιον, Πετρούπολη και Αγίους Αναργύρους καλύπτουμε πολυκατοικίες και μονοκατοικίες για στεγανοποίηση και θερμομόνωση ταράτσας, εξωτερική θερμομόνωση σε μπαλκόνια, ανακαινίσεις μπάνιου/κουζίνας, καθαιρέσεις τοίχων και ελαιοχρωματισμούς.',
      en: 'Across Ilion, Petroupoli and Agioi Anargyroi, we serve apartment buildings and houses for roof waterproofing and thermal insulation, balcony wall insulation, bathroom and kitchen renovations, wall removals and painting.',
    },
  },

  // === 6. ΠΕΙΡΑΙΑΣ & ΑΝΑΤΟΛΙΚΗ ΑΤΤΙΚΗ ===
  peiraias: {
    slug: 'peiraias',
    sector: 'piraeus-east',
    name: { el: 'Πειραιάς', en: 'Piraeus' },
    genitive: { el: 'στον Πειραιά', en: 'in Piraeus' },
    neighborhoods: {
      el: ['Κέντρο Πειραιά', 'Καστέλλα', 'Πασαλιμάνι', 'Φρεαττύδα', 'Πειραϊκή', 'Καμίνια', 'Ταμπούρια', 'Μανιάτικα'],
      en: ['Piraeus Center', 'Kastella', 'Pasalimani', 'Freattyda', 'Peiraiki', 'Kaminia', 'Tampouria'],
    },
    localContext: {
      el: 'Με άμεση πρόσβαση μέσω Πειραιώς και Παραλιακής, εξυπηρετούμε όλο τον Πειραιά — από την Καστέλλα, το Πασαλιμάνι και την Πειραϊκή μέχρι τα Καμίνια και τα Ταμπούρια. Η θαλάσσια υγρασία και η αλμύρα απαιτούν ανθεκτική στεγανοποίηση ταρατσών και μπαλκονιών, επισκευή σκουριασμένου οπλισμού και σοβάδων, και βαφές αντοχής.',
      en: 'With direct access down Peiraios Ave and the coast road, we serve all of Piraeus — from Kastella, Pasalimani and Peiraiki to Kaminia and Tampouria. Marine humidity and salt call for resilient roof and balcony waterproofing, rusted rebar and plaster repair, and durable exterior coatings.',
    },
  },

  'nikaia-korydallos-keratsini': {
    slug: 'nikaia-korydallos-keratsini',
    sector: 'piraeus-east',
    name: { el: 'Νίκαια, Κορυδαλλός & Κερατσίνι', en: 'Nikaia, Korydallos & Keratsini' },
    genitive: { el: 'στη Νίκαια, τον Κορυδαλλό & το Κερατσίνι', en: 'in Nikaia, Korydallos & Keratsini' },
    neighborhoods: {
      el: ['Νίκαια', 'Κορυδαλλός', 'Κερατσίνι', 'Δραπετσώνα', 'Αμφιάλη', 'Νεάπολη Νίκαιας'],
      en: ['Nikaia', 'Korydallos', 'Keratsini', 'Drapetsona', 'Amfiali'],
    },
    localContext: {
      el: 'Σε Νίκαια, Κορυδαλλό, Κερατσίνι και Δραπετσώνα αναλαμβάνουμε στεγανοποίηση ταρατσών και μπαλκονιών, ολικές ανακαινίσεις μπάνιου και κουζίνας, επισκευή υγρασιών και πεσμένων σοβάδων, καθώς και ελαιοχρωματισμούς διαμερισμάτων και προσόψεων.',
      en: 'Across Nikaia, Korydallos, Keratsini and Drapetsona, we carry out roof and balcony waterproofing, full bathroom and kitchen renovations, damp and fallen plaster repairs, and interior or facade painting.',
    },
  },

  'pallini-gerakas-glyka-nera': {
    slug: 'pallini-gerakas-glyka-nera',
    sector: 'piraeus-east',
    name: { el: 'Παλλήνη, Γέρακας & Γλυκά Νερά', en: 'Pallini, Gerakas & Glyka Nera' },
    genitive: { el: 'στην Παλλήνη, τον Γέρακα & τα Γλυκά Νερά', en: 'in Pallini, Gerakas & Glyka Nera' },
    neighborhoods: {
      el: ['Γέρακας', 'Παλλήνη', 'Γλυκά Νερά', 'Σταυρός', 'Κάντζα', 'Ανθούσα'],
      en: ['Gerakas', 'Pallini', 'Glyka Nera', 'Stavros', 'Kantza', 'Anthousa'],
    },
    localContext: {
      el: 'Σε Γέρακα, Παλλήνη και Γλυκά Νερά οι μονοκατοικίες, οι μεζονέτες και τα συγκροτήματα κατοικιών χρειάζονται συνδυαστική θερμομόνωση και στεγανοποίηση ταρατσών (και ενώσεων με κεραμοσκεπές), στεγάνωση εξωτερικών σκαλών και ζαρντινιέρων, συντήρηση ξύλινων περγκολών και εξωτερικές βαφές.',
      en: 'In Gerakas, Pallini and Glyka Nera, detached houses, maisonettes and residential complexes need combined roof thermal insulation and waterproofing (including tiled roof junctions), outdoor stair and planter waterproofing, wooden pergola care and exterior painting.',
    },
  },

  'paiania-koropi-spata': {
    slug: 'paiania-koropi-spata',
    sector: 'piraeus-east',
    name: { el: 'Παιανία, Κορωπί, Σπάτα & Μεσόγεια', en: 'Paiania, Koropi, Spata & Mesogeia' },
    genitive: { el: 'στα Μεσόγεια (Παιανία, Κορωπί, Σπάτα)', en: 'in Mesogeia (Paiania, Koropi, Spata)' },
    neighborhoods: {
      el: ['Παιανία', 'Κορωπί', 'Σπάτα', 'Αρτέμιδα (Λούτσα)', 'Μαρκόπουλο', 'Πόρτο Ράφτη'],
      en: ['Paiania', 'Koropi', 'Spata', 'Artemida', 'Markopoulo', 'Porto Rafti'],
    },
    localContext: {
      el: 'Στα Μεσόγεια και τις παραλιακές περιοχές της Ανατολικής Αττικής (Παιανία, Κορωπί, Σπάτα, Αρτέμιδα, Πόρτο Ράφτη) αναλαμβάνουμε μόνωση ταρατσών και κυματοειδών στεγών με αφρό πολυουρεθάνης και λευκή επίστρωση, συντήρηση ξύλινων κουφωμάτων και περγκολών, πλακοστρώσεις αυλών και γενικές ανακαινίσεις.',
      en: 'Across Mesogeia and the East Attica coast (Paiania, Koropi, Spata, Artemida, Porto Rafti), we insulate flat and corrugated roofs with polyurethane foam and white coatings, restore wooden shutters and pergolas, repoint courtyard paving and handle full renovations.',
    },
  },

  // === REGIONAL HUB SLUGS (BACKWARDS COMPATIBILITY & BROAD QUERIES) ===
  'athina-kentro': {
    slug: 'athina-kentro',
    sector: 'regional',
    name: { el: 'Κέντρο Αθήνας', en: 'Athens Center' },
    genitive: { el: 'στο Κέντρο της Αθήνας', en: 'in Athens Center' },
    neighborhoods: {
      el: ['Κουκάκι', 'Παγκράτι', 'Νέος Κόσμος', 'Κολωνάκι', 'Εξάρχεια', 'Κυψέλη', 'Πετράλωνα', 'Αμπελόκηποι', 'Ιλίσια'],
      en: ['Koukaki', 'Pagkrati', 'Neos Kosmos', 'Kolonaki', 'Exarcheia', 'Kypseli', 'Petralona', 'Ampelokipoi', 'Ilisia'],
    },
    localContext: {
      el: 'Εξυπηρετούμε καθημερινά όλο το κέντρο της Αθήνας σε 5–10 λεπτά από την έδρα μας στη Λ. Συγγρού 196. Οι πολυκατοικίες του κέντρου παρουσιάζουν συχνά διαρροές σε ταράτσες και φωταγωγούς, φθορές σε μπαλκόνια και ανάγκη για ανακαίνιση μπάνιου, κουζίνας και ελαιοχρωματισμούς.',
      en: 'Serving the entire central Athens basin within minutes from our Syngrou Ave base for roof waterproofing, balcony repairs, bathroom and kitchen renovations, and interior or exterior painting.',
    },
  },

  'notia-proastia': {
    slug: 'notia-proastia',
    sector: 'regional',
    name: { el: 'Νότια Προάστια', en: 'Southern Suburbs' },
    genitive: { el: 'στα Νότια Προάστια', en: 'in Southern Suburbs' },
    neighborhoods: {
      el: ['Καλλιθέα', 'Νέα Σμύρνη', 'Παλαιό Φάληρο', 'Άλιμος', 'Άγιος Δημήτριος', 'Ηλιούπολη', 'Αργυρούπολη', 'Ελληνικό', 'Γλυφάδα', 'Βούλα'],
      en: ['Kallithea', 'Nea Smyrni', 'Palaio Faliro', 'Alimos', 'Agios Dimitrios', 'Ilioupoli', 'Argyroupoli', 'Elliniko', 'Glyfada', 'Voula'],
    },
    localContext: {
      el: 'Άμεση κάλυψη σε όλους τους δήμους των Νοτίων Προαστίων από την έδρα μας στη Συγγρού. Εφαρμόζουμε ανθεκτικά συστήματα στεγανοποίησης και θερμομόνωσης ταρατσών, επισκευές σοβάδων από τη θαλάσσια υγρασία, συντήρηση ξύλινων περγκολών και πλήρεις ανακαινίσεις.',
      en: 'Rapid response across all Southern Suburbs from our Syngrou Ave headquarters for roof waterproofing, coastal plaster repairs, wooden pergola maintenance and full apartment renovations.',
    },
  },

  'glyfada-voula': {
    slug: 'glyfada-voula',
    sector: 'regional',
    name: { el: 'Γλυφάδα & Παραλιακή', en: 'Glyfada & Coastal Front' },
    genitive: { el: 'στη Γλυφάδα & την Παραλιακή', en: 'in Glyfada & Coastal Areas' },
    neighborhoods: {
      el: ['Γλυφάδα', 'Άνω Γλυφάδα', 'Βούλα', 'Βάρη', 'Βουλιαγμένη', 'Ελληνικό'],
      en: ['Glyfada', 'Ano Glyfada', 'Voula', 'Vari', 'Vouliagmeni', 'Elliniko'],
    },
    localContext: {
      el: 'Εξειδικευμένες εργασίες σε κατοικίες, μεζονέτες και πολυκατοικίες στη Γλυφάδα, τη Βούλα και την Παραλιακή, με έμφαση σε λευκές ανακλαστικές μονώσεις ταρατσών, στεγανοποίηση ζαρντινιέρων, συντήρηση ξύλου και ποιοτικούς ελαιοχρωματισμούς.',
      en: 'Specialized roof waterproofing, planter sealing, exterior woodwork care and high-standard painting and renovations across Glyfada, Voula and the Athens Riviera.',
    },
  },

  'nea-smyrni-faliro': {
    slug: 'nea-smyrni-faliro',
    sector: 'regional',
    name: { el: 'Νέα Σμύρνη & Παλαιό Φάληρο', en: 'Nea Smyrni & Palaio Faliro' },
    genitive: { el: 'στη Νέα Σμύρνη & το Παλαιό Φάληρο', en: 'in Nea Smyrni & Palaio Faliro' },
    neighborhoods: {
      el: ['Νέα Σμύρνη Κέντρο', 'Άλσος', 'Φλοίσβος', 'Μπάτης', 'Έδεμ', 'Αμφιθέα'],
      en: ['Nea Smyrni Center', 'Alsos', 'Flisvos', 'Batis', 'Edem', 'Amfithea'],
    },
    localContext: {
      el: 'Άμεση γειτονιά της έδρας μας στην Καλλιθέα. Εξυπηρετούμε τη Νέα Σμύρνη και το Παλαιό Φάληρο μέσα σε λίγα λεπτά για στεγανοποίηση ταρατσών, επισκευή ταβανιών και μπαλκονιών, ανακαινίσεις μπάνιου και βαψίματα.',
      en: 'Direct neighbor to our Kallithea base. We reach Nea Smyrni and Palaio Faliro within minutes for roof waterproofing, ceiling and balcony repairs, bathroom renovations and painting.',
    },
  },

  'voreia-proastia': {
    slug: 'voreia-proastia',
    sector: 'regional',
    name: { el: 'Βόρεια Προάστια', en: 'Northern Suburbs' },
    genitive: { el: 'στα Βόρεια Προάστια', en: 'in Northern Suburbs' },
    neighborhoods: {
      el: ['Μαρούσι', 'Χαλάνδρι', 'Κηφισιά', 'Αγία Παρασκευή', 'Βριλήσσια', 'Νέα Ιωνία', 'Πεύκη', 'Μελίσσια', 'Παπάγου', 'Χολαργός'],
      en: ['Marousi', 'Chalandri', 'Kifisia', 'Agia Paraskevi', 'Vrilissia', 'Nea Ionia', 'Pefki', 'Melissia', 'Papagou', 'Cholargos'],
    },
    localContext: {
      el: 'Πλήρης κάλυψη των Βορείων Προαστίων για συνδυαστική θερμομόνωση και στεγανοποίηση ταρατσών, μόνωση πιλοτής, εξωτερικές επισκευές και βαφές αντοχής στον χειμερινό παγετό, συντήρηση ξύλινων κουφωμάτων και ανακαινίσεις.',
      en: 'Complete coverage of the Northern Suburbs for combined roof thermal insulation and waterproofing, pilotis insulation, frost-resistant exterior repairs and painting, woodwork care and renovations.',
    },
  },

  'marousi-chalandri': {
    slug: 'marousi-chalandri',
    sector: 'regional',
    name: { el: 'Μαρούσι & Χαλάνδρι', en: 'Marousi & Chalandri' },
    genitive: { el: 'στο Μαρούσι & το Χαλάνδρι', en: 'in Marousi & Chalandri' },
    neighborhoods: {
      el: ['Μαρούσι Κέντρο', 'Παράδεισος', 'Πολύδροσο', 'Χαλάνδρι Κέντρο', 'Πάτημα', 'Κάτω Χαλάνδρι', 'Τούφα'],
      en: ['Marousi Center', 'Paradeisos', 'Polydroso', 'Chalandri Center', 'Patima', 'Kato Chalandri', 'Toufa'],
    },
    localContext: {
      el: 'Εξυπηρετούμε πολυκατοικίες, μονοκατοικίες και επαγγελματικούς χώρους σε Μαρούσι και Χαλάνδρι για μόνωση ταρατσών, ανακαινίσεις διαμερισμάτων και βαφές εσωτερικών και εξωτερικών επιφανειών.',
      en: 'Serving apartment blocks, family homes and offices across Marousi and Chalandri for roof waterproofing, apartment renovations, and interior or exterior painting.',
    },
  },

  'kifisia-ekali': {
    slug: 'kifisia-ekali',
    sector: 'regional',
    name: { el: 'Κηφισιά & Εκάλη', en: 'Kifisia & Ekali' },
    genitive: { el: 'στην Κηφισιά & την Εκάλη', en: 'in Kifisia & Ekali' },
    neighborhoods: {
      el: ['Κηφισιά Κέντρο', 'Κεφαλάρι', 'Πολιτεία', 'Νέα Ερυθραία', 'Εκάλη', 'Δροσιά', 'Καστρί'],
      en: ['Kifisia Center', 'Kefalari', 'Politeia', 'Nea Erythraia', 'Ekali', 'Drosia', 'Kastri'],
    },
    localContext: {
      el: 'Εργασίες σε μονοκατοικίες, μεζονέτες και κατοικίες της Κηφισιάς, της Πολιτείας και της Εκάλης για θερμομόνωση και στεγανοποίηση δωμάτων, συντήρηση ξύλινων κουφωμάτων/περγκολών, πέτρινες αυλές και ποιοτικούς ελαιοχρωματισμούς.',
      en: 'Craftsmanship for residences and maisonettes in Kifisia, Politeia and Ekali covering roof thermal insulation and waterproofing, wooden shutter and pergola restoration, stone courtyards and fine painting.',
    },
  },

  'dytika-proastia': {
    slug: 'dytika-proastia',
    sector: 'regional',
    name: { el: 'Δυτικά Προάστια', en: 'Western Suburbs' },
    genitive: { el: 'στα Δυτικά Προάστια', en: 'in Western Suburbs' },
    neighborhoods: {
      el: ['Περιστέρι', 'Αιγάλεω', 'Ίλιον', 'Πετρούπολη', 'Χαϊδάρι', 'Αγία Βαρβάρα', 'Άγιοι Ανάργυροι'],
      en: ['Peristeri', 'Aigaleo', 'Ilion', 'Petroupoli', 'Chaidari', 'Agia Varvara', 'Agioi Anargyroi'],
    },
    localContext: {
      el: 'Άμεση εξυπηρέτηση σε όλους τους δήμους των Δυτικών Προαστίων για στεγανοποίηση και θερμομόνωση ταρατσών, ανακαινίσεις μπάνιου και κουζίνας, επισκευή σοβάδων και καθαρό βάψιμο.',
      en: 'Prompt service across all Western Suburbs for roof waterproofing and thermal insulation, bathroom and kitchen renovations, plaster repairs and clean painting.',
    },
  },

  'anatoliki-attiki': {
    slug: 'anatoliki-attiki',
    sector: 'regional',
    name: { el: 'Ανατολική Αττική & Μεσόγεια', en: 'East Attica & Mesogeia' },
    genitive: { el: 'στην Ανατολική Αττική & τα Μεσόγεια', en: 'in East Attica & Mesogeia' },
    neighborhoods: {
      el: ['Γέρακας', 'Παλλήνη', 'Παιανία', 'Κορωπί', 'Μαρκόπουλο', 'Αρτέμιδα', 'Πόρτο Ράφτη', 'Σπάτα'],
      en: ['Gerakas', 'Pallini', 'Paiania', 'Koropi', 'Markopoulo', 'Artemida', 'Porto Rafti', 'Spata'],
    },
    localContext: {
      el: 'Κάλυψη μονοκατοικιών, εξοχικών και πολυκατοικιών στην Ανατολική Αττική και τα Μεσόγεια για θερμομόνωση και στεγανοποίηση ταρατσών και στεγών, εξωτερικές βαφές, συντήρηση ξύλου και ανακαινίσεις.',
      en: 'Full service for detached houses, country homes and apartments in East Attica and Mesogeia for roof insulation and waterproofing, exterior painting, wood maintenance and renovations.',
    },
  },
};

/** Primary individual areas (excluding broad regional hub aliases) for clean UI grids. */
export const primaryAreaSlugs: readonly AreaSlug[] = areaSlugs.filter((slug) => areas[slug].sector !== 'regional');

export const localServiceSlugs: readonly ServiceSlug[] = serviceSlugs;
export type LocalServiceSlug = ServiceSlug;

export function isLocalServiceSlug(slug: string): slug is LocalServiceSlug {
  return (localServiceSlugs as readonly string[]).includes(slug as LocalServiceSlug);
}

export function isAreaSlug(slug: string): slug is AreaSlug {
  return (areaSlugs as readonly string[]).includes(slug as AreaSlug);
}

/**
 * Generates service-specific + area-specific lead description so each (service, area)
 * page addresses the exact trade in that specific Athens area.
 */
export function getServiceAreaLead(service: ServiceSlug, area: AreaInfo, locale: 'el' | 'en'): string {
  const base = area.localContext[locale];
  const tradeNote: Record<ServiceSlug, Record<'el' | 'en', string>> = {
    insulation: {
      el: `Αναλαμβάνουμε στεγανοποίηση και θερμομόνωση ταρατσών ${area.genitive.el} (λευκές επαλειφόμενες μεμβράνες, ψεκαζόμενο αφρό πολυουρεθάνης, νέα τσιμεντοκονία ρύσεων, στεγάνωση κάτω από ηλιακούς και φωτοβολταϊκά, μπαλκόνια, πιλοτές, φεγγίτες και χτιστές ζαρντινιέρες).`,
      en: `We carry out flat roof waterproofing and thermal insulation ${area.genitive.en}, including white liquid membranes, sprayed polyurethane foam, new slope screeds, sealing under solar heaters, balconies, pilotis ceilings, skylights and built-in planters.`,
    },
    painting: {
      el: `Αναλαμβάνουμε ελαιοχρωματισμούς διαμερισμάτων, κατοικιών και επαγγελματικών χώρων ${area.genitive.el}: από την πλήρη απόξεση υγρασίας και μούχλας, το σπατουλάρισμα και τη βαφή ντουλαπιών/πορτών μέχρι την επισκευή και βαφή προσόψεων πολυκατοικιών.`,
      en: `We handle interior and exterior painting for flats, houses and shops ${area.genitive.en}: from scraping back damp and mould, skimming and painting woodwork to full apartment building facade repair and painting.`,
    },
    renovations: {
      el: `Αναλαμβάνουμε ολικές και μερικές ανακαινίσεις μπάνιου, WC, κουζίνας και διαμερισμάτων ${area.genitive.el}, από το ξήλωμα και τις νέες υδραυλικές/ηλεκτρολογικές γραμμές με τους συνεργάτες μας μέχρι τη στεγάνωση, τα πλακάκια και τα είδη υγιεινής.`,
      en: `We complete full and partial bathroom, WC, kitchen and flat renovations ${area.genitive.en}, from strip-out and new plumbing/electrical lines with our trusted collaborators to waterproofing, tiling and fixtures.`,
    },
    demolition: {
      el: `Αναλαμβάνουμε καθαιρέσεις τοίχων, ολικό ξήλωμα παλιών μπάνιων και κουζινών μέχρι το τούβλο, αποξήλωση παλιών πλακιδίων και φθαρμένων μονώσεων ${area.genitive.el}, με προσεκτικό μάζεμα και αποκομιδή όλων των μπάζων.`,
      en: `We handle wall removals, full bathroom and kitchen strip-outs down to the brickwork, and removal of old floor tiles and failed roof membranes ${area.genitive.en}, including bagging and clearing all rubble.`,
    },
    paving: {
      el: `Αναλαμβάνουμε επισκευή και κατασκευή πεζοδρομίων, αρμολόγηση πέτρινων αυλών, αποκατάσταση εξωτερικών δαπέδων και διόρθωση κλίσεων σε βεράντες και μπαλκόνια ${area.genitive.el}.`,
      en: `We rebuild concrete sidewalks, repoint stone-paved courtyards, restore outdoor floors and correct drainage slopes on balconies and terraces ${area.genitive.en}.`,
    },
    wood: {
      el: `Αναλαμβάνουμε την αποκατάσταση, το τρίψιμο, το αστάρωμα και τη βαφή ή το βερνίκωμα σε παλιά ξύλινα παντζούρια, εξώπορτες, ξύλινες πέργκολες, καφασωτά και ζαρντινιέρες ${area.genitive.el}.`,
      en: `We restore, sand, prime and paint or varnish weathered wooden shutters, exterior doors, rooftop pergolas, trellis screens and timber planters ${area.genitive.en}.`,
    },
    repairs: {
      el: `Αναλαμβάνουμε μερεμέτια και τεχνικές επισκευές ${area.genitive.el}: πεσμένους σοβάδες ταβανιών με εκτεθειμένα σκουριασμένα σίδερα οπλισμού, ρωγμές σε τοίχους και στηθαία, ξεφλουδίσματα από υγρασία και κλείσιμο σκαψιμάτων μετά από υδραυλικό ή ηλεκτρολόγο.`,
      en: `We handle small repairs and masonry fixes ${area.genitive.en}: fallen ceiling plaster with exposed rusty rebar, wall and parapet cracks, damp patches and closing wall chases after plumbing or electrical work.`,
    },
  };

  return `${base} ${tradeNote[service][locale]}`;
}
