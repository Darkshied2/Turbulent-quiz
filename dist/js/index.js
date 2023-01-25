const data = {
    rotator : {
        texts : ['erik','front-end developer','graphic designer'],
        count : 0,
        valY : 0,
        top : 0
    },
    setShowNavbar :{
        atPointY :{
            home: [1526,1120,1520],
            portfolio: [800]
        }
    }

}

function scrollingNavbar(scrollY = data.setShowNavbar.atPointY.home) {
    let deviceWidth = window.screen.width;
    if (scrollY.length > 1){
        if (deviceWidth <= 767) {
            showNavbar(scrollY[0]);
        }
    
        else if (deviceWidth >= 768 && deviceWidth <= 991){
             showNavbar(scrollY[1]);
        }
    
        else{
            showNavbar(scrollY[2]);
        }
    } 
    else{
        if (deviceWidth <= 767) {
            showNavbar(scrollY[0]);
        }
    
        else if (deviceWidth >= 768 && deviceWidth <= 991){
             showNavbar(scrollY[0]);
        }
    
        else{
            showNavbar(scrollY[0]);
        }
    }

}


function showNavbar(scrollY) {
        document.querySelector('header').classList.toggle('sticky', window.scrollY > scrollY);
}

(function slideRotatorText() {

    if (window.location.href !== window.location.origin+'/'+window.location.hash) {
        return false;
    }
    
    const rotator = document.querySelector('#rotator .rotator-slider');
    const rotatorList = document.querySelectorAll('.rotator-item');
    
    let currentValY = data.rotator.valY;
    let count = data.rotator.count;

    if(count === rotatorList.length){
        count = 0;
        data.rotator.count = count;
    }

    // console.log(count);
    // console.log(currentValY);

    setTimeout(() => {
        const currentOffsetHeight = rotatorList[count].offsetHeight;
        const mrgBottom = rotatorList[count].style.marginBottom;
       
        currentValY = parseInt(mrgBottom) + currentOffsetHeight + currentValY;
        if (currentValY > 400) {
            currentValY = 0;
            data.rotator.valY = currentValY;
        }
        rotator.style.transform = `translate3d(0, ${-currentValY}px, 0)`;
        data.rotator.valY = currentValY;
        count++
        data.rotator.count = count;        
    }, 5000);

    setTimeout(() => {
        document.querySelector('#rotator').classList.add('active');
    }, 4000);
    setTimeout(() => {
        document.querySelector('#rotator').classList.remove('active');
    }, 6000);

    setTimeout(slideRotatorText, 5000);

}());


/*                    START JQuery                          */
/* ======================================================== */


/*   Function Codes    */
/* =================== */

/*** The code below is only for lightGallery JS  ***
/*** lightGallery JS required jQuery >= 1.8.0    ***/

$(document).ready(function() {

/*** Initialize LightGallery JS ***/
function initiliazeLightGallery(target, selector) {
    return $(target).lightGallery({
           selector: selector,
           mode: 'lg-soft-zoom',
           download: false,
           closable: false,
           share: false,
           rotate: false,
           flipHorizontal: false,
           flipVertical: false
        }); 
   }
   

function filterCategory(currentDataFilter, image) {
   let currentImage = $(image);
//  console.log($(currentImage));

   if (currentDataFilter === 'all' || $(currentImage).data('filter') ===  currentDataFilter) {
       $(currentImage).appendTo($('#gallery-grid'));
       $(currentImage).removeClass('hidden').addClass('show-up');
   } // else console.log('false');

   return currentImageShow.push($(currentImage));
}


/*   End Function Codes    */
/* ======================= */


    let $galleryHome = initiliazeLightGallery('#gallery-home', '.item');    // Initialize LightGallery JS for Home Page
    let $gallery = initiliazeLightGallery('#gallery-grid', '.item');        // Initialize LightGallery JS for Portfolio Page 
    let galleries = $('.gallery-grid-box');                                 // Initialize galleries
    let ctgButtons = $('#category .nav-link').toArray();                    // Initialize category buttons
    let currentImageShow = [];


/*
 * Filter Image Gallery by Category
/* this is for button navigation */

// 1. Add Trigger Click for filter gallery
    $('#category .nav-link').click(function(event) {
        event.preventDefault();
        
        // Then loop each button for check is there contains class active ?
        $(ctgButtons).each(function() {
            $(this).removeClass('active');
            $(this).addClass('disabled');
        });

        // Add Class Active for current target Button Category
        $( event.target ).addClass('active'); 

        // Passing value of target id
        let currentDataFilter = $(event.target).attr('id');

        // Set Selected Category Select Box
        $('#category-select option').each(function() {
            $(this).removeAttr('selected');
            if ($(this).attr('value') === currentDataFilter) {
                $(this).attr('selected', true);
            }
        });
        
// 2. Then Now We Will Filter the Image Gallery

        // Remove First All Image With FadeOut Animation *animation is running
        $(galleries).addClass('hidden');

        // Wait for the animation to finish
        setTimeout(function () {
            // And Then Remove All Images from HTML Document
            $(galleries).detach(); 
            $(galleries).each(function() {
                filterCategory(currentDataFilter, this);
            });

            // Re-init lightGallery
            $gallery.data('lightGallery').destroy(true);
            $gallery = initiliazeLightGallery('#gallery-grid' ,'.item'); 
        }, 500);

        setTimeout(function () {
            $(currentImageShow).each(function(i, elm) {
                $(elm).removeClass('show-up');
            })
            $(ctgButtons).removeClass('disabled');
            currentImageShow = []; 
            // console.log($(currentImageShow))
        }, 1100);
    });


/*
 * Filter Image Gallery by Category
/* this for select box navigation 
/* Do the same thing like above */

// 1. Add Trigger Click for filter gallery
    $('#category-select').change(function() {
        let currentDataFilter = $(this).find(":selected").val();

        // Set Active Category Button
        $(ctgButtons).each(function() {
            $(this).removeClass('active');
            if ($(this).attr('id') === currentDataFilter) {
                $(this).addClass('active'); 
            }
        });

// 2. Then Now We Will Filter the Image Gallery

        // Remove First All Image With FadeOut Animation *animation is running
        $(galleries).addClass('hidden');

        // Wait for the animation to finish
        setTimeout(function () {
            // And Then Remove All Images from HTML Document
            $(galleries).detach(); 
            // Loop each elm and append to the parent which have the same dataFilter with selectBox value
            $(galleries).each(function() {
                filterCategory(currentDataFilter, this);
            });

            // Re-init lightGallery
            $gallery.data('lightGallery').destroy(true);
            $gallery = initiliazeLightGallery('#gallery-grid' ,'.item'); 
        }, 500)

        setTimeout(function () {
            $(currentImageShow).each(function(i, elm) {
                $(elm).removeClass('show-up');
            })
            currentImageShow = []; 
        }, 1100); 
    });


    
/*
 *  Initialize lightGallery at home page 
/*  this Initialize only for mobile version! */
    $('.swiper-slide .swiper-img').each(function() {
        initiliazeLightGallery(this, 'this');
      });


/*
 *  Navbar Mobile Responsive  */ 
 
   $('.toggle-btn').click(function (event) {
       event.preventDefault();
       $('.navbar').addClass('open');
   });

   $('.nav-links li:last-child').click(function (event) {
       event.preventDefault();
       $('.navbar').slideUp(500);
       setTimeout(function() {
            $('.navbar').removeClass('open')
            $('.navbar').css('display', 'flex');
       },590);
   });


}); 
/**** END JQuery ****/


/* ========================================================

  ### The main code is written below
  ### We're going to use the ES6 javascript style

  ========================================================
*/


//*** Scroll Event - Header Sticky ***/
window.addEventListener('scroll', () => {
    if (window.location.href !== window.location.origin+'/'+window.location.hash) {
        scrollingNavbar(data.setShowNavbar.atPointY.portfolio);
    }
    else scrollingNavbar();
});

//*** Scroll Event - Go Back to Top Scroll Event ***/
window.addEventListener('scroll', () => {
    if (window.location.href !== window.location.origin+'/'+window.location.hash) {
        document.querySelector('#to-top').classList.toggle('d-md-block', window.scrollY > 1540)
    }
    else return false;
})

//*** Initialize  Swiper JS ***/
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 40,
    centeredSlides: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });





