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

    const isGoogle = target.includes('google.com');
    const isReddit = target.includes('reddit.com');
    const isWikipedia = target.includes('wikipedia.org');
    const isTrends = target.includes('trends.google.com');

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
    };

    if (isGoogle && !isTrends) {
      headers['Referer'] = 'https://www.google.com/';
      headers['Origin'] = 'https://www.google.com';
      headers['Accept'] = '*/*';
    } else if (isTrends) {
      headers['Referer'] = 'https://trends.google.com/';
      headers['Origin'] = 'https://trends.google.com';
      headers['Accept'] = 'application/json, text/plain, */*';
    } else if (isReddit) {
      headers['Accept'] = 'application/json';
      headers['User-Agent'] = 'Mozilla/5.0 (compatible; SEOHUB/1.0; +https://mmetwily1-sudo.github.io/seohub/)';
    } else if (isWikipedia) {
      headers['Accept'] = 'application/json';
    } else {
      headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    }

    try {
      const resp = await fetch(target, {
        headers: headers,
        redirect: 'follow',
      });

      const body = await resp.text();
      
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
