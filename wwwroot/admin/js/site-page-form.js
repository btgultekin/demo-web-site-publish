(function () {
    'use strict';

    var titleInput = document.getElementById('site-page-title');
    var slugInput = document.getElementById('site-page-slug');

    function slugify(value) {
        return value
            .toLowerCase()
            .replace(/ç/g, 'c')
            .replace(/ğ/g, 'g')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ş/g, 's')
            .replace(/ü/g, 'u')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    if (titleInput && slugInput) {
        titleInput.addEventListener('input', function () {
            if (!slugInput.dataset.manualEdit) {
                slugInput.value = slugify(titleInput.value);
                slugInput.dispatchEvent(new Event('input'));
            }
        });

        slugInput.addEventListener('input', function () {
            slugInput.dataset.manualEdit = 'true';
            var previewCard = document.getElementById('seo-preview-card');
            if (previewCard) {
                previewCard.dataset.defaultUrl = '/' + slugify(slugInput.value);
            }
            document.dispatchEvent(new CustomEvent('seo-preview:refresh'));
        });
    }
})();
