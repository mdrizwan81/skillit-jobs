export default async function handler(req, res) {
  // Allow requests from any origin (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { query, country } = req.query;

  if (!query || !country) {
    return res.status(400).json({ error: 'Missing query or country parameter' });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const searchQuery = encodeURIComponent(`${query} visa sponsorship`);
    const url = `https://jsearch.p.rapidapi.com/search?query=${searchQuery}&country=${country}&num_pages=2&date_posted=month`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json({ data: data.data || [] });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Search failed' });
  }
}
