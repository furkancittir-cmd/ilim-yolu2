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

const STORAGE_KEY = "ilim-yolu-v6";

const emptyPrayer = () => ({ sabah: false, ogle: false, ikindi: false, aksam: false, yatsi: false });
const todayKey = () => new Date().toISOString().slice(0, 10);

const surahData = [
  { id: "fatiha", name: "Fâtiha Suresi", shortName: "Fâtiha", verses: 7, usage: 10, status: "memorized", arabicTitle: "الفاتحة", arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ\nالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ\nالرَّحْمٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`, translit: `Bismillâhirrahmânirrahîm. Elhamdülillâhi rabbil âlemîn. Errahmânirrahîm. Mâliki yevmiddîn. İyyâke na'budu ve iyyâke neste'în. İhdinessırâtel mustakîm. Sırâtellezîne en'amte aleyhim gayril mağdûbi aleyhim ve leddâllîn.`, meaning: `Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi Allah’a mahsustur. O, Rahmân’dır, Rahîm’dir. Din gününün sahibidir. Ancak Sana ibadet eder ve ancak Senden yardım dileriz. Bizi dosdoğru yola ilet. Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil.` },
  { id: "fil", name: "Fil Suresi", shortName: "Fil", verses: 5, usage: 8, status: "in_progress", arabicTitle: "الفيل", arabic: `أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ\nأَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ\nوَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ\nتَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ\nفَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ`, translit: `Elem tera keyfe feale rabbüke bi ashâbil fîl. Elem yec'al keydehum fî tedlîl. Ve ersale aleyhim tayran ebâbîl. Termîhim bi hicâratin min siccîl. Fe cealehum ke'asfin me'kûl.`, meaning: `Rabbinin fil sahiplerine nasıl davrandığını görmedin mi? Onların tuzaklarını boşa çıkarmadı mı? Üzerlerine sürü sürü kuşlar gönderdi. Onları pişmiş çamurdan taşlarla vuruyorlardı. Böylece onları yenilmiş ekin yaprağı gibi kıldı.` },
  { id: "kureys", name: "Kureyş Suresi", shortName: "Kureyş", verses: 4, usage: 8, status: "memorized", arabicTitle: "قريش", arabic: `لِإِيلَافِ قُرَيْشٍ\nإِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ\nفَلْيَعْبُدُوا رَبَّ هٰذَا الْبَيْتِ\nالَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ`, translit: `Li îlâfi kureyş. Îlâfihim rihleteş-şitâi ve's-sayf. Felya'budû rabbe hâzel beyt. Ellezî et'amahum min cû'in ve âmenehum min havf.`, meaning: `Kureyş’in yaz ve kış yolculuklarına alışması sebebiyle. Öyleyse onlar bu evin Rabbine kulluk etsinler. O Rab ki onları açlıktan doyurdu ve korkudan emin kıldı.` },
  { id: "kevser", name: "Kevser Suresi", shortName: "Kevser", verses: 3, usage: 9, status: "memorized", arabicTitle: "الكوثر", arabic: `إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ\nفَصَلِّ لِرَبِّكَ وَانْحَرْ\nإِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ`, translit: `İnnâ a'taynâke'l-kevser. Fe salli lirabbike venhar. İnne şâni'eke huve'l-ebter.`, meaning: `Biz sana Kevser’i verdik. O hâlde Rabbin için namaz kıl ve kurban kes. Asıl sonu kesik olan, sana kin tutandır.` },
  { id: "kafirun", name: "Kâfirûn Suresi", shortName: "Kâfirûn", verses: 6, usage: 8, status: "in_progress", arabicTitle: "الكافرون", arabic: `قُلْ يَا أَيُّهَا الْكَافِرُونَ\nلَا أَعْبُدُ مَا تَعْبُدُونَ\nوَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ\nوَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ\nوَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ\nلَكُمْ دِينُكُمْ وَلِيَ دِينِ`, translit: `Kul yâ eyyühel kâfirûn. Lâ a'budu mâ ta'budûn. Ve lâ entüm âbidûne mâ a'bud. Ve lâ ene âbidun mâ abedtüm. Ve lâ entüm âbidûne mâ a'bud. Leküm dînüküm ve liye dîn.`, meaning: `De ki: Ey kâfirler! Sizin taptığınıza ben tapmam. Siz de benim tapacağıma tapmazsınız. Ben sizin taptığınıza tapacak değilim. Siz de benim tapacağıma tapacak değilsiniz. Sizin dininiz size, benim dinim bana.` },
  { id: "nasr", name: "Nasr Suresi", shortName: "Nasr", verses: 3, usage: 8, status: "memorized", arabicTitle: "النصر", arabic: `إِذَا جَاءَ نَصْرُ اللّٰهِ وَالْفَتْحُ\nوَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللّٰهِ أَفْوَاجًا\nفَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا`, translit: `İzâ câe nasrullâhi vel feth. Ve raeyten nâse yedhulûne fî dînillâhi efvâcâ. Fe sebbih bihamdi rabbike vestagfirh. İnnehû kâne tevvâbâ.`, meaning: `Allah’ın yardımı ve fetih geldiği zaman; insanların Allah’ın dinine gruplar hâlinde girdiklerini gördüğünde, Rabbini hamd ile tesbih et ve O’ndan bağışlanma dile. Şüphesiz O, tevbeleri çok kabul edendir.` },
  { id: "tebbet", name: "Tebbet / Leheb Suresi", shortName: "Tebbet", verses: 5, usage: 7, status: "not_started", arabicTitle: "المسد", arabic: `تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ\nمَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ\nسَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ\nوَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ\nفِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ`, translit: `Tebbet yedâ Ebî Lehebin ve tabb. Mâ ağnâ anhu mâluhû ve mâ keseb. Seyaslâ nâran zâte leheb. Vemraetühû hammâletel hatab. Fî cîdihâ hablün min mesed.`, meaning: `Ebu Leheb’in elleri kurusun! Kendisi de kurudu. Malı ve kazandığı ona fayda vermedi. O, alevli bir ateşe girecektir. Karısı da odun taşıyacaktır. Boynunda bükülmüş ipten bir halat olacak.` },
  { id: "ihlas", name: "İhlâs Suresi", shortName: "İhlâs", verses: 4, usage: 10, status: "memorized", arabicTitle: "الإخلاص", arabic: `قُلْ هُوَ اللّٰهُ أَحَدٌ\nاللّٰهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ`, translit: `Kul hüvallâhu ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû kufuven ehad.`, meaning: `De ki: O Allah birdir. Allah sameddir. O doğurmamış ve doğmamıştır. Hiçbir şey O’na denk değildir.` },
  { id: "felak", name: "Felak Suresi", shortName: "Felak", verses: 5, usage: 9, status: "memorized", arabicTitle: "الفلق", arabic: `قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nمِن شَرِّ مَا خَلَقَ\nوَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ\nوَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ\nوَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ`, translit: `Kul eûzü birabbil felak. Min şerri mâ halak. Ve min şerri gâsıkin izâ vekab. Ve min şerrin neffâsâti fil ukad. Ve min şerri hâsidin izâ hased.`, meaning: `De ki: Yarattığı şeylerin şerrinden, karanlığı çöktüğünde gecenin şerrinden, düğümlere üfleyenlerin şerrinden ve haset edenin şerrinden sabahın Rabbine sığınırım.` },
  { id: "nas", name: "Nâs Suresi", shortName: "Nâs", verses: 6, usage: 9, status: "memorized", arabicTitle: "الناس", arabic: `قُلْ أَعُوذُ بِرَبِّ النَّاسِ\nمَلِكِ النَّاسِ\nإِلٰهِ النَّاسِ\nمِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\nالَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\nمِنَ الْجِنَّةِ وَالنَّاسِ`, translit: `Kul eûzü birabbin nâs. Melikin nâs. İlâhin nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin nâs. Minel cinneti vennâs.`, meaning: `De ki: İnsanların Rabbine, insanların Melikine, insanların ilâhına sığınırım. Sinsice vesvese veren şeytanın şerrinden; insanların göğüslerine vesvese veren; cinlerden ve insanlardan olan vesvesecinin şerrinden.` },
  { id: "ayetelkursi", name: "Ayetel Kürsi", shortName: "Ayetel Kürsi", verses: 1, usage: 10, status: "in_progress", arabicTitle: "آية الكرسي", arabic: `اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ\nلَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ\nلَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ\nمَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ\nيَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ\nوَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ\nوَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ\nوَلَا يَئُودُهُ حِفْظُهُمَا\nوَهُوَ الْعَلِيُّ الْعَظِيمُ`, translit: `Allâhu lâ ilâhe illâ hüve'l-hayyü'l-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fil ard. Menzellezî yeşfeu indehû illâ bi iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehum. Ve lâ yuhîtûne bi şey'in min ilmihî illâ bimâ şâe. Vesi'a kürsiyyühüs-semâvâti vel ard. Ve lâ yeûdühû hıfzuhumâ. Ve huvel aliyyül azîm.`, meaning: `Allah; O’ndan başka ilâh yoktur, diridir, kayyumdur. Onu ne uyuklama tutar ne uyku. Göklerde ve yerde ne varsa O’nundur. İzni olmadan O’nun katında kim şefaat edebilir? Önlerindekini ve arkalarındakini bilir. O’nun ilminden, dilediği kadarından başka hiçbir şeyi kuşatamazlar. Kürsüsü gökleri ve yeri kaplamıştır. Onları koruyup gözetmek O’na ağır gelmez. O yücedir, büyüktür.` },
  { id: "bakara1", name: "Bakara İlk 5 Ayet", shortName: "Bakara 1-5", verses: 5, usage: 6, status: "not_started", arabicTitle: "البقرة", arabic: `الم\nذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ\nالَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ\nوَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ\nأُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ`, translit: `Elif lâm mîm. Zâlikel kitâbu lâ raybe fîh, huden lil müttekîn. Ellezîne yü'minûne bil gaybi ve yukîmûnes salâte ve mimmâ razaknâhum yünfikûn. Vellezîne yü'minûne bimâ unzile ileyke ve mâ unzile min kablike vebil âhirati hum yûkınûn. Ulâike alâ hüdem mir rabbihim ve ulâike humul muflihûn.`, meaning: `Elif Lâm Mîm. İşte bu Kitap, onda hiçbir şüphe yoktur; takvâ sahipleri için bir rehberdir. Onlar gayba iman eder, namazı dosdoğru kılar ve kendilerine verdiğimiz rızıktan Allah yolunda harcarlar. Onlar sana indirilene ve senden önce indirilene iman eder; ahirete de kesin olarak inanırlar. İşte onlar Rablerinden bir doğru yol üzeredirler ve kurtuluşa erenler onlardır.` },
  { id: "kunut_hanefi", name: "Kunut Duası (Hanefî)", shortName: "Kunut Hanefî", verses: 1, usage: 8, status: "not_started", arabicTitle: "دعاء القنوت", arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ`, translit: `Allâhümme innâ nesteînüke ve nestağfirüke ve nü'minü bike ve netevekkelu aleyke ve nüsnî aleykel hayra ve neşküruke ve lâ nekfüruke ve nahleu ve netrukü men yefcüruk.`, meaning: `Allah’ım! Senden yardım isteriz, bağışlanma dileriz, Sana iman ederiz, Sana dayanırız. Sana hayır ile hamd eder, Sana şükrederiz. Sana nankörlük etmeyiz. Sana isyan edeni terk ederiz.` },
  { id: "kunut_shafii", name: "Kunut Duası (Şâfiî)", shortName: "Kunut Şâfiî", verses: 1, usage: 8, status: "not_started", arabicTitle: "دعاء القنوت", arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ`, translit: `Allâhümmehdinî fîmen hedeyt. Ve âfinî fîmen âfeyt. Ve tevellenî fîmen tevelleyt. Ve bârik lî fîmâ a'tayt. Ve kinî şerre mâ kadayt.`, meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver. Afiyet verdiklerin arasında bana da afiyet ver. Dost edindiklerin arasında beni de dost edin. Bana verdiğin şeylerde bereket ver. Hükmettiğin şeylerin şerrinden beni koru.` },
  { id: "inshirah", name: "İnşirah Suresi", shortName: "İnşirah", verses: 8, usage: 6, status: "not_started", arabicTitle: "الشرح", arabic: `أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ\nوَوَضَعْنَا عَنكَ وِزْرَكَ\nالَّذِي أَنْقَضَ ظَهْرَكَ\nوَرَفَعْنَا لَكَ ذِكْرَكَ\nفَإِنَّ مَعَ الْعُسْرِ يُسْرًا\nإِنَّ مَعَ الْعُسْرِ يُسْرًا\nفَإِذَا فَرَغْتَ فَانصَبْ\nوَإِلَىٰ رَبِّكَ فَارْغَبْ`, translit: `Elem neşrah leke sadrak. Ve vedana anke vizrak. Ellezî enkada zahrak. Ve refa'nâ leke zikrak. Fe inne me'al usri yusrâ. İnne me'al usri yusrâ. Fe izâ feragta fensab. Ve ilâ rabbike ferğab.`, meaning: `Senin göğsünü açıp genişletmedik mi? Sırtını ezen yükünü kaldırmadık mı? Senin için şöhretini yükseltmedik mi? Şüphesiz zorlukla beraber bir kolaylık vardır. Evet, gerçekten zorlukla beraber bir kolaylık vardır. O hâlde boş kaldığında yeni bir işe koyul ve yalnız Rabbine yönel.` },
  { id: "duha", name: "Duha Suresi", shortName: "Duha", verses: 11, usage: 6, status: "not_started", arabicTitle: "الضحى", arabic: `وَالضُّحَى\nوَاللَّيْلِ إِذَا سَجَىٰ\nمَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ\nوَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ\nوَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ\nأَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ\nوَوَجَدَكَ ضَالًّا فَهَدَىٰ\nوَوَجَدَكَ عَائِلًا فَأَغْنَىٰ\nفَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ\nوَأَمَّا السَّائِلَ فَلَا تَنْهَرْ\nوَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ`, translit: `Ved duhâ. Velleyli izâ seca. Mâ veddeake rabbüke ve mâ kalâ. Ve lel âhiratu hayrun leke minel ûlâ. Ve lesevfe yu'tîke rabbüke fe terdâ. Elem yecidke yetîmen fe âvâ. Ve vecedeke dâllen fe hedâ. Ve vecedeke âilen fe ağnâ. Fe emmâl yetîme fe lâ takher. Ve emmâs sâile fe lâ tenher. Ve emmâ bi ni'meti rabbike fe haddis.`, meaning: `Kuşluk vaktine andolsun; sakinleşen geceye andolsun ki Rabbin seni terk etmedi, sana darılmadı. Elbette ahiret senin için dünyadan daha hayırlıdır. Rabbin sana verecek de sen hoşnut olacaksın. Seni yetim bulup barındırmadı mı? Seni yolunu ararken doğru yola iletmedi mi? Seni muhtaç bulup zenginleştirmedi mi? O hâlde yetimi ezme, isteyeni azarlama, Rabbinin nimetini anlat.` },
  { id: "asr", name: "Asr Suresi", shortName: "Asr", verses: 3, usage: 9, status: "memorized", arabicTitle: "العصر", arabic: `وَالْعَصْرِ\nإِنَّ الْإِنسَانَ لَفِي خُسْرٍ\nإِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ`, translit: `Vel asr. İnnel insâne lefî husr. İllellezîne âmenû ve amilüs sâlihâti ve tevâsav bil hakkı ve tevâsav bis sabr.`, meaning: `Asra andolsun ki insan gerçekten ziyandadır. Ancak iman edip salih amel işleyenler, hakkı tavsiye edenler ve sabrı tavsiye edenler bunun dışındadır.` },
  { id: "kadr", name: "Kadr Suresi", shortName: "Kadr", verses: 5, usage: 7, status: "not_started", arabicTitle: "القدر", arabic: `إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ\nوَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ\nلَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ\nتَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِّن كُلِّ أَمْرٍ\nسَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ`, translit: `İnnâ enzelnâhü fî leyletil kadr. Ve mâ edrâke mâ leyletül kadr. Leyletül kadri hayrun min elfi şehr. Tenezzelül melâiketü ver-rûhu fîhâ bi izni rabbihim min külli emr. Selâmün hiye hattâ matlai'l fecr.`, meaning: `Şüphesiz biz onu Kadir gecesinde indirdik. Kadir gecesinin ne olduğunu sen nasıl bileceksin? Kadir gecesi bin aydan hayırlıdır. Melekler ve Ruh, o gece Rablerinin izniyle her iş için iner. O gece tan yeri ağarıncaya kadar esenliktir.` },
];

const duaData = [
  { id: "ettehiyyat", name: "Ettehiyyâtü", arabic: `التَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللّٰهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ\nوَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`, translit: `Ettehiyyâtü lillâhi vessalavâtü vettayyibât. Esselâmü aleyke eyyühen nebiyyü ve rahmetullâhi ve berakâtüh. Esselâmü aleynâ ve alâ ibâdillâhis sâlihîn. Eşhedü enlâ ilâhe illallâh. Ve eşhedü enne Muhammeden abdühû ve resûlüh.`, meaning: `Bütün selamlar, ibadetler ve güzel şeyler Allah içindir. Ey Nebi, Allah’ın selamı, rahmeti ve bereketi senin üzerine olsun. Selam bizim üzerimize ve Allah’ın salih kullarının üzerine olsun. Şahitlik ederim ki Allah’tan başka ilah yoktur. Ve şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.` },
  { id: "salli", name: "Allâhumme Salli", arabic: `اللّٰهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ\nوَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline salât eyle.` },
  { id: "barik", name: "Allâhumme Bârik", arabic: `اللّٰهُمَّ بَارِكْ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ\nوَعَلَىٰ آلِ سَيِّدِنَا مُحَمَّدٍ`, translit: `Allâhümme bârik alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.`, meaning: `Allah’ım! Efendimiz Muhammed’e ve onun âline bereket ver.` },
  { id: "rabbenaatina", name: "Rabbena Âtinâ", arabic: `رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ`, translit: `Rabbenâ âtinâ fid-dünyâ haseneten ve fil âhireti haseneten ve kınâ azâben nâr.`, meaning: `Rabbimiz! Bize dünyada iyilik, ahirette de iyilik ver ve bizi ateş azabından koru.` },
  { id: "rabbenağfirli", name: "Rabbenağfirli", arabic: `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ`, translit: `Rabbiğfir lî ve livâlideyye ve lil mü'minîne yevme yekûmül hisâb.`, meaning: `Rabbim! Beni, anne-babamı ve hesabın görüleceği günde bütün müminleri bağışla.` },
  { id: "kunut_hanefi", name: "Kunut (Hanefî)", arabic: `اللّٰهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ...`, translit: `Allâhümme innâ nesteînüke ve nestağfirüke...`, meaning: `Allah’ım! Senden yardım ister, bağışlanma diler ve Sana dayanırız.` },
  { id: "kunut_shafii", name: "Kunut (Şâfiî)", arabic: `اللّٰهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ...`, translit: `Allâhümmehdinî fîmen hedeyt...`, meaning: `Allah’ım! Hidayet verdiklerin arasında bana da hidayet ver.` },
];

const zikrData = [
  { id: "subhanallah", name: "Sübhanallah", arabic: "سُبْحَانَ اللّٰهِ", translit: "Sübhanallah", meaning: "Allah’ı bütün eksikliklerden tenzih ederim.", defaultTarget: 33 },
  { id: "elhamdulillah", name: "Elhamdülillah", arabic: "الْحَمْدُ لِلّٰهِ", translit: "Elhamdülillah", meaning: "Hamd Allah’a mahsustur.", defaultTarget: 33 },
  { id: "allahu_ekber", name: "Allahu Ekber", arabic: "اللّٰهُ أَكْبَرُ", translit: "Allahu Ekber", meaning: "Allah en büyüktür.", defaultTarget: 33 },
  { id: "la_ilaha", name: "Lâ ilâhe illallâh", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ", translit: "Lâ ilâhe illallâh", meaning: "Allah’tan başka ilah yoktur.", defaultTarget: 33 },
  { id: "estagfirullah", name: "Estağfirullah", arabic: "أَسْتَغْفِرُ اللّٰهَ", translit: "Estağfirullah", meaning: "Allah’tan bağışlanma dilerim.", defaultTarget: 33 },
  { id: "salavat", name: "Salavat-ı Şerif", arabic: "اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", translit: "Allâhümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.", meaning: "Peygamber Efendimize salavat getirir.", defaultTarget: 33 },
  { id: "lahaula", name: "Lâ havle ve lâ kuvvete", arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ", translit: "Lâ havle ve lâ kuvvete illâ billâh", meaning: "Güç ve kuvvet ancak Allah’ladır.", defaultTarget: 33 },
  { id: "hasbunallah", name: "Hasbunallahu", arabic: "حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ", translit: "Hasbunallâhu ve ni'mel vekîl", meaning: "Allah bize yeter, O ne güzel vekildir.", defaultTarget: 33 },
  { id: "subhanallahi", name: "Sübhanallahi ve bihamdihi", arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", translit: "Sübhanallahi ve bihamdihi", meaning: "Allah’ı hamdiyle tesbih ederim.", defaultTarget: 100 },
  { id: "bismillah", name: "Bismillâhillazî lâ yedurru", arabic: "بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ", translit: "Bismillâhillazî lâ yedurru", meaning: "Allah’ın adıyla; O’nun adıyla hiçbir şey zarar vermez.", defaultTarget: 3 },
  { id: "takbir100", name: "Allahu Ekber (Takbir)", arabic: "اللّٰهُ أَكْبَرُ", translit: "Allahu Ekber", meaning: "Allah en büyüktür.", defaultTarget: 100 },
];

const DEFAULT_STATE = {
  auth: false,
  username: "furkancittir",
  xp: 1150,
  gems: 24,
  level: 3,
  dailyStreak: 6,
  prayerStreak: 0,
  missedPrayers: 12,
  monthlyMissed: 4,
  prayerDone: emptyPrayer(),
  prayerHistory: [],
  lastPrayerDate: "",
  surahProgress: { fatiha: 33, fil: 18, ihlas: 33, felak: 33, nas: 33, ayetelkursi: 12 },
  surahStatuses: { fatiha: "memorized", fil: "in_progress", ihlas: "memorized", felak: "memorized", nas: "memorized", ayetelkursi: "in_progress" },
  totalReadCounts: {},
  selectedTab: "home",
  selectedSurah: "fatiha",
  selectedDua: "ettehiyyat",
  surahSort: "usage",
  notifications: ["Bugün Öğle namazını kılmayı unutma!", "Felak Suresi hatırlatma günü!", "Tesbihat zamanı!"],
  tesbihatType: "short",
  tesbihatIndex: 0,
  tesbihatProgress: [],
  zikrSelected: "subhanallah",
  zikrTarget: 33,
  zikrCounts: {},
  dailyLogs: { date: "", zikrs: [], duas: [] },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
    if (!Array.isArray(parsed.prayerHistory)) parsed.prayerHistory = [];
    if (!parsed.prayerDone) parsed.prayerDone = emptyPrayer();
    if (!parsed.dailyLogs) parsed.dailyLogs = { date: "", zikrs: [], duas: [] };
    if (!parsed.surahStatuses) parsed.surahStatuses = DEFAULT_STATE.surahStatuses;
    if (!parsed.surahProgress) parsed.surahProgress = DEFAULT_STATE.surahProgress;
    if (!parsed.zikrCounts) parsed.zikrCounts = {};
    if (!parsed.totalReadCounts) parsed.totalReadCounts = {};
    if (!parsed.selectedTab || parsed.selectedTab === "oyun") parsed.selectedTab = "home";
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

function calculatePrayerStreak(history = []) {
  const map = new Map((history || []).filter(Boolean).map((x) => [x.date, Number(x.count || 0)]));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const t = cursor.toISOString().slice(0, 10);
  if ((map.get(t) || 0) < 5) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (streak < 365) {
    const key = cursor.toISOString().slice(0, 10);
    if ((map.get(key) || 0) >= 5) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

function getPrayerSeries(history = [], days = 7) {
  const map = new Map((history || []).filter(Boolean).map((x) => [x.date, Number(x.count || 0)]));
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
    const syncDay = () => {
      const t = todayKey();
      setState((s) => {
        if (s.lastPrayerDate === t) return s;
        const history = Array.isArray(s.prayerHistory) ? s.prayerHistory : [];
        const todayEntry = history.find((x) => x.date === t);
        const count = Object.values(s.prayerDone || emptyPrayer()).filter(Boolean).length;
        const nextHistory = todayEntry ? history : [...history, { date: t, count }];
        return { ...s, lastPrayerDate: t, prayerHistory: nextHistory.slice(-30), prayerDone: emptyPrayer() };
      });
    };
    syncDay();
    const timer = setInterval(syncDay, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setState((s) => ({ ...s, level: Math.floor(s.xp / 500) + 1 }));
  }, [state.xp]);

  const selectedSurah = surahData.find((s) => s.id === state.selectedSurah) || surahData[0];
  const selectedDua = duaData.find((d) => d.id === state.selectedDua) || duaData[0];
  const selectedZikr = zikrData.find((z) => z.id === state.zikrSelected) || zikrData[0];
  const prayerStreak = calculatePrayerStreak(state.prayerHistory);
  const prayerSeries = getPrayerSeries(state.prayerHistory, 7);
  const todayCount = Object.values(state.prayerDone).filter(Boolean).length;
  const prayerFinished = todayCount === 5;

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

  function handleLogin(e) {
    e.preventDefault();
    if (inputUser.trim() === "furkancittir" && inputPass === "1234") {
      setState((s) => ({ ...s, auth: true, selectedTab: "home" }));
      setLoginError("");
    } else setLoginError("Hatalı kullanıcı adı veya şifre!");
  }

  function logout() {
    setState((s) => ({ ...s, auth: false }));
  }

  function markPrayer(id) {
    setState((s) => {
      const t = todayKey();
      const prayerDone = { ...s.prayerDone, [id]: !s.prayerDone[id] };
      const count = Object.values(prayerDone).filter(Boolean).length;
      const history = Array.isArray(s.prayerHistory) ? s.prayerHistory : [];
      const updatedHistory = history.some((x) => x.date === t)
        ? history.map((x) => (x.date === t ? { date: t, count } : x))
        : [...history, { date: t, count }];
      return { ...s, prayerDone, prayerHistory: updatedHistory.slice(-30), lastPrayerDate: t, prayerStreak: count === 5 ? calculatePrayerStreak(updatedHistory) : s.prayerStreak, xp: s.xp + (count === 5 ? 50 : 0), gems: s.gems + (count === 5 ? 2 : 0) };
    });
    if (prayerFinished) setCelebrate("Tüm vakit namazları tamamlandı!");
  }

  function addSurahRead(id) {
    setState((s) => {
      const next = (s.surahProgress[id] || 0) + 1;
      const nextStatus = next >= 33 ? "memorized" : next > 0 ? "in_progress" : "not_started";
      return { ...s, surahProgress: { ...s.surahProgress, [id]: next }, totalReadCounts: { ...(s.totalReadCounts || {}), [id]: ((s.totalReadCounts || {})[id] || 0) + 1 }, surahStatuses: { ...s.surahStatuses, [id]: nextStatus }, xp: s.xp + 2 };
    });
  }

  function setSurahStatus(id, status) {
    setState((s) => ({ ...s, surahStatuses: { ...s.surahStatuses, [id]: status } }));
  }

  function markDuaRead(duaId) {
    const name = duaData.find((d) => d.id === duaId)?.name || duaId;
    setState((s) => {
      const t = todayKey();
      const dailyLogs = s.dailyLogs?.date === t ? s.dailyLogs : { date: t, zikrs: [], duas: [] };
      const duas = dailyLogs.duas.includes(name) ? dailyLogs.duas : [...dailyLogs.duas, name];
      return { ...s, dailyLogs: { ...dailyLogs, duas } };
    });
  }

  function selectZikr(id, target) {
    setState((s) => ({ ...s, zikrSelected: id, zikrTarget: target, zikrCounts: { ...s.zikrCounts, [id]: s.zikrCounts?.[id] || 0 } }));
  }

  function addZikr() {
    setState((s) => {
      const next = (s.zikrCounts?.[s.zikrSelected] || 0) + 1;
      const t = todayKey();
      const dailyLogs = s.dailyLogs?.date === t ? s.dailyLogs : { date: t, zikrs: [], duas: [] };
      const zikrName = selectedZikr?.name || s.zikrSelected;
      const zikrs = dailyLogs.zikrs.includes(zikrName) ? dailyLogs.zikrs : [...dailyLogs.zikrs, zikrName];
      return { ...s, zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: next }, dailyLogs: { ...dailyLogs, zikrs }, xp: s.xp + 1 };
    });
  }

  function resetZikr() {
    setState((s) => ({ ...s, zikrCounts: { ...s.zikrCounts, [s.zikrSelected]: 0 } }));
  }

  function currentTesbihatSteps() {
    const ayet = surahData.find((s) => s.id === "ayetelkursi");
    return [
      { key: "istigfar", label: "İstiğfar ve Selam Duası", title: "Estagfirullah, estagfirullah, estagfirullah. Allahümme entes-selamü ve minkes-selam, tebarekte ya zel-celali vel-ikram.", meaning: "Allah’ım! Sen selam sahibisin, selam/esenlik ancak Sendedir. Ey celal ve ikram sahibi Rabbim, Sen ne yücesin.", count: 1 },
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

  const nav = [["home", Home, "Ana Sayfa"], ["sureler", BookOpen, "Sureler"], ["tesbihat", Layers3, "Tesbihat"], ["zikir", Sparkles, "Zikirmatic"], ["profil", User, "Profil"]];
  const selectedZikrCount = state.zikrCounts?.[state.zikrSelected] || 0;

  if (!state.auth) {
    return (
      <div className="min-h-screen bg-[#faf7f0] flex items-center justify-center p-4 text-slate-800">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs text-emerald-700 font-semibold mb-4"><Sparkles className="h-3.5 w-3.5" /> İlim Yolu</div>
          <h1 className="text-2xl font-bold text-emerald-950">Giriş Yap</h1>
          <p className="text-xs text-slate-500 mt-1 mb-5">Kişisel ibadet alanına erişmek için giriş yapın.</p>
          {loginError && <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl">{loginError}</div>}
          <div className="space-y-3">
            <label className="block"><div className="text-xs font-semibold mb-1">Kullanıcı adı</div><input value={inputUser} onChange={(e) => setInputUser(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></label>
            <label className="block"><div className="text-xs font-semibold mb-1">Şifre</div><input type="password" value={inputPass} onChange={(e) => setInputPass(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></label>
            <button type="submit" className="w-full rounded-2xl bg-emerald-700 py-3 font-semibold text-white">Giriş Yap</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f0] text-slate-900">
      <div className="mx-auto max-w-[1400px] p-4 pb-24 lg:p-6">
        <header className="mb-4 rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700"><Sparkles className="h-4 w-4" /> İlim Yolu</div>
              <h2 className="mt-1 text-2xl font-black text-emerald-950">Selam, {state.username || "misafir"}</h2>
              <p className="text-sm text-slate-600">Bugün {todayCount}/5 namaz · Serin {prayerStreak} gün</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat label="XP" value={state.xp} icon={Zap} />
              <MiniStat label="Seviye" value={state.level} icon={Crown} />
              <MiniStat label="Gems" value={state.gems} icon={Gem} />
              <MiniStat label="Kaza" value={state.missedPrayers} icon={AlertTriangle} />
            </div>
          </div>
        </header>

        {celebrate && <div className="mb-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm"><div className="flex items-center gap-2 font-semibold"><Trophy className="h-5 w-5" /> {celebrate}</div></div>}

        {state.selectedTab === "home" && <HomeView state={state} prayerFinished={prayerFinished} markPrayer={markPrayer} todayCount={todayCount} prayerStreak={prayerStreak} markDuaRead={markDuaRead} />}
        {state.selectedTab === "sureler" && <SurahView selectedSurah={selectedSurah} selectedDua={selectedDua} filteredSurahs={filteredSurahs} search={search} setSearch={setSearch} sort={state.surahSort} setSort={(v) => setState((s) => ({ ...s, surahSort: v }))} progress={state.surahProgress} statuses={state.surahStatuses} setSelectedSurah={(id) => setState((s) => ({ ...s, selectedSurah: id }))} setSelectedDua={(id) => setState((s) => ({ ...s, selectedDua: id }))} setSurahStatus={setSurahStatus} addSurahRead={addSurahRead} />}
        {state.selectedTab === "tesbihat" && <TesbihatView state={state} tesbihatSteps={tesbihatSteps} currentStep={currentStep} currentStepCount={currentStepCount} incTesbihatStep={incTesbihatStep} prevTesbihatStep={prevTesbihatStep} completeTesbihat={completeTesbihat} setState={setState} />}
        {state.selectedTab === "zikir" && <ZikirView zikrData={zikrData} selectedZikr={selectedZikr} selectedZikrCount={selectedZikrCount} target={state.zikrTarget} selectZikr={selectZikr} addZikr={addZikr} resetZikr={resetZikr} counts={state.zikrCounts || {}} />}
        {state.selectedTab === "profil" && <ProfileView state={state} logout={logout} prayerStreak={prayerStreak} prayerSeries={prayerSeries} />}
      </div>
      <nav className="fixed inset-x-0 bottom-0 border-t border-emerald-100 bg-white/95 backdrop-blur z-50">
        <div className="mx-auto grid max-w-[1400px] grid-cols-5 gap-1 p-2">
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

function HomeView({ state, prayerFinished, markPrayer, todayCount, prayerStreak, markDuaRead }) {
  const prayerCards = [
    { id: "sabah", tr: "Sabah", en: "Fajr" },
    { id: "ogle", tr: "Öğle", en: "Dhuhr" },
    { id: "ikindi", tr: "İkindi", en: "Asr" },
    { id: "aksam", tr: "Akşam", en: "Maghrib" },
    { id: "yatsi", tr: "Yatsı", en: "Isha" },
  ];
  const today = todayKey();
  const isToday = state.dailyLogs?.date === today;
  const todayZikrs = isToday && state.dailyLogs?.zikrs?.length ? state.dailyLogs.zikrs.join(" • ") : "Henüz kayıt yok";
  const todayDuas = isToday && state.dailyLogs?.duas?.length ? state.dailyLogs.duas.join(" • ") : "Henüz kayıt yok";
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <section className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div><h3 className="text-xl font-bold text-emerald-950">Bugünün Özeti</h3><p className="text-sm text-slate-600">Yeni başlayan kullanıcı için sade ve yol gösterici.</p></div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">Streak {prayerStreak}</div>
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${(todayCount / 5) * 100}%` }} /></div>
          <div className="mt-3 text-sm text-slate-600">Bugün {todayCount}/5 namaz kılındı</div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-700"><div className="font-semibold text-emerald-800">Bugünkü zikirler</div><div className="mt-1">{todayZikrs}</div></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-700"><div className="font-semibold text-emerald-800">Bugünkü dualar</div><div className="mt-1">{todayDuas}</div><button onClick={() => markDuaRead(state.selectedDua)} className="mt-2 rounded-xl bg-emerald-700 px-3 py-1.5 text-[11px] font-semibold text-white">Bu duayı okudum</button></div>
          </div>
        </section>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-emerald-950">Vakit Namazları</h3><div className={`rounded-full px-3 py-1 text-xs font-semibold ${prayerFinished ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>{prayerFinished ? "Tümü tamam" : `Eksik ${5 - todayCount}`}</div></div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {prayerCards.map((p) => {
              const done = state.prayerDone[p.id];
              return (
                <button key={p.id} onClick={() => markPrayer(p.id)} className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                  <div className="flex items-center justify-between"><div><div className="font-bold text-slate-900">{p.tr}</div><div className="text-xs text-slate-500">{p.en}</div></div><CheckCircle2 className={`h-5 w-5 ${done ? "text-emerald-700" : "text-slate-300"}`} /></div>
                  <div className="mt-3 text-sm text-slate-600">{done ? "Kılındı ✓" : "Kılınmadı"}</div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
      <aside className="space-y-4">
        <section className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm"><h3 className="text-lg font-bold text-emerald-950">Bugün ne yapayım?</h3><div className="mt-3 space-y-2 text-sm"><TaskLine text="İhlâs oku" done={!!(state.surahProgress.ihlas > 0)} /><TaskLine text="Ayetel Kürsi oku" done={!!(state.surahProgress.ayetelkursi > 0)} /><TaskLine text="Kısa Tesbihat bitir" done={state.tesbihatIndex > 0} /><TaskLine text="Seçili zikri 33 kez tamamla" done={!!((state.zikrCounts || {})[state.zikrSelected] >= 33)} /></div></section>
        <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><h3 className="text-lg font-bold text-emerald-950">Bildirimler</h3><div className="mt-3 space-y-2">{state.notifications.map((n, i) => <div key={i} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">{n}</div>)}</div></section>
      </aside>
    </div>
  );
}

function SurahView({ selectedSurah, selectedDua, filteredSurahs, search, setSearch, sort, setSort, progress, statuses, setSelectedSurah, setSelectedDua, setSurahStatus, addSurahRead }) {
  const activeStatus = statuses[selectedSurah.id] || "not_started";
  const statusMeta = { memorized: ["Hafızada", "bg-emerald-100 text-emerald-800"], in_progress: ["Devam ediyor", "bg-amber-100 text-amber-800"], not_started: ["Sıfırlandı", "bg-slate-100 text-slate-600"] };
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h3 className="text-xl font-bold text-emerald-950">Sureler</h3><p className="text-sm text-slate-600">Seçtiğin sure hemen sağ panelde açılır.</p></div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2 text-sm"><Search className="h-4 w-4" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara" className="bg-transparent outline-none" /></div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border bg-white px-3 py-2 text-sm outline-none"><option value="usage">Kullanım sıklığı</option><option value="length">Uzunluk</option><option value="alphabetical">Alfabetik</option></select>
          </div>
        </div>
        <div className="mt-4 max-h-[72vh] space-y-2 overflow-y-auto pr-1">
          {filteredSurahs.map((s) => {
            const count = progress[s.id] || 0;
            const status = statuses[s.id] || (count >= 33 ? "memorized" : count > 0 ? "in_progress" : "not_started");
            return (
              <button key={s.id} onClick={() => setSelectedSurah(s.id)} className={`w-full rounded-3xl border p-4 text-left transition ${selectedSurah.id === s.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-white"}`}>
                <div className="flex items-start justify-between gap-2"><div><div className="font-bold text-slate-900">{s.name}</div><div className="text-xs text-slate-500">{s.arabicTitle} · {s.verses} ayet</div></div><StatusBadge status={status} /></div>
                <div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.min(100, (count / 33) * 100)}%` }} /></div>
                <div className="mt-2 text-xs text-slate-500">Bu sure: {count} okuma</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-4">
        <div className="sticky top-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <FullCard title={selectedSurah.name} subtitle={`${selectedSurah.arabicTitle} · ${selectedSurah.verses} ayet`}>
            <div className="grid gap-4 lg:grid-cols-[0.3fr_0.7fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-right"><div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Arapça</div><div className="text-[12px] leading-6 text-slate-700" dir="rtl" style={{ lineHeight: 2.05 }}>{selectedSurah.arabic}</div></div>
              <div className="space-y-3 rounded-3xl bg-emerald-50 p-4"><div className="rounded-2xl bg-white p-4"><div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Türkçe okunuş</div><div className="mt-2 text-base leading-8 text-slate-800">{selectedSurah.translit}</div></div><div className="rounded-2xl bg-white p-4"><div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Türkçe meal</div><div className="mt-2 text-base leading-8 text-slate-800">{selectedSurah.meaning}</div></div></div>
            </div>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3"><div><div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Durum</div><div className="mt-1 text-sm text-slate-700">Hafızada / devam ediyor / sıfırlandı.</div></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta[activeStatus][1]}`}>{statusMeta[activeStatus][0]}</span></div>
              <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setSurahStatus(selectedSurah.id, "memorized")} className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Hafızada</button><button onClick={() => setSurahStatus(selectedSurah.id, "in_progress")} className="rounded-2xl border px-4 py-2 text-sm font-semibold">Devam ediyor</button><button onClick={() => setSurahStatus(selectedSurah.id, "not_started")} className="rounded-2xl border px-4 py-2 text-sm font-semibold">Sıfırla</button></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => addSurahRead(selectedSurah.id)} className="rounded-2xl bg-emerald-700 px-4 py-2 font-semibold text-white">+1 okuma</button><div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold">{selectedSurah.id} · {progress[selectedSurah.id] || 0} kayıt</div></div>
          </FullCard>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="text-lg font-bold text-emerald-950">Dualar</h4>
          <div className="mt-3 flex flex-wrap gap-2">{duaData.map((d) => <button key={d.id} onClick={() => setSelectedDua(d.id)} className={`rounded-2xl border px-3 py-2 text-sm ${selectedDua.id === d.id ? "border-emerald-500 bg-emerald-50" : "bg-slate-50"}`}>{d.name}</button>)}</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[0.3fr_0.7fr]"><div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-right text-[12px] leading-6" dir="rtl" style={{ lineHeight: 2.05 }}>{selectedDua.arabic}</div><div className="space-y-3"><div className="rounded-2xl bg-emerald-50 p-4"><div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Okunuş</div><div className="mt-2 text-base leading-8 text-slate-800">{selectedDua.translit}</div></div><div className="rounded-2xl border bg-white p-4"><div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Anlam</div><div className="mt-2 text-base leading-8 text-slate-800">{selectedDua.meaning}</div></div></div></div>
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
        <div className="mt-4 flex rounded-2xl bg-slate-100 p-1"><button onClick={() => setState((s) => ({ ...s, tesbihatType: "short", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${state.tesbihatType === "short" ? "bg-white shadow" : ""}`}>Kısa Tesbihat</button><button onClick={() => setState((s) => ({ ...s, tesbihatType: "long", tesbihatIndex: 0, tesbihatProgress: [] }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${state.tesbihatType === "long" ? "bg-white shadow" : ""}`}>Uzun Tesbihat</button></div>
        <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4"><div className="text-sm font-semibold text-emerald-900">İlerleme</div><div className="mt-2 h-3 rounded-full bg-white"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${((state.tesbihatIndex + 1) / tesbihatSteps.length) * 100}%` }} /></div><div className="mt-2 text-sm text-emerald-900">Adım {state.tesbihatIndex + 1} / {tesbihatSteps.length}</div></div>
        <div className="mt-4 flex gap-2"><button onClick={prevTesbihatStep} className="flex items-center gap-2 rounded-2xl border px-4 py-2 font-semibold"><ChevronLeft className="h-4 w-4" /> Önceki</button><button onClick={() => setState((s) => ({ ...s, tesbihatIndex: Math.min(tesbihatSteps.length - 1, s.tesbihatIndex + 1) }))} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-4 text-base font-semibold text-white md:w-auto md:text-lg"><ChevronRight className="h-5 w-5" /> Sonraki Adım</button></div>
        <button onClick={completeTesbihat} className="mt-4 w-full rounded-2xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-lg shadow-amber-100">Tesbihatı tamamlandı işaretle</button>
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="rounded-3xl bg-emerald-50 p-4"><div className="text-sm font-semibold text-emerald-800">{state.tesbihatType === "short" ? "Kısa" : "Uzun"} Tesbihat · Adım {state.tesbihatIndex + 1}</div><div className="mt-2 text-2xl font-black text-emerald-950">{currentStep.label}</div><div className="mt-2 text-sm text-slate-600">{currentStep.count > 1 ? `${currentStepCount} / ${currentStep.count}` : "Bu adım tek sefer okunur."}</div></div>
        <div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Okunuş</div><div className="mt-2 text-base leading-8 text-slate-800">{currentStep.title}</div></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Anlam</div><div className="mt-2 text-base leading-8 text-slate-800">{currentStep.meaning}</div></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Tekrar</div><div className="mt-2 text-base leading-8 text-slate-800">{currentStep.count} kez</div></div></div>
        {currentStep.key === "ayetelkursi" && <div className="mt-4 rounded-3xl border border-emerald-100 bg-white p-4"><div className="text-sm font-semibold text-emerald-800">Ayetel Kürsi tam okunuş</div><div className="mt-3 text-[14px] leading-8 text-slate-800">{surahData.find((s) => s.id === "ayetelkursi")?.translit}</div><div className="mt-3 text-right text-[12px] leading-6 text-slate-600" dir="rtl">{surahData.find((s) => s.id === "ayetelkursi")?.arabic}</div></div>}
        {currentStep.count > 1 ? <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-center"><div className="text-4xl font-black text-emerald-700">{currentStepCount}/{currentStep.count}</div><div className="mt-2 text-sm text-slate-600">Her tekrar için +1 bas.</div><button onClick={incTesbihatStep} className="mt-4 w-full rounded-2xl bg-emerald-700 px-5 py-4 text-lg font-semibold text-white">+1</button></div> : <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Sonraki adıma geçmek için tek seferlik okuma yeterli.</div>}
      </div>
    </div>
  );
}

function ZikirView({ zikrData, selectedZikr, selectedZikrCount, target, selectZikr, addZikr, resetZikr, counts }) {
  return (
    <div className="space-y-4">
      <div className="sticky top-4 rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3"><div><h3 className="text-xl font-bold text-emerald-950">Zikirmatic</h3><p className="text-sm text-slate-600">Önce zikri seç, üstteki sayaç sabit kalsın.</p></div><div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">Hedef {target}</div></div>
        <div className="mt-4 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div><div className="text-sm font-semibold text-emerald-800">Seçili zikrin sayacı</div><div className="text-2xl font-black text-emerald-950">{selectedZikr.name}</div></div><div className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-emerald-900">Bu zikir: {selectedZikrCount}</div></div><div className="mt-4 rounded-3xl bg-white p-4 text-center"><div className="text-right text-3xl leading-10 text-emerald-950" dir="rtl">{selectedZikr.arabic}</div><div className="mt-3 text-lg font-semibold text-slate-900">{selectedZikr.translit}</div><div className="mt-2 text-sm text-slate-600">{selectedZikr.meaning}</div></div><div className="mt-4 flex gap-2"><button onClick={addZikr} className="flex-1 rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white">+1</button><button onClick={resetZikr} className="rounded-2xl border px-4 py-3 font-semibold"><RotateCcw className="h-4 w-4" /></button></div></div>
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><h4 className="text-lg font-bold text-emerald-950">Zikir seç</h4><p className="text-sm text-slate-600">Aşağıdan seç, üst panel anında değişsin.</p><div className="mt-4 grid gap-2 md:grid-cols-2">{zikrData.map((z) => <button key={z.id} onClick={() => selectZikr(z.id, z.defaultTarget)} className={`rounded-3xl border p-4 text-left ${selectedZikr.id === z.id ? "border-emerald-500 bg-emerald-50" : "bg-slate-50"}`}><div className="font-semibold text-slate-900">{z.name}</div><div className="mt-1 text-right text-lg text-slate-800" dir="rtl">{z.arabic}</div><div className="mt-1 text-sm text-slate-600">{z.translit}</div><div className="mt-1 text-xs text-emerald-700">Bu zikir: {counts[z.id] || 0} kez</div></button>)}</div></div>
    </div>
  );
}

function ProfileView({ state, logout, prayerStreak, prayerSeries }) {
  const bars = prayerSeries || [];
  const max = Math.max(5, ...bars.map((b) => b.count));
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4"><div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-lg">FÇ</div><div><h3 className="text-lg font-bold text-emerald-950">Furkan Çittir</h3><p className="text-xs text-slate-500">Kişisel İbadet Profili</p></div></div>
        <div className="space-y-3"><ProfileLine label="Toplam XP" value={state.xp} /><ProfileLine label="Seviye" value={state.level} /><ProfileLine label="Günlük streak" value={state.dailyStreak} /><ProfileLine label="Namaz streak" value={prayerStreak} /><ProfileLine label="Gems" value={state.gems} /><ProfileLine label="Kaza namazı" value={state.missedPrayers} /></div>
        <div className="mt-4 flex gap-2"><button onClick={logout} className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 font-semibold text-white"><LogOut className="h-4 w-4" /> Çıkış yap</button></div>
      </div>
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><h4 className="text-lg font-bold text-emerald-950">Namaz Grafiği</h4><p className="text-sm text-slate-500">Tarih ve kılınan namaz sayısı.</p><div className="mt-4 space-y-3">{bars.map((b) => (<div key={b.date} className="grid grid-cols-[68px_1fr_28px] items-center gap-3"><div className="text-xs text-slate-500">{b.date.slice(5)}</div><div className="h-3 rounded-full bg-slate-100 overflow-hidden"><div className="h-3 rounded-full bg-emerald-600" style={{ width: `${Math.min(100, (b.count / max) * 100)}%` }} /></div><div className="text-xs font-semibold text-slate-700 text-right">{b.count}</div></div>))}</div></div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><h4 className="text-lg font-bold text-emerald-950">İlerleme</h4><div className="mt-3 grid gap-3 md:grid-cols-2"><ProfileLine label="Okunan sure adedi" value={Object.keys(state.surahProgress).length} /><ProfileLine label="Toplam okuma" value={Object.values(state.surahProgress).reduce((a, b) => a + b, 0)} /><ProfileLine label="Zikir türü" value={Object.keys(state.zikrCounts || {}).length} /><ProfileLine label="Bugünkü dua" value={(state.dailyLogs?.duas || []).length} /></div></div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4"><div className="flex items-center gap-2 text-emerald-800"><Icon className="h-4 w-4" /> <span className="text-xs uppercase tracking-[0.15em]">{label}</span></div><div className="mt-2 text-2xl font-black text-emerald-950">{value}</div></div>;
}

function MiniStat({ label, value, icon: Icon }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"><div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="h-3 w-3" /> {label}</div><div className="mt-1 font-bold text-slate-900">{value}</div></div>;
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return <label className="block"><div className="mb-1 text-sm font-semibold text-slate-700">{label}</div><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" /></label>;
}

function FullCard({ title, subtitle, children }) {
  return <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-emerald-950">{title}</h3><p className="text-sm text-slate-500">{subtitle}</p></div><Volume2 className="h-5 w-5 text-emerald-700" /></div><div className="mt-4">{children}</div></section>;
}

function StatusBadge({ status }) {
  const map = { memorized: ["Hafızada", "bg-emerald-100 text-emerald-800"], in_progress: ["Devam ediyor", "bg-amber-100 text-amber-800"], not_started: ["Sıfırlandı", "bg-slate-100 text-slate-600"] };
  const [label, style] = map[status] || map.not_started;
  return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${style}`}>{label}</span>;
}

function ProfileLine({ label, value }) {
  return <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span className="text-sm text-slate-600">{label}</span><span className="font-bold text-slate-900">{value}</span></div>;
}

function TaskLine({ text, done }) {
  return <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span>{text}</span>{done ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <CircleDot className="h-4 w-4 text-slate-300" />}</div>;
}

export default App;
