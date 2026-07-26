import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Crown,
  Gem,
  Home,
  Layers3,
  LogIn,
  LogOut,
  RotateCcw,
  Search,
  Sparkles,
  User,
  Zap,
  AlertTriangle,
} from "lucide-react";

const STORAGE_KEY = "ilim-yolu-v4-furkan";

const surahData = [
  {
    id: "fatiha",
    name: "Fâtiha Suresi",
    shortName: "Fâtiha",
    verses: 7,
    arabicTitle: "الفاتحة",
    arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\nالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nالرَّحْمٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
    translit: `Bismillâhirrahmânirrahîm. Elhamdülillâhi rabbil âlemîn. Errahmânirrahîm. Mâliki yevmiddîn. İyyâke na'budu ve iyyâke neste'în. İhdinessırâtel mustakîm. Sırâtellezîne en'amte aleyhim gayril mağdûbi aleyhim ve leddâllîn.`,
    meaning: `Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi Allah’a mahsustur. O, Rahmân’dır, Rahîm’dir. Din gününün sahibidir. Ancak Sana ibadet eder ve ancak Senden yardım dileriz. Bizi dosdoğru yola ilet. Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil.`,
  },
  {
    id: "fil",
    name: "Fil Suresi",
    shortName: "Fil",
    verses: 5,
    arabicTitle: "الفيل",
    arabic: `أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ\nأَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ\nوَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ\nتَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ\nفَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ`,
    translit: `Elem tera keyfe feale rabbüke bi ashâbil fîl. Elem yec'al keydehum fî tedlîl. Ve ersale aleyhim tayran ebâbîl. Termîhim bi hicâratin min siccîl. Fe cealehum ke'asfin me'kûl.`,
    meaning: `Rabbinin fil sahiplerine nasıl davrandığını görmedin mi? Onların tuzaklarını boşa çıkarmadı mı? Üzerlerine sürü sürü kuşlar gönderdi. Onları pişmiş çamurdan taşlarla vuruyorlardı. Böylece onları yenilmiş ekin yaprağı gibi kıldı.`,
  },
  {
    id: "kureys",
    name: "Kureyş Suresi",
    shortName: "Kureyş",
    verses: 4,
    arabicTitle: "قريش",
    arabic: `لِإِيلَافِ قُرَيْشٍ\nإِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ\nفَلْيَعْبُدُوا رَبَّ هٰذَا الْبَيْتِ\nالَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ`,
    translit: `Li îlâfi kureyş. Îlâfihim rihleteş-şitâi ve's-sayf. Felya'budû rabbe hâzel beyt. Ellezî et'amahum min cû'in ve âmenehum min havf.`,
    meaning: `Kureyş’in yaz ve kış yolculuklarına alışması sebebiyle. Öyleyse onlar bu evin Rabbine kulluk etsinler. O Rab ki onları açlıktan doyurdu ve korkudan emin kıldı.`,
  },
  {
    id: "maun",
    name: "Maûn Suresi",
    shortName: "Maûn",
    verses: 7,
    arabicTitle: "الماعون",
    arabic: `أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ\nفَذٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ\nوَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ\nفَوَيْلٌ لِلْمُصَلِّينَ\nالَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ\nالَّذِينَ هُمْ يُرَاءُونَ\nوَيَمْنَعُونَ الْمَاعُونَ`,
    translit: `Eraeytellezî yukezzibu bid-dîn. Fe zâlikellezî yedu'ul yetîm. Ve lâ yahuddu alâ ta'âmil miskîn. Fe veylün lil musallîn. Ellezîne hum an salâtihim sâhûn. Ellezîne hum yürâûn. Ve yemna'ûnel mâûn.`,
    meaning: `Dini yalan sayanı gördün mü? İşte o, yetimi itip kakan; yoksulu doyurmaya teşvik etmeyen kişidir. Yazıklar olsun o namaz kılanlara ki onlar namazlarını ciddiye almazlar; gösteriş yaparlar; ufak yardımı bile esirgerler.`,
  },
  {
    id: "kevser",
    name: "Kevser Suresi",
    shortName: "Kevser",
    verses: 3,
    arabicTitle: "الكوثر",
    arabic: `إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ\nفَصَلِّ لِرَبِّكَ وَانْحَرْ\nإِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ`,
    translit: `İnnâ a'taynâke'l-kevser. Fe salli lirabbike venhar. İnne şâni'eke huve'l-ebter.`,
    meaning: `Biz sana Kevser’i verdik. O hâlde Rabbin için namaz kıl ve kurban kes. Asıl sonu kesik olan, sana kin tutandır.`,
  },
  {
    id: "ihlas",
    name: "İhlâs Suresi",
    shortName: "İhlâs",
    verses: 4,
    arabicTitle: "الإخلاص",
    arabic: `قُلْ هُوَ اللّٰهُ أَحَدٌ\nاللّٰهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ`,
    translit: `Kul hüvallâhu ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû kufuven ehad.`,
    meaning: `De ki: O Allah birdir. Allah sameddir. O doğurmamış ve doğmamıştır. Hiçbir şey O’na denk değildir.`,
  },
  {
    id: "felak",
    name: "Felak Suresi",
    shortName: "Felak",
    verses: 5,
    arabicTitle: "الفلق",
    arabic: `قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nمِن شَرِّ مَا خَلَقَ\nوَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ\nوَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ\nوَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
    translit: `Kul eûzü birabbil felak. Min şerri mâ halak. Ve min şerri gâsıkin izâ vekab. Ve min şerrin neffâsâti fil ukad. Ve min şerri hâsidin izâ hased.`,
    meaning: `De ki: Yarattığı şeylerin şerrinden, karanlığı çöktüğünde gecenin şerrinden, düğümlere üfleyenlerin şerrinden ve haset edenin şerrinden sabahın Rabbine sığınırım.`,
  },
  {
    id: "nas",
    name: "Nâs Suresi",
    shortName: "Nâs",
    verses: 6,
    arabicTitle: "الناس",
    arabic: `قُلْ أَعُوذُ بِرَبِّ النَّاسِ\nمَلِكِ النَّاسِ\nإِلٰهِ النَّاسِ\nمِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\nالَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\nمِنَ الْجِنَّةِ وَالنَّاسِ`,
    translit: `Kul eûzü birabbin nâs. Melikin nâs. İlâhin nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin nâs. Minel cinneti vennâs.`,
    meaning: `De ki: İnsanların Rabbine, insanların Melikine, insanların ilâhına sığınırım. Sinsice vesvese veren şeytanın şerrinden; insanların göğüslerine vesvese veren; cinlerden ve insanlardan olan vesvesecinin şerrinden.`,
  },
  {
    id: "ayetelkursi",
    name: "Ayetel Kürsi",
    shortName: "Ayetel Kürsi",
    verses: 1,
    arabicTitle: "آية الكرسي",
    arabic: `اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ\nلَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ\nلَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ\nمَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ\nيَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ\nوَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ\nوَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ\nوَلَا يَئُودُهُ حِفْظُهُمَا\nوَهُوَ الْعَلِيُّ الْعَظِيمُ`,
    translit: `Allâhu lâ ilâhe illâ hüve'l-hayyü'l-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fil ard. Menzellezî yeşfeu indehû illâ bi iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehum. Ve lâ yuhîtûne bi şey'in min ilmihî illâ bimâ şâe. Vesi'a kürsiyyühüs-semâvâti vel ard. Ve lâ yeûdühû hıfzuhumâ. Ve huvel aliyyül azîm.`,
    meaning: `Allah; O’ndan başka ilâh yoktur, diridir, kayyumdur. Onu ne uyuklama tutar ne uyku. Göklerde ve yerde ne varsa O’nundur. İzni olmadan O’nun katında kim şefaat edebilir? Önlerindekini ve arkalarındakini bilir. O’nun ilminden, dilediği kadarından başka hiçbir şeyi kuşatamazlar. Kürsüsü gökleri ve yeri kaplamıştır. Onları koruyup gözetmek O’na ağır gelmez. O yücedir, büyüktür.`,
  },
];

const zikrData = [
  { id: "subhanallah", name: "Sübhanallah", arabic: "سُبْحَانَ اللّٰهِ", translit: "Sübhanallah", meaning: "Allah’ı bütün eksikliklerden tenzih ederim.", target: 33 },
  { id: "elhamdulillah", name: "Elhamdülillah", arabic: "الْحَمْدُ لِلّٰهِ", translit: "Elhamdülillah", meaning: "Hamd Allah’a mahsustur.", target: 33 },
  { id: "allahu_ekber", name: "Allahu Ekber", arabic: "اللّٰهُ أَكْبَرُ", translit: "Allahu Ekber", meaning: "Allah en büyüktür.", target: 33 },
  { id: "la_ilaha", name: "Lâ ilâhe illallâh", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", translit: "Lâ ilâhe illallâh", meaning: "Allah’tan başka ilah yoktur.", target: 33 },
  { id: "estagfirullah", name: "Estağfirullah", arabic: "أَسْتَغْفِرُ اللّٰهَ", translit: "Estağfirullah", meaning: "Allah’tan bağışlanma dilerim.", target: 33 },
  { id: "salavat", name: "Salavat-ı Şerif", arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", translit: "Allâhümme salli alâ Muhammed", meaning: "Allah’ım Muhammed’e salât eyle.", target: 33 },
];

const DEFAULT_STATE = {
  auth: false,
  username: "furkancittir",
  xp: 1250,
  gems: 30,
  level: 3,
  dailyStreak: 7,
  prayerStreak: 5,
  missedPrayers: 10,
  surahProgress: { fatiha: 1 },
  selectedTab: "home",
  selectedSurah: "fatiha",
  prayerDone: { sabah: false, ogle: false, ikindi: false, aksam: false, yatsi: false },
  zikrSelected: "subhanallah",
  zikrCounts: { subhanallah: 0 },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function App() {
  const [state, setState] = useState(loadState);
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const todayCount = Object.values(state.prayerDone).filter(Boolean).length;
  const selectedSurah = surahData.find((s) => s.id === state.selectedSurah) || surahData[0];
  const selectedZikr = zikrData.find((z) => z.id === state.zikrSelected) || zikrData[0];

  const filteredSurahs = useMemo(() => {
    if (!search.trim()) return surahData;
    const q = search.toLowerCase();
    return surahData.filter((s) => s.name.toLowerCase().includes(q) || s.translit.toLowerCase().includes(q));
  }, [search]);

  function handleLogin(e) {
    e.preventDefault();
    if (inputUser.trim() === "furkancittir" && inputPass === "1234") {
      setState((s) => ({ ...s, auth: true, selectedTab: "home" }));
      setLoginError("");
    } else {
      setLoginError("Hatalı kullanıcı adı veya şifre!");
    }
  }

  function handleLogout() {
    setState((s) => ({ ...s, auth: false }));
  }

  function markPrayer(id) {
    setState((s) => ({
      ...s,
      prayerDone: { ...s.prayerDone, [id]: !s.prayerDone[id] },
    }));
  }

  function addSurahRead(id) {
    setState((s) => ({
      ...s,
      surahProgress: { ...s.surahProgress, [id]: (s.surahProgress[id] || 0) + 1 },
      xp: s.xp + 5,
    }));
  }

  function selectZikr(id) {
    setState((s) => ({
      ...s,
      zikrSelected: id,
      zikrCounts: { ...s.zikrCounts, [id]: s.zikrCounts?.[id] || 0 },
    }));
  }

  function addZikr() {
    setState((s) => {
      const current = s.zikrCounts?.[s.zikrSelected] || 0;
      return {
        ...s,
        zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: current + 1 },
        xp: s.xp + 1,
      };
    });
  }

  function resetZikr() {
    setState((s) => ({
      ...s,
      zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: 0 },
    }));
  }

  const nav = [
    ["home", Home, "Ana Sayfa"],
    ["sureler", BookOpen, "Sureler"],
    ["zikir", Sparkles, "Zikirmatik"],
    ["profil", User, "Profil"],
  ];

  if (!state.auth) {
    return (
      <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center p-4 text-slate-800">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs text-emerald-700 font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" /> İlim Yolu
          </div>
          <h1 className="text-2xl font-bold text-emerald-950">Giriş Yap</h1>
          <p className="text-xs text-slate-500 mt-1 mb-5">Lütfen kişisel erişim bilgilerinizi girin.</p>

          {loginError && <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">{loginError}</div>}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                value={inputUser}
                onChange={(e) => setInputUser(e.target.value)}
                placeholder="furkancittir"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Şifre</label>
              <input
                type="password"
                value={inputPass}
                onChange={(e) => setInputPass(e.target.value)}
                placeholder="••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
            <button type="submit" className="w-full rounded-2xl bg-emerald-700 py-3 text-sm font-medium text-white hover:bg-emerald-800 transition mt-2">
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] text-slate-800">
      <div className="mx-auto max-w-4xl p-4 pb-24">
        {state.selectedTab === "home" && <HomeView state={state} markPrayer={markPrayer} todayCount={todayCount} />}
        {state.selectedTab === "sureler" && (
          <SurahView
            selectedSurah={selectedSurah}
            filteredSurahs={filteredSurahs}
            search={search}
            setSearch={setSearch}
            progress={state.surahProgress}
            setSelectedSurah={(id) => setState((s) => ({ ...s, selectedSurah: id }))}
            addSurahRead={addSurahRead}
          />
        )}
        {state.selectedTab === "zikir" && (
          <ZikirView
            zikrData={zikrData}
            selectedZikr={selectedZikr}
            selectedZikrCount={state.zikrCounts?.[state.zikrSelected] || 0}
            selectZikr={selectZikr}
            addZikr={addZikr}
            resetZikr={resetZikr}
            counts={state.zikrCounts || {}}
          />
        )}
        {state.selectedTab === "profil" && <ProfileView state={state} logout={handleLogout} />}
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur z-50">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 p-2">
          {nav.map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setState((s) => ({ ...s, selectedTab: key }))}
              className={`flex flex-col items-center justify-center rounded-2xl py-2 text-xs font-medium transition ${
                state.selectedTab === key ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" /> {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function HomeView({ state, markPrayer, todayCount }) {
  const prayerCards = [
    { id: "sabah", tr: "Sabah" },
    { id: "ogle", tr: "Öğle" },
    { id: "ikindi", tr: "İkindi" },
    { id: "aksam", tr: "Akşam" },
    { id: "yatsi", tr: "Yatsı" },
  ];

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-0.5">Kişisel Rehber</div>
            <h2 className="text-2xl font-bold text-emerald-950">Selam, Furkan Çittir</h2>
            <p className="text-xs text-slate-500 mt-0.5">Bugün {todayCount}/5 Namaz kılındı</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
          <MiniStat label="XP" value={state.xp} icon={Zap} />
          <MiniStat label="Seviye" value={state.level} icon={Crown} />
          <MiniStat label="Gems" value={state.gems} icon={Gem} />
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-emerald-950 mb-3">Vakit Namazları</h3>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {prayerCards.map((p) => {
            const done = state.prayerDone[p.id];
            return (
              <button
                key={p.id}
                onClick={() => markPrayer(p.id)}
                className={`rounded-2xl border py-3 px-1 text-center transition ${
                  done ? "border-emerald-200 bg-emerald-50/70" : "border-slate-100 bg-slate-50/60"
                }`}
              >
                <div className="font-semibold text-slate-800 text-xs sm:text-sm">{p.tr}</div>
                <CheckCircle2 className={`h-4 w-4 mx-auto mt-1.5 ${done ? "text-emerald-700" : "text-slate-300"}`} />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SurahView({ selectedSurah, filteredSurahs, search, setSearch, progress, setSelectedSurah, addSurahRead }) {
  return (
    <div className="space-y-4">
      {/* Okuma Alanı (En Üstte) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-emerald-950">{selectedSurah.name}</h3>
            <p className="text-xs text-slate-500">{selectedSurah.arabicTitle} · {selectedSurah.verses} Ayet</p>
          </div>
          <button onClick={() => addSurahRead(selectedSurah.id)} className="rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-800 transition">
            +1 Okundu ({progress[selectedSurah.id] || 0})
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-right overflow-x-auto">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Arapça Metin</div>
            <div className="text-lg leading-loose text-slate-800 font-serif" dir="rtl">{selectedSurah.arabic}</div>
          </div>

          <div className="rounded-2xl bg-emerald-50/40 border border-emerald-100/60 p-3.5 space-y-2.5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 mb-0.5">Türkçe Okunuş</div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{selectedSurah.translit}</p>
            </div>
            <div className="pt-2 border-t border-emerald-100/60">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 mb-0.5">Anlamı</div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{selectedSurah.meaning}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sure Seçim Listesi (En Altta) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-bold text-emerald-950">Sure Seç</h4>
          <div className="flex items-center gap-2 rounded-xl border bg-slate-50 px-2.5 py-1 text-xs w-36 sm:w-48">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Sure ara..." className="bg-transparent outline-none w-full text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredSurahs.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSurah(s.id)}
              className={`rounded-2xl border p-2.5 text-left transition ${
                selectedSurah.id === s.id ? "border-emerald-500 bg-emerald-50/70" : "border-slate-100 bg-slate-50/50 hover:bg-white"
              }`}
            >
              <div className="font-semibold text-xs text-slate-800 truncate">{s.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{s.verses} Ayet</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ZikirView({ zikrData, selectedZikr, selectedZikrCount, selectZikr, addZikr, resetZikr, counts }) {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Gerçek Dijital Zikirmatik Arayüzü */}
      <div className="rounded-3xl border border-emerald-800/20 bg-gradient-to-b from-emerald-900 to-emerald-950 p-6 text-white shadow-xl text-center relative overflow-hidden">
        <div className="text-xs text-emerald-300/80 font-medium tracking-widest uppercase mb-1">{selectedZikr.name}</div>
        <div className="text-sm text-emerald-100 font-serif mb-4" dir="rtl">{selectedZikr.arabic}</div>

        {/* Sayaç Ekranı */}
        <div className="my-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 p-4 shadow-inner">
          <div className="text-6xl font-mono font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            {String(selectedZikrCount).padStart(4, "0")}
          </div>
          <div className="text-[10px] text-emerald-500 mt-1 uppercase tracking-wider">Hedef: {selectedZikr.target}</div>
        </div>

        {/* Zikirmatik Buton Paneli */}
        <div className="mt-8 mb-2 flex items-center justify-center gap-6">
          {/* Küçük Sıfırlama Butonu */}
          <button
            onClick={resetZikr}
            className="h-12 w-12 rounded-full bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-emerald-200 active:scale-90 hover:bg-emerald-800 transition shadow"
            title="Sıfırla"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Dev Yuvarlak Zikir Butonu */}
          <button
            onClick={addZikr}
            className="h-28 w-28 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 border-4 border-emerald-300/40 flex items-center justify-center text-emerald-950 font-bold text-lg shadow-2xl active:scale-95 transition-transform cursor-pointer select-none"
          >
            BAS
          </button>
        </div>
      </div>

      {/* Zikir Seçim Listesi */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Zikir Değiştir</h4>
        <div className="grid grid-cols-2 gap-2">
          {zikrData.map((z) => (
            <button
              key={z.id}
              onClick={() => selectZikr(z.id)}
              className={`rounded-2xl border p-2.5 text-left transition ${
                selectedZikr.id === z.id ? "border-emerald-500 bg-emerald-50/70" : "border-slate-100 bg-slate-50/50 hover:bg-white"
              }`}
            >
              <div className="font-semibold text-xs text-slate-800">{z.name}</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Çekilen: {counts[z.id] || 0}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileView({ state, logout }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm max-w-md mx-auto space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
          FÇ
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-950">Furkan Çittir</h3>
          <p className="text-xs text-slate-500">Kişisel İbadet Profili</p>
        </div>
      </div>

      <div className="space-y-2">
        <ProfileLine label="Toplam XP" value={state.xp} />
        <ProfileLine label="Mevcut Seviye" value={state.level} />
        <ProfileLine label="Günlük Seri" value={`${state.dailyStreak} Gün`} />
        <ProfileLine label="Kaza Namazı Takibi" value={`${state.missedPrayers} Vakit`} />
      </div>

      <button onClick={logout} className="mt-4 flex items-center justify-center gap-2 w-full rounded-2xl bg-slate-900 py-3 text-xs font-medium text-white hover:bg-slate-800 transition">
        <LogOut className="h-4 w-4" /> Oturumu Kapat
      </button>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-2 text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
        <Icon className="h-3 w-3 text-emerald-700" /> {label}
      </div>
      <div className="mt-0.5 text-xs font-bold text-slate-800">{value}</div>
    </div>
  );
}

function ProfileLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 text-xs">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export default App;
