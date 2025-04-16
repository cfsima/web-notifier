// ui.js
export function renderFeeds(feeds, removeFeedCallback) {
    const feedList = document.getElementById('feeds');
    feedList.innerHTML = feeds.map(feed =>
        `<li>${feed} <button onclick="(${removeFeedCallback})('${feed}')" class="text-red-500">Remove</button></li>`
    ).join('');
}

export function renderUpdates(updates) {
    const updateList = updates
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50); // Limit to 50 updates
    document.getElementById('updateList').innerHTML = updateList
        .map(update =>
            `<li><a href="${update.link}" target="_blank" class="text-blue-500">${update.title}</a> from ${update.feed} (${new Date(update.pubDate).toLocaleString()})${update.unread ? ' <span class="text-red-500">[New]</span>' : ''}</li>`
        ).join('');
}