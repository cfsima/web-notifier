export const handler = async function(event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Missing "url" query parameter' }),
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSSNotifier/1.0; +https://github.com/yourusername/project)'
      }
    });

    if (!response.ok) {
       return {
        statusCode: response.status,
         headers: {
        'Access-Control-Allow-Origin': '*',
      },
        body: JSON.stringify({ error: `Failed to fetch RSS: ${response.statusText}` }),
      };
    }
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
