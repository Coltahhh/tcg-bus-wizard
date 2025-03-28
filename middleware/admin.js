// middleware/admin.js
export default (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    res.status(403).json({ msg: 'Admin access required' });
};