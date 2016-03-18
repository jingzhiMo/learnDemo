// 需要进行过滤的请求链接
var url = [
	'/',
	'gdetail.html',
	'/orderAdd',
	'/orderFetch',
	'/orderModify'
];

/**
 *  =filter account request
 *  @about    过滤一些需要登录才能够进行的操作
 */
function accountFilter(req, res, next) {
	// 用户不在线，且请求地址需要用户过滤
	if ( !req.session.isOnline && url.indexOf(req.url.split('?')[0]) !== -1 ) {
		// req.sourceUrl = req.url;
		res.redirect('/account.html?sourceUrl=' + decodeURIComponent(req.url));
		return;
	}
	next();
}

module.exports = accountFilter;