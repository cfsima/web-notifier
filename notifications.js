// notifications.js
export function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 5000);
}

export function updateTabTitle(updates, originalTitle) {
    const unreadCount = updates.filter(update => update.unread).length;
    document.title = unreadCount > 0 ? `(${unreadCount}) ${originalTitle}` : originalTitle;
}