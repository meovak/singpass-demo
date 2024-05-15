import makeHandler from '../common/makeHandler';
import got from 'got';
import * as jose from 'jose';

async function controller(event) {
  if (!event.headers.Authorization) {
    return { statusCode: 401 };
  }

  return parseJwt(event.headers.Authorization.substring(7))
    .then(getDog)
    .then((url) => ({ statusCode: 200, body: { url } }))
    .catch(function (err) {
      console.warn(err);
      return { statusCode: 401, body: { msg: 'INVALID_AUTHORIZATION' } };
    });
}
export const handler = makeHandler(controller);

function getDog() {
  return got
    .get('https://dog.ceo/api/breeds/image/random')
    .json()
    .then(({ message }) => message);
}

async function parseJwt(token) {
  const publicKey = await jose.importJWK(
    {
      alg: 'ES256',
      kty: 'EC',
      x: 'oknC7EP5CtfQfexOvr6mBInaL2RmFGO7K4oH5U-HnDA',
      y: 'OUG8mLUo7K2d45ETwKTxC65jXUvpbKKI7QARrXASGgg',
      crv: 'P-256',
    },
    'ES256'
  );
  return jose.jwtVerify(token, publicKey, {
    issuer: 'sp-login.meovak.com',
    audience: 'https://sp-login.pages.dev',
  });
}
