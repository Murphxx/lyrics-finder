// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    // Save theme preference
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

// Load saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

// Recent searches functionality
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
const recentList = document.getElementById('recent-list');

function updateRecentSearches(artist, song) {
    const search = `${artist} - ${song}`;
    if (!recentSearches.includes(search)) {
        recentSearches.unshift(search);
        recentSearches = recentSearches.slice(0, 5); // Keep only last 5 searches
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        displayRecentSearches();
    }
}

function displayRecentSearches() {
    recentList.innerHTML = '';
    recentSearches.forEach(search => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.textContent = search;
        item.addEventListener('click', () => {
            const [artist, song] = search.split(' - ');
            document.getElementById('artist').value = artist;
            document.getElementById('song').value = song;
            getLyrics();
        });
        recentList.appendChild(item);
    });
}

// Display initial recent searches
displayRecentSearches();

// Loading and error handling
const loadingSpinner = document.querySelector('.loading-spinner');
const errorMessage = document.querySelector('.error-message');
const result = document.getElementById('result');

function showLoading() {
    loadingSpinner.style.display = 'block';
    result.style.display = 'none';
    errorMessage.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError() {
    errorMessage.style.display = 'flex';
    result.style.display = 'none';
}

function showResult() {
    result.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Main lyrics fetching function
async function getLyrics() {
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();
    
    if (!artist || !song) {
        showError();
        return;
    }

    showLoading();
    
    try {
        // Replace this with your actual API call
        const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
        const data = await response.json();
        
        if (data.lyrics) {
            document.getElementById('song-title').textContent = song;
            document.getElementById('artist-name').textContent = artist;
            document.getElementById('lyrics').textContent = data.lyrics;
            showResult();
            updateRecentSearches(artist, song);
        } else {
            showError();
        }
    } catch (error) {
        showError();
    } finally {
        hideLoading();
    }
} 