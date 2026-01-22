// notifications.js
export function showNotification() {
    const notification = document.getElementById('notification');
    // Remove hidden class if it exists (for compatibility with old structure) or rely on opacity/transform
    notification.classList.remove('hidden');

    // Animate in
    notification.classList.remove('translate-y-20', 'opacity-0');

    setTimeout(() => {
        // Animate out
        notification.classList.add('translate-y-20', 'opacity-0');
    }, 5000);
}

export function updateTabTitle(updates, originalTitle) {
    const unreadCount = updates.filter(update => update.unread).length;
    document.title = unreadCount > 0 ? `(${unreadCount}) ${originalTitle}` : originalTitle;
}