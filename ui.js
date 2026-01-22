// ui.js
export function renderFeeds(feeds, removeFeedCallback) {
    const feedList = document.getElementById('feeds');
    feedList.innerHTML = ''; // Clear the list first

    feeds.forEach(feed => {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center justify-between p-2 mb-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors';

        const feedText = document.createElement('span');
        feedText.textContent = feed;
        feedText.className = 'text-gray-700 dark:text-gray-300 truncate mr-2 flex-grow';

        const removeButton = document.createElement('button');
        // SVG Icon (X)
        removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
        removeButton.className = 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none p-1 rounded';
        removeButton.title = "Remove Feed";
        removeButton.ariaLabel = "Remove Feed";
        removeButton.addEventListener('click', () => removeFeedCallback(feed));

        listItem.appendChild(feedText);
        listItem.appendChild(removeButton);
        feedList.appendChild(listItem);
    });
}

export function renderUpdates(updates) {
    const updateList = updates
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50); // Limit to 50 updates

    document.getElementById('updateList').innerHTML = updateList
        .map(update => {
            const feedTitle = update.feedTitle || update.feed || 'Unknown Feed';
            // Use a shorter date format if possible, or just locale string
            const dateStr = new Date(update.pubDate).toLocaleString();
            const unreadBadge = update.unread ? `<span class="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2 align-middle">New</span>` : '';

            return `
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <h3 class="font-semibold text-lg text-blue-600 dark:text-blue-400 mb-2 leading-tight">
                    <a href="${update.link}" target="_blank" class="hover:underline">${update.title}</a>
                    ${unreadBadge}
                </h3>
                <div class="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap justify-between items-center mt-2">
                    <span class="font-medium text-gray-700 dark:text-gray-300 mr-2 truncate max-w-[70%]" title="${feedTitle}">
                        Source: ${feedTitle}
                    </span>
                    <span class="whitespace-nowrap">${dateStr}</span>
                </div>
            </div>
            `;
        }).join('');
}
