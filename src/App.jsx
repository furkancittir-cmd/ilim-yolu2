import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Eye,
  EyeOff,
  Gem,
  Gamepad2,
  Home,
  Layers,
  LogOut,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trophy,
  User,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "ilim-yolu-v13";
const todayKey = () => new Date().toISOString().slice(0, 10);
const emptyPrayer = () => ({ sabah: false, ogle: false, ikindi: false, aksam: false, yatsi: false });

// Bursa Namaz Vakitlerini Ücretsiz Aladhan API Üzerinden Canlı Çeken Fonksiyon
async function fetchBursaPrayerTimes() {
  try {
    const res = await fetch(
      "https://api.aladhan.com/v1/timings?latitude=40.1885&longitude=29.0610&method=13"
    );
    const data = await res.json();
    if (data && data.data && data.data.timings) {
      const t = data.data.timings;
      return {
        imsak: t.Fajr,
        gunes: t.Sunrise,
        ogle: t.Dhuhr,
        ikindi: t.Asr,
        aksam: t.Maghrib,
        yatsi: t.Isha,
      };
    }
  } catch (error) {
    console.error("Vakitler çekilemedi, yedek saatler kullanılıyor:", error);
  }
  return {
    imsak: "04:32",
    gunes: "06:05",
    ogle: "13:12",
    ikindi: "16:58",
    aksam: "20:10",
    yatsi: "21:38",
  };
}

// Otomatik Dark Mode Kontrolü
function isNightTime(aksamStr = "20:10", imsakStr = "04:32") {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [aH, aM] = aksamStr.split(":").map(Number);
  const [iH, iM] = imsakStr.split(":").map(Number);
  const aksamMinutes = aH * 60 + aM;
  const imsakMinutes = iH * 60 + iM;
  return currentMinutes >= aksamMinutes || currentMinutes < imsakMinutes;
}

// Dokunsal Geri Bildirim (Titreşim)
function triggerHaptic() {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(45);
  }
}

const USERS = [
  { username: "furkancittir", pass: "1234" },
  { username: "ilham", pass: "nasser" },
];

const AYETEL_KURSI_MEALI = "Allah ki, O'ndan başka ilah yoktur. O hayydır, kayyûmdur. Kendisine ne bir uyuklama gelir ne de bir uyku. Göklerde ve yerdekilerin hepsi O'nundur. O'nun izni olmadan katında kim şefaat edebilir? Onların önlerindekini de arkalarındakini de bilir. Onlar ise O'nun dilediği kadarından başka ilminden hiçbir şeyi kavrayamazlar. O'nun kürsüsü gökleri ve yeri kaplamıştır. Onları koruyup gözetmek O'na ağır gelmez. O çok yücedir, çok büyüktür.";

const surahData = [
  {
    id: "fatiha",
    name: "Fâtiha Suresi",
    arabicTitle: "الفاتحة",
    verses: 7,
    usage: 10,
    status: "memorized",
    arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ
الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ
الرَّحْمٰنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
    translit: `Bismillâhirrahmânirrahîm. Elhamdülillâhi rabbil âlemîn. Errahmânirrahîm. Mâliki yevmiddîn. İyyâke na'budu ve iyyâke neste'în. İhdinessırâtel mustakîm. Sırâtellezîne en'amte aleyhim gayril mağdûbi aleyhim ve leddâllîn.`,
    meaning: `Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi Allah’a mahsustur. O, Rahmân’dır, Rahîm’dir. Din gününün sahibidir. Ancak Sana ibadet eder ve ancak Senden yardım dileriz. Bizi dosdoğru yola ilet. Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil.`,
  },
  {
    id: "fil",
    name: "Fil Suresi",
    arabicTitle: "الفيل",
    verses: 5,
    usage: 8,
    status: "in_progress",
    arabic: `أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ
أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ
وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ
تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ
فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ`,
    translit: `Elem tera keyfe feale rabbüke bi ashâbil fîl. Elem yec'al keydehum fî tedlîl. Ve ersale aleyhim tayran ebâbîl. Termîhim bi hicâratin min siccîl. Fe cealehum ke'asfin me'kûl.`,
    meaning: `Rabbinin fil sahiplerine nasıl davrandığını görmedin mi? Onların tuzaklarını boşa çıkarmadı mı? Üzerlerine sürü sürü kuşlar gönderdi. Onları pişmiş çamurdan taşlarla vuruyorlardı. Böylece onları yenilmiş ekin yaprağı gibi kıldı.`,
  },
  {
    id: "kureys",
    name: "Kureyş Suresi",
    arabicTitle: "قريش",
    verses: 4,
    usage: 8,
    status: "memorized",
    arabic: `لِإِيلَافِ قُرَيْشٍ
إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ
فَلْيَعْبُدُوا رَبَّ هٰذَا الْبَيْتِ
الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ`,
    translit: `Li îlâfi kureyş. Îlâfihim rihleteş-şitâi ve's-sayf. Felya'budû rabbe hâzel beyt. Ellezî et'amahum min cû'in ve âmenehum min havf.`,
    meaning: `Kureyş’in yaz ve kış yolculuklarına alışması sebebiyle. Öyleyse onlar bu evin Rabbine kulluk etsinler. O Rab ki onları açlıktan doyurdu ve korkudan emin kıldı.`,
  },
  {
    id: "maun",
    name: "Maûn Suresi",
    arabicTitle: "الماعون",
    verses: 7,
    usage: 7,
    status: "not_started",
    arabic: `أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ
فَذٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ
وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ
فَوَيْلٌ لِلْمُصَلِّينَ
الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ
الَّذِينَ هُمْ يُرَاءُونَ
وَيَمْنَعُونَ الْمَاعُونَ`,
    translit: `Eraeytellezî yukezzibu bid-dîn. Fe zâlikellezî yedu'ul yetîm. Ve lâ yahuddu alâ ta'âmil miskîn. Fe veylün lil musallîn. Ellezîne hum an salâtihim sâhûn. Ellezîne hum yürâûn. Ve yemna'ûnel mâûn.`,
    meaning: `Dini yalan sayanı gördün mü? İşte o, yetimi itip kakan; yoksulu doyurmaya teşvik etmeyen kişidir. Yazıklar olsun o namaz kılanlara ki onlar namazlarını ciddiye almazlar; gösteriş yaparlar; ufak yardımı bile esirgerler.`,
  },
  {
    id: "kevser",
    name: "Kevser Suresi",
    arabicTitle: "الكوثر",
    verses: 3,
    usage: 9,
    status: "memorized",
    arabic: `إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ
فَصَلِّ لِرَبِّكَ وَانْحَرْ
إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ`,
    translit: `İnnâ a'taynâke'l-kevser. Fe salli lirabbike venhar. İnne şâni'eke huve'l-ebter.`,
    meaning: `Biz sana Kevser’i verdik. O hâlde Rabbin için namaz kıl ve kurban kes. Asıl sonu kesik olan, sana kin tutandır.`,
  },
  {
    id: "kafirun",
    name: "Kâfirûn Suresi",
    arabicTitle: "الكافرون",
    verses: 6,
    usage: 8,
    status: "in_progress",
    arabic: `قُلْ يَا أَيُّهَا الْكَافِرُونَ
لَا أَعْبُدُ مَا تَعْبُدُونَ
وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ
وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ
وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ
لَكُمْ دِينُكُمْ وَلِيَ دِينِ`,
    translit: `Kul yâ eyyühel kâfirûn. Lâ a'budu mâ ta'budûn. Ve lâ entüm âbidûne mâ a'bud. Ve lâ ene âbidun mâ abedtüm. Ve lâ entüm âbidûne mâ a'bud. Leküm dînüküm ve liye dîn.`,
    meaning: `De ki: Ey kâfirler! Sizin taptığınıza ben tapmam. Siz de benim tapacağıma tapmazsınız. Ben sizin taptığınıza tapacak değilim. Siz de benim tapacağıma tapacak değilsiniz. Sizin dininiz size, benim dinim bana.`,
  },
  {
    id: "nasr",
    name: "Nasr Suresi",
    arabicTitle: "النصر",
    verses: 3,
    usage: 8,
    status: "memorized",
    arabic: `إِذَا جَاءَ نَصْرُ اللّٰهِ وَالْفَتْحُ
وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللّٰهِ أَفْوَاجًا
فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا`,
    translit: `İzâ câe nasrullâhi vel feth. Ve raeyten nâse yedhulûne fî dînillâhi efvâcâ. Fe sebbih bihamdi rabbike vestagfirh. İnnehû kâne tevvâbâ.`,
    meaning: `Allah’ın yardımı ve fetih geldiği zaman; insanların Allah’ın dinine gruplar hâlinde girdiklerini gördüğünde, Rabbini hamd ile tesbih et ve O’ndan bağışlanma dile. Şüphesiz O, tevbeleri çok kabul edendir.`,
  },
  {
    id: "tebbet",
    name: "Tebbet Suresi",
    arabicTitle: "المسد",
    verses: 5,
    usage: 7,
    status: "not_started",
    arabic: `تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ
مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ
سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ
وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ
فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ`,
    translit: `Tebbet yedâ Ebî Lehebin ve tabb. Mâ ağnâ anhu mâluhû ve mâ keseb. Seyaslâ nâran zâte leheb. Vemraetühû hammâletel hatab. Fî cîdihâ hablün min mesed.`,
    meaning: `Ebu Leheb’in elleri kurusun! Kendisi de kurudu. Malı ve kazandığı ona fayda vermedi. O, alevli bir ateşe girecektir. Karısı da odun taşıyacaktır. Boynunda bükülmüş ipten bir halat olacak.`,
  },
  {
    id: "ihlas",
    name: "İhlâs Suresi",
    arabicTitle: "الإخلاص",
    verses: 4,
    usage: 10,
    status: "memorized",
    arabic: `قُلْ هُوَ اللّٰهُ أَحَدٌ
اللّٰهُ الصَّمَدُ
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
    arabic: `قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ
مِن شَرِّ مَا خَلَقَ
وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ
وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ
وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
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
    arabic: `قُلْ أَعُوذُ بِرَبِّ النَّاسِ
مَلِكِ النَّاسِ
إِلٰهِ النَّاسِ
مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ
الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ
مِنَ الْجِنَّةِ وَالنَّاسِ`,
    translit: `Kul eûzü birabbin nâs. Melikin nâs. İlâhin nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin nâs. Minel cinneti vennâs.`,
    meaning: `De ki: İnsanların Rabbine, insanların Melikine, insanların ilâhına sığınırım. Sinsice vesvese veren şeytanın şerrinden; insanların göğüslerine vesvese veren; cinlerden ve insanlardan olan vesvesecinin şerrinden.`,
  },
  {
    id: "asr",
    name: "Asr Suresi",
    arabicTitle: "العصر",
    verses: 3,
    usage: 9,
    status: "memorized",
    arabic: `وَالْعَصْرِ
إِنَّ الْإِنسَانَ لَفِي خُسْرٍ
إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ`,
    translit: `Vel asr. İnnel insâne lefî husr. İllellezîne âmenû ve amilüs sâlihâti ve tevâsav bil hakkı ve tevâsav bis sabr.`,
    meaning: `Asra andolsun ki insan gerçekten ziyandadır. Ancak iman edip salih amel işleyenler, hakkı tavsiye edenler ve sabrı tavsiye edenler bunun dışındadır.`,
  },
  {
    id: "kadr",
    name: "Kadr Suresi",
    arabicTitle: "القدر",
    verses: 5,
    usage: 7,
    status: "not_started",
    arabic: `إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ
وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ
لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ
تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِّن كُلِّ أَمْرٍ
سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ`,
    translit: `İnnâ enzelnâhü fî leyletil kadr. Ve mâ edrâke mâ leyletül kadr. Leyletül kadri hayrun min elfi şehr. Tenezzelül melâiketü ver-rûhu fîhâ bi izni rabbihim min külli emr. Selâmün hiye hattâ matlai'l fecr.`,
    meaning: `Şüphesiz biz onu Kadir gecesinde indirdik. Kadir gecesinin ne olduğunu sen nasıl bileceksin? Kadir gecesi bin aydan hayırlıdır. Melekler ve Ruh, o gece Rablerinin izniyle her iş için iner. O gece tan yeri ağarıncaya kadar esenliktir.`,
  },
  {
    id: "zilzal",
    name: "Zilzal Suresi",
    arabicTitle: "الزلزلة",
    verses: 8,
    usage: 5,
    status: "not_started",
    arabic: `إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا
وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا
وَقَالَ الْإِنسَانُ مَا لَهَا
يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا
بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا
يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ
فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ
وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ`,
    translit: `İzâ zülzilatil ardu zilzâlehâ. Ve ahrecetil ardu eksâlehâ. Ve kalel insânu mâ lehâ. Yevme izin tühaddisü ahbârehâ. Bi enne rabbeke evhâ lehâ. Yevme izin yasdürun nâsü eştâten liyürav a'mâlehüm. Fe men ya'mel miskâle zerretin hayran yerah. Ve men ya'mel miskâle zerretin şerran yerah.`,
    meaning: `Yer sarsılıp sarsıntısını dışarı attığında, ağırlıklarını dışarı çıkardığında ve insan “Buna ne oluyor?” dediğinde yer o gün haberlerini anlatır. Çünkü Rabbin ona bunu vahyetmiştir. O gün insanlar amellerini görmek üzere dağınık gruplar hâlinde çıkacaklardır. Kim zerre kadar hayır işlerse onu görür; kim zerre kadar şer işlerse onu görür.`,
  },
  {
    id: "beyyine",
    name: "Beyyine Suresi",
    arabicTitle: "البينة",
    verses: 8,
    usage: 5,
    status: "not_started",
    arabic: `لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ
رَسُولٌ مِّنَ اللّٰهِ يَتْلُو صُحُفًا مُّطَهَّرَةً
فِيهَا كُتُبٌ قَيِّمَةٌ
وَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِن بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ
وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللّٰهَ مُخْلِصِينَ لَهُ الدِّينَ
حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ وَذَٰلِكَ دِينُ الْقَيِّمَةِ
إِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ فِي نَارِ جَهَنَّمَ
أُولَٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ`,
    translit: `Lem yekünillezîne keferû min ehli'l kitâbi vel müşrikîne munfekkîn hattâ te'tiyehümül beyyine. Rasûlün minallâhi yetlû suhufen mutahharah. Fîhâ kütübün kayyimeh. Ve mâ teferrakellezîne ûtül kitâbe illâ min ba'di mâ câetühümül beyyine. Ve mâ ümirû illâ li ya'budûllâhe muhlisîne lehüd dîn. Hunefâe ve yukîmûs salâte ve yü'tüz zekâte ve zâlike dînül kayyimeh. İnnellezîne keferû min ehli'l kitâbi vel müşrikîne fî nâri cehenneme. Ulâike hum şerrül beriyyeh.`,
    meaning: `Ehl-i kitaptan ve müşriklerden inkâr edenler, kendilerine açık delil gelinceye kadar ayrılıp gitmezlerdi. Allah’tan bir elçi, tertemiz sayfalar okur; içinde doğru hükümler vardır. Kendilerine kitap verilenler, ancak açık delil geldikten sonra ayrılığa düştüler. Oysa onlara sadece dini Allah için hâlis kılarak O’na kulluk etmeleri, namazı kılmaları ve zekâtı vermeleri emredilmişti. İşte dosdoğru din budur.`,
  },
  {
    id: "tin",
    name: "Tîn Suresi",
    arabicTitle: "التين",
    verses: 8,
    usage: 4,
    status: "not_started",
    arabic: `وَالتِّينِ وَالزَّيْتُونِ
وَطُورِ سِينِينَ
وَهَٰذَا الْبَلَدِ الْأَمِينِ
لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ
ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ
إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ
فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ
أَلَيْسَ اللّٰهُ بِأَحْكَمِ الْحَاكِمِينَ`,
    translit: `Vetteyni vez zeytûn. Ve tûri sînîn. Ve hâzel beledil emîn. Lekad halaknâl insâne fî ahseni takvîm. Sümme redednâhu esfela sâfilîn. İllellezîne âmenû ve amilüs sâlihâti fe lehüm ecrun ğayru memnûn. Femâ yukezzibuke ba'dü bid dîn. Eleyse'llâhu bi ahkemil hâkimîn.`,
    meaning: `İncire ve zeytine, Sina Dağı’na, bu emin şehre andolsun ki insanı en güzel biçimde yarattık; sonra onu aşağıların aşağısına çevirdik. Ancak iman edip salih amel işleyenler müstesna; onlar için kesintisiz bir mükâfat vardır. Bundan sonra seni ne din konusunda yalanlatabilir? Allah hükmedenlerin en iyisi değil midir?`,
  },
  {
    id: "humeze",
    name: "Hümeze Suresi",
    arabicTitle: "الهمزة",
    verses: 9,
    usage: 4,
    status: "not_started",
    arabic: `وَيْلٌ لِكُلِّ هُمَزَةٍ لُّمَزَةٍ
الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ
يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ
كَلَّا لَيُنْبَذَنَّ فِي الْحُطَمَةِ
وَمَا أَدْرَاكَ مَا الْحُطَمَةُ
نَارُ اللّٰهِ الْمُوقَدَةُ
الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ
إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ
فِي عَمَدٍ مُّمَدَّدَةٍ`,
    translit: `Veylün likülli hümezetin lümeze. Ellezî cemea mâlen ve addedeh. Yahsebü enne mâlehu ahledeh. Kellâ leyünbezenne fil hutameh. Ve mâ edrâke mâl hutameh. Nârullâhil mûkadeh. Elle tî tattaliu alel efideh. İnnehâ aleyhim mu'sadeh. Fî amedin memeddedeh.`,
    meaning: `İnsanları arkadan çekiştiren, kusur arayan herkesin vay hâline! O, mal biriktirip onu saydıkça sayandır. Malının kendisini ebedî kılacağını sanır. Hayır! O, Hutame’ye atılacaktır. Hutame’nin ne olduğunu sana bildiren ne? Allah’ın tutuşturulmuş ateşi! O, gönüllerin ta içine işler. Onlar üzerine kapatılmıştır, uzatılmış direkler arasında.`,
  },
  {
    id: "tekasur",
    name: "Tekâsür Suresi",
    arabicTitle: "التكاثر",
    verses: 8,
    usage: 5,
    status: "not_started",
    arabic: `أَلْهَاكُمُ التَّكَاثُرُ
حَتَّىٰ زُرْتُمُ الْمَقَابِرَ
كَلَّا سَوْفَ تَعْلَمُونَ
ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ
كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ
لَتَرَوُنَّ الْجَحِيمَ
ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ
ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ`,
    translit: `Elhâkümüt tekâsür. Hattâ zürtümül mekâbir. Kellâ sevfe ta'lemûn. Sümme kellâ sevfe ta'lemûn. Kellâ lev ta'lemûne ilmel yakîn. Le teravünnel cahîm. Sümme le teravünnehâ aynel yakîn. Sümme le tus'elünne yevme izin anin naîm.`,
    meaning: `Çokluk yarışı sizi oyaladı; ta ki kabirleri ziyaret edinceye kadar. Hayır! Yakında bileceksiniz. Sonra yine hayır, yakında bileceksiniz. Keşke kesin bilgiyle bilseydiniz! Cehennemi mutlaka göreceksiniz. Sonra onu gözle görür gibi göreceksiniz. Sonra o gün nimetlerden mutlaka sorgulanacaksınız.`,
  },
  {
    id: "karia",
    name: "Kâria Suresi",
    arabicTitle: "القارعة",
    verses: 11,
    usage: 4,
    status: "not_started",
    arabic: `الْقَارِعَةُ
مَا الْقَارِعَةُ
وَمَا أَدْرَاكَ مَا الْقَارِعَةُ
يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ
وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنفُوشِ
فَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ
فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ
وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ
فَأُمُّهُ هَاوِيَةٌ
وَمَا أَدْرَاكَ مَا هِيَهْ
نَارٌ حَامِيَةٌ`,
    translit: `El kâriah. Mâl kâriah. Ve mâ edrâke mâl kâriah. Yevme yekûnün nâsu kel ferâşil mebthûş. Ve tekûnül cibâlu kel ıhnil menfûş. Fe emmâ men sekulet mevâzînüh. Fe huve fî ışıetin râdiyeh. Ve emmâ men hafvet mevâzînüh. Fe ümmühû hâviyeh. Ve mâ edrâke mâ hiyeh. Nârün hâmiyeh.`,
    meaning: `Kıyameti çarpan büyük felaket! Kıyametin ne olduğunu sana ne bildirdi? O gün insanlar dağılmış pervaneler gibi olur. Dağlar atılmış renkli yün gibi olur. Kimin tartıları ağır gelirse, o hoşnut bir hayat içindedir. Kimin tartıları hafif gelirse, onun varacağı yer Hâviye’dir. Hâviye’nin ne olduğunu sana ne bildirdi? Çok sıcak bir ateştir.`,
  },
  {
    id: "adiyat",
    name: "Âdiyât Suresi",
    arabicTitle: "العاديات",
    verses: 11,
    usage: 4,
    status: "not_started",
    arabic: `وَالْعَادِيَاتِ ضَبْحًا
فَالْمُورِيَاتِ قَدْحًا
فَالْمُغِيرَاتِ صُبْحًا
فَأَثَرْنَ بِهِ نَقْعًا
فَوَسَطْنَ بِهِ جَمْعًا
إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ
وَإِنَّهُ عَلَىٰ ذَٰلِك لَشَهِيدٌ
وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ
أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ
وَحُصِّلَ مَا فِي الصُّدُورِ
إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَخَبِيرٌ`,
    translit: `Vel âdiyâti dabha. Fel mûriyâti kadhha. Fel mugîrâti subha. Fe eserne bihî nak'a. Fe vesa'tne bihî cem'a. İnnel insâne lirabbihî le kanûd. Ve innehu alâ zâlike le şehîd. Ve innehu li hubbil hayri le şedîd. Efelâ ya'lemü izâ bu'sıra mâ fil kubûr. Ve hussıla mâ fis sudûr. İnne rabbahum bihim yevme izin le habîr.`,
    meaning: `Nefes nefese koşan atlara andolsun, kıvılcım çıkaranlara, sabah baskın yapanlara, tozu dumana katanlara andolsun ki insan gerçekten Rabbine karşı çok nankördür; buna kendisi de şahittir. O, mal sevgisine de çok düşkündür. Kabirlerde olanlar çıkarılıp, gönüllerde olanlar ortaya döküldüğünde bilmeyecek mi? Şüphesiz Rableri o gün onlardan haberdardır.`,
  },
  {
    id: "duha",
    name: "Duha Suresi",
    arabicTitle: "الضحى",
    verses: 11,
    usage: 6,
    status: "not_started",
    arabic: `وَالضُّحَى
وَاللَّيْلِ إِذَا سَجَىٰ
مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ
وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ
وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ
أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ
وَوَجَدَكَ ضَالًّا فَهَدَىٰ
وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ
فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ
وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ
وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ`,
    translit: `Ved duhâ. Velleyli izâ seca. Mâ veddeake rabbüke ve mâ kalâ. Ve lel âhiratu hayrun leke minel ûlâ. Ve lesevfe yu'tîke rabbüke fe terdâ. Elem yecidke yetîmen fe âvâ. Ve vecedeke dâllen fe hedâ. Ve vecedeke âilen fe ağnâ. Fe emmâl yetîme fe lâ takher. Ve emmâs sâile fe lâ tenher. Ve emmâ bi ni'meti rabbike fe haddis.`,
    meaning: `Kuşluk vaktine andolsun; sakinleşen geceye andolsun ki Rabbin seni terk etmedi, sana darılmadı. Elbette ahiret senin için dünyadan daha hayırlıdır. Rabbin sana verecek de sen hoşnut olacaksın. Seni yetim bulup barındırmadı mı? Seni yolunu ararken doğru yola iletmedi mi? Seni muhtaç bulup zenginleştirmedi mi? O hâlde yetimi ezme, isteyeni azarlama, Rabbinin nimetini anlat.`,
  },
  {
    id: "inshirah",
    name: "İnşirah Suresi",
    arabicTitle: "الشرح",
    verses: 8,
    usage: 6,
    status: "not_started",
    arabic: `أَلَمْ نَش شرحْ لَكَ صَدْرَكَ
وَوَضَعْنَا عَنكَ وِزْرَكَ
الَّذِي أَنْقَضَ ظَهْرَكَ
وَرَفَعْنَا لَكَ ذِكْرَكَ
فَإِنَّ مَعَ الْعُسْرِ يُسْرًا
إِنَّ مَعَ الْعُسْرِ يُسْرًا
فَإِذَا فَرَغْتَ فَانصَبْ
وَإِلَىٰ رَبِّكَ فَارْغَبْ`,
    translit: `Elem neşrah leke sadrak. Ve vedana anke vizrak. Ellezî enkada zahrak. Ve refa'nâ leke zikrak. Fe inne me'al usri yusrâ. İnne me'al usri yusrâ. Fe izâ feragta fensab. Ve ilâ rabbike ferğab.`,
    meaning: `Senin göğsünü açıp genişletmedik mi? Sırtını ezen yükünü kaldırmadık mı? Senin için şöhretini yükseltmedik mi? Şüphesiz zorlukla beraber bir kolaylık vardır. Evet, gerçekten zorlukla beraber bir kolaylık vardır. O hâlde boş kaldığında yeni bir işe koyul ve yalnız Rabbine yönel.`,
  },
  {
    id: "lakad",
    name: "Alak Suresi",
    arabicTitle: "العلق",
    verses: 19,
    usage: 4,
    status: "not_started",
    arabic: `اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ
اقْرَأْ وَرَبُّكَ الْأَكْرَمُ
الَّذِي عَلَّمَ بِالْقَلَمِ
عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ
كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ
أَنْ رَّآهُ اسْتَغْنَىٰ
إِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ
أَرَأَيْتَ الَّذِي يَنْهَىٰ
عَبْدًا إِذَا صَلَّىٰ
أَرَأَيْتَ إِن كَانَ عَلَى الْهُدَىٰ
أَوْ أَمَرَ بِالتَّقْوَىٰ
أَرَأَيْتَ إِن كَذَّبَ وَتَوَلَّىٰ
أَلَمْ يَعْلَمْ بِأَنَّ اللّٰهَ يَرَىٰ
كَلَّا لَئِن لَّمْ يَنتَهِ لَنَسْفَعًا بِالنَّاصِيَةِ
نَاصِيَةٍ كَاذِبةٍ خَاطِئَةٍ
فَلْيَدْعُ نَادِيَهُ
سَنَدْعُ الزَّبَانِيَةَ
كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِب`,
    translit: `İkra bismi rabbikellezî halak. Halakal insâne min alak. İkra ve rabbükel ekrem. Ellezî allame bil kalem. Allamel insâne mâ lem ya'lem. Kellâ innel insâne le yattğâ. En raâhustağnâ. İnne ilâ rabbiker ruc'â. Eraeytellezî yenhâ. Abden izâ sallâ. Eraeyte in kâne alel hüdâ. Ev emera bit takvâ. Eraeyte in kezzebe ve tevellâ. Elem ya'lem bi enne'llâhe yerâ. Kellâ lein lem yentehi le nesfe'an binnâsiyeh. Nâsiyetin kâzibetin hâti'ah. Felyed'u nâdiyah. Sened'uz zebâniyah. Kellâ lâ tuti'hu vescud vakterib.`,
    meaning: `Yaratan Rabbinin adıyla oku. İnsanı alaktan yarattı. Oku! Rabbin sonsuz kerem sahibidir. Kalemle öğreten O’dur. İnsana bilmediğini öğretti. Hayır! İnsan gerçekten azgınlık eder. Kendini yeterli görünce. Şüphesiz dönüş yalnız Rabbinedir. Görmedin mi o engelleyeni; bir kulu namaz kılarken. Ya o kul doğru yolda ise? Ya da takvayı emrediyorsa? Görmedin mi yalanlayıp yüz çevireni? Allah’ın gördüğünü bilmiyor mu? Hayır, vazgeçmezse onu perçeminden yakalayacağız; yalancı, günahkâr perçemden. O zaman topluluğunu çağırsın. Biz de zebânîleri çağıracağız. Sakın ona uyma; secde et ve yaklaş.`,
  },
  {
    id: "kunut_hanefi",
    name: "Kunut Duası (Hanefî)",
    arabicTitle: "دعاء القنوت",
    verses: 1,
    usage: 8,
    status: "not_started",
    arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ`,
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
    arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ`,
    translit: `Allâhümmehdinî fîmen hedeyt. Ve âfinî fîmen âfeyt. Ve tevellenî fîmen tevelleyt. Ve bârik lî fîmâ a'tayt. Ve kinî şerre mâ kadayt.`,
    meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver. Afiyet verdiklerin arasında bana da afiyet ver. Dost edindiklerin arasında beni de dost edin. Bana verdiğin şeylerde bereket ver. Hükmettiğin şeylerin şerrinden beni koru.`,
  },
];

const duaData = [
  { id: "ettehiyyat", name: "Ettehiyyâtü", arabic: `التَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللّٰهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ\nوَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`, translit: `Ettehiyyâtü lillâhi vessalavâtü vettayyibât. Esselâmü aleyke eyyühen nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ibâdillâhis sâlihîn. Eşhedü enlâ ilâhe illallâh. Ve eşhedü enne Muhammeden abdühû ve resûlüh.`, meaning: `Bütün selamlar, ibadetler ve güzel şeyler Allah içindir. Ey Nebi, Allah’ın selamı, rahmeti ve bereketi senin üzerine olsun. Selam bizim üzerimize ve Allah’ın salih kullarının üzerine olsun. Şahitlik ederim ki Allah’tan başka ilah yoktur. Ve şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.` },
  { id: "salli", name: "Allâhumme Salli", arabic: `اللّٰهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ\nوَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline salât eyle.` },
  { id: "barik", name: "Allâhumme Bârik", arabic: `اللّٰهُمَّ بَارِكْ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ\nوَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme bârik alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline bereket ver.` },
  { id: "rabbenaantina", name: "Rabbena Âtinâ", arabic: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`, translit: `Rabbenâ âtinâ fid-dünyâ haseneten ve fil âhireti haseneten ve kınâ azâben nâr.`, meaning: `Rabbimiz! Bize dünyada iyilik, ahirette de iyilik ver ve bizi ateş azabından koru.` },
  { id: "rabbenağfirli", name: "Rabbenağfirli", arabic: `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ`, translit: `Rabbiğfir lî ve livâlideyye ve lil mü'minîne yevme yekûmül hisâb.`, meaning: `Rabbim! Beni, anne-babamı ve hesabın görüleceği günde bütün müminleri bağışla.` },
  { id: "kunut_hanefi", name: "Kunut (Hanefî)", arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ...`, translit: `Allâhümme innâ nesteînüke ve nestağfirüke...`, meaning: `Allah’ım! Senden yardım ister, bağışlanma diler ve Sana dayanırız.` },
  { id: "kunut_shafii", name: "Kunut (Şâfiî)", arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ...`, translit: `Allâhümmehdinî fîmen hedeyt...`, meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver.` },
];

const zikrData = [
  { id: "subhanallah", name: "Sübhanallah", arabic: "سُبْحَانَ اللّٰهِ", translit: "Sübhanallah", meaning: "Allah’ı bütün eksikliklerden tenzih ederim.", defaultTarget: 33 },
  { id: "elhamdulillah", name: "Elhamdülillah", arabic: "الْحَمْدُ لِلّٰهِ", translit: "Elhamdülillah", meaning: "Hamd Allah’a mahsustur.", defaultTarget: 33 },
  { id: "allahu_ekber", name: "Allahu Ekber", arabic: "اللّٰهُ أَكْبَرُ", translit: "Allahu Ekber", meaning: "Allah en büyüktür.", defaultTarget: 33 },
  { id: "la_ilaha", name: "Lâ ilâhe illallâh", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", translit: "Lâ ilâhe illallâh", meaning: "Allah’tan başka ilah yoktur.", defaultTarget: 33 },
  { id: "estagfirullah", name: "Estağfirullah", arabic: "أَسْتَغْفِرُ اللّٰهَ", translit: "Estağfirullah", meaning: "Allah’tan bağışlanma dilerim.", defaultTarget: 33 },
  { id: "salavat", name: "Salavat-ı Şerif", arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ", translit: "Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.", meaning: "Peygamber Efendimize salavat getirir.", defaultTarget: 33 },
  { id: "lahaula", name: "Lâ havle ve lâ kuvvete", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ", translit: "Lâ havle ve lâ kuvvete illâ billâh", meaning: "Güç ve kuvvet ancak Allah’ladır.", defaultTarget: 33 },
  { id: "hasbunallah", name: "Hasbunallahu", arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ", translit: "Hasbunallâhu ve ni'mel vekîl", meaning: "Allah bize yeter, O ne güzel vekildir.", defaultTarget: 33 },
  { id: "subhanallahi", name: "Sübhanallahi ve bihamdihi", arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", translit: "Sübhanallahi ve bihamdihi", meaning: "Allah’ı hamdiyle tesbih ederim.", defaultTarget: 100 },
  { id: "bismillah", name: "Bismillâhillazî lâ yedurru", arabic: "بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ", translit: "Bismillâhillazî lâ yedurru", meaning: "Allah’ın adıyla; O’nun adıyla hiçbir şey zarar vermez.", defaultTarget: 3 },
];

const DEFAULT_STATE = {
  auth: false,
  username: "",
  level: 1,
  xp: 0,
  gems: 0,
  dailyStreak: 0,
  isDarkMode: isNightTime(),
  prayerDone: emptyPrayer(),
  prayerHistory: [],
  lastPrayerDate: "",
  missedPrayers: 0,
  surahProgress: {},
  surahStatuses: {},
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
    isDarkMode: typeof s.isDarkMode === "boolean" ? s.isDarkMode : isNightTime(),
    prayerDone: s.prayerDone || emptyPrayer(),
    prayerHistory: Array.isArray(s.prayerHistory) ? s.prayerHistory : [],
    dailyLogs: s.dailyLogs || { date: "", zikrs: [], duas: [] },
    totalReadCounts: s.totalReadCounts || {},
    surahProgress: s.surahProgress || {},
    surahStatuses: s.surahStatuses || {},
    zikrCounts: s.zikrCounts || {},
    selectedTab: s.selectedTab || "home",
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
  const [activeItemType, setActiveItemType] = useState("surah");

  // Bursa Canlı Namaz Vakitleri State'i
  const [bursaTimes, setBursaTimes] = useState({
    imsak: "04:32",
    gunes: "06:05",
    ogle: "13:12",
    ikindi: "16:58",
    aksam: "20:10",
    yatsi: "21:38",
  });

  // Bursa Vakitlerini API'den Çekme
  useEffect(() => {
    fetchBursaPrayerTimes().then((times) => {
      if (times) {
        setBursaTimes(times);
        if (localStorage.getItem(STORAGE_KEY) === null) {
          setState((s) => ({ ...s, isDarkMode: isNightTime(times.aksam, times.imsak) }));
        }
      }
    });
  }, []);

  // Google Fonts (Amiri Fontu Yükle)
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    setState((s) => ({ ...s, level: Math.floor(s.xp / 100) + 1 }));
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
    const inputUser = user.trim().toLowerCase();
    const foundUser = USERS.find((u) => u.username.toLowerCase() === inputUser && u.pass === pass);

    if (foundUser) {
      setState((s) => ({ ...s, auth: true, username: foundUser.username, selectedTab: "home" }));
      setLoginError("");
    } else {
      setLoginError("Kullanıcı adı veya şifre yanlış.");
    }
  }

  function logout() {
    setState((s) => ({ ...s, auth: false }));
  }

  function markPrayer(id) {
    triggerHaptic();
    setState((s) => {
      const nextDone = { ...s.prayerDone, [id]: !s.prayerDone[id] };
      const count = Object.values(nextDone).filter(Boolean).length;
      const history = Array.isArray(s.prayerHistory) ? s.prayerHistory : [];
      const t = todayKey();
      const nextHistory = history.some((x) => x.date === t)
        ? history.map((x) => (x.date === t ? { date: t, count } : x))
        : [...history, { date: t, count }];

      if (count === 5) {
        setCelebrate("Tüm vakit namazları tamamlandı! Maşallah.");
      }

      return {
        ...s,
        prayerDone: nextDone,
        prayerHistory: nextHistory.slice(-30),
        lastPrayerDate: t,
        xp: s.xp + (nextDone[id] ? 20 : -20),
        gems: s.gems + (count === 5 ? 5 : 0),
      };
    });
  }

  function addSurahRead(id) {
    setState((s) => {
      const next = (s.surahProgress[id] || 0) + 1;
      return {
        ...s,
        surahProgress: { ...s.surahProgress, [id]: next },
        totalReadCounts: { ...(s.totalReadCounts || {}), [id]: ((s.totalReadCounts || {})[id] || 0) + 1 },
        surahStatuses: { ...s.surahStatuses, [id]: next >= 33 ? "memorized" : next > 0 ? "in_progress" : "not_started" },
        xp: s.xp + 5,
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
    triggerHaptic();
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
    return [
      { key: "istigfar", label: "İstiğfar ve Selam", title: "Estagfirullah, estagfirullah, estagfirullah. Allahümme entes-selamü ve minkes-selam, tebarekte ya zel-celali vel-ikram.", meaning: "Allah’ım! Sen selam sahibisin, selam/esenlik ancak Sendedir. Ey celal ve ikram sahibi Rabbim, Sen ne yücesin.", count: 1 },
      ...(state.tesbihatType === "long" ? [{ key: "salavat", label: "Salavat", title: "Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.", meaning: "Peygamber Efendimize salavat.", count: 1 }] : []),
      { key: "ayetelkursi", label: "Ayetel Kürsi", title: "Allâhu lâ ilâhe illâ hüve'l-hayyü'l-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fil ard. Menzellezî yeşfeu indehû illâ bi iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehum. Ve lâ yuhîtûne bi şey'in min ilmihî illâ bimâ şâe. Vesi'a kürsiyyühüs-semâvâti vel ard. Ve lâ yeûdühû hıfzuhumâ. Ve huvel aliyyül azîm.", meaning: AYETEL_KURSI_MEALI, count: 1 },
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
    triggerHaptic();
    setState((s) => {
      const steps = currentTesbihatSteps();
      const step = steps[s.tesbihatIndex] || steps[0];
      const progress = [...(s.tesbihatProgress || Array(steps.length).fill(0))];
      const next = Math.min(step.count, (progress[s.tesbihatIndex] || 0) + 1);
      progress[s.tesbihatIndex] = next;

      const shouldAdvance = next >= step.count && s.tesbihatIndex < steps.length - 1;

      return {
        ...s,
        tesbihatProgress: progress,
        tesbihatIndex: shouldAdvance ? s.tesbihatIndex + 1 : s.tesbihatIndex,
      };
    });
  }

  function prevTesbihatStep() {
    setState((s) => ({ ...s, tesbihatIndex: Math.max(0, s.tesbihatIndex - 1) }));
  }

  function completeTesbihat() {
    triggerHaptic();
    setCelebrate("Tesbihat başarıyla tamamlandı!");
    setState((s) => ({ ...s, xp: s.xp + 50, gems: s.gems + 2, tesbihatIndex: 0, tesbihatProgress: [] }));
  }

  const toggleDarkMode = () => {
    setState((s) => ({ ...s, isDarkMode: !s.isDarkMode }));
  };

  const isDark = state.isDarkMode;
  const selectedZikrCount = state.zikrCounts?.[state.zikrSelected] || 0;

  // Temalı Sınıf İsimleri (Gündüz / Gece Modu)
  const themeClasses = {
    bg: isDark ? "bg-[#0b1311] text-emerald-50" : "bg-[#f4f7f4] text-slate-900",
    cardBg: isDark ? "bg-[#13221e] border-emerald-900/60 shadow-lg" : "bg-white border-emerald-100/80 shadow-sm",
    subCardBg: isDark ? "bg-[#0e1b17] border-emerald-950" : "bg-emerald-50/50 border-emerald-100",
    textHeading: isDark ? "text-emerald-100" : "text-emerald-950",
    textSub: isDark ? "text-emerald-400" : "text-emerald-700",
    textMuted: isDark ? "text-emerald-300/70" : "text-slate-500",
    buttonPrimary: "bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition active:scale-95",
    accentGlow: isDark ? "shadow-[0_0_20px_rgba(16,185,129,0.15)]" : "",
  };

  if (!state.auth) {
    return (
      <div className={`min-h-screen p-4 flex items-center justify-center transition-colors duration-300 ${themeClasses.bg}`}>
        <form onSubmit={login} className={`w-full max-w-sm rounded-3xl border p-6 ${themeClasses.cardBg}`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> İlim Yolu
          </div>
          <h1 className={`mt-4 text-2xl font-black ${themeClasses.textHeading}`}>Giriş Yap</h1>
          <p className={`mt-1 text-xs ${themeClasses.textMuted}`}>Kişisel ibadet alanına erişmek için giriş yap.</p>
          {loginError && <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-400">{loginError}</div>}
          <div className="mt-4 space-y-3">
            <label className="block">
              <div className={`mb-1 text-xs font-semibold ${themeClasses.textMuted}`}>Kullanıcı adı</div>
              <input value={user} onChange={(e) => setUser(e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${isDark ? "bg-[#0e1b17] border-emerald-900 text-white focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600"}`} placeholder="Kullanıcı adı" />
            </label>
            <label className="block">
              <div className={`mb-1 text-xs font-semibold ${themeClasses.textMuted}`}>Şifre</div>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${isDark ? "bg-[#0e1b17] border-emerald-900 text-white focus:border-emerald-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600"}`} placeholder="Şifre" />
            </label>
            <button type="submit" className={`w-full rounded-2xl py-3 text-center ${themeClasses.buttonPrimary}`}>
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${themeClasses.bg}`}>
      <div className="mx-auto max-w-[1400px] p-4 pb-28 lg:p-6">
        {/* Sadeleştirilmiş Ana Sayfa / Profil Üst Header */}
        {(state.selectedTab === "home" || state.selectedTab === "profil") && (
          <header className={`mb-4 rounded-[2rem] border p-4 transition-colors ${themeClasses.cardBg} ${themeClasses.accentGlow}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                    <Sparkles className="h-4 w-4" /> İlim Yolu
                  </span>
                  <button onClick={toggleDarkMode} className="ml-2 rounded-full bg-emerald-500/10 p-1.5 text-amber-400 hover:bg-emerald-500/20 transition" title="Karanlık Modu Değiştir">
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-emerald-800" />}
                  </button>
                </div>
                <h2 className={`mt-1 text-2xl font-black ${themeClasses.textHeading}`}>Selam, {state.username || "misafir"}</h2>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-400">
                  🔥 {prayerStreak} Gün Streak
                </span>
              </div>
            </div>
          </header>
        )}

        {celebrate && (
          <div className="mb-4 flex items-center justify-between rounded-3xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-400 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 font-semibold">
              <Trophy className="h-5 w-5 text-amber-400" /> {celebrate}
            </div>
            <button onClick={() => setCelebrate("")} className="text-xs text-amber-400 font-bold hover:underline">Kapat</button>
          </div>
        )}

        {state.selectedTab === "home" && <HomeView state={state} bursaTimes={bursaTimes} todayCount={todayCount} prayerFinished={prayerFinished} prayerStreak={prayerStreak} prayerSeries={prayerSeries} markPrayer={markPrayer} markDuaRead={markDuaRead} setState={setState} theme={themeClasses} isDark={isDark} />}
        {state.selectedTab === "sureler" && <SurahView selectedSurah={selectedSurah} selectedDua={selectedDua} filteredSurahs={filteredSurahs} search={search} setSearch={setSearch} sort={state.surahSort} setSort={(v) => setState((s) => ({ ...s, surahSort: v }))} progress={state.surahProgress} statuses={state.surahStatuses} setSelectedSurah={(id) => setState((s) => ({ ...s, selectedSurah: id }))} setSelectedDua={(id) => setState((s) => ({ ...s, selectedDua: id }))} setSurahStatus={setSurahStatus} addSurahRead={addSurahRead} activeItemType={activeItemType} setActiveItemType={setActiveItemType} theme={themeClasses} isDark={isDark} />}
        {state.selectedTab === "tesbihat" && <TesbihatView state={state} tesbihatSteps={tesbihatSteps} currentStep={currentStep} currentStepCount={currentStepCount} incTesbihatStep={incTesbihatStep} prevTesbihatStep={prevTesbihatStep} completeTesbihat={completeTesbihat} setState={setState} theme={themeClasses} isDark={isDark} />}
        {state.selectedTab === "zikir" && <ZikirView zikrData={zikrData} selectedZikr={selectedZikr} selectedZikrCount={selectedZikrCount} target={state.zikrTarget} selectZikr={selectZikr} addZikr={addZikr} resetZikr={resetZikr} counts={state.zikrCounts || {}} theme={themeClasses} isDark={isDark} />}
        {state.selectedTab === "oyun" && <GameView surah={selectedSurah} surahList={surahData} setSelectedSurah={(id) => setState((s) => ({ ...s, selectedSurah: id }))} addXp={(val) => setState((s) => ({ ...s, xp: s.xp + val }))} theme={themeClasses} isDark={isDark} />}
        {state.selectedTab === "profil" && <ProfileView state={state} prayerStreak={prayerStreak} prayerSeries={prayerSeries} logout={logout} theme={themeClasses} isDark={isDark} />}
      </div>

      <nav className={`fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-lg transition-colors ${isDark ? "bg-[#0b1311]/90 border-emerald-900/50" : "bg-white/90 border-emerald-100"}`}>
        <div className="mx-auto grid max-w-[1400px] grid-cols-6 gap-1 p-2">
          {[
            ["home", Home, "Ana Sayfa"],
            ["sureler", BookOpen, "Sureler"],
            ["tesbihat", Layers, "Tesbihat"],
            ["zikir", Sparkles, "Zikirmatic"],
            ["oyun", Gamepad2, "Ezber Modu"],
            ["profil", User, "Profil"],
          ].map(([key, Icon, label]) => (
            <button key={key} onClick={() => setState((s) => ({ ...s, selectedTab: key }))} className={`flex flex-col items-center justify-center rounded-2xl py-2 text-[10px] font-semibold transition active:scale-95 ${state.selectedTab === key ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/30" : isDark ? "text-emerald-400 hover:bg-emerald-900/20" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="mt-0.5 truncate">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// Canlı Ezan Vaktine Kalan Süreyi Hesaplayan Bileşen
function PrayerCountdown({ bursaTimes, isDark }) {
  const [timeLeft, setTimeLeft] = useState({ nextName: "", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const list = [
        { name: "İmsak", time: bursaTimes.imsak },
        { name: "Güneş", time: bursaTimes.gunes },
        { name: "Öğle", time: bursaTimes.ogle },
        { name: "İkindi", time: bursaTimes.ikindi },
        { name: "Akşam", time: bursaTimes.aksam },
        { name: "Yatsı", time: bursaTimes.yatsi },
      ];

      let next = null;

      for (let p of list) {
        const [h, m] = p.time.split(":").map(Number);
        const pDate = new Date();
        pDate.setHours(h, m, 0, 0);

        if (pDate > now) {
          next = { name: p.name, date: pDate };
          break;
        }
      }

      // Yarının İmsak vakti
      if (!next) {
        const [h, m] = bursaTimes.imsak.split(":").map(Number);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(h, m, 0, 0);
        next = { name: "İmsak (Yarın)", date: tomorrow };
      }

      const diff = Math.max(0, Math.floor((next.date - now) / 1000));
      const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const seconds = String(diff % 60).padStart(2, "0");

      setTimeLeft({ nextName: next.name, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [bursaTimes]);

  return (
    <div className={`mt-3 flex items-center justify-between rounded-2xl border p-3.5 ${isDark ? "bg-[#0e1b17] border-emerald-900/60" : "bg-emerald-50/60 border-emerald-100"}`}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-bold text-amber-400">Sonraki Vakit: <span className={isDark ? "text-emerald-100" : "text-emerald-950"}>{timeLeft.nextName}</span></span>
      </div>
      <div className="font-mono text-sm font-black tracking-wider text-emerald-400">
        {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
      </div>
    </div>
  );
}

function HomeView({ state, bursaTimes, todayCount, prayerFinished, prayerStreak, prayerSeries, markPrayer, markDuaRead, setState, theme, isDark }) {
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

  const percentage = (todayCount / 5) * 100;
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {/* 1. SIRA: Bursa Namaz Vakitleri & Canlı Geri Sayım Sayacı */}
        <section className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Clock className="h-5 w-5 text-amber-400" /> Bursa Namaz Vakitleri
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">Diyanet</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
            <TimeBox label="İmsak" time={bursaTimes.imsak} isDark={isDark} />
            <TimeBox label="Güneş" time={bursaTimes.gunes} isDark={isDark} />
            <TimeBox label="Öğle" time={bursaTimes.ogle} isDark={isDark} />
            <TimeBox label="İkindi" time={bursaTimes.ikindi} isDark={isDark} />
            <TimeBox label="Akşam" time={bursaTimes.aksam} isDark={isDark} />
            <TimeBox label="Yatsı" time={bursaTimes.yatsi} isDark={isDark} />
          </div>

          {/* Ezan Vaktine Kalan Süre Sayacı */}
          <PrayerCountdown bursaTimes={bursaTimes} isDark={isDark} />
        </section>

        {/* 2. SIRA: Bugün Kılınan Namazların İşaretleme Çizelgesi */}
        <section className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className={`text-lg font-bold ${theme.textHeading}`}>Bugün Kılınan Namazlar</h3>
            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">Tamamlanan {todayCount}/5</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {prayerCards.map((p) => {
              const done = state.prayerDone[p.id];
              return (
                <button key={p.id} onClick={() => markPrayer(p.id)} className={`rounded-3xl border p-4 text-left transition active:scale-95 ${done ? (isDark ? "border-emerald-500 bg-emerald-950/40 text-emerald-200" : "border-emerald-300 bg-emerald-50 text-emerald-900") : (isDark ? "border-emerald-900/40 bg-[#0e1b17]" : "border-slate-200 bg-slate-50")}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{p.tr}</div>
                      <div className={`text-xs ${theme.textMuted}`}>{p.en}</div>
                    </div>
                    <CheckCircle2 className={`h-5 w-5 transition-colors ${done ? "text-amber-400" : "text-emerald-900/40"}`} />
                  </div>
                  <div className="mt-3 text-xs font-semibold">{done ? "✓ Kılındı" : "Kılınmadı"}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. SIRA (EN ALT): Bugünün Özeti ve Bugün Ne Yapayım */}
        <section className={`rounded-[2rem] border p-5 transition ${theme.cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center h-20 w-20 flex-shrink-0">
                <svg className="h-20 w-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="7" className={isDark ? "text-emerald-950" : "text-emerald-100"} fill="transparent" />
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="7" className="text-emerald-500 transition-all duration-700 ease-out" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * percentage) / 100} strokeLinecap="round" fill="transparent" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-amber-400">{todayCount}/5</span>
                  <span className="text-[8px] uppercase font-bold text-emerald-400">Namaz</span>
                </div>
              </div>
              <div>
                <h3 className={`text-xl font-bold ${theme.textHeading}`}>Bugünün Özeti</h3>
                <p className={`text-xs ${theme.textMuted}`}>Bugün okuduğunuz zikirler ve dualar.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className={`rounded-2xl border p-3 text-xs leading-6 ${theme.subCardBg}`}>
              <div className="font-bold text-amber-400">Bugünkü Zikirler</div>
              <div className={`mt-1 truncate ${theme.textMuted}`}>{todayZikrs}</div>
            </div>
            <div className={`rounded-2xl border p-3 text-xs leading-6 ${theme.subCardBg}`}>
              <div className="font-bold text-amber-400">Bugünkü Dualar</div>
              <div className={`mt-1 truncate ${theme.textMuted}`}>{todayDuas}</div>
              <button onClick={() => markDuaRead(state.selectedDua)} className="mt-2 rounded-xl bg-emerald-700 px-3 py-1 text-[10px] font-bold text-white hover:bg-emerald-600 transition active:scale-95">
                Bu Duayı Okudum
              </button>
            </div>
          </div>
        </section>

        <section className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className={`text-lg font-bold ${theme.textHeading}`}>Bugün Ne Yapmalıyım?</h3>
            <div className={`rounded-full px-3 py-1 text-xs font-semibold ${prayerFinished ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>{prayerFinished ? "Tamamlandı" : `Eksik ${5 - todayCount}`}</div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <QuickAction label="İhlâs Suresi oku" desc="Okuma ekranına git" onClick={() => setState((s) => ({ ...s, selectedTab: "sureler", selectedSurah: "ihlas" }))} theme={theme} />
            <QuickAction label="Fâtiha Suresi oku" desc="Okuma ekranına git" onClick={() => setState((s) => ({ ...s, selectedTab: "sureler", selectedSurah: "fatiha" }))} theme={theme} />
            <QuickAction label="Ettehiyyâtü oku" desc="Dua ekranına git" onClick={() => setState((s) => ({ ...s, selectedTab: "sureler", selectedDua: "ettehiyyat" }))} theme={theme} />
            <QuickAction label="Zikir çek" desc="Zikirmatic'e git" onClick={() => setState((s) => ({ ...s, selectedTab: "zikir" }))} theme={theme} />
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <section className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
          <h3 className={`text-lg font-bold ${theme.textHeading}`}>Son 7 Gün Namaz Grafiği</h3>
          <p className={`text-xs ${theme.textMuted}`}>Tarih ve kılınan namaz sayısı.</p>
          <div className="mt-4 space-y-3">
            {prayerSeries.map((d) => {
              const max = 5;
              return (
                <div key={d.date} className="grid grid-cols-[68px_1fr_28px] items-center gap-3">
                  <div className={`text-xs font-medium ${theme.textMuted}`}>{d.date.slice(5)}</div>
                  <div className={`h-3 overflow-hidden rounded-full ${isDark ? "bg-emerald-950" : "bg-slate-100"}`}>
                    <div className="h-3 rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${(d.count / max) * 100}%` }} />
                  </div>
                  <div className="text-right text-xs font-bold text-amber-400">{d.count}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
          <h3 className={`text-lg font-bold ${theme.textHeading}`}>Bilgilendirme</h3>
          <p className={`mt-2 text-xs leading-6 ${theme.textMuted}`}>Canlı Bursa namaz vakitleri Diyanet takvimine tam uyumlu şekilde çekilmektedir. Bir sonraki vakte kalan süre geri sayım aracılığıyla canlı olarak sunulur.</p>
        </section>
      </aside>
    </div>
  );
}

function TimeBox({ label, time, isDark }) {
  return (
    <div className={`rounded-xl p-2 border transition ${isDark ? "bg-[#0e1b17] border-emerald-900/40" : "bg-slate-50 border-slate-100"}`}>
      <div className="text-[10px] text-amber-400 font-bold uppercase">{label}</div>
      <div className={`font-black text-sm mt-0.5 ${isDark ? "text-emerald-100" : "text-emerald-950"}`}>{time}</div>
    </div>
  );
}

function QuickAction({ label, desc, onClick, theme }) {
  return (
    <button onClick={onClick} className={`rounded-2xl border p-3.5 text-left transition active:scale-98 ${theme.subCardBg} hover:border-emerald-500/40`}>
      <div className={`text-sm font-bold ${theme.textHeading}`}>{label}</div>
      <div className={`mt-0.5 text-xs ${theme.textMuted}`}>{desc}</div>
    </button>
  );
}

function SurahView({ selectedSurah, selectedDua, filteredSurahs, search, setSearch, sort, setSort, progress, statuses, setSelectedSurah, setSelectedDua, setSurahStatus, addSurahRead, activeItemType, setActiveItemType, theme, isDark }) {
  const isSurah = activeItemType === "surah";
  const activeItem = isSurah ? selectedSurah : (duaData.find((d) => d.id === selectedDua) || duaData[0]);

  const activeStatus = isSurah ? (statuses[selectedSurah.id] || "not_started") : "not_started";
  const statusMeta = {
    memorized: ["Hafızada", "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"],
    in_progress: ["Devam ediyor", "bg-amber-500/20 text-amber-300 border border-amber-500/30"],
    not_started: ["Sıfırlandı", "bg-slate-500/20 text-slate-300 border border-slate-500/30"],
  };

  const combinedMenu = [
    { type: "surah", id: "fatiha", label: "Fâtiha Suresi" },
    ...filteredSurahs.filter((s) => s.id !== "fatiha").map((s) => ({ type: "surah", id: s.id, label: s.name })),
    { type: "dua", id: "ettehiyyat", label: "Ettehiyyâtü" },
    { type: "dua", id: "kunut_hanefi", label: "Kunut (Hanefî)" },
    { type: "dua", id: "kunut_shafii", label: "Kunut (Şâfiî)" },
    { type: "dua", id: "salli", label: "Salli" },
    { type: "dua", id: "barik", label: "Barik" },
    { type: "dua", id: "rabbenaantina", label: "Rabbena Âtinâ" },
    { type: "dua", id: "rabbenağfirli", label: "Rabbenağfirli" },
  ];

  const openItem = (item) => {
    setActiveItemType(item.type);
    if (item.type === "surah") setSelectedSurah(item.id);
    else setSelectedDua(item.id);
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className={`text-xl font-bold ${theme.textHeading}`}>{activeItem.name}</h3>
            <p className={`text-xs ${theme.textMuted}`}>İstediğiniz sure veya duayı listeden seçebilirsiniz.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isDark ? "bg-[#0e1b17] border-emerald-900" : "bg-slate-50 border-slate-200"}`}>
              <Search className="h-4 w-4 text-emerald-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara..." className="min-w-0 bg-transparent outline-none text-xs" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`rounded-2xl border px-3 py-2 text-xs font-semibold outline-none ${isDark ? "bg-[#0e1b17] border-emerald-900 text-white" : "bg-white border-slate-200 text-slate-800"}`}>
              <option value="usage">Kullanım sıklığı</option>
              <option value="length">Uzunluk</option>
              <option value="alphabetical">Alfabetik</option>
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-3xl p-3 sm:p-4 bg-emerald-500/5 border border-emerald-500/10">
          <div className="grid gap-4 lg:grid-cols-[0.55fr_0.45fr]">
            <div className={`rounded-3xl border p-5 ${isDark ? "bg-[#0e1b17] border-emerald-900/60" : "bg-white border-emerald-100"}`}>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Arapça Metin</div>
              <div className="mt-3 text-xl sm:text-2xl leading-relaxed text-right font-serif tracking-wide select-none" dir="rtl" style={{ fontFamily: "'Amiri', serif", lineHeight: 2.4 }}>
                {activeItem.arabic}
              </div>
            </div>

            <div className="space-y-3">
              <div className={`rounded-2xl border p-4 ${isDark ? "bg-[#0e1b17] border-emerald-900/60" : "bg-white border-emerald-100"}`}>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Türkçe Okunuş</div>
                <div className={`mt-2 text-sm leading-7 ${theme.textHeading}`}>{activeItem.translit}</div>
              </div>
              {activeItem.meaning && (
                <div className={`rounded-2xl border p-4 ${isDark ? "bg-[#0e1b17] border-emerald-900/60" : "bg-white border-emerald-100"}`}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Türkçe Meal</div>
                  <div className={`mt-2 text-sm leading-7 ${theme.textHeading}`}>{activeItem.meaning}</div>
                </div>
              )}
            </div>
          </div>

          {isSurah && (
            <div className={`mt-4 rounded-2xl border p-4 ${isDark ? "bg-[#0e1b17] border-emerald-900/60" : "bg-white border-emerald-100"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Ezber Durumu</div>
                  <div className={`mt-0.5 text-xs ${theme.textMuted}`}>Kendi ezber takibinizi işaretleyin.</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusMeta[activeStatus][1]}`}>{statusMeta[activeStatus][0]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => setSurahStatus(selectedSurah.id, "memorized")} className="rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition active:scale-95">Hafızada</button>
                <button onClick={() => setSurahStatus(selectedSurah.id, "in_progress")} className="rounded-xl border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition active:scale-95">Devam ediyor</button>
                <button onClick={() => setSurahStatus(selectedSurah.id, "not_started")} className="rounded-xl border border-slate-500/30 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-500/10 transition active:scale-95">Sıfırla</button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button onClick={() => addSurahRead(selectedSurah.id)} className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition active:scale-95">+1 Okuma Ekle</button>
                <div className={`rounded-xl px-4 py-2 text-xs font-bold ${isDark ? "bg-emerald-950 text-emerald-300" : "bg-slate-100 text-slate-700"}`}>Toplam: {progress[selectedSurah.id] || 0} Okuma</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <h4 className={`text-lg font-bold ${theme.textHeading}`}>Sure ve Dua Listesi</h4>
        <p className={`text-xs ${theme.textMuted}`}>Okumak istediğiniz sure veya duaya dokunun.</p>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {combinedMenu.map((item) => {
            const isActive = item.type === activeItemType && (item.type === "surah" ? item.id === selectedSurah.id : item.id === selectedDua.id);
            const count = item.type === "surah" ? (progress[item.id] || 0) : 0;
            return (
              <button key={`${item.type}-${item.id}`} onClick={() => openItem(item)} className={`rounded-2xl border p-3.5 text-left transition active:scale-98 ${isActive ? "border-emerald-500 bg-emerald-500/10 shadow-sm" : isDark ? "border-emerald-950 bg-[#0e1b17] hover:border-emerald-800" : "border-slate-200 bg-slate-50 hover:bg-white"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className={`text-sm font-bold ${theme.textHeading}`}>{item.label}</div>
                    <div className={`text-[10px] ${theme.textMuted}`}>{item.type === "surah" ? "Sure" : "Dua"}</div>
                  </div>
                  {item.type === "surah" ? <StatusBadge status={statuses[item.id] || (count >= 33 ? "memorized" : count > 0 ? "in_progress" : "not_started")} /> : <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">Dua</span>}
                </div>
                {item.type === "surah" && (
                  <>
                    <div className={`mt-2.5 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-emerald-950" : "bg-slate-200"}`}>
                      <div className="h-1.5 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${Math.min(100, (count / 33) * 100)}%` }} />
                    </div>
                    <div className={`mt-1.5 text-[10px] font-medium ${theme.textMuted}`}>Toplam: {count} okuma</div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TesbihatView({ state, tesbihatSteps, currentStep, currentStepCount, incTesbihatStep, prevTesbihatStep, completeTesbihat, setState, theme, isDark }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <h3 className={`text-xl font-bold ${theme.textHeading}`}>Namaz Tesbihatı</h3>
        <p className={`text-xs ${theme.textMuted}`}>Adım adım tesbihatınızı takip edin.</p>
        <div className={`mt-4 flex rounded-2xl p-1 border ${isDark ? "bg-[#0e1b17] border-emerald-900/60" : "bg-slate-100 border-slate-200"}`}>
          <button onClick={() => setState((s) => ({ ...s, tesbihatType: "short", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition ${state.tesbihatType === "short" ? "bg-emerald-700 text-white shadow-md" : theme.textMuted}`}>Kısa Tesbihat</button>
          <button onClick={() => setState((s) => ({ ...s, tesbihatType: "long", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition ${state.tesbihatType === "long" ? "bg-emerald-700 text-white shadow-md" : theme.textMuted}`}>Uzun Tesbihat</button>
        </div>
        <div className={`mt-4 rounded-2xl border p-4 ${theme.subCardBg}`}>
          <div className="text-xs font-bold text-amber-400">İlerleme</div>
          <div className={`mt-2 h-2.5 rounded-full overflow-hidden ${isDark ? "bg-emerald-950" : "bg-slate-200"}`}>
            <div className="h-2.5 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${((state.tesbihatIndex + 1) / tesbihatSteps.length) * 100}%` }} />
          </div>
          <div className={`mt-2 text-xs font-semibold ${theme.textHeading}`}>Adım {state.tesbihatIndex + 1} / {tesbihatSteps.length}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={prevTesbihatStep} className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition active:scale-95 ${isDark ? "border-emerald-900 text-emerald-300 hover:bg-emerald-900/20" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}><ChevronLeft className="h-4 w-4" /> Önceki</button>
          <button onClick={() => setState((s) => ({ ...s, tesbihatIndex: Math.min(tesbihatSteps.length - 1, s.tesbihatIndex + 1) }))} className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-600 transition active:scale-95"><ChevronRight className="h-4 w-4" /> Sonraki Adım</button>
        </div>
        <button onClick={completeTesbihat} className="mt-3 w-full rounded-2xl bg-amber-500 px-4 py-3 text-xs font-black text-slate-950 hover:bg-amber-400 transition active:scale-95 shadow-lg shadow-amber-500/10">Tesbihatı Tamamla</button>
      </div>

      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <div className={`rounded-2xl border p-4 ${theme.subCardBg}`}>
          <div className="text-xs font-bold text-amber-400">{state.tesbihatType === "short" ? "Kısa" : "Uzun"} Tesbihat · Adım {state.tesbihatIndex + 1}</div>
          <div className={`mt-1 text-2xl font-black ${theme.textHeading}`}>{currentStep.label}</div>
          <div className={`mt-1 text-xs ${theme.textMuted}`}>{currentStep.count > 1 ? `${currentStepCount} / ${currentStep.count}` : "Bu adım tek sefer okunur."}</div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className={`rounded-2xl border p-3.5 ${isDark ? "bg-[#0e1b17] border-emerald-900/40" : "bg-slate-50 border-slate-200"}`}><div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Okunuş</div><div className={`mt-1.5 text-xs leading-6 ${theme.textHeading}`}>{currentStep.title}</div></div>
          <div className={`rounded-2xl border p-3.5 ${isDark ? "bg-[#0e1b17] border-emerald-900/40" : "bg-slate-50 border-slate-200"}`}><div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Anlam</div><div className={`mt-1.5 text-xs leading-6 ${theme.textHeading}`}>{currentStep.meaning}</div></div>
          <div className={`rounded-2xl border p-3.5 ${isDark ? "bg-[#0e1b17] border-emerald-900/40" : "bg-slate-50 border-slate-200"}`}><div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Hedef</div><div className={`mt-1.5 text-xs leading-6 ${theme.textHeading}`}>{currentStep.count} Kez</div></div>
        </div>
        {currentStep.count > 1 ? (
          <div className="mt-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
            <div className="text-4xl font-black text-amber-400">{currentStepCount}/{currentStep.count}</div>
            <div className={`mt-1 text-xs ${theme.textMuted}`}>Her okumada dokunun.</div>
            <button onClick={incTesbihatStep} className="mt-4 w-full rounded-2xl bg-emerald-700 px-5 py-4 text-lg font-black text-white hover:bg-emerald-600 active:scale-90 transition duration-150 shadow-lg shadow-emerald-900/40">+1</button>
          </div>
        ) : (
          <div className={`mt-4 rounded-2xl border p-4 text-xs ${theme.subCardBg} ${theme.textMuted}`}>Sonraki adıma geçmek için üstteki butonla ilerleyebilirsiniz.</div>
        )}
      </div>
    </div>
  );
}

function ZikirView({ zikrData, selectedZikr, selectedZikrCount, target, selectZikr, addZikr, resetZikr, counts, theme, isDark }) {
  return (
    <div className="space-y-4">
      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className={`text-xl font-bold ${theme.textHeading}`}>Zikirmatik</h3>
            <p className={`text-xs ${theme.textMuted}`}>Titreşimli büyük zikir butonu.</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400">Hedef: {target}</div>
        </div>

        <div className={`mt-4 flex flex-col items-center justify-center rounded-[2.5rem] border p-6 transition ${isDark ? "bg-gradient-to-b from-[#0e1b17] to-[#08120f] border-emerald-900/50" : "bg-gradient-to-b from-emerald-50/50 to-emerald-100/30 border-emerald-100"}`}>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">Seçili Zikir</div>
          <div className={`mt-1 text-center text-2xl font-black ${theme.textHeading}`}>{selectedZikr.name}</div>
          <div className={`mt-0.5 text-xs ${theme.textMuted}`}>{selectedZikr.translit}</div>

          <button onClick={addZikr} className="mt-6 flex h-64 w-64 items-center justify-center rounded-full border-8 border-emerald-500/20 bg-emerald-700 text-white shadow-2xl shadow-emerald-900/50 transition-all duration-150 active:scale-90 sm:h-80 sm:w-80 hover:bg-emerald-600">
            <div className="text-center select-none">
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-200">Dokun</div>
              <div className="mt-1 text-6xl font-black leading-none sm:text-8xl text-amber-300">{selectedZikrCount}</div>
              <div className="mt-2 text-xs font-bold text-emerald-200">{selectedZikr.name}</div>
            </div>
          </button>

          <div className="mt-6 flex w-full max-w-md gap-2">
            <button onClick={resetZikr} className={`rounded-2xl border px-4 py-3 font-semibold text-xs transition active:scale-95 ${isDark ? "bg-[#0e1b17] border-emerald-900 text-emerald-300 hover:bg-emerald-900/20" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>Sıfırla</button>
            <div className={`flex-1 rounded-2xl border px-4 py-3 text-xs font-bold flex items-center justify-center ${theme.subCardBg} ${theme.textHeading}`}>
              Çekilen Zikir: {selectedZikrCount}
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <h4 className={`text-lg font-bold ${theme.textHeading}`}>Zikir Listesi</h4>
        <p className={`text-xs ${theme.textMuted}`}>Değiştirmek istediğiniz zikre dokunun.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {zikrData.map((z) => (
            <button key={z.id} onClick={() => selectZikr(z.id, z.defaultTarget)} className={`rounded-2xl border p-3.5 text-left transition active:scale-98 ${selectedZikr.id === z.id ? "border-emerald-500 bg-emerald-500/10" : isDark ? "bg-[#0e1b17] border-emerald-950 hover:border-emerald-800" : "bg-slate-50 border-slate-200 hover:bg-white"}`}>
              <div className={`font-bold text-sm ${theme.textHeading}`}>{z.name}</div>
              <div className="mt-1 text-right text-lg text-emerald-400 font-serif" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>{z.arabic}</div>
              <div className={`mt-1 text-xs ${theme.textMuted}`}>{z.translit}</div>
              <div className="mt-1.5 text-[10px] font-bold text-amber-400">Çekilen: {counts[z.id] || 0}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameView({ surah, surahList, setSelectedSurah, addXp, theme, isDark }) {
  const words = surah.translit.split(" ");
  const [hiddenIndices, setHiddenIndices] = useState([1, 3, 5, 8]);

  const toggleWord = (idx) => {
    triggerHaptic();
    setHiddenIndices((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
    addXp(2);
  };

  const revealAll = () => {
    triggerHaptic();
    setHiddenIndices([]);
  };

  const hideRandom = () => {
    triggerHaptic();
    const count = Math.floor(words.length / 3);
    const randoms = new Set();
    while (randoms.size < count) {
      randoms.add(Math.floor(Math.random() * words.length));
    }
    setHiddenIndices(Array.from(randoms));
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className={`text-xl font-bold ${theme.textHeading}`}>🎮 Ezber Testi Modu</h3>
            <p className={`text-xs ${theme.textMuted}`}>Bulanık kelimelere dokunarak hafızanı test et.</p>
          </div>
          <select value={surah.id} onChange={(e) => setSelectedSurah(e.target.value)} className={`rounded-2xl border px-3 py-2 text-xs font-bold outline-none ${isDark ? "bg-[#0e1b17] border-emerald-900 text-white" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
            {surahList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className={`mt-4 rounded-3xl border p-5 ${theme.subCardBg}`}>
          <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">{surah.name} - Türkçe Okunuş</div>
          <div className="flex flex-wrap gap-2 leading-8">
            {words.map((word, idx) => {
              const isHidden = hiddenIndices.includes(idx);
              return (
                <button key={idx} onClick={() => toggleWord(idx)} className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition active:scale-95 ${isHidden ? "bg-emerald-500/20 text-transparent blur-sm select-none hover:blur-none border border-emerald-500/30" : isDark ? "bg-[#0e1b17] border border-emerald-900 text-emerald-100" : "bg-white border border-slate-200 text-slate-900 shadow-sm"}`}>
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={revealAll} className="flex items-center gap-1.5 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition active:scale-95">
            <Eye className="h-4 w-4" /> Tümünü Göster
          </button>
          <button onClick={hideRandom} className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition active:scale-95 ${isDark ? "border-emerald-900 text-emerald-300 hover:bg-emerald-900/20" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
            <EyeOff className="h-4 w-4" /> Rastgele Gizle
          </button>
        </div>
      </div>
    </div>
  );
}

// XP, Seviye, Gems Detaylarının Taşındığı Yenilenmiş Profil Sayfası
function ProfileView({ state, prayerStreak, prayerSeries, logout, theme, isDark }) {
  const max = Math.max(5, ...prayerSeries.map((b) => b.count));
  const initials = state.username ? state.username.slice(0, 2).toUpperCase() : "U";
  const totalZikrs = Object.values(state.zikrCounts || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
        <div className="flex items-center gap-3 border-b border-emerald-500/10 pb-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-lg font-black text-amber-400">
            {initials}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${theme.textHeading}`}>{state.username}</h3>
            <p className={`text-xs ${theme.textMuted}`}>Kullanıcı Profili</p>
          </div>
        </div>

        {/* Ana Sayfadan Taşınan XP, Seviye, Gems İstatistiki Kartları */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <MiniStat label="XP" value={state.xp} icon={Zap} isDark={isDark} />
          <MiniStat label="Seviye" value={state.level} icon={Crown} isDark={isDark} />
          <MiniStat label="Gems" value={state.gems} icon={Gem} isDark={isDark} />
          <MiniStat label="Kaza" value={state.missedPrayers} icon={AlertTriangle} isDark={isDark} />
        </div>

        <div className="space-y-2.5">
          <ProfileLine label="Toplam XP" value={state.xp} theme={theme} />
          <ProfileLine label="Mevcut Seviye" value={state.level} theme={theme} />
          <ProfileLine label="Namaz Streak" value={`${prayerStreak} Gün`} theme={theme} />
          <ProfileLine label="Toplam Gems" value={state.gems} theme={theme} />
          <ProfileLine label="Toplam Çekilen Zikir" value={totalZikrs} theme={theme} />
        </div>
        <div className="mt-6">
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600/90 hover:bg-rose-600 px-4 py-3 font-bold text-xs text-white transition active:scale-95">
            <LogOut className="h-4 w-4" /> Çıkış Yap
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
          <h4 className={`text-lg font-bold ${theme.textHeading}`}>Başarımlar & Rozetler</h4>
          <p className={`text-xs ${theme.textMuted} mb-3`}>İbadet ve ezber hedeflerine ulaştıkça açılır.</p>
          <div className="grid grid-cols-2 gap-2">
            <Badge title="🥇 İlk Adım" desc="Sisteme kayıt olundu" active={true} theme={theme} />
            <Badge title="🔥 3 Günlük Seri" desc="3 Gün namaz kılındı" active={prayerStreak >= 3} theme={theme} />
            <Badge title="📿 Zikir Üstadı" desc="100+ Zikir çekildi" active={totalZikrs >= 100} theme={theme} />
            <Badge title="🏆 XP Avcısı" desc="100+ XP kazanıldı" active={state.xp >= 100} theme={theme} />
          </div>
        </div>

        <div className={`rounded-[2rem] border p-4 transition ${theme.cardBg}`}>
          <h4 className={`text-lg font-bold ${theme.textHeading}`}>Namaz Geçmişi</h4>
          <p className={`text-xs ${theme.textMuted}`}>Son 7 gün içindeki kılınan namaz verileri.</p>
          <div className="mt-4 space-y-3">
            {prayerSeries.map((b) => (
              <div key={b.date} className="grid grid-cols-[68px_1fr_28px] items-center gap-3">
                <div className={`text-xs font-medium ${theme.textMuted}`}>{b.date.slice(5)}</div>
                <div className={`h-3 overflow-hidden rounded-full ${isDark ? "bg-emerald-950" : "bg-slate-100"}`}>
                  <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${(b.count / max) * 100}%` }} />
                </div>
                <div className="text-right text-xs font-bold text-amber-400">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ title, desc, active, theme }) {
  return (
    <div className={`rounded-2xl border p-3 transition ${active ? "bg-emerald-500/10 border-emerald-500/30" : "opacity-40 border-slate-500/20"}`}>
      <div className={`font-bold text-xs ${theme.textHeading}`}>{title}</div>
      <div className={`text-[10px] mt-0.5 ${theme.textMuted}`}>{desc}</div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, isDark }) {
  return (
    <div className={`rounded-2xl border px-3 py-2 text-center transition ${isDark ? "bg-[#0e1b17] border-emerald-900/60" : "bg-slate-50 border-slate-200"}`}>
      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={`mt-0.5 font-black text-sm ${isDark ? "text-emerald-100" : "text-slate-900"}`}>{value}</div>
    </div>
  );
}

function ProfileLine({ label, value, theme }) {
  return (
    <div className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 ${theme.subCardBg}`}>
      <span className={`text-xs ${theme.textMuted}`}>{label}</span>
      <span className={`font-bold text-xs ${theme.textHeading}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    memorized: ["Hafızada", "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"],
    in_progress: ["Devam ediyor", "bg-amber-500/20 text-amber-300 border border-amber-500/30"],
    not_started: ["Sıfırlandı", "bg-slate-500/20 text-slate-300 border border-slate-500/30"],
  };
  const [label, style] = map[status] || map.not_started;
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${style}`}>{label}</span>;
}

export default App;
