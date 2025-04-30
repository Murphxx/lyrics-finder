async function getLyrics() {
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();
    const resultDiv = document.getElementById('result');
    const lyricsDiv = document.getElementById('lyrics');

    if (!artist || !song) {
        alert('Lütfen sanatçı ve şarkı adını giriniz!');
        return;
    }

    try {
        lyricsDiv.textContent = 'Yükleniyor...';
        resultDiv.classList.add('active');

        // URL'deki özel karakterleri ve boşlukları düzenleme
        const encodedArtist = encodeURIComponent(artist);
        const encodedSong = encodeURIComponent(song);

        const response = await fetch(`https://api.lyrics.ovh/v1/${encodedArtist}/${encodedSong}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.lyrics) {
            lyricsDiv.textContent = data.lyrics;
        } else {
            lyricsDiv.textContent = 'Şarkı sözleri bulunamadı. Lütfen sanatçı ve şarkı adını kontrol ediniz.';
        }
    } catch (error) {
        console.error('Hata:', error);
        lyricsDiv.textContent = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.';
    }
}

async function showAvailableSongs(artist, lyricsDiv) {
    try {
        const encodedArtist = encodeURIComponent(artist);
        const response = await fetch(`https://api.lyrics.ovh/suggest/${encodedArtist}`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            let html = `
                <p>Bu şarkı için sözler bulunamadı. İşte ${artist} için mevcut olan bazı şarkılar:</p>
                <ul style="margin-top: 10px; margin-left: 20px;">
            `;
            
            data.data.slice(0, 10).forEach(song => {
                html += `<li>${song.title}</li>`;
            });
            
            html += `</ul>
                <p style="margin-top: 10px;">Not: Bu liste sınırlıdır ve tüm şarkıları içermeyebilir.</p>`;
            
            lyricsDiv.innerHTML = html;
        } else {
            lyricsDiv.innerHTML = `
                <p>Bu sanatçı için şarkı bulunamadı. Bunun nedenleri:</p>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li>Sanatçı adı yanlış yazılmış olabilir</li>
                    <li>Sanatçı veritabanımızda bulunmuyor olabilir</li>
                    <li>Sanatçı adı farklı bir dilde yazılmış olabilir</li>
                </ul>
            `;
        }
    } catch (error) {
        console.error('Hata:', error);
        lyricsDiv.innerHTML = `
            <p>Şarkı listesi alınırken bir hata oluştu.</p>
            <p style="margin-top: 10px;">Hata detayı: ${error.message}</p>
        `;
    }
} 