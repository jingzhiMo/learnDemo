module.exports = function(req, res, next) {
    if ( req.headers['x-pjax'] === 'true' ) {
        req.query.pjax = true;
    }
    else {
        req.query.pjax = false;
    }
    next();
};
