import {$doc, isElementInViewport, isFooterInViewport, moveToElement} from "../utils/_helpers";

const $screens = $doc.find('main section');
const $nav = $doc.find('.screens-nav');

function addNavEl() {
    if ($nav.length === 0) return;
    if ($screens.length === 0) {
        $nav.remove();
        return;
    }
    let html = '';
    $screens.each(function (index) {
        const $t = $(this);
        let id = $t.attr('id');
        if (id === undefined) {
            id = 'home-screen-' + index;
            $t.attr('id', id);
        }
        let cls = index === 0 ? 'active' : '';
        html += '<a class="' + cls + '" href="#' + id + '"></a>';
    });
    $nav.html(html);
}

export function isElementInView(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight && rect.bottom > 0 // частково в межах вікна
    );
}

const setActiveScreen = () => {
    const updateActive = () => {
        if(isFooterInViewport()){
            $doc.find('.screens-nav').addClass('hidden');
            return;
        }
        $doc.find('.screens-nav').removeClass('hidden');

        $screens.each(function () {
            const $t = $(this);
            const id = $t.attr('id');
            const $link = $doc.find(`.screens-nav a[href="#${id}"]`);
            if (isElementInViewport($t)) {
                $link.addClass('active');
            } else {
                $link.removeClass('active');
            }
        });
    };

    // Виклик одразу
    updateActive();

    // Навішування подій (тільки раз)
    $(window).on('load scroll resize', updateActive);
}

export const initScreensNav = () => {
    addNavEl();
    setActiveScreen();
    $doc.on('click', '.screens-nav a', function (e) {
        e.preventDefault();
        const $t = $(this);
        $doc.find('.screens-nav a').removeClass('active');
        $t.addClass('active');
        moveToElement($($t.attr('id')));
    })
}