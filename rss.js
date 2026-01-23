// rss.js
const PROXY_URL = '/.netlify/functions/proxy?url=';
const FALLBACK_PROXY = 'https://cors-anywhere.herokuapp.com/';

export function parseRSS(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');

    let siteTitle = 'Unknown Feed';
    const channelTitle = xml.querySelector('channel > title');
    const feedTitle = xml.querySelector('feed > title');

    if (channelTitle) {
        siteTitle = channelTitle.textContent;
    } else if (feedTitle) {
        siteTitle = feedTitle.textContent;
    }

    // Try RSS 2.0
    const items = xml.querySelectorAll('item');
    if (items.length > 0) {
        return {
            siteTitle,
            items: Array.from(items).map(item => ({
                title: item.querySelector('title')?.textContent || 'No title',
                link: item.querySelector('link')?.textContent || '#',
                pubDate: item.querySelector('pubDate')?.textContent || 'No date',
            }))
        };
    }

    // Try Atom 1.0 (Reddit uses this)
    const entries = xml.querySelectorAll('entry');
    if (entries.length > 0) {
        return {
            siteTitle,
            items: Array.from(entries).map(entry => {
                const title = entry.querySelector('title')?.textContent || 'No title';
                const updated = entry.querySelector('updated')?.textContent || entry.querySelector('published')?.textContent || 'No date';

                // Atom links are usually <link href="..." />
                // Sometimes there are multiple links (self, alternate, etc). We want the one without rel or rel="alternate"
                const links = entry.querySelectorAll('link');
                let link = '#';

                for (const l of links) {
                    const rel = l.getAttribute('rel');
                    if (!rel || rel === 'alternate') {
                        link = l.getAttribute('href');
                        break;
                    }
                }

                return {
                    title,
                    link,
                    pubDate: updated, // Normalize to pubDate property for UI
                };
            })
        };
    }

    return { siteTitle, items: [] };
}

export async function fetchRSS(url) {
    try {
        // Try local proxy first (Serverless function)
        // We use encodeURIComponent for the query param
        let response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);

        // If local proxy fails (e.g. 404 not found, or 500 server error),
        // fall back to the public proxy.
        if (!response.ok) {
             console.warn(`Local proxy failed (${response.status} ${response.statusText}), falling back to public proxy`);
             response = await fetch(`${FALLBACK_PROXY}${url}`);
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        return parseRSS(text);
    } catch (error) {
        console.error('Error fetching RSS:', error);
        return { siteTitle: 'Error', items: [] };
    }
}
