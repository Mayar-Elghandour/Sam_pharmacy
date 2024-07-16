
let categories =[

    {
        image:'1-drugs.png',
        name:'drugs',
    },
    {
        image:'2-baby-care.png',
        name:'baby care',
    },
    {
        image:'3-man-care.png',
        name:'men care',   
    },

    {
        image:'4-woman-care.png',
        name:'women care',
    },
    {
        image:'Makeup & Accessories (1).png',
        name:'Makeup & Accessories ',
    },
    {
        image:'11-hair-care.png',
        name:'hair care',
    },
    {
        image:'12-skin-care.png',
        name:'skin care',
    },
    {
        image:'Home Care (1).png',
        name:'home care',
    },

];

let  categoriesHTML='';


categories.forEach((category)=>{
    categoriesHTML +=
    `<div class="card">
        <div class="image">
            <img class='image-icon-category' src="categories/${category.image}">
        </div>
        <div class="info">
            <h3>${category.name}</h3>
        </div>
    </div>`
    
});


document.querySelector('.sections-content-categories').innerHTML =categoriesHTML;
const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');
const container = document.querySelector('.sections-content-categories');

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




function logout() {
    // Clear session or authentication data (this would typically be done server-side)
    // For example, using localStorage for demo purposes:
    localStorage.removeItem('authToken');

    // Redirect to index.html
    window.location.href = 'index.html';

    // Clear browser history to prevent back navigation
    setTimeout(function () {
        history.pushState(null, '', 'index.html');
        window.addEventListener('popstate', function () {
            history.pushState(null, '', 'index.html');
        });
    }, 0);
}

window.onload = function () {
    preventBackNavigation();
};

function preventBackNavigation() {
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', function () {
        history.pushState(null, '', location.href);
    });
}
