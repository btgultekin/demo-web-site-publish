(function () {
    'use strict';

    var titleInput = document.getElementById('seo-title');
    var descriptionInput = document.getElementById('seo-description');
    var pageTitleInput = document.getElementById('site-page-title');
    var previewCard = document.getElementById('seo-preview-card');
    var previewHeading = document.getElementById('seo-preview-heading');
    var previewSnippet = document.getElementById('seo-preview-snippet');
    var previewUrl = document.getElementById('seo-preview-url');
    var previewSite = document.getElementById('seo-preview-site');

    var maxTitleLength = 60;
    var maxDescriptionLength = 160;

    function truncate(value, maxLength) {
        if (!value) {
            return '';
        }

        if (value.length <= maxLength) {
            return value;
        }

        return value.substring(0, maxLength - 1).trim() + '…';
    }

    function getPagePath() {
        if (!previewCard) {
            return '/';
        }

        return previewCard.dataset.defaultUrl || '/';
    }

    function refreshPreview() {
        if (!previewHeading || !previewSnippet || !previewUrl) {
            return;
        }

        var seoTitle = titleInput ? titleInput.value.trim() : '';
        var fallbackTitle = pageTitleInput ? pageTitleInput.value.trim() : '';
        var description = descriptionInput ? descriptionInput.value.trim() : '';

        previewHeading.textContent = truncate(seoTitle || fallbackTitle || 'Sayfa Başlığı', maxTitleLength);
        previewSnippet.textContent = truncate(
            description || 'Sayfa açıklaması burada görünecek.',
            maxDescriptionLength
        );

        var origin = window.location.origin;
        previewSite.textContent = origin;
        previewUrl.textContent = origin + getPagePath();
    }

    [titleInput, descriptionInput, pageTitleInput].forEach(function (input) {
        if (input) {
            input.addEventListener('input', refreshPreview);
        }
    });

    document.addEventListener('seo-preview:refresh', refreshPreview);

    refreshPreview();
})();
