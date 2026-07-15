(function () {
    'use strict';

    document.querySelectorAll('.site-media-field').forEach(function (field) {
        var removeCheckbox = field.querySelector('.site-media-remove');
        var preview = field.querySelector('.site-media-preview');
        var fileInput = field.querySelector('input[type="file"]');

        if (!removeCheckbox || !preview) {
            return;
        }

        function syncRemoveState() {
            var isRemoved = removeCheckbox.checked;
            preview.classList.toggle('opacity-50', isRemoved);

            if (fileInput) {
                fileInput.disabled = isRemoved;
            }
        }

        removeCheckbox.addEventListener('change', syncRemoveState);
        syncRemoveState();

        if (fileInput) {
            fileInput.addEventListener('change', function () {
                if (fileInput.files && fileInput.files.length > 0) {
                    removeCheckbox.checked = false;
                    syncRemoveState();
                }
            });
        }
    });
})();
