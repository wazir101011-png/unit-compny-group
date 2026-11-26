(function () {
    function text() {
        var t = '';
        try { var v = localStorage.getItem('rohan_print_footer'); if (v !== null) t = v; else t = (window.APP_CONFIG && APP_CONFIG.PRINT_FOOTER_TEXT) || ''; } catch (e) { t = (window.APP_CONFIG && APP_CONFIG.PRINT_FOOTER_TEXT) || ''; }
        return String(t).replace(/["\\\n\r]/g, ' ');
    }
    function apply() {
        var st = document.getElementById('ubg-print-footer');
        if (!st) { st = document.createElement('style'); st.id = 'ubg-print-footer'; document.head.appendChild(st); }
        st.textContent = '@media print { @page { @bottom-left { content: "' + text() + '"; font-size: 8.5px; font-weight: bold; color: #333333; } @bottom-right { content: "Page " counter(page); font-size: 8.5px; font-weight: bold; color: #333333; } } }';
    }
    apply();
    window.addEventListener('beforeprint', apply);
    window.__ubgPrintFooterApply = apply;
})();
