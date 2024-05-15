const crypto = require('crypto');

crypto.subtle
  .generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  )
  .then(toJwk)
  .then(logPublicKey);

crypto.subtle
  .generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, [
    'deriveBits',
    'deriveKey',
  ])
  .then(toJwk)
  .then(logPublicKey);

function toJwk({ publicKey }) {
  return crypto.subtle.exportKey('jwk', publicKey);
}
function logPublicKey(publicKey) {
  console.log(publicKey);
}
