module.exports = {
	/**
	 * 计算两点距离
	 * @param fromLatitude 起点纬度
	 * @param fromLongitude 起点经度
	 * @param toLatitude 终点纬度
	 * @param toLongitude 终点经度
	 */
	distance(fromLatitude, fromLongitude, toLatitude, toLongitude) {
		if (fromLatitude == undefined || fromLongitude == undefined || toLatitude == undefined || toLongitude == undefined) {
			return -1;
		}
		let EARTH_RADIUS = 6378137.0;
		let radLat1 = (fromLatitude * Math.PI / 180.0);
		let radLat2 = (toLatitude * Math.PI / 180.0);
		let a = radLat1 - radLat2;
		let b = (fromLongitude - toLongitude) * Math.PI / 180.0;
		let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		return _.round(s * EARTH_RADIUS / 1000.0, 2);
	}
};