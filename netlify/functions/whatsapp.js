const twilio = require('twilio');

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
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Phone number and message required' }) };
    }
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    let phone = to.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;
    if (!phone.startsWith('+')) phone = '+' + phone;
    const msg = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:' + phone,
      body: message
    });
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, sid: msg.sid }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
