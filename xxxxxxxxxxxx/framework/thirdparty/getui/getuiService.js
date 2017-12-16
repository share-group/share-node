const LOGGER = logUtil.getLogger(module.filename);

const HOST = properties['getui.host'];
const APPID = properties['getui.appId'];
const APPKEY = properties['getui.appkey'];
const MASTERSECRET = properties['getui.master'];

const GeTui = require('./GT.push');
const Target = require('./getui/Target');
const APNPayload = require('./payload/APNPayload');
const DictionaryAlertMsg = require('./payload/DictionaryAlertMsg');
const TransmissionTemplate = require('./getui/template/TransmissionTemplate');
const SingleMessage = require('./getui/message/SingleMessage');

module.exports = {
	/**
	 * 发送推送到指定设备
	 * @param pushKey 推送标识
	 * @param title 特定消息的title
	 * @param body 特定消息的body
	 * @param badge 小红点数量
	 */
	pushMessageToSingle: function (pushKey, title, body, badge) {
		// 内网不发推送
		if (properties['system.env'] === 'dev') {
			return;
		}
		if (pushKey.length != 32) {
			return;
		}

		let template = new TransmissionTemplate({
			appId: APPID,
			appKey: APPKEY,
			transmissionType: 1,
			transmissionContent: body
		});

		let payload = new APNPayload();
		payload.sound = "default";
		payload.contentAvailable = 1;
		badge = _.toInteger(badge);
		if (badge > 0) {
			payload.badge = badge;
		}
		payload.alertMsg = new DictionaryAlertMsg();
		title = _.toString(title);
		body = _.toString(body);
		if (!_.isEmpty(title)) {
			payload.alertMsg.title = title;
		}
		if (!_.isEmpty(body)) {
			payload.alertMsg.locKey = body;
			payload.alertMsg.body = body;
		}
		template.setApnInfo(payload);

		//个推信息体
		let message = new SingleMessage({
			isOffline: true,                        //是否离线
			data: template,                         //设置推送消息类型
			pushNetWorkType: 0                      //是否wifi，0不限，1wifi
		});

		//接收方
		let target = new Target({
			appId: APPID,
			clientId: pushKey
		});

		let gt = new GeTui(HOST, APPKEY, MASTERSECRET);
		gt.pushMessageToSingle(message, target, function (err, res) {
			if (err) {
				LOGGER.warn("clientId: %s, body: %s, error: %s", pushKey, body, JSON.stringify(err));
			} else {
				LOGGER.warn("clientId: %s, body: %s, data: %s", pushKey, body, JSON.stringify(res));
			}
		});
	}
};