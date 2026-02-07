const rainContainer = document.querySelector('.rain');
const loginDrop = document.getElementById('loginDrop');
const flash = document.querySelector('.flash');

const symbols = ['var', 'let', 'const', '{}', '()', '=>', '$', '#', '@'];

let rainActive = true;

/* ===== RAIN ===== */
setInterval(() => {
    if (!rainActive) return;

    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    drop.style.left = Math.random() * 220 + 'px';
    drop.style.animationDuration = (1 + Math.random()) + 's';

    rainContainer.appendChild(drop);
    setTimeout(() => drop.remove(), 2000);
}, 150);

/* ===== LOGIN DROP ===== */
setTimeout(() => {
    rainActive = false;          // pause rain
    loginDrop.classList.add('active');

    setTimeout(() => {
        rainActive = true;       // resume rain
    }, 2200);

}, 3000);

/* ===== LIGHTNING ===== */
setInterval(() => {
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 150);
}, 5000);
