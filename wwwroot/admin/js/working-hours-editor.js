(function () {
    'use strict';

    var list = document.getElementById('working-hours-list');
    var addButton = document.getElementById('add-working-hour');

    if (!list || !addButton) {
        return;
    }

    function reindexRows() {
        var rows = list.querySelectorAll('.working-hour-row');
        rows.forEach(function (row, index) {
            row.dataset.index = String(index);
            row.querySelectorAll('[name^="WorkingHours["]').forEach(function (input) {
                input.name = input.name.replace(/WorkingHours\[\d+]/, 'WorkingHours[' + index + ']');
            });
        });
    }

    function createRowHtml(index) {
        return ''
            + '<div class="working-hour-row border rounded p-3 bg-light" data-index="' + index + '">'
            + '  <div class="row g-3 align-items-end">'
            + '    <div class="col-md-5">'
            + '      <label class="form-label">Gün</label>'
            + '      <input name="WorkingHours[' + index + '].Day" class="form-control" placeholder="Pazartesi – Cuma" />'
            + '    </div>'
            + '    <div class="col-md-4">'
            + '      <label class="form-label">Saatler</label>'
            + '      <input name="WorkingHours[' + index + '].Hours" class="form-control" placeholder="09:00 – 20:00" />'
            + '    </div>'
            + '    <div class="col-md-2">'
            + '      <label class="form-check form-switch mb-0">'
            + '        <input type="hidden" name="WorkingHours[' + index + '].IsActive" value="false" />'
            + '        <input class="form-check-input" type="checkbox" name="WorkingHours[' + index + '].IsActive" value="true" checked />'
            + '        <span class="form-check-label">Aktif</span>'
            + '      </label>'
            + '    </div>'
            + '    <div class="col-md-1 text-end">'
            + '      <button type="button" class="btn btn-icon btn-outline-danger remove-working-hour" title="Satırı sil">'
            + '        <i class="ti ti-trash"></i>'
            + '      </button>'
            + '    </div>'
            + '  </div>'
            + '</div>';
    }

    addButton.addEventListener('click', function () {
        var index = list.querySelectorAll('.working-hour-row').length;
        list.insertAdjacentHTML('beforeend', createRowHtml(index));
    });

    list.addEventListener('click', function (event) {
        var button = event.target.closest('.remove-working-hour');
        if (!button) {
            return;
        }

        var row = button.closest('.working-hour-row');
        if (!row) {
            return;
        }

        if (list.querySelectorAll('.working-hour-row').length <= 1) {
            row.querySelectorAll('input[type="text"]').forEach(function (input) { input.value = ''; });
            return;
        }

        row.remove();
        reindexRows();
    });
})();
