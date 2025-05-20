import SimpleBar from 'simplebar';
import {OverlayScrollbars} from 'overlayscrollbars';
import {$doc} from "../components/utils/_helpers";


export function scrollBarInit() {
    OverlayScrollbarsInit();
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
        let sensitivity = $t.attr('data-scroll-sensitivity') || 1;
        let decor = $t.attr('data-decor-text');
        sensitivity = Number(sensitivity);
        const osInstance = OverlayScrollbars(this, {
            scrollbars: {autoHide: 'leave'}
        });

        const scrollEl = osInstance.elements().viewport;

        let isDown = false;
        let startX, startY, scrollLeft, scrollTop, decorID;

        if (decor) {
            decorID = 'lawyers-section-scrollbar-decor-' + index;
            $t.append('<div id="' + decorID + '" class="lawyers-section-scrollbar-decor">' + decor + '</div>');
            const $decorEl = $doc.find('#' + decorID);
            $t.mousemove(function (e){
                const x = e.pageX;
                const y = e.pageY;
                const walkX = x - $t.offset().left;
                const walkY = y - $t.offset().top;
                $decorEl.css({
                    'left': walkX,
                    'top': walkY,
                })
            })

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


