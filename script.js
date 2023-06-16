const menu = document.querySelector('#menu');
const menuItems = document.querySelector('.menu-items');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

leftArrow.addEventListener('click', () => {
    menu.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
});

rightArrow.addEventListener('click', () => {
    menu.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
});
