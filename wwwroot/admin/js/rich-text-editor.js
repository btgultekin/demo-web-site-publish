(function () {
    'use strict';

    if (!window.hugerte) {
        return;
    }

    document.querySelectorAll('.admin-rich-text').forEach(function (textarea) {
        if (textarea.dataset.editorInitialized === 'true') {
            return;
        }

        textarea.dataset.editorInitialized = 'true';

        hugerte.init({
            target: textarea,
            height: 360,
            menubar: false,
            plugins: 'lists link image table code',
            toolbar: 'undo redo | styles | bold italic underline | bullist numlist | link image table | removeformat code',
            branding: false,
            promotion: false,
            language: 'tr',
            content_style: 'body { font-family: Inter, system-ui, sans-serif; font-size: 14px; }'
        });
    });
})();
