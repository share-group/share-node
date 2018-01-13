/**
 * 微信SDK
 */
const LOGGER = logUtil.getLogger(module.filename);
import fs from "fs";
import request from "request";
import util from "util";

//////////////////////由于历史原因，证书分两套/////////////////////////////////////////////
//////////////////////login：一套做微信分享、提现、扫码充值/////////////////////////////////
//////////////////////pay：另一套做微信app支付/////////////////////////////////////////////

// pay配置
const payAppId = 'wx96b6971795cf0965';
const payAppSecret = '2123ed5de13c3415ae55c16d9c6514af';
const payMchId = '1287799201';

// login配置
const loginAppId = 'wx71b54f7bb3586db2';
const loginAppSecret = 'd4f9d23bc820623e46541a0f845caf0b';
const loginMchId = '1269149901';

// pay https证书配置
const payAgentOptions = {
	key: filesystem.isLinux() ? fs.readFileSync('/srv/etc/cert/pay/wechatSDK_key.pem') : fs.readFileSync(AppDir + '/../gu-core/src/resources/cert/pay/wechatSDK_key.pem'),
	cert: filesystem.isLinux() ? fs.readFileSync('/srv/etc/cert/pay/wechatSDK_cert.pem') : fs.readFileSync(AppDir + '/../gu-core/src/resources/cert/pay/wechatSDK_cert.pem'),
	passphrase: payMchId
};

// login https证书配置
const loginAgentOptions = {
	key: filesystem.isLinux() ? fs.readFileSync('/srv/etc/cert/login/wechatSDK_key.pem') : fs.readFileSync(AppDir + '/../gu-core/src/resources/cert/login/wechatSDK_key.pem'),
	cert: filesystem.isLinux() ? fs.readFileSync('/srv/etc/cert/login/wechatSDK_cert.pem') : fs.readFileSync(AppDir + '/../gu-core/src/resources/cert/login/wechatSDK_cert.pem'),
	passphrase: loginMchId
};


module.exports = {
	/**
	 * 获取AccessToken
	 */
	getAccessToken: async function () {
		return await cacheUtil.get('wechatSDK:accessToken', 7200, _getAccessToken);
	},
	/**
	 * 获取jsapi ticket
	 * @param accessToken
	 */
	getTicket: async function (accessToken) {
		return await cacheUtil.get('wechatSDK:ticket', 7200, _getTicket, accessToken);
	},
	/**
	 * 生成微信分享数据
	 * @param url 要分享的网络地址
	 */
	genWechatShareData: async function (url) {
		let accessToken = await this.getAccessToken();
		let ticket = await this.getTicket(accessToken);

		// 计算sign值
		let nonceStr = stringUtil.random(32);
		let timestamp = timeUtil.now();
		let signature = secret.sha1("jsapi_ticket=" + ticket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url);

		// 返回的数据
		return {
			"jsapi_ticket": ticket,
			"nonceStr": nonceStr,
			"timestamp": timestamp,
			"signature": signature,
			"appId": loginAppId,
			"link": url
		};
	},
	/**
	 * 商户支付给用户
	 * @param openId 用户的第三方id
	 * @param orderId 订单id
	 * @param amount 支付金额(单位：分)
	 * @param ip 请求支付端的ip地址
	 */
	mchPay: async function (openId, orderId, amount, ip) {
		let param = {};
		param.mch_appid = loginAppId;
		param.mchid = loginMchId;
		param.nonce_str = stringUtil.random(32);
		param.partner_trade_no = orderId;
		param.openid = openId;
		param.check_name = "NO_CHECK";
		param.amount = amount;
		param.desc = "共做室提现";
		param.spbill_create_ip = ip;
		param.sign = genWechatSign(param);
		let xml = await post("https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers", stringUtil.json2xml(param), loginAgentOptions);
		return stringUtil.xml2json(xml);
	},
	/**
	 * 微信二维码支付
	 * @param orderId 订单id
	 * @param description 支付描述(例如：G点充值)
	 * @param ip 支付机器的ip
	 * @param amount 要支付的金额(单位：分)
	 * @param attach 附加数据
	 * @param notifyUrl 回调地址
	 */
	payByWechatQRCode: async function (orderId, description, ip, amount, attach, notifyUrl) {
		let param = {};
		param.appid = loginAppId;
		param.mch_id = loginMchId;
		param.nonce_str = stringUtil.random(32);
		param.body = description;
		param.out_trade_no = _.toString(orderId);
		param.total_fee = _.toString(amount);
		param.spbill_create_ip = ip;
		param.notify_url = notifyUrl;
		param.trade_type = "NATIVE";
		param.attach = attach;
		param.sign = genWechatSign(param);
		let xml = await post("https://api.mch.weixin.qq.com/pay/unifiedorder", stringUtil.json2xml(param), loginAgentOptions);
		return stringUtil.xml2json(xml);
	},
	/**
	 * 微信App支付
	 * @param orderId 订单id
	 * @param description 支付描述(例如：G点充值)
	 * @param ip 支付机器的ip
	 * @param amount 要支付的金额(单位：分)
	 * @param attach 附加数据
	 * @param notifyUrl 回调地址
	 */
	payByApp: async function (orderId, description, ip, amount, attach, notifyUrl) {
		let param = {};
		param.appid = payAppId;
		param.mch_id = payMchId;
		param.nonce_str = stringUtil.random(32);
		param.body = description;
		param.out_trade_no = _.toString(orderId);
		param.total_fee = _.toString(amount);
		param.spbill_create_ip = ip;
		param.notify_url = notifyUrl;
		param.trade_type = "APP";
		param.attach = JSON.stringify(attach);
		param.sign = genWechatSign(param);
		let xml = await post("https://api.mch.weixin.qq.com/pay/unifiedorder", stringUtil.json2xml(param), payAgentOptions);
		let result = await stringUtil.xml2json(xml);
		if (result['result_code'] !== 'SUCCESS') {
			LOGGER.warn("pay by wechat app error! %s", JSON.stringify(result));
			return {};
		}
		LOGGER.warn(JSON.stringify(result));

		// 返回拉起微信支付app的数据
		let payData = {};
		payData.appid = payAppId;
		payData.partnerid = payMchId;
		payData.prepayid = result.prepay_id;
		payData.package = 'Sign=WXPay';
		payData.noncestr = stringUtil.random(32);
		payData.timestamp = _.toString(timeUtil.now());
		payData.sign = genWechatSign(payData);
		payData.returnData = result;
		return payData;
	},
	/**
	 * 微信jsapi支付
	 * @param orderId 订单id
	 * @param openId 第三方id
	 * @param description 支付描述(例如：G点充值)
	 * @param ip 支付机器的ip
	 * @param amount 要支付的金额(单位：分)
	 * @param attach 附加数据
	 * @param notifyUrl 回调地址
	 */
	payByJsapi: async function (orderId, openId, description, ip, amount, attach, notifyUrl) {
		let param = {};
		param.appid = loginAppId;
		param.mch_id = loginMchId;
		param.nonce_str = stringUtil.random(32);
		param.body = description;
		param.out_trade_no = _.toString(orderId);
		param.total_fee = _.toString(amount);
		param.spbill_create_ip = ip;
		param.notify_url = notifyUrl;
		param.trade_type = "JSAPI";
		param.attach = JSON.stringify(attach);
		param.openid = openId;
		param.sign = genWechatSign(param);
		let xml = await post("https://api.mch.weixin.qq.com/pay/unifiedorder", stringUtil.json2xml(param), loginAgentOptions);
		let result = await stringUtil.xml2json(xml);
		if (result['result_code'] !== 'SUCCESS') {
			LOGGER.warn("pay by wechat app error! %s", JSON.stringify(result));
			return {};
		}
		LOGGER.warn(JSON.stringify(result));

		// 返回拉起微信支付jsapi的数据
		let payData = {};
		payData.appId = payAppId;
		payData.package = util.format('prepay_id=%s', result.prepay_id);
		payData.signType = 'MD5';
		payData.nonceStr = stringUtil.random(32);
		payData.timeStamp = _.toString(timeUtil.now());
		payData.paySign = genWechatSign(payData);
		payData.returnData = result;
		return payData;
	},
	/**
	 * 通过code换取网页授权access_token
	 * @param code 用户授权后获得的code
	 */
	getAccessTokenByCode: async function (code) {
		return await cacheUtil.get('wechatSDK:accessTokenByCode', 7200, _getAccessTokenByCode, code);
	},
	/**
	 * 用户授权页面
	 * @param callback 如果用户授权成功要回调页面url
	 * @param res res对象
	 */
	authorize: function (callback, res) {
		let scope = "snsapi_userinfo";
		let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=1#wechat_redirect";
		url = util.format(url, loginAppId, encodeURIComponent(callback), scope);
		LOGGER.warn("redirect to: %s", url);
		res.redirect(url);
	},
	/**
	 * 获取用户信息
	 * @param accessToken 用户首页的访问凭据
	 * @param openId 用户的第三方id
	 */
	getUserInfo: async function (accessToken, openId) {
		let url = "https://api.weixin.qq.com/sns/userinfo";
		let data = {
			"access_token": accessToken,
			"openid": openId,
			"lang": "zh_CN"
		};
		return JSON.parse(await get(url, data, loginAgentOptions));
	},
	/**
	 * 判断微信是不是来自微信客户端
	 * @param req
	 */
	isFromWechat: function (req) {
		// 1.判断ua
		let ua = req.headers['user-agent'];
		if (_.toInteger(ua.indexOf('MicroMessenger')) <= 0) {
			LOGGER.warn('this request is not from wechat app, ua is error! ua: %s', ua);
			return false;
		}
		return true;
	},
	/**
	 * 解析回调数据
	 * 鉴于微信这么恶心的字节流回调和nodejs这么恶心的解析字节流的方法，所以写了这个函数
	 * 这个是目前比较优雅的办法了
	 * @param req 请求对象
	 */
	parseCallbackData: async function (req) {
		var bytes = '';
		return new Promise(function (resolve, reject) {
			req.on('data', function (data) {
				bytes += data.toString();
			});
			req.on('end', function () {
				resolve(stringUtil.xml2json(bytes));
			});
		}).catch(function (error) {
			LOGGER.error(error);
		});
	},
	/**
	 * 把长链换成短链
	 * @param link 链接
	 */
	getShortLink: async function (link) {
		let accessToken = await _getAccessToken();
		let url = "https://api.weixin.qq.com/cgi-bin/shorturl?access_token=" + accessToken;
		let data = {
			action: 'long2short',
			long_url: link
		};
		return JSON.parse(await post(url, data, loginAgentOptions));
	}
};

/**
 * 获取AccessToken
 */
async function _getAccessToken() {
	let data = {
		'grant_type': 'client_credential',
		'appid': loginAppId,
		'secret': loginAppSecret
	};
	let json = JSON.parse(await get('https://api.weixin.qq.com/cgi-bin/token', data, loginAgentOptions));
	return json.access_token;
}

/**
 * 通过code换取网页授权access_token
 * @param code 用户授权后获得的code
 */
async function _getAccessTokenByCode(code) {
	let url = "https://api.weixin.qq.com/sns/oauth2/access_token";
	let data = {
		"appid": loginAppId,
		"secret": loginAppSecret,
		"code": code,
		"grant_type": "authorization_code"
	};
	let json = await get(url, data, loginAgentOptions);
	LOGGER.warn("get accessToken by code from wechat, code: %s, data: %s", code, json);
	return JSON.parse(json);
}

/**
 * 获取jsapi ticket
 * @param accessToken
 */
async function _getTicket(accessToken) {
	let data = {
		'access_token': accessToken,
		'type': 'jsapi'
	};
	let json = JSON.parse(await get('https://api.weixin.qq.com/cgi-bin/ticket/getticket', data, loginAgentOptions));
	return json.ticket;
}

/**
 * post获取数据
 * @param url 请求地址
 * @param data 请求数据
 * @param agentOptions 代理配置
 */
function post(url, data, agentOptions) {
	return new Promise(function (resolve, reject) {
		request.post({url: url, form: data, agentOptions: agentOptions}, function (err, httpResponse, body) {
			if (err) {
				reject(err);
				return;
			}
			resolve(body);
		})
	}).catch(function (e) {
		LOGGER.error(e);
	});
}

/**
 * get获取数据
 * @param url 请求地址
 * @param data 请求数据
 * @param agentOptions 代理配置
 */
function get(url, data, agentOptions) {
	url += '?';
	_.forEach(data, function (v, k) {
		url += k + '=' + v + '&';
	});
	return new Promise(function (resolve, reject) {
		request.get({url: url, form: data, agentOptions: agentOptions}, function (err, httpResponse, body) {
			if (err) {
				reject(err);
				return;
			}
			resolve(body);
		})
	}).catch(function (e) {
		LOGGER.error(e);
	});
}

/**
 * 生成微信接口sign值
 * @param data
 */
function genWechatSign(data) {
	let str = '';

	// 按照key排序
	let keyList = sortUtil.sortKey(data);
	keyList.forEach(function (obj) {
		str += obj.key;
		str += '=';
		str += obj.value;
		str += '&';
	});
	str += 'key=GongZuoShi2015InTitAndRoomIsCCIC';
	return secret.md5(str).toUpperCase();
}