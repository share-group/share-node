var MessageSign = function (sign, description) {
	return {
		sign: sign,
		description: description
	}
};

module.exports = {
	/** 发送给管理员消息分类 *************************************************************************************/
	/*100100x*/

	/** 发送给用户的消息分类*************************************************************************************/
	/*200100x,发送者为系统****************************************/
	//删除点子
	delIdea: MessageSign(2001001, "删除点子"),
	//专案结束分红
	caseFinishBonus: MessageSign(2001002, "专案结束分红"),
	//实名认证通过
	passProve: MessageSign(2001003, "实名认证通过"),
	//实名认证不通过
	faildProve: MessageSign(2001004, "实名认证不通过"),
	//通用系统消息
	generalSystemMessage: MessageSign(2001005, "通用系统消息"),
	//项目结束分红
	projectFinishBonus: MessageSign(2001006, "项目结束分红"),
	//第一阶段点子挑选通知
	ideaStage1select: MessageSign(2001007, "第一阶段点子挑选通知"),
	//点子获得前3
	ideaTop3: MessageSign(2001008, "点子获得前3"),
	//点子获得品牌喜爱
	companySelectIdea: MessageSign(2001009, "点子获得品牌喜爱"),
	//专案进入阶段2
	caseIntoStage2: MessageSign(2001010, "专案进入阶段2"),
	//个人专案有新点子
	userCaseHasPubIdea: MessageSign(2001011, "个人专案有新点子"),
	//个人专案挑选点子
	userCaseChooseIdea: MessageSign(2001012, "个人专案挑选点子"),
	//个人专案发布
	userCaseMew: MessageSign(2001013, "个人专案发布"),

	/*200200x,发送者为用户****************************************/
	//新增粉丝消息
	userFocus: MessageSign(2002001, "新增粉丝消息"),
	//企业专案创意评论消息
	companyCaseIdeaCommentPub: MessageSign(2002002, "企业专案创意评论消息"),
	//企业专案创意获赞消息
	companyCaseIdeaPraiseUp: MessageSign(2002003, "企业专案创意点赞消息"),
	//发布专案邀请消息
	invitePubIdea: MessageSign(2002004, "发布专案邀请消息"),
	//创意评论被回复消息
	ideaCommentReply: MessageSign(2002005, "创意评论被回复消息"),
	//创意圈_作品评论消息
	marketOpusCommentPub: MessageSign(2002006, "创意圈作品评论消息"),
	//创意圈_作品评论被回复消息
	marketOpusCommentReply: MessageSign(2002007, "创意圈作品评论被回复消息"),
	//大咖说_作品评论消息
	superstarOpusCommentPub: MessageSign(2002008, "大咖说作品评论消息"),
	//大咖说_作品评论被回复消息
	superstarOpusCommentReply: MessageSign(2002009, "大咖说作品评论被回复消息"),
	//个人专案创意评论消息
	userCaseIdeaCommentPub: MessageSign(2002010, "个人专案创意评论消息"),
	//个人专案创意获赞消息
	userCaseIdeaPraiseUp: MessageSign(2002011, "个人专案创意点赞消息"),

	/*200300x,发送者为企业****************************************/
	//企业回复创意
	companyReplyUser: MessageSign(2003001, "企业回复创意"),
	//企业新发布专案
	caseNew: MessageSign(2003002, "企业新发布专案"),
	//企业发cpc项目
	cpcNew: MessageSign(2003003, "企业发cpc项目"),

	/** 发送给企业的消息分类 *************************************************************************************/
	/*300100x,发送者为系统/管理员****************************************/
	//后台赠送G点
	adminSendPoints: MessageSign(3001001, "后台赠送G点"),
	//专案结束通知
	caseFinish: MessageSign(3001002, "专案结算"),
	//充值成功
	chargeSuccess: MessageSign(3001003, "充值成功"),
	//通用系统消息
	commonSystemMessage: MessageSign(3001004, "通用系统消息"),
	//通知品牌挑选完执行方服务快去付款
	companyPayExecute: MessageSign(3001005, "通知品牌挑选完执行方服务快去付款"),
	//通知品牌执行方已经提交初稿(终稿)快去确认
	companyExecutiveConfirm: MessageSign(3001006, "通知品牌执行方已经提交初稿(终稿)快去确认"),

	/*300200x,消息通知****************************************/
	//用户回复企业
	userReplyCompany: MessageSign(3002001, "用户回复企业"),

	/*300300x,粉丝通知****************************************/
	//用户关注企业
	userFocusCompany: MessageSign(3003001, "用户关注企业"),

	/*300400x,专案通知****************************************/
	//用户提交创意
	ideaPub: MessageSign(3004001, "用户提交创意"),
	//用户关注专案
	focusCase: MessageSign(3004002, "用户关注专案"),
	//通知项目发布成功
	postCaseSuccess: MessageSign(3004003, "通知项目发布成功"),
	//提示第x阶段挑选idea
	noticeSelectIdea: MessageSign(3004004, "提示第x阶段挑选idea"),
	//通知项目结束
	caseFinishCheckReport: MessageSign(3004005, "通知项目结束")
};


let messageSignMap = new Map();
_.forEach(module.exports, function (v, k) {
	messageSignMap.set(_.toInteger(v.sign), _.toString(k));
});

/**
 * 返回所有消息类型
 */
module.exports.values = function () {
	return messageSignMap;
};

/**
 * 根据传入的值返回消息类型名称
 * @param messageSign 消息类型id
 */
module.exports.valueOf = function (messageSign) {
	return _.toString(messageSignMap.get(messageSign));
};