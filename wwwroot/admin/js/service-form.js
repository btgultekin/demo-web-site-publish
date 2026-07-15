(function () {
    'use strict';

    var MAX_FILE_SIZE = 10 * 1024 * 1024;
    var ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

    var titleInput = document.getElementById('service-title');
    var slugInput = document.getElementById('service-slug');
    var coverInput = document.querySelector('.service-cover-input');
    var galleryInput = document.querySelector('.service-gallery-input');
    var coverPreviewWrap = document.getElementById('service-cover-preview');
    var coverPreviewImage = document.getElementById('service-cover-preview-image');
    var galleryPreviewWrap = document.getElementById('service-gallery-new-preview');
    var galleryPreviewContent = document.getElementById('service-gallery-new-preview-content');
    var removedGalleryInputs = document.getElementById('service-removed-gallery-inputs');

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

    function getExtension(fileName) {
        var dotIndex = fileName.lastIndexOf('.');
        return dotIndex >= 0 ? fileName.substring(dotIndex).toLowerCase() : '';
    }

    function validateImageFile(file) {
        if (!file || file.length === 0) {
            return null;
        }

        if (file.size > MAX_FILE_SIZE) {
            return 'Dosya boyutu en fazla 10 MB olabilir.';
        }

        if (!ALLOWED_EXTENSIONS.includes(getExtension(file.name))) {
            return 'Yalnızca resim dosyaları yükleyebilirsiniz.';
        }

        return null;
    }

    if (titleInput && slugInput) {
        titleInput.addEventListener('input', function () {
            if (!slugInput.dataset.manualEdit) {
                slugInput.value = slugify(titleInput.value);
            }
        });

        slugInput.addEventListener('input', function () {
            slugInput.dataset.manualEdit = 'true';
        });
    }

    if (coverInput) {
        coverInput.addEventListener('change', function () {
            var file = coverInput.files && coverInput.files[0];
            if (!file) {
                return;
            }

            var error = validateImageFile(file);
            if (error) {
                coverInput.setCustomValidity(error);
                coverInput.reportValidity();
                coverInput.value = '';
                return;
            }

            coverInput.setCustomValidity('');
            if (coverPreviewWrap && coverPreviewImage) {
                coverPreviewImage.src = URL.createObjectURL(file);
                coverPreviewWrap.classList.remove('d-none');
            }
        });
    }

    if (galleryInput) {
        galleryInput.addEventListener('change', function () {
            if (!galleryPreviewWrap || !galleryPreviewContent) {
                return;
            }

            galleryPreviewContent.innerHTML = '';
            var files = Array.from(galleryInput.files || []);

            if (files.length === 0) {
                galleryPreviewWrap.classList.add('d-none');
                return;
            }

            for (var i = 0; i < files.length; i++) {
                var error = validateImageFile(files[i]);
                if (error) {
                    galleryInput.setCustomValidity(error);
                    galleryInput.reportValidity();
                    galleryInput.value = '';
                    galleryPreviewContent.innerHTML = '';
                    galleryPreviewWrap.classList.add('d-none');
                    return;
                }
            }

            galleryInput.setCustomValidity('');
            files.forEach(function (file) {
                var img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.className = 'rounded border';
                img.style.width = '120px';
                img.style.height = '80px';
                img.style.objectFit = 'cover';
                galleryPreviewContent.appendChild(img);
            });

            galleryPreviewWrap.classList.remove('d-none');
        });
    }

    document.querySelectorAll('.service-gallery-remove-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            var imageId = button.getAttribute('data-image-id');
            var item = button.closest('.service-gallery-item');
            item?.remove();

            if (removedGalleryInputs && imageId) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'RemovedGalleryImageIds';
                input.value = imageId;
                removedGalleryInputs.appendChild(input);
            }
        });
    });

    document.querySelector('.admin-loading-form')?.addEventListener('submit', function () {
        if (galleryInput) {
            galleryInput.setCustomValidity('');
        }

        if (window.hugerte) {
            hugerte.triggerSave();
        }
    });
})();
