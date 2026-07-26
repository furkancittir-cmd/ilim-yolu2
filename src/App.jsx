import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
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
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Volume2,
  Zap,
  AlertTriangle,
  Medal,
} from "lucide-react";

const STORAGE_KEY = "ilim-yolu-v5-furkan";

const surahData = [
  {
    id: "fatiha",
    name: "Fâtiha Suresi",
    shortName: "Fâtiha",
    verses: 7,
    usage: 10,
    status: "memorized",
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
    usage: 8,
    status: "in_progress",
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
    usage: 8,
    status: "memorized",
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
    usage: 7,
    status: "not_started",
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
    usage: 9,
    status: "memorized",
    arabicTitle: "الكوثر",
    arabic: `إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ\nفَصَلِّ لِرَبِّكَ وَانْحَرْ\nإِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ`,
    translit: `İnnâ a'taynâke'l-kevser. Fe salli lirabbike venhar. İnne şâni'eke huve'l-ebter.`,
    meaning: `Biz sana Kevser’i verdik. O hâlde Rabbin için namaz kıl ve kurban kes. Asıl sonu kesik olan, sana kin tutandır.`,
  },
  {
    id: "kafirun",
    name: "Kâfirûn Suresi",
    shortName: "Kâfirûn",
    verses: 6,
    usage: 8,
    status: "in_progress",
    arabicTitle: "الكافرون",
    arabic: `قُلْ يَا أَيُّهَا الْكَافِرُونَ\nلَا أَعْبُدُ مَا تَعْبُدُونَ\nوَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ\nوَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ\nوَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ\nلَكُمْ دِينُكُمْ وَلِيَ دِينِ`,
    translit: `Kul yâ eyyühel kâfirûn. Lâ a'budu mâ ta'budûn. Ve lâ entüm âbidûne mâ a'bud. Ve lâ ene âbidun mâ abedtüm. Ve lâ entüm âbidûne mâ a'bud. Leküm dînüküm ve liye dîn.`,
    meaning: `De ki: Ey kâfirler! Sizin taptığınıza ben tapmam. Siz de benim tapacağıma tapmazsınız. Ben sizin taptığınıza tapacak değilim. Siz de benim tapacağıma tapacak değilsiniz. Sizin dininiz size, benim dinim bana.`,
  },
  {
    id: "nasr",
    name: "Nasr Suresi",
    shortName: "Nasr",
    verses: 3,
    usage: 8,
    status: "memorized",
    arabicTitle: "النصر",
    arabic: `إِذَا جَاءَ نَصْرُ اللّٰهِ وَالْفَتْحُ\nوَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللّٰهِ أَفْوَاجًا\nفَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا`,
    translit: `İzâ câe nasrullâhi vel feth. Ve raeyten nâse yedhulûne fî dînillâhi efvâcâ. Fe sebbih bihamdi rabbike vestagfirh. İnnehû kâne tevvâbâ.`,
    meaning: `Allah’ın yardımı ve fetih geldiği zaman; insanların Allah’ın dinine gruplar hâlinde girdiklerini gördüğünde, Rabbini hamd ile tesbih et ve O’ndan bağışlanma dile. Şüphesiz O, tevbeleri çok kabul edendir.`,
  },
  {
    id: "tebbet",
    name: "Tebbet / Leheb Suresi",
    shortName: "Tebbet",
    verses: 5,
    usage: 7,
    status: "not_started",
    arabicTitle: "المسد",
    arabic: `تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ\nمَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ\nسَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ\nوَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ\nفِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ`,
    translit: `Tebbet yedâ Ebî Lehebin ve tabb. Mâ ağnâ anhu mâluhû ve mâ keseb. Seyaslâ nâran zâte leheb. Vemraetühû hammâletel hatab. Fî cîdihâ hablün min mesed.`,
    meaning: `Ebu Leheb’in elleri kurusun! Kendisi de kurudu. Malı ve kazandığı ona fayda vermedi. O, alevli bir ateşe girecektir. Karısı da odun taşıyacaktır. Boynunda bükülmüş ipten bir halat olacak.`,
  },
  {
    id: "ihlas",
    name: "İhlâs Suresi",
    shortName: "İhlâs",
    verses: 4,
    usage: 10,
    status: "memorized",
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
    usage: 9,
    status: "memorized",
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
    usage: 9,
    status: "memorized",
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
    usage: 10,
    status: "in_progress",
    arabicTitle: "آية الكرسي",
    arabic: `اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ\nلَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ\nلَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ\nمَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ\nيَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ\nوَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ\nوَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ\nوَلَا يَئُودُهُ حِفْظُهُمَا\nوَهُوَ الْعَلِيُّ الْعَظِيمُ`,
    translit: `Allâhu lâ ilâhe illâ hüve'l-hayyü'l-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fil ard. Menzellezî yeşfeu indehû illâ bi iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehum. Ve lâ yuhîtûne bi şey'in min ilmihî illâ bimâ şâe. Vesi'a kürsiyyühüs-semâvâti vel ard. Ve lâ yeûdühû hıfzuhumâ. Ve huvel aliyyül azîm.`,
    meaning: `Allah; O’ndan başka ilâh yoktur, diridir, kayyumdur. Onu ne uyuklama tutar ne uyku. Göklerde ve yerde ne varsa O’nundur. İzni olmadan O’nun katında kim şefaat edebilir? Önlerindekini ve arkalarındakini bilir. O’nun ilminden, dilediği kadarından başka hiçbir şeyi kuşatamazlar. Kürsüsü gökleri ve yeri kaplamıştır. Onları koruyup gözetmek O’na ağır gelmez. O yücedir, büyüktür.`,
  },
  {
    id: "bakarafirst5",
    name: "Bakara İlk 5 Ayet",
    shortName: "Bakara 1-5",
    verses: 5,
    usage: 6,
    status: "not_started",
    arabicTitle: "البقرة",
    arabic: `الم\nذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ\nالَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ\nوَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ\nأُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ`,
    translit: `Elif lâm mîm. Zâlikel kitâbu lâ raybe fîh, huden lil müttekîn. Ellezîne yü'minûne bil gaybi ve yukîmûnes salâte ve mimmâ razaknâhum yünfikûn. Vellezîne yü'minûne bimâ unzile ileyke ve mâ unzile min kablike vebil âhirati hum yûkınûn. Ulâike alâ hüdem mir rabbihim ve ulâike humul muflihûn.`,
    meaning: `Elif Lâm Mîm. İşte bu Kitap, onda hiçbir şüphe yoktur; takvâ sahipleri için bir rehberdir. Onlar gayba iman eder, namazı dosdoğru kılar ve kendilerine verdiğimiz rızıktan Allah yolunda harcarlar. Onlar sana indirilene ve senden önce indirilene iman eder; ahirete de kesin olarak inanırlar. İşte onlar Rablerinden bir doğru yol üzeredirler ve kurtuluşa erenler onlardır.`,
  },
  {
    id: "kunut_hanefi",
    name: "Kunut Duası (Hanefî)",
    shortName: "Kunut Hanefî",
    verses: 1,
    usage: 8,
    status: "not_started",
    arabicTitle: "دعاء القنوت",
    arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ`,
    translit: `Allâhümme innâ nesteînüke ve nestağfirüke ve nü'minü bike ve netevekkelu aleyke ve nüsnî aleykel hayra ve neşküruke ve lâ nekfüruke ve nahleu ve netrukü men yefcüruk.`,
    meaning: `Allah’ım! Senden yardım isteriz, bağışlanma dileriz, Sana iman ederiz, Sana dayanırız. Sana hayır ile hamd eder, Sana şükrederiz. Sana nankörlük etmeyiz. Sana isyan edeni terk ederiz.`,
  },
  {
    id: "kunut_shafii",
    name: "Kunut Duası (Şâfiî)",
    shortName: "Kunut Şâfiî",
    verses: 1,
    usage: 8,
    status: "not_started",
    arabicTitle: "دعاء القنوت",
    arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ`,
    translit: `Allâhümmehdinî fîmen hedeyt. Ve âfinî fîmen âfeyt. Ve tevellenî fîmen tevelleyt. Ve bârik lî fîmâ a'tayt. Ve kinî şerre mâ kadayt.`,
    meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver. Afiyet verdiklerin arasında bana da afiyet ver. Dost edindiklerin arasında beni de dost edin. Bana verdiğin şeylerde bereket ver. Hükmettiğin şeylerin şerrinden beni koru.`,
  },
  {
    id: "inshirah",
    name: "İnşirah Suresi",
    shortName: "İnşirah",
    verses: 8,
    usage: 6,
    status: "not_started",
    arabicTitle: "الشرح",
    arabic: `أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ\nوَوَضَعْنَا عَنكَ وِزْرَكَ\nالَّذِي أَنْقَضَ ظَهْرَكَ\nوَرَفَعْنَا لَكَ ذِكْرَكَ\nفَإِنَّ مَعَ الْعُسْرِ يُسْرًا\nإِنَّ مَعَ الْعُسْرِ يُسْرًا\nفَإِذَا فَرَغْتَ فَانصَبْ\nوَإِلَىٰ رَبِّكَ فَارْغَبْ`,
    translit: `Elem neşrah leke sadrak. Ve vedana anke vizrak. Ellezî enkada zahrak. Ve refa'nâ leke zikrak. Fe inne me'al usri yusrâ. İnne me'al usri yusrâ. Fe izâ feragta fensab. Ve ilâ rabbike ferğab.`,
    meaning: `Senin göğsünü açıp genişletmedik mi? Sırtını ezen yükünü kaldırmadık mı? Senin için şöhretini yükseltmedik mi? Şüphesiz zorlukla beraber bir kolaylık vardır. Evet, gerçekten zorlukla beraber bir kolaylık vardır. O hâlde boş kaldığında yeni bir işe koyul ve yalnız Rabbine yönel.`,
  },
  {
    id: "duha",
    name: "Duha Suresi",
    shortName: "Duha",
    verses: 11,
    usage: 6,
    status: "not_started",
    arabicTitle: "الضحى",
    arabic: `وَالضُّحَى\nوَاللَّيْلِ إِذَا سَجَىٰ\nمَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ\nوَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ\nوَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ\nأَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ\nوَوَجَدَكَ ضَالًّا فَهَدَىٰ\nوَوَجَدَكَ عَائِلًا فَأَغْنَىٰ\nفَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ\nوَأَمَّا السَّائِلَ فَلَا تَنْهَرْ\nوَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ`,
    translit: `Ved duhâ. Velleyli izâ seca. Mâ veddeake rabbüke ve mâ kalâ. Ve lel âhiratu hayrun leke minel ûlâ. Ve lesevfe yu'tîke rabbüke fe terdâ. Elem yecidke yetîmen fe âvâ. Ve vecedeke dâllen fe hedâ. Ve vecedeke âilen fe ağnâ. Fe emmâl yetîme fe lâ takher. Ve emmâs sâile fe lâ tenher. Ve emmâ bi ni'meti rabbike fe haddis.`,
    meaning: `Kuşluk vaktine andolsun; sakinleşen geceye andolsun ki Rabbin seni terk etmedi, sana darılmadı. Elbette ahiret senin için dünyadan daha hayırlıdır. Rabbin sana verecek de sen hoşnut olacaksın. Seni yetim bulup barındırmadı mı? Seni yolunu ararken doğru yola iletmedi mi? Seni muhtaç bulup zenginleştirmedi mi? O hâlde yetimi ezme, isteyeni azarlama, Rabbinin nimetini anlat.`,
  },
  {
    id: "asr",
    name: "Asr Suresi",
    shortName: "Asr",
    verses: 3,
    usage: 9,
    status: "memorized",
    arabicTitle: "العصر",
    arabic: `وَالْعَصْرِ\nإِنَّ الْإِنسَانَ لَفِي خُسْرٍ\nإِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ`,
    translit: `Vel asr. İnnel insâne lefî husr. İllellezîne âmenû ve amilüs sâlihâti ve tevâsav bil hakkı ve tevâsav bis sabr.`,
    meaning: `Asra andolsun ki insan gerçekten ziyandadır. Ancak iman edip salih amel işleyenler, hakkı tavsiye edenler ve sabrı tavsiye edenler bunun dışındadır.`,
  },
  {
    id: "kadr",
    name: "Kadr Suresi",
    shortName: "Kadr",
    verses: 5,
    usage: 7,
    status: "not_started",
    arabicTitle: "القدر",
    arabic: `إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ\nوَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ\nلَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ\nتَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِّن كُلِّ أَمْرٍ\nسَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ`,
    translit: `İnnâ enzelnâhü fî leyletil kadr. Ve mâ edrâke mâ leyletül kadr. Leyletül kadri hayrun min elfi şehr. Tenezzelül melâiketü ver-rûhu fîhâ bi izni rabbihim min külli emr. Selâmün hiye hattâ matlai'l fecr.`,
    meaning: `Şüphesiz biz onu Kadir gecesinde indirdik. Kadir gecesinin ne olduğunu sen nasıl bileceksin? Kadir gecesi bin aydan hayırlıdır. Melekler ve Ruh, o gece Rablerinin izniyle her iş için iner. O gece tan yeri ağarıncaya kadar esenliktir.`,
  },
  {
    id: "zilzal",
    name: "Zilzal Suresi",
    shortName: "Zilzal",
    verses: 8,
    usage: 5,
    status: "not_started",
    arabicTitle: "الزلزلة",
    arabic: `إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا\nوَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا\nوَقَالَ الْإِنسَانُ مَا لَهَا\nيَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا\nبِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا\nيَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ\nفَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ\nوَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ`,
    translit: `İzâ zülzilatil ardu zilzâlehâ. Ve ahrecetil ardu eksâlehâ. Ve kalel insânu mâ lehâ. Yevme izin tühaddisü ahbârehâ. Bi enne rabbeke evhâ lehâ. Yevme izin yasdürun nâsü eştâten liyürav a'mâlehüm. Fe men ya'mel miskâle zerretin hayran yerah. Ve men ya'mel miskâle zerretin şerran yerah.`,
    meaning: `Yer sarsılıp sarsıntısını dışarı attığında, ağırlıklarını dışarı çıkardığında ve insan “Buna ne oluyor?” dediğinde yer o gün haberlerini anlatır. Çünkü Rabbin ona bunu vahyetmiştir. O gün insanlar amellerini görmek üzere dağınık gruplar hâlinde çıkacaklardır. Kim zerre kadar hayır işlerse onu görür; kim zerre kadar şer işlerse onu görür.`,
  },
  {
    id: "beyyine",
    name: "Beyyine Suresi",
    shortName: "Beyyine",
    verses: 8,
    usage: 5,
    status: "not_started",
    arabicTitle: "البينة",
    arabic: `لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ\nرَسُولٌ مِّنَ اللّٰهِ يَتْلُو صُحُفًا مُّطَهَّرَةً\nفِيهَا كُتُبٌ قَيِّمَةٌ\nوَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِن بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ\nوَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللّٰهَ مُخْلِصِينَ لَهُ الدِّينَ\nحُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ وَذَٰلِكَ دِينُ الْقَيِّمَةِ\nإِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ فِي نَارِ جَهَنَّمَ\nأُولَٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ`,
    translit: `Lem yekünillezîne keferû min ehli'l kitâbi vel müşrikîne munfekkîn hattâ te'tiyehümül beyyine. Rasûlün minallâhi yetlû suhufen mutahharah. Fîhâ kütübün kayyimeh. Ve mâ teferrakellezîne ûtül kitâbe illâ min ba'di mâ câetühümül beyyine. Ve mâ ümirû illâ li ya'budûllâhe muhlisîne lehüd dîn. Hunefâe ve yukîmûs salâte ve yü'tüz zekâte ve zâlike dînül kayyimeh. İnnellezîne keferû min ehli'l kitâbi vel müşrikîne fî nâri cehenneme. Ulâike hum şerrül beriyyeh.`,
    meaning: `Ehl-i kitaptan ve müşriklerden inkâr edenler, kendilerine açık delil gelinceye kadar ayrılıp gitmezlerdi. Allah’tan bir elçi, tertemiz sayfalar okur; içinde doğru hükümler vardır. Kendilerine kitap verilenler, ancak açık delil geldikten sonra ayrılığa düştüler. Oysa onlara sadece dini Allah için hâlis kılarak O’na kulluk etmeleri, namazı kılmaları ve zekâtı vermeleri emredilmişti. İşte dosdoğru din budur.`,
  },
  {
    id: "alak",
    name: "Alak Suresi",
    shortName: "Alak",
    verses: 19,
    usage: 4,
    status: "not_started",
    arabicTitle: "العلق",
    arabic: `اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ\nخَلَقَ الْإِنسَانَ مِنْ عَلَقٍ\nاقْرَأْ وَرَبُّكَ الْأَكْرَمُ\nالَّذِي عَلَّمَ بِالْقَلَمِ\nعَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ\nكَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ\nأَنْ رَّآهُ اسْتَغْنَىٰ\nإِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ\nأَرَأَيْتَ الَّذِي يَنْهَىٰ\nعَبْدًا إِذَا صَلَّىٰ\nأَرَأَيْتَ إِن كَانَ عَلَى الْهُدَىٰ\nأَوْ أَمَرَ بِالتَّقْوَىٰ\nأَرَأَيْتَ إِن كَذَّبَ وَتَوَلَّىٰ\nأَلَمْ يَعْلَمْ بِأَنَّ اللّٰهَ يَرَىٰ\nكَلَّا لَئِن لَّمْ يَنتَهِ لَنَسْفَعًا بِالنَّاصِيَةِ\nنَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ\nفَلْيَدْعُ نَادِيَهُ\nسَنَدْعُ الزَّبَانِيَةَ\nكَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِب`,
    translit: `İkra bismi rabbikellezî halak. Halakal insâne min alak. İkra ve rabbükel ekrem. Ellezî allame bil kalem. Allamel insâne mâ lem ya'lem. Kellâ innel insâne le yattğâ. En raâhustağnâ. İnne ilâ rabbiker ruc'â. Eraeytellezî yenhâ. Abden izâ sallâ. Eraeyte in kâne alel hüdâ. Ev emera bit takvâ. Eraeyte in kezzebe ve tevellâ. Elem ya'lem bi enne'llâhe yerâ. Kellâ lein lem yentehi le nesfe'an binnâsiyeh. Nâsiyetin kâzibetin hâti'ah. Felyed'u nâdiyah. Sened'uz zebâniyah. Kellâ lâ tuti'hu vescud vakterib.`,
    meaning: `Yaratan Rabbinin adıyla oku. İnsanı alaktan yarattı. Oku! Rabbin sonsuz kerem sahibidir. Kalemle öğreten O’dur. İnsana bilmediğini öğretti. Hayır! İnsan gerçekten azgınlık eder. Kendini yeterli görünce. Şüphesiz dönüş yalnız Rabbinedir. Görmedin mi o engelleyeni; bir kulu namaz kılarken. Ya o kul doğru yolda ise? Ya da takvayı emrediyorsa? Görmedin mi yalanlayıp yüz çevireni? Allah’ın gördüğünü bilmiyor mu? Hayır, vazgeçmezse onu perçeminden yakalayacağız; yalancı, günahkâr perçemden. O zaman topluluğunu çağırsın. Biz de zebânîleri çağıracağız. Sakın ona uyma; secde et ve yaklaş.`,
  },
  {
    id: "tin",
    name: "Tîn Suresi",
    shortName: "Tîn",
    verses: 8,
    usage: 4,
    status: "not_started",
    arabicTitle: "التين",
    arabic: `وَالتِّينِ وَالزَّيْتُونِ\nوَطُورِ سِينِينَ\nوَهَٰذَا الْبَلَدِ الْأَمِينِ\nلَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ\nثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ\nإِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ\nفَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ\nأَلَيْسَ اللّٰهُ بِأَحْكَمِ الْحَاكِمِينَ`,
    translit: `Vetteyni vez zeytûn. Ve tûri sînîn. Ve hâzel beledil emîn. Lekad halaknâl insâne fî ahseni takvîm. Sümme redednâhu esfela sâfilîn. İllellezîne âmenû ve amilüs sâlihâti fe lehüm ecrun ğayru memnûn. Femâ yukezzibuke ba'dü bid dîn. Eleyse'llâhu bi ahkemil hâkimîn.`,
    meaning: `İncire ve zeytine, Sina Dağı’na, bu emin şehre andolsun ki insanı en güzel biçimde yarattık; sonra onu aşağıların aşağısına çevirdik. Ancak iman edip salih amel işleyenler müstesna; onlar için kesintisiz bir mükâfat vardır. Bundan sonra seni ne din konusunda yalanlatabilir? Allah hükmedenlerin en iyisi değil midir?`,
  },
  {
    id: "humeze",
    name: "Hümeze Suresi",
    shortName: "Hümeze",
    verses: 9,
    usage: 4,
    status: "not_started",
    arabicTitle: "الهمزة",
    arabic: `وَيْلٌ لِكُلِّ هُمَزَةٍ لُّمَزَةٍ\nالَّذِي جَمَعَ مَالًا وَعَدَّدَهُ\nيَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ\nكَلَّا لَيُنْبَذَنَّ فِي الْحُطَمَةِ\nوَمَا أَدْرَاكَ مَا الْحُطَمَةُ\nنَارُ اللّٰهِ الْمُوقَدَةُ\nالَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ\nإِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ\nفِي عَمَدٍ مُّمَدَّدَةٍ`,
    translit: `Veylün likülli hümezetin lümeze. Ellezî cemea mâlen ve addedeh. Yahsebü enne mâlehu ahledeh. Kellâ leyünbezenne fil hutameh. Ve mâ edrâke mâl hutameh. Nârullâhil mûkadeh. Elle tî tattaliu alel efideh. İnnehâ aleyhim mu'sadeh. Fî amedin memeddedeh.`,
    meaning: `İnsanları arkadan çekiştiren, kusur arayan herkesin vay hâline! O, mal biriktirip onu saydıkça sayandır. Malının kendisini ebedî kılacağını sanır. Hayır! O, Hutame’ye atılacaktır. Hutame’nin ne olduğunu sana bildiren ne? Allah’ın tutuşturulmuş ateşi! O, gönüllerin ta içine işler. Onlar üzerine kapatılmıştır, uzatılmış direkler arasında.`,
  },
  {
    id: "tekasur",
    name: "Tekâsür Suresi",
    shortName: "Tekâsür",
    verses: 8,
    usage: 5,
    status: "not_started",
    arabicTitle: "التكاثر",
    arabic: `أَلْهَاكُمُ التَّكَاثُرُ\nحَتَّىٰ زُرْتُمُ الْمَقَابِرَ\nكَلَّا سَوْفَ تَعْلَمُونَ\nثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ\nكَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ\nلَتَرَوُنَّ الْجَحِيمَ\nثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ\nثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ`,
    translit: `Elhâkümüt tekâsür. Hattâ zürtümül mekâbir. Kellâ sevfe ta'lemûn. Sümme kellâ sevfe ta'lemûn. Kellâ lev ta'lemûne ilmel yakîn. Le teravünnel cahîm. Sümme le teravünnehâ aynel yakîn. Sümme le tus'elünne yevme izin anin naîm.`,
    meaning: `Çokluk yarışı sizi oyaladı; ta ki kabirleri ziyaret edinceye kadar. Hayır! Yakında bileceksiniz. Sonra yine hayır, yakında bileceksiniz. Keşke kesin bilgiyle bilseydiniz! Cehennemi mutlaka göreceksiniz. Sonra onu gözle görür gibi göreceksiniz. Sonra o gün nimetlerden mutlaka sorgulanacaksınız.`,
  },
  {
    id: "karia",
    name: "Kâria Suresi",
    shortName: "Kâria",
    verses: 11,
    usage: 4,
    status: "not_started",
    arabicTitle: "القارعة",
    arabic: `الْقَارِعَةُ\nمَا الْقَارِعَةُ\nوَمَا أَدْرَاكَ مَا الْقَارِعَةُ\nيَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ\nوَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنفُوشِ\nفَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ\nفَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ\nوَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ\nفَأُمُّهُ هَاوِيَةٌ\nوَمَا أَدْرَاكَ مَا هِيَهْ\nنَارٌ حَامِيَةٌ`,
    translit: `El kâriah. Mâl kâriah. Ve mâ edrâke mâl kâriah. Yevme yekûnün nâsu kel ferâşil mebthûş. Ve tekûnül cibâlu kel ıhnil menfûş. Fe emmâ men sekulet mevâzînüh. Fe huve fî ışıetin râdiyeh. Ve emmâ men hafvet mevâzînüh. Fe ümmühû hâviyeh. Ve mâ edrâke mâ hiyeh. Nârün hâmiyeh.`,
    meaning: `Kıyameti çarpan büyük felaket! Kıyametin ne olduğunu sana ne bildirdi? O gün insanlar dağılmış pervaneler gibi olur. Dağlar atılmış renkli yün gibi olur. Kimin tartıları ağır gelirse, o hoşnut bir hayat içindedir. Kimin tartıları hafif gelirse, onun varacağı yer Hâviye’dir. Hâviye’nin ne olduğunu sana ne bildirdi? Çok sıcak bir ateştir.`,
  },
  {
    id: "adiyat",
    name: "Âdiyât Suresi",
    shortName: "Âdiyât",
    verses: 11,
    usage: 4,
    status: "not_started",
    arabicTitle: "العاديات",
    arabic: `وَالْعَادِيَاتِ ضَبْحًا\nفَالْمُورِيَاتِ قَدْحًا\nفَالْمُغِيرَاتِ صُبْحًا\nفَأَثَرْنَ بِهِ نَقْعًا\nفَوَسَطْنَ بِهِ جَمْعًا\nإِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ\nوَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ\nوَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ\nأَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ\nوَحُصِّلَ مَا فِي الصُّدُورِ\nإِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَخَبِيرٌ`,
    translit: `Vel âdiyâti dabha. Fel mûriyâti kadhha. Fel mugîrâti subha. Fe eserne bihî nak'a. Fe vesa'tne bihî cem'a. İnnel insâne lirabbihî le kanûd. Ve innehu alâ zâlike le şehîd. Ve innehu li hubbil hayri le şedîd. Efelâ ya'lemü izâ bu'sıra mâ fil kubûr. Ve hussıla mâ fis sudûr. İnne rabbahum bihim yevme izin le habîr.`,
    meaning: `Nefes nefese koşan atlara andolsun, kıvılcım çıkaranlara, sabah baskın yapanlara, tozu dumana katanlara andolsun ki insan gerçekten Rabbine karşı çok nankördür; buna kendisi de şahittir. O, mal sevgisine de çok düşkündür. Kabirlerde olanlar çıkarılıp, gönüllerde olanlar ortaya döküldüğünde bilmeyecek mi? Şüphesiz Rableri o gün onlardan haberdardır.`,
  },
];

const duaData = [
  {
    id: "ettehiyyat",
    name: "Ettehiyyâtü",
    arabic: `التَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللّٰهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ\nوَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
    translit: `Ettehiyyâtü lillâhi vessalavâtü vettayyibât. Esselâmü aleyke eyyühen nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ibâdillâhis sâlihîn. Eşhedü enlâ ilâhe illallâh. Ve eşhedü enne Muhammeden abdühû ve resûlüh.`,
    meaning: `Bütün selamlar, ibadetler ve güzel şeyler Allah içindir. Ey Nebi, Allah’ın selamı, rahmeti ve bereketi senin üzerine olsun. Selam bizim üzerimize ve Allah’ın salih kullarının üzerine olsun. Şahitlik ederim ki Allah’tan başka ilah yoktur. Ve şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.`,
  },
  { id: "salli", name: "Allâhumme Salli", arabic: `اللّٰهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ\nوَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme salli alâ seyyidinâ Muhammed. Ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline salât eyle.` },
  { id: "barik", name: "Allâhumme Bârik", arabic: `اللّٰهُمَّ بَارِكْ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ\nوَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme bârik alâ seyyidinâ Muhammed. Ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline bereket ver.` },
  { id: "rabbenaatina", name: "Rabbena Âtinâ", arabic: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`, translit: `Rabbenâ âtinâ fid-dünyâ haseneten ve fil âhireti haseneten ve kınâ azâben nâr.`, meaning: `Rabbimiz! Bize dünyada iyilik, ahirette de iyilik ver ve bizi ateş azabından koru.` },
  { id: "rabbenağfirli", name: "Rabbenağfirli", arabic: `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ`, translit: `Rabbiğfir lî ve livâlideyye ve lil mü'minîne yevme yekûmül hisâb.`, meaning: `Rabbim! Beni, anne-babamı ve hesabın görüleceği günde bütün müminleri bağışla.` },
  { id: "kunut_hanefi_dua", name: "Kunut (Hanefî)", arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ...`, translit: `Allâhümme innâ nesteînüke ve nestağfirüke...`, meaning: `Allah’ım! Senden yardım ister, bağışlanma diler ve Sana dayanırız.` },
  { id: "kunut_shafii_dua", name: "Kunut (Şâfiî)", arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ...`, translit: `Allâhümmehdinî fîmen hedeyt...`, meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver.` },
];

const zikrData = [
  { id: "subhanallah", name: "Sübhanallah", arabic: "سُبْحَانَ اللّٰهِ", translit: "Sübhanallah", meaning: "Allah’ı bütün eksikliklerden tenzih ederim.", defaultTarget: 33 },
  { id: "elhamdulillah", name: "Elhamdülillah", arabic: "الْحَمْدُ لِلّٰهِ", translit: "Elhamdülillah", meaning: "Hamd Allah’a mahsustur.", defaultTarget: 33 },
  { id: "allahu_ekber", name: "Allahu Ekber", arabic: "اللّٰهُ أَكْبَرُ", translit: "Allahu Ekber", meaning: "Allah en büyüktür.", defaultTarget: 33 },
  { id: "la_ilaha", name: "Lâ ilâhe illallâh", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", translit: "Lâ ilâhe illallâh", meaning: "Allah’tan başka ilah yoktur.", defaultTarget: 33 },
  { id: "estagfirullah", name: "Estağfirullah", arabic: "أَسْتَغْفِرُ اللّٰهَ", translit: "Estağfirullah", meaning: "Allah’tan bağışlanma dilerim.", defaultTarget: 33 },
  { id: "salavat", name: "Salavat-ı Şerif", arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", translit: "Allâhümme salli alâ Muhammed", meaning: "Allah’ım Muhammed’e salât eyle.", defaultTarget: 33 },
  { id: "lahaula", name: "Lâ havle ve lâ kuvvete", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ", translit: "Lâ havle ve lâ kuvvete illâ billâh", meaning: "Güç ve kuvvet ancak Allah’ladır.", defaultTarget: 33 },
  { id: "hasbunallah", name: "Hasbunallahu", arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ", translit: "Hasbunallâhu ve ni'mel vekîl", meaning: "Allah bize yeter, O ne güzel vekildir.", defaultTarget: 33 },
  { id: "subhanallahi", name: "Sübhanallahi ve bihamdihi", arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", translit: "Sübhanallahi ve bihamdihi", meaning: "Allah’ı hamdiyle tesbih ederim.", defaultTarget: 100 },
  { id: "bismillah", name: "Bismillâhillazî lâ yedurru", arabic: "بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ", translit: "Bismillâhillazî lâ yedurru", meaning: "Allah’ın adıyla; O’nun adıyla hiçbir şey zarar vermez.", defaultTarget: 3 },
  { id: "takbir100", name: "Allahu Ekber (Takbir)", arabic: "اللّٰهُ أَكْبَرُ", translit: "Allahu Ekber", meaning: "Allah en büyüktür.", defaultTarget: 100 },
  { id: "custom", name: "Özel Zikr", arabic: "—", translit: "Kendi zikrini yaz", meaning: "Kendi metnini ekleyebilirsin.", defaultTarget: 33 },
];

const quizBank = [
  { mode: "Yeni Başlayan", q: "Fâtiha Suresi kaç ayettir?", o: ["5", "6", "7", "8"], a: 2, exp: "Fâtiha 7 ayettir." },
  { mode: "Yeni Başlayan", q: "İhlâs Suresi neyi anlatır?", o: ["Orucu", "Allah’ın birliğini", "Haccı", "Sadakayı"], a: 1, exp: "İhlâs, Allah’ın birliğini anlatır." },
  { mode: "Yeni Başlayan", q: "Kul eûzü birabbil-felak hangi suredir?", o: ["Nas", "Felak", "Fil", "Kevser"], a: 1, exp: "Bu cümle Felak Suresi’ndendir." },
  { mode: "Yeni Başlayan", q: "Ayetel Kürsi kaçıncı ayettir?", o: ["Bakara 1", "Bakara 255", "Bakara 2", "Bakara 5"], a: 1, exp: "Ayetel Kürsi, Bakara 255’tir." },
  { mode: "Yeni Başlayan", q: "Nas Suresi ne için okunur?", o: ["Sadece ticaret için", "Vesvese ve kötülüklerden korunmak için", "Sadece yolculukta", "Sadece sabah"], a: 1, exp: "Nas Suresi vesvese için okunur." },
  { mode: "Yeni Başlayan", q: "Kunut duası hangi namazda geçer?", o: ["Vitir", "Cuma", "Bayram", "İkindi"], a: 0, exp: "Kunut duası vitir namazında okunur." },
  { mode: "Yeni Başlayan", q: "Fil Suresi hangi olayı anlatır?", o: ["Ashab-ı Fil", "Hicret", "Miraç", "Bedir"], a: 0, exp: "Fil Suresi, Ashab-ı Fil hadisesini anlatır." },
  { mode: "Yeni Başlayan", q: "Kureyş Suresi hangi nimeti hatırlatır?", o: ["Yalnız yağmur", "Güven ve rızık", "Savaş", "Deniz"], a: 1, exp: "Kureyş, güven ve rızık nimetini hatırlatır." },
  { mode: "Eşleştir", q: "'Rabbenâ âtinâ fid-dünyâ haseneten...' hangi duadır?", o: ["Ettehiyyâtü", "Rabbena Âtinâ", "Kunut", "Ayetel Kürsi"], a: 1, exp: "Bu Rabbena Âtinâ duasıdır." },
  { mode: "Eşleştir", q: "'Allah’ım! Efendimiz Muhammed’e salât eyle.' hangi cümledir?", o: ["Salavat-ı Şerif", "İstiğfar", "Tehlil", "Tesbih"], a: 0, exp: "Bu salavat cümlesidir." },
  { mode: "Ezber Boşluğu", q: "'Kul hüvallâhu ehad, _____.'", o: ["Allâhüs-samed", "Mâliki yevmiddîn", "Vel asr", "Elhâkümüt tekâsür"], a: 0, exp: "Doğru devamı: Allâhüs-samed." },
  { mode: "Ezber Boşluğu", q: "'Lâ ilâhe illallâh, _____.'", o: ["vahdehû lâ şerîke leh", "elhamdülillah", "bismillah", "ve hüve alâ külli şey'in kadîr"], a: 0, exp: "Tehlilin devamı: vahdehû lâ şerîke leh." },
  { mode: "Hızlı Tekrar", q: "33’erlik tesbihlerde ilk zikri seçin.", o: ["Sübhanallah", "Ayetel Kürsi", "Kunut", "Fil"], a: 0, exp: "İlk zikir Sübhanallah’tır." },
  { mode: "Hızlı Tekrar", q: "33’erlik tesbihlerde ikinci zikri seçin.", o: ["Elhamdülillah", "Kâria", "Tîn", "Maun"], a: 0, exp: "İkinci zikir Elhamdülillah’tır." },
  { mode: "Hızlı Tekrar", q: "33’erlik tesbihlerde üçüncü zikri seçin.", o: ["Allahu Ekber", "İhlâs", "Nasr", "Duha"], a: 0, exp: "Üçüncü zikir Allahu Ekber’dir." },
  { mode: "Hızlı Tekrar", q: "Aşağıdakilerden hangisi bir sure değildir?", o: ["Kevser", "Felak", "Salavat", "Nas"], a: 2, exp: "Salavat bir duadır, sure değildir." },
];

const DEFAULT_STATE = {
  auth: false,
  username: "furkancittir",
  xp: 1150,
  gems: 24,
  level: 3,
  dailyStreak: 6,
  prayerStreak: 4,
  missedPrayers: 12,
  monthlyMissed: 4,
  totalReadCounts: {},
  surahProgress: { fatiha: 33, fil: 18, ihlas: 33, felak: 33, nas: 33, ayetelkursi: 12 },
  surahStatuses: { fatiha: "memorized", fil: "in_progress", ihlas: "memorized", felak: "memorized", nas: "memorized", ayetelkursi: "in_progress" },
  selectedTab: "home",
  selectedSurah: "fatiha",
  selectedDua: "ettehiyyat",
  surahSort: "usage",
  prayerDone: { sabah: true, ogle: true, ikindi: false, aksam: false, yatsi: false },
  notifications: ["Bugün Öğle namazını kılmayı unutma!", "Felak Suresi hatırlatma günü!", "Tesbihat zamanı!"],
  tesbihatType: "short",
  tesbihatIndex: 0,
  tesbihatProgress: [],
  zikrSelected: "subhanallah",
  zikrTarget: 33,
  zikrCounts: {},
  dailyLogs: { date: "", zikrs: [], duas: [] },
  quizMode: "Yeni Başlayan",
  quizIndex: 0,
  quizCorrect: 0,
  quizAnswered: false,
  quizChoice: null,
  quizTimeLeft: 30,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
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
  const [celebrate, setCelebrate] = useState("");
  const [quizRunning, setQuizRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    setState((s) => ({ ...s, level: Math.floor(s.xp / 500) + 1 }));
  }, [state.xp]);

  const todayCount = Object.values(state.prayerDone).filter(Boolean).length;
  const prayerFinished = todayCount === 5;
  const selectedSurah = surahData.find((s) => s.id === state.selectedSurah) || surahData[0];
  const selectedDua = duaData.find((d) => d.id === state.selectedDua) || duaData[0];
  const selectedZikr = zikrData.find((z) => z.id === state.zikrSelected) || zikrData[0];

  const filteredSurahs = useMemo(() => {
    let items = [...surahData];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((s) => s.name.toLowerCase().includes(q) || s.shortName.toLowerCase().includes(q) || s.translit.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q));
    }
    if (state.surahSort === "alphabetical") items.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    if (state.surahSort === "length") items.sort((a, b) => a.verses - b.verses);
    if (state.surahSort === "usage") items.sort((a, b) => b.usage - a.usage);
    return items;
  }, [search, state.surahSort]);

  const quizQuestions = useMemo(() => quizBank.filter((q) => q.mode === state.quizMode), [state.quizMode]);
  const currentQuestion = quizQuestions[state.quizIndex % Math.max(1, quizQuestions.length)] || quizBank[0];

  useEffect(() => {
    setState((s) => ({ ...s, quizIndex: 0, quizCorrect: 0, quizAnswered: false, quizChoice: null }));
  }, [state.quizMode]);

  useEffect(() => {
    if (!quizRunning) return;
    const t = setInterval(() => {
      setState((s) => ({ ...s, quizTimeLeft: s.quizTimeLeft <= 1 ? 30 : s.quizTimeLeft - 1 }));
    }, 1000);
    return () => clearInterval(t);
  }, [quizRunning]);

  function handleLogin(e) {
    e.preventDefault();
    if (inputUser.trim() === "furkancittir" && inputPass === "1234") {
      setState((s) => ({ ...s, auth: true, selectedTab: "home" }));
      setLoginError("");
    } else {
      setLoginError("Hatalı kullanıcı adı veya şifre!");
    }
  }

  function logout() {
    setState((s) => ({ ...s, auth: false }));
  }

  function markPrayer(id) {
    setState((s) => {
      const updated = { ...s.prayerDone, [id]: !s.prayerDone[id] };
      const all = Object.values(updated).every(Boolean);
      return {
        ...s,
        prayerDone: updated,
        prayerStreak: all ? s.prayerStreak + 1 : 0,
        xp: s.xp + (all ? 50 : 0),
        gems: s.gems + (all ? 2 : 0),
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

  function touchDailyLog(kind, value) {
    setState((s) => {
      const today = new Date().toISOString().slice(0, 10);
      const dailyLogs = s.dailyLogs?.date === today ? s.dailyLogs : { date: today, zikrs: [], duas: [] };
      const currentList = Array.isArray(dailyLogs[kind]) ? dailyLogs[kind] : [];
      if (currentList.includes(value)) return s;
      return { ...s, dailyLogs: { ...dailyLogs, [kind]: [...currentList, value] } };
    });
  }

  function markDuaRead(duaName) {
    touchDailyLog("duas", duaName);
  }

  function nextQuestion() {
    setState((s) => ({ ...s, quizIndex: (s.quizIndex + 1) % Math.max(1, quizQuestions.length), quizAnswered: false, quizChoice: null }));
  }

  function answerQuestion(idx) {
    if (state.quizAnswered) return;
    const correct = idx === currentQuestion.a;
    setState((s) => ({ ...s, quizAnswered: true, quizChoice: idx, quizCorrect: s.quizCorrect + (correct ? 1 : 0), xp: s.xp + (correct ? (state.quizMode === "Hızlı Tekrar" ? 10 : 25) : 0) }));
    if (correct) setCelebrate("Doğru cevap!");
  }

  function currentTesbihatSteps() {
    const steps = [
      { key: "istigfar", label: "İstiğfar ve Selam Duası", title: "Estagfirullah, estagfirullah, estagfirullah. Allahümme entes-selamü ve minkes-selam, tebarekte ya zel-celali vel-ikram.", meaning: "Allah’ım! Sen selam sahibisin, selam/esenlik ancak Sendedir. Ey celal ve ikram sahibi Rabbim, Sen ne yücesin.", count: 1 },
      ...(state.tesbihatType === "long"
        ? [{ key: "salavat", label: "Salavat", title: "Allahümme salli ala seyyidina Muhammedin ve ala ali seyyidina Muhammed.", meaning: "Peygamber Efendimize salavat.", count: 1 }]
        : []),
      { key: "ayetelkursi", label: "Ayetel Kürsi", title: "اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ...", translit: "Allâhu lâ ilâhe illâ hüve'l-hayyü'l-kayyûm...", meaning: "Ayetel Kürsi tam okunur.", count: 1, showLongText: true },
      { key: "subhanallah", label: "Sübhanallah", title: "Sübhanallah", meaning: "Allah’ı bütün eksikliklerden tenzih ederim.", count: 33 },
      { key: "elhamdulillah", label: "Elhamdülillah", title: "Elhamdülillah", meaning: "Hamd Allah’a mahsustur.", count: 33 },
      { key: "allahu_ekber", label: "Allahu Ekber", title: "Allahu Ekber", meaning: "Allah en büyüktür.", count: 33 },
      { key: "tehlil", label: "Tehlil", title: "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey'in kadîr.", meaning: "Allah birdir, ortağı yoktur; mülk O’nundur.", count: 1 },
      { key: "dua", label: "Dua", title: "Bismillâhirrahmânirrahîm. Allah’ım! Kıldığım namazı kabul eyle...", meaning: "Kısa bir kabul ve af duası.", count: 1 },
    ];
    return steps;
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
      const done = next >= step.count;
      return { ...s, tesbihatProgress: progress, tesbihatIndex: done ? Math.min(s.tesbihatIndex + 1, steps.length - 1) : s.tesbihatIndex };
    });
  }

  function prevTesbihatStep() {
    setState((s) => ({ ...s, tesbihatIndex: Math.max(0, s.tesbihatIndex - 1) }));
  }

  function completeTesbihat() {
    setCelebrate("Tesbihat tamamlandı!");
    setState((s) => ({ ...s, xp: s.xp + 50, gems: s.gems + 2, tesbihatIndex: 0, tesbihatProgress: [] }));
  }

  function selectZikr(id, target) {
    setState((s) => ({ ...s, zikrSelected: id, zikrTarget: target, zikrCounts: { ...s.zikrCounts, [id]: s.zikrCounts?.[id] || 0 } }));
  }

  function addZikr() {
    setState((s) => {
      const next = (s.zikrCounts?.[s.zikrSelected] || 0) + 1;
      const today = new Date().toISOString().slice(0, 10);
      const dailyLogs = s.dailyLogs?.date === today ? s.dailyLogs : { date: today, zikrs: [], duas: [] };
      const zikrs = dailyLogs.zikrs || [];
      const selectedName = selectedZikr?.name || s.zikrSelected;
      const nextLogs = zikrs.includes(selectedName) ? dailyLogs : { ...dailyLogs, zikrs: [...zikrs, selectedName] };
      return { ...s, zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: next }, xp: s.xp + 1, dailyLogs: nextLogs };
    });
  }

  function resetZikr() {
    setState((s) => ({ ...s, zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: 0 } }));
  }

  const nav = [["home", Home, "Ana Sayfa"], ["sureler", BookOpen, "Sureler"], ["tesbihat", Layers3, "Tesbihat"], ["zikir", Sparkles, "Zikirmatic"], ["oyun", Play, "Oyun"], ["profil", User, "Profil"]];
  const selectedZikrCount = state.zikrCounts?.[state.zikrSelected] || 0;

  if (!state.auth) {
    return (
      <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center p-4 text-slate-800">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs text-emerald-700 font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" /> İlim Yolu
          </div>
          <h1 className="text-2xl font-bold text-emerald-950">Giriş Yap</h1>
          <p className="text-xs text-slate-500 mt-1 mb-5">Kişisel ibadet alanına erişmek için giriş yapın.</p>

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
    <div className="min-h-screen bg-[#faf7f0] text-slate-900">
      <div className="mx-auto max-w-[1400px] p-4 pb-24 lg:p-6">
        {celebrate && <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm"><div className="flex items-center gap-2 font-semibold"><Trophy className="h-5 w-5" /> {celebrate}</div></div>}

        {state.selectedTab === "home" && <HomeView state={state} prayerFinished={prayerFinished} markPrayer={markPrayer} todayCount={todayCount} markDuaRead={markDuaRead} />}

        {state.selectedTab === "sureler" && <SurahView selectedSurah={selectedSurah} selectedDua={selectedDua} filteredSurahs={filteredSurahs} search={search} setSearch={setSearch} sort={state.surahSort} setSort={(v) => setState((s) => ({ ...s, surahSort: v }))} progress={state.surahProgress} statuses={state.surahStatuses} setSelectedSurah={(id) => setState((s) => ({ ...s, selectedSurah: id }))} setSelectedDua={(id) => setState((s) => ({ ...s, selectedDua: id }))} addSurahRead={addSurahRead} />}

        {state.selectedTab === "tesbihat" && <TesbihatView state={state} tesbihatSteps={tesbihatSteps} currentStep={currentStep} currentStepCount={currentStepCount} incTesbihatStep={incTesbihatStep} prevTesbihatStep={prevTesbihatStep} completeTesbihat={completeTesbihat} setState={setState} />}

        {state.selectedTab === "zikir" && <ZikirView zikrData={zikrData} selectedZikr={selectedZikr} selectedZikrCount={selectedZikrCount} target={state.zikrTarget} selectZikr={selectZikr} addZikr={addZikr} resetZikr={resetZikr} counts={state.zikrCounts || {}} />}

        {state.selectedTab === "oyun" && <QuizView state={state} setState={setState} quizRunning={quizRunning} setQuizRunning={setQuizRunning} currentQuestion={currentQuestion} answerQuestion={answerQuestion} nextQuestion={nextQuestion} />}

        {state.selectedTab === "profil" && <ProfileView state={state} logout={logout} />}
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-emerald-100 bg-white/95 backdrop-blur z-50">
        <div className="mx-auto grid max-w-[1400px] grid-cols-6 gap-1 p-2">
          {nav.map(([key, Icon, label]) => (
            <button key={key} onClick={() => setState((s) => ({ ...s, selectedTab: key }))} className={`flex flex-col items-center justify-center rounded-2xl py-2 text-xs font-semibold ${state.selectedTab === key ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              <Icon className="h-5 w-5" /> {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function SurahView({ selectedSurah, filteredSurahs, search, setSearch, sort, setSort, progress, statuses, setSelectedSurah, addSurahRead }) {
  return (
    <div className="space-y-4">
      {/* Okuma Alanı (En Üstte) */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <FullCard title={selectedSurah.name} subtitle={`${selectedSurah.arabicTitle} · ${selectedSurah.verses} ayet`}>
          <div className="grid gap-4 lg:grid-cols-[0.3fr_0.7fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-right overflow-x-auto">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Arapça</div>
              <div className="text-base sm:text-lg leading-loose text-slate-700" dir="rtl" style={{ lineHeight: 2.05 }}>{selectedSurah.arabic}</div>
            </div>
            <div className="space-y-3 rounded-3xl bg-emerald-50 p-4">
              <div className="rounded-2xl bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Türkçe okunuş</div>
                <div className="mt-2 text-sm sm:text-base leading-relaxed text-slate-800">{selectedSurah.translit}</div>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Türkçe meal</div>
                <div className="mt-2 text-sm sm:text-base leading-relaxed text-slate-800">{selectedSurah.meaning}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => addSurahRead(selectedSurah.id)} className="rounded-2xl bg-emerald-700 px-4 py-2 font-semibold text-white">+1 okuma</button>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold">{selectedSurah.id} · {progress[selectedSurah.id] || 0} kayıt</div>
          </div>
        </FullCard>
      </div>

      {/* Sure Seçme Listesi (En Altta) */}
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-emerald-950">Sure Seç</h3>
            <p className="text-xs sm:text-sm text-slate-600">Okumak istediğiniz sureyi seçin.</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-1.5 text-sm">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara" className="bg-transparent outline-none w-28 sm:w-auto" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border bg-white px-2 py-1.5 text-xs sm:text-sm outline-none">
              <option value="usage">Kullanım sıklığı</option>
              <option value="length">Uzunluk</option>
              <option value="alphabetical">Alfabetik</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredSurahs.map((s) => {
            const count = progress[s.id] || 0;
            const status = statuses[s.id] || (count >= 33 ? "memorized" : count > 0 ? "in_progress" : "not_started");
            return (
              <button key={s.id} onClick={() => setSelectedSurah(s.id)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedSurah.id === s.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-white"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-500">{s.arabicTitle} · {s.verses} ayet</div>
                  </div>
                  <StatusBadge status={status} />
                </div>
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
          <div className="mt-2 text-2xl font-bold text-emerald-950">{currentStep.label}</div>
          <div className="mt-2 text-sm text-slate-600">{currentStep.count > 1 ? `${currentStepCount} / ${currentStep.count}` : "Bu adım tek sefer okunur."}</div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Okunuş</div><div className="mt-2 text-sm sm:text-base leading-relaxed text-slate-800">{currentStep.title}</div></div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Anlam</div><div className="mt-2 text-sm sm:text-base leading-relaxed text-slate-800">{currentStep.meaning}</div></div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Tekrar</div><div className="mt-2 text-sm sm:text-base leading-relaxed text-slate-800">{currentStep.count} kez</div></div>
        </div>

        {currentStep.key === "ayetelkursi" && (
          <div className="mt-4 rounded-3xl border border-emerald-100 bg-white p-4">
            <div className="text-sm font-semibold text-emerald-800">Ayetel Kürsi tam okunuş</div>
            <div className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-800">{surahData.find((s) => s.id === "ayetelkursi")?.translit}</div>
            <div className="mt-3 text-right text-xs leading-6 text-slate-600" dir="rtl">{surahData.find((s) => s.id === "ayetelkursi")?.arabic}</div>
          </div>
        )}

        {currentStep.count > 1 ? (
          <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-center">
            <div className="text-4xl font-bold text-emerald-700">{currentStepCount}/{currentStep.count}</div>
            <div className="mt-2 text-sm text-slate-600">Her tekrar için +1 bas.</div>
            <button onClick={incTesbihatStep} className="mt-4 w-full rounded-2xl bg-emerald-700 px-5 py-4 text-lg font-semibold text-white">+1</button>
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Sonraki adıma geçmek için tek seferlik okuma yeterli.</div>
        )}
      </div>
    </div>
  );
}

function ZikirView({ zikrData, selectedZikr, selectedZikrCount, target, selectZikr, addZikr, resetZikr, counts }) {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Dijital Zikirmatik Arayüzü */}
      <div className="rounded-3xl border border-emerald-800/20 bg-gradient-to-b from-emerald-900 to-emerald-950 p-6 text-white shadow-xl text-center relative overflow-hidden">
        <div className="text-xs text-emerald-300/80 font-medium tracking-widest uppercase mb-1">{selectedZikr.name}</div>
        <div className="text-sm text-emerald-100 font-serif mb-4" dir="rtl">{selectedZikr.arabic}</div>

        {/* Sayaç Ekranı */}
        <div className="my-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 p-4 shadow-inner">
          <div className="text-6xl font-mono font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
            {String(selectedZikrCount).padStart(4, "0")}
          </div>
          <div className="text-[10px] text-emerald-500 mt-1 uppercase tracking-wider">Hedef: {target}</div>
        </div>

        {/* Zikirmatik Buton Paneli */}
        <div className="mt-8 mb-2 flex items-center justify-center gap-6">
          <button
            onClick={resetZikr}
            className="h-12 w-12 rounded-full bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-emerald-200 active:scale-90 hover:bg-emerald-800 transition shadow"
            title="Sıfırla"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

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
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
          {zikrData.map((z) => (
            <button
              key={z.id}
              onClick={() => selectZikr(z.id, z.defaultTarget)}
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

function QuizView({ state, setState, quizRunning, setQuizRunning, currentQuestion, answerQuestion, nextQuestion }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <h3 className="text-xl font-bold text-emerald-950">Ezberi Güçlendiren Oyunlar</h3>
        <p className="text-sm text-slate-600">Yeni başlayanlar için kısa tekrar ve eşleştirme odaklı.</p>
        <div className="mt-4 grid gap-2">
          {["Yeni Başlayan", "Eşleştir", "Ezber Boşluğu", "Hızlı Tekrar"].map((m) => (
            <button key={m} onClick={() => setState((s) => ({ ...s, quizMode: m, quizIndex: 0, quizCorrect: 0, quizAnswered: false, quizChoice: null }))} className={`rounded-2xl border px-4 py-3 text-left font-semibold ${state.quizMode === m ? "border-emerald-600 bg-emerald-50" : "bg-white"}`}>{m}</button>
          ))}
        </div>
        {state.quizMode === "Hızlı Tekrar" && <button onClick={() => setQuizRunning((v) => !v)} className="mt-4 w-full rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white">{quizRunning ? "Yarışı durdur" : "30 saniyelik hızlı tekrar"}</button>}
        <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Amaç: kısa tekrarlarla sure, dua ve zikirleri tanımak. {state.quizCorrect} doğru cevap.</div>
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div><h4 className="text-lg font-bold text-emerald-950">Soru</h4><p className="text-sm text-slate-500">Tamamen Türkçe.</p></div>
          <div className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{state.quizTimeLeft}s</div>
        </div>
        <div className="mt-4 rounded-3xl bg-emerald-50 p-4">
          <div className="text-lg font-semibold text-slate-900">{currentQuestion.q}</div>
          <div className="mt-4 grid gap-2">
            {currentQuestion.o.map((opt, idx) => (
              <button key={idx} onClick={() => answerQuestion(idx)} className={`rounded-2xl border px-4 py-3 text-left transition ${state.quizAnswered && state.quizChoice === idx ? (idx === currentQuestion.a ? "border-emerald-600 bg-emerald-100" : "border-rose-500 bg-rose-50") : "bg-white"}`}>{opt}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={nextQuestion} className="rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white">Sonraki soru</button>
            <button onClick={() => setState((s) => ({ ...s, quizCorrect: 0 }))} className="rounded-2xl border px-4 py-2 font-semibold">Sıfırla</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeView({ state, prayerFinished, markPrayer, todayCount, markDuaRead }) {
  const prayerCards = [
    { id: "sabah", tr: "Sabah", en: "Fajr" },
    { id: "ogle", tr: "Öğle", en: "Dhuhr" },
    { id: "ikindi", tr: "İkindi", en: "Asr" },
    { id: "aksam", tr: "Akşam", en: "Maghrib" },
    { id: "yatsi", tr: "Yatsı", en: "Isha" },
  ];

  const todayKey = new Date().toISOString().slice(0, 10);
  const isToday = state.dailyLogs?.date === todayKey;
  const todayZikrs = isToday && state.dailyLogs?.zikrs?.length ? state.dailyLogs.zikrs.join(" • ") : "Henüz kayıt yok";
  const todayDuas = isToday && state.dailyLogs?.duas?.length ? state.dailyLogs.duas.join(" • ") : "Henüz kayıt yok";

  return (
    <div className="space-y-4">
      {/* Kullanıcı Bilgi Kartı */}
      <header className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700"><Sparkles className="h-4 w-4" /> İlim Yolu</div>
            <h2 className="mt-1 text-2xl font-bold text-emerald-950">Selam, Furkan Çittir</h2>
            <p className="text-sm text-slate-600">Bugün {todayCount}/5 namaz · {state.dailyStreak} günlük seri · {state.prayerStreak} namaz serisi</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat label="XP" value={state.xp} icon={Zap} />
            <MiniStat label="Seviye" value={state.level} icon={Crown} />
            <MiniStat label="Gems" value={state.gems} icon={Gem} />
            <MiniStat label="Kaza" value={state.missedPrayers} icon={AlertTriangle} />
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div><h3 className="text-xl font-bold text-emerald-950">Bugünün Özeti</h3><p className="text-sm text-slate-600">İbadet rehberiniz ve takip paneli.</p></div>
              <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">{todayCount}/5 namaz</div>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${(todayCount / 5) * 100}%` }} /></div>
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
            <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-emerald-950">Vakit Namazları</h3><div className={`rounded-full px-3 py-1 text-xs font-semibold ${prayerFinished ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>{prayerFinished ? "Tümü tamam" : `Eksik ${5 - todayCount}`}</div></div>
            <div className="mt-4 grid gap-2 grid-cols-5">
              {prayerCards.map((p) => {
                const done = state.prayerDone[p.id];
                return (
                  <button key={p.id} onClick={() => markPrayer(p.id)} className={`rounded-2xl border p-2.5 text-center transition ${done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                    <div className="font-semibold text-xs sm:text-sm text-slate-900">{p.tr}</div>
                    <CheckCircle2 className={`h-4 w-4 mx-auto mt-2 ${done ? "text-emerald-700" : "text-slate-300"}`} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
        <aside className="space-y-4">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm"><h3 className="text-lg font-bold text-emerald-950">Bugün ne yapayım?</h3><div className="mt-3 space-y-2 text-sm"><TaskLine text="İhlas Suresi oku" done={!!(state.surahProgress.ihlas > 0)} /><TaskLine text="Ayetel Kürsi oku" done={!!(state.surahProgress.ayetelkursi > 0)} /><TaskLine text="Kısa Tesbihat bitir" done={state.tesbihatIndex > 0} /><TaskLine text="Seçili zikri 33 kez tamamla" done={!!((state.zikrCounts || {})[state.zikrSelected] >= 33)} /></div></section>
          <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><h3 className="text-lg font-bold text-emerald-950">Bildirimler</h3><div className="mt-3 space-y-2">{state.notifications.map((n, i) => <div key={i} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">{n}</div>)}</div></section>
        </aside>
      </div>
    </div>
  );
}

function ProfileView({ state, logout }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">
            FÇ
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-950">Furkan Çittir</h3>
            <p className="text-xs text-slate-500">Kişisel İbadet Profili</p>
          </div>
        </div>
        <div className="space-y-3">
          <ProfileLine label="Toplam XP" value={state.xp} />
          <ProfileLine label="Seviye" value={state.level} />
          <ProfileLine label="Günlük streak" value={state.dailyStreak} />
          <ProfileLine label="Namaz streak" value={state.prayerStreak} />
          <ProfileLine label="Gems" value={state.gems} />
          <ProfileLine label="Kaza namazı" value={state.missedPrayers} />
        </div>
        <div className="mt-4 flex gap-2"><button onClick={logout} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white"><LogOut className="h-4 w-4" /> Çıkış yap</button></div>
      </div>
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><h4 className="text-lg font-bold text-emerald-950">İlerleme</h4><div className="mt-3 grid gap-3 md:grid-cols-2"><ProfileLine label="Okunan sure adedi" value={Object.keys(state.surahProgress).length} /><ProfileLine label="Toplam okuma" value={Object.values(state.surahProgress).reduce((a, b) => a + b, 0)} /><ProfileLine label="Zikir türü" value={Object.keys(state.zikrCounts || {}).length} /><ProfileLine label="Quiz doğru" value={state.quizCorrect} /></div></div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"><div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="h-3 w-3" /> {label}</div><div className="mt-1 font-bold text-slate-900">{value}</div></div>;
}

function FullCard({ title, subtitle, children }) {
  return <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-emerald-950">{title}</h3><p className="text-sm text-slate-500">{subtitle}</p></div><Volume2 className="h-5 w-5 text-emerald-700" /></div><div className="mt-4">{children}</div></section>;
}

function StatusBadge({ status }) {
  const map = { memorized: "bg-emerald-100 text-emerald-800", in_progress: "bg-amber-100 text-amber-800", not_started: "bg-slate-100 text-slate-600" };
  const label = status === "memorized" ? "Hafızada" : status === "in_progress" ? "Devam" : "Başlamadı";
  return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${map[status] || map.not_started}`}>{label}</span>;
}

function ProfileLine({ label, value }) {
  return <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span className="text-sm text-slate-600">{label}</span><span className="font-bold text-slate-900">{value}</span></div>;
}

function TaskLine({ text, done }) {
  return <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>{text}</span>{done ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <CircleDot className="h-4 w-4 text-slate-300" />}</div>;
}

export default App;
