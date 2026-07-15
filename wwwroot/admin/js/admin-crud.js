(function () {
    'use strict';

    const overlay = document.getElementById('adminLoadingOverlay');
    const confirmModalEl = document.getElementById('adminConfirmModal');
    const confirmForm = document.getElementById('adminConfirmForm');
    const confirmTitleEl = document.getElementById('adminConfirmModalTitle');
    const confirmMessageEl = document.getElementById('adminConfirmModalMessage');
    const confirmStatusEl = document.getElementById('adminConfirmModalStatus');
    const confirmIconEl = document.getElementById('adminConfirmModalIcon');
    const confirmSubmitBtn = document.getElementById('adminConfirmSubmitBtn');

    const variants = {
        danger: {
            statusClass: 'bg-danger',
            iconClass: 'ti ti-trash text-danger',
            buttonClass: 'btn-danger',
            defaultTitle: 'Kaydı Sil',
            defaultButtonText: 'Sil'
        },
        warning: {
            statusClass: 'bg-warning',
            iconClass: 'ti ti-alert-triangle text-warning',
            buttonClass: 'btn-warning',
            defaultTitle: 'İşlemi Onayla',
            defaultButtonText: 'Onayla'
        },
        primary: {
            statusClass: 'bg-primary',
            iconClass: 'ti ti-info-circle text-primary',
            buttonClass: 'btn-primary',
            defaultTitle: 'İşlemi Onayla',
            defaultButtonText: 'Onayla'
        }
    };

    function getBootstrapComponent(name) {
        if (window.tabler && window.tabler[name]) {
            return window.tabler[name];
        }

        if (window.tabler?.bootstrap && window.tabler.bootstrap[name]) {
            return window.tabler.bootstrap[name];
        }

        if (window.bootstrap && window.bootstrap[name]) {
            return window.bootstrap[name];
        }

        return null;
    }

    function showLoading() {
        overlay?.classList.remove('d-none');
    }

    function hideLoading() {
        overlay?.classList.add('d-none');
    }

    function openConfirmModal(config) {
        if (!confirmModalEl || !confirmForm || !config.url) {
            return;
        }

        const variant = variants[config.variant] || variants.warning;

        if (confirmTitleEl) {
            confirmTitleEl.textContent = config.title || variant.defaultTitle;
        }

        if (confirmMessageEl) {
            confirmMessageEl.innerHTML = config.message || '';
        }

        if (confirmStatusEl) {
            confirmStatusEl.className = 'modal-status ' + variant.statusClass;
        }

        if (confirmIconEl) {
            confirmIconEl.className = 'mb-3 ' + (config.iconClass || variant.iconClass);
        }

        if (confirmSubmitBtn) {
            confirmSubmitBtn.className = 'btn w-100 ' + (config.buttonClass || variant.buttonClass);
            confirmSubmitBtn.textContent = config.buttonText || variant.defaultButtonText;
        }

        confirmForm.setAttribute('action', config.url);

        const Modal = getBootstrapComponent('Modal');
        if (!Modal) {
            if (window.confirm(config.fallbackText || 'Bu işlemi onaylıyor musunuz?')) {
                confirmForm.submit();
            }
            return;
        }

        Modal.getOrCreateInstance(confirmModalEl).show();
    }

    function buildDeleteMessage(name) {
        return '<strong>' + escapeHtml(name) + '</strong> kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.';
    }

    function buildToggleMessage(name, isActive) {
        const action = isActive ? 'pasifleştirmek' : 'aktifleştirmek';
        return '<strong>' + escapeHtml(name) + '</strong> kaydını ' + action + ' istediğinize emin misiniz?';
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function canSubmitForm(form) {
        if (window.jQuery) {
            var $form = jQuery(form);
            if ($form.length && typeof $form.valid === 'function') {
                var validator = $form.data('validator');
                if (validator) {
                    return $form.valid();
                }
            }
        }

        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
            if (typeof form.reportValidity === 'function') {
                form.reportValidity();
            }

            return false;
        }

        return true;
    }

    document.querySelectorAll('.admin-loading-form').forEach(function (form) {
        form.addEventListener('submit', function () {
            if (!canSubmitForm(form)) {
                hideLoading();
                return;
            }

            showLoading();
        });
    });

    document.querySelectorAll('.admin-page-size-select').forEach(function (select) {
        select.addEventListener('change', function () {
            select.closest('form')?.submit();
        });
    });

    document.addEventListener('click', function (event) {
        const deleteButton = event.target.closest('.admin-delete-btn');
        if (deleteButton) {
            event.preventDefault();

            openConfirmModal({
                url: deleteButton.getAttribute('data-delete-url') || deleteButton.getAttribute('data-confirm-url'),
                title: deleteButton.getAttribute('data-confirm-title') || 'Kaydı Sil',
                message: deleteButton.getAttribute('data-confirm-message')
                    || buildDeleteMessage(deleteButton.getAttribute('data-name') || 'Bu'),
                variant: 'danger',
                buttonText: deleteButton.getAttribute('data-confirm-button-text') || 'Sil',
                fallbackText: 'Bu kaydı silmek istediğinize emin misiniz?'
            });
            return;
        }

        const confirmButton = event.target.closest('.admin-confirm-btn');
        if (confirmButton) {
            event.preventDefault();

            openConfirmModal({
                url: confirmButton.getAttribute('data-confirm-url'),
                title: confirmButton.getAttribute('data-confirm-title'),
                message: confirmButton.getAttribute('data-confirm-message'),
                variant: confirmButton.getAttribute('data-confirm-variant') || 'warning',
                buttonText: confirmButton.getAttribute('data-confirm-button-text'),
                iconClass: confirmButton.getAttribute('data-confirm-icon-class'),
                buttonClass: confirmButton.getAttribute('data-confirm-button-class'),
                fallbackText: confirmButton.getAttribute('data-confirm-fallback') || 'Bu işlemi onaylıyor musunuz?'
            });
            return;
        }

        const toggleButton = event.target.closest('.admin-toggle-active-btn');
        if (toggleButton) {
            event.preventDefault();

            const isActive = toggleButton.getAttribute('data-is-active') === 'true';
            const name = toggleButton.getAttribute('data-name') || 'Bu';

            openConfirmModal({
                url: toggleButton.getAttribute('data-confirm-url'),
                title: isActive ? 'Pasifleştir' : 'Aktifleştir',
                message: buildToggleMessage(name, isActive),
                variant: 'warning',
                buttonText: isActive ? 'Pasifleştir' : 'Aktifleştir',
                iconClass: isActive ? 'ti ti-eye-off text-warning' : 'ti ti-eye text-warning',
                fallbackText: isActive
                    ? 'Bu kaydı pasifleştirmek istediğinize emin misiniz?'
                    : 'Bu kaydı aktifleştirmek istediğinize emin misiniz?'
            });
        }
    });

    document.querySelectorAll('.admin-toast').forEach(function (toastEl) {
        const Toast = getBootstrapComponent('Toast');
        Toast?.getOrCreateInstance(toastEl)?.show();
    });

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            hideLoading();
        }
    });

    document.addEventListener('DOMContentLoaded', hideLoading);
})();
