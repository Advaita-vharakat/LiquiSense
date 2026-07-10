document.addEventListener('DOMContentLoaded', ()=>{
    const wifiToggle = document.getElementById('wifiToggle');
    if(wifiToggle){
        // persist wifi toggle
        const key = 'liquisense-wifi';
        const saved = localStorage.getItem(key);
        if(saved === '1') wifiToggle.checked = true;
        wifiToggle.addEventListener('change', ()=>{
            localStorage.setItem(key, wifiToggle.checked ? '1' : '0');
        });
    }

    // Theme toggle (global) - sync with main.js storage key
    const themeBtn = document.getElementById('themeToggle');
    const THEME_KEY = 'liquisense-theme';
    if(themeBtn){
        // initialize from storage (prefer new key, fallback to legacy)
        const initial = localStorage.getItem(THEME_KEY) || localStorage.getItem('ls_theme');
        if(initial === 'light') document.body.classList.add('light-mode');
        else document.body.classList.remove('light-mode');

        function refreshLabel(){
            const light = document.body.classList.contains('light-mode');
            themeBtn.innerText = light ? '☀️ Light' : '🌙 Dark';
        }
        refreshLabel();

        themeBtn.addEventListener('click', ()=>{
            const isLight = document.body.classList.toggle('light-mode');
            localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
            // also update legacy key so older code sees it
            localStorage.setItem('ls_theme', isLight ? 'light' : 'dark');
            // notify other windows/tabs (storage event fires automatically on setItem)
            refreshLabel();
        });
    }
});
