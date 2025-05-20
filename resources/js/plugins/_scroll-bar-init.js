import SimpleBar from 'simplebar';
import {OverlayScrollbars} from 'overlayscrollbars';
import {$doc} from "../components/utils/_helpers";
const osInstances = new Map();

function isMobile() {
    return window.innerWidth < 768;
}

export function scrollBarInit() {
    OverlayScrollbarsInit();

    $(window).on('resize', function () {
        OverlayScrollbarsInit();
    });
    $('.scrollbar-container').each(function () {
        new SimpleBar(this, {
            autoHide: false,
            scrollbarMinSize: 50,
            clickOnTrack: true,
        });
    });
}

function OverlayScrollbarsInit() {
    $('.scroll-box').each(function (index) {
        const $t = $(this);
        const id = $t.attr('id') || 'scroll-box-' + index;

        // Якщо інстанс існує — знищити
        const existingInstance = osInstances.get(id);
        if (existingInstance) {
            $t.removeClass('OverlayScrollbars-init');
            existingInstance.destroy();
            osInstances.delete(id);
            $doc.find('.lawyers-section-scrollbar-decor').remove();
        }

        if (isMobile()) {
            // Не ініціалізуємо на мобільному
            return;
        }

        let sensitivity = Number($t.attr('data-scroll-sensitivity') || 1);
        let decor = $t.attr('data-decor-text');
        const osInstance = OverlayScrollbars(this, {
            scrollbars: { autoHide: 'leave' }
        });
        osInstances.set(id, osInstance);
        $t.addClass('OverlayScrollbars-init');
        const scrollEl = osInstance.elements().viewport;

        let isDown = false;
        let startX, startY, scrollLeft, scrollTop, decorID;

        if (decor) {
            decorID = 'lawyers-section-scrollbar-decor-' + index;
            let $decorEl = $('#' + decorID);
            if($decorEl.length === 0){
                $t.append('<div id="' + decorID + '" class="lawyers-section-scrollbar-decor">' + decor + '</div>');
                $decorEl = $('#' + decorID);
            }
            $t.mousemove(function (e) {
                const x = e.pageX - $t.offset().left;
                const y = e.pageY - $t.offset().top;
                $decorEl.css({
                    left: x,
                    top: y,
                });
            });
        }

        scrollEl.addEventListener('mousedown', function (e) {
            isDown = true;
            scrollEl.classList.add('dragging');
            startX = e.pageX;
            startY = e.pageY;
            scrollLeft = scrollEl.scrollLeft;
            scrollTop = scrollEl.scrollTop;
        });

        scrollEl.addEventListener('mouseleave', () => {
            isDown = false;
            scrollEl.classList.remove('dragging');
        });

        scrollEl.addEventListener('mouseup', () => {
            isDown = false;
            scrollEl.classList.remove('dragging');
        });

        scrollEl.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX;
            const y = e.pageY;
            const walkX = x - startX;
            const walkY = y - startY;
            scrollEl.scrollLeft = scrollLeft - (walkX * sensitivity);
            scrollEl.scrollTop = scrollTop - (walkY * sensitivity);
        });
    });
}


