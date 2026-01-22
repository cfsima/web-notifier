// ui.js
export function renderFeeds(feeds, removeFeedCallback) {
    const feedList = document.getElementById('feeds');
    feedList.innerHTML = ''; // Clear the list first

    if (feeds.length === 0) {
        feedList.innerHTML = '<li class="text-gray-500 italic">No feeds added yet.</li>';
        return;
    }

    feeds.forEach(feed => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded shadow mb-2 transition-colors duration-200';

        const feedText = document.createElement('span');
        feedText.textContent = feed;
        feedText.className = 'text-gray-700 dark:text-gray-200 truncate mr-4';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200';
        removeButton.ariaLabel = `Remove ${feed}`;
        removeButton.addEventListener('click', () => removeFeedCallback(feed));

        listItem.appendChild(feedText);
        listItem.appendChild(removeButton);
        feedList.appendChild(listItem);
    });
}

export function renderUpdates(updates) {
    const updateListContainer = document.getElementById('updateList');

    if (updates.length === 0) {
        updateListContainer.innerHTML = '<li class="text-gray-500 italic">No updates found.</li>';
        return;
    }

    const sortedUpdates = updates
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50); // Limit to 50 updates

    updateListContainer.innerHTML = sortedUpdates
        .map(update => {
            const date = new Date(update.pubDate).toLocaleString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            // Extract domain for source label if possible, or use truncated feed URL
            let source = update.feed;
            try {
                source = new URL(update.feed).hostname.replace('www.', '');
            } catch (e) { /* ignore */ }

            return `
            <li class="bg-white dark:bg-gray-800 p-4 rounded shadow border-l-4 ${update.unread ? 'border-blue-500' : 'border-transparent'} hover:shadow-md transition-shadow duration-200">
                <div class="flex flex-col">
                    <a href="${update.link}" target="_blank" class="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline mb-1">
                        ${update.title}
                    </a>
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                        <span class="font-semibold text-gray-600 dark:text-gray-300">${source}</span>
                        <span>&bull;</span>
                        <span>${date}</span>
                        ${update.unread ? '<span class="ml-auto text-xs font-bold text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">NEW</span>' : ''}
                    </div>
                </div>
            </li>
            `;
        }).join('');
}
