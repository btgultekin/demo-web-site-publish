(function () {

    'use strict';



    var MAX_FILE_SIZE = 10 * 1024 * 1024;

    var ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

    var ALLOWED_MIME_PREFIXES = ['image/'];



    var input = document.querySelector('.testimonial-avatar-input');

    var previewWrap = document.getElementById('testimonial-avatar-preview');

    var previewContent = document.getElementById('testimonial-avatar-preview-content');



    if (!input) {

        return;

    }



    function getExtension(fileName) {

        var dotIndex = fileName.lastIndexOf('.');

        return dotIndex >= 0 ? fileName.substring(dotIndex).toLowerCase() : '';

    }



    function validateFile(file) {

        if (!file) {

            return null;

        }



        if (file.size === 0) {

            return 'Dosya boş olamaz.';

        }



        if (file.size > MAX_FILE_SIZE) {

            return 'Dosya boyutu en fazla 10 MB olabilir.';

        }



        var extension = getExtension(file.name);

        if (!ALLOWED_EXTENSIONS.includes(extension)) {

            return 'Yalnızca resim dosyaları yükleyebilirsiniz.';

        }



        if (file.type && !ALLOWED_MIME_PREFIXES.some(function (prefix) { return file.type.startsWith(prefix); })) {

            return 'Dosya türü desteklenmiyor.';

        }



        return null;

    }



    function clearPreview() {

        if (!previewWrap || !previewContent) {

            return;

        }



        previewContent.innerHTML = '';

        previewWrap.classList.add('d-none');

    }



    function showPreview(file) {

        if (!previewWrap || !previewContent) {

            return;

        }



        var objectUrl = URL.createObjectURL(file);

        previewContent.innerHTML =

            '<img src="' + objectUrl + '" alt="" class="rounded-circle border" style="width:80px;height:80px;object-fit:cover" />';

        previewWrap.classList.remove('d-none');

    }



    input.addEventListener('change', function () {

        clearPreview();



        var file = input.files && input.files[0];

        if (!file) {

            return;

        }



        var error = validateFile(file);

        if (error) {

            input.setCustomValidity(error);

            input.reportValidity();

            input.value = '';

            return;

        }



        input.setCustomValidity('');

        showPreview(file);

    });



    input.closest('form')?.addEventListener('submit', function (event) {

        var file = input.files && input.files[0];

        if (!file) {

            return;

        }



        var error = validateFile(file);

        if (error) {

            event.preventDefault();

            input.setCustomValidity(error);

            input.reportValidity();

        }

    });

})();

