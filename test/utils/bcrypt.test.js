const test = require('../_index');
const Bcrypt = require('../../lib/utils/bcrypt');

const bcrypt = new Bcrypt('AES-128-CBC', 'lkxaxw1upiPeO6Dt', 'jkcf789Lf78h5bxh');

const data = 'share-node framework';

test('test bcrypt encrypt and decrypt', async (t) => {
  const encrypted = await bcrypt.encrypt(data);
  const decrypted = await bcrypt.decrypt(encrypted);
  t.is(encrypted, 'BxO4WNYnEM3munQXEqt+t5xpSZBLBdEro5wmjAxaKD0=');
  t.is(decrypted, data);
});
