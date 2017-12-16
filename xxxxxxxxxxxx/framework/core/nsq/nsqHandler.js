const nsq = require('./nsqUtil');
const LOGGER = logUtil.getLogger(module.filename);
var getChannel = function (channel, onlyChannel) {
	if (onlyChannel) {
		return channel;
	} else {
		let project = properties["project.name"].split('-')[1];
		return project + '_' + process.pid + '_' + filesystem.getValidIPAddress() + '_' + _.toInteger(properties['http.' + project + '.port']);
	}
};
module.exports = function nsqHandler(topic, channel, onlyChannel) {
	if (!topic || !channel) {
		throw new Error("topic or channel is Error!");
	}
	LOGGER.warn("find nsq callback, bind channel: " + getChannel(channel, onlyChannel));
	return async function (func) {
		var queue = nsq({
			nsqd: [properties['nsq.nsqd'] + ':4150'],
			channel: getChannel(channel, onlyChannel)
		});

		// 非唯一channel且同topic其他无用的channel
		if (!onlyChannel) {
			let project = properties["project.name"].split('-')[1];
			let url = 'http://' + properties['nsq.nsqd'] + ':4171/api/topics/' + topic;
			let allChannel = JSON.parse(await httpClient.getAsync(url));
			for (let node of allChannel.nodes) {
				for (let channel of node.channels) {
					channel = _.toString(channel.channel_name);
					let arr = channel.split('_');
					if (project !== arr[0]) {
						continue;
					}
					httpClient.delete(url + '/' + channel);
				}
			}
		}

		queue.pull(topic, async function (message, callback) {
			LOGGER.warn('nsq handle - %s message: %s', process.pid, message);
			try {
				let finish = await new func(message);
				if (finish === true) {
					callback(false);
				} else {
					callback(true);
				}
			} catch (e) {
				LOGGER.error('nsq handle error: %s', e);
				callback(e);
			}
		});
	};
}