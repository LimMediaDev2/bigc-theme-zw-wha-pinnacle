import $ from 'jquery';
import Nanobar from 'nanobar';

export default function () {
    // Create the nanobar instance
    const nanobar = new Nanobar();

    // Timer for moving progress bar during ajax calls
    let timer = null;
    let current = 0;

    function clearTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function setTimer() {
        clearTimer();

        current = 0;
        timer = setInterval(() => {
            current += 3;
            if (current <= 100) {
                nanobar.go(current);
            } else {
                clearTimer();
            }
        }, 50);
    }

    // BEFORE THUMBNAILS ARE CLICKED, THE PRODUCT OPTION IMG RULES UPDATE CORRECTLY
// FOR COMPARISON OF IMG DATA WHEN OPTIONS ARE CLICKED AFTER A THUMBNAIL IS CLICKED:
// GET DEFAULT IMG + FIRST SLIDE IMG SRC + DEFAULT OPTION IMAGE
// const defaultImg = $('.main-image-container .slick-slide[data-slick-index="0"] figure').attr('id');
// console.log( "Default img, first img in control panel is: " + (defaultImg) );
const updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
// console.log(updatedFirstSlideImgSrc);
// console.log( "Updated Img Src in first slide is : " + (updatedFirstSlideImgSrc) );
// $(document).on('click', ".productView.thumbnail-clicked", function() {
$(".productView.thumbnail-clicked div[data-product-option-change] input.form-radio").change(function() {
  var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
  // console.log(updatedFirstSlideImgSrc);
});

// RUN THIS SCRIPT ONLY BEFORE THUMBNAILS HAVE BEEN CLICKED
$(document).on('click', ".productView.thumbnail-unclicked", function() {
$(".productView.thumbnail-unclicked div[data-product-option-change] input.form-radio").change(function() {
  setTimeout(function() {
    var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
    // console.log(updatedFirstSlideImgSrc);
  $('.slick-active figure.productView-image').attr('data-image-gallery-main', updatedFirstSlideImgSrc);
    $('.slick-active figure.productView-image').attr('href', updatedFirstSlideImgSrc);
    $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', updatedFirstSlideImgSrc);
    $('.slick-active figure.productView-image img').attr('src', updatedFirstSlideImgSrc);
  }, 1000);
});
$(".productView.thumbnail-unclicked .form-select").change(function() {
  setTimeout(function() {
    var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
    // console.log(updatedFirstSlideImgSrc);
  $('.slick-active figure.productView-image').attr('data-image-gallery-main', updatedFirstSlideImgSrc);
    $('.slick-active figure.productView-image').attr('href', updatedFirstSlideImgSrc);
    $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', updatedFirstSlideImgSrc);
    $('.slick-active figure.productView-image img').attr('src', updatedFirstSlideImgSrc);
    console.log(updatedFirstSlideImgSrc);
  }, 1500);
});
});

$(window).on("load", function(){
  setTimeout(function() {
    var defaultImg = $('.main-image-container .slick-slide[data-slick-index="0"] figure').attr('id');
    var onLoadFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
    var defaultOptionImg = $('.main-image-container .slick-active figure.productView-image').attr('data-zoom-image');
    // console.log( "Default img, first img in control panel is: " + (defaultImg) );
    // console.log( "Intial Page Load Img Src in first slide is : " + (onLoadFirstSlideImgSrc) );
    // console.log( "Default Option img onLoad is: " + (defaultOptionImg) );
    setTimeout(function() {
      $('.slick-active figure.productView-image').attr('data-image-gallery-main', defaultOptionImg);
      $('.slick-active figure.productView-image').attr('href', defaultOptionImg);
      $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', defaultOptionImg);
      $('.slick-active figure.productView-image img').attr('src', defaultOptionImg);
    }, 1000);
  }, 700);
});

  // RUN THIS SCRIPT ONLY AFTER THUMBNAILS HAVE BEEN CLICKED
  $(document).on('click', ".productView.thumbnail-clicked", function() {
    $(".productView.thumbnail-clicked div[data-product-option-change] input.form-radio").change(function() {
      setTimeout(function() {
        var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
        // console.log(updatedFirstSlideImgSrc);
        $('.slick-active figure.productView-image').attr('data-image-gallery-main', updatedFirstSlideImgSrc);
        $('.slick-active figure.productView-image').attr('href', updatedFirstSlideImgSrc);
        $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', updatedFirstSlideImgSrc);
        $('.slick-active figure.productView-image img').attr('src', updatedFirstSlideImgSrc);
        }, 1000);
      });
    });

    // RUN THIS SCRIPT ONLY AFTER THUMBNAILS HAVE BEEN CLICKED
    $(document).on('click', ".productView.thumbnail-clicked", function() {
      $(".productView.thumbnail-clicked div[data-product-option-change] .form-select").change(function() {
        setTimeout(function() {
          var updatedFirstSlideImgSrc = $('.main-image-container .slick-slide[data-slick-index="0"] figure img').attr('src');
          // console.log(updatedFirstSlideImgSrc);
          $('.slick-active figure.productView-image').attr('data-image-gallery-main', updatedFirstSlideImgSrc);
          $('.slick-active figure.productView-image').attr('href', updatedFirstSlideImgSrc);
          $('.slick-active figure.productView-image').attr('data-image-gallery-zoom-image-url', updatedFirstSlideImgSrc);
          $('.slick-active figure.productView-image img').attr('src', updatedFirstSlideImgSrc);
       }, 1000);
      });
    });

}
