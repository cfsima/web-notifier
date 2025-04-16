// storage.js
export const getFeeds = () => JSON.parse(localStorage.getItem('feeds')) || [];
export const saveFeeds = (feeds) => localStorage.setItem('feeds', JSON.stringify(feeds));

export const getUpdates = () => JSON.parse(localStorage.getItem('updates')) || [];
export const saveUpdates = (updates) => localStorage.setItem('updates', JSON.stringify(updates));