import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { parseRSS } from '../rss.js';

// Polyfill DOMParser
const dom = new JSDOM();
global.DOMParser = dom.window.DOMParser;

const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures');

function testStandardRSS() {
    console.log('Testing Standard RSS...');
    const xml = fs.readFileSync(path.join(fixturesDir, 'standard-rss.xml'), 'utf-8');
    const items = parseRSS(xml);

    if (items.length !== 1) throw new Error(`Expected 1 item, got ${items.length}`);
    if (items[0].title !== 'Example Item') throw new Error(`Expected title 'Example Item', got '${items[0].title}'`);
    if (items[0].link !== 'https://example.com/item/1') throw new Error(`Expected link 'https://example.com/item/1', got '${items[0].link}'`);
    if (!items[0].pubDate) throw new Error('Missing pubDate');
    console.log('✅ Standard RSS Passed');
}

function testRedditAtom() {
    console.log('Testing Reddit Atom...');
    const xml = fs.readFileSync(path.join(fixturesDir, 'reddit-atom.xml'), 'utf-8');
    const items = parseRSS(xml);

    if (items.length !== 1) throw new Error(`Expected 1 item, got ${items.length}`);
    if (items[0].title !== 'Test Thread Title') throw new Error(`Expected title 'Test Thread Title', got '${items[0].title}'`);

    const expectedLink = 'https://www.reddit.com/r/javascript/comments/12345/test_thread/';
    if (items[0].link !== expectedLink) throw new Error(`Expected link '${expectedLink}', got '${items[0].link}'`);

    console.log('✅ Reddit Atom Passed');
}

try {
    testStandardRSS();
    testRedditAtom();
} catch (e) {
    console.error('❌ Test Failed:', e);
    process.exit(1);
}
