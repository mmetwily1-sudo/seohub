// Cloudflare Worker - CORS Proxy + n8n Agent Proxy for SEOHUB
// Deploy: https://workers.cloudflare.com
// Free tier: 100,000 requests/day

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ===== /api/agent - n8n Agent Proxy =====
    if (url.pathname === '/api/agent') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'POST required' }), { status: 405, headers: CORS_HEADERS });
      }

      const N8N_WEBHOOK = env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/seo-agent';

      try {
        const body = await request.json();
        const resp = await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await resp.json();
        return new Response(JSON.stringify(data), { status: resp.status, headers: CORS_HEADERS });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Agent proxy failed: ' + e.message }), { status: 502, headers: CORS_HEADERS });
      }
    }

    // ===== /api/agent/status - Check if n8n is configured =====
    if (url.pathname === '/api/agent/status') {
      const configured = !!(env.N8N_WEBHOOK_URL);
      return new Response(JSON.stringify({
        n8n_configured: configured,
        webhook_url: configured ? 'configured' : 'not_set'
      }), { status: 200, headers: CORS_HEADERS });
    }

    // ===== Original proxy logic =====
    const target = url.searchParams.get('url');

    if (!target) {
      return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }

    try {
      new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: CORS_HEADERS
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
      headers['Cookie'] = 'CONSENT=YES+cb.20210328-17-p0.en+FX+' + Math.floor(Date.now() / 1000);
    } else {
      headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    }

    const isGoogleSearch = isGoogleDomain && target.includes('/search');

    try {
      const resp = await fetch(target, { headers, redirect: 'follow' });
      const body = await resp.text();
      const trimmed = body.trim();
      const looksLikeHtml = trimmed.charAt(0) === '<';
      const lowerBody = trimmed.toLowerCase();

      if (expectsJson) {
        const isBlocked = looksLikeHtml || trimmed.indexOf('Sorry...') !== -1 || trimmed.indexOf('captcha') !== -1;
        if (isBlocked) {
          console.log('BLOCKED JSON request to:', target, '- response starts with:', trimmed.substring(0, 200));
          return new Response(JSON.stringify({
            error: 'Upstream returned HTML instead of JSON (likely blocked)',
            status: resp.status
          }), { status: 502, headers: CORS_HEADERS });
        }
      }

      if (isGoogleSearch && looksLikeHtml) {
        const isConsent = lowerBody.indexOf('consent.google') !== -1 || lowerBody.indexOf('sorry') !== -1 || lowerBody.indexOf('unusual traffic') !== -1 || lowerBody.indexOf('captcha') !== -1 || lowerBody.indexOf('enable javascript') !== -1 || lowerBody.indexOf('before you continue') !== -1 || lowerBody.indexOf('before you proceed') !== -1;
        if (isConsent || resp.status === 429 || resp.status === 503) {
          console.log('BLOCKED Google Search - consent/captcha page. URL:', target, 'Status:', resp.status, 'First 300 chars:', trimmed.substring(0, 300));
          return new Response(JSON.stringify({
            error: 'Google returned consent/captcha page (datacenter IP blocked)',
            blocked: true,
            status: resp.status
          }), { status: 502, headers: CORS_HEADERS });
        }
      }

      return new Response(JSON.stringify({ contents: body, status: resp.status }), {
        headers: CORS_HEADERS
      });
    } catch (e) {
      console.log('FETCH ERROR for', target, ':', e.message);
      return new Response(JSON.stringify({ error: e.message }), {
        status: 502,
        headers: CORS_HEADERS
      });
    }
  }
};
