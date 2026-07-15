(function () {

    'use strict';



    var MAX_FILE_SIZE = 50 * 1024 * 1024;

    var ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.mp4', '.webm', '.mov', '.ogg'];

    var ALLOWED_MIME_PREFIXES = ['image/', 'video/'];



    var input = document.querySelector('.gallery-media-input');

    var dropzone = document.getElementById('gallery-dropzone');

    var previewList = document.getElementById('gallery-media-preview-list');

    var isMultiple = input && input.hasAttribute('multiple');

    var objectUrls = [];



    if (!input) {

        return;

    }



    function getExtension(fileName) {

        var dotIndex = fileName.lastIndexOf('.');

        return dotIndex >= 0 ? fileName.substring(dotIndex).toLowerCase() : '';

    }



    function isVideoFile(file) {

        return file.type.startsWith('video/') || ['.mp4', '.webm', '.mov', '.ogg'].includes(getExtension(file.name));

    }



    function validateFile(file) {

        if (!file) {

            return null;

        }



        if (file.size === 0) {

            return 'Dosya boş olamaz.';

        }



        if (file.size > MAX_FILE_SIZE) {

            return 'Dosya boyutu en fazla 50 MB olabilir.';

        }



        var extension = getExtension(file.name);

        if (!ALLOWED_EXTENSIONS.includes(extension)) {

            return 'Yalnızca resim veya video dosyaları yükleyebilirsiniz.';

        }



        if (file.type && !ALLOWED_MIME_PREFIXES.some(function (prefix) { return file.type.startsWith(prefix); })) {

            return 'Dosya türü desteklenmiyor.';

        }



        return null;

    }



    function revokeObjectUrls() {

        objectUrls.forEach(function (url) { URL.revokeObjectURL(url); });

        objectUrls = [];

    }



    function clearPreview() {

        if (!previewList) {

            return;

        }



        revokeObjectUrls();

        previewList.innerHTML = '';

    }



    function buildPreviewItem(file) {

        var objectUrl = URL.createObjectURL(file);

        objectUrls.push(objectUrl);



        var wrapper = document.createElement('div');

        wrapper.className = 'gallery-preview-item position-relative';



        if (isVideoFile(file)) {

            wrapper.innerHTML =

                '<video src="' + objectUrl + '" class="rounded border" style="width:120px;height:80px;object-fit:cover" muted playsinline></video>' +

                '<span class="badge bg-dark position-absolute top-0 end-0 m-1">Video</span>';

        } else {

            wrapper.innerHTML =

                '<img src="' + objectUrl + '" alt="" class="rounded border" style="width:120px;height:80px;object-fit:cover" />';

        }



        return wrapper;

    }



    function showPreviews(files) {

        if (!previewList) {

            return;

        }



        clearPreview();



        Array.prototype.forEach.call(files, function (file) {

            previewList.appendChild(buildPreviewItem(file));

        });

    }



    function assignFiles(files) {

        if (!files || files.length === 0) {

            input.value = '';

            clearPreview();

            return;

        }



        var dataTransfer = new DataTransfer();

        Array.prototype.forEach.call(files, function (file) {

            var error = validateFile(file);

            if (!error) {

                dataTransfer.items.add(file);

            }

        });



        if (dataTransfer.files.length === 0) {

            input.setCustomValidity('Geçerli bir görsel veya video seçmelisiniz.');

            input.reportValidity();

            return;

        }



        if (!isMultiple && dataTransfer.files.length > 1) {

            var single = new DataTransfer();

            single.items.add(dataTransfer.files[0]);

            input.files = single.files;

        } else {

            input.files = dataTransfer.files;

        }



        input.setCustomValidity('');

        showPreviews(input.files);

    }



    function handleSelectedFiles(fileList) {

        if (!fileList || fileList.length === 0) {

            return;

        }



        for (var i = 0; i < fileList.length; i++) {

            var error = validateFile(fileList[i]);

            if (error) {

                input.setCustomValidity(error);

                input.reportValidity();

                return;

            }

        }



        assignFiles(fileList);

    }



    input.addEventListener('change', function () {

        handleSelectedFiles(input.files);

    });



    if (dropzone) {

        dropzone.addEventListener('click', function () {

            input.click();

        });



        dropzone.addEventListener('keydown', function (event) {

            if (event.key === 'Enter' || event.key === ' ') {

                event.preventDefault();

                input.click();

            }

        });



        ['dragenter', 'dragover'].forEach(function (eventName) {

            dropzone.addEventListener(eventName, function (event) {

                event.preventDefault();

                event.stopPropagation();

                dropzone.classList.add('border-primary', 'bg-light');

            });

        });



        ['dragleave', 'drop'].forEach(function (eventName) {

            dropzone.addEventListener(eventName, function (event) {

                event.preventDefault();

                event.stopPropagation();

                dropzone.classList.remove('border-primary', 'bg-light');

            });

        });



        dropzone.addEventListener('drop', function (event) {

            var files = event.dataTransfer && event.dataTransfer.files;

            handleSelectedFiles(files);

        });

    }



    input.closest('form')?.addEventListener('submit', function (event) {

        var files = input.files;

        if (!files || files.length === 0) {

            return;

        }



        for (var i = 0; i < files.length; i++) {

            var error = validateFile(files[i]);

            if (error) {

                event.preventDefault();

                input.setCustomValidity(error);

                input.reportValidity();

                return;

            }

        }

    });

})();

