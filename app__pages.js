// Nav Media Query
const menu1 = document.querySelector('.nav__burger1');  // menu can be other variable name
const menuLinks1 = document.querySelector('.nav__menu1');

menu1.addEventListener('click', function() {
    menu1.classList.toggle('active');  // Adds a class...
    menuLinks1.classList.toggle('active');
})

// Scroll
let contents = document.getElementsByClassName('content__links--contents');

for (let content of contents) {
    content.addEventListener('scroll', () => {
        console.log('Scrolling...');  // Debugging
        content.classList.add('scrolled');
        
        clearTimeout(content.scrollTimeout);  // Clear any existing timeouts, ensures only latest scroll action matters
        
        content.scrollTimeout = setTimeout(() => {  // Set new timeout to remove 'scrolled' class, setTimeout(<func>, <delay>)
            content.classList.remove('scrolled');
        }, 100);  // Delay
    });
}

// Lightbox
// document.addEventListener('DOMContentLoaded', () => {
// Inits
const popups = document.querySelectorAll('.img__popup');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox__img');
const lightboxClose = document.getElementById('lightbox__close');
// let currentIndex = 0;
let zoom = 1;  // For zoom
let isDragging = false;  // Flag, for dragging...
let startX, startY;  // Start positions
let currentX = 0;
let currentY = 0;

// Open
function openLightbox(index) {
    const popup = popups[index];
    const imgSrc = popup.querySelector('img').src;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('visible');
    // currentIndex = index;
    zoom = 1;  // Reset
    currentX = ((window.innerWidth / 2) - (lightboxImg.offsetWidth / 2));  // Width of browser's viewport - width of lightbox img
    currentY = ((window.innerHeight / 2) - (lightboxImg.offsetHeight / 2));
    lightboxImg.style.left = `${currentX}px`;
    lightboxImg.style.top = '0px';
    lightboxImg.style.transform = `scale(${zoom})`;
}

// Close
function closeLightbox() {
    lightbox.classList.remove('visible');
}

// Zoom
lightboxImg.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {  // Ctrl+mousewheel
        e.preventDefault();

        if (e.deltaY < 0) {  // Scroll up
            zoom += 0.1;  // Zoom in
        }
        else {
            zoom = Math.max(1, zoom - 0.1);  // Zoom out but limit to 1...
        }

        lightboxImg.style.transform = `scale(${zoom})`;
    }
});

// Drag
lightboxImg.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
});

lightboxImg.addEventListener('mousemove', (e) => {
    if (isDragging) {
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        lightboxImg.style.left = currentX + 'px';
        lightboxImg.style.top = currentY + 'px';

        // Scroll effects
        console.log('Scrolling...');
        lightbox.classList.add('scrolled');
        
        clearTimeout(lightbox.scrollTimeout);
        
        lightbox.scrollTimeout = setTimeout(() => {
            lightbox.classList.remove('scrolled');
        }, 100);
    }
});

lightboxImg.addEventListener('mouseup', () => {
    isDragging = false;
});

lightboxImg.addEventListener('mouseleave', () => {  // Mouse pointer exits element's area
    isDragging = false;
});

// Event listeners
popups.forEach((popup, index) => {  // data-index in html
    popup.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
    });
});

lightboxClose.addEventListener('click', closeLightbox);

// Keyboard
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;  // If no popup
    if (e.key == 'Escape') closeLightbox();  // If there's popup and user pressed 'esc'
})