export default function makeHandler(controller) {
  return function proxiedHandler(event) {
    event.body = event.isBase64Encoded
      ? JSON.parse(Buffer.from(event.body, 'base64').toString())
      : JSON.parse(event.body);
    console.log(event);
    return controller(event).then(transformResponse).catch(errorIfAny);

    function transformResponse(res) {
      if (res.body) {
        res.body = JSON.stringify(res.body);
      }
      res.headers = {
        ...res.headers,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': 'https://sp-login.pages.dev',
        'Access-Control-Allow-Methods': '*',
      };
      return res;
    }

    function errorIfAny(err) {
      console.error(err);
      return { statusCode: 500 };
    }
  };
}
