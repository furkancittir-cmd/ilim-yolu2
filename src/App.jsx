import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Crown,
  Gem,
  Home,
  Layers3,
  LogIn,
  LogOut,
  Medal,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Volume2,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "ilim-yolu-v7";
const todayKey = () => new Date().toISOString().slice(0, 10);
const emptyPrayer = () => ({ sabah: false, ogle: false, ikindi: false, aksam: false, yatsi: false });

const surahData = [
  {
    id: "fatiha",
    name: "Fâtiha Suresi",
    arabicTitle: "الفاتحة",
    verses: 7,
    usage: 10,
    status: "memorized",
    arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ
الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ
الرَّحْمٰنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
    translit: `Bismillâhirrahmânirrahîm. Elhamdülillâhi rabbil âlemîn. Errahmânirrahîm. Mâliki yevmiddîn. İyyâke na'budu ve iyyâke neste'în. İhdinessırâtel mustakîm. Sırâtellezîne en'amte aleyhim gayril mağdûbi aleyhim ve leddâllîn.`,
    meaning: `Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi Allah’a mahsustur. O, Rahmân’dır, Rahîm’dir. Din gününün sahibidir. Ancak Sana ibadet eder ve ancak Senden yardım dileriz. Bizi dosdoğru yola ilet. Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil.`,
  },
  {
    id: "ihlas",
    name: "İhlâs Suresi",
    arabicTitle: "الإخلاص",
    verses: 4,
    usage: 10,
    status: "memorized",
    arabic: `قُلْ هُوَ اللّٰهُ أَحَدٌ
اللّٰهُ الصَّمَدُ
لَمْ يَلِدْ وَلَمْ يُولَدْ
وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ`,
    translit: `Kul hüvallâhu ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû kufuven ehad.`,
    meaning: `De ki: O Allah birdir. Allah sameddir. O doğurmamış ve doğmamıştır. Hiçbir şey O’na denk değildir.`,
  },
  {
    id: "felak",
    name: "Felak Suresi",
    arabicTitle: "الفلق",
    verses: 5,
    usage: 9,
    status: "memorized",
    arabic: `قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ
مِن شَرِّ مَا خَلَقَ
وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ
وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ
وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
    translit: `Kul eûzü birabbil felak. Min şerri mâ halak. Ve min şerri gâsıkin izâ vekab. Ve min şerrin neffâsâti fil ukad. Ve min şerri hâsidin izâ hased.`,
    meaning: `De ki: Yarattığı şeylerin şerrinden, karanlığı çöktüğünde gecenin şerrinden, düğümlere üfleyenlerin şerrinden ve haset edenin şerrinden sabahın Rabbine sığınırım.`,
  },
  {
    id: "nas",
    name: "Nâs Suresi",
    arabicTitle: "الناس",
    verses: 6,
    usage: 9,
    status: "memorized",
    arabic: `قُلْ أَعُوذُ بِرَبِّ النَّاسِ
مَلِكِ النَّاسِ
إِلٰهِ النَّاسِ
مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ
الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ
مِنَ الْجِنَّةِ وَالنَّاسِ`,
    translit: `Kul eûzü birabbin nâs. Melikin nâs. İlâhin nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin nâs. Minel cinneti vennâs.`,
    meaning: `De ki: İnsanların Rabbine, insanların Melikine, insanların ilâhına sığınırım. Sinsice vesvese veren şeytanın şerrinden; insanların göğüslerine vesvese veren; cinlerden ve insanlardan olan vesvesecinin şerrinden.`,
  },
  {
    id: "ayetelkursi",
    name: "Ayetel Kürsi",
    arabicTitle: "آية الكرسي",
    verses: 1,
    usage: 10,
    status: "in_progress",
    arabic: `اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ
لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ
لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ
مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ
يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ
وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ
وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ
وَلَا يَئُودُهُ حِفْظُهُمَا
وَهُوَ الْعَلِيُّ الْعَظِيمُ`,
    translit: `Allâhu lâ ilâhe illâ hüve'l-hayyü'l-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fil ard. Menzellezî yeşfeu indehû illâ bi iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehum. Ve lâ yuhîtûne bi şey'in min ilmihî illâ bimâ şâe. Vesi'a kürsiyyühüs-semâvâti vel ard. Ve lâ yeûdühû hıfzuhumâ. Ve huvel aliyyül azîm.`,
    meaning: `Allah; O’ndan başka ilâh yoktur, diridir, kayyumdur. Onu ne uyuklama tutar ne uyku. Göklerde ve yerde ne varsa O’nundur. İzni olmadan O’nun katında kim şefaat edebilir? Önlerindekini ve arkalarındakini bilir. O’nun ilminden, dilediği kadarından başka hiçbir şeyi kuşatamazlar. Kürsüsü gökleri ve yeri kaplamıştır. Onları koruyup gözetmek O’na ağır gelmez. O yücedir, büyüktür.`,
  },
  {
    id: "kunut_hanefi",
    name: "Kunut Duası (Hanefî)",
    arabicTitle: "دعاء القنوت",
    verses: 1,
    usage: 8,
    status: "not_started",
    arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ`,
    translit: `Allâhümme innâ nesteînüke ve nestağfirüke ve nü'minü bike ve netevekkelu aleyke ve nüsnî aleykel hayra ve neşküruke ve lâ nekfüruke ve nahleu ve netrukü men yefcüruk.`,
    meaning: `Allah’ım! Senden yardım isteriz, bağışlanma dileriz, Sana iman ederiz, Sana dayanırız. Sana hayır ile hamd eder, Sana şükrederiz. Sana nankörlük etmeyiz. Sana isyan edeni terk ederiz.`,
  },
  {
    id: "kunut_shafii",
    name: "Kunut Duası (Şâfiî)",
    arabicTitle: "دعاء القنوت",
    verses: 1,
    usage: 8,
    status: "not_started",
    arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ`,
    translit: `Allâhümmehdinî fîmen hedeyt. Ve âfinî fîmen âfeyt. Ve tevellenî fîmen tevelleyt. Ve bârik lî fîmâ a'tayt. Ve kinî şerre mâ kadayt.`,
    meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver. Afiyet verdiklerin arasında bana da afiyet ver. Dost edindiklerin arasında beni de dost edin. Bana verdiğin şeylerde bereket ver. Hükmettiğin şeylerin şerrinden beni koru.`,
  },
  {
    id: "esma",
    name: "Esmâ / Kısa Sureler",
    arabicTitle: "Seçmeli",
    verses: 0,
    usage: 4,
    status: "not_started",
    arabic: `—`,
    translit: `Bu alanı daha sonra genişletebiliriz.`,
    meaning: `Ek sureler için yer tutucu.`,
  },
];

const duaData = [
  { id: "ettehiyyat", name: "Ettehiyyâtü", arabic: `التَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ
السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ
السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللّٰهِ الصَّالِحِينَ
أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ
وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`, translit: `Ettehiyyâtü lillâhi vessalavâtü vettayyibât. Esselâmü aleyke eyyühen nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ibâdillâhis sâlihîn. Eşhedü enlâ ilâhe illallâh. Ve eşhedü enne Muhammeden abdühû ve resûlüh.`, meaning: `Bütün selamlar, ibadetler ve güzel şeyler Allah içindir. Ey Nebi, Allah’ın selamı, rahmeti ve bereketi senin üzerine olsun. Selam bizim üzerimize ve Allah’ın salih kullarının üzerine olsun. Şahitlik ederim ki Allah’tan başka ilah yoktur. Ve şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.` },
  { id: "salli", name: "Allâhumme Salli", arabic: `اللّٰهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ
وَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline salât eyle.` },
  { id: "barik", name: "Allâhumme Bârik", arabic: `اللّٰهُمَّ بَارِكْ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ
وَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme bârik alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline bereket ver.` },
  { id: "rabbenaatina", name: "Rabbena Âtinâ", arabic: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`, translit: `Rabbenâ âtinâ fid-dünyâ haseneten ve fil âhireti haseneten ve kınâ azâben nâr.`, meaning: `Rabbimiz! Bize dünyada iyilik, ahirette de iyilik ver ve bizi ateş azabından koru.` },
  { id: "rabbenağfirli", name: "Rabbenağfirli", arabic: `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ`, translit: `Rabbiğfir lî ve livâlideyye ve lil mü'minîne yevme yekûmül hisâb.`, meaning: `Rabbim! Beni, anne-babamı ve hesabın görüleceği günde bütün müminleri bağışla.` },
  { id: "kunut_hanefi", name: "Kunut (Hanefî)", arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ...`, translit: `Allâhümme innâ nesteînüke ve nestağfirüke...`, meaning: `Allah’ım! Senden yardım ister, bağışlanma diler ve Sana dayanırız.` },
  { id: "kunut_shafii", name: "Kunut (Şâfiî)", arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ...`, translit: `Allâhümmehdinî fîmen hedeyt...`, meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver.` },
];

const zikrData = [
  { id: "subhanallah", name: "Sübhanallah", arabic: "سُبْحَانَ اللّٰهِ", translit: "Sübhanallah", meaning: "Allah’ı bütün eksikliklerden tenzih ederim.", defaultTarget: 33 },
  { id: "elhamdulillah", name: "Elhamdülillah", arabic: "الْحَمْدُ لِلّٰهِ", translit: "Elhamdülillah", meaning: "Hamd Allah’a mahsustur.", defaultTarget: 33 },
  { id: "allahu_ekber", name: "Allahu Ekber", arabic: "اللّٰهُ أَكْبَرُ", translit: "Allahu Ekber", meaning: "Allah en büyüktür.", defaultTarget: 33 },
  { id: "la_ilaha", name: "Lâ ilâhe illallâh", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", translit: "Lâ ilâhe illallâh", meaning: "Allah’tan başka ilah yoktur.", defaultTarget: 33 },
  { id: "estagfirullah", name: "Estağfirullah", arabic: "أَسْتَغْفِرُ اللّٰهَ", translit: "Estağfirullah", meaning: "Allah’tan bağışlanma dilerim.", defaultTarget: 33 },
  { id: "salavat", name: "Salavat-ı Şerif", arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ", translit: "Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.", meaning: "Peygamber Efendimize salavat getirir.", defaultTarget: 33 },
  { id: "lahaula", name: "Lâ havle ve lâ kuvvete", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ", translit: "Lâ havle ve lâ kuvvete illâ billâh", meaning: "Güç ve kuvvet ancak Allah’ladır.", defaultTarget: 33 },
  { id: "hasbunallah", name: "Hasbunallahu", arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ", translit: "Hasbunallâhu ve ni'mel vekîl", meaning: "Allah bize yeter, O ne güzel vekildir.", defaultTarget: 33 },
  { id: "subhanallahi", name: "Sübhanallahi ve bihamdihi", arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", translit: "Sübhanallahi ve bihamdihi", meaning: "Allah’ı hamdiyle tesbih ederim.", defaultTarget: 100 },
  { id: "bismillah", name: "Bismillâhillazî lâ yedurru", arabic: "بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ", translit: "Bismillâhillazî lâ yedurru", meaning: "Allah’ın adıyla; O’nun adıyla hiçbir şey zarar vermez.", defaultTarget: 3 },
];

const DEFAULT_STATE = {
  auth: false,
  username: "furkancittir",
  level: 3,
  xp: 1150,
  gems: 24,
  dailyStreak: 6,
  prayerDone: emptyPrayer(),
  prayerHistory: [],
  lastPrayerDate: "",
  missedPrayers: 12,
  monthlyMissed: 4,
  surahProgress: { fatiha: 33, ihlas: 33, felak: 33, nas: 33, ayetelkursi: 12 },
  surahStatuses: { fatiha: "memorized", ihlas: "memorized", felak: "memorized", nas: "memorized", ayetelkursi: "in_progress" },
  totalReadCounts: {},
  selectedTab: "home",
  selectedSurah: "fatiha",
  selectedDua: "ettehiyyat",
  surahSort: "usage",
  tesbihatType: "short",
  tesbihatIndex: 0,
  tesbihatProgress: [],
  zikrSelected: "subhanallah",
  zikrCounts: {},
  zikrTarget: 33,
  dailyLogs: { date: "", zikrs: [], duas: [] },
  notifications: ["Bugün Öğle namazını kılmayı unutma!", "Felak Suresi hatırlatma günü!", "Tesbihat zamanı!"],
};

function normalizeState(s) {
  return {
    ...DEFAULT_STATE,
    ...s,
    prayerDone: s.prayerDone || emptyPrayer(),
    prayerHistory: Array.isArray(s.prayerHistory) ? s.prayerHistory : [],
    dailyLogs: s.dailyLogs || { date: "", zikrs: [], duas: [] },
    totalReadCounts: s.totalReadCounts || {},
    surahProgress: s.surahProgress || DEFAULT_STATE.surahProgress,
    surahStatuses: s.surahStatuses || DEFAULT_STATE.surahStatuses,
    zikrCounts: s.zikrCounts || {},
    selectedTab: s.selectedTab && s.selectedTab !== "oyun" ? s.selectedTab : "home",
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return normalizeState(raw ? JSON.parse(raw) : DEFAULT_STATE);
  } catch {
    return DEFAULT_STATE;
  }
}

function calculatePrayerStreak(history = []) {
  const map = new Map(history.filter(Boolean).map((x) => [x.date, Number(x.count || 0)]));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if ((map.get(todayKey()) || 0) < 1) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (streak < 365) {
    const key = cursor.toISOString().slice(0, 10);
    if ((map.get(key) || 0) >= 1) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

function getPrayerSeries(history = [], days = 7) {
  const map = new Map(history.filter(Boolean).map((x) => [x.date, Number(x.count || 0)]));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() - (days - 1 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: map.get(key) || 0 };
  });
}

function App() {
  const [state, setState] = useState(loadState);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [search, setSearch] = useState("");
  const [celebrate, setCelebrate] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    setState((s) => ({ ...s, level: Math.floor(s.xp / 500) + 1 }));
  }, [state.xp]);

  useEffect(() => {
    const syncDay = () => {
      const t = todayKey();
      setState((s) => {
        if (s.lastPrayerDate === t) return s;
        const count = Object.values(s.prayerDone || emptyPrayer()).filter(Boolean).length;
        const history = Array.isArray(s.prayerHistory) ? s.prayerHistory : [];
        const nextHistory = history.some((x) => x.date === t) ? history : [...history, { date: t, count }];
        return { ...s, lastPrayerDate: t, prayerHistory: nextHistory.slice(-30), prayerDone: emptyPrayer() };
      });
    };
    syncDay();
    const timer = setInterval(syncDay, 60_000);
    return () => clearInterval(timer);
  }, []);

  const prayerStreak = calculatePrayerStreak(state.prayerHistory);
  const prayerSeries = getPrayerSeries(state.prayerHistory, 7);
  const today = todayKey();
  const todayCount = Object.values(state.prayerDone).filter(Boolean).length;
  const prayerFinished = todayCount === 5;

  const selectedSurah = surahData.find((s) => s.id === state.selectedSurah) || surahData[0];
  const selectedDua = duaData.find((d) => d.id === state.selectedDua) || duaData[0];
  const selectedZikr = zikrData.find((z) => z.id === state.zikrSelected) || zikrData[0];

  const filteredSurahs = useMemo(() => {
    let items = [...surahData];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((s) => s.name.toLowerCase().includes(q) || s.translit.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q));
    }
    if (state.surahSort === "alphabetical") items.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    if (state.surahSort === "length") items.sort((a, b) => a.verses - b.verses);
    if (state.surahSort === "usage") items.sort((a, b) => b.usage - a.usage);
    return items;
  }, [search, state.surahSort]);

  function login(e) {
    e?.preventDefault?.();
    if (user.trim().toLowerCase() === "furkancittir" && pass === "1234") {
      setState((s) => ({ ...s, auth: true, selectedTab: "home" }));
      setLoginError("");
    } else {
      setLoginError("Kullanıcı adı veya şifre yanlış.");
    }
  }

  function logout() {
    setState((s) => ({ ...s, auth: false }));
  }

  function markPrayer(id) {
    setState((s) => {
      const nextDone = { ...s.prayerDone, [id]: !s.prayerDone[id] };
      const count = Object.values(nextDone).filter(Boolean).length;
      const history = Array.isArray(s.prayerHistory) ? s.prayerHistory : [];
      const t = todayKey();
      const nextHistory = history.some((x) => x.date === t)
        ? history.map((x) => (x.date === t ? { date: t, count } : x))
        : [...history, { date: t, count }];
      return {
        ...s,
        prayerDone: nextDone,
        prayerHistory: nextHistory.slice(-30),
        lastPrayerDate: t,
        prayerStreak: calculatePrayerStreak(nextHistory),
        xp: s.xp + (count === 5 ? 50 : 0),
        gems: s.gems + (count === 5 ? 2 : 0),
      };
    });
    if (prayerFinished) setCelebrate("Tüm vakit namazları tamamlandı!");
  }

  function addSurahRead(id) {
    setState((s) => {
      const next = (s.surahProgress[id] || 0) + 1;
      return {
        ...s,
        surahProgress: { ...s.surahProgress, [id]: next },
        totalReadCounts: { ...(s.totalReadCounts || {}), [id]: ((s.totalReadCounts || {})[id] || 0) + 1 },
        surahStatuses: { ...s.surahStatuses, [id]: next >= 33 ? "memorized" : next > 0 ? "in_progress" : "not_started" },
        xp: s.xp + 2,
      };
    });
  }

  function setSurahStatus(id, status) {
    setState((s) => ({ ...s, surahStatuses: { ...s.surahStatuses, [id]: status } }));
  }

  function markDuaRead(duaId) {
    const name = duaData.find((d) => d.id === duaId)?.name || duaId;
    setState((s) => {
      const t = todayKey();
      const logs = s.dailyLogs?.date === t ? s.dailyLogs : { date: t, zikrs: [], duas: [] };
      return { ...s, dailyLogs: { ...logs, duas: logs.duas.includes(name) ? logs.duas : [...logs.duas, name] } };
    });
  }

  function selectZikr(id, target) {
    setState((s) => ({ ...s, zikrSelected: id, zikrTarget: target, zikrCounts: { ...s.zikrCounts, [id]: s.zikrCounts?.[id] || 0 } }));
  }

  function addZikr() {
    setState((s) => {
      const next = (s.zikrCounts?.[s.zikrSelected] || 0) + 1;
      const t = todayKey();
      const logs = s.dailyLogs?.date === t ? s.dailyLogs : { date: t, zikrs: [], duas: [] };
      const zikrName = selectedZikr?.name || s.zikrSelected;
      return {
        ...s,
        zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: next },
        dailyLogs: { ...logs, zikrs: logs.zikrs.includes(zikrName) ? logs.zikrs : [...logs.zikrs, zikrName] },
        xp: s.xp + 1,
      };
    });
  }

  function resetZikr() {
    setState((s) => ({ ...s, zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: 0 } }));
  }

  function currentTesbihatSteps() {
    const ayet = surahData.find((s) => s.id === "ayetelkursi");
    return [
      { key: "istigfar", label: "İstiğfar ve Selam", title: "Estagfirullah, estagfirullah, estagfirullah. Allahümme entes-selamü ve minkes-selam, tebarekte ya zel-celali vel-ikram.", meaning: "Allah’ım! Sen selam sahibisin, selam/esenlik ancak Sendedir. Ey celal ve ikram sahibi Rabbim, Sen ne yücesin.", count: 1 },
      ...(state.tesbihatType === "long" ? [{ key: "salavat", label: "Salavat", title: "Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.", meaning: "Peygamber Efendimize salavat.", count: 1 }] : []),
      { key: "ayetelkursi", label: "Ayetel Kürsi", title: ayet?.translit || "", meaning: ayet?.meaning || "", arabic: ayet?.arabic || "", count: 1 },
      { key: "subhanallah", label: "Sübhanallah", title: "Sübhanallah", meaning: "Allah’ı bütün eksikliklerden tenzih ederim.", count: 33 },
      { key: "elhamdulillah", label: "Elhamdülillah", title: "Elhamdülillah", meaning: "Hamd Allah’a mahsustur.", count: 33 },
      { key: "allahu_ekber", label: "Allahu Ekber", title: "Allahu Ekber", meaning: "Allah en büyüktür.", count: 33 },
      { key: "tehlil", label: "Tehlil", title: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey'in kadîr.", meaning: "Allah birdir, ortağı yoktur; mülk O’nundur.", count: 1 },
      { key: "dua", label: "Dua", title: "Bismillâhirrahmânirrahîm. Allah’ım! Kıldığım namazı kabul eyle...", meaning: "Kısa bir kabul ve af duası.", count: 1 },
    ];
  }

  const tesbihatSteps = currentTesbihatSteps();
  const currentStep = tesbihatSteps[state.tesbihatIndex] || tesbihatSteps[0];
  const currentStepCount = state.tesbihatProgress?.[state.tesbihatIndex] || 0;

  function incTesbihatStep() {
    setState((s) => {
      const steps = currentTesbihatSteps();
      const step = steps[s.tesbihatIndex] || steps[0];
      const progress = [...(s.tesbihatProgress || Array(steps.length).fill(0))];
      const next = Math.min(step.count, (progress[s.tesbihatIndex] || 0) + 1);
      progress[s.tesbihatIndex] = next;
      return { ...s, tesbihatProgress: progress, tesbihatIndex: next >= step.count ? Math.min(s.tesbihatIndex + 1, steps.length - 1) : s.tesbihatIndex };
    });
  }

  function prevTesbihatStep() {
    setState((s) => ({ ...s, tesbihatIndex: Math.max(0, s.tesbihatIndex - 1) }));
  }

  function completeTesbihat() {
    setCelebrate("Tesbihat tamamlandı!");
    setState((s) => ({ ...s, xp: s.xp + 50, gems: s.gems + 2, tesbihatIndex: 0, tesbihatProgress: [] }));
  }

  const selectedZikrCount = state.zikrCounts?.[state.zikrSelected] || 0;

  if (!state.auth) {
    return (
      <div className="min-h-screen bg-[#faf7f0] p-4 text-slate-900 flex items-center justify-center">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><Sparkles className="h-3.5 w-3.5" /> İlim Yolu</div>
          <h1 className="mt-4 text-2xl font-black text-emerald-950">Giriş Yap</h1>
          <p className="mt-1 text-xs text-slate-500">Kişisel ibadet alanına erişmek için giriş yap.</p>
          {loginError && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600">{loginError}</div>}
          <div className="mt-4 space-y-3">
            <label className="block"><div className="mb-1 text-xs font-semibold">Kullanıcı adı</div><input value={user} onChange={(e) => setUser(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></label>
            <label className="block"><div className="mb-1 text-xs font-semibold">Şifre</div><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></label>
            <button type="submit" className="w-full rounded-2xl bg-emerald-700 py-3 font-semibold text-white">Giriş Yap</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] text-slate-900">
      <div className="mx-auto max-w-[1400px] p-4 pb-24 lg:p-6">
        {(state.selectedTab === "home" || state.selectedTab === "profil") && (
          <header className="mb-4 rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700"><Sparkles className="h-4 w-4" /> İlim Yolu</div>
                <h2 className="mt-1 text-2xl font-black text-emerald-950">Selam, {state.username || "misafir"}</h2>
                <p className="text-sm text-slate-600">Bugün {todayCount}/5 namaz · Streak {prayerStreak}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat label="XP" value={state.xp} icon={Zap} />
                <MiniStat label="Seviye" value={state.level} icon={Crown} />
                <MiniStat label="Gems" value={state.gems} icon={Gem} />
                <MiniStat label="Kaza" value={state.missedPrayers} icon={AlertTriangle} />
              </div>
            </div>
          </header>
        )}

        {celebrate && <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm"><div className="flex items-center gap-2 font-semibold"><Trophy className="h-5 w-5" /> {celebrate}</div></div>}

        {state.selectedTab === "home" && <HomeView state={state} todayCount={todayCount} prayerFinished={prayerFinished} prayerStreak={prayerStreak} prayerSeries={prayerSeries} markPrayer={markPrayer} markDuaRead={markDuaRead} />}
        {state.selectedTab === "sureler" && <SurahView selectedSurah={selectedSurah} selectedDua={selectedDua} filteredSurahs={filteredSurahs} search={search} setSearch={setSearch} sort={state.surahSort} setSort={(v) => setState((s) => ({ ...s, surahSort: v }))} progress={state.surahProgress} statuses={state.surahStatuses} setSelectedSurah={(id) => setState((s) => ({ ...s, selectedSurah: id }))} setSelectedDua={(id) => setState((s) => ({ ...s, selectedDua: id }))} setSurahStatus={setSurahStatus} addSurahRead={addSurahRead} />}
        {state.selectedTab === "tesbihat" && <TesbihatView state={state} tesbihatSteps={tesbihatSteps} currentStep={currentStep} currentStepCount={currentStepCount} incTesbihatStep={incTesbihatStep} prevTesbihatStep={prevTesbihatStep} completeTesbihat={completeTesbihat} setState={setState} />}
        {state.selectedTab === "zikir" && <ZikirView zikrData={zikrData} selectedZikr={selectedZikr} selectedZikrCount={selectedZikrCount} target={state.zikrTarget} selectZikr={selectZikr} addZikr={addZikr} resetZikr={resetZikr} counts={state.zikrCounts || {}} />}
        {state.selectedTab === "profil" && <ProfileView state={state} prayerStreak={prayerStreak} prayerSeries={prayerSeries} logout={logout} />}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto grid max-w-[1400px] grid-cols-5 gap-1 p-2">
          {[
            ["home", Home, "Ana Sayfa"],
            ["sureler", BookOpen, "Sureler"],
            ["tesbihat", Layers3, "Tesbihat"],
            ["zikir", Sparkles, "Zikirmatic"],
            ["profil", User, "Profil"],
          ].map(([key, Icon, label]) => (
            <button key={key} onClick={() => setState((s) => ({ ...s, selectedTab: key }))} className={`flex flex-col items-center justify-center rounded-2xl py-2 text-xs font-semibold ${state.selectedTab === key ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function HomeView({ state, todayCount, prayerFinished, prayerStreak, prayerSeries, markPrayer, markDuaRead }) {
  const prayerCards = [
    { id: "sabah", tr: "Sabah", en: "Fajr" },
    { id: "ogle", tr: "Öğle", en: "Dhuhr" },
    { id: "ikindi", tr: "İkindi", en: "Asr" },
    { id: "aksam", tr: "Akşam", en: "Maghrib" },
    { id: "yatsi", tr: "Yatsı", en: "Isha" },
  ];
  const isToday = state.dailyLogs?.date === todayKey();
  const todayZikrs = isToday && state.dailyLogs?.zikrs?.length ? state.dailyLogs.zikrs.join(" • ") : "Henüz kayıt yok";
  const todayDuas = isToday && state.dailyLogs?.duas?.length ? state.dailyLogs.duas.join(" • ") : "Henüz kayıt yok";

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <section className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-emerald-950">Bugünün Özeti</h3>
              <p className="text-sm text-slate-600">Bugün okudukların ve hedeflerin burada.</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">Streak {prayerStreak}</div>
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-emerald-600" style={{ width: `${(todayCount / 5) * 100}%` }} />
          </div>
          <div className="mt-3 text-sm text-slate-600">Bugün {todayCount}/5 namaz kılındı</div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-700">
              <div className="font-semibold text-emerald-800">Bugünkü zikirler</div>
              <div className="mt-1">{todayZikrs}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-700">
              <div className="font-semibold text-emerald-800">Bugünkü dualar</div>
              <div className="mt-1">{todayDuas}</div>
              <button onClick={() => markDuaRead(state.selectedDua)} className="mt-2 rounded-xl bg-emerald-700 px-3 py-1.5 text-[11px] font-semibold text-white">Bu duayı okudum</button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-emerald-950">Vakit Namazları</h3>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Bugün {todayCount}/5</div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {prayerCards.map((p) => {
              const done = state.prayerDone[p.id];
              return (
                <button key={p.id} onClick={() => markPrayer(p.id)} className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{p.tr}</div>
                      <div className="text-xs text-slate-500">{p.en}</div>
                    </div>
                    <CheckCircle2 className={`h-5 w-5 ${done ? "text-emerald-700" : "text-slate-300"}`} />
                  </div>
                  <div className="mt-3 text-sm text-slate-600">{done ? "Kılındı" : "Kılınmadı"}</div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-emerald-950">Bu Gün Ne Yapayım?</h3>
            <div className={`rounded-full px-3 py-1 text-xs font-semibold ${prayerFinished ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>{prayerFinished ? "Tamamlandı" : `Eksik ${5 - todayCount}`}</div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <QuickAction label="İhlâs Suresi oku" desc="Okuma ekranına git" onClick={() => setState((s) => ({ ...s, selectedTab: "sureler", selectedSurah: "ihlas" }))} />
            <QuickAction label="Ayetel Kürsi oku" desc="Okuma ekranına git" onClick={() => setState((s) => ({ ...s, selectedTab: "sureler", selectedSurah: "ayetelkursi" }))} />
            <QuickAction label="Ettehiyyâtü oku" desc="Dua ekranına git" onClick={() => setState((s) => ({ ...s, selectedTab: "sureler", selectedDua: "ettehiyyat" }))} />
            <QuickAction label="Zikir çek" desc="Zikirmatic'e git" onClick={() => setState((s) => ({ ...s, selectedTab: "zikir" }))} />
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <section className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-950">Son 7 Gün Namaz Grafiği</h3>
          <p className="text-sm text-slate-500">Tarih ve kılınan namaz sayısı.</p>
          <div className="mt-4 space-y-3">
            {prayerSeries.map((d) => {
              const max = 5;
              return (
                <div key={d.date} className="grid grid-cols-[68px_1fr_28px] items-center gap-3">
                  <div className="text-xs text-slate-500">{d.date.slice(5)}</div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${(d.count / max) * 100}%` }} /></div>
                  <div className="text-right text-xs font-semibold text-slate-700">{d.count}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-950">İpucu</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">Bu bölüm artık gerçek verilere bağlı. Namaz işaretleyince streak ve grafik güncellenir; zikir ve dua kayıtları da ana sayfada görünür.</p>
        </section>
      </aside>
    </div>
  );
}

function QuickAction({ label, desc, onClick }) {
  return (
    <button onClick={onClick} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-white active:scale-[0.99] transition">
      <div className="text-sm font-bold text-slate-900">{label}</div>
      <div className="mt-1 text-xs text-slate-500">{desc}</div>
    </button>
  );
}

function SurahView({ selectedSurah, selectedDua, filteredSurahs, search, setSearch, sort, setSort, progress, statuses, setSelectedSurah, setSelectedDua, setSurahStatus, addSurahRead }) {
  const activeStatus = statuses[selectedSurah.id] || "not_started";
  const statusMeta = {
    memorized: ["Hafızada", "bg-emerald-100 text-emerald-800"],
    in_progress: ["Devam ediyor", "bg-amber-100 text-amber-800"],
    not_started: ["Sıfırlandı", "bg-slate-100 text-slate-600"],
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-emerald-950">Sureyi Oku</h3>
            <p className="text-sm text-slate-600">Okuma paneli üstte, seçim listesi altta.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2 text-sm">
              <Search className="h-4 w-4" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara" className="min-w-0 bg-transparent outline-none" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border bg-white px-3 py-2 text-sm outline-none">
              <option value="usage">Kullanım sıklığı</option>
              <option value="length">Uzunluk</option>
              <option value="alphabetical">Alfabetik</option>
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-[2rem] border border-slate-100 bg-slate-50 p-3 sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-3 text-right sm:p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">Arapça</div>
              <div className="mt-2 text-[11px] leading-6 text-slate-700 sm:text-[12px]" dir="rtl" style={{ lineHeight: 2.05 }}>{selectedSurah.arabic}</div>
            </div>
            <div className="space-y-3 rounded-3xl bg-emerald-50 p-3 sm:p-4">
              <div className="rounded-2xl bg-white p-3 sm:p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">Türkçe okunuş</div>
                <div className="mt-2 text-sm leading-7 text-slate-800 sm:text-base sm:leading-8">{selectedSurah.translit}</div>
              </div>
              <div className="rounded-2xl bg-white p-3 sm:p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">Türkçe meal</div>
                <div className="mt-2 text-sm leading-7 text-slate-800 sm:text-base sm:leading-8">{selectedSurah.meaning}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">Durum</div>
                <div className="mt-1 text-xs text-slate-700 sm:text-sm">Hafızada / devam ediyor / sıfırlandı</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusMeta[activeStatus][1]}`}>{statusMeta[activeStatus][0]}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setSurahStatus(selectedSurah.id, "memorized")} className="rounded-2xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white sm:px-4 sm:text-sm">Hafızada</button>
              <button onClick={() => setSurahStatus(selectedSurah.id, "in_progress")} className="rounded-2xl border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">Devam ediyor</button>
              <button onClick={() => setSurahStatus(selectedSurah.id, "not_started")} className="rounded-2xl border px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">Sıfırla</button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => addSurahRead(selectedSurah.id)} className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">+1 okuma</button>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold">{selectedSurah.id} · {progress[selectedSurah.id] || 0} kayıt</div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <h4 className="text-lg font-bold text-emerald-950">Suralar Seçim Listesi</h4>
        <p className="text-sm text-slate-500">Aşağıdan seç, üstteki okuma alanı değişsin.</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filteredSurahs.map((s) => {
            const count = progress[s.id] || 0;
            const st = statuses[s.id] || (count >= 33 ? "memorized" : count > 0 ? "in_progress" : "not_started");
            return (
              <button key={s.id} onClick={() => setSelectedSurah(s.id)} className={`rounded-3xl border p-3 text-left transition sm:p-4 ${selectedSurah.id === s.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-white"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900 sm:text-base">{s.name}</div>
                    <div className="text-[11px] text-slate-500 sm:text-xs">{s.arabicTitle} · {s.verses} ayet</div>
                  </div>
                  <StatusBadge status={st} />
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.min(100, (count / 33) * 100)}%` }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-500 sm:text-xs">Bu sure: {count} okuma</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <h4 className="text-lg font-bold text-emerald-950">Dualar</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {duaData.map((d) => (
            <button key={d.id} onClick={() => setSelectedDua(d.id)} className={`rounded-2xl border px-3 py-2 text-sm ${selectedDua.id === d.id ? "border-emerald-500 bg-emerald-50" : "bg-slate-50"}`}>
              {d.name}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 text-right text-[11px] leading-6 sm:p-4 sm:text-[12px]" dir="rtl" style={{ lineHeight: 2.05 }}>{selectedDua.arabic}</div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-emerald-50 p-3 sm:p-4"><div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">Okunuş</div><div className="mt-2 text-sm leading-7 text-slate-800 sm:text-base sm:leading-8">{selectedDua.translit}</div></div>
            <div className="rounded-2xl border bg-white p-3 sm:p-4"><div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">Anlam</div><div className="mt-2 text-sm leading-7 text-slate-800 sm:text-base sm:leading-8">{selectedDua.meaning}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TesbihatView{ state, tesbihatSteps, currentStep, currentStepCount, incTesbihatStep, prevTesbihatStep, completeTesbihat, setState }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <h3 className="text-xl font-bold text-emerald-950">Tesbihat</h3>
        <p className="text-sm text-slate-600">Ayetel Kürsi adımında tam metin ve okunuş görünür.</p>
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1">
          <button onClick={() => setState((s) => ({ ...s, tesbihatType: "short", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${state.tesbihatType === "short" ? "bg-white shadow" : ""}`}>Kısa Tesbihat</button>
          <button onClick={() => setState((s) => ({ ...s, tesbihatType: "long", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${state.tesbihatType === "long" ? "bg-white shadow" : ""}`}>Uzun Tesbihat</button>
        </div>
        <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-900">İlerleme</div>
          <div className="mt-2 h-3 rounded-full bg-white"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${((state.tesbihatIndex + 1) / tesbihatSteps.length) * 100}%` }} /></div>
          <div className="mt-2 text-sm text-emerald-900">Adım {state.tesbihatIndex + 1} / {tesbihatSteps.length}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={prevTesbihatStep} className="flex items-center gap-2 rounded-2xl border px-4 py-2 font-semibold"><ChevronLeft className="h-4 w-4" /> Önceki</button>
          <button onClick={() => setState((s) => ({ ...s, tesbihatIndex: Math.min(tesbihatSteps.length - 1, s.tesbihatIndex + 1) }))} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-4 text-base font-semibold text-white md:w-auto md:text-lg"><ChevronRight className="h-5 w-5" /> Sonraki Adım</button>
        </div>
        <button onClick={completeTesbihat} className="mt-4 w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-100">Tesbihatı tamamlandı işaretle</button>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="rounded-3xl bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-800">{state.tesbihatType === "short" ? "Kısa" : "Uzun"} Tesbihat · Adım {state.tesbihatIndex + 1}</div>
          <div className="mt-2 text-2xl font-black text-emerald-950">{currentStep.label}</div>
          <div className="mt-2 text-sm text-slate-600">{currentStep.count > 1 ? `${currentStepCount} / ${currentStep.count}` : "Bu adım tek sefer okunur."}</div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Okunuş</div><div className="mt-2 text-base leading-8 text-slate-800">{currentStep.title}</div></div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Anlam</div><div className="mt-2 text-base leading-8 text-slate-800">{currentStep.meaning}</div></div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Tekrar</div><div className="mt-2 text-base leading-8 text-slate-800">{currentStep.count} kez</div></div>
        </div>
        {currentStep.key === "ayetelkursi" && (
          <div className="mt-4 rounded-3xl border border-emerald-100 bg-white p-4">
            <div className="text-sm font-semibold text-emerald-800">Ayetel Kürsi tam okunuş</div>
            <div className="mt-3 text-[14px] leading-8 text-slate-800">{surahData.find((s) => s.id === "ayetelkursi")?.translit}</div>
            <div className="mt-3 text-right text-[12px] leading-6 text-slate-600" dir="rtl">{surahData.find((s) => s.id === "ayetelkursi")?.arabic}</div>
          </div>
        )}
        {currentStep.count > 1 ? <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-center"><div className="text-4xl font-black text-emerald-700">{currentStepCount}/{currentStep.count}</div><div className="mt-2 text-sm text-slate-600">Her tekrar için +1 bas.</div><button onClick={incTesbihatStep} className="mt-4 w-full rounded-2xl bg-emerald-700 px-5 py-4 text-lg font-semibold text-white">+1</button></div> : <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Sonraki adıma geçmek için tek seferlik okuma yeterli.</div>}
      </div>
    </div>
  );
}

function ZikirView({ zikrData, selectedZikr, selectedZikrCount, target, selectZikr, addZikr, resetZikr, counts }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-emerald-950">Zikirmatik</h3>
            <p className="text-sm text-slate-600">Büyük buton, büyük sayı, sade deneyim.</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">Hedef {target}</div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center rounded-[2.5rem] bg-[radial-gradient(circle_at_top,_#eefaf2,_#dff3e6_60%,_#cfe9da)] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-900">Seçili Zikir</div>
          <div className="mt-2 text-center text-2xl font-black text-emerald-950">{selectedZikr.name}</div>
          <div className="mt-1 text-sm text-slate-700">{selectedZikr.translit}</div>

          <button onClick={addZikr} className="mt-6 flex h-72 w-72 items-center justify-center rounded-full border-8 border-white bg-emerald-700 text-white shadow-2xl shadow-emerald-200 transition active:scale-[0.98] sm:h-80 sm:w-80">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100">Dokun ve artır</div>
              <div className="mt-2 text-7xl font-black leading-none sm:text-8xl">{selectedZikrCount}</div>
              <div className="mt-2 text-lg font-semibold text-emerald-100">{selectedZikr.name}</div>
            </div>
          </button>

          <div className="mt-6 flex w-full max-w-md gap-2">
            <button onClick={resetZikr} className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-semibold text-slate-800">Sıfırla</button>
            <div className="flex-1 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700">Bu zikir: {selectedZikrCount} kez</div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-lg font-bold text-emerald-950">Zikir seç</h4>
        <p className="text-sm text-slate-500">Aşağıdan seç, üstteki büyük buton değişsin.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {zikrData.map((z) => (
            <button key={z.id} onClick={() => selectZikr(z.id, z.defaultTarget)} className={`rounded-3xl border p-4 text-left ${selectedZikr.id === z.id ? "border-emerald-500 bg-emerald-50" : "bg-slate-50"}`}>
              <div className="font-semibold text-slate-900">{z.name}</div>
              <div className="mt-1 text-right text-lg text-slate-800" dir="rtl">{z.arabic}</div>
              <div className="mt-1 text-sm text-slate-600">{z.translit}</div>
              <div className="mt-1 text-xs text-emerald-700">Bu zikir: {counts[z.id] || 0} kez</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileView({ state, prayerStreak, prayerSeries, logout }) {
  const max = Math.max(5, ...prayerSeries.map((b) => b.count));
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-800">FÇ</div>
          <div>
            <h3 className="text-lg font-bold text-emerald-950">{state.username}</h3>
            <p className="text-xs text-slate-500">Profil ve ilerleme</p>
          </div>
        </div>
        <div className="space-y-3">
          <ProfileLine label="Toplam XP" value={state.xp} />
          <ProfileLine label="Seviye" value={state.level} />
          <ProfileLine label="Günlük streak" value={state.dailyStreak} />
          <ProfileLine label="Namaz streak" value={prayerStreak} />
          <ProfileLine label="Gems" value={state.gems} />
          <ProfileLine label="Kaza namazı" value={state.missedPrayers} />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={logout} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white"><LogOut className="h-4 w-4" /> Çıkış yap</button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-lg font-bold text-emerald-950">Namaz Grafiği</h4>
          <p className="text-sm text-slate-500">Tarih ve kılınan namaz sayısı.</p>
          <div className="mt-4 space-y-3">
            {prayerSeries.map((b) => (
              <div key={b.date} className="grid grid-cols-[68px_1fr_28px] items-center gap-3">
                <div className="text-xs text-slate-500">{b.date.slice(5)}</div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${(b.count / max) * 100}%` }} /></div>
                <div className="text-right text-xs font-semibold text-slate-700">{b.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-lg font-bold text-emerald-950">Bugünkü kayıtlar</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <ProfileLine label="Bugünkü zikir" value={(state.dailyLogs?.date === todayKey() && state.dailyLogs?.zikrs?.length) || 0} />
            <ProfileLine label="Bugünkü dua" value={(state.dailyLogs?.date === todayKey() && state.dailyLogs?.duas?.length) || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="h-3 w-3" /> {label}</div>
      <div className="mt-1 font-bold text-slate-900">{value}</div>
    </div>
  );
}

function ProfileLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    memorized: ["Hafızada", "bg-emerald-100 text-emerald-800"],
    in_progress: ["Devam ediyor", "bg-amber-100 text-amber-800"],
    not_started: ["Sıfırlandı", "bg-slate-100 text-slate-600"],
  };
  const [label, style] = map[status] || map.not_started;
  return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${style}`}>{label}</span>;
}

function MiniSpacer() {
  return <div className="h-px w-full bg-slate-100" />;
}

function ProfileHeader({ children }) {
  return <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">{children}</div>;
}

export default App;
