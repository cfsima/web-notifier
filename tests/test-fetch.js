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

        console.log('\n--- Test 2: Primary 404 -> Fallback (Current Behavior) ---');
        let fallbackCalled = false;
        global.fetch = async (url) => {
            if (url.includes('.netlify/functions/proxy')) {
                return { ok: false, status: 404, statusText: 'Not Found' };
            }
            if (url.includes('cors-anywhere')) {
                fallbackCalled = true;
                return {
                    ok: true,
                    status: 200,
                    text: async () => '<rss><channel><title>Fallback</title></channel></rss>'
                };
            }
            return { ok: false, status: 500 };
        };
        await fetchRSS('http://example.com/feed');
        if (!fallbackCalled) throw new Error('Fallback URL was not called on 404');
        console.log('✅ Passed');

        console.log('\n--- Test 3: Primary 500 -> Fallback (New Requirement) ---');
        fallbackCalled = false;
        global.fetch = async (url) => {
            if (url.includes('.netlify/functions/proxy')) {
                return { ok: false, status: 500, statusText: 'Server Error' };
            }
            if (url.includes('cors-anywhere')) {
                fallbackCalled = true;
                return {
                    ok: true,
                    status: 200,
                    text: async () => '<rss><channel><title>Fallback</title></channel></rss>'
                };
            }
            return { ok: false, status: 500 };
        };

        try {
            await fetchRSS('http://example.com/feed');
            if (!fallbackCalled) {
                 throw new Error('Fallback NOT called on 500');
            } else {
                 console.log('✅ Passed');
            }
        } catch (e) {
            console.error('❌ Failed:', e.message);
            passed = false;
        }

    } catch (e) {
        console.error('❌ Test Suite Failed:', e);
        passed = false;
    } finally {
        global.fetch = originalFetch;
    }
}

runTests();
