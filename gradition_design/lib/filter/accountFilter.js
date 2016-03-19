// 需要进行过滤的请求链接
var url = [
	'/purchase',
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
		if ( req.method === 'GET' ) {
			req.sourceUrl = req.url;
			res.redirect('/account.html?sourceUrl=' + req.url);	
		}
		else{
			res.send({
				c: 302,
				url: req.url
			});
		}
	}
	next();
}

module.exports = accountFilter;