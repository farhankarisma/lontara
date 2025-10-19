exports.parseEmail = (emailData) => {
  const payload = emailData.data.payload;
  const headers = payload.headers;

  function getHeader(name) {
    return headers.find(h => h.name === name)?.value || '';
  }

  let subject = getHeader('Subject');
  let from = getHeader('From');
  let to = getHeader('To');
  let date = new Date(getHeader('Date'));
  let bodyData = '';

  if (payload.parts) {
    const textPart = payload.parts.find(part => part.mimeType === 'text/plain');
    if (textPart?.body?.data) {
      bodyData = textPart.body.data;
    }
  } else if (payload.body?.data) {
    bodyData = payload.body.data;
  }

  let body = bodyData ? Buffer.from(bodyData, 'base64').toString('utf8') : '';

  return { subject, from, to, body, date };
};
