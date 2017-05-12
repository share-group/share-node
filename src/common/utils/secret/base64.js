/**
 * base64
 */
export default {
	/**
	 * base64编码
	 * @param data 待编码数据
	 */
	encode(data){
		data = data || '';
		return Buffer.from(data.toString().trim(), 'binary').toString('base64').trim();
	},
	/**
	 * base64解码
	 * @param data 待解码数据
	 */
	decode(data){
		data = data || '';
		return new Buffer(data.toString().trim(), 'base64').toString().trim();
	}
}