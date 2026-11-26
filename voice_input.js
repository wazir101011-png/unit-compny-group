(function (w) {
    'use strict';
    var App = w.App; if (!App) return;
    var D = document;
    function T(isEn, ur, en) { return isEn ? en : ur; }
    function load(k) { try { return App.store.get(k) || ''; } catch (e) { return ''; } }
    function store(k, v) { try { App.store.set(k, v); } catch (e) {} }

    var UNITS = {};
    ('صفر ایک دو تین چار پانچ چھ سات آٹھ نو دس گیارہ بارہ تیرہ چودہ پندرہ سولہ سترہ اٹھارہ انیس بیس اکیس بائیس تئیس چوبیس پچیس چھبیس ستائیس اٹھائیس انتیس تیس اکتیس بتیس تینتیس چونتیس پینتیس چھتیس سینتیس اڑتیس انتالیس چالیس اکتالیس بیالیس تینتالیس چوالیس پینتالیس چھیالیس سینتالیس اڑتالیس انچاس پچاس اکاون باون ترپن چوالن پچپن چھپن ستاون اٹھاون انسٹھ ساٹھ اکسٹھ باسٹھ ترسٹھ چونسٹھ پینسٹھ چھیاسٹھ سڑسٹھ اڑسٹھ انہتر ستر اکہتر بہتر تہتر چوہتر پچھتر چھہتر ستتر اٹھہتر اناسی اسی اکیاسی بیاسی تراسی چوراسی پچاسی چھیاسی ستاسی اٹھاسی نواسی نوے اکانوے بانوے ترانوے چورانوے پچانوے چھیانوے ستانوے اٹھانوے ننانوے').split(' ').forEach(function (x, i) { UNITS[x] = i; });
    ('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen').split(' ').forEach(function (x, i) { UNITS[x] = i; });
    ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'].forEach(function (x, i) { UNITS[x] = (i + 2) * 10; });
    var VARIANTS = { 'چھے': 6, 'چھہ': 6, 'چہ': 6, 'اٹھ': 8, 'گیاره': 11, 'بارا': 12, 'پندره': 15, 'سولا': 16, 'سترا': 17, 'اٹھاره': 18, 'اُنیس': 19, 'پچیس': 25, 'ڈیڑھ': 1.5, 'ڈیڑہ': 1.5, 'ڈھائی': 2.5, 'ڈھای': 2.5, 'سوا': 1.25, 'ایک': 1, 'اک': 1 };
    Object.keys(VARIANTS).forEach(function (k) { UNITS[fold(k)] = VARIANTS[k]; });
    Object.keys(UNITS).forEach(function (k) { var f = fold(k); if (f !== k) UNITS[f] = UNITS[k]; });
    var MULT = { 'ہزار': 1000, 'ہزارو': 1000, 'لاکھ': 100000, 'لاک': 100000, 'کروڑ': 10000000, 'ارب': 1000000000, 'کھرب': 100000000000, 'کهرب': 100000000000, thousand: 1000, lakh: 100000, lac: 100000, million: 1000000, crore: 10000000, arab: 1000000000, billion: 1000000000, kharab: 100000000000 };
    var HUNDRED = { 'سو': 1, hundred: 1 };
    var ENTER_WORDS = ['enter', 'انٹر', 'اینٹر', 'save', 'سیو', 'محفوظ', 'سیو کرو', 'محفوظ کرو', 'محفوظ کریں'].map(function (x) { return fold(x); });

    function fold(s) {
        return String(s).replace(/ي|ى|ئ(?=\s|$)/g, 'ی').replace(/ك/g, 'ک').replace(/ة/g, 'ہ').replace(/ه/g, 'ہ').replace(/ۀ/g, 'ہ').replace(/[ً-ٰٟ]/g, '').replace(/ۓ/g, 'ے');
    }
    var HIN = 'शून्य एक दो तीन चार पांच छह सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस बीस इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस चालीस इकतालीस बयालीस तैंतालीस चवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उन्यासी अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी नब्बे इक्यानवे बानवे तिरानवे चौरानवे पंचानवे छियानवे सत्तानवे अट्ठानवे निन्यानवे'.split(' ');
    function hfold(s) { s = String(s); return /[ऀ-ॿ]/.test(s) ? s.normalize('NFD').replace(/[़ँं]/g, '') : s; }
    HIN.forEach(function (x, i) { UNITS[hfold(x)] = i; });
    UNITS[hfold('छः')] = 6; UNITS[hfold('छे')] = 6; UNITS[hfold('पाँच')] = 5; UNITS[hfold('पन्द्रह')] = 15; UNITS[hfold('अठाईस')] = 28; UNITS[hfold('डेढ़')] = 1.5; UNITS[hfold('डेढ')] = 1.5; UNITS[hfold('ढाई')] = 2.5; UNITS[hfold('सवा')] = 1.25;
    HUNDRED[hfold('सौ')] = 1;
    [['अरब', 1000000000], ['खरब', 100000000000], ['हज़ार', 1000], ['हजार', 1000], ['लाख', 100000], ['करोड़', 10000000], ['करोड', 10000000]].forEach(function (p) { MULT[hfold(p[0])] = p[1]; });
    var HALF = { 'ساڑھے': 1 }; HALF[hfold('साढ़े')] = 1; HALF[hfold('साड़े')] = 1; HALF[hfold('साढे')] = 1;
    ENTER_WORDS = ENTER_WORDS.concat(['एंटर', 'इंटर', 'सेव', 'सेव करो', 'सेव कर दो', 'सेव करें'].map(hfold));

    var CONS = { 'क': 'ک', 'ख': 'کھ', 'ग': 'گ', 'घ': 'گھ', 'च': 'چ', 'छ': 'چھ', 'ज': 'ج', 'झ': 'جھ', 'ट': 'ٹ', 'ठ': 'ٹھ', 'ड': 'ڈ', 'ढ': 'ڈھ', 'ण': 'ن', 'त': 'ت', 'थ': 'تھ', 'द': 'د', 'ध': 'دھ', 'न': 'ن', 'प': 'پ', 'फ': 'ف', 'ब': 'ب', 'भ': 'بھ', 'म': 'م', 'य': 'ی', 'र': 'ر', 'ल': 'ل', 'व': 'و', 'श': 'ش', 'ष': 'ش', 'स': 'س', 'ह': 'ہ', 'ळ': 'ل' };
    var NUKTA = { 'क': 'ق', 'ख': 'خ', 'ग': 'غ', 'ज': 'ز', 'ड': 'ڑ', 'ढ': 'ڑھ', 'फ': 'ف' };
    var INDEP = { 'अ': 'ا', 'आ': 'آ', 'इ': 'ا', 'ई': 'ی', 'उ': 'ا', 'ऊ': 'او', 'ए': 'ے', 'ऐ': 'ے', 'ओ': 'او', 'औ': 'او', 'ऑ': 'آ' };
    var MATRA = { 'ा': 'ا', 'ि': '', 'ी': 'ی', 'ु': '', 'ू': 'و', 'ै': 'ے', 'ो': 'و', 'ौ': 'و', 'ॉ': 'ا', 'ं': 'ں', 'ँ': 'ں', 'ः': 'ہ', '्': '' };
    function isDev(t) { return /[ऀ-ॿ]/.test(t); }
    function translit(word) {
        var d = word.normalize('NFD'), out = '', i, c, n;
        for (i = 0; i < d.length; i++) {
            c = d[i]; n = d[i + 1];
            if (CONS[c]) { if (n === '़') { out += NUKTA[c] || CONS[c]; i++; } else out += CONS[c]; }
            else if (c === 'े') out += (n ? 'ی' : 'ے');
            else if (c === 'ै') out += (n ? 'ی' : 'ے');
            else if (MATRA.hasOwnProperty(c)) out += MATRA[c];
            else if (INDEP.hasOwnProperty(c)) out += INDEP[c];
            else if (c !== '़') out += c;
        }
        return out;
    }
    function skel(u) {
        return fold(u).replace(/پھ|ف/g, 'f').replace(/کھ|خ/g, 'x').replace(/[اآعءأئؤویےہںھ]/g, '').replace(/[کق]/g, 'k').replace(/[گغ]/g, 'g').replace(/[زذضظژ]/g, 'z').replace(/[سصث]/g, 's').replace(/[تطٹ]/g, 't').replace(/[دڈ]/g, 'd').replace(/[رڑ]/g, 'r').replace(/(.)\1+/g, '$1');
    }
    var known = {};
    function learn(text, w) { String(text || '').split(/[\s,،۔.:;()\/|\-]+/).forEach(function (x) { if (x.length > 1 && /[؀-ۿ]/.test(x)) { var k = skel(x); if (!k) return; var m = known[k] || (known[k] = {}); m[x] = (m[x] || 0) + w; } }); }
    function snap(u) {
        var k = skel(u), m = k.length > 2 && known[k];
        if (!m) return u;
        var best = u, bc = 0; Object.keys(m).forEach(function (x) { if (m[x] > bc) { bc = m[x]; best = x; } });
        return best;
    }
    var SEED = 'نقدی نقد کھاتہ خرچہ متفرق رقم جمع بنام فروٹ پھل پھول چاول آٹا دال چینی گھی تیل نمک مصالحہ چائے دودھ سبزی کپڑا کارٹن پیس نگ وزن ریٹ کلو من بوری تھیلا ڈبہ پیٹی دکان گاڑی کرایہ مزدوری تنخواہ ادائیگی وصولی بیلنس حساب کتاب بقایا ادھار نقد چیک بینک ٹرانسپورٹ لوڈنگ خریداری فروخت ٹوٹل صاحب خان شاہ علی احمد محمد حسین حسن عمران عباس بھائی ملک چوہدری سیٹھ میاں'.split(' ');
    ('ادھار واپسی رسید بل کٹوتی کمیشن منافع نقصان قسط پیشگی بیعانہ ڈیزل پٹرول بجلی گیس پانی ٹیکس میزان ڈرائی خشک تازہ سبز لال پیلا کالا سفید بڑا چھوٹا درمیانہ اعلیٰ مال سامان گودام ٹرک ٹرالی رکشہ بھاڑا ہول سیل ریٹیل روزانہ ماہانہ سالانہ پرانا نیا اوپننگ کھلا بند مکمل ادھورا سیب کیلا آم انار انگور کینو مالٹا خربوزہ تربوز آلو پیاز ٹماٹر لہسن ادرک مرچ ہلدی دھنیا چنا مونگ ماش مسور باجرہ گندم مکئی کپاس روئی ڈالر روپیہ روپے پیکنگ ڈسپیچ بلٹی کلیئرنس ڈیوٹی کسٹم بیگ ٹن گرام درجن درجنوں سو ہزار لاکھ کروڑ').split(' ').forEach(function (x) { SEED.push(x); });
    SEED.filter(function (x, i) { return x && SEED.indexOf(x) === i; }).forEach(function (x) { learn(x, 0.5); });
    function latin(s) {
        return fold(s).replace(/[۰-۹]/g, function (c) { return c.charCodeAt(0) - 0x06F0; }).replace(/[०-९]/g, function (c) { return c.charCodeAt(0) - 0x0966; }).replace(/[٠-٩]/g, function (c) { return c.charCodeAt(0) - 0x0660; }).replace(/٫/g, '.').replace(/٬/g, ',');
    }
    function isNumTok(t) { return HALF.hasOwnProperty(t) || /^\d+(\.\d+)?$/.test(t) || UNITS.hasOwnProperty(t) || MULT.hasOwnProperty(t) || HUNDRED.hasOwnProperty(t); }
    function runValue(toks) {
        var total = 0, cur = 0;
        var half = false;
        toks.forEach(function (t) {
            if (HALF.hasOwnProperty(t)) { half = true; return; }
            if (half && (/^\d/.test(t) || UNITS.hasOwnProperty(t))) { cur += (/^\d/.test(t) ? parseFloat(t) : UNITS[t]) + 0.5; half = false; return; }
            if (/^\d/.test(t)) cur += parseFloat(t);
            else if (UNITS.hasOwnProperty(t)) cur += UNITS[t];
            else if (HUNDRED.hasOwnProperty(t)) cur = (cur || 1) * 100;
            else { total += (cur || 1) * MULT[t]; cur = 0; }
        });
        return total + cur;
    }
    var STOPW = {}; 'है की का के से में को ने पर और या भी तो ही हो था थी थे जो'.split(' ').forEach(function (x) { STOPW[x] = 1; });
    function mergeLetters(toks) {
        var out = [], run = [];
        var flush = function () { if (run.length >= 3) out.push(run.join('')); else out = out.concat(run); run = []; };
        toks.forEach(function (t) {
            var short = (isDev(t) && hfold(t).length <= 2 && !STOPW[t] && !isNumTok(hfold(t).toLowerCase())) || (/^[؀-ۿ]$/.test(t) && !/\d/.test(t));
            if (short) run.push(t); else { flush(); out.push(t); }
        });
        flush();
        return out;
    }
    var fixes = null;
    function loadFixes() { if (!fixes) { try { fixes = JSON.parse(load('rohan_voice_fix')) || {}; } catch (e) { fixes = {}; } } return fixes; }
    function saveFix(raw, word) {
        var f = loadFixes(), keys = Object.keys(f);
        if (keys.length >= 600 && !f.hasOwnProperty(raw)) delete f[keys[0]];
        f[raw] = word; store('rohan_voice_fix', JSON.stringify(f));
    }
    var DICT_SRC = [
        ['दी', 'دی'],
        ['दिए', 'دیے'],
        ['दिये', 'دیے'],
        ['दिया', 'دیا'],
        ['दे', 'دے'],
        ['ली', 'لی'],
        ['लिए', 'لیے'],
        ['लिया', 'لیا'],
        ['को', 'کو'],
        ['से', 'سے'],
        ['ने', 'نے'],
        ['का', 'کا'],
        ['की', 'کی'],
        ['के', 'کے'],
        ['में', 'میں'],
        ['और', 'اور'],
        ['है', 'ہے'],
        ['हैं', 'ہیں'],
        ['थे', 'تھے'],
        ['थी', 'تھی'],
        ['था', 'تھا'],
        ['पर', 'پر'],
        ['भी', 'بھی'],
        ['भेजे', 'بھیجے'],
        ['भेजा', 'بھیجا'],
        ['भेजी', 'بھیجی'],
        ['मिले', 'ملے'],
        ['मिला', 'ملا'],
        ['मिली', 'ملی'],
        ['वसूल', 'وصول'],
        ['नकदी', 'نقدی'],
        ['नकद', 'نقد'],
        ['जमा', 'جمع'],
        ['बनाम', 'بنام'],
        ['खाता', 'کھاتہ'],
        ['बैंक', 'بینک'],
        ['चेक', 'چیک'],
        ['रुपये', 'روپے'],
        ['रुपए', 'روپے'],
        ['रुपया', 'روپیہ'],
        ['उधार', 'ادھار'],
        ['वापसी', 'واپسی'],
        ['रसीद', 'رسید'],
        ['हिसाब', 'حساب'],
        ['किराया', 'کرایہ'],
        ['मज़दूरी', 'مزدوری'],
        ['तनख्वाह', 'تنخواہ'],
        ['कैश', 'کیش'],
        ['पेमेंट', 'پیمنٹ'],
        ['ट्रांसफर', 'ٹرانسفر'],
        ['ऑनलाइन', 'آن لائن'],
        ['ईज़ीपैसा', 'ایزی پیسہ'],
        ['ईज़ी पैसा', 'ایزی پیسہ'],
        ['जैज़कैश', 'جاز کیش'],
        ['जैज़ कैश', 'جاز کیش'],
        ['मीज़ान', 'میزان'],
        ['मीज़ान बैंक', 'میزان بینک'],
        ['हबीब बैंक', 'حبیب بینک'],
        ['अल हबीब', 'الحبیب'],
        ['अल फलाह', 'الفلاح'],
        ['अलफ़लाह', 'الفلاح'],
        ['बैंक अल फलाह', 'بینک الفلاح'],
        ['बैंक अलफलाह', 'بینک الفلاح'],
        ['बैंक अल हबीब', 'بینک الحبیب'],
        ['यूबीएल', 'یو بی ایل'],
        ['एचबीएल', 'ایچ بی ایل'],
        ['एमसीबी', 'ایم سی بی'],
        ['एबीएल', 'اے بی ایل'],
        ['फ़ैसल बैंक', 'فیصل بینک'],
        ['मीज़ान', 'میزان'],
        ['स्टेट बैंक', 'اسٹیٹ بینک'],
        ['रिज़वान', 'رضوان'],
        ['अताउल्लाह', 'عطاء اللہ'],
        ['हबीबुल्लाह', 'حبیب اللہ'],
        ['सैफुल्लाह', 'سیف اللہ'],
        ['रहमतुल्लाह', 'رحمت اللہ'],
        ['अमानुल्लाह', 'امان اللہ'],
        ['ज़ियाउल्लाह', 'ضیاء اللہ'],
        ['कलीमुल्लाह', 'کلیم اللہ'],
        ['इनायतुल्लाह', 'عنایت اللہ'],
        ['फ़ज़लुल्लाह', 'فضل اللہ'],
        ['नसरुल्लाह', 'نصر اللہ'],
        ['अब्दुल्लाह', 'عبداللہ'],
        ['अब्दुल रहमान', 'عبدالرحمن'],
        ['अब्दुल रहीम', 'عبدالرحیم'],
        ['अब्दुल करीम', 'عبدالکریم'],
        ['अब्दुल ग़फ़ूर', 'عبدالغفور'],
        ['अब्दुल वहाब', 'عبدالوہاب'],
        ['अब्दुल क़ादिर', 'عبدالقادر'],
        ['अब्दुल सत्तार', 'عبدالستار'],
        ['अब्दुल जब्बार', 'عبدالجبار'],
        ['अब्दुल मजीद', 'عبدالمجید'],
        ['अब्दुल हमीद', 'عبدالحمید'],
        ['अब्दुल रशीद', 'عبدالرشید'],
        ['अब्दुल अज़ीज़', 'عبدالعزیز'],
        ['अब्दुल हक़', 'عبدالحق'],
        ['अब्दुल ग़नी', 'عبدالغنی'],
        ['अब्दुल सलाम', 'عبدالسلام'],
        ['अब्दुल रज़्ज़ाक़', 'عبدالرزاق'],
        ['अब्दुल लतीफ़', 'عبداللطیف'],
        ['अब्दुल मालिक', 'عبدالمالک'],
        ['अब्दुर रहमान', 'عبدالرحمن'],
        ['मुहम्मद', 'محمد'],
        ['मोहम्मद', 'محمد'],
        ['मोहमद', 'محمد'],
        ['अहमद', 'احمد'],
        ['अली', 'علی'],
        ['हसन', 'حسن'],
        ['हुसैन', 'حسین'],
        ['उस्मान', 'عثمان'],
        ['उमर', 'عمر'],
        ['इमरान', 'عمران'],
        ['इरफ़ान', 'عرفان'],
        ['इक़बाल', 'اقبال'],
        ['इलियास', 'الیاس'],
        ['इस्माइल', 'اسماعیل'],
        ['इब्राहीम', 'ابراہیم'],
        ['इदरीस', 'ادریس'],
        ['यूसुफ़', 'یوسف'],
        ['यूनुस', 'یونس'],
        ['याक़ूब', 'یعقوب'],
        ['यासीन', 'یاسین'],
        ['ज़ाहिद', 'زاہد'],
        ['ज़ुबैर', 'زبیر'],
        ['ज़ीशान', 'ذیشان'],
        ['ज़ैद', 'زید'],
        ['शहज़ाद', 'شہزاد'],
        ['शाहिद', 'شاہد'],
        ['शफ़ीक़', 'شفیق'],
        ['शरीफ', 'شریف'],
        ['शकील', 'شکیل'],
        ['शहबाज़', 'شہباز'],
        ['सलमान', 'سلمان'],
        ['सलीम', 'سلیم'],
        ['सईद', 'سعید'],
        ['सादिक़', 'صادق'],
        ['साजिद', 'ساجد'],
        ['सफ़दर', 'صفدر'],
        ['सिद्दीक़', 'صدیق'],
        ['तारिक़', 'طارق'],
        ['तनवीर', 'تنویر'],
        ['तौसीफ़', 'توصیف'],
        ['तौक़ीर', 'توقیر'],
        ['नवाज़', 'نواز'],
        ['नदीम', 'ندیم'],
        ['नईम', 'نعیم'],
        ['नासिर', 'ناصر'],
        ['नवीद', 'نوید'],
        ['फ़ैसल', 'فیصل'],
        ['फ़ैज़', 'فیض'],
        ['फ़ारूक़', 'فاروق'],
        ['फ़रहान', 'فرحان'],
        ['फ़हीम', 'فہیم'],
        ['बिलाल', 'بلال'],
        ['बाबर', 'بابر'],
        ['बशीर', 'بشیر'],
        ['ख़ान', 'خان'],
        ['ख़ालिद', 'خالد'],
        ['ख़ुर्रम', 'خرم'],
        ['ख़लील', 'خلیل'],
        ['ग़ुलाम', 'غلام'],
        ['ग़नी', 'غنی'],
        ['हबीब', 'حبیب'],
        ['हामिद', 'حامد'],
        ['हारून', 'ہارون'],
        ['हनीफ़', 'حنیف'],
        ['हमज़ा', 'حمزہ'],
        ['हुमायूँ', 'ہمایوں'],
        ['जावेद', 'جاوید'],
        ['जमील', 'جمیل'],
        ['जुनैद', 'جنید'],
        ['जमशेद', 'جمشید'],
        ['जहांगीर', 'جہانگیر'],
        ['कामरान', 'کامران'],
        ['कबीर', 'کبیر'],
        ['करीम', 'کریم'],
        ['क़ासिम', 'قاسم'],
        ['क़ादिर', 'قادر'],
        ['ख़ुर्शीद', 'خورشید'],
        ['मंज़ूर', 'منظور'],
        ['मक़सूद', 'مقصود'],
        ['मुश्ताक़', 'مشتاق'],
        ['मुख़्तार', 'مختار'],
        ['मुनीर', 'منیر'],
        ['मुजाहिद', 'مجاہد'],
        ['मुबारक', 'مبارک'],
        ['मसूद', 'مسعود'],
        ['महमूद', 'محمود'],
        ['मोईन', 'معین'],
        ['मजीद', 'مجید'],
        ['रशीद', 'رشید'],
        ['रहमान', 'رحمان'],
        ['रहीम', 'رحیم'],
        ['रमज़ान', 'رمضان'],
        ['रफ़ीक़', 'رفیق'],
        ['रियाज़', 'ریاض'],
        ['रऊफ़', 'رؤف'],
        ['रज़ा', 'رضا'],
        ['रहमत', 'رحمت'],
        ['वसीम', 'وسیم'],
        ['वक़ार', 'وقار'],
        ['वहीद', 'وحید'],
        ['वक़ास', 'وقاص'],
        ['आसिफ़', 'آصف'],
        ['आरिफ़', 'عارف'],
        ['आबिद', 'عابد'],
        ['आदिल', 'عادل'],
        ['आमिर', 'عامر'],
        ['अमजद', 'امجد'],
        ['अकरम', 'اکرم'],
        ['अनवर', 'انور'],
        ['अकबर', 'اکبر'],
        ['अशरफ़', 'اشرف'],
        ['असलम', 'اسلم'],
        ['अनस', 'انس'],
        ['अब्बास', 'عباس'],
        ['अज़हर', 'اظہر'],
        ['अज़ीज़', 'عزیز'],
        ['अफ़ज़ल', 'افضل'],
        ['अफ़ताब', 'آفتاب'],
        ['आज़ाद', 'آزاد'],
        ['अल्ताफ़', 'الطاف'],
        ['इनायत', 'عنایت'],
        ['इसहाक़', 'اسحاق'],
        ['उबैद', 'عبید'],
        ['अयूब', 'ایوب'],
        ['अरशद', 'ارشد'],
        ['असद', 'اسد'],
        ['फ़ज़ल', 'فضل'],
        ['शेर', 'شیر'],
        ['शाह', 'شاہ'],
        ['सरदार', 'سردار'],
        ['चौधरी', 'چوہدری'],
        ['मलिक', 'ملک'],
        ['सेठ', 'سیٹھ'],
        ['मियाँ', 'میاں'],
        ['भाई', 'بھائی'],
        ['साहब', 'صاحب'],
        ['हाजी', 'حاجی'],
        ['क़ारी', 'قاری'],
        ['हाफ़िज़', 'حافظ'],
        ['डॉक्टर', 'ڈاکٹر'],
        ['मास्टर', 'ماسٹر'],
        ['उस्ताद', 'استاد'],
        ['अल्लाह', 'اللہ'],
        ['अल्लाह दित्ता', 'اللہ دتہ'],
        ['अल्लाह बख़्श', 'اللہ بخش'],
        ['रसूल', 'رسول'],
        ['बख़्श', 'بخش'],
        ['दीन', 'دین']
    ];
    function dkey(w) {
        return w.normalize('NFD').replace(/़/g, '').replace(/[ीि]/g, 'ि').replace(/[ूु]/g, 'ु').replace(/ै/g, 'े').replace(/ौ/g, 'ो').replace(/[ँं]/g, 'ं').replace(/्/g, '').replace(/ऐ/g, 'ए').replace(/ई/g, 'इ').replace(/ऊ/g, 'उ').replace(/[ॉऑ]/g, 'ा').replace(/\s+/g, '').replace(/ह$/, '');
    }
    var DICT = {}, DICT_MAX = 1;
    DICT_SRC.forEach(function (p) { DICT[dkey(p[0])] = p[1]; DICT_MAX = Math.max(DICT_MAX, Math.min(3, p[0].split(' ').length)); });
    DICT_SRC.forEach(function (p) { learn(p[1], 1); });
    function uskel(u) { return skel(u).replace(/ح/g, ''); }
    var userList = null, userAt = 0;
    function userWords() {
        if (!userList || Date.now() - userAt > 3000) {
            userAt = Date.now();
            try { userList = (w.App && App.voiceWords ? App.voiceWords.load() : []).map(function (e) { return { w: e.w, pats: [e.w, e.s].filter(Boolean).map(function (p) { return p.split(/\s+/).map(function (x) { return uskel(isDev(x) ? translit(x) : x); }).join(''); }), n: e.w.split(/\s+/).length }; }); } catch (e) { userList = []; }
        }
        return userList;
    }
    function applyUser(out) {
        var list = userWords(); if (!list.length) return out;
        var res = [], i = 0, max = 0, n, j, key, e, hit, k;
        list.forEach(function (x) { max = Math.max(max, x.n + 1, 4); });
        while (i < out.length) {
            hit = null;
            if (!out[i].num) for (n = Math.min(max, out.length - i); n >= 1 && !hit; n--) {
                for (j = 0, key = ''; j < n && !out[i + j].num; j++) key += uskel(out[i + j].v);
                if (j < n || key.length < 2) continue;
                for (k = 0; k < list.length && !hit; k++) { e = list[k]; if (e.pats.indexOf(key) > -1 && (key.length > 2 || n === e.n)) hit = { v: e.w, n: n }; }
            }
            if (hit) { res.push({ num: false, raw: out[i].raw, v: hit.v, d: true }); i += hit.n; } else { res.push(out[i]); i++; }
        }
        return res;
    }
    function tokens(text) {
        var PUNCT = /^[\s.,،۔।!?؟;:"“”'‘’()\-–—…]+|[\s.,،۔।!?؟;:"“”'‘’()\-–—…]+$/g;
        var toks = latin(text).replace(/(\d),(?=\d)/g, '$1').trim().split(/\s+/).map(function (t) { return t.replace(PUNCT, ''); }).filter(Boolean), out = [], run = [];
        toks = mergeLetters(toks);
        var flush = function () { if (run.length) { out.push({ num: true, v: String(runValue(run)) }); run = []; } };
        var i = 0, n, hit, j, key, fx;
        while (i < toks.length) {
            var t = toks[i], k = hfold(t).toLowerCase();
            if (isNumTok(k)) { run.push(k); i++; continue; }
            flush();
            hit = null;
            for (n = Math.min(DICT_MAX, toks.length - i); n >= 1 && !hit; n--) {
                for (j = 0; j < n && !isNumTok(hfold(toks[i + j]).toLowerCase()); j++);
                if (j < n) continue;
                key = dkey(toks.slice(i, i + n).join(' '));
                if (DICT[key] && !loadFixes()[hfold(t)]) hit = { v: DICT[key], n: n };
            }
            if (hit) { out.push({ num: false, raw: hfold(t), v: hit.v, d: true }); i += hit.n; continue; }
            fx = loadFixes()[hfold(t)];
            out.push({ num: false, raw: hfold(t), v: fx || (isDev(t) ? snap(translit(t)) : t) });
            i++;
        }
        flush();
        out.forEach(function (o, x) { if (o.raw === hfold('दूध') && out[x + 1] && /^(है|हैं|ہے|ہیں)$/.test(out[x + 1].raw) && !loadFixes()[o.raw]) { o.v = 'دی'; } });
        return applyUser(out);
    }
    function score(text) {
        var sc = 0;
        tokens(text).forEach(function (t) { if (t.num) return; var m = known[skel(t.v)]; if (t.d) sc += 3; if (loadFixes()[t.raw]) sc += 2; if (m) sc += m[t.v] ? 2 : 1; });
        return sc;
    }
    function pick(r) {
        var best = r[0].transcript, bs = score(best);
        for (var k = 1; k < r.length; k++) { var t = r[k].transcript, sc = score(t); if (sc > bs) { best = t; bs = sc; } }
        return best;
    }
    function textOf(list) { return list.map(function (t) { return t.v; }).join(' '); }

    var SKIP = { date: 1, checkbox: 1, radio: 1, file: 1, button: 1, submit: 1, reset: 1, hidden: 1, range: 1, color: 1, password: 1, time: 1, 'datetime-local': 1, month: 1, week: 1 };
    function usable(el) { return el && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && !SKIP[el.type])) && !el.readOnly && !el.disabled && !(el.closest && el.closest('#voiceMic')); }
    function numeric(el) { return el.type === 'number' || el.inputMode === 'numeric' || el.inputMode === 'decimal' || el.id === 'total_amount'; }
    function setVal(el, v) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }

    function put(el, list) {
        if (numeric(el)) {
            var n = list.filter(function (t) { return t.num; }).map(function (t) { return t.v; }).join('');
            if (n) setVal(el, n); else if (w.__vmNoDigits) w.__vmNoDigits(textOf(list));
            return;
        }
        var txt = textOf(list);
        if (!txt) return;
        var v = el.value, a = el.selectionStart, b = el.selectionEnd;
        if (typeof a !== 'number') { a = b = v.length; }
        var left = v.slice(0, a), right = v.slice(b), sp = left && !/\s$/.test(left) ? ' ' : '';
        el.value = left + sp + txt + right;
        try { var pos = (left + sp + txt).length; el.setSelectionRange(pos, pos); } catch (e) {}
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    App.voiceMic = function (o) {
        var isEn = !!o.isEn, SR = w.SpeechRecognition || w.webkitSpeechRecognition;
        if (D.getElementById('voiceMic')) return;
        var sp = D.createElement('style'); sp.textContent = '@media (max-width:700px){body{padding-bottom:calc(env(safe-area-inset-bottom,0px) + 150px)!important}#voiceMic{bottom:calc(env(safe-area-inset-bottom,0px) + 14px)!important}}'; D.head.appendChild(sp);
        var st = D.createElement('style');
        st.textContent = '#voiceMic{position:fixed;right:12px;bottom:92px;z-index:99999;display:flex;flex-direction:column;align-items:center;gap:6px;direction:ltr;touch-action:none}'
            + '#voiceMic .vb{border:none;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}'
            + '#vmBtn{width:56px;height:56px;border-radius:50%;background:#1b5e20;color:#fff;font-size:26px;box-shadow:0 3px 12px rgba(0,0,0,.5);transition:background .15s}'
            + '#vmBtn.on{background:#d32f2f;animation:vmPulse 1.2s ease-in-out infinite}'
            + '@keyframes vmPulse{0%,100%{box-shadow:0 0 0 0 rgba(211,47,47,.6)}50%{box-shadow:0 0 0 12px rgba(211,47,47,0)}}'
            + '#vmLive{max-width:min(70vw,320px);padding:5px 10px;border-radius:10px;background:rgba(0,0,0,.85);color:#fff;font-size:13px;line-height:1.5;display:none;text-align:start;word-break:break-word}'
            + '#vmEng{padding:4px 12px;border-radius:12px;background:#263238;color:#fff;font-size:12px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,.4)}'
            + '#vmWords{width:38px;height:38px;border-radius:50%;background:#263238;color:#fff;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,.4)}'
            + '#vmLive.err{background:#b71c1c}';
        D.head.appendChild(st);
        var box = D.createElement('div'); box.id = 'voiceMic';
        box.innerHTML = '<div id="vmLive"></div><span class="vb" id="vmEng"></span><span class="vb" id="vmWords" title="' + T(isEn, 'میرے الفاظ', 'My words') + '">📝</span><span class="vb" id="vmBtn">🎤</span>';
        D.body.appendChild(box);
        var btn = D.getElementById('vmBtn'), live = D.getElementById('vmLive');
        D.getElementById('vmWords').addEventListener('click', function () { w.open('./my_words.html', '_blank'); });
        var inHead = false, hdr = D.querySelector('.header-container,.header-area'), bk = hdr && hdr.querySelector('.btn-back');
        if (hdr && bk) {
            var hs = D.createElement('style');
            hs.textContent = '#vmBtn.vm-head{flex:0 0 34px;width:34px;height:34px;min-width:34px;border-radius:50%;padding:0;margin:0;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 2px 6px rgba(0,0,0,.4);user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;order:0}.header-container>.header-title,.header-area>.header-title{order:1!important}';
            D.head.appendChild(hs);
            btn.classList.add('vm-head'); inHead = true;
            var ms = D.createElement('style');
            ms.textContent = '.vm-wrap{position:relative;flex:0 0 34px;width:34px;height:34px;order:0;display:flex}'
                + '.vm-launch{width:34px;height:34px;border-radius:50%;background:#1b5e20;color:#fff;font-size:17px;box-shadow:0 2px 6px rgba(0,0,0,.4);cursor:pointer;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}'
                + '.vm-launch.on{background:#d32f2f;animation:vmPulse 1.2s ease-in-out infinite}'
                + '#vmBar{display:none;position:absolute;top:calc(100% + 8px);left:0;z-index:100000;gap:8px;padding:8px 10px;background:#1f2933;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.45);align-items:center;direction:ltr;white-space:nowrap}'
                + '#vmBar.open{display:flex}'
                + '#vmBar .vb{border:none;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;flex:0 0 auto}'
                + '#vmBar #vmBtn{width:42px;height:42px;min-width:42px;flex:0 0 42px;font-size:21px}'
                + '#vmBar #vmWords{width:42px;height:42px;font-size:20px}'
                + '#vmBar #vmEng{height:42px;padding:0 14px;font-size:14px;border-radius:21px}';
            D.head.appendChild(ms);
            var wrap = D.createElement('span'); wrap.className = 'vm-wrap';
            var launch = D.createElement('span'); launch.className = 'vb vm-launch'; launch.id = 'vmMenu'; launch.textContent = '🎤';
            launch.title = T(isEn, 'آواز / زبان / میرے الفاظ', 'Voice / language / my words');
            var bar = D.createElement('div'); bar.id = 'vmBar';
            bar.appendChild(D.getElementById('vmEng')); bar.appendChild(btn); bar.appendChild(D.getElementById('vmWords'));
            wrap.appendChild(launch); wrap.appendChild(bar); hdr.insertBefore(wrap, bk);
            var closeBar = function () { bar.classList.remove('open'); };
            launch.addEventListener('click', function (e) { e.stopPropagation(); bar.classList.toggle('open'); });
            bar.addEventListener('click', function (e) { e.stopPropagation(); var t = e.target; if (t && t.closest && (t.closest('#vmBtn') || t.closest('#vmWords'))) setTimeout(closeBar, 150); });
            D.addEventListener('click', closeBar);
            try { new MutationObserver(function () { launch.classList.toggle('on', btn.classList.contains('on')); }).observe(btn, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
            ['mousedown', 'touchstart', 'pointerdown'].forEach(function (ev) { wrap.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false }); });
        }
        var eng = load('rohan_voice_eng') === '1' ? '1' : '2', eb = D.getElementById('vmEng'), rec = null, active = false, target = null, tt = 0, hold = 0, heard = false, hintT = 0, lastText = '', lastAt = 0;
        var form = D.getElementById('entryForm'), acc = D.getElementById('accSearch'), det = D.getElementById('details'), amt = D.getElementById('total_amount'), cid = D.getElementById('customer_id_hidden');
        var say = function (msg, err, ms) {
            live.textContent = msg || ''; live.className = err ? 'err' : ''; live.style.display = msg ? 'block' : 'none';
            clearTimeout(tt); if (msg && ms) { hold = Date.now() + Math.min(ms, 3000); tt = setTimeout(function () { live.style.display = 'none'; }, ms); }
        };
        w.__vmNoDigits = function (t) { say(T(isEn, 'نمبر سمجھ نہیں آیا: ', 'No number heard: ') + t, true, 3500); };
        var onMsg = function () { return T(isEn, '🎙 مائک چالو ہے — بولیں…', '🎙 Mic is on — speak…') + (restarts ? ' (' + restarts + ')' : ''); };
        var paintEng = function () { eb.textContent = T(isEn, 'اردو ', 'Urdu ') + (isEn ? (eng === '1' ? '1' : '2') : (eng === '1' ? '۱' : '۲')); };
        paintEng();
        if (o.bid) { var k = App.keysFor(o.bid); App.readArray(k.customers).forEach(function (n) { learn(n, 3); }); App.readArray(k.records).slice(-800).forEach(function (r) { learn(r.details, 1); learn(r.extra, 1); }); }
        ['mousedown', 'touchstart', 'pointerdown'].forEach(function (ev) { box.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false }); });
        D.addEventListener('focusin', function (e) { if (usable(e.target)) target = e.target; });
        var current = function () { var a = D.activeElement; if (usable(a)) return a; return target && D.contains(target) && usable(target) ? target : null; };

        var pos = load('rohan_voice_pos'), moved = false;
        try { pos = JSON.parse(pos); } catch (e) { pos = null; }
        var place = function (x, y) {
            x = Math.max(0, Math.min(w.innerWidth - box.offsetWidth, x)); y = Math.max(0, Math.min(w.innerHeight - box.offsetHeight, y));
            box.style.left = x + 'px'; box.style.top = y + 'px'; box.style.right = 'auto'; box.style.bottom = 'auto';
        };
        if (pos && typeof pos.x === 'number') place(pos.x, pos.y);
        btn.addEventListener('pointerdown', function (e) {
            if (inHead) return;
            var r = box.getBoundingClientRect(), sx = e.clientX, sy = e.clientY; moved = false;
            var mv = function (ev) {
                if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 8) return;
                moved = true; place(r.left + ev.clientX - sx, r.top + ev.clientY - sy);
            };
            var up = function () {
                D.removeEventListener('pointermove', mv); D.removeEventListener('pointerup', up);
                if (moved) { var b = box.getBoundingClientRect(); store('rohan_voice_pos', JSON.stringify({ x: b.left, y: b.top })); }
            };
            D.addEventListener('pointermove', mv); D.addEventListener('pointerup', up);
        });

        var lastPut = null, restarts = 0, pending = null, restartT = 0, quick = 0, startedAt = 0, wake = null;
        var lock = function () { try { if (navigator.wakeLock && !wake) navigator.wakeLock.request('screen').then(function (l) { wake = l; l.addEventListener('release', function () { wake = null; }); }).catch(function () {}); } catch (e) {} };
        var unlock = function () { try { if (wake) wake.release(); } catch (e) {} wake = null; };
        var drop = function () { if (rec) { var r = rec; rec = null; r.onend = null; r.onresult = null; r.onerror = null; try { r.abort(); } catch (e) { try { r.stop(); } catch (x) {} } } };
        var stop = function () { clearTimeout(hintT); clearTimeout(restartT); active = false; pending = null; btn.classList.remove('on'); drop(); unlock(); say(''); };
        var submitEntry = function () {
            if (form && form.requestSubmit) { form.requestSubmit(); return; }
            var el = current(); if (el) el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        };
        var fullEntry = function (list) {
            var nums = list.filter(function (t) { return t.num; });
            if (list.length < 2 || !list[0].num) return false;
            var first = list[0].v, last = list[list.length - 1], mid = list.slice(1);
            var amount = '';
            if (nums.length > 1 && last.num) { amount = last.v; mid = mid.slice(0, -1); }
            setVal(acc, first);
            if (!cid.value) { say(T(isEn, 'کھاتہ نمبر ' + first + ' نہیں ملا', 'Account ' + first + ' not found'), true, 4000); return true; }
            setVal(det, textOf(mid));
            if (amount) { setVal(amt, amount); amt.focus(); } else det.focus();
            say('✔ ' + first + ' | ' + textOf(mid) + (amount ? ' | ' + amount : ''), false, 3500);
            return true;
        };
        var isEnter = function (text) { return ENTER_WORDS.indexOf(hfold(latin(text)).replace(/[.,!؟?۔।]/g, '').trim().toLowerCase()) >= 0; };
        var undoInterim = function () {
            if (!pending) return;
            var p = pending; pending = null;
            if (p.el.value !== p.base) { p.el.value = p.base; try { p.el.setSelectionRange(p.a, p.b); } catch (e) {} }
        };
        var showInterim = function (text) {
            var list = tokens(text), el = current();
            if (!list.length) return;
            say('🎙 ' + textOf(list));
            if (!el || el === acc || isEnter(text)) return;
            if (!pending || pending.el !== el) pending = { el: el, base: el.value, a: el.selectionStart, b: el.selectionEnd };
            el.value = pending.base;
            try { el.setSelectionRange(pending.a, pending.b); } catch (e) {}
            put(el, list);
        };
        var learnFrom = function (lp) {
            if (!lp || !D.contains(lp.el)) return;
            var now = lp.el.value; if (now === lp.val) return;
            var a = lp.val.split(/\s+/).filter(Boolean), b = now.split(/\s+/).filter(Boolean), i = 0, j = 0;
            while (i < a.length && i < b.length && a[i] === b[i]) i++;
            while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
            var oa = a.slice(i, a.length - j), ob = b.slice(i, b.length - j);
            if (!oa.length || !ob.length || ob.length > 3 || (oa.length > 1 && oa.length !== ob.length)) return;
            var done = 0, plain = function (x) { return x.replace(/^[.,،۔।!?؟:;]+|[.,،۔।!?؟:;]+$/g, ''); };
            oa.forEach(function (word, k) {
                var item = lp.list.filter(function (t) { return !t.num && t.v === word; })[0];
                var right = plain(oa.length === 1 ? ob.join(' ') : ob[k]);
                if (item && item.raw && right && !/^\d+$/.test(right) && right !== word) { saveFix(item.raw, right); done++; }
            });
            if (done) say(T(isEn, '✔ سیکھ لیا — اگلی بار یہی لکھوں گا', '✔ Learned — will use this next time'), false, 2500);
        };
        var remember = function (el, list) { lastPut = list.some(function (t) { return !t.num; }) ? { el: el, list: list, val: el.value } : null; };
        D.addEventListener('focusout', function (e) { if (lastPut && e.target === lastPut.el) { learnFrom(lastPut); lastPut = null; } });
        D.addEventListener('submit', function () { learnFrom(lastPut); lastPut = null; }, true);
        var handle = function (text) {
            undoInterim();
            learnFrom(lastPut); lastPut = null;
            if (isEnter(text)) { submitEntry(); return; }
            var list = tokens(text), el = current();
            if (!list.length) return;
            say('🎙 ' + textOf(list), false, 2500);
            if (el && el === acc && acc && det && amt && cid && fullEntry(list)) { remember(det, list.slice(1)); return; }
            if (el) { put(el, list); remember(el, list); }
        };
        var FATAL = {
            'not-allowed': T(isEn, 'مائیک کی اجازت نہیں ملی — ایڈریس بار کے تالے/مائیک آئیکن سے اجازت دیں۔ فائل کو سیدھا کھولنے کی بجائے ہوسٹ کی ہوئی ویب سائٹ (https) سے چلائیں', 'Microphone permission denied — allow it from the address bar. Use the hosted (https) site, not a local file'),
            'service-not-allowed': T(isEn, 'اس صفحے کو مائیک کی اجازت نہیں — https ویب سائٹ سے چلائیں اور اجازت دیں', 'Speech service blocked — use an https site and allow the microphone'),
            'audio-capture': T(isEn, 'مائیک نہیں ملا — مائیک جوڑیں یا سسٹم میں چالو کریں', 'No microphone found — connect or enable one')
        };
        var spawn = function () {
            if (!active) return;
            drop();
            var me = rec = new SR(); me.lang = eng === '1' ? 'ur-PK' : 'hi-IN'; me.continuous = true; me.interimResults = true; me.maxAlternatives = 5;
            me.onresult = function (ev) {
                var interim = '';
                for (var i = ev.resultIndex; i < ev.results.length; i++) {
                    heard = true; var r = ev.results[i], t = pick(r);
                    if (r.isFinal) {
                        var now = Date.now();
                        if (t === lastText && now - lastAt < 1500) continue;
                        lastText = t; lastAt = now; handle(t);
                    } else interim += t;
                }
                if (interim) showInterim(interim); else if (Date.now() > hold) say(onMsg());
            };
            me.onstart = function () { startedAt = Date.now(); say(onMsg()); clearTimeout(hintT); if (!heard) hintT = setTimeout(function () { if (active && !heard) say(T(isEn, 'آواز نہیں آ رہی — مائیک اور اجازت چیک کریں', 'No sound heard — check the microphone and permission'), true, 6000); }, 8000); };
            me.onerror = function (ev) {
                if (ev.error === 'no-speech' || ev.error === 'aborted') return;
                if (ev.error === 'language-not-supported' && eng === '2') { eng = '1'; paintEng(); return; }
                if (FATAL[ev.error]) { stop(); say(FATAL[ev.error] + ' [' + ev.error + ']', true, 12000); return; }
                say(T(isEn, 'آواز کی سروس سے رابطہ نہیں — دوبارہ کوشش ہو رہی ہے… [', 'Speech service unreachable — retrying… [') + ev.error + ']', true, 3000);
            };
            me.onend = function () {
                if (!active || rec !== me) return;
                undoInterim();
                quick = Date.now() - startedAt < 1500 ? quick + 1 : 0;
                restarts++; clearTimeout(restartT); restartT = setTimeout(spawn, Math.min(quick * 500, 4000));
            };
            try { me.start(); } catch (e) { clearTimeout(restartT); restartT = setTimeout(spawn, 1000); }
        };
        var start = function () {
            if (!SR) { say(T(isEn, 'اس براؤزر میں آواز سے لکھنا نہیں چلتا — کروم یا ایج استعمال کریں', 'Voice typing is not supported in this browser — use Chrome or Edge'), true, 5000); return; }
            if (!current() && acc) { try { acc.focus(); } catch (e) {} }
            active = true; quick = 0; restarts = 0; heard = false; btn.classList.add('on'); lock();
            say(T(isEn, '🎙 مائک شروع ہو رہا ہے…', '🎙 Starting mic…'));
            spawn();
        };
        eb.onclick = function () { eng = eng === '1' ? '2' : '1'; store('rohan_voice_eng', eng); paintEng(); if (active) spawn(); };
        D.addEventListener('visibilitychange', function () { if (D.visibilityState === 'visible' && active) { lock(); clearTimeout(restartT); spawn(); } });
        w.addEventListener('pagehide', stop);

        if (form) form.addEventListener('submit', function () { setTimeout(function () { if (active && acc && !usable(D.activeElement)) acc.focus(); }, 450); });
        btn.onclick = function () { if (moved) { moved = false; return; } if (active) stop(); else start(); };
    };
})(window);
