const toolbar = document.getElementById('toolbar');
const navigation = document.getElementById('navigation');
const openMenuBtn = document.getElementById('menu-nav');
const closeMenuBtn = document.getElementById('close-nav');
// detect scroll position

openMenuBtn.addEventListener('click', () => {
   scrollLock.disablePageScroll();
   navigation.classList.add('active');
});

closeMenuBtn.addEventListener('click', () => {
   navigation.classList.remove('active');
   scrollLock.enablePageScroll();
});

window.addEventListener('scroll', ()=> {
   const scroll = window.scrollY;

   if(scroll > 70) toolbar.classList.add('scroll');
   else toolbar.classList.remove('scroll');
   
});
