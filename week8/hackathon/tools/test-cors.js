// Quick script to check CORS preflight response from local backend
(async () => {
  try {
    const url = 'http://localhost:3001/documents/upload';
    const res = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://week8-hackathon.vercel.app',
        'Access-Control-Request-Method': 'POST',
      },
    });
    console.log('Status:', res.status);
    console.log('Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
    console.log('Access-Control-Allow-Methods:', res.headers.get('access-control-allow-methods'));
    console.log('Access-Control-Allow-Headers:', res.headers.get('access-control-allow-headers'));
  }
  catch (err) {
    console.error(err);
  }
})();
