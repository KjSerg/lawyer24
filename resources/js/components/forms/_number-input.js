import Inputmask from "inputmask";

export const initTelMask = () => {
    $('input[type="tel"]').each(function () {
        const mask = $(this).attr('data-mask') || "+38(999)9999999";
        Inputmask({
            mask: mask,
            greedy: false,
            placeholder: "_",
            showMaskOnHover: true
        }).mask(this);
        const $t = $(this);
        $t.on('focusout change', function () {
            const $this = $(this);
            let val = $this.val().trim();
            val = val.replaceAll('_', '', val);
            if (val.length < 15) {
                $this.val('');
            }
        });
    });
};


export const numberInput = () => {
    const $doc = $(document);
    initTelMask();
    $doc.on('input', '.number-input:not([type="tel"])', function () {
        const $i = $(this);
        let value = $i.val().replace(/[^0-9.-]/g, '');
        if ((value.match(/\./g) || []).length > 1) {
            value = value.replace(/\.(?=[^.]*$)/, '');
        }
        if (value.indexOf('-') > 0) {
            value = value.replace('-', '');
        }
        if ($i.attr('name') === 'quantity[]') {
            let val = Number($i.val());
            val = isNaN(val) ? 1 : val;
            if (val < 1) {
                value = 1;
            }
        }
        $i.val(value);
    });

    $doc.on('click', '.plus', function (event) {
        event.preventDefault();
        let $t = $(this);
        let $wrapper = $t.closest('.form-quantity');
        let $i = $wrapper.find('.number-input');
        if ($i.length === 0) return;
        let val = Number($i.val());
        let max = $i.data('max');
        val = isNaN(val) ? 1 : val;
        if (max) {
            max = Number(max);
            if (!isNaN(max)) {
                $i.val(val < max ? (val + 1) : max);
                return;
            }
        }
        $i.val(val + 1);
    });

    $doc.on('click', '.minus', function (event) {
        event.preventDefault();
        let $t = $(this);
        let $wrapper = $t.closest('.form-quantity');
        let $i = $wrapper.find('.number-input');
        if ($i.length === 0) return;
        let val = Number($i.val());
        val = isNaN(val) ? 1 : val;
        $i.val(val > 2 ? (val - 1) : 1);
    });


}