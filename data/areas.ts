export const areaSlugs = ['kallithea', 'notia-proastia'] as const;
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
      el: ['Νέα Σμύρνη', 'Παλαιό Φάληρο', 'Άλιμος', 'Γλυφάδα', 'Άγιος Δημήτριος', 'Μοσχάτο', 'Ταύρος'],
      en: ['Nea Smyrni', 'Palaio Faliro', 'Alimos', 'Glyfada', 'Agios Dimitrios', 'Moschato', 'Tavros'],
      ar: ['نيا سميرني', 'باليو فاليرو', 'أليموس', 'غليفادا', 'أغيوس ديميتريوس', 'موسخاتو', 'تافروس'],
    },
    localContext: {
      el: 'Άμεση εξυπηρέτηση σε όλα τα Νότια Προάστια της Αττικής. Λόγω της εγγύτητας στη θάλασσα, οι ταράτσες και οι εξωτερικοί τοίχοι στα νότια προάστια καταπονούνται ιδιαίτερα από την αυξημένη υγρασία και τα άλατα. Εφαρμόζουμε ανθεκτικές ελαστομερείς πολυουρεθάνες και ειδικά αντιδιαβρωτικά ακρυλικά χρώματα για μέγιστη διάρκεια.',
      en: 'Fast on-site service across the Southern Suburbs of Athens. Proximity to the coast exposes roofs and facades to higher humidity and salt air. We use high-grade polyurethane waterproofing and weather-resistant acrylic coatings engineered for long-term coastal protection.',
      ar: 'خدمة سريعة في جميع الضواحي الجنوبية لأثينا. نظراً لقرب الساحل والرطوبة العالية، نستخدم عوازل بولي يوريثان متطورة ودهانات أكريليك مقاومة للأملاح والعوامل الجوية القاسية.',
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
