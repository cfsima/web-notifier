import { JSDOM } from 'jsdom';
import { fetchRSS } from '../rss.js';

// Polyfill DOMParser for parseRSS
const dom = new JSDOM();
global.DOMParser = dom.window.DOMParser;

// Mock Fetch
const originalFetch = global.fetch;

// Helper to reset fetch before each test
function mockFetch(responses) {
    let callCount = 0;
    global.fetch = async (url) => {
        const responseData = responses[callCount] || responses[responses.length - 1];
        callCount++;

        console.log(`Fetch requested: ${url}`);

        return {
            ok: responseData.ok,
            status: responseData.status,
            statusText: responseData.statusText || 'Status',
            text: async () => responseData.text || '<rss></rss>'
        };
    };
}

async function runTests() {
    let passed = true;

    try {
        console.log('--- Test 1: Primary Proxy 200 OK ---');
        mockFetch([{ ok: true, status: 200, text: '<rss><channel><title>Success</title></channel></rss>' }]);
        await fetchRSS('http://example.com/feed');
        console.log('✅ Passed');

        console.log('\n--- Test 2: Primary 404 -> Community (Success) ---');
        let communityCalled = false;
        global.fetch = async (url) => {
            if (url.includes('.netlify/functions/proxy')) {
                return { ok: false, status: 404, statusText: 'Not Found' };
            }
            if (url.includes('cors-anywhere.com') && !url.includes('herokuapp')) {
                communityCalled = true;
                return {
                    ok: true,
                    status: 200,
                    text: async () => '<rss><channel><title>Community</title></channel></rss>'
                };
            }
             if (url.includes('cors-anywhere.herokuapp.com')) {
                throw new Error('Should not have reached Heroku proxy');
            }
            return { ok: false, status: 500 };
        };
        await fetchRSS('http://example.com/feed');
        if (!communityCalled) throw new Error('Community proxy was not called on 404');
        console.log('✅ Passed');

        console.log('\n--- Test 3: Primary 500 -> Community 500 -> Heroku (Success) ---');
        let herokuCalled = false;
        let communityCalledBeforeHeroku = false;
        global.fetch = async (url) => {
            if (url.includes('.netlify/functions/proxy')) {
                return { ok: false, status: 500, statusText: 'Server Error' };
            }
            if (url.includes('cors-anywhere.com') && !url.includes('herokuapp')) {
                communityCalledBeforeHeroku = true;
                return { ok: false, status: 500, statusText: 'Community Error' };
            }
            if (url.includes('cors-anywhere.herokuapp.com')) {
                if (!communityCalledBeforeHeroku) throw new Error('Skipped community proxy!');
                herokuCalled = true;
                return {
                    ok: true,
                    status: 200,
                    text: async () => '<rss><channel><title>Heroku</title></channel></rss>'
                };
            }
            return { ok: false, status: 500 };
        };

        await fetchRSS('http://example.com/feed');
        if (!herokuCalled) {
             throw new Error('Heroku proxy NOT called after both failures');
        }
        console.log('✅ Passed');

    } catch (e) {
        console.error('❌ Test Suite Failed:', e);
        passed = false;
        process.exit(1);
    } finally {
        global.fetch = originalFetch;
    }

    if (!passed) process.exit(1);
}

runTests();
