// app.js
import { getFeeds, saveFeeds, getUpdates, saveUpdates } from './storage.js';
import { fetchRSS } from './rss.js';
import { renderFeeds, renderUpdates } from './ui.js';
import { showNotification, updateTabTitle } from './notifications.js';

const CHECK_INTERVAL = 300000; // Check every 5 minutes
const ORIGINAL_TITLE = 'RSS Update Notifier';

let feeds = getFeeds();
let updates = getUpdates();

function addFeed() {
    const rssUrl = document.getElementById('rssUrl').value.trim();
    if (!rssUrl) return alert('Please enter a valid RSS URL');

    if (!feeds.includes(rssUrl)) {
        feeds.push(rssUrl);
        saveFeeds(feeds);
        renderFeeds(feeds, removeFeed);
        checkForUpdates();
        document.getElementById('rssUrl').value = '';
    } else {
        alert('This feed is already added');
    }
}

function removeFeed(feed) {
    feeds = feeds.filter(f => f !== feed);
    saveFeeds(feeds);
    renderFeeds(feeds, removeFeed);
}

async function checkForUpdates() {
    let newUpdates = false;
    for (const feed of feeds) {
        const items = await fetchRSS(feed);
        items.forEach(item => {
            if (!updates.some(u => u.link === item.link && u.feed === feed)) {
                updates.push({ ...item, feed, timestamp: new Date().toISOString(), unread: true });
                newUpdates = true;
            }
        });
    }
    if (newUpdates) {
        saveUpdates(updates);
        renderUpdates(updates);
        updateTabTitle(updates, ORIGINAL_TITLE);
        showNotification();
    }
}

function markUpdatesAsRead() {
    updates.forEach(update => update.unread = false);
    saveUpdates(updates);
    renderUpdates(updates);
    updateTabTitle(updates, ORIGINAL_TITLE);
}

window.onload = () => {
    renderFeeds(feeds, removeFeed);
    renderUpdates(updates);
    updateTabTitle(updates, ORIGINAL_TITLE);
    checkForUpdates();
    setInterval(checkForUpdates, CHECK_INTERVAL);
    window.addEventListener('focus', markUpdatesAsRead);
};

window.addFeed = addFeed; // Expose to global scope for button onclick