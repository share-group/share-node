const test = require('ava');
const secret = require('../../lib/utils/secret');

const exampleString = 'vbu987ftyukgilofYG^di78o89ygytcrs4YD^UF&IG*FCvbh987FUTYUIBIJ';

const exampleBase64Encode = 'dmJ1OTg3ZnR5dWtnaWxvZllHXmRpNzhvODl5Z3l0Y3JzNFlEXlVGJklHKkZDdmJoOTg3RlVUWVVJQklK';
const exampleMD5Encode = '1edb3ad009f750fd9e693b757dd06c96';
const exampleSHA1Encode = '20ee92ef95bf56ae954d7c8838247dab51265a39';

test('test secret.md5()', async (t) => {
  t.is(secret.md5(''), 'd41d8cd98f00b204e9800998ecf8427e');
  t.is(secret.md5(exampleString), exampleMD5Encode);
});

test('test secret.sha1()', async (t) => {
  t.is(secret.sha1(''), 'da39a3ee5e6b4b0d3255bfef95601890afd80709');
  t.is(secret.sha1(exampleString), exampleSHA1Encode);
});

test('test secret.base64Encode()', async (t) => {
  t.is(secret.base64Encode(''), '');
  t.is(secret.base64Encode(exampleString), exampleBase64Encode);
});

test('test secret.base64Decode()', async (t) => {
  t.is(secret.base64Decode(''), '');
  t.is(secret.base64Decode(exampleBase64Encode), exampleString);
});
