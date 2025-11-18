var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const TYPING_SPEED = 40;
const HEART_FALL_COUNT = 100;

window.addEventListener("DOMContentLoaded", e => {
    main();
});

let data;
let greetingEl;
let openGalleryBtn;
let welcomeScreen;
let galleryScreen;
let galleryIndex = 0;
let imageWrapper;
let captionEl;
let prevBtn;
let nextBtn;
let heartsLayer;
let indicatorsContainer; // puntini

function main() {
    return __awaiter(this, void 0, void 0, function* () {
        data = yield getData();

        greetingEl = document.getElementById('greeting');
        openGalleryBtn = document.getElementById('openGalleryBtn');
        openGalleryBtn.addEventListener('click', () => showGallery());

        welcomeScreen = document.getElementById('welcomeScreen');
        galleryScreen = document.getElementById('galleryScreen');

        imageWrapper = document.getElementById('imageWrapper');
        imageWrapper.addEventListener("dblclick", e => launchHearts(HEART_FALL_COUNT));

        captionEl = document.getElementById('caption');

        prevBtn = document.getElementById('prevBtn');
        prevBtn.addEventListener('click', () => showImage(galleryIndex - 1));

        nextBtn = document.getElementById('nextBtn');
        nextBtn.addEventListener('click', () => showImage(galleryIndex + 1));

        heartsLayer = document.getElementById('heartsLayer');

        addSwipeSupport();
        createIndicators(); // crea puntini

        typeText(data.text, onTypingComplete);
    });
}

function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("data.json");
        if (!response.ok) {
            console.error(response.statusText);
            return;
        }
        const result = (yield response.json());
        return result;
    });
}

function typeText(text, onComplete) {
    greetingEl.textContent = '';
    let typedIndex = 0;
    const words = text;
    const timer = setInterval(() => {
        greetingEl.textContent = words.slice(0, ++typedIndex);
        if (typedIndex >= words.length) {
            clearInterval(timer);
            onComplete?.();
        }
    }, TYPING_SPEED);
}

function onTypingComplete() {
    openGalleryBtn.style.display = 'inline-flex';
    openGalleryBtn.animate(
        [
            { transform: 'scale(0.6)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
        ],
        { duration: 320, easing: 'cubic-bezier(.2,.9,.2,1)' }
    );
}

function showGallery() {
    welcomeScreen.setAttribute('aria-hidden', 'true');
    galleryScreen.setAttribute('aria-hidden', 'false');
    galleryScreen.classList.add('active');
    showImage(0);
}

function showImage(i) {
    if (!data.images || data.images.length === 0)
        return;

    galleryIndex = ((i % data.images.length) + data.images.length) % data.images.length;
    const item = data.images[galleryIndex];

    updateIndicators(); // aggiorna puntini

    imageWrapper.innerHTML = '';

    // ⭐ VIDEO
    if (item.type === "video") {
        const video = document.createElement("video");
        video.src = item.file;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.controls = false;
        video.style.maxWidth = "100%";
        video.style.maxHeight = "100%";
        video.style.objectFit = "contain";

        imageWrapper.appendChild(video);
        captionEl.textContent = item.caption || "";
        return;
    }

    // ⭐ IMMAGINI (CODICE ORIGINALE)
    const img = new Image();
    img.alt = item.caption || ('Immagine ' + (galleryIndex + 1));
    img.loading = 'lazy';
    img.src = item.file;

    img.addEventListener('error', () => {
        imageWrapper.innerHTML =
            `<div style="color:rgba(255,255,255,0.6);text-align:center;padding:20px">
                Non riesco a caricare <strong>${item.file}</strong>.
            </div>`;
        captionEl.textContent = item.caption || '';
    });

    imageWrapper.appendChild(img);
    captionEl.textContent = item.caption || '';
}


// ------------------------------------------------------------
// ⭐ PUNTINI DENTRO LA FOTO (Instagram style)
// ------------------------------------------------------------
function createIndicators() {
    const carousel = document.getElementById("carousel");

    indicatorsContainer = document.createElement('div');
    indicatorsContainer.style.position = 'absolute';
    indicatorsContainer.style.bottom = '14px';
    indicatorsContainer.style.left = '50%';
    indicatorsContainer.style.transform = 'translateX(-50%)';
    indicatorsContainer.style.display = 'flex';
    indicatorsContainer.style.gap = '6px';
    indicatorsContainer.style.zIndex = '50'; // sotto frecce, davanti immagine

    data.images.forEach(() => {
        const dot = document.createElement('div');
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.borderRadius = '50%';
        dot.style.background = 'rgba(255,255,255,0.3)';
        indicatorsContainer.appendChild(dot);
    });

    carousel.appendChild(indicatorsContainer);
}

function updateIndicators() {
    if (!indicatorsContainer) return;
    const dots = indicatorsContainer.children;

    for (let i = 0; i < dots.length; i++) {
        dots[i].style.background =
            i === galleryIndex ? 'white' : 'rgba(255,255,255,0.3)';
    }
}
// ------------------------------------------------------------


function addSwipeSupport() {
    let startX = null;
    let startTime = 0;
    const carousel = document.getElementById('carousel');

    carousel.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        startX = t.clientX;
        startTime = Date.now();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        if (startX === null)
            return;

        const t = e.changedTouches[0];
        const dx = t.clientX - startX;
        const dt = Date.now() - startTime;

        startX = null;

        if (Math.abs(dx) > 40 && dt < 600) {
            if (dx < 0) showImage(galleryIndex + 1);
            else showImage(galleryIndex - 1);
        }
    }, { passive: true });

    let lastTap = 0;
    carousel.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            launchHearts(HEART_FALL_COUNT);
        }
        lastTap = now;
    });
}

function launchHearts(n) {
    for (let k = 0; k < n; k++) createFallingHeart(k);

    setTimeout(() => {
        for (let k = 0; k < n; k++) createFallingHeart(k);
    }, 1000);

    setTimeout(() => { heartsLayer.innerHTML = ''; }, 6500);
}

function createFallingHeart(index) {
    const el = document.createElement('div');
    el.className = 'falling-heart';
    el.innerText = '❤️';

    const x = Math.random() * 100;
    const delay = Math.random() * 1.2;
    const dur = 3 + Math.random() * 2.2;

    el.style.left = `calc(${x}% - 20px)`;
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.fontSize = `${12 + Math.random() * 28}px`;
    el.style.opacity = String(0.7 + Math.random() * 0.3);

    heartsLayer.appendChild(el);
}
//# sourceMappingURL=main.js.map
