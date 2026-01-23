import { JSDOM } from 'jsdom';
import { renderUpdates, renderFeeds } from '../ui.js';

// Setup JSDOM
const dom = new JSDOM(`<!DOCTYPE html><body><ul id="feeds"></ul><ul id="updateList"></ul></body>`);
global.document = dom.window.document;
global.window = dom.window;

// Test renderUpdates
function testRenderUpdates() {
    console.log('Testing renderUpdates...');
    const updates = [
        {
            title: 'Test Update',
            link: 'http://example.com',
            feed: 'http://example.com/rss',
            feedTitle: 'Example Site',
            pubDate: new Date().toISOString(),
            unread: true,
            timestamp: new Date().toISOString()
        }
    ];

    renderUpdates(updates);

    const updateList = document.getElementById('updateList');
    const html = updateList.innerHTML;

    // Check for card classes
    if (!html.includes('bg-white')) throw new Error('Missing card background class bg-white');
    if (!html.includes('dark:bg-gray-800')) throw new Error('Missing dark mode background class');
    if (!html.includes('Example Site')) throw new Error('Missing feed title attribution');
    if (!html.includes('Source: Example Site')) throw new Error('Missing Source label');

    console.log('✅ renderUpdates Passed');
}

// Test renderFeeds
function testRenderFeeds() {
    console.log('Testing renderFeeds...');
    const feeds = ['http://example.com/rss'];
    let removedFeed = null;
    const removeCallback = (f) => { removedFeed = f; };

    renderFeeds(feeds, removeCallback);

    const feedList = document.getElementById('feeds');
    const html = feedList.innerHTML;

    // Check for icon button (SVG)
    if (!html.includes('<svg')) throw new Error('Missing SVG icon in remove button');
    if (html.includes('Remove</button>')) throw new Error('Found text "Remove" in button, expected icon only');

    // Test click
    const btn = feedList.querySelector('button');
    btn.click();
    if (removedFeed !== 'http://example.com/rss') throw new Error('Remove callback failed');

    console.log('✅ renderFeeds Passed');
}

try {
    testRenderUpdates();
    testRenderFeeds();
} catch (e) {
    console.error('❌ UI Test Failed:', e);
    process.exit(1);
}
