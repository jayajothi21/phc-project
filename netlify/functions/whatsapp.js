exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { to, message } = JSON.parse(event.body);
    if (!to || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Phone and message required' }) };
    }

    let phone = to.replace(/\D/g, '');
    if (phone.startsWith('91')) phone = phone.slice(2);
    phone = phone.slice(-10);

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: message,
        language: 'english',
        flash: 0,
        numbers: phone
      })
    });

    const data = await response.json();

    if (data.return === true) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: data.message || 'SMS failed' }) };
    }

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
