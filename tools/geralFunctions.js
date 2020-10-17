function formatNumber(number) {
	return number.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&.');
}

module.exports.formatNumber = formatNumber;
