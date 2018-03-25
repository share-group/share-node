const test = require('../_index');
const time = require('../../lib/utils/time');

test('test util.time.nowMillisecond()', async (t) => {
  t.is(Math.abs(time.nowMillisecond() - new Date().getTime()) <= 1, true);
});

test('test util.time.now()', async (t) => {
  const now = parseInt(new Date().getTime() / 1000, 10) || 0;
  t.is(time.now(), now);
});

test('test util.time.format()', async (t) => {
  t.is(time.format(), time.format('yyyy-MM-dd hh:mm:ss'));
  t.is(time.format('yyyy-MM-dd hh:mm:ss', 1496327490000), '2017-06-01 22:31:30');
  t.is(time.format('yyyy-MM-dd', 1496327490000), '2017-06-01');
  t.is(time.format('yyyyMMdd', 1496327490000), '20170601');
  t.is(time.format('yyyy', 1496327490000), '2017');
  t.is(time.format('MM', 1496327490000), '06');
  t.is(time.format('dd', 1496327490000), '01');
  t.is(time.format('MMdd', 1496327490000), '0601');
  t.is(time.format('ruanzhijun', 1496327490000), 'ruanz22ijun');
});

test('test util.time.str2time()', async (t) => {
  t.is(time.str2time('2017-06-01 22:31:30'), 1496327490000);
});

test('test util.time.getDayStart()', async (t) => {
  t.is(time.getDayStart(1496327490000), 1496246400000);
});

test('test util.time.getDayStart()', async (t) => {
  t.is(time.getDayStart(1496327490000, 3), 1496505600000);
});
