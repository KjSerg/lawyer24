import 'slick-carousel';

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import PhotoSwipe from 'photoswipe';

export const initGallery = () => {
    const lightbox = new PhotoSwipeLightbox({
        gallery: '.single-gallery',
        children: 'a', showHideAnimationType: 'fade',
        pswpModule: PhotoSwipe
    });
    lightbox.init();
};

export default class Slick {
    constructor() {
        this.init();
    }

    init() {
        this.affairsSlick();
        this.lawyersInit();
        this.reviewsSlick();
    }

    affairsSlick() {
        $(document).find('.affairs-slick').each(function () {
            const $slider = $(this);
            const param = {
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                adaptiveHeight: true,
                responsive: [
                    {
                        breakpoint: 1201,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 901,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            };
            if ($slider.find('> *').length > 1) {
                $slider.slick(param);
            }
        });
    }
    reviewsSlick() {
        $(document).find('.reviews-slider').each(function () {
            const $slider = $(this);
            const $section = $slider.closest('section');
            const $prev = $section.find('.slick__prev');
            const $next = $section.find('.slick__next');
            const param = {
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true,
                prevArrow: $prev,
                nextArrow: $next,
                dots: false,
                responsive: [
                    {
                        breakpoint: 1201,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 901,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            dots: true,
                        }
                    }
                ]
            };
            if ($slider.find('> *').length > 1) {
                $slider.slick(param);
            }
        });
    }


    lawyersInit(){
        $(document).find('.lawyers-list-slick').each(function () {
            const $slider = $(this);
            const param = {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                mobileFirst: true,
                dots: true,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: 'unslick' // Знищує слайдер при ширині 768px і більше
                    }
                ]
            };
            if ($slider.find('> *').length > 1) {
                $slider.slick(param);
            }
        });
    }

    gallerySliderInit() {
        $(document).find('.single-gallery').each(function () {
            var currentSlickIndex;
            const $slider = $(this);
            const $section = $slider.closest('section');
            const $prev = $section.find('.slick__prev');
            const $next = $section.find('.slick__next');
            const $preview = $section.find('.single-gallery-preview');

            const param = {
                lazyLoad: 'ondemand',
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                prevArrow: $prev,
                nextArrow: $next,
                dots: false,
                accessibility: true,
                autoplay: false,
                infinite: false
            };

            if ($preview.length > 0) {
                $preview.slick({
                    lazyLoad: 'ondemand',
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    asNavFor: $slider,
                    dots: false,
                    centerMode: false,
                    focusOnSelect: true,
                    arrows: false,
                    infinite: false,
                    responsive: [
                        {
                            breakpoint: 601,
                            settings: {
                                slidesToShow: 3
                            }
                        }
                    ]
                });
                param.asNavFor = $preview;
            }
            if ($slider.find('> *').length > 1) {
                $slider.slick(param);
            } else {
                $slider.find('img').css('opacity', '1');
                $prev.hide();
                $next.hide();
            }

        });
    }

    gallerySliderRefresh() {
        $(window).on('load', function () {
            $(document).find('.affairs-slick.slick-slider').each(function () {
                $(this).slick('refresh');
            });
        });
    }
}

