(function () {
  var FLAG = 'ubg_seed_acc283_v1', BID = 'branch_1', NAME = 'عثمان لاہور الائچی سبز', ACC = '283', TOTAL = 20058289;
  var ROWS = [
    ['2026-07-24', 'الائچی', 0, 3, 120, 9750, 0, 1170000],
    ['2026-07-24', 'Opening Balance', 0, 0, 0, 0, 1, 0],
    ['2026-07-24', 'MGQ2', 11, 0, 0, 0, 0, 0],
    ['2026-07-24', 'MGQ1', 38, 0, 0, 0, 0, 0],
    ['2026-07-24', 'Yxl', 33, 0, 0, 0, 0, 0],
    ['2026-07-24', 'کرایہ', 0, 0, 0, 0, 66860, 0],
    ['2026-07-25', 'Mgq1', 0, 2, 80, 9720, 0, 777600],
    ['2026-07-25', 'حافظ کو', 0, 0, 0, 0, 14000, 0],
    ['2026-07-25', 'لائیچی', 55, 0, 0, 0, 0, 0],
    ['2026-07-28', 'Mgq1', 0, 1, 40, 9720, 0, 388800],
    ['2026-08-02', 'MOQ1', 0, 1, 40, 9625, 0, 385000],
    ['2026-08-04', 'MGQ1', 0, 7, 280, 9500, 0, 2660000],
    ['2026-08-04', 'MGQ1', 0, 1, 40, 9500, 0, 380000],
    ['2026-08-04', 'الائچی', 0, 10, 400, 9600, 0, 3840000],
    ['2026-08-06', 'MGQ1', 0, 6, 240, 9500, 0, 2280000],
    ['2026-08-06', 'MGQ1', 0, 7, 280, 9500, 0, 2660000],
    ['2026-08-07', 'Mgq1', 0, 0, 5, 9500, 0, 47500],
    ['2026-08-07', 'Mgq1', 0, 3, 120, 9250, 0, 1110000],
    ['2026-08-09', 'الائچی', 0, 3, 120, 9070, 0, 1088400],
    ['2026-08-13', 'MGQ1', 0, 0, 10, 9500, 0, 95000],
    ['2026-08-20', 'Mgq', 0, 1, 40, 9500, 0, 380000],
    ['2026-09-01', 'الائچی', 0, 1, 40, 9100, 0, 364000],
    ['2026-09-29', 'الائچی', 0, 1, 40, 8800, 0, 352000],
    ['2026-10-05', 'Moq2', 0, 1, 40, 9150, 0, 366000],
    ['2026-10-22', 'الائچی', 0, 1, 40, 8850, 0, 354000],
    ['2026-10-30', 'الائچی', 0, 3, 120, 8780, 0, 1053600],
    ['2026-10-30', 'الائچی', 0, 1, 40, 8600, 0, 344000],
    ['2026-11-02', 'Yxl', 0, 0, 5, 8650, 0, 43250]
  ];
  function run() {
    try {
      if (!window.App || !App.store || !App.keysFor) return;
      if (window.APP_CONFIG && APP_CONFIG.API_BASE) return;
      if (localStorage.getItem(FLAG)) return;
      var k = App.keysFor(BID);
      var list = App.readArray(k.customers), det = App.readArray(k.details), recs = App.readArray(k.records);
      var cust = null;
      det.forEach(function (d) { if (!cust && d && (String(d.accountNo) === ACC || App.norm(d.name) === App.norm(NAME))) cust = d; });
      var now = new Date().toISOString();
      if (!cust) {
        cust = { id: App.uid(), name: NAME, accountNo: ACC, phone: '-', cnic: '-', address: '-', createdAt: now };
        det.push(cust); if (list.map(App.norm).indexOf(App.norm(NAME)) < 0) list.push(NAME);
      }
      var cname = cust.name || NAME;
      recs = recs.filter(function (r) {
        if (!r) return false;
        var mine = (r.customerId && r.customerId === cust.id) || App.norm(r.customerName) === App.norm(cname);
        return !(mine && r.createdBy === 'import' && r.isOpening && Number(r.totalAmount) === TOTAL && r.type === 'JAMA');
      });
      var seq = 0; recs.forEach(function (e) { if (e && e.no > seq) seq = e.no; });
      ROWS.forEach(function (r, i) {
        var cashB = r[6], cashJ = r[7], ctnB = r[2], ctnJ = r[3], wt = r[4], rate = r[5];
        var isJama = cashJ > 0 || ctnJ > 0 || wt > 0;
        var rec = {
          id: App.uid(), date: r[0], customerName: cname, customerId: cust.id, details: r[1], extra: '', extras: {},
          pcs: isJama ? ctnJ : ctnB, weight: wt, rate: rate > 0 ? rate : '-',
          totalManual: !(wt > 0 && rate > 0), totalAmount: isJama ? cashJ : cashB,
          type: isJama ? 'JAMA' : 'BNAM', no: ++seq,
          createdAt: new Date(new Date(r[0] + 'T09:00:00Z').getTime() + i * 1000).toISOString(), createdBy: 'import'
        };
        if (wt > 0 && rate > 0) { rec.rateUnit = 37.324; rec.rateMode = 'unit'; rec.percentApplied = 0; }
        recs.push(rec);
      });
      App.store.set(k.customers, JSON.stringify(list));
      App.store.set(k.details, JSON.stringify(det));
      App.store.set(k.records, JSON.stringify(recs));
      App.store.set(k.seq || (BID + '_entry_seq'), String(seq));
      localStorage.setItem(FLAG, String(ROWS.length));
    } catch (e) { console.error('seed283', e); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
