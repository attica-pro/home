export const areaSlugs = [
  'kallithea',
  'athina-kentro',
  'notia-proastia',
  'glyfada-voula',
  'nea-smyrni-faliro',
  'voreia-proastia',
  'marousi-chalandri',
  'kifisia-ekali',
  'peiraias',
  'dytika-proastia',
  'anatoliki-attiki',
] as const;

export type AreaSlug = (typeof areaSlugs)[number];

export interface AreaInfo {
  slug: AreaSlug;
  name: Record<'el' | 'en' | 'ar', string>;
  genitive: Record<'el' | 'en' | 'ar', string>;
  isHq?: boolean;
  neighborhoods?: Record<'el' | 'en' | 'ar', string[]>;
  localContext: Record<'el' | 'en' | 'ar', string>;
}

export const areas: Record<AreaSlug, AreaInfo> = {
  kallithea: {
    slug: 'kallithea',
    isHq: true,
    name: {
      el: 'Καλλιθέα',
      en: 'Kallithea',
      ar: 'كاليثيا',
    },
    genitive: {
      el: 'στην Καλλιθέα',
      en: 'in Kallithea',
      ar: 'في كاليثيا',
    },
    neighborhoods: {
      el: ['Καλλιθέα Κέντρο', 'Τζιτζιφιές', 'Χαροκόπου', 'Λόφος Σικελίας', 'Αγία Ελεούσα'],
      en: ['Central Kallithea', 'Tzitzifies', 'Charokopou', 'Lofos Sikelias', 'Agia Eleousa'],
      ar: ['وسط كاليثيا', 'تسيتسيفيس', 'خاروكوبو', 'تلة سيكيليا', 'أغيا إليوسا'],
    },
    localContext: {
      el: 'Με έδρα στη Λ. Συγγρού 196 στην Καλλιθέα, η ομάδα μας ανταποκρίνεται άμεσα για δωρεάν αυτοψία σε όλη την περιοχή. Γνωρίζουμε άριστα τις κατασκευαστικές ανάγκες των πολυκατοικιών της Καλλιθέας (παλιές ασφαλτικές μονώσεις, υγρασίες σε φωταγωγούς, ρωγμές σε στηθαία) και προσφέρουμε οριστικές λύσεις με σύγχρονα πιστοποιημένα υλικά.',
      en: 'Based at 196 Syngrou Ave in Kallithea, our team responds quickly for a free on-site survey across the area. We understand the specific construction challenges of local residential buildings and provide durable, modern waterproofing and painting solutions.',
      ar: 'بفضل مقرنا في 196 شارع سينغرو في كاليثيا، يستجيب فريقنا بسرعة للمعاينة المجانية في جميع أنحاء المنطقة. نحن على دراية كاملة بمتطلبات المباني السكنية ونقدم حلولاً جذرية ومضمونة.',
    },
  },

  'athina-kentro': {
    slug: 'athina-kentro',
    name: {
      el: 'Κέντρο Αθήνας',
      en: 'Athens Center',
      ar: 'وسط أثينا',
    },
    genitive: {
      el: 'στο Κέντρο της Αθήνας',
      en: 'in Athens Center',
      ar: 'في وسط أثينا',
    },
    neighborhoods: {
      el: ['Κουκάκι', 'Παγκράτι', 'Νέος Κόσμος', 'Κολωνάκι', 'Εξάρχεια', 'Κυψέλη', 'Πετράλωνα', 'Αμπελόκηποι', 'Ιλίσια'],
      en: ['Koukaki', 'Pagkrati', 'Neos Kosmos', 'Kolonaki', 'Exarcheia', 'Kypseli', 'Petralona', 'Ampelokipoi', 'Ilisia'],
      ar: ['كوكاكي', 'بانغراتي', 'نيوس كوزموس', 'كولوناكي', 'إكزارخيا', 'كيبسيلي', 'بيترالونا', 'أمبيلوكيبوي', 'إليسيا'],
    },
    localContext: {
      el: 'Εξυπηρετούμε καθημερινά όλο το ιστορικό και εμπορικό κέντρο της Αθήνας σε 5-10 λεπτά από την έδρα μας στη Συγγρού. Τα κτίρια του κέντρου (πολυκατοικίες δεκαετίας \'60-\'80) παρουσιάζουν συχνά διαρροές από παλιές στρώσεις, ρωγμές σε στενά μπαλκόνια και υγρασία σε φωταγωγούς. Αναλαμβάνουμε στοχευμένη στεγανοποίηση, ανακαινίσεις διαμερισμάτων και φρεσκάρισμα εσωτερικών και εξωτερικών χώρων.',
      en: 'Serving the entire central Athens basin within minutes from our Syngrou Ave base. Central Athens apartments often face persistent leaks from aged roof layers, parapet cracks, and damp light-wells. We specialize in non-invasive waterproofing, full apartment refurbishments, and interior repainting.',
      ar: 'نخدم يومياً كافة مناطق وسط أثينا في غضون دقائق من مقرنا. تعاني مباني الوسط القديمة من تسربات الأسطح وتشققات الشرفات ورطوبة المناور، ونوفر حلول عزل متقدمة وتشطيبات متكاملة للشقق.',
    },
  },

  'notia-proastia': {
    slug: 'notia-proastia',
    name: {
      el: 'Νότια Προάστια',
      en: 'Southern Suburbs',
      ar: 'الضواحي الجنوبية',
    },
    genitive: {
      el: 'στα Νότια Προάστια',
      en: 'in Southern Suburbs',
      ar: 'في الضواحي الجنوبية',
    },
    neighborhoods: {
      el: ['Νέα Σμύρνη', 'Παλαιό Φάληρο', 'Άλιμος', 'Άγιος Δημήτριος', 'Μοσχάτο', 'Ταύρος', 'Ηλιούπολη', 'Αργυρούπολη'],
      en: ['Nea Smyrni', 'Palaio Faliro', 'Alimos', 'Agios Dimitrios', 'Moschato', 'Tavros', 'Ilioupoli', 'Argyroupoli'],
      ar: ['نيا سميرني', 'باليو فاليرو', 'أليموس', 'أغيوس ديميتريوس', 'موسخاتو', 'تافروس', 'إليوبولي', 'أرجيروبولي'],
    },
    localContext: {
      el: 'Άμεση κάλυψη σε όλους τους δήμους των Νοτίων Προαστίων. Η εγγύτητα στη θάλασσα επιφέρει αυξημένη υγρασία και διάβρωση από άλατα σε ταράτσες, εξωτερικούς τοίχους και κάγκελα. Εφαρμόζουμε πολυουρεθανικές μεμβράνες υψηλής ελαστικότητας και ειδικά ακρυλικά χρώματα μέγιστης αντοχής.',
      en: 'Rapid response across all Southern Suburbs. Proximity to the Saronic Gulf brings elevated humidity and airborne salt, which accelerates roof deterioration and facade peeling. We apply high-grade polyurethane membranes and weather-proof exterior coatings.',
      ar: 'تغطية سريعة لجميع مناطق الضواحي الجنوبية. القرب من البحر يتسبب في رطوبة عالية وأملاح تؤثر على الأسطح والجدران، لذلك نستخدم عوازل بولي يوريثان مطاطية ودهانات مقاومة للعوامل الجوية البحرية.',
    },
  },

  'glyfada-voula': {
    slug: 'glyfada-voula',
    name: {
      el: 'Γλυφάδα & Παραλιακή',
      en: 'Glyfada & Coastal Front',
      ar: 'غليفادا والساحل',
    },
    genitive: {
      el: 'στη Γλυφάδα & την Παραλιακή',
      en: 'in Glyfada & Coastal Areas',
      ar: 'في غليفادا والمنطقة الساحلية',
    },
    neighborhoods: {
      el: ['Γλυφάδα', 'Άνω Γλυφάδα', 'Βούλα', 'Βάρη', 'Βουλιαγμένη', 'Ελληνικό', 'Κάτω Βούλα'],
      en: ['Glyfada', 'Ano Glyfada', 'Voula', 'Vari', 'Vouliagmeni', 'Elliniko', 'Kato Voula'],
      ar: ['غليفادا', 'أنو غليفادا', 'فولا', 'فاري', 'فولياغميني', 'إلينيكو', 'كاتو فولا'],
    },
    localContext: {
      el: 'Εξειδικευμένες εργασίες σε κατοικίες, μεζονέτες και πολυκατοικίες στη Γλυφάδα, τη Βούλα και τη Βουλιαγμένη. Δίνουμε έμφαση σε ανακλαστικές λευκές πολυουρεθανικές μονώσεις που αντέχουν στην έντονη ηλιοφάνεια και τη θαλάσσια υγρασία, καθώς και σε πολυτελείς ελαιοχρωματισμούς και ανακαινίσεις υψηλών απαιτήσεων.',
      en: 'Specialized solutions for residential houses, penthouses, and luxury apartments in Glyfada, Voula, and Vouliagmeni. We focus on cool-roof UV reflective polyurethane systems, salt-resistant exterior paints, and high-end interior finishes.',
      ar: 'أعمال متخصصة للفيلات والمباني السكنية الراقية في غليفادا وفولا وفولياغميني، مع التركيز على عزل الأسطح العاكس للحرارة المقاوم للشمس والأملاح والتشطيبات الفاخرة.',
    },
  },

  'nea-smyrni-faliro': {
    slug: 'nea-smyrni-faliro',
    name: {
      el: 'Νέα Σμύρνη & Παλαιό Φάληρο',
      en: 'Nea Smyrni & Palaio Faliro',
      ar: 'نيا سميرني وباليو فاليرو',
    },
    genitive: {
      el: 'στη Νέα Σμύρνη & το Παλαιό Φάληρο',
      en: 'in Nea Smyrni & Palaio Faliro',
      ar: 'في نيا سميرني وباليو فاليرو',
    },
    neighborhoods: {
      el: ['Νέα Σμύρνη Κέντρο', 'Αγία Παρασκευή', 'Φλοίσβος', 'Μπάτης', 'Έδεμ', 'Αμφιθέα', 'Κοψαχείλα'],
      en: ['Nea Smyrni Center', 'Agia Paraskevi', 'Flisvos', 'Batis', 'Edem', 'Amfithea', 'Kopsacheila'],
      ar: ['وسط نيا سميرني', 'أغيا باراسكيفي', 'فليسفوس', 'باتيس', 'إديم', 'أمفيثيا', 'كوبساخيلا'],
    },
    localContext: {
      el: 'Άμεση γειτονιά της έδρας μας στην Καλλιθέα. Εξυπηρετούμε τη Νέα Σμύρνη και το Παλαιό Φάληρο μέσα σε λίγα λεπτά. Αντιμετωπίζουμε συχνά προβλήματα παλαιών ασφαλτοπάνων που έχουν σκάσει, φουσκωμένων χρωμάτων σε ταβάνια κάτω από ταράτσες και ανάγκες ανακαίνισης λουτρών και κουζινών.',
      en: 'Direct neighbor to our Kallithea headquarters. We reach Nea Smyrni and Palaio Faliro within minutes. We resolve cracked asphalt roofs, ceiling damp patches under terraces, and provide comprehensive bathroom and interior upgrades.',
      ar: 'مجاورة مباشرة لمقرنا في كاليثيا. نصل إلى نيا سميرني وباليو فاليرو في دقائق معدودة، لمعالجة الأسطح المتشققة ورطوبة الأسقف وتجديد المطابخ والحمامات.',
    },
  },

  'voreia-proastia': {
    slug: 'voreia-proastia',
    name: {
      el: 'Βόρεια Προάστια',
      en: 'Northern Suburbs',
      ar: 'الضواحي الشمالية',
    },
    genitive: {
      el: 'στα Βόρεια Προάστια',
      en: 'in Northern Suburbs',
      ar: 'في الضواحي الشمالية',
    },
    neighborhoods: {
      el: ['Μαρούσι', 'Χαλάνδρι', 'Κηφισιά', 'Αγία Παρασκευή', 'Βριλήσσια', 'Νέα Ιωνία', 'Πεύκη', 'Μελίσσια', 'Παπάγου', 'Χολαργός'],
      en: ['Marousi', 'Chalandri', 'Kifisia', 'Agia Paraskevi', 'Vrilissia', 'Nea Ionia', 'Pefki', 'Melissia', 'Papagou', 'Cholargos'],
      ar: ['ماروسي', 'خالاندري', 'كيفيسيا', 'أغيا باراسكيفي', 'فريليسيا', 'نيا إيونيا', 'بيفكي', 'ميليسيا', 'باباغو', 'خولارغوس'],
    },
    localContext: {
      el: 'Πλήρης κάλυψη των Βορείων Προαστίων. Το μεγαλύτερο υψόμετρο και οι χαμηλές θερμοκρασίες τον χειμώνα (παγετός, χιόνι) δοκιμάζουν σκληρά τις ταράτσες. Προτείνουμε συνδυαστική θερμομόνωση (αφρός πολυουρεθάνης ή πλάκες XPS) με στεγανοποίηση και εξωτερικές βαφές αντοχής στις απότομες θερμοκρασιακές μεταβολές.',
      en: 'Complete coverage of Northern Suburbs. Higher elevations and cold winter conditions (frost, sub-zero nights) severely stress roofs. We recommend dual thermal insulation and waterproofing systems to prevent interior thermal loss and structural crack formation.',
      ar: 'تغطية شاملة للضواحي الشمالية. الارتفاع وانخفاض درجات الحرارة شتاءً يتطلبان عزلاً حرارياً ومائياً متطوراً لمنع تسرب البرودة والحرارة وحماية الأسطح من التصدع بفعل الصقيع.',
    },
  },

  'marousi-chalandri': {
    slug: 'marousi-chalandri',
    name: {
      el: 'Μαρούσι & Χαλάνδρι',
      en: 'Marousi & Chalandri',
      ar: 'ماروسي وخالاندري',
    },
    genitive: {
      el: 'στο Μαρούσι & το Χαλάνδρι',
      en: 'in Marousi & Chalandri',
      ar: 'في ماروسي وخالاندري',
    },
    neighborhoods: {
      el: ['Μαρούσι Κέντρο', 'Παράδεισος Αμαρουσίου', 'Πολύδροσο', 'Χαλάνδρι Κέντρο', 'Πάτημα Χαλανδρίου', 'Κάτω Χαλάνδρι', 'Τούφα'],
      en: ['Marousi Center', 'Paradeisos', 'Polydroso', 'Chalandri Center', 'Patima', 'Kato Chalandri', 'Toufa'],
      ar: ['وسط ماروسي', 'باراديسوس', 'بوليدروسو', 'وسط خالاندري', 'باتيما', 'كاتو خالاندري', 'توفا'],
    },
    localContext: {
      el: 'Σημαντικός οικιστικός και επαγγελματικός κόμβος της Αθήνας. Εξυπηρετούμε πολυκατοικίες, αυτόνομα κτίρια και μονοκατοικίες σε Μαρούσι και Χαλάνδρι. Παρέχουμε ελαφριές μονώσεις ταρατσών χωρίς πρόσθετο βάρος, ανακαινίσεις διαμερισμάτων και βαφές εσωτερικών και εξωτερικών επιφανειών.',
      en: 'A premier residential and commercial district. We serve apartment blocks and family homes across Marousi and Chalandri, installing lightweight roof waterproofing, modern interior finishes, and durable facade coatings.',
      ar: 'مركز سكني وتجاري رئيسي في أثينا. نقدم خدمات عزل أسطح خفيفة الوزن للمباني السكنية والمنازل في ماروسي وخالاندري، بالإضافة إلى تجديد الشقق والدهانات.',
    },
  },

  'kifisia-ekali': {
    slug: 'kifisia-ekali',
    name: {
      el: 'Κηφισιά & Εκάλη',
      en: 'Kifisia & Ekali',
      ar: 'كيفيسيا وإكالي',
    },
    genitive: {
      el: 'στην Κηφισιά & την Εκάλη',
      en: 'in Kifisia & Ekali',
      ar: 'في كيفيسيا وإكالي',
    },
    neighborhoods: {
      el: ['Κηφισιά Κέντρο', 'Κεφαλάρι', 'Πολιτεία', 'Νέα Ερυθραία', 'Εκάλη', 'Δροσιά', 'Καστρί'],
      en: ['Kifisia Center', 'Kefalari', 'Politeia', 'Nea Erythraia', 'Ekali', 'Drosia', 'Kastri'],
      ar: ['وسط كيفيسيا', 'كيفالاري', 'بوليتيا', 'نيا إريثريا', 'إكالي', 'دروسيا', 'كاستري'],
    },
    localContext: {
      el: 'Εργασίες υψηλών προδιαγραφών σε μονοκατοικίες, βίλες και πολυτελείς κατοικίες της Κηφισιάς, της Πολιτείας και της Εκάλης. Αντιμετωπίζουμε τις έντονες χειμερινές καταπονήσεις με πιστοποιημένα ελαστομερή και θερμομονωτικά υλικά, αναλαμβάνοντας επίσης συντήρηση ξύλινων κουφωμάτων/περγκολών και ποιοτικούς ελαιοχρωματισμούς.',
      en: 'High-standard craftsmanship for villas, maisonettes, and luxury residences in Kifisia, Politeia, and Ekali. We engineer thermal insulation against harsh winter temperatures, waterproof complex roof architectures, and restore fine exterior woodwork and shutters.',
      ar: 'أعمال عالية الجودة للفيلات والمنازل الراقية في كيفيسيا وإكالي وبوليتيا، مع معالجة تأثيرات الشتاء البارد بعوازل حرارية ومائية معتمدة، وصيانة الأخشاب والشرفات والدهانات.',
    },
  },

  peiraias: {
    slug: 'peiraias',
    name: {
      el: 'Πειραιάς',
      en: 'Piraeus',
      ar: 'بيرايوس',
    },
    genitive: {
      el: 'στον Πειραιά',
      en: 'in Piraeus',
      ar: 'في بيرايوس',
    },
    neighborhoods: {
      el: ['Κέντρο Πειραιά', 'Καστέλλα', 'Πασαλιμάνι', 'Φρεαττύδα', 'Πειραϊκή', 'Ταμπούρια', 'Κερατσίνι', 'Δραπετσώνα'],
      en: ['Piraeus Center', 'Kastella', 'Pasalimani', 'Freattyda', 'Peiraiki', 'Tampouria', 'Keratsini', 'Drapetsona'],
      ar: ['وسط بيرايوس', 'كاستيلا', 'باساليماني', 'فرياتيدا', 'بيرايكي', 'تامبوريا', 'كيراتسيني', 'درابيتسونا'],
    },
    localContext: {
      el: 'Εύκολη πρόσβαση στον Πειραιά και τις γύρω περιοχές μέσω Πειραιώς και Παραλιακής. Το θαλασσινό περιβάλλον και η έντονη αστική δραστηριότητα επιβαρύνουν τα κτίρια με υγρασία και άλατα. Εφαρμόζουμε ανθεκτικά ασφαλτόπανα SBS, ελαστομερείς πολυουρεθάνες και αντιδιαβρωτικά χρώματα σε κάγκελα και μεταλλικές κατασκευές.',
      en: 'Fast access to Piraeus and coastal districts via Peiraios Ave and Posidonos. Marine exposure causes extensive salt crusting and concrete spalling. We install heavy-duty SBS membranes, aliphatic polyurethane topcoats, and anti-corrosive metal coatings on balconies.',
      ar: 'وصول سريع إلى بيرايوس والمناطق الساحلية. تتأثر المباني بالرطوبة البحرية والأملاح، لذلك نعتمد على لفائف البيتومين المقواة وعوازل البولي يوريثان والدهانات المضادة للصدأ.',
    },
  },

  'dytika-proastia': {
    slug: 'dytika-proastia',
    name: {
      el: 'Δυτικά Προάστια',
      en: 'Western Suburbs',
      ar: 'الضواحي الغربية',
    },
    genitive: {
      el: 'στα Δυτικά Προάστια',
      en: 'in Western Suburbs',
      ar: 'في الضواحي الغربية',
    },
    neighborhoods: {
      el: ['Περιστέρι', 'Αιγάλεω', 'Ίλιον', 'Κορυδαλλός', 'Νίκαια', 'Χαϊδάρι', 'Αγία Βαρβάρα', 'Πετρούπολη'],
      en: ['Peristeri', 'Aigaleo', 'Ilion', 'Korydallos', 'Nikaia', 'Chaidari', 'Agia Varvara', 'Petroupoli'],
      ar: ['بيريستيري', 'إيغاليو', 'إيليون', 'كوريدالوس', 'نيكايا', 'خايداري', 'أغيا فارفارا', 'بيتروبولي'],
    },
    localContext: {
      el: 'Άμεση εξυπηρέτηση σε όλους τους δήμους των Δυτικών Προαστίων (Περιστέρι, Αιγάλεω, Νίκαια, Κορυδαλλό). Πολλά κτίρια διαθέτουν παλιές τσιμεντοκονίες ή φθαρμένες μονώσεις με λιμνάζοντα νερά. Προσφέρουμε οικονομικές και οριστικές λύσεις στεγανοποίησης, γρήγορες ανακαινίσεις διαμερισμάτων και ποιοτικό βάψιμο.',
      en: 'Prompt service across all Western Suburbs (Peristeri, Aigaleo, Nikaia, Korydallos). Dense residential stock often has deteriorating screeds and pooling water. We provide reliable waterproofing, fast turn-around renovations, and clean painting.',
      ar: 'خدمة سريعة في كافة مناطق الضواحي الغربية (بيريستيري، إيغاليو، نيكايا). نوفر حلول عزل أسطح فعالة لمنع تجمع المياه ورشاقة في تنفيذ تجديدات الشقق والدهانات.',
    },
  },

  'anatoliki-attiki': {
    slug: 'anatoliki-attiki',
    name: {
      el: 'Ανατολική Αττική & Μεσόγεια',
      en: 'East Attica & Mesogeia',
      ar: 'شرق أتيكا وميسوجيا',
    },
    genitive: {
      el: 'στην Ανατολική Αττική & τα Μεσόγεια',
      en: 'in East Attica & Mesogeia',
      ar: 'في شرق أتيكا وميسوجيا',
    },
    neighborhoods: {
      el: ['Γέρακας', 'Παλλήνη', 'Παιανία', 'Κορωπί', 'Μαρκόπουλο', 'Αρτέμιδα (Λούτσα)', 'Πόρτο Ράφτη', 'Σπάτα'],
      en: ['Gerakas', 'Pallini', 'Paiania', 'Koropi', 'Markopoulo', 'Artemida', 'Porto Rafti', 'Spata'],
      ar: ['جيراكاس', 'باليني', 'بيانيا', 'كوروبي', 'ماركوبولو', 'أرتيميدا', 'بورتو رافتي', 'سباتا'],
    },
    localContext: {
      el: 'Κάλυψη μονοκατοικιών, εξοχικών και νέων κτιρίων στην Ανατολική Αττική και τα Μεσόγεια. Οι έντονες καιρικές συνθήκες (δυνατοί άνεμοι, καλοκαιρινή ζέστη και χειμερινή υγρασία) απαιτούν ανθεκτικά θερμομονωτικά συστήματα ταράτσας και αξιόπιστες εξωτερικές βαφές προσόψεων.',
      en: 'Full service for detached houses, country residences, and newer buildings in East Attica and Mesogeia. High wind exposure and intense summer heat require robust thermal barrier coatings and high-durability exterior paints.',
      ar: 'تغطية متكاملة للمنازل المنفصلة والفلل في شرق أتيكا وميسوجيا، مع توفير عزل حراري قوي لمواجهة الرياح وحرارة الصيف الشديدة ودهانات واجهات متينة.',
    },
  },
};

export const localServiceSlugs = ['insulation', 'painting', 'renovations'] as const;
export type LocalServiceSlug = (typeof localServiceSlugs)[number];

export function isLocalServiceSlug(slug: string): slug is LocalServiceSlug {
  return (localServiceSlugs as readonly string[]).includes(slug as LocalServiceSlug);
}

export function isAreaSlug(slug: string): slug is AreaSlug {
  return (areaSlugs as readonly string[]).includes(slug as AreaSlug);
}
