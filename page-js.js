let services = [
    {
        image: 'compare-drugs.png',
        name: 'compare drugs',
        description: 'Compare top drugs by medical conditions, side effects, ratings and reviews.'
    },
    {
        image: 'conditions-diseases.png',
        name: 'conditions diseases',
        description: 'Find detailed information for a particular disease or condition including symptoms, diagnosis and treatment options.',
    },
    {
        image: 'discount-card.png',
        name: 'discount card',
        description: 'Present free coupon to a participating pharmacy to receive discounts on your prescription.',
    },
    {
        image: 'drugs-az.png',
        name: 'drugs',
        description: 'Detailed and accurate information is provided and over-the-counter medicines for both consumers and healthcare professionals.',
    },
    {
        image: 'interactions-checker.png',
        name: 'interactions checker',
        description: 'Check interactions with multiple drugs, vaccines, supplements, alcohol, food and diseases',
    },
    {
        image: 'my-med-list.png',
        name: 'your medication list',
        description: 'Organize your medications into an easy-to-read format, that provides in-depth drug interaction data, news, and FDA alerts.',
    },
    {
        image: 'pill-identifier.png',
        name: 'pill identifier',
        description: 'Use the pill finder to identify medications by visual appearance or medicine name.',
    },
    {
        image: 'side-effects.png',
        name: 'side effects',
        description: 'Search drug side effects',
    },
    {
        image: 'treatment-guides.png',
        name: 'treatment-guides',
        description: 'Find your disease or condition and discover what medication options are available for you.',
    },
];

let servicesHTML = '';

services.forEach((service) => {
    servicesHTML +=
    `<div class="card">
        <div class="image">
            <img class="image-icon" src="services/${service.image}" alt="${service.name}">
        </div>
        <div class="info">
            <h3>${service.name}</h3>
            <p>${service.description}</p>
        </div>
    </div>`;
});

document.querySelector('.sections-content').innerHTML =servicesHTML;


const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');
const container = document.querySelector('.sections-content');

scrollLeftButton.addEventListener('click', () => {
    container.scrollBy({
        left: -200, // Adjust as needed
        behavior: 'smooth' // Smooth scrolling
    });
});

scrollRightButton.addEventListener('click', () => {
    container.scrollBy({
        left: 200, // Adjust as needed
        behavior: 'smooth' // Smooth scrolling
    });
});


let isDragging = false;
let startX, scrollLeft;

container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
});

container.addEventListener('touchend', () => {
    isDragging = false;
});

container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the scroll speed by changing the multiplier
    container.scrollLeft = scrollLeft - walk;
});
