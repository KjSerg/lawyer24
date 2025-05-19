export const burger = () => {
    const $doc = $(document);
    $doc.on('click', '.burger', function (e) {
        e.preventDefault();
        const $t = $(this);
        const isActive = $t.hasClass('active');
        const $menu = $doc.find('.header-wrap');
        const $body = $doc.find('body');
        if (isActive) {
            $t.removeClass('active');
            $menu.removeClass('active');
            $body.removeClass('open-header-menu');
        } else {
            $t.addClass('active');
            $menu.addClass('active');
            $body.addClass('open-header-menu');
        }
    })
}