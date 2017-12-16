// gu项目工具库
import httpClient from "./httpClient";
import secret from "./secret";
import cheerio from "cheerio";
const gatherupHost = properties['system.env'] === 'dev' ? 'https://test.gatherup.cc' : 'https://gatherup.cc';
module.exports = {
	/**
	 * 公共获取页码方法
	 * @param page
	 */
	getPage: function (page) {
		page = _.toInteger(page);
		return page <= 0 ? 1 : page;
	},
	/**
	 * 公共获取页面大小方法
	 * @param pageSize
	 */
	getPageSize: function (pageSize) {
		pageSize = _.toInteger(pageSize);
		pageSize = pageSize <= 0 ? 1 : pageSize;
		return pageSize > 30 ? 30 : pageSize;
	},
	/**
	 * post获取数据
	 * @param url 请求地址
	 * @param data 请求数据
	 */
	post: async function (url, data) {
		data.version = 999;
		data.platform = 4;
		data.mobileType = 'nodejs';
		data.time = timeUtil.now();
		data.sign = this.makeSign(data);
		url = gatherupHost + url;
		return await httpClient.postAsync(url, data);
	},
	/**
	 * get获取数据
	 * @param url 请求地址
	 * @param data 请求数据
	 */
	get: async function (url, data) {
		data.version = 999;
		data.time = timeUtil.now();
		data.sign = this.makeSign(data);
		url = gatherupHost + url;
		return await httpClient.getAsync(url, data);
	},
	/**
	 * 生成sign值
	 * @param data json数据
	 */
	makeSign: function (data) {
		let tmp = [];
		for (let value in data) {
			tmp.push({'key': value});
		}
		tmp = _.sortBy(tmp, function (o) {
			return o.key;
		});
		let sign = '';
		_.forEach(tmp, function (a) {
			if ('sign' === a.key) {
				return;
			}
			sign += _.toString(data[a.key].toString()).trim();
		});
		sign += properties['system.key'];
		return secret.md5(sign);
	},
	/**
	 * 把长链换成短链
	 * @param link 链接
	 */
	getShortLink: async function (link) {
		// let url = 'http://vurl.cn/create.php';
		// let json = await httpClient.postAsync(url, {url: link, alias: stringUtil.random(_.random(5, 20)), access_type: 'web'});
		// json = JSON.parse(json);
		// return _.toString(json.tinyurl);

		let url = 'http://rrd.me/index.php';
		let html = await httpClient.getAsync(url, {url: encodeURIComponent(link), site: 'sina'});
		let $ = cheerio.load(html);
		html = $('div[id=urlok] a').html();
		return html;
	},
	/**
	 * 睡眠
	 * @param milliSeconds 睡眠的毫秒数
	 */
	sleep: function (milliSeconds) {
		let startTime = new Date().getTime();
		while (new Date().getTime() < startTime + milliSeconds) {
		}
	}
};