const authService = require('../services/authService');

const { AppError } = require('../middlewares/errorMiddleware');

exports.sendOtp = async (req, res, next) => {
    try {
        const { contact } = req.body;
        if (!contact) {
            return next(new AppError('Please provide email or mobile number', 400));
        }

        const result = await authService.sendOtp(contact);

        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyOtp = async (req, res, next) => {
    try {
        const { contact, otp, role } = req.body;

        if (!contact || !otp) {
            return next(new AppError('Please provide contact and OTP', 400));
        }

        const { user, token } = await authService.verifyOtp(contact, otp, role);

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

exports.googleLogin = async (req, res, next) => {
    try {
        const { idToken, role } = req.body;

        const { user, token } = await authService.googleLogin(idToken, role);

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

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
