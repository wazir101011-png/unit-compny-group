(function (w) {
    'use strict';

    (function () {
        var css = '@media print{html,body{min-height:0!important;height:auto!important}'
            + '#btnBack,#btnBackHome,#btnLedgerBack,.btn-back,.btn-top-back,.btn-print,.btn-header,#archiveSearchInput,#voiceMic{display:none!important}}';
        try { var st = document.createElement('style'); st.id = 'ubg-print-base'; st.textContent = css; (document.head || document.documentElement).appendChild(st); } catch (e) {}
    })();

    (function () {
        var css = '@media screen and (max-width:700px){html{padding-top:calc(env(safe-area-inset-top,0px) + 18px)!important}}';
        try { var st = document.createElement('style'); st.id = 'ubg-top-space'; st.textContent = css; (document.head || document.documentElement).appendChild(st); } catch (e) {}
    })();

    (function () {
        var css = '@media screen{'
            + '.ubg-date{position:relative;display:block;width:100%;max-width:100%;min-width:0;overflow:hidden;border-radius:6px;box-sizing:border-box}'
            + '.ubg-date>input[type="date"]{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;-webkit-appearance:none;appearance:none;color:transparent!important;-webkit-text-fill-color:transparent!important;cursor:pointer}'
            + '.ubg-date>input[type="date"]::-webkit-datetime-edit{color:transparent;opacity:0}'
            + '.ubg-date>input[type="date"]::-webkit-date-and-time-value{text-align:start}'
            + '.ubg-date-fmt{position:absolute;top:50%;transform:translateY(-50%);inset-inline-start:12px;pointer-events:none;font-weight:bold;direction:ltr;unicode-bidi:isolate;color:#fff;white-space:nowrap}'
            + 'body.light-theme .ubg-date-fmt{color:#111827}'
            + '}';
        function fmt(v) { return v && /^\d{4}-\d\d-\d\d$/.test(v) ? v.slice(8, 10) + '/' + v.slice(5, 7) + '/' + v.slice(0, 4) : ''; }
        var dateSyncs = [], dateTimer = 0;
        function enhance(inp) {
            if (inp.getAttribute('data-ubg-date') || inp.closest('.dbox,.date-wrap,.ubg-date')) return;
            inp.setAttribute('data-ubg-date', '1');
            var wrap = document.createElement('span'); wrap.className = 'ubg-date';
            var out = document.createElement('span'); out.className = 'ubg-date-fmt'; out.setAttribute('aria-hidden', 'true');
            inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp); wrap.appendChild(out);
            try { out.style.fontSize = getComputedStyle(inp).fontSize; } catch (e) {}
            var last = null;
            function sync() { if (inp.value !== last) { last = inp.value; var t = fmt(last); out.textContent = t || 'DD/MM/YYYY'; out.style.opacity = t ? '1' : '.45'; } }
            inp.addEventListener('input', sync); inp.addEventListener('change', sync);
            sync(); dateSyncs.push(sync); if (!dateTimer) dateTimer = setInterval(function () { if (!document.hidden) dateSyncs.forEach(function (f) { f(); }); }, 500);
        }
        function run() {
            try {
                var st = document.createElement('style'); st.id = 'ubg-date-ui'; st.textContent = css; document.head.appendChild(st);
                Array.prototype.forEach.call(document.querySelectorAll('input[type="date"]'), enhance);
            } catch (e) {}
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    })();

    window.__ubgPrintNow = function (opt) {
        opt = opt || {};
        var doc = document, undo = [], added = [], done = false;
        var iOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        function remember(el) { undo.push([el, el.getAttribute('style')]); }
        function imp(el, k, v) { el.style.setProperty(k, v, 'important'); }
        try {
            if (opt.hide) Array.prototype.forEach.call(doc.querySelectorAll(opt.hide), function (el) { remember(el); imp(el, 'display', 'none'); });
            [doc.documentElement, doc.body].forEach(function (el) { remember(el); imp(el, 'height', 'auto'); imp(el, 'min-height', '0'); imp(el, 'overflow', 'visible'); });
            var tbl = opt.table && doc.querySelector(opt.table);
            if (tbl && tbl.tHead && tbl.tBodies[0] && (iOS || /[?&]printchunk=1/.test(location.search))) {
                var N = opt.rowsPerPage || 24;
                var rows = Array.prototype.filter.call(tbl.tBodies[0].rows, function (r) { return getComputedStyle(r).display !== 'none'; });
                if (rows.length > N) {
                    var hrows = Array.prototype.slice.call(tbl.tHead.rows);
                    remember(tbl.tHead); imp(tbl.tHead, 'display', 'table-row-group');
                    for (var i = N; i < rows.length; i += N) {
                        hrows.forEach(function (hr, k) {
                            var c = hr.cloneNode(true); c.removeAttribute('id');
                            Array.prototype.forEach.call(c.querySelectorAll('[id]'), function (e) { e.removeAttribute('id'); });
                            if (k === 0) { c.style.setProperty('break-before', 'page'); c.style.setProperty('page-break-before', 'always'); }
                            rows[i].parentNode.insertBefore(c, rows[i]); added.push(c);
                        });
                    }
                }
            }
        } catch (e) {}
        function restore() {
            if (done) return; done = true;
            added.forEach(function (c) { if (c.parentNode) c.parentNode.removeChild(c); });
            undo.forEach(function (u) { if (u[1] === null) u[0].removeAttribute('style'); else u[0].setAttribute('style', u[1]); });
            window.removeEventListener('afterprint', restore);
        }
        window.addEventListener('afterprint', restore);
        if (iOS) {
            setTimeout(function () { ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) { doc.addEventListener(ev, function f() { doc.removeEventListener(ev, f, true); restore(); }, true); }); }, 1500);
            setTimeout(restore, 120000);
        }
        try { window.print(); } catch (e) {}
        if (!iOS) restore();
    };

    var APP_CONFIG = w.APP_CONFIG = Object.assign({
        API_BASE: '',
        PRINT_FOOTER_TEXT: 'Fahim Afaq 03060563856'
    }, w.APP_CONFIG || {});
    try { var pf = localStorage.getItem('rohan_print_footer'); if (pf !== null) APP_CONFIG.PRINT_FOOTER_TEXT = pf; } catch (e) {}

    (function () {
        var orig = Storage.prototype.setItem;
        Storage.prototype.setItem = function (k, v) {
            try { return orig.call(this, k, v); }
            catch (e) {
                try { w.alert('⚠️ ڈیٹا محفوظ نہیں ہو سکا! براؤزر کی اسٹوریج بھر چکی ہے۔ پہلے بیک اپ ڈاؤن لوڈ کریں۔\nData NOT saved: browser storage is full. Download a backup first.'); } catch (e2) {}
                throw e;
            }
        };
    })();

    function esc(s) {
        return String(s === null || s === undefined ? '' : s).replace(/[&<>"'`]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c];
        });
    }
    function norm(s) { return String(s === null || s === undefined ? '' : s).trim().toLowerCase(); }
    function sameName(a, b) { return norm(a) === norm(b); }
    function readJSON(key, fallback, store) {
        try {
            var raw = (store || localStorage).getItem(key);
            if (raw === null || raw === undefined) return fallback;
            var v = JSON.parse(raw);
            return (v === null || v === undefined) ? fallback : v;
        } catch (e) { return fallback; }
    }
    function readArray(key) {
        var v = readJSON(key, []);
        if (!Array.isArray(v)) return [];
        if (/_customer_list$/.test(key)) return v.filter(function (x) { return (typeof x === 'string' && x.trim() !== '') || typeof x === 'number'; }).map(String);
        if (/_(customer_details|bnam_records|audit_log|deleted_entries)$/.test(key)) return v.filter(function (x) { return x && typeof x === 'object' && !Array.isArray(x); });
        return v;
    }
    function readObject(key) { var v = readJSON(key, {}); return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}; }
    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
    function pad2(n) { return String(n).padStart(2, '0'); }
    function localDate() { var d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
    function toISODate(s) {
        s = String(s || '').trim();
        var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (m) return m[1] + '-' + pad2(m[2]) + '-' + pad2(m[3]);
        m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (m) return m[3] + '-' + pad2(m[2]) + '-' + pad2(m[1]);
        return '';
    }
    function fmtDMY(s) {
        var iso = toISODate(s); if (!iso) return s || '-';
        var p = iso.split('-'), f = '';
        try { f = localStorage.getItem('rohan_date_format'); } catch (e) {}
        return f === 'ymd' ? p[0] + '-' + p[1] + '-' + p[2] : (f === 'mdy' ? p[1] + '/' + p[2] + '/' + p[0] : p[2] + '/' + p[1] + '/' + p[0]);
    }
    function num(v) { var n = parseFloat(String(v === null || v === undefined ? '' : v).replace(/,/g, '')); return isNaN(n) ? 0 : n; }

    function toast(msg, ms) {
        try {
            var t = document.createElement('div');
            t.textContent = (window.App && App.i18n && App.i18n.text) ? App.i18n.text(msg) : msg;
            t.style.cssText = 'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#7f1d1d;color:#fff;padding:10px 16px;border-radius:8px;font:bold 13px Arial;z-index:99999;box-shadow:0 4px 14px rgba(0,0,0,.5);max-width:90%;text-align:center';
            (document.body || document.documentElement).appendChild(t);
            setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, ms || 4000);
        } catch (e) {}
    }

    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var isIndex = (path === '' || path === 'index.html' || path === 'password_key_maker.html');
    var isBranches = (path === 'branches.html' || path === 'all_branches.html');

    function sessionActive() { try { return sessionStorage.getItem('rohan_session_active') === 'true'; } catch (e) { return false; } }
    function getRole() { try { return sessionStorage.getItem('rohan_user_role') || 'owner'; } catch (e) { return 'owner'; } }
    function getBranchId() { try { return sessionStorage.getItem('active_branch_id') || ''; } catch (e) { return ''; } }
    function allowedBranchIds() { try { if (getRole() === 'admin') return null; var v = JSON.parse(sessionStorage.getItem('rohan_user_branches') || '"*"'); return Array.isArray(v) ? v : null; } catch (e) { return null; } }
    function canSeeBranch(id) { var a = allowedBranchIds(); return !a || a.indexOf(id) >= 0; }
    function keysFor(bid) {
        return {
            customers: bid + '_customer_list',
            details: bid + '_customer_details',
            deleted: bid + '_deleted_customers',
            records: bid + '_bnam_records',
            settings: 'rohan_branch_master_settings_' + bid
        };
    }

    if (!isIndex) {
        if (!sessionActive()) {
            try { document.documentElement.style.display = 'none'; } catch (e) {}
            location.replace('./index.html');
            throw new Error('not-logged-in');
        }
        if (!isBranches && getBranchId() && !canSeeBranch(getBranchId())) {
            try { document.documentElement.style.display = 'none'; sessionStorage.removeItem('active_branch_id'); } catch (e) {}
            location.replace('./branches.html');
            throw new Error('branch-not-allowed');
        }
        if (!isBranches && !getBranchId()) {
            try { document.documentElement.style.display = 'none'; } catch (e) {}
            location.replace('./branches.html');
            throw new Error('no-branch');
        }
    }
    w.addEventListener('pageshow', function (e) {
        if (e.persisted && !isIndex && !sessionActive()) location.replace('./index.html');
    });

    var OWNER_DEFAULTS = {
        btnJamaEntry: false, btnBnamEntry: false, btnAddCustomer: false, lblBtnJournal: true, lblBtnSummary: true,
        lblBtnDeleted: true, btnAging: true, btnDelEntries: true, btnAudit: true, allBranches: true, printing: true,
        editEntries: false, editCustomer: false, deleteAccount: false, penTool: false, restoreEntries: false
    };
    function ownerPerms() {
        var s = readObject('rohan_owner_perms'), out = {};
        Object.keys(OWNER_DEFAULTS).forEach(function (k) { out[k] = typeof s[k] === 'boolean' ? s[k] : OWNER_DEFAULTS[k]; });
        return out;
    }
    function ownerCan(key) { return getRole() !== 'owner' || ownerPerms()[key] === true; }

    function blockOwner(isEn, msgUr, msgEn, target, key) {
        if (getRole() !== 'owner' || (key && ownerCan(key))) return;
        try { document.documentElement.style.display = 'none'; } catch (e) {}
        try { w.alert(isEn ? msgEn : msgUr); } catch (e) {}
        location.replace(target);
        throw new Error('owner-blocked');
    }

    function guardOwner(key, target) {
        if (ownerCan(key)) return;
        var bid = getBranchId(), lang = '';
        try { lang = sessionStorage.getItem('active_branch_lang') || readObject('rohan_branch_lang_overrides')[bid] || localStorage.getItem('rohan_global_lang') || 'ur'; } catch (e) {}
        blockOwner(lang === 'en', '⚠️ آپ کو اس صفحے کی اجازت نہیں ہے!', '⚠️ You are not authorized to open this page!', target, key);
    }

    (function () {
        if (!ownerCan('printing')) {
            var st = document.createElement('style');
            st.textContent = '@media print { body { display: none !important; } } #btnLedgerPrint, #btnPrintSummary, #btnPrintJournal, #btnOut { display: none !important; }';
            document.head.appendChild(st);
        }
    })();

    (function () {
        var standalone = (w.navigator && w.navigator.standalone) ||
            (w.matchMedia && w.matchMedia('(display-mode: standalone)').matches);
        if (!standalone) return;
        document.addEventListener('click', function (e) {
            if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            var t = e.target;
            while (t && t.nodeName !== 'A' && t.nodeName !== 'HTML') t = t.parentNode;
            if (t && t.nodeName === 'A') {
                var href = t.getAttribute('href');
                if (href && !/^(https?:|javascript:|mailto:|tel:)/i.test(href) && href !== '#') {
                    e.preventDefault();
                    w.location.href = href;
                }
            }
        }, true);
    })();

    var DEFAULT_BRANCHES = [
        { id: 'branch_1', num: 1, ur: 'ڈرائی فروٹ ہاؤس', en: 'Dry Fruit House', owner: '', icon: '📦', color1: '#b78a82', color2: '#3d0f05', text: '#efebe9' },
        { id: 'branch_2', num: 2, ur: 'تانبا فیکٹری', en: 'Copper Factory', owner: '', icon: '⚡', color1: '#dc7c5b', color2: '#461a10', text: '#fbe9e7' },
        { id: 'branch_3', num: 3, ur: 'سلور برانچ', en: 'Silver Branch', owner: '', icon: '⛓️', color1: '#8ea2ac', color2: '#0e3833', text: '#cfd8dc' },
        { id: 'branch_4', num: 4, ur: 'پیتل برانچ', en: 'Brass Branch', owner: '', icon: '🏺', color1: '#c7c07d', color2: '#302509', text: '#d7ccc8' },
        { id: 'branch_5', num: 5, ur: 'سکریپ گودام', en: 'Scrap Warehouse', owner: '', icon: '🏪', color1: '#607fad', color2: '#0d1f3d', text: '#e3f2fd' },
        { id: 'branch_6', num: 6, ur: 'دوبی برانچ', en: 'Dubai Branch', owner: '', icon: '🏭', color1: '#60988f', color2: '#2e4340', text: '#e0f2f1' },
        { id: 'branch_7', num: 7, ur: 'سلور بھٹی', en: 'Silver Furnace', owner: '', icon: '🏢', color1: '#927fa9', color2: '#1f053d', text: '#f3e5f5' },
        { id: 'branch_8', num: 8, ur: 'برانچ نمبر 8', en: 'Branch No. 8', owner: '', icon: '🏢', color1: '#755c69', color2: '#490c26', text: '#fce4ec' },
        { id: 'branch_9', num: 9, ur: 'برانچ نمبر 9', en: 'Branch No. 9', owner: '', icon: '🏢', color1: '#323a32', color2: '#0a4516', text: '#e8f5e9' },
        { id: 'branch_10', num: 10, ur: 'برانچ نمبر 10', en: 'Branch No. 10', owner: '', icon: '🏢', color1: '#cca86d', color2: '#0a2841', text: '#e1f5fe' },
        { id: 'branch_11', num: 11, ur: 'برانچ نمبر 11', en: 'Branch No. 11', owner: '', icon: '🏢', color1: '#b49585', color2: '#47200d', text: '#fff3e0' },
        { id: 'branch_12', num: 12, ur: 'برانچ نمبر 12', en: 'Branch No. 12', owner: '', icon: '🏢', color1: '#2e3b4e', color2: '#112948', text: '#eceff1' },
        { id: 'branch_13', num: 13, ur: 'برانچ نمبر 13', en: 'Branch No. 13', owner: '', icon: '🏢', color1: '#921b3f', color2: '#120743', text: '#ede7f6' },
        { id: 'branch_14', num: 14, ur: 'برانچ نمبر 14', en: 'Branch No. 14', owner: '', icon: '🏢', color1: '#424242', color2: '#410a0a', text: '#f5f5f5' },
        { id: 'branch_15', num: 15, ur: 'برانچ نمبر 15', en: 'Branch No. 15', owner: '', icon: '🏢', color1: '#8085b8', color2: '#0d1450', text: '#e8eaf6' },
        { id: 'branch_16', num: 16, ur: 'برانچ نمبر 16', en: 'Branch No. 16', owner: '', icon: '🏢', color1: '#bbccb5', color2: '#142d07', text: '#f1f8e9' },
        { id: 'branch_17', num: 17, ur: 'برانچ نمبر 17', en: 'Branch No. 17', owner: '', icon: '🏢', color1: '#5c3a21', color2: '#27180c', text: '#f5f5f5' },
        { id: 'branch_18', num: 18, ur: 'برانچ نمبر 18', en: 'Branch No. 18', owner: '', icon: '🏢', color1: '#b1a87a', color2: '#3a3204', text: '#fffde7' },
        { id: 'branch_19', num: 19, ur: 'برانچ نمبر 19', en: 'Branch No. 19', owner: '', icon: '🏢', color1: '#a981aa', color2: '#41092f', text: '#e0f7fa' },
        { id: 'branch_20', num: 20, ur: 'برانچ نمبر 20', en: 'Branch No. 20', owner: '', icon: '🏢', color1: '#cd608f', color2: '#34081c', text: '#fce4ec' }
    ];
    function getBranches() {
        var saved = readJSON('rohan_branches_custom_config_v2', []);
        if (!Array.isArray(saved)) saved = [];
        var byId = {};
        saved.forEach(function (b) { if (b && b.id) byId[b.id] = b; });
        var out = DEFAULT_BRANCHES.map(function (d) {
            var s = byId[d.id] || {};
            var m = {};
            Object.keys(d).forEach(function (k) { m[k] = (s[k] !== undefined && s[k] !== null && s[k] !== '') ? s[k] : d[k]; });
            m.owner = (s.owner !== undefined && s.owner !== null) ? s.owner : d.owner;
            delete byId[d.id];
            return m;
        });
        Object.keys(byId).forEach(function (id) { out.push(byId[id]); });
        return out;
    }

    function visibleBranches() { return getBranches().filter(function (b) { return canSeeBranch(b.id); }); }

    function defaultSettings() {
        return {
            maundUnit: '37.324', rateThreshold: 25000, enablePercent: false, percentVal: 0, percentMode: 'deduct',
            cols: {
                pcs: { visible: true, name: 'پیس', formula: '' }, weight: { visible: true, name: 'وزن', formula: '' }, rate: { visible: true, name: 'ریٹ', formula: '' },
                amount: { name: 'کل رقم' }, extra: { visible: false, name: 'اضافی کالم' }
            },
            summaryBoxPos: 'bottom', ledgerBoxPos: 'bottom', dueDays: 30, oldEntryDays: 3,
            currency: '', summarySort: 'added', hideZero: false, confirmSave: false, dupWarn: true,
            entryDate: 'today', requireDetails: false, futureWarn: true, maxAmountWarn: 0, defaultCreditLimit: 0,
            ledgerPeriod: 'all', ageBanner: true, summarySubInfo: true, summaryToday: false, agingStep: 30, hiddenBtns: [],
            creditWarn: true, compactNums: false,
            openingInTotals: true, recycleDays: 0, colOrder: []
        };
    }

    function normExtras(s) {
        var sc = (s && s.cols && typeof s.cols === 'object') ? s.cols : {};
        var out = [];
        var src = Array.isArray(s && s.extras) ? s.extras : (Array.isArray(sc.extras) ? sc.extras : null);
        if (src) {
            src.forEach(function (e, i) {
                if (!e || typeof e !== 'object') return;
                var id = String(e.id || ('e' + (i + 1))).replace(/[^a-zA-Z0-9]/g, '');
                if (!id || out.some(function (o) { return o.id === id; })) return;
                out.push({ id: id, name: String(e.name || '').slice(0, 40) || 'اضافی کالم', visible: e.visible !== false, formula: String(e.formula || '').slice(0, 200) });
            });
        } else {
            var le = (sc.extra && typeof sc.extra === 'object') ? sc.extra : {};
            out.push({ id: 'e1', name: le.name || 'اضافی کالم', visible: le.visible === true, formula: '' });
        }
        return out;
    }
    function normColOrder(saved, extras) {
        var all = extras.map(function (e) { return 'x_' + e.id; }).concat(['pcs', 'weight', 'rate', 'amount']);
        var out = [];
        (Array.isArray(saved) ? saved : []).forEach(function (k) { if (all.indexOf(k) >= 0 && out.indexOf(k) < 0) out.push(k); });
        all.forEach(function (k) { if (out.indexOf(k) < 0) out.push(k); });
        return out;
    }
    function visibleExtras(st) {
        var ex = (st && st.extras) || [], ord = (st && st.colOrder) || [];
        return ex.filter(function (e) { return e.visible; }).sort(function (a, b) { return ord.indexOf('x_' + a.id) - ord.indexOf('x_' + b.id); });
    }
    function extraVal(rec, id) {
        if (!rec) return '';
        if (rec.extras && rec.extras[id] !== undefined && rec.extras[id] !== null) return rec.extras[id];
        return id === 'e1' ? (rec.extra || '') : '';
    }
    function toNum(v) {
        var t = String(v == null ? '' : v).replace(/[٠-٩]/g, function (c) { return c.charCodeAt(0) - 1632; }).replace(/[۰-۹]/g, function (c) { return c.charCodeAt(0) - 1776; }).replace(/[,٬،\s]/g, '').replace('٫', '.');
        var n = parseFloat(t); return isFinite(n) ? n : 0;
    }
    function evalFormula(expr, vars) {
        expr = String(expr || '').trim().replace(/×/g, '*').replace(/÷/g, '/');
        if (!expr || !/^[0-9a-zA-Z_+\-*\/().\s]*$/.test(expr)) return null;
        var ids = expr.match(/[a-zA-Z_]\w*/g) || [];
        for (var i = 0; i < ids.length; i++) if (!Object.prototype.hasOwnProperty.call(vars, ids[i])) return null;
        try {
            var names = Object.keys(vars);
            var r = Function.apply(null, names.concat('"use strict"; return (' + expr + ');')).apply(null, names.map(function (k) { return vars[k]; }));
            if (typeof r !== 'number' || !isFinite(r)) return null;
            return Math.round(r * 1000) / 1000;
        } catch (e) { return null; }
    }
    function buildEntryExtras(st, cfg) {
        var prefix = cfg.prefix || 'extra_', list = visibleExtras(st), groups = {}, i;
        list.forEach(function (e) {
            var g = document.createElement('div'); g.className = 'form-group'; g.setAttribute('data-extra-group', e.id);
            var lb = document.createElement('label'); lb.textContent = e.name + (cfg.labelColon ? ':' : '');
            var inp = document.createElement('input'); inp.type = 'text'; inp.id = prefix + e.id; inp.setAttribute('data-extra-id', e.id);
            inp.placeholder = cfg.isEn ? ('Enter ' + e.name + '...') : (e.name + ' درج کریں...');
            if (cfg.values && cfg.values[e.id] != null && cfg.values[e.id] !== '') { inp.value = cfg.values[e.id]; inp.setAttribute('data-manual', '1'); }
            g.appendChild(lb); g.appendChild(inp); groups['x_' + e.id] = g;
        });
        (st.colOrder || []).forEach(function (k) {
            var el = groups[k] || cfg.base[k]; if (el && el.parentNode !== undefined) cfg.anchor.parentNode.insertBefore(el, cfg.anchor);
        });
        var fields = [];
        ['pcs', 'weight', 'rate'].forEach(function (k) { var f = st.cols && st.cols[k] && st.cols[k].formula; if (f && cfg.inputs[k]) fields.push({ el: cfg.inputs[k], f: f }); });
        list.forEach(function (e) { if (e.formula) fields.push({ el: document.getElementById(prefix + e.id), f: e.formula }); });
        if (!fields.length) return { recalc: function () {} };
        var allEx = (st.extras || []);
        function vars() {
            var v = { pcs: toNum(cfg.inputs.pcs && cfg.inputs.pcs.value), weight: toNum(cfg.inputs.weight && cfg.inputs.weight.value), rate: toNum(cfg.inputs.rate && cfg.inputs.rate.value), amount: toNum(cfg.inputs.amount && cfg.inputs.amount.value) };
            allEx.forEach(function (e, n) { var el = document.getElementById(prefix + e.id); v['x' + (n + 1)] = el ? toNum(el.value) : 0; });
            return v;
        }
        function recalc() {
            var baseChanged = false;
            for (var pass = 0; pass < 3; pass++) fields.forEach(function (fl) {
                if (!fl.el || fl.el.getAttribute('data-manual') === '1') return;
                var r = evalFormula(fl.f, vars()); if (r === null) return;
                if (String(fl.el.value) !== String(r)) { fl.el.value = r; if (fl.el.id.indexOf(prefix) !== 0) baseChanged = true; }
            });
            if (baseChanged && typeof cfg.afterBase === 'function') cfg.afterBase();
        }
        cfg.form.addEventListener('input', function (ev) {
            var t = ev.target;
            if (fields.some(function (fl) { return fl.el === t; })) { t.setAttribute('data-manual', t.value === '' ? '0' : '1'); }
            recalc();
        });
        cfg.form.addEventListener('reset', function () { setTimeout(function () { fields.forEach(function (fl) { if (fl.el) fl.el.setAttribute('data-manual', '0'); }); recalc(); }, 0); });
        return { recalc: recalc };
    }
    function readEntryExtras(st, prefix) {
        var map = {}, first = '', list = visibleExtras(st);
        list.forEach(function (e) { var el = document.getElementById((prefix || 'extra_') + e.id); var v = el ? el.value.trim() : ''; map[e.id] = v; });
        var f = list.filter(function (e) { return e.id === 'e1'; })[0] || list[0];
        if (f) first = map[f.id] || '';
        return { map: map, first: first };
    }

    (function () {
        var PTS = [[320, 0.7], [400, 0.92], [600, 1], [1000, 1], [1366, 0.9], [1920, 1.16], [2560, 1.5], [3840, 2.25]];
        function zoomFor(w) {
            if (w <= PTS[0][0]) return PTS[0][1];
            for (var i = 1; i < PTS.length; i++) if (w <= PTS[i][0]) { var a = PTS[i - 1], b = PTS[i]; return a[1] + (b[1] - a[1]) * (w - a[0]) / (b[0] - a[0]); }
            return PTS[PTS.length - 1][1];
        }
        var raf = 0;
        function fit() {
            try {
                document.querySelectorAll('.shared-scroll-wrapper').forEach(function (wr) {
                    var t = wr.querySelector('table'); if (!t) return;
                    t.style.zoom = '';
                    var avail = wr.clientWidth, need = t.offsetWidth;
                    if (avail > 0 && need > avail + 1) t.style.zoom = String(Math.max(document.documentElement.clientWidth <= 600 ? 1 : 0.5, avail / need));
                });
            } catch (e) {}
        }
        function applyZoom() {
            try {
                var w = document.documentElement.clientWidth || window.innerWidth || 1000;
                var zz = Math.round(zoomFor(w) * 1000) / 1000, st = document.documentElement.style;
                st.zoom = String(zz);
                ['num', 'txt', 'head', 'totnum', 'totlab'].forEach(function (k) { st.removeProperty('--t-' + k); });
                if (w <= 600) {
                    var cl = function (lo, f, hi) { return Math.round(Math.min(hi, Math.max(lo, w * f)) / zz * 100) / 100 + 'px'; };
                    st.setProperty('--t-num', cl(13, 0.0367, 22)); st.setProperty('--t-txt', cl(11.5, 0.0317, 19));
                    st.setProperty('--t-head', cl(12, 0.0333, 20)); st.setProperty('--t-totnum', cl(17, 0.05, 30)); st.setProperty('--t-totlab', cl(12, 0.0333, 20));
                }
                fit();
            } catch (e) {}
        }
        function later() { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { raf = 0; fit(); }); }
        function go() {
            try {
                var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '').toLowerCase();
                if (document.body) document.body.setAttribute('data-page', page);
                if (!document.getElementById('ubg-fonts')) {
                    var fl = document.createElement('link'); fl.id = 'ubg-fonts'; fl.rel = 'stylesheet';
                    fl.href = 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&family=Inter:wght@400..900&display=swap';
                    document.head.appendChild(fl);
                }
                if (!document.getElementById('ubg-layout-v3')) {
                    var st = document.createElement('style'); st.id = 'ubg-layout-v3'; st.textContent = "/* ===== Pakistani Urdu look: Nastaliq text + clean lining numbers ===== */\n@font-face{font-family:'UBG Latin';src:local('Inter'),local('Roboto'),local('SF Pro Text'),local('Helvetica Neue'),local('Arial');unicode-range:U+0021-007E;font-weight:100 900}\nhtml body[data-page][data-page][data-page], html body[data-page][data-page][data-page] *{font-family:'Inter','UBG Latin','Noto Nastaliq Urdu','Jameel Noori Nastaleeq','Jameel Noori Nastaleeq Kasheeda','Nafees Nastaleeq','Alvi Nastaleeq','Urdu Typesetting','Noto Naskh Arabic','Noto Sans Arabic',Tahoma,Arial,sans-serif!important;font-feature-settings:'lnum' 1,'tnum' 1}\nhtml body[data-page][data-page][data-page] table td,html body[data-page][data-page][data-page] table th{line-height:1.75!important}\nhtml body[data-page][data-page][data-page] .summary-column h3, html body[data-page][data-page][data-page] .customer-title{line-height:1.7!important}\n@media screen{\nhtml body .ubg-print-logo{display:none!important}\n/* ===== type scale: one size for every table text/number, totals a little bigger ===== */\n:root{--fs-cell:13px;--fs-head:12px;--fs-total:15.5px;--fs-label:11.5px;--pad-x:5px}\n:root{--w-num:calc(var(--fs-cell)*4.4);--w-amt:calc(var(--fs-cell)*7.8);--w-date:calc(var(--fs-cell)*5.2);--w-txt:calc(var(--fs-cell)*9);--w-acc:calc(var(--fs-cell)*4.2);--w-act:calc(var(--fs-cell)*2.8)}\n\nhtml{-webkit-text-size-adjust:100%;text-size-adjust:100%}\nhtml body[data-page][data-page][data-page]{max-width:100%;overflow-x:hidden}\nhtml body[data-page][data-page][data-page] img,html body[data-page][data-page][data-page] svg,html body[data-page][data-page][data-page] video,html body[data-page][data-page][data-page] canvas{max-width:100%}\nhtml body[data-page][data-page][data-page] input,html body[data-page][data-page][data-page] select,html body[data-page][data-page][data-page] textarea,html body[data-page][data-page][data-page] button{max-width:100%;box-sizing:border-box}\n\n/* every table cell: same size, numbers never wrap or cut */\nhtml body[data-page][data-page][data-page] table th,html body[data-page][data-page][data-page] table td{font-size:var(--fs-cell)!important;line-height:1.45!important;padding-left:var(--pad-x)!important;padding-right:var(--pad-x)!important;font-variant-numeric:tabular-nums;vertical-align:middle}\nhtml body[data-page][data-page][data-page] table th{font-size:var(--fs-head)!important}\nhtml body[data-page][data-page][data-page] table td *{font-size:inherit!important}\nhtml body[data-page][data-page][data-page] table td.col-date,html body[data-page][data-page][data-page] table td.col-pcs,html body[data-page][data-page][data-page] table td.col-weight,html body[data-page][data-page][data-page] table td.col-rate,html body[data-page][data-page][data-page] table td.col-amount,html body[data-page][data-page][data-page] table td.col-balance,html body[data-page][data-page][data-page] table td.col-extra,\nhtml body[data-page][data-page][data-page] table td.color-bnam-text,html body[data-page][data-page][data-page] table td.color-jama-text,html body[data-page][data-page][data-page] table td.text-bnam,html body[data-page][data-page][data-page] table td.text-jama{white-space:nowrap!important;overflow-wrap:normal!important;word-break:keep-all!important}\nhtml body[data-page][data-page][data-page] table td.col-details,html body[data-page][data-page][data-page] table td.col-cust-name,html body[data-page][data-page][data-page] table td.journal-detail-text{white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;hyphens:none}\n\n/* ===== LEDGER + JOURNAL: same equal-width columns, scroll inside the bordered box on small phones ===== */\nhtml body[data-page][data-page][data-page] #ledgerTable,html body[data-page][data-page][data-page] #journalTable,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] .shared-inner-content table{table-layout:auto!important;width:max-content!important;min-width:100%!important;max-width:none!important}\nhtml body[data-page][data-page][data-page][data-page=\"customer_ledger\"] .shared-inner-content,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] .shared-inner-content{min-width:0!important;width:100%!important;max-width:none!important}\nhtml body[data-page][data-page][data-page][data-page=\"customer_ledger\"] .shared-scroll-wrapper,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] .shared-scroll-wrapper{overflow-x:auto!important;max-width:100%!important;-webkit-overflow-scrolling:touch}\nhtml body[data-page][data-page][data-page] #ledgerTable th.col-date{width:var(--w-date)!important;min-width:var(--w-date)!important}\nhtml body[data-page][data-page][data-page] #ledgerTable th.col-details{width:var(--w-txt)!important;min-width:calc(var(--fs-cell)*9)!important}\nhtml body[data-page][data-page][data-page] #ledgerTable th.col-extra,html body[data-page][data-page][data-page] #ledgerTable th.col-pcs,html body[data-page][data-page][data-page] #ledgerTable th.col-weight,html body[data-page][data-page][data-page] #ledgerTable th.col-rate{width:var(--w-num)!important;min-width:var(--w-num)!important}\nhtml body[data-page][data-page][data-page] #ledgerTable th.col-amount{width:var(--w-amt)!important;min-width:var(--w-amt)!important}\nhtml body[data-page][data-page][data-page] #ledgerTable th.edit-th{width:var(--w-act)!important;min-width:var(--w-act)!important}\nhtml body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thAccNo{width:var(--w-acc)!important;min-width:var(--w-acc)!important}\nhtml body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thCustName,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thDetails{width:var(--w-txt)!important;min-width:calc(var(--fs-cell)*9)!important}\nhtml body[data-page][data-page][data-page][data-page=\"daily_journal\"] th.col-extra,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thPcsBnam,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thPcsJama,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thWeight,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thRate{width:var(--w-num)!important;min-width:var(--w-num)!important}\nhtml body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thBnam,html body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thJama{width:var(--w-amt)!important;min-width:var(--w-amt)!important}\nhtml body[data-page][data-page][data-page][data-page=\"daily_journal\"] th#thExtra{display:none!important}\n\n/* totals: a little bigger than the table text */\nhtml body[data-page][data-page][data-page] .row-today-total td{font-size:var(--fs-total)!important;font-weight:900!important}\nhtml body[data-page][data-page][data-page] .row-carton-record td,html body[data-page][data-page][data-page] .row-final-balance td,html body[data-page][data-page][data-page] .row-carton-record td span,html body[data-page][data-page][data-page] .row-final-balance td span{font-size:calc(var(--fs-total) + 1px)!important;font-weight:900!important}\nhtml body[data-page][data-page][data-page] .row-old-balance td,html body[data-page][data-page][data-page] .journal-data-row td{font-size:var(--fs-cell)!important}\nhtml body[data-page][data-page][data-page] .stat-label{font-size:var(--fs-label)!important}\nhtml body[data-page][data-page][data-page] .stat-value{font-size:var(--fs-total)!important}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-column h3{font-size:var(--fs-total)!important;white-space:normal!important;max-width:100%}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-item span:first-child{font-size:var(--fs-cell)!important}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-item span:last-child{font-size:var(--fs-total)!important;font-weight:900!important;white-space:nowrap!important}\nhtml body[data-page][data-page][data-page] .summary-box .summary-item,html body[data-page][data-page][data-page] .summary-box .summary-item div{letter-spacing:0!important}\nhtml body[data-page][data-page][data-page] .summary-box .summary-item{font-size:var(--fs-label)!important}\nhtml body[data-page][data-page][data-page] .summary-box .summary-item div{font-size:var(--fs-total)!important;white-space:nowrap!important}\nhtml body[data-page][data-page][data-page] .customer-stats-subrow,html body[data-page][data-page][data-page] .stat-badge{font-size:var(--fs-label)!important}\n\n\n/* dashboard cards: big numbers always fit their card (container-query sizing) */\nhtml body[data-page][data-page][data-page] .db-kpi{container-type:inline-size}\nhtml body[data-page][data-page][data-page] .db-kpi .kv{font-size:clamp(8px,9.6cqw,24px)!important;white-space:nowrap!important;word-break:keep-all!important;letter-spacing:0!important;line-height:1.2}\nhtml body[data-page][data-page][data-page] .db-kpi .kv.sm{font-size:clamp(8px,8.8cqw,20px)!important}\nhtml body[data-page][data-page][data-page] .db-kpi .kt{font-size:clamp(10px,7.6cqw,13px)!important;white-space:normal;overflow-wrap:anywhere}\nhtml body[data-page][data-page][data-page] .db-kpi .ks{font-size:clamp(9px,6.4cqw,11.5px)!important}\n\n/* taller table rows everywhere (screen only) */\nhtml body[data-page][data-page][data-page] table tbody td{padding-top:calc(var(--fs-cell)*.85)!important;padding-bottom:calc(var(--fs-cell)*.85)!important}\nhtml body[data-page][data-page][data-page] table thead th{padding-top:calc(var(--fs-head)*.8)!important;padding-bottom:calc(var(--fs-head)*.8)!important}\nhtml body[data-page][data-page][data-page] table tbody tr{min-height:calc(var(--fs-cell)*3)}\n\n/* the three bottom boxes always sit in ONE row, at every screen size */\nhtml body[data-page][data-page][data-page] .footer-summary{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:8px!important;align-items:stretch!important;width:100%!important}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-column{flex:1 1 0!important;min-width:0!important;width:auto!important}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-column{container-type:inline-size}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-item{flex-direction:row!important;flex-wrap:nowrap!important;justify-content:space-between!important;align-items:baseline!important;gap:4px!important;margin-bottom:5px!important;min-width:0!important}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-item span:first-child{font-size:clamp(8px,6.4cqw,var(--fs-cell))!important;white-space:nowrap!important;flex:0 0 auto!important}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-item span:last-child{font-size:clamp(9px,8.2cqw,var(--fs-total))!important;white-space:nowrap!important;flex:0 1 auto!important;min-width:0!important}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-column h3{font-size:clamp(10px,8.8cqw,var(--fs-total))!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}\nhtml body[data-page][data-page][data-page] .footer-summary .summary-item span:first-child{white-space:nowrap!important}\nhtml body[data-page][data-page][data-page] .summary-box{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:8px!important}\nhtml body[data-page][data-page][data-page] .summary-box .summary-item{flex:1 1 0!important;min-width:0!important}\n}\n@media print{html body .ubg-print-logo{display:block!important;position:absolute!important;top:1.5mm!important;right:4mm!important;left:auto!important;height:9mm!important;width:auto!important;max-width:26mm!important;object-fit:contain!important;z-index:50!important;border:0!important;border-radius:0!important}html{zoom:1!important}html body[data-page]{zoom:1!important}html body[data-page] table{zoom:1!important}}\n@media print{html body[data-page=\"daily_journal\"] #journalTable{table-layout:auto!important;width:100%!important}html body[data-page=\"daily_journal\"] #journalTable th,html body[data-page=\"daily_journal\"] #journalTable td{width:auto!important}html body[data-page=\"daily_journal\"] #journalTable th.col-extra{white-space:nowrap!important}html body[data-page=\"daily_journal\"] #journalTable td:not(.col-cust-name):not(.journal-detail-text){white-space:nowrap!important;overflow-wrap:normal!important;word-break:keep-all!important}}\n@media screen{html body tr.print-summary-row{display:none!important}}\n@media print{html body:not(.box-bottom) #footerSummaryBox{display:none!important}html body.box-bottom tr.print-summary-row{display:none!important}html body.box-bottom #footerSummaryBox{display:flex!important}html body tr.print-summary-row{display:table-row!important}html body tr.print-summary-row>th{background:#fff!important;border:0!important;padding:4px 0 6px!important;font-weight:normal!important}html body tr.print-summary-row .footer-summary{display:flex!important}}\n@media print{\nhtml body[data-page][data-page][data-page] table td,html body[data-page][data-page][data-page] table th{line-height:2.05!important;padding-top:4px!important;padding-bottom:4px!important}\nhtml body[data-page][data-page][data-page] .customer-main-name{line-height:2.2!important}\nhtml body[data-page][data-page][data-page] .customer-stats-subrow{line-height:1.9!important;margin-top:2px!important}\nhtml body[data-page][data-page][data-page] table td.col-cust-name,html body[data-page][data-page][data-page] table td.col-details,html body[data-page][data-page][data-page] table td.journal-detail-text{line-height:2.2!important}\n}\n@media print{\n/* ===== print tables: every column takes the room its own content needs (no letter/number splitting, no wasted side space) ===== */\nhtml body[data-page=\"customer_ledger\"] #ledgerTable th,html body[data-page=\"customer_ledger\"] #ledgerTable td{overflow-wrap:normal!important;word-break:keep-all!important}\nhtml body[data-page=\"customer_ledger\"] #ledgerTable th{white-space:normal!important}\nhtml body[data-page=\"customer_ledger\"] #ledgerTable td.col-details{white-space:normal!important;overflow-wrap:break-word!important}\nhtml body[data-page=\"customer_ledger\"] #ledgerTable th.col-date,html body[data-page=\"customer_ledger\"] #ledgerTable th.col-extra,html body[data-page=\"customer_ledger\"] #ledgerTable th.col-pcs,html body[data-page=\"customer_ledger\"] #ledgerTable th.col-weight,html body[data-page=\"customer_ledger\"] #ledgerTable th.col-rate,html body[data-page=\"customer_ledger\"] #ledgerTable th.col-amount{width:1%!important}\nhtml body[data-page=\"customer_ledger\"] #ledgerTable td.col-date,html body[data-page=\"customer_ledger\"] #ledgerTable td.col-extra,html body[data-page=\"customer_ledger\"] #ledgerTable td.col-pcs,html body[data-page=\"customer_ledger\"] #ledgerTable td.col-weight,html body[data-page=\"customer_ledger\"] #ledgerTable td.col-rate,html body[data-page=\"customer_ledger\"] #ledgerTable td.col-amount,html body[data-page=\"customer_ledger\"] #ledgerTable td.col-balance{white-space:nowrap!important;width:1%!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th,html body[data-page=\"daily_journal\"] #journalTable td{overflow-wrap:normal!important;word-break:keep-all!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th{white-space:normal!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thAccNo,html body[data-page=\"daily_journal\"] #journalTable th#thPcsBnam,html body[data-page=\"daily_journal\"] #journalTable th#thPcsJama,html body[data-page=\"daily_journal\"] #journalTable th#thWeight,html body[data-page=\"daily_journal\"] #journalTable th#thRate,html body[data-page=\"daily_journal\"] #journalTable th#thBnam,html body[data-page=\"daily_journal\"] #journalTable th#thJama,html body[data-page=\"daily_journal\"] #journalTable th.col-extra{width:1%!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thCustName,html body[data-page=\"daily_journal\"] #journalTable th#thDetails{width:auto!important}\nhtml body[data-page=\"daily_journal\"] #journalTable td:not(.col-cust-name):not(.text-right):not(.no-records){white-space:nowrap!important}\nhtml body[data-page=\"daily_journal\"] #journalTable td.col-cust-name,html body[data-page=\"daily_journal\"] #journalTable td.text-right{white-space:normal!important;overflow-wrap:break-word!important}\nhtml body[data-page=\"summary\"] .table-wrapper table th:nth-child(1),html body[data-page=\"summary\"] .table-wrapper table th:nth-child(3),html body[data-page=\"summary\"] .table-wrapper table td:nth-child(1):not([colspan]),html body[data-page=\"summary\"] .table-wrapper table td:nth-child(3):not([colspan]){width:1%!important;white-space:nowrap!important;overflow-wrap:normal!important;word-break:keep-all!important}\nhtml body[data-page=\"summary\"] .table-wrapper table th:nth-child(2),html body[data-page=\"summary\"] .table-wrapper table td:nth-child(2){width:auto!important;min-width:26mm}\nhtml body[data-page=\"summary\"] .table-wrapper table{table-layout:auto!important;width:100%!important}\n}\n@media print{\n/* ===== journal print: balanced column widths — every column has a sensible floor, name/details share the rest, nothing touches the page edge ===== */\nhtml body[data-page=\"daily_journal\"] #journalTable{width:calc(100% - 3px)!important;margin-left:auto!important;margin-right:auto!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thAccNo{min-width:13mm!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thPcsBnam,html body[data-page=\"daily_journal\"] #journalTable th#thPcsJama{min-width:12mm!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thWeight,html body[data-page=\"daily_journal\"] #journalTable th#thRate{min-width:16mm!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thBnam,html body[data-page=\"daily_journal\"] #journalTable th#thJama{min-width:24mm!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th.col-extra{min-width:18mm!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thCustName{min-width:27mm!important}\nhtml body[data-page=\"daily_journal\"] #journalTable th#thDetails{min-width:31mm!important}\n}\n";
                    (document.body || document.documentElement).appendChild(st);
                }
                if (/^(aging_report|all_branches|daily_journal|home)$/.test(page) && !document.querySelector('.print-logo-img,.print-logo-top-right,.ubg-print-logo')) {
                    var lg = document.createElement('img'); lg.src = 'logo_print.png'; lg.alt = 'Logo'; lg.className = 'ubg-print-logo';
                    lg.onerror = function () { lg.style.display = 'none'; };
                    document.body.insertBefore(lg, document.body.firstChild);
                }
                if (!document.getElementById('ubg-mobile-v4')) {
                    var mv = document.createElement('style'); mv.id = 'ubg-mobile-v4';
                    var dg = "U+0030-0039,U+002C,U+002D,U+002E,U+002F,U+003A,U+0025,U+0028,U+0029";
                    mv.textContent = "@font-face{font-family:'UBG Num';font-weight:100 600;unicode-range:" + dg + ";src:local('Helvetica Neue'),local('HelveticaNeue'),local('Roboto'),local('Segoe UI'),local('Arial')}" +
                        "@font-face{font-family:'UBG Num';font-weight:700 900;unicode-range:" + dg + ";src:local('Helvetica Neue Bold'),local('HelveticaNeue-Bold'),local('Roboto Bold'),local('Roboto-Bold'),local('Segoe UI Bold'),local('Arial Bold'),local('Arial-BoldMT')}" +
                        "@media (max-width:600px){html body[data-page][data-page][data-page],html body[data-page][data-page][data-page] *{font-family:'UBG Num','Inter','UBG Latin','Noto Nastaliq Urdu','Jameel Noori Nastaleeq','Noto Naskh Arabic',Tahoma,Arial,sans-serif!important;font-feature-settings:'lnum' 1,'tnum' 1}" +
                        "html body[data-page][data-page][data-page] .shared-scroll-wrapper{overflow-x:auto!important;-webkit-overflow-scrolling:touch}}";
                    (document.body || document.documentElement).appendChild(mv);
                }
                if (!document.getElementById('ubg-rows-v5')) {
                    var rw = document.createElement('style'); rw.id = 'ubg-rows-v5';
                    var X = 'html body[data-page][data-page][data-page][data-page]';
                    rw.textContent = '@media screen{' + X + ' table tbody td{padding-top:calc(var(--fs-cell)*1.15)!important;padding-bottom:calc(var(--fs-cell)*1.15)!important}' +
                        X + ' table thead th{padding-top:calc(var(--fs-head)*1.15)!important;padding-bottom:calc(var(--fs-head)*1.15)!important}' +
                        X + ' table tbody tr{min-height:calc(var(--fs-cell)*3.6)}}';
                    (document.body || document.documentElement).appendChild(rw);
                }
                if (!document.getElementById('ubg-text-v6')) {
                    var tx = document.createElement('style'); tx.id = 'ubg-text-v6';
                    var X = 'html body[data-page][data-page][data-page][data-page]';
                    var DT = ['customer_ledger', 'daily_journal', 'summary', 'aging_report', 'all_branches', 'deleted_entries', 'deleted_records'];
                    var on = function (p, q) { if (p === 'customer_ledger' && q.indexOf('table ') === 0) q = '#ledgerTable ' + q.slice(6); return X + '[data-page=' + p + '] ' + q; };
                    var all = function (q) { return DT.map(function (p) { return on(p, q); }).join(','); };
                    var NUM = 'var(--t-num)', TXT = 'var(--t-txt)', HEAD = 'var(--t-head)', TN = 'var(--t-totnum)', TL = 'var(--t-totlab)';
                    var css = '@media screen and (max-width:600px){:root{--t-num:14.3px;--t-txt:12.4px;--t-head:13px;--t-totnum:19.5px;--t-totlab:13px;' +
                        '--fs-cell:var(--t-txt);--fs-head:var(--t-head);--fs-total:var(--t-totnum);--fs-label:var(--t-txt);' +
                        '--w-num:calc(var(--t-num)*4);--w-amt:calc(var(--t-num)*7.4);--w-date:calc(var(--t-num)*5.6);--w-txt:calc(var(--t-txt)*8);--w-acc:calc(var(--t-num)*3.6);--w-act:calc(var(--t-num)*3)}';
                    css += all('table td') + '{font-size:' + NUM + '!important;font-weight:800!important;line-height:1.5!important}';
                    css += all('table th') + '{font-size:' + HEAD + '!important;font-weight:800!important;line-height:1.5!important;padding-left:3px!important;padding-right:3px!important;white-space:normal!important;overflow-wrap:normal!important;word-break:keep-all!important}';
                    css += on('summary', 'td.text-right,') + on('summary', '.customer-main-name') + '{white-space:normal!important;overflow-wrap:anywhere!important;min-width:0!important;max-width:100%!important}';
                    css += on('daily_journal', 'th#thPcsBnam,') + on('daily_journal', 'th#thPcsJama') + '{font-size:' + HEAD + '!important;font-weight:500!important;letter-spacing:normal!important;line-height:1.5!important;white-space:nowrap!important;padding-left:2px!important;padding-right:2px!important}';
                    var txt = [on('customer_ledger', '#ledgerTable td.col-details'), on('daily_journal', 'td.col-cust-name'), on('daily_journal', 'td.journal-detail-text'), on('daily_journal', 'tr.row-old-balance td:nth-child(2)'),
                        on('daily_journal', 'td.no-records'), on('summary', 'td.text-right'), on('aging_report', 'td.l'), on('aging_report', 'tbody tr:not(.agTotal) td:nth-child(3)'), on('all_branches', 'td.l'),
                        on('deleted_entries', 'td.l'), on('deleted_entries', 'td:nth-child(4)'), on('deleted_entries', 'td:nth-child(8)'), on('deleted_entries', 'td:nth-child(9)'),
                        on('deleted_records', 'td:nth-child(2)'), on('deleted_records', '.btn-view'), on('deleted_records', 'td.no-records'), on('deleted_entries', 'td.empty'), on('aging_report', 'td.empty')];
                    css += txt.join(',') + '{font-size:' + TXT + '!important;font-weight:600!important}';
                    css += on('summary', '.customer-stats-subrow') + '{flex-wrap:wrap!important;max-width:100%!important}';
                    css += on('summary', '.customer-stats-subrow,') + on('summary', '.customer-stats-subrow *') + '{font-size:calc(' + TXT + '*.85)!important;font-weight:900!important;line-height:1.25!important}' +
                        on('summary', '.customer-stats-subrow') + '{margin:0!important;padding:0!important}' +
                        on('summary', 'td.text-right:has(.customer-stats-subrow)') + '{padding-bottom:0!important;vertical-align:bottom!important}' +
                        on('summary', 'td.text-right:has(.customer-stats-subrow) .customer-inline-info') + '{gap:0!important;margin:0!important;padding:0!important}';
                    css += on('summary', 'table th,') + on('summary', '.customer-main-name') + '{font-size:' + NUM + '!important}';
                    css += on('daily_journal', '.row-today-total td') + '{font-size:' + NUM + '!important;font-weight:800!important}';
                    css += on('aging_report', 'tr.agTotal td,') + on('aging_report', 'tr.agTotal td b,') + on('all_branches', 'tbody tr:last-child td,') + on('all_branches', 'tbody tr:last-child td b') + '{font-size:' + TN + '!important;font-weight:900!important}';
                    css += on('daily_journal', '.row-today-total td:nth-child(2),') + on('aging_report', 'tr.agTotal td:first-child,') + on('aging_report', 'tr.agTotal td:first-child b,') + on('all_branches', 'tbody tr:last-child td.l,') + on('all_branches', 'tbody tr:last-child td.l b') + '{font-size:' + TL + '!important}';
                    css += on('daily_journal', '.row-carton-record td.text-right,') + on('daily_journal', '.row-final-balance td.text-right') + '{font-size:' + TL + '!important;font-weight:800!important}';
                    css += on('daily_journal', '.row-carton-record td span,') + on('daily_journal', '.row-final-balance td span') + '{font-size:' + NUM + '!important;font-weight:800!important}';
                    css += on('daily_journal', '.stat-value') + '{font-size:' + TN + '!important;font-weight:900!important}' + on('daily_journal', '.stat-label') + '{font-size:' + TL + '!important}';
                    css += on('customer_ledger', '.footer-summary') + '{flex-direction:row!important;flex-wrap:nowrap!important;gap:4px!important;padding:3px!important}' +
                        on('customer_ledger', '.footer-summary .summary-column') + '{flex:1 1 0!important;min-width:0!important;width:auto!important;padding:4px 3px!important;container-type:inline-size}' +
                        on('customer_ledger', '.footer-summary .summary-column h3') + '{font-size:' + TL + '!important;font-weight:900!important;text-align:center!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}' +
                        on('customer_ledger', '.footer-summary .summary-item') + '{flex-direction:row!important;align-items:baseline!important;justify-content:space-between!important;gap:2px!important;margin-bottom:5px!important}' +
                        on('customer_ledger', '.footer-summary .summary-item span:first-child') + '{font-size:' + TXT + '!important;white-space:nowrap!important;flex:0 0 auto!important}' +
                        on('customer_ledger', '.footer-summary .summary-item span:last-child') + '{font-size:' + NUM + '!important;font-weight:900!important;white-space:nowrap!important;text-align:end!important;flex:0 1 auto!important;min-width:0!important}';
                    css += on('customer_ledger', '.footer-summary #colSumPcs') + '{flex-grow:1!important}' + on('customer_ledger', '.footer-summary #colSumWeight') + '{flex-grow:1.35!important}' + on('customer_ledger', '.footer-summary #colSumCash') + '{flex-grow:1.9!important}';
                    var XE = 'html body.lang-en[data-page][data-page][data-page][data-page][data-page=customer_ledger] .footer-summary .summary-item span';
                    css += XE + ':first-child{font-size:calc(' + TXT + '*.88)!important}';
                    css += '@media (max-width:340px){' + on('customer_ledger', '.footer-summary .summary-item span:last-child') + '{font-size:calc(' + NUM + '*.82)!important}' + on('customer_ledger', '.footer-summary .summary-item span:first-child') + '{font-size:calc(' + TXT + '*.9)!important}}';
                    var J = '#journalTable', L = '#ledgerTable';
                    css += all('table td') + '{padding-left:3px!important;padding-right:3px!important;padding-top:calc(var(--t-num)*.5)!important;padding-bottom:calc(var(--t-num)*.5)!important;white-space:nowrap!important}';
                    css += all('table th') + '{padding-top:calc(var(--t-head)*.45)!important;padding-bottom:calc(var(--t-head)*.45)!important;width:1%!important;min-width:0!important}';
                    css += txt.join(',') + '{white-space:normal!important;overflow-wrap:break-word!important;word-break:normal!important;line-height:1.95!important;padding-left:4px!important;padding-right:4px!important}';
                    css += DT.map(function (p) { return on(p, 'table'); }).join(',').replace(/customer_ledger\] table/, 'customer_ledger] #ledgerTable') + '{table-layout:auto!important;width:100%!important;min-width:0!important;max-width:none!important}';
                    css += on('daily_journal', '#journalTable') + '{width:100%!important;min-width:0!important}';
                    css += on('customer_ledger', '#ledgerTable th.col-details') + ',' + on('daily_journal', 'th#thCustName,') + on('daily_journal', 'th#thDetails,') + on('summary', 'table th:nth-child(2),') + on('aging_report', 'table th:nth-child(2),') + on('all_branches', 'table th:nth-child(1),') +
                        on('deleted_entries', 'table th:nth-child(3),') + on('deleted_entries', 'table th:nth-child(6),') + on('deleted_entries', 'table th:nth-child(9),') + on('deleted_records', 'table th:nth-child(2)') + '{width:auto!important;min-width:calc(' + TXT + '*6)!important}';
                    css += on('daily_journal', 'th#thCustName,') + on('daily_journal', 'th#thDetails') + '{min-width:calc(' + TXT + '*6.5)!important}';
                    var XU = 'html body:not(.lang-en)[data-page][data-page][data-page][data-page][data-page=customer_ledger] #ledgerTable th.col-';
                    css += XU + 'bnam,' + XU + 'jama{white-space:nowrap!important}';
                    css += on('daily_journal', '#journalTable td:not(.no-records),') + on('daily_journal', 'th#thAccNo,') + on('daily_journal', 'th#thCustName,') + on('daily_journal', 'th#thDetails,') + on('daily_journal', 'th#thPcsBnam,') + on('daily_journal', 'th#thPcsJama,') + on('daily_journal', 'th#thWeight,') + on('daily_journal', 'th#thRate,') + on('daily_journal', 'th#thBnam,') + on('daily_journal', 'th#thJama') + '{padding-left:7px!important;padding-right:7px!important}';
                    css += ['#thAccNo', '#thPcsBnam', '#thPcsJama', '#thWeight', '#thRate', '#thBnam', '#thJama', '#thExtra'].map(function (i) { return on('daily_journal', 'th' + i); }).join(',') + '{width:1%!important;min-width:0!important}';
                    css += on('deleted_entries', 'table th,') + on('deleted_records', 'table th') + '{font-size:calc(' + HEAD + '*.72)!important;white-space:nowrap!important;padding-left:3px!important;padding-right:3px!important}';
                    css += on('summary', '.summary-box') + '{flex-direction:row!important;gap:4px!important;padding:8px 4px!important}' +
                        on('summary', '.summary-box .summary-item') + '{flex:1 1 33%!important;min-width:0!important;box-sizing:border-box!important;container-type:inline-size;font-size:' + TL + '!important}' +
                        on('summary', '.summary-box .summary-item span') + '{font-size:' + TL + '!important}' +
                        on('summary', '.summary-box .summary-item div') + '{margin:3px 0 0!important;font-size:min(' + TN + ',15cqw)!important;font-weight:900!important}';
                    /* aging report table: every size 2px smaller than before (each keeps its own size) */
                    css += on('aging_report', 'table th') + '{font-size:calc(' + HEAD + ' - 2px)!important}';
                    css += on('aging_report', 'table td') + '{font-size:calc(' + NUM + ' - 2px)!important}';
                    css += on('aging_report', 'td.l,') + on('aging_report', 'tbody tr:not(.agTotal) td:nth-child(3),') + on('aging_report', 'td.empty') + '{font-size:calc(' + TXT + ' - 2px)!important}';
                    css += on('aging_report', 'tr.agTotal td,') + on('aging_report', 'tr.agTotal td b') + '{font-size:calc(' + TN + ' - 2px)!important}';
                    css += on('aging_report', 'tr.agTotal td:first-child,') + on('aging_report', 'tr.agTotal td:first-child b') + '{font-size:calc(' + TL + ' - 2px)!important}';
                    /* deleted entries table: headers 4px smaller (never below 8px), numbers and names 3px smaller */
                    css += on('deleted_entries', 'table th') + '{font-size:max(8px,calc(' + HEAD + '*.72 - 4px))!important}';
                    css += on('deleted_entries', 'table td') + '{font-size:calc(' + NUM + ' - 3px)!important}';
                    css += on('deleted_entries', 'td.l,') + on('deleted_entries', 'td:nth-child(4),') + on('deleted_entries', 'td:nth-child(8),') + on('deleted_entries', 'td:nth-child(9),') + on('deleted_entries', 'td.empty') + '{font-size:calc(' + TXT + ' - 3px)!important}';
                    /* deleted accounts (deleted_records) table headers: 4px smaller, never below 8px */
                    css += on('deleted_records', 'table th') + '{font-size:max(8px,calc(' + HEAD + '*.72 - 4px))!important}';
                    /* customer ledger table only: all text 2px smaller + small side margin in every cell (bottom 3 boxes untouched) */
                    css += on('customer_ledger', '#ledgerTable td,') + on('customer_ledger', '#ledgerTable td .btn-pen-edit') + '{font-size:calc(' + NUM + ' - 2px)!important}';
                    css += on('customer_ledger', '#ledgerTable td.col-details') + '{font-size:calc(' + TXT + ' - 2px)!important}';
                    css += on('customer_ledger', '#ledgerTable th') + '{font-size:calc(' + HEAD + ' - 2px)!important}';
                    css += on('customer_ledger', '#ledgerTable td,') + on('customer_ledger', '#ledgerTable td.col-details,') + on('customer_ledger', '#ledgerTable th') + '{padding-left:6px!important;padding-right:6px!important}';
                    css += X + ' .card b{font-size:' + TN + '!important}}';
                    tx.textContent = css;
                    (document.body || document.documentElement).appendChild(tx);
                }
                applyZoom();
                window.addEventListener('resize', applyZoom);
                window.addEventListener('orientationchange', function () { setTimeout(applyZoom, 200); });
                window.addEventListener('load', function () { applyZoom(); setTimeout(fit, 400); });
                if (window.MutationObserver) new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
            } catch (e) {}
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
    })();

    function loadSettings(bid) {
        var d = defaultSettings();
        var s = readObject(keysFor(bid).settings);
        var out = {};
        Object.keys(d).forEach(function (k) { out[k] = (k === 'cols') ? {} : (s[k] !== undefined && s[k] !== null ? s[k] : d[k]); });
        var sc = (s.cols && typeof s.cols === 'object') ? s.cols : {};
        ['pcs', 'weight', 'rate', 'amount', 'extra'].forEach(function (k) {
            var c = (sc[k] && typeof sc[k] === 'object') ? sc[k] : {};
            out.cols[k] = {};
            Object.keys(d.cols[k]).forEach(function (f) { out.cols[k][f] = (c[f] !== undefined && c[f] !== null) ? c[f] : d.cols[k][f]; });
        });
        if (!out.cols.details) out.cols.details = {};
        out.extras = normExtras(s);
        out.colOrder = normColOrder(s.colOrder, out.extras);
        (function () { var v = out.extras.filter(function (e) { return e.visible; })[0] || out.extras[0]; if (v) out.cols.extra = { visible: out.extras.some(function (e) { return e.visible; }), name: v.name }; })();
        var en = settingsLangIsEn(bid);
        ['pcs', 'weight', 'rate', 'amount', 'extra'].forEach(function (k) {
            var n = out.cols[k].name, pair = COL_DEFAULTS[k];
            if (en && pair.ur.indexOf(n) >= 0) out.cols[k].name = pair.en;
            else if (!en && n === pair.en) out.cols[k].name = pair.ur[0];
        });
        return out;
    }
    var COL_DEFAULTS = {
        pcs: { ur: ['پیس', 'پیس / کارٹن', 'پیس/کارٹن'], en: 'Pcs' }, weight: { ur: ['وزن'], en: 'Weight' }, rate: { ur: ['ریٹ'], en: 'Rate' },
        amount: { ur: ['کل رقم'], en: 'Total Amount' }, extra: { ur: ['اضافی کالم'], en: 'Extra Field' }
    };
    function settingsLangIsEn(bid) {
        try {
            if (bid === getBranchId() && sessionStorage.getItem('active_branch_lang')) return sessionStorage.getItem('active_branch_lang') === 'en';
            return (readObject('rohan_branch_lang_overrides')[bid] || localStorage.getItem('rohan_global_lang') || 'ur') === 'en';
        } catch (e) { return false; }
    }

    function calcTotal(o) {
        var s = o.settings || {};
        var pcs = num(o.pcs), weight = num(o.weight), rate = num(o.rate);
        var unit = parseFloat(o.unit) || parseFloat(s.maundUnit) || 37.324;
        var thRaw = parseFloat(s.rateThreshold);
        var th = isNaN(thRaw) ? 25000 : thRaw;
        var mode = o.mode || 'auto';
        var res = { total: 0, mode: '', unit: unit, percent: 0 };
        if (rate > 0) {
            if (weight > 0) {
                var m = (mode === 'auto') ? (rate >= th ? 'maund' : 'unit') : mode;
                res.mode = m;
                res.total = (m === 'maund') ? (weight / unit) * rate : weight * rate;
            } else if (pcs > 0) {
                res.mode = 'pcs';
                res.total = pcs * rate;
            }
            var pv = parseFloat(o.percentVal !== undefined ? o.percentVal : s.percentVal) || 0;
            var enabled = (o.percentVal !== undefined) ? true : !!s.enablePercent;
            var pm = o.percentMode || s.percentMode;
            if (enabled && pv > 0 && res.total > 0) {
                var p = (res.total * pv) / 100;
                if (pm === 'add') { res.total += p; res.percent = pv; } else { res.total -= p; res.percent = -pv; }
            }
        }
        res.total = Math.round(res.total);
        return res;
    }

    /* ONE shared entry-total function: Credit sheet, Debit sheet and Edit-entry page all call this.
       Any future change to the total/formula logic is made here (and in calcTotal) only. */
    function calcEntry(o) {
        var args = { pcs: o.pcs, weight: o.weight, rate: o.rate, unit: o.unit, mode: 'auto', settings: o.settings };
        if (o.percentApplied !== undefined) {
            var pa = parseFloat(o.percentApplied) || 0;
            args.percentVal = Math.abs(pa);
            args.percentMode = pa > 0 ? 'add' : 'deduct';
        }
        return calcTotal(args);
    }

    function migrateBranch(bid) {
        if (!bid) return;
        var k = keysFor(bid);
        var details = readArray(k.details).filter(function (d) { return d && typeof d === 'object' && d.name; });
        var changedD = false;
        details.forEach(function (d) { if (!d.id) { d.id = uid(); changedD = true; } });
        if (changedD || details.length !== readArray(k.details).length) store.set(k.details, JSON.stringify(details));
        var idByName = {};
        details.forEach(function (d) { idByName[norm(d.name)] = d.id; });

        var recs = readArray(k.records);
        var changedR = false;
        recs.forEach(function (r) {
            if (!r || typeof r !== 'object') return;
            if (!r.id) { r.id = uid(); changedR = true; }
            ['pcs', 'weight', 'totalAmount'].forEach(function (f) {
                if (typeof r[f] !== 'number') { r[f] = num(r[f]); changedR = true; }
            });
            if (!r.customerId && r.customerName && idByName[norm(r.customerName)]) { r.customerId = idByName[norm(r.customerName)]; changedR = true; }
            if (!r.createdAt) { r.createdAt = ''; }
        });
        if (changedR) store.set(k.records, JSON.stringify(recs));
        try { store.remove('factory_customers'); } catch (e) {}
    }

    function getDeletionMap(bid) {
        var map = {};
        readArray(keysFor(bid).deleted).forEach(function (d) {
            var name = (d && typeof d === 'object') ? d.name : d;
            if (!name) return;
            map[norm(name)] = (d && typeof d === 'object') ? toISODate(d.date) : '';
        });
        return map;
    }
    function liveOn(name, iso, activeSet, delMap) {
        var n = norm(name);
        if (activeSet[n]) return true;
        if (Object.prototype.hasOwnProperty.call(delMap, n)) {
            var dd = delMap[n];
            return !!(dd && iso && iso <= dd);
        }
        return false;
    }
    function activeNameSet(bid) {
        var set = {};
        readArray(keysFor(bid).customers).forEach(function (n) { set[norm(n)] = true; });
        return set;
    }

    function archiveDeletedSameName(bid, name, isEn) {
        var k = keysFor(bid);
        var deleted = readArray(k.deleted);
        var match = deleted.filter(function (d) { return sameName((d && typeof d === 'object') ? d.name : d, name); });
        if (!match.length) return;
        var suffix = Date.now().toString().slice(-4);
        var archived = isEn ? (name + ' (Archived #' + suffix + ')') : (name + ' (ختم شدہ #' + suffix + ')');
        deleted.forEach(function (d, i) {
            var dn = (d && typeof d === 'object') ? d.name : d;
            if (sameName(dn, name)) { if (d && typeof d === 'object') d.name = archived; else deleted[i] = archived; }
        });
        store.set(k.deleted, JSON.stringify(deleted));
        var recs = readArray(k.records);
        recs.forEach(function (r) { if (r && sameName(r.customerName, name)) r.customerName = archived; });
        store.set(k.records, JSON.stringify(recs));
        var det = readArray(k.details);
        det.forEach(function (c) { if (c && sameName(c.name, name)) c.name = archived; });
        store.set(k.details, JSON.stringify(det));
    }

    function normalizePhone(raw) {
        var d = String(raw || '').replace(/[^0-9]/g, '');
        if (!d) return '';
        if (d.indexOf('00') === 0) return d.slice(2);
        if (d.indexOf('92') === 0 && d.length >= 12) return d;
        if (d.indexOf('971') === 0 && d.length >= 12) return d;
        if (d.length === 11 && d.indexOf('03') === 0) return '92' + d.slice(1);
        if (d.length === 10 && d.charAt(0) === '3') return '92' + d;
        if (d.length === 10 && d.indexOf('05') === 0) return '971' + d.slice(1);
        if (d.length === 9 && d.charAt(0) === '5') return '971' + d;
        return d;
    }
    function openExternal(url) { return w.open(url, '_blank', 'noopener,noreferrer'); }

    function request(method, urlPath, body) {
        if (!APP_CONFIG.API_BASE) return Promise.resolve({ ok: false, status: 0, data: null, offline: true });
        var headers = { 'Content-Type': 'application/json' };
        try { var tk = sessionStorage.getItem('api_token'); if (tk) headers['Authorization'] = 'Bearer ' + tk; } catch (e) {}
        return fetch(APP_CONFIG.API_BASE.replace(/\/$/, '') + urlPath, { method: method, headers: headers, body: body === undefined ? undefined : JSON.stringify(body) })
            .then(function (r) {
                return r.json().catch(function () { return null; }).then(function (data) {
                    if (r.status === 401 && sessionActive()) sessionExpired();
                    return { ok: r.ok, status: r.status, data: data };
                });
            }, function () { return { ok: false, status: 0, data: null }; });
    }
    function sessionExpired() {
        try { sessionStorage.clear(); } catch (e) {}
        if (!isIndex) w.location.replace('./index.html');
    }
    var apiWarned = 0;
    function api(method, urlPath, body) {
        if (!APP_CONFIG.API_BASE) return Promise.resolve(null);
        return request(method, urlPath, body).then(function (r) {
            if (r.ok) return r.data || {};
            if (Date.now() - apiWarned > 15000) { apiWarned = Date.now(); toast('⚠️ سرور سے رابطہ نہیں ہوا — ڈیٹا صرف اس براؤزر میں محفوظ ہے / Server not reachable, saved locally only'); }
            return null;
        });
    }

    var LOCAL_ONLY = /^(rohan_(theme_mode|global_lang|font_scale|table_density|reduce_motion|card_badge|card_status|branch_cols|tbl_head_size|tbl_head_font|tbl_acc_size|tbl_acc_font|tbl_text_size|tbl_text_font|tbl_num_size|tbl_num_font|tbl_row_h|tbl_col_w|logout_confirm|voice_fix|voice_pos|voice_eng|users_v1|outbox|sync_versions|sync_conflicts)|.*_audit_seen)$/;
    var SYNC_META = /^rohan_(outbox|sync_versions|sync_conflicts)$/;
    var flushing = false, flushTimer = 0, retryMs = 2000;
    function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function rawObj(k) { try { var v = JSON.parse(rawGet(k)); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch (e) { return {}; } }
    function rawPut(k, o) { try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) {} }
    function isSynced(key) { return !LOCAL_ONLY.test(key); }
    function markDirty(key) {
        if (!APP_CONFIG.API_BASE || !isSynced(key)) return;
        var ob = rawObj('rohan_outbox'); ob[key] = Date.now(); rawPut('rohan_outbox', ob);
        scheduleFlush(800);
    }
    function scheduleFlush(ms) {
        if (!APP_CONFIG.API_BASE) return;
        clearTimeout(flushTimer); flushTimer = setTimeout(flush, ms);
    }
    function flush() {
        if (flushing || !APP_CONFIG.API_BASE || !sessionActive()) return Promise.resolve();
        var ob = rawObj('rohan_outbox'), keys = Object.keys(ob), vers = rawObj('rohan_sync_versions'), conf = rawObj('rohan_sync_conflicts');
        keys = keys.filter(function (k) { return !conf[k]; });
        if (!keys.length) return Promise.resolve();
        flushing = true;
        var i = 0, failed = false;
        function next() {
            if (i >= keys.length || failed) return Promise.resolve();
            var key = keys[i++], val = rawGet(key), at = rawObj('rohan_outbox')[key], path = '/api/kv/' + encodeURIComponent(key);
            var p = val === null ? request('DELETE', path, { version: vers[key] || 0 }) : request('PUT', path, { value: val, version: vers[key] || 0 });
            return p.then(function (r) {
                if (r.ok) {
                    var cur = rawObj('rohan_outbox');
                    if (cur[key] === at) delete cur[key];
                    rawPut('rohan_outbox', cur);
                    if (r.data && r.data.version !== undefined) { vers[key] = r.data.version; rawPut('rohan_sync_versions', vers); }
                    retryMs = 2000;
                } else if (r.status === 409) {
                    conf[key] = Date.now(); rawPut('rohan_sync_conflicts', conf);
                    toast('⚠️ سرور پر نیا ڈیٹا موجود ہے، ہم آہنگی رکی ہے / Sync conflict on server data');
                } else if (r.status === 400 || r.status === 403 || r.status === 413 || r.status === 422) {
                    var c2 = rawObj('rohan_outbox'); delete c2[key]; rawPut('rohan_outbox', c2);
                    console.warn('server rejected', key, r.status);
                } else { failed = true; }
                return next();
            });
        }
        return next().then(function () {
            flushing = false;
            if (failed) { retryMs = Math.min(60000, retryMs * 2); scheduleFlush(retryMs); }
        });
    }
    function pull() {
        if (!APP_CONFIG.API_BASE) return Promise.resolve(0);
        return request('GET', '/api/kv').then(function (r) {
            if (!r.ok || !r.data || typeof r.data.items !== 'object' || !r.data.items) return 0;
            var ob = rawObj('rohan_outbox'), vers = rawObj('rohan_sync_versions'), n = 0;
            Object.keys(r.data.items).forEach(function (k) {
                var it = r.data.items[k];
                if (!isSynced(k) || ob[k] || !it || typeof it.value !== 'string') return;
                if (rawGet(k) !== it.value) { try { localStorage.setItem(k, it.value); n++; } catch (e) {} }
                vers[k] = it.version || 0;
            });
            rawPut('rohan_sync_versions', vers);
            return n;
        });
    }
    var store = {
        get: function (key) { return rawGet(key); },
        set: function (key, value) { localStorage.setItem(key, String(value)); markDirty(key); },
        remove: function (key) { localStorage.removeItem(key); markDirty(key); },
        isSynced: isSynced, pull: pull, flush: flush,
        pending: function () { return Object.keys(rawObj('rohan_outbox')).length; },
        conflicts: function () { return Object.keys(rawObj('rohan_sync_conflicts')); },
        resolve: function (key, keep) {
            return request('GET', '/api/kv/' + encodeURIComponent(key)).then(function (r) {
                var conf = rawObj('rohan_sync_conflicts'), vers = rawObj('rohan_sync_versions'), ob = rawObj('rohan_outbox');
                if (r.ok && r.data) {
                    vers[key] = r.data.version || 0; rawPut('rohan_sync_versions', vers);
                    if (keep === 'server' && typeof r.data.value === 'string') { try { localStorage.setItem(key, r.data.value); } catch (e) {} delete ob[key]; rawPut('rohan_outbox', ob); }
                    else { ob[key] = Date.now(); rawPut('rohan_outbox', ob); }
                } else if (r.status === 404) { vers[key] = 0; rawPut('rohan_sync_versions', vers); }
                else return false;
                delete conf[key]; rawPut('rohan_sync_conflicts', conf); scheduleFlush(100);
                return true;
            });
        }
    };
    if (APP_CONFIG.API_BASE) {
        w.addEventListener('online', function () { scheduleFlush(300); });
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
        setTimeout(function () { scheduleFlush(500); }, 1500);
    }

    var auth = {
        login: function (username, password, localUsers) {
            if (APP_CONFIG.API_BASE) {
                return request('POST', '/api/login', { username: username, password: password }).then(function (r) {
                    if (r.ok && r.data && r.data.token && (r.data.role === 'admin' || r.data.role === 'owner')) return { ok: true, role: r.data.role, token: r.data.token, user: username, branches: Array.isArray(r.data.branches) ? r.data.branches : '*' };
                    return { ok: false, network: r.status === 0, locked: r.status === 429 };
                });
            }
            var custom = readJSON('rohan_users_v1', {}), has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
            if (!custom || typeof custom !== 'object' || Array.isArray(custom)) custom = {};
            var merge = function (n) { return has(localUsers, n) || has(custom, n) ? Object.assign({}, has(localUsers, n) ? localUsers[n] : {}, has(custom, n) ? custom[n] : {}) : null; };
            var u = merge(username), ref = u && u.salt && u.hash ? u : merge('admin');
            return w.App.pbkdf2Hex(username + ':' + password, ref.salt, ref.iter).then(function (h) {
                var okUser = u && u.hash && !u.disabled && (u.role === 'admin' || u.role === 'owner') && h === u.hash;
                return okUser ? { ok: true, role: u.role, user: username, branches: Array.isArray(u.branches) ? u.branches : '*' } : { ok: false };
            });
        },
        start: function (res) {
            sessionStorage.setItem('rohan_session_active', 'true');
            sessionStorage.setItem('rohan_user_role', res.role);
            sessionStorage.setItem('rohan_last_activity', String(Date.now()));
            sessionStorage.setItem('rohan_user_name', res.user || '');
            sessionStorage.setItem('rohan_user_branches', JSON.stringify(Array.isArray(res.branches) ? res.branches : '*'));
            if (res.token) sessionStorage.setItem('api_token', res.token);
        },
        logout: function () {
            var p = APP_CONFIG.API_BASE ? flush().then(function () { return request('POST', '/api/logout', {}); }) : Promise.resolve();
            return p;
        }
    };

    function exportBackup() {
        var data = {};
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (SYNC_META.test(key)) continue;
            data[key] = localStorage.getItem(key);
        }
        var payload = { app: 'unit-business-group', version: 2, exportedAt: new Date().toISOString(), data: data };
        var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'backup_' + localDate() + '.json';
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }
    function importBackup(file, done) {
        var fr = new FileReader();
        fr.onload = function () {
            try {
                var p = JSON.parse(fr.result);
                if (!p || p.app !== 'unit-business-group' || !p.data || typeof p.data !== 'object') throw new Error('bad file');
                Object.keys(p.data).forEach(function (k) { if (typeof p.data[k] === 'string' && !SYNC_META.test(k)) store.set(k, p.data[k]); });
                done(true);
            } catch (e) { done(false); }
        };
        fr.onerror = function () { done(false); };
        fr.readAsText(file);
    }

    function hasChart() { return typeof w.Chart !== 'undefined'; }

    var voiceWords = {
        key: 'rohan_voice_words',
        load: function () {
            return readArray(this.key).filter(function (x) { return x && typeof x.w === 'string' && x.w.trim(); })
                .map(function (x) { return { w: x.w.trim(), s: typeof x.s === 'string' ? x.s.trim() : '' }; });
        },
        save: function (list) {
            try { store.set(this.key, JSON.stringify(list)); } catch (e) { return false; }
            return true;
        }
    };

    w.App = {
        esc: esc, norm: norm, sameName: sameName, readJSON: readJSON, readArray: readArray, readObject: readObject,
        uid: uid, localDate: localDate, toISODate: toISODate, fmtDMY: fmtDMY, num: num, toast: toast,
        sessionActive: sessionActive, getRole: getRole, getBranchId: getBranchId, keysFor: keysFor, blockOwner: blockOwner, guardOwner: guardOwner, ownerPerms: ownerPerms, ownerCan: ownerCan,
        DEFAULT_BRANCHES: DEFAULT_BRANCHES, getBranches: getBranches, visibleBranches: visibleBranches, canSeeBranch: canSeeBranch, allowedBranchIds: allowedBranchIds,
        loadSettings: loadSettings, visibleExtras: visibleExtras, extraVal: extraVal, evalFormula: evalFormula, buildEntryExtras: buildEntryExtras, readEntryExtras: readEntryExtras, calcTotal: calcTotal, calcEntry: calcEntry, migrateBranch: migrateBranch,
        getDeletionMap: getDeletionMap, liveOn: liveOn, activeNameSet: activeNameSet,
        archiveDeletedSameName: archiveDeletedSameName, normalizePhone: normalizePhone, openExternal: openExternal,
        api: api, request: request, store: store, auth: auth, voiceWords: voiceWords, exportBackup: exportBackup, importBackup: importBackup, hasChart: hasChart
    };

    try { if (!isIndex && getBranchId()) migrateBranch(getBranchId()); } catch (e) { console.warn('migration', e); }

    try {
        var css =
        '@media screen {' +
        'html body .btn-print, html body .btn-back, html body .btn-top-back, html body .btn-header, html body .btn-logout, html body .btn-lang-settings, html body .btn-chart-settings, html body .btn-theme-toggle, html body .btn-dash-print, html body #btnOut, html body #btnBack {' +
        ' box-sizing:border-box !important; height:44px !important; min-width:0 !important; width:120px !important; max-width:120px !important; flex:0 0 120px !important; padding:0 6px !important; font-size:15px !important; font-weight:800 !important; margin-top:0 !important; margin-bottom:0 !important; line-height:1 !important; border-radius:6px !important; display:inline-flex !important; align-items:center !important; justify-content:center !important; white-space:nowrap !important; text-decoration:none !important; }' +
        'html body .btn-save, html body .btn-submit, html body .btn-login, html body .btn-delete-entry, html body .btn-delete-account, html body .btn-restore-account, html body .btn-modal-save, html body .btn-modal-close {' +
        ' box-sizing:border-box !important; min-height:44px !important; font-size:15px !important; font-weight:bold !important; border-radius:8px !important; }' +
        '.shared-scroll-wrapper { scrollbar-width: thin; }' +
        '.shared-scroll-wrapper::-webkit-scrollbar { height:4px; width:4px; }' +
        '.shared-scroll-wrapper::-webkit-scrollbar-thumb { background:#666; border-radius:4px; }' +
        '.footer-summary, .summary-box { overflow:visible !important; }' +
        '}' +
        '@media screen and (max-width:600px) {' +
        'html body .btn-print, html body .btn-back, html body .btn-top-back, html body .btn-header, html body .btn-logout, html body .btn-lang-settings, html body .btn-chart-settings, html body .btn-theme-toggle, html body .btn-dash-print, html body #btnOut, html body #btnBack {' +
        ' height:38px !important; width:96px !important; max-width:96px !important; flex:0 0 96px !important; padding:0 4px !important; font-size:13px !important; font-weight:800 !important; }' +
        'html body .btn-save, html body .btn-submit, html body .btn-login, html body .btn-delete-entry, html body .btn-delete-account, html body .btn-restore-account, html body .btn-modal-save, html body .btn-modal-close { min-height:40px !important; font-size:14px !important; }' +
        '}' +
        '@media screen and (max-width:340px) {' +
        'html body .btn-print, html body .btn-back, html body .btn-top-back, html body .btn-header, html body .btn-logout, html body .btn-lang-settings, html body .btn-chart-settings, html body .btn-theme-toggle, html body .btn-dash-print, html body #btnOut, html body #btnBack {' +
        ' height:36px !important; width:80px !important; max-width:80px !important; flex:0 0 80px !important; font-size:12px !important; }' +
        '}';
        var addStyle = function () { var st = document.createElement('style'); st.id = 'appUnifiedUI'; st.textContent = css; document.head.appendChild(st); };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addStyle); else addStyle();
    } catch (e) {}
})(window);

(function (w) {
    'use strict';
    var App = w.App; if (!App) return;
    App.printNow = w.__ubgPrintNow;

    (function () {
        var pg = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (/^(index|branches|jama_entry|bnam_entry)\.html$/.test(pg)) return;
        function apply() {
            try {
                var id = sessionStorage.getItem('active_branch_id'); if (!id) return;
                var br = (App.getBranches() || []).filter(function (b) { return b.id === id; })[0]; if (!br) return;
                var col = br.color1 || br.color || ''; if (!/^#[0-9a-f]{3,8}$/i.test(col)) return;
                var st = document.createElement('style'); st.id = 'ubg-branch-border';
                st.textContent = '@media screen{body>.form-container,body>.edit-container,body>.archive-container,body>.ledger-container,body>.container,body>.wrap,body>.chart-box,body>.dashboard-container>.chart-box,body>.dashboard-container>.dashboard{border:1.5px solid ' + col + '!important}}';
                document.head.appendChild(st);
            } catch (e) {}
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
    })();
    var APP_CONFIG = w.APP_CONFIG || {};
    var D = document;
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var isIndex = (path === '' || path === 'index.html' || path === 'password_key_maker.html');
    if (!APP_CONFIG.SESSION_TIMEOUT_MIN) APP_CONFIG.SESSION_TIMEOUT_MIN = 30;

    function isEnLang() {
        try {
            var bid = App.getBranchId(), ov = App.readObject('rohan_branch_lang_overrides');
            return (sessionStorage.getItem('active_branch_lang') || ov[bid] || localStorage.getItem('rohan_global_lang') || 'ur') === 'en';
        } catch (e) { return false; }
    }
    function T(isEn, ur, en) { return isEn ? en : ur; }
    function xk(bid) { return { audit: bid + '_audit_log', recycle: bid + '_deleted_entries', seq: bid + '_entry_seq', seen: bid + '_audit_seen' }; }
    function nowISO() { return new Date().toISOString(); }
    function todayISO() { return App.localDate(); }
    function save(key, val) { App.store.set(key, JSON.stringify(val)); }
    function fmtN(n) { return Number(n || 0).toLocaleString('en-US'); }
    function daysBetween(aISO, bISO) {
        var a = Date.parse(aISO + 'T00:00:00'), b = Date.parse(bISO + 'T00:00:00');
        if (isNaN(a) || isNaN(b)) return 0;
        return Math.round((b - a) / 86400000);
    }
    function amtOf(r) { return parseFloat(r && r.totalAmount) || 0; }
    function show(v) { return (v === undefined || v === null || v === '' || v === '-') ? '—' : String(v); }

    App.audit = function (bid, action, info) {
        try {
            var k = xk(bid).audit, list = App.readArray(k);
            var e = { id: App.uid(), ts: nowISO(), by: App.getRole(), action: action };
            Object.keys(info || {}).forEach(function (f) { e[f] = info[f]; });
            list.push(e);
            if (list.length > 2000) list = list.slice(list.length - 2000);
            save(k, list);
            return e;
        } catch (err) { console.warn('audit', err); return null; }
    };
    App.auditUnseen = function (bid) {
        var seen = localStorage.getItem(xk(bid).seen) || '';
        return App.readArray(xk(bid).audit).filter(function (e) { return e && !e.minor && e.ts > seen; }).length;
    };
    App.auditMarkSeen = function (bid) { try { App.store.set(xk(bid).seen, nowISO()); } catch (e) {} };

    App.recycleEntry = function (bid, rec, reason, extra) {
        var k = xk(bid).recycle, list = App.readArray(k);
        var item = { rid: App.uid(), deletedAt: nowISO(), deletedBy: App.getRole(), reason: reason || 'DELETE', rec: JSON.parse(JSON.stringify(rec)) };
        if (extra) Object.keys(extra).forEach(function (f) { item[f] = extra[f]; });
        list.push(item); save(k, list);
        return item;
    };
    App.purgeRecycle = function (bid) {
        var days = parseInt(App.loadSettings(bid).recycleDays, 10) || 0;
        if (days <= 0) return 0;
        var k = xk(bid).recycle, list = App.readArray(k), limit = Date.now() - days * 86400000;
        var keep = list.filter(function (x) { var t = x && Date.parse(x.deletedAt); return !(t && t < limit); });
        if (keep.length !== list.length) save(k, keep);
        return list.length - keep.length;
    };
    App.restoreEntry = function (bid, rid, opts) {
        var K = App.keysFor(bid), kk = xk(bid).recycle, list = App.readArray(kk);
        var i = list.findIndex(function (x) { return x && x.rid === rid; });
        if (i < 0) return { ok: false, code: 'NOT_FOUND' };
        var item = list[i], rec = item.rec;
        var customers = App.readArray(K.customers);
        var active = customers.some(function (c) { return App.sameName(c, rec.customerName); });
        if (!active) {
            var inDeleted = App.readArray(K.deleted).some(function (d) { return App.sameName((d && typeof d === 'object') ? d.name : d, rec.customerName); });
            if (inDeleted) return { ok: false, code: 'ACCOUNT_DELETED' };
            if (!(opts && opts.recreate)) return { ok: false, code: 'NO_CUSTOMER' };
            customers.push(rec.customerName); save(K.customers, customers);
            if (item.cust) {
                var det = App.readArray(K.details);
                if (!det.some(function (c) { return c && App.sameName(c.name, rec.customerName); })) { det.push(item.cust); save(K.details, det); }
            }
        }
        var recs = App.readArray(K.records);
        if (!recs.some(function (r) { return r && r.id === rec.id; })) recs.push(rec);
        save(K.records, recs);
        list.splice(i, 1); save(kk, list);
        App.audit(bid, 'RESTORE', { recordId: rec.id, no: rec.no, customer: rec.customerName, amount: amtOf(rec), type: rec.type, date: rec.date, rec: JSON.parse(JSON.stringify(rec)),
            summary: 'بحال / Restored #' + (rec.no || '-') + ' ' + rec.customerName + ' ' + fmtN(amtOf(rec)) });
        return { ok: true, rec: rec };
    };
    App.archiveAccount = function (bid, name) {
        var K = App.keysFor(bid), n = 0;
        var det = App.readArray(K.details).find(function (c) { return c && App.sameName(c.name, name); }) || null;
        App.readArray(K.records).forEach(function (r) {
            if (r && App.sameName(r.customerName, name)) { App.recycleEntry(bid, r, 'ACCOUNT_PERM_DELETE', { cust: det }); n++; }
        });
        App.audit(bid, 'ACCOUNT_PERM_DELETE', { customer: name, count: n, summary: 'کھاتہ مستقل ختم / Account permanently deleted: ' + name + ' (' + n + ' entries kept in recycle bin)' });
        return n;
    };

    App.nextSerial = function (bid) {
        var k = xk(bid).seq, cur = parseInt(localStorage.getItem(k), 10) || 0, max = 0;
        App.readArray(App.keysFor(bid).records).forEach(function (r) { if (r && r.no > max) max = r.no; });
        var n = Math.max(cur, max) + 1;
        App.store.set(k, String(n));
        return n;
    };
    function assignSerials(bid) {
        var K = App.keysFor(bid), recs = App.readArray(K.records);
        if (!recs.length) return;
        var missing = [], max = parseInt(localStorage.getItem(xk(bid).seq), 10) || 0;
        recs.forEach(function (r, i) {
            if (!r || typeof r !== 'object') return;
            if (typeof r.no === 'number' && r.no > 0) { if (r.no > max) max = r.no; } else missing.push(i);
        });
        if (!missing.length) return;
        missing.sort(function (a, b) {
            var da = (recs[a].date || '') + '|' + (recs[a].createdAt || ''), db = (recs[b].date || '') + '|' + (recs[b].createdAt || '');
            return da < db ? -1 : (da > db ? 1 : a - b);
        });
        missing.forEach(function (i) { max++; recs[i].no = max; });
        save(K.records, recs);
        App.store.set(xk(bid).seq, String(max));
    }

    function idNameMap(bid) {
        var m = {};
        App.readArray(App.keysFor(bid).details).forEach(function (c) { if (c && c.id && c.name) m[c.id] = c.name; });
        return m;
    }
    function recName(r, idMap) { return (r.customerId && idMap[r.customerId]) ? idMap[r.customerId] : r.customerName; }
    App.recordsByCustomer = function (bid) {
        var idMap = idNameMap(bid), out = {};
        App.readArray(App.keysFor(bid).records).forEach(function (r) {
            if (!r || !r.customerName) return;
            var n = App.norm(recName(r, idMap));
            (out[n] = out[n] || []).push(r);
        });
        return out;
    };
    App.balanceOf = function (list, asOfISO) {
        var b = 0;
        (list || []).forEach(function (r) {
            if (!r) return;
            if (asOfISO && !(r.date && r.date <= asOfISO)) return;
            b += (r.type === 'JAMA') ? amtOf(r) : -amtOf(r);
        });
        return b;
    };
    App.customerInfo = function (bid, name, id) {
        var det = App.readArray(App.keysFor(bid).details);
        return det.find(function (c) { return c && ((id && c.id === id) || App.sameName(c.name, name)); }) || null;
    };

    App.aging = function (list, asOfISO) {
        asOfISO = asOfISO || todayISO();
        var recs = (list || []).filter(function (r) { return r && r.date && r.date <= asOfISO; });
        var net = App.balanceOf(recs);
        if (Math.abs(net) < 0.5) return null;
        var jamaSide = net > 0;
        function ord(a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : ((a.no || 0) - (b.no || 0))); }
        var pool = recs.filter(function (r) { return (r.type === 'JAMA') === jamaSide; }).sort(ord);
        var opp = 0;
        recs.forEach(function (r) { if ((r.type === 'JAMA') !== jamaSide) opp += amtOf(r); });
        var items = [];
        pool.forEach(function (r) {
            var amt = amtOf(r), take = Math.min(amt, opp); opp -= take;
            var rem = amt - take;
            if (rem > 0.5) items.push({ date: r.date, amount: rem, days: daysBetween(r.date, asOfISO) });
        });
        if (!items.length) return null;
        return { side: jamaSide ? 'JAMA' : 'BNAM', net: net, oldestDate: items[0].date, days: items[0].days, items: items };
    };
    App.agingStep = function () { var v = parseInt(App.loadSettings(App.getBranchId()).agingStep, 10); return v > 0 ? v : 30; };
    App.agingBucket = function (days) { var s = App.agingStep(); return days <= s ? 0 : (days <= 2 * s ? 1 : (days <= 3 * s ? 2 : 3)); };
    App.dueDays = function (bid) { var v = parseInt(App.loadSettings(bid).dueDays, 10); return isNaN(v) ? 30 : Math.max(0, v); };
    App.creditLimitOf = function (bid, name, id) {
        var c = App.customerInfo(bid, name, id);
        var v = c ? parseFloat(c.creditLimit) : 0;
        return (v > 0) ? v : 0;
    };

    function creditWarn(bid, entry, isEn, excludeId) {
        if (entry.type === 'JAMA' || App.loadSettings(bid).creditWarn === false) return '';
        var lim = App.creditLimitOf(bid, entry.customerName, entry.customerId);
        if (!lim) return '';
        var list = (App.recordsByCustomer(bid)[App.norm(entry.customerName)] || []).filter(function (r) { return r.id !== excludeId; });
        var after = App.balanceOf(list) - amtOf(entry);
        if (after < 0 && -after > lim) {
            return T(isEn, '💳 کریڈٹ لمٹ (' + fmtN(lim) + ') سے بڑھ جائے گی۔ نیا بقایا بنام: ' + fmtN(-after),
                           '💳 Credit limit (' + fmtN(lim) + ') will be exceeded. New debit balance: ' + fmtN(-after));
        }
        return '';
    }
    App.entryWarnings = function (bid, entry, isEn) {
        var out = [];
        var st = App.loadSettings(bid);
        if (st.futureWarn !== false && entry.date && entry.date > todayISO()) out.push(T(isEn, '📅 تاریخ آج سے آگے کی ہے: ' + App.fmtDMY(entry.date), '📅 The date is in the future: ' + App.fmtDMY(entry.date)));
        if (st.maxAmountWarn > 0 && amtOf(entry) > st.maxAmountWarn) out.push(T(isEn, '💰 رقم مقررہ حد (' + fmtN(st.maxAmountWarn) + ') سے زیادہ ہے: ' + fmtN(amtOf(entry)), '💰 The amount exceeds the set limit (' + fmtN(st.maxAmountWarn) + '): ' + fmtN(amtOf(entry))));
        var amt = Math.round(amtOf(entry));
        var dup = st.dupWarn !== false && App.readArray(App.keysFor(bid).records).find(function (r) {
            return r && r.id !== entry.id && (r.type === 'JAMA') === (entry.type === 'JAMA') && r.date === entry.date &&
                   App.sameName(r.customerName, entry.customerName) && Math.round(amtOf(r)) === amt;
        });
        if (dup) out.push(T(isEn, '🔁 بالکل ایسی ہی انٹری (اسی گاہک، تاریخ، قسم اور رقم کی) پہلے سے موجود ہے' + (dup.no ? ' (#' + dup.no + ')' : ''),
                                  '🔁 An identical entry (same customer, date, type and amount) already exists' + (dup.no ? ' (#' + dup.no + ')' : '')));
        var cw = creditWarn(bid, entry, isEn, entry.id); if (cw) out.push(cw);
        return out;
    };
    App.confirmWarnings = function (list, isEn) {
        if (!list || !list.length) return true;
        return confirm('⚠️ ' + T(isEn, 'وارننگ', 'Warning') + ':\n\n' + list.join('\n\n') + '\n\n' + T(isEn, 'کیا پھر بھی انٹری محفوظ کریں؟', 'Do you still want to save this entry?'));
    };
    App.oldEntryInfo = function (bid, dateISO) {
        var lim = parseInt(App.loadSettings(bid).oldEntryDays, 10); if (isNaN(lim) || lim < 0) lim = 3;
        var d = daysBetween(dateISO, todayISO());
        return { days: d, limit: lim, old: !!dateISO && d > lim };
    };
    App.diffRecord = function (a, b, isEn) {
        var F = [['type', 'قسم', 'Type'], ['customerName', 'گاہک', 'Customer'], ['date', 'تاریخ', 'Date'], ['details', 'تفصیل', 'Details'],
                 ['pcs', 'پیس', 'Pcs'], ['weight', 'وزن', 'Weight'], ['rate', 'ریٹ', 'Rate'], ['totalAmount', 'رقم', 'Amount']];
        var out = [];
        F.forEach(function (f) {
            var x = a[f[0]], y = b[f[0]];
            if (f[0] === 'type') { x = (x === 'JAMA') ? 'JAMA' : 'BNAM'; y = (y === 'JAMA') ? 'JAMA' : 'BNAM'; }
            if (f[0] === 'details') { x = (x === '-' || x == null) ? '' : x; y = (y === '-' || y == null) ? '' : y; }
            if (['pcs', 'weight', 'rate', 'totalAmount'].indexOf(f[0]) >= 0) { x = (x === '-' || x == null || x === '') ? 0 : parseFloat(x) || 0; y = (y === '-' || y == null || y === '') ? 0 : parseFloat(y) || 0; }
            if (String(x == null ? '' : x) !== String(y == null ? '' : y)) {
                var sx = f[0] === 'date' ? App.fmtDMY(x) : show(x), sy = f[0] === 'date' ? App.fmtDMY(y) : show(y);
                if (f[0] === 'totalAmount') { sx = fmtN(x); sy = fmtN(y); }
                out.push('• ' + (isEn ? f[2] : f[1]) + ': ' + sx + '  ➜  ' + sy);
            }
        });
        return out;
    };
    App.editWarnings = function (bid, oldRec, newVals, isEn) {
        var lines = [], diff = App.diffRecord(oldRec, newVals, isEn);
        var oi = App.oldEntryInfo(bid, oldRec.date);
        if (oi.old) lines.push(T(isEn, '⏰ یہ انٹری ' + oi.days + ' دن پرانی ہے (' + App.fmtDMY(oldRec.date) + ') — پرانی انٹری بدلنے سے پرانا حساب بدل جاتا ہے!',
                                      '⏰ This entry is ' + oi.days + ' days old (' + App.fmtDMY(oldRec.date) + ') — changing it alters past accounts!'));
        if (newVals.date && newVals.date !== oldRec.date) {
            var ni = App.oldEntryInfo(bid, newVals.date);
            if (newVals.date > todayISO()) lines.push(T(isEn, '📅 نئی تاریخ آج سے آگے کی ہے', '📅 The new date is in the future'));
            else if (ni.old) lines.push(T(isEn, '📅 نئی تاریخ بھی ' + ni.days + ' دن پرانی ہے', '📅 The new date is also ' + ni.days + ' days old'));
        }
        var tmp = JSON.parse(JSON.stringify(newVals)); tmp.id = oldRec.id;
        var cw = creditWarn(bid, tmp, isEn, oldRec.id); if (cw) lines.push(cw);
        return { diff: diff, lines: lines, text: (lines.length ? '\n\n' + lines.join('\n\n') : '') + (diff.length ? '\n\n' + T(isEn, 'تبدیلیاں:', 'Changes:') + '\n' + diff.join('\n') : '') };
    };

    App.defaultEntryDate = function (bid) {
        if (App.loadSettings(bid).entryDate !== 'yesterday') return App.localDate();
        var d = new Date(); d.setDate(d.getDate() - 1);
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    };

    function sha256Bytes(msg) {
        var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
        var h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
        var l = msg.length, nb = ((l + 9 + 63) >> 6) << 6, p = new Uint8Array(nb);
        p.set(msg); p[l] = 0x80;
        var bits = l * 8; p[nb - 4] = (bits >>> 24) & 255; p[nb - 3] = (bits >>> 16) & 255; p[nb - 2] = (bits >>> 8) & 255; p[nb - 1] = bits & 255;
        var wv = new Array(64);
        for (var o = 0; o < nb; o += 64) {
            for (var i = 0; i < 16; i++) wv[i] = (p[o + i * 4] << 24) | (p[o + i * 4 + 1] << 16) | (p[o + i * 4 + 2] << 8) | p[o + i * 4 + 3];
            for (i = 16; i < 64; i++) {
                var s0 = ((wv[i - 15] >>> 7) | (wv[i - 15] << 25)) ^ ((wv[i - 15] >>> 18) | (wv[i - 15] << 14)) ^ (wv[i - 15] >>> 3);
                var s1 = ((wv[i - 2] >>> 17) | (wv[i - 2] << 15)) ^ ((wv[i - 2] >>> 19) | (wv[i - 2] << 13)) ^ (wv[i - 2] >>> 10);
                wv[i] = (wv[i - 16] + s0 + wv[i - 7] + s1) | 0;
            }
            var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
            for (i = 0; i < 64; i++) {
                var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
                var ch = (e & f) ^ (~e & g), t1 = (hh + S1 + ch + K[i] + wv[i]) | 0;
                var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
                var mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0;
                hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
            }
            h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
        }
        var out = new Uint8Array(32);
        for (var j = 0; j < 8; j++) { out[j * 4] = (h[j] >>> 24) & 255; out[j * 4 + 1] = (h[j] >>> 16) & 255; out[j * 4 + 2] = (h[j] >>> 8) & 255; out[j * 4 + 3] = h[j] & 255; }
        return out;
    }
    function hmacSha256(key, msg) {
        if (key.length > 64) key = sha256Bytes(key);
        var k = new Uint8Array(64); k.set(key);
        var ip = new Uint8Array(64 + msg.length), op = new Uint8Array(96);
        for (var i = 0; i < 64; i++) { ip[i] = k[i] ^ 0x36; op[i] = k[i] ^ 0x5c; }
        ip.set(msg, 64);
        op.set(sha256Bytes(ip), 64);
        return sha256Bytes(op);
    }
    function pbkdf2JS(pw, salt, iter) {
        var s1 = new Uint8Array(salt.length + 4); s1.set(salt); s1[salt.length + 3] = 1;
        var u = hmacSha256(pw, s1), t = new Uint8Array(u);
        for (var i = 1; i < iter; i++) { u = hmacSha256(pw, u); for (var j = 0; j < 32; j++) t[j] ^= u[j]; }
        return t;
    }
    function hex2u8(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
    function u82hex(u) { var s = ''; for (var i = 0; i < u.length; i++) s += (u[i] < 16 ? '0' : '') + u[i].toString(16); return s; }
    var USERS_KEY = 'rohan_users_v1', BUILTIN_USERS = { admin: 'admin', owner: 'owner' };
    function usersRaw() { var u = App.readObject(USERS_KEY); return u && typeof u === 'object' ? u : {}; }
    App.users = {
        BUILTIN: BUILTIN_USERS,
        list: function () {
            var c = usersRaw(), out = [];
            Object.keys(BUILTIN_USERS).forEach(function (n) { var r = c[n] || {}; out.push({ username: n, role: BUILTIN_USERS[n], builtin: true, disabled: !!r.disabled && n !== 'admin', branches: Array.isArray(r.branches) ? r.branches : '*' }); });
            Object.keys(c).forEach(function (n) { if (BUILTIN_USERS[n] || !c[n]) return; out.push({ username: n, role: c[n].role, builtin: false, disabled: !!c[n].disabled, branches: Array.isArray(c[n].branches) ? c[n].branches : '*' }); });
            return out;
        },
        save: function (o) {
            var name = String(o.username || '').trim().toLowerCase();
            if (!/^[a-z0-9_.-]{3,30}$/.test(name)) return Promise.resolve({ ok: false, code: 'BAD_NAME' });
            var c = usersRaw(), cur = c[name] || {}, builtin = !!BUILTIN_USERS[name], isNew = !builtin && !c[name];
            var role = builtin ? BUILTIN_USERS[name] : o.role;
            if (role !== 'admin' && role !== 'owner') return Promise.resolve({ ok: false, code: 'BAD_ROLE' });
            var branches = role === 'owner' && Array.isArray(o.branches) ? o.branches : '*';
            if (Array.isArray(branches) && !branches.length) return Promise.resolve({ ok: false, code: 'NO_BRANCH' });
            if (isNew && !o.password) return Promise.resolve({ ok: false, code: 'NEED_PASSWORD' });
            if (o.password && String(o.password).length < 6) return Promise.resolve({ ok: false, code: 'SHORT_PASSWORD' });
            var rec = Object.assign({}, cur, { role: role, branches: branches, disabled: name === 'admin' ? false : !!o.disabled });
            var done = function () { c[name] = rec; App.store.set(USERS_KEY, JSON.stringify(c)); return { ok: true }; };
            if (!o.password) return Promise.resolve(done());
            var salt = u82hex(w.crypto.getRandomValues(new Uint8Array(16)));
            return App.pbkdf2Hex(name + ':' + o.password, salt, 120000).then(function (h) { rec.salt = salt; rec.iter = 120000; rec.hash = h; return done(); });
        },
        remove: function (name) {
            var c = usersRaw();
            if (BUILTIN_USERS[name] || !c[name]) return false;
            delete c[name]; App.store.set(USERS_KEY, JSON.stringify(c)); return true;
        }
    };
    App.pbkdf2Hex = function (secret, saltHex, iter) {
        var pw = new TextEncoder().encode(secret), salt = hex2u8(saltHex);
        if (w.crypto && w.crypto.subtle && w.isSecureContext) {
            return w.crypto.subtle.importKey('raw', pw, 'PBKDF2', false, ['deriveBits'])
                .then(function (k) { return w.crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: iter }, k, 256); })
                .then(function (b) { return u82hex(new Uint8Array(b)); })
                .catch(function () { return u82hex(pbkdf2JS(pw, salt, iter)); });
        }
        return new Promise(function (res) { setTimeout(function () { res(u82hex(pbkdf2JS(pw, salt, iter))); }, 30); });
    };

    var crcT = null;
    function crc32(u8) {
        if (!crcT) { crcT = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); crcT[n] = c >>> 0; } }
        var crc = 0xFFFFFFFF;
        for (var i = 0; i < u8.length; i++) crc = crcT[(crc ^ u8[i]) & 255] ^ (crc >>> 8);
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }
    function u16(n) { return [n & 255, (n >> 8) & 255]; }
    function u32(n) { return [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255]; }
    function concat(parts) {
        var len = 0; parts.forEach(function (p) { len += p.length; });
        var out = new Uint8Array(len), o = 0; parts.forEach(function (p) { out.set(p, o); o += p.length; });
        return out;
    }
    function zipStore(files) {
        var enc = new TextEncoder(), chunks = [], central = [], offset = 0;
        files.forEach(function (f) {
            var nameB = enc.encode(f.name), data = enc.encode(f.text), crc = crc32(data), size = data.length;
            var lh = new Uint8Array([].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(size), u32(size), u16(nameB.length), u16(0)));
            chunks.push(lh, nameB, data);
            central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(size), u32(size), u16(nameB.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset))), nameB);
            offset += lh.length + nameB.length + size;
        });
        var cd = concat(central);
        var end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(cd.length), u32(offset), u16(0)));
        return concat(chunks.concat([cd, end]));
    }
    function colName(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
    function xmlEsc(s) { return String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function asNumber(t) {
        if (typeof t === 'number') return t;
        t = String(t).trim();
        if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) return parseFloat(t.replace(/,/g, ''));
        if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(t)) return parseFloat(t);
        return null;
    }
    function sheetXml(sh) {
        var maxC = 0, widths = [];
        sh.rows.forEach(function (r) { maxC = Math.max(maxC, r.cells.length); r.cells.forEach(function (v, i) { if (v && typeof v === 'object') v = v.v; var L = String(v == null ? '' : v).length; if (L > 60) L = 60; widths[i] = Math.max(widths[i] || 8, Math.min(48, L + 3)); }); });
        if (sh.widths) sh.widths.forEach(function (x, i) { if (x) widths[i] = x; });
        var cols = '<cols>' + widths.map(function (wd, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + wd + '" customWidth="1"/>'; }).join('') + '</cols>';
        var rowsXml = sh.rows.map(function (row, ri) {
            var cx = row.cells.map(function (v, ci) {
                var ref = colName(ci) + (ri + 1), st = row.style || 0;
                if (v && typeof v === 'object') {
                    st = v.s || 0; v = v.v;
                    if (typeof v === 'number') return '<c r="' + ref + '" s="' + st + '"><v>' + v + '</v></c>';
                    if (v === '' || v == null) return '<c r="' + ref + '" s="' + st + '"/>';
                    return '<c r="' + ref + '" s="' + st + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(v) + '</t></is></c>';
                }
                if (v === '' || v == null) return st ? '<c r="' + ref + '" s="' + st + '"/>' : '';
                var n = (st === 0 || st === 1) ? asNumber(v) : null;
                if (n !== null) { var ns = (n % 1 === 0) ? (st === 1 ? 4 : 3) : st; return '<c r="' + ref + '" s="' + ns + '"><v>' + n + '</v></c>'; }
                return '<c r="' + ref + '" s="' + st + '" t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(v) + '</t></is></c>';
            }).join('');
            return '<row r="' + (ri + 1) + '"' + (row.h ? ' ht="' + row.h + '" customHeight="1"' : '') + '>' + cx + '</row>';
        }).join('');
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"' + (sh.rtl ? ' rightToLeft="1"' : '') + (sh.freeze ? '><pane ySplit="' + sh.freeze + '" topLeftCell="A' + (sh.freeze + 1) + '" activePane="bottomLeft" state="frozen"/></sheetView>' : '/>') + '</sheetViews><sheetFormatPr defaultRowHeight="15"/>' + cols + '<sheetData>' + rowsXml + '</sheetData></worksheet>';
    }
    var STYLES_XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.00"/></numFmts>' +
        '<fonts count="6"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF15803D"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFB91C1C"/><name val="Calibri"/></font></fonts>' +
        '<fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE9E9E9"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2937"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0F3D5C"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDCE6F1"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/><bgColor indexed="64"/></patternFill></fill></fills>' +
        '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FF9CA3AF"/></left><right style="thin"><color rgb="FF9CA3AF"/></right><top style="thin"><color rgb="FF9CA3AF"/></top><bottom style="thin"><color rgb="FF9CA3AF"/></bottom><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="18">' +
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
        '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
        '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
        '<xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
        '<xf numFmtId="3" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>' +
        '<xf numFmtId="0" fontId="3" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
        '<xf numFmtId="3" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
        '<xf numFmtId="3" fontId="4" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"/>' +
        '<xf numFmtId="3" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"/>' +
        '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
        '<xf numFmtId="3" fontId="1" fillId="2" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
        '<xf numFmtId="0" fontId="1" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
        '<xf numFmtId="3" fontId="4" fillId="2" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
        '<xf numFmtId="3" fontId="5" fillId="2" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>' +
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>' +
        '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

    App.buildBranchXlsx = function (bid, branchName) {
        var isEn = isEnLang(), K = App.keysFor(bid), rtl = !isEn;
        var recs = App.readArray(K.records).filter(function (r) { return r && r.customerName; });
        var det = App.readArray(K.details), names = App.readArray(K.customers);
        var st = App.loadSettings(bid), by = App.recordsByCustomer(bid);
        function ord(a, b) { return (a.date || '') < (b.date || '') ? -1 : ((a.date || '') > (b.date || '') ? 1 : ((a.no || 0) - (b.no || 0))); }
        function num(v) { v = parseFloat(v); return isNaN(v) ? 0 : v; }
        function info(n) { return det.find(function (c) { return c && App.sameName(c.name, n); }) || {}; }
        function cn(k, d) { return (st.cols && st.cols[k] && st.cols[k].name) ? st.cols[k].name : d; }
        var H = {
            date: T(isEn, 'تاریخ', 'Date'), no: T(isEn, 'نمبر', 'No'), cust: T(isEn, 'گاہک', 'Customer'), det: T(isEn, 'تفصیل', 'Details'),
            pcs: cn('pcs', T(isEn, 'پیس', 'Pcs')), w: cn('weight', T(isEn, 'وزن', 'Weight')), rate: cn('rate', T(isEn, 'ریٹ', 'Rate')),
            bnam: T(isEn, 'بنام رقم', 'Debit'), jama: T(isEn, 'جمع رقم', 'Credit'), bal: T(isEn, 'بیلنس', 'Balance'), side: T(isEn, 'ج/ب', 'Cr/Dr')
        };
        var sheets = [];
        function title(text, cols) { var c = [{ v: text, s: 5 }]; for (var i = 1; i < cols; i++) c.push({ v: '', s: 5 }); return { cells: c, h: 28 }; }
        function hdr(list) { return { cells: list.map(function (x) { return { v: x, s: 6 }; }), h: 22 }; }
        function amtCell(v, isJ) { return v ? { v: v, s: isJ ? 9 : 10 } : { v: '', s: 7 }; }
        function txt(v) { return { v: (v === undefined || v === null || v === '-') ? '' : String(v), s: 7 }; }

        var jr = [title(T(isEn, 'روزنامچہ — ', 'Journal — ') + branchName, 9), hdr([H.date, H.no, H.cust, H.det, H.pcs, H.w, H.rate, H.bnam, H.jama])];
        var all = recs.slice().sort(ord), cur = null, dj = 0, db = 0, tj = 0, tb = 0;
        function dayTotal() { if (cur === null) return; jr.push({ cells: [{ v: T(isEn, 'دن کا ٹوٹل', 'Day total'), s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: db, s: 15 }, { v: dj, s: 14 }] }); }
        all.forEach(function (r) {
            if (r.date !== cur) { dayTotal(); cur = r.date; dj = 0; db = 0; var c = [{ v: App.fmtDMY(r.date), s: 13 }]; for (var i = 1; i < 9; i++) c.push({ v: '', s: 13 }); jr.push({ cells: c }); }
            var a = num(r.totalAmount), isJ = r.type === 'JAMA';
            if (isJ) { dj += a; tj += a; } else { db += a; tb += a; }
            jr.push({ cells: [{ v: App.fmtDMY(r.date), s: 16 }, { v: r.no || '', s: 16 }, txt(r.customerName), txt(r.details), { v: num(r.pcs) || '', s: num(r.pcs) ? 8 : 7 }, { v: num(r.weight) || '', s: num(r.weight) ? 17 : 7 }, { v: num(r.rate) || '', s: num(r.rate) ? 8 : 7 }, isJ ? { v: '', s: 7 } : amtCell(a, false), isJ ? amtCell(a, true) : { v: '', s: 7 }] });
        });
        dayTotal();
        jr.push({ cells: [{ v: T(isEn, 'کل ٹوٹل', 'Grand total'), s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: tb, s: 15 }, { v: tj, s: 14 }], h: 22 });
        sheets.push({ name: T(isEn, 'روزنامچہ', 'Journal'), rtl: rtl, rows: jr, freeze: 2, widths: [13, 7, 22, 30, 9, 11, 10, 15, 15] });

        var sr = [title(T(isEn, 'سمری — ', 'Summary — ') + branchName, 6), hdr([T(isEn, 'کھاتہ نمبر', 'Acc No'), H.cust, T(isEn, 'موبائل', 'Mobile'), H.pcs, H.jama, H.bnam])];
        var rowsS = names.map(function (n) { var l = by[App.norm(n)] || [], bal = App.balanceOf(l), pcs = 0; l.forEach(function (r) { pcs += (r.type === 'JAMA' ? 1 : -1) * num(r.pcs); }); var ci = info(n); return { n: n, acc: ci.accountNo || '', ph: ci.phone, bal: bal, pcs: pcs }; });
        rowsS.sort(function (a, b) { return (parseFloat(a.acc) || 0) - (parseFloat(b.acc) || 0) || (a.n < b.n ? -1 : 1); });
        var sj = 0, sb = 0;
        rowsS.forEach(function (r) { if (r.bal > 0) sj += r.bal; else sb += -r.bal;
            sr.push({ cells: [{ v: String(r.acc), s: 16 }, txt(r.n), txt(r.ph), { v: r.pcs || '', s: r.pcs ? 8 : 7 }, r.bal > 0 ? amtCell(r.bal, true) : { v: '', s: 7 }, r.bal < 0 ? amtCell(-r.bal, false) : { v: '', s: 7 }] }); });
        sr.push({ cells: [{ v: T(isEn, 'ٹوٹل', 'Total'), s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: sj, s: 14 }, { v: sb, s: 15 }], h: 22 });
        sr.push({ cells: [{ v: T(isEn, 'نیٹ (جمع − بنام)', 'Net (Cr − Dr)'), s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: sj - sb, s: 12 }, { v: '', s: 11 }] });
        sheets.push({ name: T(isEn, 'سمری', 'Summary'), rtl: rtl, rows: sr, freeze: 2, widths: [11, 26, 16, 10, 16, 16] });

        names.slice().sort(function (a, b) { return (parseFloat(info(a).accountNo) || 0) - (parseFloat(info(b).accountNo) || 0); }).forEach(function (n) {
            var l = (by[App.norm(n)] || []).slice().sort(ord); if (!l.length) return;
            var ci = info(n), rows = [title(T(isEn, 'کھاتہ: ', 'Ledger: ') + n + (ci.accountNo ? '  (#' + ci.accountNo + ')' : '') + ' — ' + branchName, 10), hdr([H.date, H.no, H.det, H.pcs, H.w, H.rate, H.bnam, H.jama, H.bal, H.side])];
            var bal = 0, tJ = 0, tB = 0;
            l.forEach(function (r) { var a = num(r.totalAmount), isJ = r.type === 'JAMA'; bal += isJ ? a : -a; if (isJ) tJ += a; else tB += a;
                rows.push({ cells: [{ v: App.fmtDMY(r.date), s: 16 }, { v: r.no || '', s: 16 }, txt(r.details), { v: num(r.pcs) || '', s: num(r.pcs) ? 8 : 7 }, { v: num(r.weight) || '', s: num(r.weight) ? 17 : 7 }, { v: num(r.rate) || '', s: num(r.rate) ? 8 : 7 }, isJ ? { v: '', s: 7 } : amtCell(a, false), isJ ? amtCell(a, true) : { v: '', s: 7 }, { v: Math.abs(bal), s: bal >= 0 ? 9 : 10 }, { v: bal >= 0 ? T(isEn, 'ج', 'Cr') : T(isEn, 'ب', 'Dr'), s: 16 }] }); });
            rows.push({ cells: [{ v: T(isEn, 'ٹوٹل', 'Total'), s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: '', s: 11 }, { v: tB, s: 15 }, { v: tJ, s: 14 }, { v: Math.abs(bal), s: bal >= 0 ? 14 : 15 }, { v: bal >= 0 ? T(isEn, 'ج', 'Cr') : T(isEn, 'ب', 'Dr'), s: 11 }], h: 22 });
            var nm = String(n).replace(/[\[\]:*?\/\\]/g, ' ').trim().slice(0, 26) || 'Ledger', base = nm, k = 2;
            while (sheets.some(function (s2) { return s2.name.toLowerCase() === nm.toLowerCase(); })) nm = base.slice(0, 23) + ' ' + (k++);
            sheets.push({ name: nm, rtl: rtl, rows: rows, freeze: 2, widths: [13, 7, 30, 9, 11, 10, 15, 15, 15, 6] });
        });
        return packXlsx(sheets);
    };
    App.downloadBranchXlsx = function (bid, branchName) {
        var u8 = App.buildBranchXlsx(bid, branchName);
        download(u8, String(branchName || bid).replace(/[\\\/:*?"<>|]+/g, ' ').replace(/\s+/g, '_') + '_' + todayISO() + '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    };

    function packXlsx(sheets) {
        var files = [];
        files.push({ name: '[Content_Types].xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' + sheets.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') + '</Types>' });
        files.push({ name: '_rels/.rels', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' });
        files.push({ name: 'xl/workbook.xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' + sheets.map(function (s, i) { return '<sheet name="' + xmlEsc(s.name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets></workbook>' });
        files.push({ name: 'xl/_rels/workbook.xml.rels', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheets.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') + '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' });
        files.push({ name: 'xl/styles.xml', text: STYLES_XML });
        sheets.forEach(function (s, i) { files.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', text: sheetXml(s) }); });
        return zipStore(files);
    }

    function download(u8, name, mime) {
        var blob = new Blob([u8], { type: mime }), a = D.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name; D.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }

    try {
        var st = D.createElement('style'); st.id = 'appExtrasCSS';
        st.textContent =
        '.app-banner{margin:0 0 12px;padding:10px 12px;border-radius:10px;font-weight:bold;font-size:13.5px;text-align:center;border:1px solid}' +
        '.app-banner-warn{background:rgba(255,193,7,.12);border-color:#ffc107;color:#ffc107}body.light-theme .app-banner-warn{color:#92400e;background:#fef3c7}' +
        '.app-banner-bad{background:rgba(220,53,69,.14);border-color:#dc3545;color:#ff8a8a}body.light-theme .app-banner-bad{color:#991b1b;background:#fee2e2}' +
        '.app-banner button{margin:6px 6px 0;padding:6px 12px;border:none;border-radius:6px;font-weight:bold;cursor:pointer;background:#ffc107;color:#000}' +
        '.age-badge{display:inline-block;font-size:10px;font-weight:800;color:#fff;background:#dc3545;border-radius:8px;padding:1px 6px;margin:0 4px;white-space:nowrap}' +
        '.limit-badge{display:inline-block;font-size:10px;font-weight:800;color:#000;background:#ffc107;border-radius:8px;padding:1px 6px;margin:0 4px;white-space:nowrap}' +
        '@media print{.app-banner{display:none!important}}';
        D.head.appendChild(st);
    } catch (e) {}

    try {
        if (D.querySelector && /(aging_report|deleted_entries|audit_log|all_branches)\.html$/i.test(location.pathname)) {
            var mst = D.createElement('style'); mst.id = 'ubgWrapMobile';
            mst.textContent = '@media screen and (max-width:700px){' +
                'body{padding:10px!important}html body .wrap{padding:10px!important}' +
                'html body .wrap .hd h1{font-size:13.5px!important;line-height:1.4!important}' +
                'html body .wrap .scroll{overflow-x:scroll!important;-webkit-overflow-scrolling:touch;padding-bottom:6px}' +
                'html body .wrap .scroll::-webkit-scrollbar{height:9px}' +
                'html body .wrap .scroll::-webkit-scrollbar-track{background:rgba(128,128,128,.25);border-radius:6px}' +
                'html body .wrap .scroll::-webkit-scrollbar-thumb{background:#888;border-radius:6px}' +
                'html body .wrap .scroll table{width:max-content!important;min-width:100%!important;font-size:11.5px!important}' +
                'html body .wrap .scroll th,html body .wrap .scroll td{white-space:nowrap!important;padding:6px 8px!important;font-size:11.5px!important}' +
                'html body .wrap .scroll th{position:static!important}' +
                'html body .wrap .rb{overflow-x:auto;padding:6px 8px!important}html body .wrap .rg{display:block!important}' +
                'html body .wrap .rc{display:flex!important;flex-direction:row!important;justify-content:space-between;align-items:baseline;gap:10px;padding:3px 0;border-bottom:1px dashed rgba(128,128,128,.35);white-space:nowrap}' +
                'html body .wrap .rc:last-child{border-bottom:none}html body .wrap .rc small{display:inline!important;font-size:11px!important}' +
                'html body .wrap .rc b{font-size:12.5px!important;word-break:normal!important;white-space:nowrap}html body .wrap .rt{font-size:12px!important}' +
                'html body .wrap .ev{padding:8px!important}html body .wrap .ev .ch{font-size:12px!important}' +
                'html body .wrap .btn{font-size:12px!important}html body .wrap .card b{font-size:15px!important}html body .wrap .card small{font-size:11px!important}}';
            D.head.appendChild(mst);
        }
    } catch (e) {}

    try {
        var fs = parseInt(localStorage.getItem('rohan_font_scale'), 10);
        var gcss = '';
        if (fs >= 80 && fs <= 130 && fs !== 100) gcss += '@media screen{html{zoom:' + fs / 100 + '}}';
        var dn = localStorage.getItem('rohan_table_density'), pad = { compact: 2, roomy: 11 }[dn];
        if (pad) gcss += '@media screen{html body th,html body td{padding-top:' + pad + 'px!important;padding-bottom:' + pad + 'px!important}}';
        (function () {
            var g = function (k) { return localStorage.getItem('rohan_' + k) || ''; };
            var n = function (k) { var v = parseInt(g(k), 10); return v >= 1 && v <= 100 ? v : 0; };
            var ts = n('tbl_text_size'), ns = n('tbl_num_size'), hs = n('tbl_head_size'), as_ = n('tbl_acc_size'), rh = n('tbl_row_h'), cw = n('tbl_col_w');
            var tf = g('tbl_text_font'), nf = g('tbl_num_font'), hf = g('tbl_head_font'), af = g('tbl_acc_font');
            var T = 'html body table:not(.zz):not(.zy):not(.zx) ';
            var fx = function (sz, ff) { return (sz ? 'font-size:' + sz + 'px!important;' : '') + (ff ? 'font-family:' + ff + '!important;' : ''); };
            if (hs || hf) gcss += T + 'tr:not(.print-repeat-row)>th:not([colspan]),' + T + 'tr:not(.print-repeat-row)>th:not([colspan]) *{' + fx(hs, hf) + '}';
            if (ts || tf) gcss += T + 'td:not(.ubg-num):not(.ubg-acc),' + T + 'td:not(.ubg-num):not(.ubg-acc) *{' + fx(ts, tf) + '}';
            if (ns || nf) gcss += T + 'td.ubg-num:not(.ubg-acc),' + T + 'td.ubg-num:not(.ubg-acc) *{' + fx(ns, nf) + '}';
            if (as_ || af) gcss += T + 'td.ubg-acc,' + T + 'td.ubg-acc *{' + fx(as_, af) + '}';
            if (rh) gcss += T + 'th,' + T + 'td{height:' + rh + 'px!important;padding-top:' + Math.round(rh / 4) + 'px!important;padding-bottom:' + Math.round(rh / 4) + 'px!important}';
            if (cw) gcss += '@media screen{' + T + 'th{min-width:' + cw + 'ch!important}}';
            if (ns || nf || as_ || af) {
                var ACC = /^\s*(کھاتہ|کھاتا|اکاؤنٹ|acc|a\/c|account)/i;
                var tag = function () {
                    Array.prototype.forEach.call(D.querySelectorAll('table'), function (tb) {
                        var ths = tb.querySelectorAll('thead tr:last-child th'), accIdx = -1;
                        for (var k = 0; k < ths.length; k++) if (ACC.test(ths[k].textContent || '')) { accIdx = k; break; }
                        Array.prototype.forEach.call(tb.querySelectorAll('tbody tr'), function (tr) {
                            var tds = tr.children;
                            Array.prototype.forEach.call(tds, function (td, idx) {
                                if (td.tagName !== 'TD') return;
                                if (td.classList.contains('acc-no-cell') || (accIdx >= 0 && idx === accIdx && tds.length === ths.length)) { td.classList.add('ubg-acc'); return; }
                                if (td.classList.contains('ubg-num')) return;
                                var t = (td.textContent || '').trim();
                                if (t && t.length < 25 && /\d/.test(t) && /^[\s\d,.\-+()%\/:]+$/.test(t)) td.classList.add('ubg-num');
                            });
                        });
                    });
                };
                var tm = 0, go = function () { clearTimeout(tm); tm = setTimeout(tag, 80); };
                D.addEventListener('DOMContentLoaded', function () { tag(); try { new MutationObserver(go).observe(D.body, { childList: true, subtree: true, characterData: true }); } catch (e) {} });
            }
        })();
        if (localStorage.getItem('rohan_reduce_motion') === '1') gcss += '*,*::before,*::after{transition:none!important;animation:none!important}';
        if (gcss) { var gst = D.createElement('style'); gst.textContent = gcss; D.head.appendChild(gst); }
        var pp = localStorage.getItem('rohan_print_paper'), po = localStorage.getItem('rohan_print_orient');
        if (pp || po) D.addEventListener('DOMContentLoaded', function () {
            var pst = D.createElement('style'); pst.textContent = '@media print{@page{size:' + (pp || 'A4') + ' ' + (po || 'portrait') + '}}'; D.head.appendChild(pst);
        });
    } catch (e) {}

    if (!isIndex) {
        var lastTouch = 0, limit = function () { var m = parseInt(localStorage.getItem('rohan_idle_minutes'), 10); return (m > 0 ? m : APP_CONFIG.SESSION_TIMEOUT_MIN) * 60000; };
        var check = function () {
            try {
                var t = parseInt(sessionStorage.getItem('rohan_last_activity'), 10);
                if (t && Date.now() - t > limit()) {
                    var en = isEnLang(); sessionStorage.clear();
                    try { alert(T(en, '⏱️ کافی دیر سے کوئی کام نہیں ہوا، حفاظت کے لیے لاگ آؤٹ کر دیا گیا ہے۔', '⏱️ Logged out for security after inactivity.')); } catch (e) {}
                    location.replace('./index.html');
                }
            } catch (e) {}
        };
        var touch = function () { var n = Date.now(); if (n - lastTouch < 5000) return; lastTouch = n; try { sessionStorage.setItem('rohan_last_activity', String(n)); } catch (e) {} };
        check(); lastTouch = 0; touch();
        ['click', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) { D.addEventListener(ev, touch, true); });
        setInterval(check, 30000);
        w.addEventListener('pageshow', check);
    }

    try {
        var l = D.createElement('link'); l.rel = 'manifest'; l.href = './manifest.json'; D.head.appendChild(l);
        if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
            navigator.serviceWorker.register('./sw.js').catch(function () {});
        }
    } catch (e) {}

    var I18N_EN = {};
    var I18N_UR = {};
    function i18nAdd(map) { Object.keys(map).forEach(function (k) { I18N_EN[k] = map[k]; if (!I18N_UR[map[k]]) I18N_UR[map[k]] = k; }); }
    i18nAdd({
 "⚠️ آپ کے پاس سیٹنگز اور ترمیم کی اجازت نہیں ہے! یہ اختیار صرف ایڈمن کے لیے ہے۔": "⚠️ You do not have permission for settings and editing! This is for the admin only.",
 "یوزر نیم 3 سے 30 چھوٹے انگریزی حروف/ہندسے/_ . - ہو": "Username must be 3 to 30 lowercase letters/digits/_ . -",
 "⏳ بہت زیادہ کوششیں، کچھ دیر بعد کوشش کریں": "⏳ Too many attempts, try again after a while",
 "کردار درست نہیں": "Invalid role", "کم از کم ایک برانچ چنیں": "Choose at least one branch", "نئے صارف کے لیے پاس ورڈ لازمی ہے": "A password is required for a new user",
 "پاس ورڈ کم از کم 6 حروف کا ہو": "Password must be at least 6 characters", "⚠️ اجازت نہیں ہے!": "⚠️ Not allowed!", "⚠️ محفوظ نہیں ہوا": "⚠️ Not saved", "✅ صارف محفوظ ہو گیا": "✅ User saved",
 "⏳ بار بار غلط کوشش: 30 سیکنڈ بعد دوبارہ کوشش کریں": "⏳ Too many wrong attempts: try again in 30 seconds",
 "کھلا بیلنس کو روزانہ / ماہانہ جمع بنام کے ٹوٹل میں گنیں (بند ہو تو وہ روزنامچے میں «پرانا حساب» میں جاتا ہے؛ کھاتے کا بیلنس ہر صورت میں شامل رہتا ہے)": "Count the Opening balance in the daily / monthly Jama-Bnam totals (when off, it goes to \"Old balance\" in the daily journal; the account balance always includes it)",
 "سمری میں نگ / وزن کی لائن": "Pcs / Weight line in the summary",
 "اضافی کالم": "Extra Field",
 "نیا یوزر نیم": "New username",

 "سسٹم میں داخل ہوں": "Log In",
 "❌ یوزر نیم یا پاس ورڈ درست نہیں ہے!": "❌ Username or password is incorrect!",
 "تھیم تبدیل کریں": "Change theme",
 "یوزر نیم درج کریں": "Enter username",
 "زبان": "Language",
 "برانچز": "Branches",
 "ظاہری شکل": "Appearance",
 "پرنٹ": "Print",
 "حفاظت": "Security",
 "اونر کی اجازتیں": "Owner Permissions",
 "صارفین": "Users",
 "بیک اپ": "Backup",
 "برانچز کا نام، نمبر، اونر، آئیکن، رنگ اور زبان تبدیل کریں:": "Change branch name, number, owner, icon, color and language:",
 "نمبر": "No.",
 "آئیکن": "Icon",
 "اردو نام": "Urdu Name",
 "اونر کا نام": "Owner Name",
 "یوزر نیم": "Username",
 "کردار": "Role",
 "برانچیں": "Branches",
 "➕ نیا صارف": "➕ New User",
 "یوزر نیم (چھوٹے انگریزی حروف/ہندسے، کم از کم 3):": "Username (lowercase letters/digits, at least 3):",
 "کردار:": "Role:",
 "پاس ورڈ (کم از کم 6؛ ایڈٹ میں خالی چھوڑیں تو نہیں بدلے گا):": "Password (at least 6; leave empty when editing to keep it):",
 "مثلاً ali": "e.g. ali",
 "37.324 کلو (کچا من / میٹل)": "37.324 kg (Kacha maund / metal)",
 "40 کلو (پکا من / غلہ و جنرل)": "40 kg (Pakka maund / grain & general)",
 "پرسنٹیج (%) فارمولا لاگو کریں": "Apply percentage (%) formula",
 "پرسنٹیج کی قسم:": "Percentage type:",
 "کالم کی فیلڈ": "Column field",
 "فعال (آن / آف)": "Active (On / Off)",
 "کالم کا نیا نام": "New column name",
 "فعال": "Active",
 "ہمیشہ فعال": "Always active",
 "فعال کریں": "Enable",
 "روکڑ سمری شیٹ میں باکسز کی پوزیشن:": "Box position in the Cash Summary sheet:",
 "کسٹمر لیجر میں باکسز کی پوزیشن:": "Box position in the Customer Ledger:",
 "ڈیلیٹ شدہ انٹریاں اتنے دن بعد مستقل صاف (0 = کبھی نہیں):": "Permanently purge deleted entries after this many days (0 = never):",
 "رقم کی حد، اس سے بڑی انٹری پر وارننگ (0 = بند):": "Amount limit, warn on a larger entry (0 = off):",
 "نئے گاہک کی ڈیفالٹ کریڈٹ لمٹ (0 = کوئی نہیں):": "Default credit limit for a new customer (0 = none):",
 "🧮 ڈیش بورڈ کے اپنے بکس": "🧮 Your Own Dashboard Boxes",
 "➕ کھاتے کا حساب (کھاتہ + بل)": "➕ Account balance (account + bill)",
 "➕ فیکٹری کا حساب (بل کا ریٹ)": "➕ Factory account (bill rate)",
 "➕ خرچہ بکس (صرف رقم، اپنی مرضی کی)": "➕ Expense box (amount only, your own)",
 "➕ وزن کا کھاتہ (صرف وزن، ضائع مال)": "➕ Weight account (weight only, wasted goods)",
 "➕ آخری خالص حساب (فیکٹری − ضائع وزن − خرچہ = ریٹ)": "➕ Final net account (factory − waste weight − expense = rate)",
 "بکس محفوظ کریں ✅": "Save boxes ✅",
 "مثلاً: 25000": "e.g. 25000",
 "فیصد شرح (مثلاً: 2 یا 5)": "Percentage rate (e.g. 2 or 5)",
 "مثلاً: پیس / کارٹن": "e.g. Pcs / Carton",
 "مثلاً: وزن": "e.g. Weight",
 "مثلاً: ریٹ": "e.g. Rate",
 "مثلاً: کل رقم": "e.g. Total Amount",
 "کالم کا نام (مثلاً: بنڈل # / گاڑی #)": "Column name (e.g. Bundle # / Vehicle #)",
 "اضافی معلومات لکھیں...": "Enter extra information...",
 "فارمولا تبدیل کریں": "Change formula",
 "پیس لکھیں...": "Enter pieces...",
 "وزن لکھیں...": "Enter weight...",
 "ریٹ لکھیں...": "Enter rate...",
 "سمری میں نگ / وزن کی لائن (Pcs / Weight Line)": "Pcs / Weight line in the summary",
 "کھلا بیلنس (Opening) کو روزانہ / ماہانہ جمع بنام کے ٹوٹل میں گنیں (بند ہو تو وہ روزنامچے میں «پرانا حساب» میں جاتا ہے؛ کھاتے کا بیلنس ہر صورت میں شامل رہتا ہے)": "Count the Opening balance in the daily / monthly Jama-Bnam totals (when off, it goes to \"Old balance\" in the daily journal; the account balance always includes it)",
 "ایجنگ رپورٹ": "Ageing Report",
 "سب برانچز": "All Branches",
 "آڈٹ لاگ": "Audit Log",
 "ڈیلیٹ شدہ انٹریاں": "Deleted Entries",
 "ڈیلیٹ شدہ کھاتوں کا ریکارڈ": "Deleted Accounts Record",
 "میرے الفاظ": "My Words",
 "مثلاً: عطاء اللہ ، میزان بینک": "e.g. Ataullah, Meezan Bank"
});
    Object.assign(I18N_UR, {"UNIT BUSINESS": "یونٹ بزنس", "GROUP": "گروپ", "Unit Business Group Logo": "یونٹ بزنس گروپ لوگو", "Logo": "لوگو", "Unit Business Group": "یونٹ بزنس گروپ", "English Name": "انگریزی نام", "DD/MM/YYYY": "دن/ماہ/سال", "MM/DD/YYYY": "ماہ/دن/سال", "YYYY-MM-DD": "سال-ماہ-دن", "Letter": "لیٹر", "Legal": "لیگل", "Excel": "ایکسل", "📗 Excel": "📗 ایکسل", "Date:": "تاریخ:", "Urdu ۲": "اردو ۲"});
    var I18N_BOTH = {"⚠️ سرور موڈ میں صارف سرور پر بنتے ہیں۔ Users are managed on the server.": ["⚠️ سرور موڈ میں صارف سرور پر بنتے ہیں۔", "⚠️ In server mode, users are managed on the server."], "🇵🇰 اردو (Urdu - RTL)": ["🇵🇰 اردو", "🇵🇰 Urdu"], "🇬🇧 English (LTR)": ["🇬🇧 انگریزی", "🇬🇧 English"], "Owner (مالک)": ["مالک", "Owner"], "Admin (ایڈمن)": ["ایڈمن", "Admin"]};
    Object.keys(I18N_BOTH).forEach(function (k) { I18N_UR[k] = I18N_BOTH[k][0]; I18N_EN[k] = I18N_BOTH[k][1]; });
    function pageLangIsEn() {
        try {
            if (isIndex || path === 'branches.html') return (localStorage.getItem('rohan_global_lang') || 'ur') === 'en';
        } catch (e) {}
        return isEnLang();
    }
    var RE_AR = /[؀-ۿﭐ-﷿ﹰ-﻿]/, RE_LAT = /[A-Za-z]/;
    function digitsEn(s) { return s.replace(/[۰-۹]/g, function (c) { return String(c.charCodeAt(0) - 0x06F0); }).replace(/[٠-٩]/g, function (c) { return String(c.charCodeAt(0) - 0x0660); }); }
    function leadSym(s) { var m = /^[^A-Za-z؀-ۿ]*/.exec(s); return m ? m[0] : ''; }
    function bal(x) { return (x.match(/\(/g) || []).length === (x.match(/\)/g) || []).length; }
    function biPick(s, en) {
        var t = s.replace(/\s+/g, ' ').trim(), m;
        if (!t) return null;
        var hasAr = RE_AR.test(t), hasLat = RE_LAT.test(t);
        if (hasAr && hasLat) {
            if ((m = /^(.*[؀-ۿﭐ-﷿ﹰ-﻿].*?)\s+\/\s+([^؀-ۿ]*[A-Za-z][^؀-ۿ]*)$/.exec(t))) {
                if (bal(m[1]) && bal(m[2])) {
                var ur = m[1], e = m[2].trim(), colon = /[:：]$/.test(e) && !/[:：]$/.test(ur) ? ':' : '';
                return en ? e : ur + colon;
                }
            }
            if ((m = /^(.*[؀-ۿﭐ-﷿ﹰ-﻿].*?)\s*\(([^؀-ۿ()]*[A-Za-z][^؀-ۿ()]*)\)\s*([^؀-ۿ]*)$/.exec(t))) {
                var tail = m[3].trim();
                return en ? digitsEn(leadSym(m[1])) + m[2].split(/\s+\/\s+/).pop().trim() + (tail ? ' ' + tail : '') : m[1].replace(/\s*[-–]\s*$/, '').trim() + (tail ? ' ' + tail : '');
            }
            if ((m = /^\(([^؀-ۿ()]*[A-Za-z][^؀-ۿ()]*)\)\s*(.*[؀-ۿ].*)$/.exec(t))) { return en ? m[1].trim() : m[2].trim(); }
            if ((m = /^([A-Za-z][^؀-ۿ]*?)\s*\(([^()]*[؀-ۿ][^()]*)\)\s*([^؀-ۿ]*)$/.exec(t))) {
                return en ? m[1].trim() + (m[3] ? ' ' + m[3].trim() : '') : m[2].trim() + (m[3] ? ' ' + m[3].trim() : '');
            }
        }
        return null;
    }
    function i18nText(s, en) {
        var t = s.replace(/\s+/g, ' ').trim(); if (!t) return null;
        var d = en ? I18N_EN : I18N_UR;
        if (Object.prototype.hasOwnProperty.call(d, t)) return d[t];
        var b = biPick(t, en); if (b !== null) { if (Object.prototype.hasOwnProperty.call(d, b)) return d[b]; return b; }
        return null;
    }
    function i18nApply(root, en) {
        var w = D.createTreeWalker(root || D.body, NodeFilter.SHOW_TEXT), n, list = [];
        while ((n = w.nextNode())) { var p = n.parentElement; if (p && !/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName) && !p.closest('[data-no-i18n]')) list.push(n); }
        list.forEach(function (n) {
            var r = i18nText(n.nodeValue, en); if (r === null) return;
            var m = /^(\s*)[\s\S]*?(\s*)$/.exec(n.nodeValue); n.nodeValue = (m ? m[1] : '') + r + (m ? m[2] : '');
        });
        (root || D).querySelectorAll('[placeholder],[title],[alt],[aria-label],input[type=button],input[type=submit]').forEach(function (e) {
            ['placeholder', 'title', 'alt', 'aria-label'].forEach(function (a) { var v = e.getAttribute(a); if (v) { var r = i18nText(v, en); if (r !== null) e.setAttribute(a, r); } });
            if (/^(button|submit)$/.test(e.type || '') && e.tagName === 'INPUT') { var r2 = i18nText(e.value, en); if (r2 !== null) e.value = r2; }
        });
        if (!root || root === D.body) {
            var tp = D.title.split(' - ').map(function (x) {
                var r = i18nText(x, en); if (r !== null) return r;
                return /^unit business group$/i.test(x.trim()) ? (en ? 'Unit Business Group' : 'یونٹ بزنس گروپ') : x;
            });
            D.title = tp.join(' - ');
        }
    }
    function i18nMsg(s) { return typeof s === 'string' ? (function () { var en = pageLangIsEn(), r = i18nText(s, en); return r === null ? s : r; })() : s; }
    App.i18n = { add: i18nAdd, text: function (s) { return i18nMsg(s); }, apply: function (root) { i18nApply(root || D.body, pageLangIsEn()); }, isEn: pageLangIsEn };
    function msgLines(s, en) {
        var ls = s.split('\n');
        if (ls.length > 1 && ls.some(function (l) { return RE_AR.test(l); }) && ls.some(function (l) { return RE_LAT.test(l) && !RE_AR.test(l); })) {
            ls = ls.filter(function (l) { return en ? !RE_AR.test(l) : !(RE_LAT.test(l) && !RE_AR.test(l)); });
            return ls.join('\n');
        }
        return null;
    }
    function i18nMsg2(s) {
        if (typeof s !== 'string') return s;
        var en = pageLangIsEn(), one = msgLines(s, en); if (one !== null) s = one;
        var parts = s.split('\n').map(function (l) { var r = i18nText(l, en); return r === null ? l : r; });
        return parts.join('\n');
    }
    ['alert', 'confirm', 'prompt'].forEach(function (fn) {
        var orig = w[fn]; if (!orig) return;
        w[fn] = function (m, d) { return fn === 'prompt' ? orig.call(w, i18nMsg2(m), d) : orig.call(w, i18nMsg2(m)); };
    });
    App.i18n.text = i18nMsg2;
    (function () {
        var rows = '.header-top-bar,.top-header,.hd,.header-area,.header-container,.archive-header,#ledgerHeaderSection,.menu-head,.chart-header-row,.bar';
        var kids = rows.split(',').map(function (r) { return r + '>*'; }).join(',');
        var back = '.btn-top-back,.btn-back,#btnBack,#btnBackHome,#btnLedgerBack,#backToBranchesBtn';
        var prt = '.btn-print,#btnDashPrint,#btnPrintSummary,#btnPrintJournal,#btnLedgerPrint,#btnOut,#btnSettingsMenu';
        function inject() {
            if (D.getElementById('ubg-nav-style')) return;
            var st = D.createElement('style'); st.id = 'ubg-nav-style';
            st.textContent = '@media screen{' + rows + '{direction:ltr!important}' + kids + '{direction:var(--ubg-dir,rtl)}' +
                back + '{order:-1!important;margin-left:0!important;margin-right:0!important}' + prt + '{order:99!important}}';
            D.head.appendChild(st);
            D.documentElement.style.setProperty('--ubg-dir', pageLangIsEn() ? 'ltr' : 'rtl');
        }
        if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', inject); else inject();
    })();
    function runI18n() { try { i18nApply(D.body, pageLangIsEn()); } catch (e) { console.warn('i18n', e); } }
    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', runI18n); else runI18n();

    try { if (!isIndex && App.getBranchId()) assignSerials(App.getBranchId()); } catch (e) { console.warn('serials', e); }
})(window);
