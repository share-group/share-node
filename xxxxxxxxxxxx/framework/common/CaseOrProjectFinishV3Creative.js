var CaseOrProjectFinishV3Creative = function (value) {
	this.value = value;
};

module.exports = {
	/**
	 * 一次互动1分
	 */
	collaboration: new CaseOrProjectFinishV3Creative(1),
	/**
	 * 被转发，每人0.3分
	 */
	forward: new CaseOrProjectFinishV3Creative(0.3),
	/**
	 * 第一阶段被企业选中加2分
	 */
	stage1Select: new CaseOrProjectFinishV3Creative(2),
	/**
	 * 第二阶段被企业选中加5分
	 */
	stage2Select: new CaseOrProjectFinishV3Creative(5),
	/**
	 * 资料搜索
	 */
	research: new CaseOrProjectFinishV3Creative(1.5)
};