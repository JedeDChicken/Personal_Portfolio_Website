// Debugging
console.log('app.js is loaded on this page');

// About
// Can use event listener
let aboutLinks = document.getElementsByClassName("about__links");
let aboutLinksContents = document.getElementsByClassName("about__links--contents");

function opentab(tabname, event) {
    for (aboutLink of aboutLinks) {
        aboutLink.classList.remove("active-link");
    }

    for (aboutLinkContent of aboutLinksContents) {
        aboutLinkContent.classList.remove("active-tab");
    }

    target = document.getElementById(tabname);
    target.classList.add("active-tab");
    event.currentTarget.classList.add("active-link");  // event is deprecated?
    // event.currentTarget- the element the event handler (e.g. onclick) is attached to
    // event.target- the actual element clicked
};

// Content, @ pages_<project>.html
let contentLinks = document.getElementsByClassName("content__links");
let contentLinksContents = document.getElementsByClassName("content__links--contents");

function opentab1(tabname, event) {
    for (contentLink of contentLinks) {
        contentLink.classList.remove("active");
    }

    for (contentLinksContent of contentLinksContents) {
        contentLinksContent.classList.remove("active");
    }

    target = document.getElementById(tabname);
    target.classList.add("active");
    event.currentTarget.classList.add("active");
};

// Dark Mode
// let theme = 'light';
// Added persistence, prioritizes localStorage (browser) than system preference (device)
// windows.matchMedia- checks if CSS media query is true in JS
// localStorage- built-in browser storage, stays even after closing/reopening page
const body = document.body;
const toggles = document.getElementsByClassName('button2');
// const toggle1 = document.getElementById('button2_1');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Check localStorage for theme, or fallback to system preference
// .matches- returns true/false
let theme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');

// Apply theme on page load (depending on current theme)
// .toggle('<classname>', <condition>)
body.classList.toggle('dark__mode', theme === 'dark');
localStorage.setItem('theme', theme);

// if (!theme) {  // If no theme found in LS
//     const prefersDark = prefers_dark.matches;
//     theme = prefersDark ? 'dark' : 'light';  // If prefersDark is true then theme = 'dark'
//     localStorage.setItem('theme', theme);  // Save
// }

// Listen for and update system theme change...
// e- variable/param used for event object (arbitrary, can be any...) that gets passed automatically to callback by addEventListener
// Callback- func that we pass into another func (so the other func can call it back later, if X happens then call this func)
// Catch?...
prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {  // Apply if theme is not manually set in LS (and system switches theme...)
        theme = e.matches ? 'dark' : 'light';
        // localStorage.setItem('theme', theme);
        body.classList.toggle('dark__mode', theme === 'dark');
    }
});

for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
        // console.log('click');
        theme = theme === 'light' ? 'dark' : 'light';
        body.classList.toggle('dark__mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        // if (theme === 'light') {
        //     body.classList.add('dark__mode');
        //     theme = 'dark';
        // }
        // else {
        //     body.classList.remove('dark__mode');
        //     theme = 'light';
        // }
    });
}

console.log('Reached this');

// window.onbeforeunload = () => {
//     localStorage.removeItem('theme');
// };

// Scroll
// document.addEventListener('DOMContentLoaded', () => {  // Debugging
// const content = document.querySelector('.content__links--contents');

// content.addEventListener('scroll', () => {
//     console.log('Scrolling...'); // Debugging
//     content.classList.add('scrolled');
    
//     clearTimeout(content.scrollTimeout);  // Clear any existing timeouts
    
//     content.scrollTimeout = setTimeout(() => {  // Set new timeout to remove 'scrolled' class
//         content.classList.remove('scrolled');
//     }, 100);  // Delay
// });

// See More
const see_more = document.getElementById('see__more');
const see_more_text = see_more.querySelector('span');
const project_cards = document.getElementsByClassName('projects__cards');
// const project_container = document.getElementsByClassName('projects__container');
// const see_more_height = (project_cards[0].offsetHeight * 2) + 32;  // 2 rem gap
let count, cards_to_show;

// Reset sessionStorage if page was force-reloaded
// if (performance.navigation.type === 1) {  // Deprecated?
//     sessionStorage.removeItem('isExpanded');
// }

let isExpanded = sessionStorage.getItem('isExpanded') === 'true';  // Use sessionStorage (deleted when tab/window is closed) rather than localStorage
if (isExpanded) {
    see_more_text.textContent = 'See Less';
}
else {
    see_more_text.textContent = 'See More';
}

function cardsToShow() {  // For responsive layout...
    const width = window.innerWidth;
    console.log(width);

    if (width < 1333 && width > 900) {
        cards_to_show = 4;
    }
    else {
        cards_to_show = 3;
    }
}

function updateCards() {  // Add/remove "displayed" in classes accordingly
    count = 0;
    for (let project_card of project_cards) {
        if (isExpanded) {
            project_card.classList.add('displayed');
        }
        else {
            if (count < cards_to_show) {
                project_card.classList.add('displayed');
            }
            else {
                project_card.classList.remove('displayed');
            }
        }
        count++;
    }
}

// Apply initial state
cardsToShow();
updateCards();

window.addEventListener('resize', function() {
    cardsToShow();
    updateCards();
});

see_more.addEventListener('click', (e) => {  // event or e
    // Prevent default link behavior, no reload
    e.preventDefault();

    // Toggle text between See More and See Less
    if (see_more_text.textContent.trim() === 'See More') {  // trim()- removes extra spaces around the text
        see_more_text.textContent = 'See Less';
        isExpanded = true;
        // event.preventDefault();
    }
    else {
        see_more_text.textContent = 'See More';
        isExpanded = false;
    }
    // Make sure to access the object accordingly not just text...

    cardsToShow();
    updateCards();

    sessionStorage.setItem('isExpanded', isExpanded.toString());  // Becomes 'true' instead of true (bool)...
});

// window.onbeforeunload = () => {
//     localStorage.removeItem('isExpanded');
// };

// Nav Media Query
const menu = document.querySelector('.nav__burger');  // menu can be other variable name
const menuLinks = document.querySelector('.nav__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('active');  // Adds a class...
    menuLinks.classList.toggle('active');
})

// Background- shifts bg img vertically so it lines up accordingly when window resizes...
const background = document.querySelector('#background');
const bg_section = document.querySelector('#hero');

function getBGY() {  // Get BG Y position
    const bg_section_bottom = bg_section.getBoundingClientRect().bottom;  // Distance from top of viewport to bottom edge of #hero
    const bg_height = parseFloat(getComputedStyle(background).backgroundSize.split(' ')[1]);  // Gets CSS bg size (e.g. 100%), takes the 2nd value (height, split), then converts "200%" to 200 (parse)...
    // const y_percent = ((bg_section_bottom) / window.innerHeight) * 100;

    // <Viewport top to hero bottom> - (<viewport height> * <parsed %height of bg img wrt. viewport>/100)
    // <...> - (bg img height)
    const bg_y = bg_section_bottom - (window.innerHeight * bg_height / 100);  // window.innerHeight- viewport height (in px), this calculates how much to shift bg img
    background.style.backgroundPositionY = `${bg_y}px`;  // Sets the CSS property (to shift bg img)
    console.log(bg_y);
}

getBGY();  // Run once immediately
window.addEventListener('resize', getBGY);  // Run again when window is resized

// Contact
// Init
// emailjs.init("f3mPAq9Q2KgA9OX1_");
const scriptURL = 'https://script.google.com/macros/s/AKfycbzmLKYgiyiwubAKiA6MiaJEqCfOw0dMcpDcgvJxCvsLTgNf7RwlVYVL47A1NSr-_yNS/exec';  //  Google Sheets, Apps Script Extension

document.getElementById('contact__form').addEventListener('submit', e => {  // Event listener
    e.preventDefault();  // Prevent default form submission

    // Google sheets and Email
    const form = e.target;  // Get form element, the form that was submitted
    const contact_confirm = document.getElementById('contact__confirm');
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })  // fetch(), new FormData(form)- automatically collects all form fields
        .then(response => {
            contact_confirm.innerHTML = "Message sent successfully";
            console.log('Success', response);
            setTimeout(function() {
                contact_confirm.innerHTML = ""
            }, 3000);  // 3s
            form.reset();
        })
        .catch(error => {
            contact_confirm.innerHTML = "Message not sent. Try again";
            console.log('Error', error.message);
            setTimeout(function() {
                contact_confirm.innerHTML = ""
            }, 3000);
            form.reset();
        });

    // Email
    // Input
    // const name = document.getElementById('contact__form--name').value;
    // const email = document.getElementById('contact__form--email').value;
    // const message = document.getElementById('contact__form--message').value;

    // // Construct mailto
    // const mailtoURL = `mailto:daniellecastor071@gmail.com?subject=Via Portfolio, Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(
    //     `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    // )}`;

    // // Open mail client
    // window.location.href = mailtoURL;
});

console.log("We're here");