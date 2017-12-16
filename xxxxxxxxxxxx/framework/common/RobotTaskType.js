var RobotTaskType = function (value) {
	return {
		value: value
	}
};

module.exports = {
	/**
	 * 发布创意的5min内,每个创意获得2个赞
	 */
	praiseIdeaAfterPub: RobotTaskType('praiseIdeaAfterPub'),
	/**
	 * 发布创意的24h内，创意值1-5名 再获得10个赞, 6-10名再获得5个赞;<br>
	 * 发布创意的48h内，创意值1-5名 再获得15个赞, 6-10名再获得7个赞;
	 */
	praiseIdeaByRank: RobotTaskType('praiseIdeaByRank'),
	/**
	 * 加好友行为，同一个用户被机器人加好友数上限为100个;
	 */
	addFriend: RobotTaskType('addFriend'),
	/**
	 * 每一个新用户，注册一天内，以tony的名义关注该用户
	 */
	tony: RobotTaskType('tony'),
	/**
	 * 分享cpc项目
	 */
	cpcShare: RobotTaskType('cpcShare'),
	/**
	 * 参与cpc项目
	 */
	cpcJoin: RobotTaskType('cpcJoin')
};