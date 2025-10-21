/*!
 * ZeplinGo
 * Custom js
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Copyright (c) ZeplinGo
 */

//$(".footer4 .container .media-container-row .offset-md-1 .foot-title").remove();
//$(".footer4 .container .media-container-row .offset-md-1 .mbr-text").remove();
//$(".footer4 .container .media-container-row .offset-md-1 .media-container-column").remove();
//$('.footer4 .container .media-container-row .offset-md-1').prepend('<a href="https://www.tursab.org.tr/tr/ddsv" target="_blank"><img src="https://www.3crental.com/uploads/tursab-dds-12989.png" style="width: 100%;margin: 0 auto;margin-bottom: 30px;"></a>');


/*!
 * Ana sayfa öne çıkanlar
<<<<<<< HEAD
*/
=======
 */
>>>>>>> c4ab0881ba48a6fae05f14bd3afcba6d8f9750eb

$('#main-prod > form').removeClass().addClass('card col-12 col-md-12 p-3  col-lg-3  main-box');

/*!
 * Ana sayfa öne çıkanlar
 */



/*!
 * iconlu içerik
 */

$('.contentid73 > div > div > div').removeClass().addClass('card p-3 col-12 col-md-12 col-lg-4');

/*!
 * iconlu içerik
 */


 // Devami icin

function showMore(contentId) {
        const content = document.getElementById(contentId);
<<<<<<< HEAD
        if (content.style.display === "none" || content.style.display === "") {
            content.style.display = "block";
        } else {
            content.style.display = "none";
=======
        if (content) {
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
>>>>>>> c4ab0881ba48a6fae05f14bd3afcba6d8f9750eb
        }
    }

 // Devami icin




 // JavaScript slider
<<<<<<< HEAD
const slides = (typeof document!=='undefined') ? document.querySelectorAll('.slideContent') : [];
const prev = (typeof document!=='undefined') ? document.getElementById('prev') : null;
const next = (typeof document!=='undefined') ? document.getElementById('next') : null;
const dots = (typeof document!=='undefined') ? document.querySelectorAll('.contentSlider-dot') : [];

let currentSlide = 0;

function resetSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active');
  }
}

function goToSlide(n) {
  resetSlides();
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function goToPrevSlide() {
  goToSlide(currentSlide - 1);
}

function goToNextSlide() {
  goToSlide(currentSlide + 1);
}

try{ if(prev) prev.addEventListener('click', goToPrevSlide); }catch(e){}
try{ if(next) next.addEventListener('click', goToNextSlide); }catch(e){}

try{
  for (let i = 0; i < dots.length; i++) {
    if(dots[i]){
      dots[i].addEventListener('click', function() { goToSlide(i); });
    }
  }
}catch(e){}

try{ if(typeof window!=='undefined') setInterval(goToNextSlide,5000); }catch(e){}
=======
 function initializeSlider() {
    if (typeof document === 'undefined') return;
    
    const slides = document.querySelectorAll('.slideContent');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const dots = document.querySelectorAll('.contentSlider-dot');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function resetSlides() {
        for (let i = 0; i < slides.length; i++) {
            if (slides[i]) slides[i].classList.remove('active');
        }
        for (let i = 0; i < dots.length; i++) {
            if (dots[i]) dots[i].classList.remove('active');
        }
    }
    
    function goToSlide(n) {
        resetSlides();
        currentSlide = (n + slides.length) % slides.length;
        if (slides[currentSlide]) slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    function goToPrevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    function goToNextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    if (prev) prev.addEventListener('click', goToPrevSlide);
    if (next) next.addEventListener('click', goToNextSlide);
    
    for (let i = 0; i < dots.length; i++) {
        if (dots[i]) {
            dots[i].addEventListener('click', function() { goToSlide(i); });
        }
    }
    
    // Auto-advance slider every 5 seconds
    if (typeof window !== 'undefined') {
        setInterval(goToNextSlide, 5000);
    }
    
    // Initialize first slide
    goToSlide(0);
}

// Initialize slider when DOM is loaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSlider);
    } else {
        initializeSlider();
    }
}
>>>>>>> c4ab0881ba48a6fae05f14bd3afcba6d8f9750eb
