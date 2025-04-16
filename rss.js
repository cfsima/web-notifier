// rss.js
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export async function fetchRSS(url) {
    try {
        const response = await fetch(`${CORS_PROXY}${url}`);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.querySelectorAll('item');
        return Array.from(items).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            link: item.querySelector('link')?.textContent || '#',
            pubDate: item.querySelector('pubDate')?.textContent || 'No date',
        }));
    } catch (error) {
        console.error('Error fetching RSS:', error);
        return [];
    }
}