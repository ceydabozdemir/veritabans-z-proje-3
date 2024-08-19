document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById('visitorTableBody');

    // Verileri localStorage'dan al ve tabloya ekle
    function displayVisitorData() {
        const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        visitors.forEach((visitor, index) => {
            const row = createTableRow(visitor, index);
            tableBody.appendChild(row);
        });
    }

    // Tablo satırı oluşturma fonksiyonu
    function createTableRow(visitor, index) {
        const row = document.createElement('tr');
        row.dataset.index = index; // Satıra bir index ekleyin

        Object.values(visitor).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Düzenleme, Kaydetme ve Silme butonlarını ekle
        const actionsCell = document.createElement('td');
        const editSaveButton = document.createElement('button');
        editSaveButton.textContent = 'Düzenle';
        editSaveButton.className = 'button-64 edit-save-button'; // CSS sınıfını ekleyin

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'İptal';
        deleteButton.className = 'button-64 delete-button';

        actionsCell.appendChild(editSaveButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        return row;
    }

    // Satırı düzenleme veya kaydetme işlevi
    function toggleEditSave(event) {
        const button = event.target;
        const row = button.closest('tr');
        const cells = row.getElementsByTagName('td');

        if (button.textContent === 'Düzenle') {
            // Düzenlemeyi etkinleştir
            for (const cell of cells) {
                if (cell.cellIndex < cells.length - 1) { // Son hücre (İşlemler) hariç
                    cell.contentEditable = 'true';
                    cell.classList.add('editable');
                }
            }

            // Butonu 'Kaydet' olarak değiştir
            button.textContent = 'Kaydet';
            button.classList.remove('edit-save-button');
            button.classList.add('save-button');
        } else {
            // Düzenlemeyi devre dışı bırak
            for (const cell of cells) {
                if (cell.cellIndex < cells.length - 1) { // Son hücre (İşlemler) hariç
                    cell.contentEditable = 'false';
                    cell.classList.remove('editable');
                }
            }

            // Butonu tekrar 'Düzenle' olarak değiştir
            button.textContent = 'Düzenle';
            button.classList.remove('save-button');
            button.classList.add('edit-save-button');

            // Veriyi localStorage'a kaydet
            saveTableData();
        }
    }

    // Satırı silme işlevi
    function deleteRow(event) {
        const row = event.target.closest('tr');
        if (row) {
            const index = row.dataset.index;
            row.remove();

            // Mevcut ziyaretçi verilerini localStorage'dan al
            let visitors = JSON.parse(localStorage.getItem('visitors')) || [];

            // Eşleşen veriyi bul ve kaldır
            visitors.splice(index, 1);

            // Güncellenmiş verileri localStorage'a kaydet
            localStorage.setItem('visitors', JSON.stringify(visitors));

            // Güncellenmiş verileri logla
            console.log('Güncellenmiş Ziyaretçi Verileri:', visitors);
        }
    }

    // Tablodaki tüm verileri localStorage'a kaydet
    function saveTableData() {
        const rows = tableBody.getElementsByTagName('tr');
        const visitors = Array.from(rows).map(row => {
            const cells = row.getElementsByTagName('td');
            const data = {
                tarih: cells[0].textContent.trim(),
                adSoyad: cells[1].textContent.trim(),
                firmaBilgisi: cells[2].textContent.trim(),
                city: cells[3].textContent.trim(),
                ulasim: cells[4].textContent.trim(),
                electricVehicle: cells[5].textContent.trim(),
                ortalamaKm: cells[6].textContent.trim()
            };
            return data;
        });

        localStorage.setItem('visitors', JSON.stringify(visitors));

        // Konsola kaydedilen veriyi yazdır
        console.log('Tablodaki veriler kaydedildi:', visitors);
    }

    // Sayfa yüklendiğinde verileri tabloya ekle
    displayVisitorData();

    // Olay dinleyicilerini ekle
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-save-button') || event.target.classList.contains('save-button')) {
            toggleEditSave(event);
        } else if (event.target.classList.contains('delete-button')) {
            deleteRow(event);
        }
    });
});
