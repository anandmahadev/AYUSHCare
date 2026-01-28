document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const toggleAuth = document.getElementById('toggleAuth');
    const pageTitle = document.getElementById('pageTitle');
    const submitBtn = document.getElementById('submitBtn');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const nameGroup = document.getElementById('nameGroup');
    const roleGroup = document.getElementById('roleGroup');
    const otpGroup = document.getElementById('otpGroup');
    const googleBtn = document.getElementById('googleBtn');
    const footerText = document.getElementById('footerText');
    const errorMessage = document.getElementById('errorMessage');

    let isRegister = false;
    let otpSent = false;

    // Toggle between Login and Register
    toggleAuth.addEventListener('click', () => {
        isRegister = !isRegister;
        resetForm();

        if (isRegister) {
            pageTitle.textContent = 'Create Account';
            nameGroup.style.display = 'block';
            roleGroup.style.display = 'block';
            footerText.textContent = 'Already have an account?';
            toggleAuth.textContent = 'Sign In';
            document.getElementById('fullName').required = true;
        } else {
            pageTitle.textContent = 'Sign In';
            nameGroup.style.display = 'none';
            roleGroup.style.display = 'none';
            footerText.textContent = "Don't have an account?";
            toggleAuth.textContent = 'Create account';
            document.getElementById('fullName').required = false;
        }
    });

    function resetForm() {
        otpSent = false;
        otpGroup.style.display = 'none';
        sendOtpBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        errorMessage.style.display = 'none';
        document.getElementById('otp').value = '';
    }

    // Send OTP
    sendOtpBtn.addEventListener('click', async () => {
        const contact = document.getElementById('email').value;
        if (!contact) {
            showError('Please enter email or mobile number');
            return;
        }

        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending...';
        errorMessage.style.display = 'none';

        try {
            await Api.post('/auth/send-otp', { contact });

            otpSent = true;
            otpGroup.style.display = 'block';
            sendOtpBtn.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.textContent = 'Verify & Sign In';

            alert('OTP Sent! (Check server console for code)');
        } catch (error) {
            showError(error.message);
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';
        }
    });

    // Handle Link with Google
    googleBtn.addEventListener('click', async () => {
        const email = prompt("Simulating Google Login.\nEnter your Google Email:");
        if (!email) return;

        try {
            const role = isRegister ? document.getElementById('role').value : undefined;
            const response = await Api.post('/auth/google', { idToken: email, role }); // Mocking idToken as email
            handleLoginSuccess(response);
        } catch (error) {
            showError(error.message);
        }
    });

    // Handle Form Submission (Verify OTP)
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';

        if (!otpSent) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';

        const contact = document.getElementById('email').value;
        const otp = document.getElementById('otp').value;
        const role = document.getElementById('role').value; // Default PATIENT if hidden? No, select has default value.

        try {
            const response = await Api.post('/auth/verify-otp', {
                contact,
                otp,
                role: isRegister ? role : undefined // Only send role if registering/creating account explicitly
            });

            handleLoginSuccess(response);

        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Verify & Sign In';
        }
    });

    async function handleLoginSuccess(response) {
        localStorage.setItem('token', response.token);

        try {
            // Fetch full profile to check verification status
            const profileResponse = await Api.get('/auth/me');
            const user = profileResponse.data.user;
            localStorage.setItem('user', JSON.stringify(user));

            // Check verification for practitioners
            if (user.role === 'PRACTITIONER') {
                const status = user.practitionerProfile?.verificationStatus; // PENDING, APPROVED, REJECTED

                if (status === 'PENDING' || !status) {
                    // Redirect to verification if pending or undefined
                    window.location.href = 'verification.html';
                } else if (status === 'APPROVED') {
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Your verification status is: ' + status);
                    window.location.href = 'index.html';
                }
            } else {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Profile fetch failed', error);
            // Fallback
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = 'dashboard.html';
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.style.display = 'block';
    }
});
