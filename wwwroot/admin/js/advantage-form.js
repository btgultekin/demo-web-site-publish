(function () {
    'use strict';

    var iconInput = document.getElementById('Icon');
    var previewIcon = document.getElementById('advantage-icon-preview-icon');
    var modalEl = document.getElementById('advantageIconModal');

    if (!iconInput || !previewIcon) {
        return;
    }

    function setIcon(iconKey) {
        iconInput.value = iconKey;
        previewIcon.className = 'ti ti-' + iconKey + ' fs-2 text-primary';

        document.querySelectorAll('.advantage-icon-option').forEach(function (button) {
            button.classList.toggle('active', button.getAttribute('data-icon') === iconKey);
        });
    }

    document.querySelectorAll('.advantage-icon-option').forEach(function (button) {
        button.addEventListener('click', function () {
            var iconKey = button.getAttribute('data-icon');
            if (!iconKey) {
                return;
            }

            setIcon(iconKey);

            if (modalEl && window.bootstrap && window.bootstrap.Modal) {
                window.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
            } else if (modalEl && window.tabler && window.tabler.bootstrap && window.tabler.bootstrap.Modal) {
                window.tabler.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
            }
        });
    });

    if (iconInput.value) {
        setIcon(iconInput.value);
    }
})();
