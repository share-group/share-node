const test = require('../_index');
const JWT = require('../../lib/utils/jwt');

const jwt = new JWT('./test/utils/rsa_public_key.pem', './test/utils/pkcs8_rsa_private_key.pem');

const data = {name: 'abc'};

test('test jwt encrypt and decrypt', async (t) => {
  const token = await jwt.encrypt(data, {expiresIn: 28800});
  const json = await jwt.decrypt(token);
  t.deepEqual(data, json);
});

test('test jwt expire', async (t) => {
  const token = await jwt.encrypt(data, {expiresIn: 0});
  const json = await jwt.decrypt(token);
  t.deepEqual(null, json);
});
