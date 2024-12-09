// Debugging
console.log('app.js is loaded on this page');

// About
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
    event.currentTarget.classList.add("active-link");  //event is deprecated?
};

// Content
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
    event.currentTarget.classList.add("active");  //event is deprecated?
};

// Dark Mode
// let theme = 'light';
// Added persistence, prioritizes localStorage than system preference (device not browser)
let theme = localStorage.getItem('theme');  // Check localStorage for theme, or fallback to system preference
const toggles = document.getElementsByClassName('button2');
// const toggle1 = document.getElementById('button2_1');
const body = document.body;

if (!theme) {  // If no theme found in LS
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';  // If prefersDark is true then theme = 'dark'
    localStorage.setItem('theme', theme);  // Save
}

body.classList.toggle('dark__mode', theme === 'dark');  // Apply theme on page load

// Listen for and update system theme change...
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {  // Apply if theme is not manually set in LS
        theme = e.matches ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        body.classList.toggle('dark__mode', theme === 'dark');
    }
});

for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
        console.log('click');
        if (theme === 'light') {
            body.classList.add('dark__mode');
            theme = 'dark';
        }
        else {
            body.classList.remove('dark__mode');
            theme = 'light';
        }
        localStorage.setItem('theme', theme);
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

let isExpanded = sessionStorage.getItem('isExpanded') === 'true';  // Use sessionStorage rather than localStorage
if (isExpanded) {
    see_more_text.textContent = 'See Less';
}
else {
    see_more_text.textContent = 'See More';
}

function cardsToShow() {
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

see_more.addEventListener('click', (event) => {
    // Prevent default link behavior
    event.preventDefault();

    // Toggle text between See More and See Less
    if (see_more_text.textContent.trim() === 'See More') {  //trim()- removes extra spaces around the text
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

    sessionStorage.setItem('isExpanded', isExpanded.toString());
});

// window.onbeforeunload = () => {
//     localStorage.removeItem('isExpanded');
// };

// Nav Media Query
const menu = document.querySelector('.nav__burger'); //menu can be other variable name
const menuLinks = document.querySelector('.nav__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('active');   //Adds a class...
    menuLinks.classList.toggle('active');
})

// Background
const background = document.querySelector('#background');
const bg_section = document.querySelector('#hero');

function getBGY() {
    const bg_section_bottom = bg_section.getBoundingClientRect().bottom;
    const bg_height = parseFloat(getComputedStyle(background).backgroundSize.split(' ')[1]);
    // const y_percent = ((bg_section_bottom) / window.innerHeight) * 100;

    const bg_y = bg_section_bottom - (window.innerHeight * bg_height / 100);
    background.style.backgroundPositionY = `${bg_y}px`;
    console.log(bg_y);
}

getBGY();
window.addEventListener('resize', getBGY);

// Contact
// Init
// emailjs.init("f3mPAq9Q2KgA9OX1_");
const scriptURL = 'https://script.google.com/macros/s/AKfycbzmLKYgiyiwubAKiA6MiaJEqCfOw0dMcpDcgvJxCvsLTgNf7RwlVYVL47A1NSr-_yNS/exec';  //  Google Sheets, Apps Script Extension

document.getElementById('contact__form').addEventListener('submit', e => {  // Event listener
    e.preventDefault();  // Prevent default form submission

    // Google sheets and Email
    const form = e.target;  // Get form element
    const contact_confirm = document.getElementById('contact__confirm');
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            contact_confirm.innerHTML = "Message sent successfully";
            console.log('Success', response);
            setTimeout(function() {
                contact_confirm.innerHTML = ""
            }, 3000);
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