(function () {
    'use strict';

    var pageSelect = document.getElementById('nav-site-page-select');
    var slugInput = document.getElementById('nav-page-slug');
    var urlInput = document.getElementById('nav-page-url');

    function updateFromSelection() {
        if (!pageSelect) {
            return;
        }

        var option = pageSelect.options[pageSelect.selectedIndex];
        if (!option || !option.value) {
            if (slugInput) {
                slugInput.value = '';
            }
            if (urlInput) {
                urlInput.value = '';
            }
            return;
        }

        if (slugInput) {
            slugInput.value = option.dataset.slug || '';
        }

        if (urlInput) {
            urlInput.value = option.dataset.url || '';
        }
    }

    if (pageSelect) {
        pageSelect.addEventListener('change', updateFromSelection);
        updateFromSelection();
    }
})();
