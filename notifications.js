// notifications.js
export function showNotification() {
    const notification = document.getElementById('notification');

    // Show
    notification.classList.remove('opacity-0', 'pointer-events-none');
    notification.classList.add('opacity-100', 'pointer-events-auto');

    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('opacity-100', 'pointer-events-auto');
        notification.classList.add('opacity-0', 'pointer-events-none');
    }, 5000);
}

export function updateTabTitle(updates, originalTitle) {
    const unreadCount = updates.filter(update => update.unread).length;
    document.title = unreadCount > 0 ? `(${unreadCount}) ${originalTitle}` : originalTitle;
}
