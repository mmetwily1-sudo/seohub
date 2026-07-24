// Cloudflare Worker - CORS Proxy for SEOHUB
// Deploy: https://workers.cloudflare.com
// Free tier: 100,000 requests/day

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    
    if (!target) {
      return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const isSuggest = target.includes('suggestqueries.google.com');
    const isTrends = target.includes('trends.google.com/trends/api');
    const isRedditJson = target.includes('reddit.com') && target.includes('.json');
    const isWikipedia = target.includes('wikipedia.org/api');
    const expectsJson = isSuggest || isTrends || isRedditJson || isWikipedia;
    const isGoogleDomain = target.includes('google.com');

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
    };

    if (isSuggest) {
      headers['Referer'] = 'https://www.google.com/';
      headers['Origin'] = 'https://www.google.com';
      headers['Accept'] = '*/*';
    } else if (isTrends) {
      headers['Referer'] = 'https://trends.google.com/';
      headers['Origin'] = 'https://trends.google.com';
      headers['Accept'] = 'application/json, text/plain, */*';
    } else if (isRedditJson) {
      headers['Accept'] = 'application/json';
    } else if (isWikipedia) {
      headers['Accept'] = 'application/json';
    } else if (isGoogleDomain) {
      headers['Referer'] = 'https://www.google.com/';
      headers['Origin'] = 'https://www.google.com';
      headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    } else {
      headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    }

    try {
      const resp = await fetch(target, { headers, redirect: 'follow' });
      const body = await resp.text();
      
      if (expectsJson) {
        const trimmed = body.trim();
        const looksLikeHtml = trimmed.charAt(0) === '<';
        const isBlocked = looksLikeHtml || trimmed.indexOf('Sorry...') !== -1 || trimmed.indexOf('captcha') !== -1;
        
        if (isBlocked) {
          return new Response(JSON.stringify({ 
            error: 'Upstream returned HTML instead of JSON (likely blocked)',
            status: resp.status
          }), {
            status: 502,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          });
        }
      }

      return new Response(JSON.stringify({ contents: body, status: resp.status }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};
