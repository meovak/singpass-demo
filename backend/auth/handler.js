import makeHandler from '../common/makeHandler';
import got from 'got';
import * as jose from 'jose';

const jwtService = makeJwtService();
const singpassJwks = jose.createRemoteJWKSet(
  new URL('https://stg-id.singpass.gov.sg/.well-known/keys')
);
export async function controller({ queryStringParameters }) {
  if (!queryStringParameters.code) {
    return { statusCode: 400, body: { msg: 'invalid_auth_code' } };
  }
  return getToken(queryStringParameters.code)
    .then(toJwt)
    .then(jwtService.getToken)
    .then(toResponseDto);

  function toResponseDto(id_token) {
    return { statusCode: 200, body: { id_token } };
  }
}
export const handler = makeHandler(controller);

async function getToken(code) {
  return got
    .post('https://stg-id.singpass.gov.sg/token', {
      form: {
        client_id: process.env.CLIENT_ID,
        client_assertion_type:
          'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        redirect_uri: 'https://sp-login.pages.dev',
        grant_type: 'authorization_code',
        code: code,
        client_assertion: await jwtService.getClientAssertion(),
      },
    })
    .json();
}

function toJwt({ id_token }) {
  console.log(id_token);
  return jose.jwtVerify(id_token, singpassJwks, {
    audience: process.env.CLIENT_ID,
    issuer: 'https://stg-id.singpass.gov.sg',
  });
}

function makeJwtService() {
  const privateKeyPromise = jose.importJWK(
    JSON.parse(process.env.privateKey),
    'ES256'
  );

  function getClientAssertion() {
    return privateKeyPromise.then(function (privateKey) {
      const jwtSigner = new jose.SignJWT();
      return jwtSigner
        .setProtectedHeader({ alg: 'ES256', kid: 'brahms-sig', typ: 'JWT' })
        .setIssuedAt()
        .setSubject(process.env.CLIENT_ID)
        .setAudience('https://stg-id.singpass.gov.sg')
        .setExpirationTime('30s')
        .setIssuer(process.env.CLIENT_ID)
        .sign(privateKey);
    });
  }

  function getToken({ payload }) {
    return privateKeyPromise.then(function (privateKey) {
      const jwtSigner = new jose.SignJWT();
      return jwtSigner
        .setProtectedHeader({ alg: 'ES256', typ: 'JWT', kid: 'brahms-sig' })
        .setIssuedAt()
        .setExpirationTime('10m')
        .setSubject(payload.sub)
        .setIssuer('sp-login.meovak.com')
        .setAudience('https://sp-login.pages.dev')
        .sign(privateKey);
    });
  }
  return { getClientAssertion, getToken };
}
