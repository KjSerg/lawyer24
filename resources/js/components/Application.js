import {$doc, detectBrowser, hidePreloader, isHorizontal, isMobile, showPreloader} from "./utils/_helpers";
import {burger} from "./ui/_burger";
import {accordion} from "./ui/_accardion";
import {numberInput} from "./forms/_number-input";
import {showPassword} from "./forms/_show-password";
import {fancyboxInit, showNotices} from "../plugins/_fancybox-init";
import {selectrickInit} from "../plugins/_selectric-init";
import FormHandler from "./forms/FormHandler";
import {toggler} from "./ui/_togglers";
import {tabs} from "./ui/_tabs";
import Slick, {initGallery, sliderRefresh} from "../plugins/Slick";
import {copyLink} from "./ui/_copy-link";
import {initScreensNav} from "./ui/_screens";
import {scrollBarInit} from "../plugins/_scroll-bar-init";

export default class Application {
    constructor() {
        this.$doc = $(document);
        this.$body = $("body");
        this.parser = new DOMParser();
        this.init();
    }

    init() {
        this.initBrowserAttributes();
        this.initComponents();
    }

    showLoaderOnClick() {
        this.$doc.on('click', 'a.show-load, .header a, .footer a', function (e) {
            let href = $(this).attr('href') || '';
            let target = $(this).attr('target') || '';
            let test = !href.includes('#') &&
                !href.includes('tel') &&
                !href.includes('mailto') &&
                target !== '_blank';
            if (test) {
                showPreloader();
                setTimeout(hidePreloader, 3000);
            }

        });
    }

    initBrowserAttributes() {
        const browserName = detectBrowser();
        this.$body.attr("data-browser", browserName).addClass(browserName);
        $(window).on('load resize', (e) => {
            const attr = window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical'
            this.$body.attr("data-screen-position", attr);
            this.$body.attr("data-mobile", isMobile ? "mobile" : '');
        });
    }

    initComponents() {
        let t = this;

        this.$doc.ready(() => {
            hidePreloader();
            showNotices();
            burger();
            toggler();
            accordion();
            numberInput();
            showPassword();
            selectrickInit();
            fancyboxInit();
            tabs();
            copyLink();
            initGallery();
            t.loadMore();
            initScreensNav();
            scrollBarInit();
            this.showLoaderOnClick();
            this.linkListener();
            this.mapInit();
            const form = new FormHandler('.form-js');
            const slick = new Slick();
            slick.gallerySliderRefresh();
        });

    }

    linkListener() {
        const t = this;
        this.$doc.on('click', 'a[href*="#"]:not(.fancybox, .accordion-head)', function (e) {
            e.preventDefault();
            const $t = $(this);
            const href = $t.attr('href');
            if (href === '#') return;
            const hashValue = href.split('#')[1];
            if (hashValue !== undefined) {
                const $el = t.$doc.find('#' + hashValue);
                if ($el.length > 0) {
                    if ($t.hasClass('not-scroll')) return;
                    $('html, body').animate({
                        scrollTop: $el.offset().top
                    });
                    return;
                }
            }
            window.location.href = href;
        });
        this.$doc.on('click', '[data-link]', function (e) {
            e.preventDefault();
            const $t = $(this);
            const href = $t.attr('data-link');
            if (href === '#') return;
            const hashValue = href.split('#')[1];
            if (hashValue !== undefined) {
                const $el = t.$doc.find('#' + hashValue);
                if ($el.length > 0) {
                    $('html, body').animate({
                        scrollTop: $el.offset().top
                    });
                    return;
                }
            }
            window.location.href = href;
        });
        $doc.on('click', '.scroll-to-top', function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 1000)
        })
    }

    loadMore() {
        let load = false;
        const parser = new DOMParser();
        $(document).on('click', '.button-load-more', function (e) {
            e.preventDefault();
            const $t = $(this);
            const href = $t.attr('href');
            if (load) return;
            const $pagination = $(document).find('.pagination-container');
            showPreloader();
            $pagination.addClass('not-active');
            $t.addClass('not-active');
            $.ajax({
                type: 'GET',
                url: href,
            }).done(function (r) {
                hidePreloader();
                let $requestBody = $(parser.parseFromString(r, "text/html"));
                $(document).find('.container-js').append($requestBody.find('.container-js').html());
                $pagination.html($requestBody.find('.pagination-container').html());
                load = false;
                $pagination.removeClass('not-active');
                $t.remove();
            });
        });
    }

    mapInit() {
        $doc.on('click', '.locations-map-window__close', function (e) {
            e.preventDefault();
            const $this = $(this);
            const $locations = $this.closest('.locations-map');
            const $videoIframes = $this.closest('.locations-map-window').find('iframe');
            $locations.find('.locations-map-window').removeClass('active');
            $locations.find('[data-area]').removeClass('current');
            if ($videoIframes.length === 0) return;
            $videoIframes.each(function () {
                const $videoIframe = $(this);
                const src = $videoIframe.attr('src');
                if (src.includes('youtube')) {
                    if (!src.includes('enablejsapi=1')) {
                        $videoIframe.attr('src', src + '&enablejsapi=1');
                    }
                    $videoIframe[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                }
            })

        });
        $doc.find('.locations-map svg').each(function (mapIndex) {
            const $map = $(this);
            let current = $map.attr('data-current') || '';
            current = current ? current.split(",") : [];
            if (current.length === 0) return;
            const $names = $map.find('path:not([stroke])');
            const $areas = $map.find('path[stroke]');
            current.forEach(function (name) {
                $map.find('path[data-name="' + name + '"]').addClass('active');
                $map.find('path[data-area="' + name + '"]').addClass('active');
            });
            $areas.each(function (index) {
                const $area = $(this);
                const areaName = $area.attr('data-area');
                $area.on('click', function (e) {
                    e.preventDefault();
                    const top = $map.find('path[data-name="' + areaName + '"]').offset().top;
                    const left = $map.find('path[data-name="' + areaName + '"]').offset().left;
                    const topMap = $map.offset().top;
                    const leftMap = $map.offset().left;
                    $map.closest('.locations-map').find('.locations-map-window').removeClass('active');
                    $map.closest('.locations-map').find('.locations-map-window[data-for-area="' + areaName + '"]').addClass('active');
                    $map.closest('.locations-map').find('.locations-map-window[data-for-area="' + areaName + '"]').css({
                        top: top - topMap,
                        left: left - leftMap,
                    });
                    $map.closest('.locations-map').find('[data-area]').removeClass('current');
                    $map.closest('.locations-map').find('[data-area="' + areaName + '"]').addClass('current');
                    if ($(window).width() <= 1023) {
                        $('html, body').animate({
                            scrollTop: $map.closest('.locations-map').find('.locations-map-windows').offset().top
                        }, 2000);
                        const $slider = $map.closest('.locations-map').find('.locations-map-window[data-for-area="' + areaName + '"] .locations-map-window-slider');
                        if ($slider.length > 0) sliderRefresh($slider);
                    }
                })
                $area.hover(function (e) {
                    $map.find('path[data-area="' + areaName + '"]').addClass('hovered');
                    $map.find('path[data-name="' + areaName + '"]').addClass('hovered');
                }, function (e) {
                    $map.find('path[data-area="' + areaName + '"]').removeClass('hovered');
                    $map.find('path[data-name="' + areaName + '"]').removeClass('hovered');
                })
            });
        });
    }

}