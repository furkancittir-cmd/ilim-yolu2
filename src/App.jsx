import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crown,
  Gem,
  Home,
  Layers3,
  LogOut,
  Search,
  Sparkles,
  Trophy,
  User,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "ilim-yolu-v8";
const todayKey = () => new Date().toISOString().slice(0, 10);
const emptyPrayer = () => ({ sabah: false, ogle: false, ikindi: false, aksam: false, yatsi: false });

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
    arabic: `أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ
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
نَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ
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
  { id: "rabbenaatina", name: "Rabbena Âtinâ", arabic: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`, translit: `Rabbenâ âtinâ fid-dünyâ haseneten ve fil âhireti haseneten ve kınâ azâben nâr.`, meaning: `Rabbimiz! Bize dünyada iyilik, ahirette de iyilik ver ve bizi ateş azabından koru.` },
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
  const [activeItemType, setActiveItemType] = useState("surah");

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

      if (count === 5) {
        setCelebrate("Tüm vakit namazları tamamlandı! Maşallah.");
      }

      return {
        ...s,
        prayerDone: nextDone,
        prayerHistory: nextHistory.slice(-30),
        lastPrayerDate: t,
        xp: s.xp + (count === 5 ? 50 : 10),
        gems: s.gems + (count === 5 ? 2 : 0),
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
    setCelebrate("Tesbihat başarıyla tamamlandı!");
    setState((s) => ({ ...s, xp: s.xp + 50, gems: s.gems + 2, tesbihatIndex: 0, tesbihatProgress: [] }));
  }

  const selectedZikrCount = state.zikrCounts?.[state.zikrSelected] || 0;

  if (!state.auth) {
    return (
      <div className="min-h-screen bg-[#faf7f0] p-4 text-slate-900 flex items-center justify-center">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> İlim Yolu
          </div>
          <h1 className="mt-4 text-2xl font-black text-emerald-950">Giriş Yap</h1>
          <p className="mt-1 text-xs text-slate-500">Kişisel ibadet alanına erişmek için giriş yap.</p>
          {loginError && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600">{loginError}</div>}
          <div className="mt-4 space-y-3">
            <label className="block">
              <div className="mb-1 text-xs font-semibold">Kullanıcı adı</div>
              <input value={user} onChange={(e) => setUser(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            </label>
            <label className="block">
              <div className="mb-1 text-xs font-semibold">Şifre</div>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 transition">
              Giriş Yap
            </button>
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
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  <Sparkles className="h-4 w-4" /> İlim Yolu
                </div>
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

        {celebrate && (
          <div className="mb-4 flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Trophy className="h-5 w-5 text-amber-600" /> {celebrate}
            </div>
            <button onClick={() => setCelebrate("")} className="text-xs text-amber-700 font-bold hover:underline">Kapat</button>
          </div>
        )}

        {state.selectedTab === "home" && <HomeView state={state} todayCount={todayCount} prayerFinished={prayerFinished} prayerStreak={prayerStreak} prayerSeries={prayerSeries} markPrayer={markPrayer} markDuaRead={markDuaRead} />}
        {state.selectedTab === "sureler" && <SurahView selectedSurah={selectedSurah} selectedDua={selectedDua} filteredSurahs={filteredSurahs} search={search} setSearch={setSearch} sort={state.surahSort} setSort={(v) => setState((s) => ({ ...s, surahSort: v }))} progress={state.surahProgress} statuses={state.surahStatuses} setSelectedSurah={(id) => setState((s) => ({ ...s, selectedSurah: id }))} setSelectedDua={(id) => setState((s) => ({ ...s, selectedDua: id }))} setSurahStatus={setSurahStatus} addSurahRead={addSurahRead} activeItemType={activeItemType} setActiveItemType={setActiveItemType} />}
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
          <div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-3 rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${(todayCount / 5) * 100}%` }} />
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
              <button onClick={() => markDuaRead(state.selectedDua)} className="mt-2 rounded-xl bg-emerald-700 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-800 transition">
                Bu duayı okudum
              </button>
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
            <QuickAction label="Fâtiha Suresi oku" desc="Okuma ekranına git" onClick={() => setState((s) => ({ ...s, selectedTab: "sureler", selectedSurah: "fatiha" }))} />
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
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${(d.count / max) * 100}%` }} />
                  </div>
                  <div className="text-right text-xs font-semibold text-slate-700">{d.count}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-950">İpucu</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">Bu bölüm gerçek verilerinizle çalışır. Namaz işaretleyince streak ve grafik anlık güncellenir; zikir ve dua kayıtları da buraya yansır.</p>
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

function SurahView({ selectedSurah, selectedDua, filteredSurahs, search, setSearch, sort, setSort, progress, statuses, setSelectedSurah, setSelectedDua, setSurahStatus, addSurahRead, activeItemType, setActiveItemType }) {
  const isSurah = activeItemType === "surah";
  const activeItem = isSurah ? selectedSurah : (duaData.find((d) => d.id === selectedDua) || duaData[0]);

  const activeStatus = isSurah ? (statuses[selectedSurah.id] || "not_started") : "not_started";
  const statusMeta = {
    memorized: ["Hafızada", "bg-emerald-100 text-emerald-800"],
    in_progress: ["Devam ediyor", "bg-amber-100 text-amber-800"],
    not_started: ["Sıfırlandı", "bg-slate-100 text-slate-600"],
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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-emerald-950">{activeItem.name}</h3>
            <p className="text-sm text-slate-600">Aşağıdaki listeden seçim yapabilirsiniz.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2 text-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara..." className="min-w-0 bg-transparent outline-none" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border bg-white px-3 py-2 text-sm outline-none">
              <option value="usage">Kullanım sıklığı</option>
              <option value="length">Uzunluk</option>
              <option value="alphabetical">Alfabetik</option>
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-[2rem] border border-slate-100 bg-slate-50 p-3 sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[0.55fr_0.45fr]">
            {/* Tekleştirilmiş Arapça Kartı */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">Arapça Metin</div>
              <div className="mt-3 text-lg leading-10 text-slate-800 text-right font-serif" dir="rtl" style={{ lineHeight: 2.3 }}>
                {activeItem.arabic}
              </div>
            </div>

            {/* Okunuş ve Meal Kartı */}
            <div className="space-y-3 rounded-3xl bg-emerald-50 p-3 sm:p-4">
              <div className="rounded-2xl bg-white p-3 sm:p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">Türkçe Okunuş</div>
                <div className="mt-2 text-sm leading-7 text-slate-800 sm:text-base sm:leading-8">{activeItem.translit}</div>
              </div>
              {activeItem.meaning && (
                <div className="rounded-2xl bg-white p-3 sm:p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">Türkçe Meal</div>
                  <div className="mt-2 text-sm leading-7 text-slate-800 sm:text-base sm:leading-8">{activeItem.meaning}</div>
                </div>
              )}
            </div>
          </div>

          {isSurah && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">Ezber Durumu</div>
                  <div className="mt-1 text-xs text-slate-700 sm:text-sm">Durumu belirleyin</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusMeta[activeStatus][1]}`}>{statusMeta[activeStatus][0]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => setSurahStatus(selectedSurah.id, "memorized")} className="rounded-2xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 sm:px-4 sm:text-sm">Hafızada</button>
                <button onClick={() => setSurahStatus(selectedSurah.id, "in_progress")} className="rounded-2xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50 sm:px-4 sm:text-sm">Devam ediyor</button>
                <button onClick={() => setSurahStatus(selectedSurah.id, "not_started")} className="rounded-2xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50 sm:px-4 sm:text-sm">Sıfırla</button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button onClick={() => addSurahRead(selectedSurah.id)} className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition">+1 Okuma Ekle</button>
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Toplam: {progress[selectedSurah.id] || 0} okuma</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <h4 className="text-lg font-bold text-emerald-950">Sure ve Dua Listesi</h4>
        <p className="text-sm text-slate-500">Okumak veya durumunu değiştirmek istediğinize tıklayın.</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {combinedMenu.map((item) => {
            const isActive = item.type === activeItemType && (item.type === "surah" ? item.id === selectedSurah.id : item.id === selectedDua.id);
            const count = item.type === "surah" ? (progress[item.id] || 0) : 0;
            return (
              <button key={`${item.type}-${item.id}`} onClick={() => openItem(item)} className={`rounded-3xl border p-3 text-left transition sm:p-4 ${isActive ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-white"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900 sm:text-base">{item.label}</div>
                    <div className="text-[11px] text-slate-500 sm:text-xs">{item.type === "surah" ? "Sure" : "Dua"}</div>
                  </div>
                  {item.type === "surah" ? <StatusBadge status={statuses[item.id] || (count >= 33 ? "memorized" : count > 0 ? "in_progress" : "not_started")} /> : <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Dua</span>}
                </div>
                {item.type === "surah" && (
                  <>
                    <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-2 rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${Math.min(100, (count / 33) * 100)}%` }} />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 sm:text-xs">Toplam: {count} okuma</div>
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

function TesbihatView({ state, tesbihatSteps, currentStep, currentStepCount, incTesbihatStep, prevTesbihatStep, completeTesbihat, setState }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <h3 className="text-xl font-bold text-emerald-950">Namaz Tesbihatı</h3>
        <p className="text-sm text-slate-600">Adım adım namaz tesbihatınızı takip edin.</p>
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1">
          <button onClick={() => setState((s) => ({ ...s, tesbihatType: "short", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${state.tesbihatType === "short" ? "bg-white shadow" : "text-slate-600"}`}>Kısa Tesbihat</button>
          <button onClick={() => setState((s) => ({ ...s, tesbihatType: "long", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${state.tesbihatType === "long" ? "bg-white shadow" : "text-slate-600"}`}>Uzun Tesbihat</button>
        </div>
        <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-900">İlerleme</div>
          <div className="mt-2 h-3 rounded-full bg-white overflow-hidden">
            <div className="h-3 rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${((state.tesbihatIndex + 1) / tesbihatSteps.length) * 100}%` }} />
          </div>
          <div className="mt-2 text-sm text-emerald-900">Adım {state.tesbihatIndex + 1} / {tesbihatSteps.length}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={prevTesbihatStep} className="flex items-center gap-2 rounded-2xl border px-4 py-2 font-semibold hover:bg-slate-50"><ChevronLeft className="h-4 w-4" /> Önceki</button>
          <button onClick={() => setState((s) => ({ ...s, tesbihatIndex: Math.min(tesbihatSteps.length - 1, s.tesbihatIndex + 1) }))} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-4 text-base font-semibold text-white hover:bg-emerald-800 transition md:w-auto md:text-lg"><ChevronRight className="h-5 w-5" /> Sonraki Adım</button>
        </div>
        <button onClick={completeTesbihat} className="mt-4 w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-100 hover:bg-amber-600 transition">Tesbihatı Tamamla</button>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="rounded-3xl bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-emerald-800">{state.tesbihatType === "short" ? "Kısa" : "Uzun"} Tesbihat · Adım {state.tesbihatIndex + 1}</div>
          <div className="mt-2 text-2xl font-black text-emerald-950">{currentStep.label}</div>
          <div className="mt-2 text-sm text-slate-600">{currentStep.count > 1 ? `${currentStepCount} / ${currentStep.count}` : "Bu adım tek sefer okunur."}</div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Okunuş</div><div className="mt-2 text-sm leading-7 text-slate-800">{currentStep.title}</div></div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Anlam</div><div className="mt-2 text-sm leading-7 text-slate-800">{currentStep.meaning}</div></div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Hedef</div><div className="mt-2 text-sm leading-7 text-slate-800">{currentStep.count} Kez</div></div>
        </div>
        {currentStep.count > 1 ? (
          <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-center">
            <div className="text-4xl font-black text-emerald-700">{currentStepCount}/{currentStep.count}</div>
            <div className="mt-2 text-sm text-slate-600">Her okumada tuşa basın.</div>
            <button onClick={incTesbihatStep} className="mt-4 w-full rounded-2xl bg-emerald-700 px-5 py-4 text-lg font-semibold text-white hover:bg-emerald-800 active:scale-[0.99] transition">+1</button>
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Sonraki adıma geçmek için üstteki butonla ilerleyebilirsiniz.</div>
        )}
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
            <p className="text-sm text-slate-600">Büyük buton, sade arayüz.</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">Hedef: {target}</div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center rounded-[2.5rem] bg-[radial-gradient(circle_at_top,_#eefaf2,_#dff3e6_60%,_#cfe9da)] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-900">Seçili Zikir</div>
          <div className="mt-2 text-center text-2xl font-black text-emerald-950">{selectedZikr.name}</div>
          <div className="mt-1 text-sm text-slate-700">{selectedZikr.translit}</div>

          <button onClick={addZikr} className="mt-6 flex h-64 w-64 items-center justify-center rounded-full border-8 border-white bg-emerald-700 text-white shadow-2xl shadow-emerald-200 transition active:scale-[0.96] sm:h-80 sm:w-80">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100">Dokun</div>
              <div className="mt-2 text-6xl font-black leading-none sm:text-8xl">{selectedZikrCount}</div>
              <div className="mt-2 text-sm font-semibold text-emerald-100 sm:text-lg">{selectedZikr.name}</div>
            </div>
          </button>

          <div className="mt-6 flex w-full max-w-md gap-2">
            <button onClick={resetZikr} className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-semibold text-slate-800 hover:bg-white transition">Sıfırla</button>
            <div className="flex-1 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-700 font-semibold flex items-center justify-center">
              Sayaç: {selectedZikrCount}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-lg font-bold text-emerald-950">Zikir Listesi</h4>
        <p className="text-sm text-slate-500">Değiştirmek istediğiniz zikre dokunun.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {zikrData.map((z) => (
            <button key={z.id} onClick={() => selectZikr(z.id, z.defaultTarget)} className={`rounded-3xl border p-4 text-left transition ${selectedZikr.id === z.id ? "border-emerald-500 bg-emerald-50" : "bg-slate-50 hover:bg-white"}`}>
              <div className="font-semibold text-slate-900">{z.name}</div>
              <div className="mt-1 text-right text-lg text-slate-800 font-serif" dir="rtl">{z.arabic}</div>
              <div className="mt-1 text-sm text-slate-600">{z.translit}</div>
              <div className="mt-2 text-xs font-semibold text-emerald-700">Çekilen: {counts[z.id] || 0}</div>
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
            <p className="text-xs text-slate-500">Profil Bilgileri</p>
          </div>
        </div>
        <div className="space-y-3">
          <ProfileLine label="Toplam XP" value={state.xp} />
          <ProfileLine label="Seviye" value={state.level} />
          <ProfileLine label="Namaz Streak" value={`${prayerStreak} Gün`} />
          <ProfileLine label="Gems" value={state.gems} />
          <ProfileLine label="Kaza Namazı" value={state.missedPrayers} />
        </div>
        <div className="mt-6">
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700 transition">
            <LogOut className="h-4 w-4" /> Çıkış Yap
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-lg font-bold text-emerald-950">Namaz Geçmişi</h4>
          <p className="text-sm text-slate-500">Son 7 gün içindeki kılınan namaz verileri.</p>
          <div className="mt-4 space-y-3">
            {prayerSeries.map((b) => (
              <div key={b.date} className="grid grid-cols-[68px_1fr_28px] items-center gap-3">
                <div className="text-xs text-slate-500">{b.date.slice(5)}</div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${(b.count / max) * 100}%` }} />
                </div>
                <div className="text-right text-xs font-semibold text-slate-700">{b.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-lg font-bold text-emerald-950">Bugünkü Etkinlikler</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <ProfileLine label="Tamamlanan Zikir Türü" value={(state.dailyLogs?.date === todayKey() && state.dailyLogs?.zikrs?.length) || 0} />
            <ProfileLine label="Okunan Dua Türü" value={(state.dailyLogs?.date === todayKey() && state.dailyLogs?.duas?.length) || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5 text-emerald-700" /> {label}
      </div>
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

export default App; 
