const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.id);

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};
