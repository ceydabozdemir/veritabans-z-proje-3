document.addEventListener("DOMContentLoaded", function() {
    const citySelect = document.getElementById('citySelect');
    const ulasimSelect = document.getElementById('ulasim');
    const electricQuestion = document.getElementById('electricQuestion');
    const tarihInput = document.getElementById('tarih');
    const form = document.getElementById('visitorForm');

    // Tablo satırı oluşturma fonksiyonu
    function createTableRow(visitor) {
        const row = document.createElement('tr');
        Object.values(visitor).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        return row;
    }

    // Şehirler JSON dosyasını yükleme
    fetch('sehirler.json')
        .then(response => response.json())
        .then(cities => {
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Şehirler yüklenirken bir hata oluştu:', error));

    // Ulaşım araçları JSON dosyasını yükleme
    fetch('ulasim.json')
        .then(response => response.json())
        .then(transportation => {
            transportation.forEach(transport => {
                const option = document.createElement('option');
                option.value = transport;
                option.textContent = transport;
                ulasimSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Ulaşım araçları yüklenirken bir hata oluştu:', error));

    // Ulaşım aracı seçilince elektrikli araç sorusunu göster veya gizle
    ulasimSelect.addEventListener('change', function() {
        electricQuestion.style.display = ulasimSelect.value === 'Kara Yolu' ? 'block' : 'none';
    });

    // Geçerli tarihi ve saati atama
    function setCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        tarihInput.value = formattedDate;
    }

    setCurrentDateTime();

    // Formu gönderme işlevi
    function saveVisitorData(event) {
        event.preventDefault();

        const visitorData = {
            tarih: tarihInput.value,
            adSoyad: document.querySelector('input[placeholder="Adınızı ve soyadınızı girin"]').value,
            firmaBilgisi: document.querySelector('input[placeholder="Geldiğiniz firmayı girin"]').value,
            city: citySelect.value,
            ulasim: ulasimSelect.value,
            electricVehicle: document.getElementById('electricVehicle').value || ' ',
            ortalamaKm: document.getElementById('ortalamaKm').value
        };

        // Veriyi localStorage'a kaydet
        let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        visitors.push(visitorData);
        localStorage.setItem('visitors', JSON.stringify(visitors));

        // Tablo sayfasına yönlendir
        window.location.href = 'table.html';
    }

    if (form) {
        setCurrentDateTime(); // Set current date and time
        form.addEventListener('submit', saveVisitorData);
    }
});
