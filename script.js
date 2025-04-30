const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const artistInput = document.getElementById('artist');
const songInput = document.getElementById('song');
const resultDiv = document.getElementById('result');
const lyricsDiv = document.getElementById('lyrics');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const errorMessage = document.querySelector('.error-message');
const loadingSpinner = document.querySelector('.loading-spinner');
const recentList = document.getElementById('recent-list');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Load recent searches
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
});

function getLyrics() {
    const artist = artistInput.value.trim();
    const song = songInput.value.trim();

    if (!artist || !song) {
        showError('Please enter both artist and song name.');
        return;
    }

    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
    
    showLoading(true);
    hideResult();
    hideError();

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Lyrics not found.');
            return res.json();
        })
        .then(data => {
            if (data.lyrics) {
                showLyrics(artist, song, data.lyrics);
                addToRecentSearches(artist, song);
            } else {
                throw new Error('Lyrics not found.');
            }
        })
        .catch(() => {
            showError('Lyrics not found. Please try again.');
        })
        .finally(() => {
            showLoading(false);
        });
}

function showLyrics(artist, title, lyrics) {
    songTitle.textContent = title;
    artistName.textContent = `by ${artist}`;
    lyricsDiv.textContent = lyrics;
    resultDiv.classList.add('active');
}

function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'flex';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoading(state) {
    loadingSpinner.style.display = state ? 'block' : 'none';
}

function hideResult() {
    resultDiv.classList.remove('active');
}

function addToRecentSearches(artist, song) {
    const search = `${artist} - ${song}`;
    let recent = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // Add new and remove duplicates
    recent = [search, ...recent.filter(item => item !== search)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    renderRecentSearches();
}

function loadRecentSearches() {
    renderRecentSearches();
}

function renderRecentSearches() {
    const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentList.innerHTML = '';
    recent.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.textContent = item;
        div.addEventListener('click', () => {
            const [artist, song] = item.split(' - ');
            artistInput.value = artist;
            songInput.value = song;
            getLyrics();
        });
        recentList.appendChild(div);
    });
}
