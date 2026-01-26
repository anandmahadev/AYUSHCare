document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const toggleAuth = document.getElementById('toggleAuth');
    const pageTitle = document.getElementById('pageTitle');
    const submitBtn = document.getElementById('submitBtn');
    const nameGroup = document.getElementById('nameGroup');
    const roleGroup = document.getElementById('roleGroup');
    const footerText = document.getElementById('footerText');
    const errorMessage = document.getElementById('errorMessage');

    let isRegister = false;

    // Toggle between Login and Register
    toggleAuth.addEventListener('click', () => {
        isRegister = !isRegister;

        if (isRegister) {
            pageTitle.textContent = 'Create Account';
            submitBtn.textContent = 'Register';
            nameGroup.style.display = 'block';
            roleGroup.style.display = 'block';
            footerText.textContent = 'Already have an account?';
            toggleAuth.textContent = 'Sign In';
            document.getElementById('fullName').required = true;
        } else {
            pageTitle.textContent = 'Sign In';
            submitBtn.textContent = 'Sign In';
            nameGroup.style.display = 'none';
            roleGroup.style.display = 'none';
            footerText.textContent = "Don't have an account?";
            toggleAuth.textContent = 'Create account';
            document.getElementById('fullName').required = false;
        }
    });

    // Handle Form Submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            let response;

            if (isRegister) {
                const fullName = document.getElementById('fullName').value;
                const role = document.getElementById('role').value;

                response = await Api.post('/auth/register', {
                    email, password, fullName, role
                });

                // Auto login after register? Or just alert.
                // The API register returns { data: { user } } but no token usually in basic implementations 
                // unless I updated it to return token. Let's check backend...
                // Backend register returns user but authController calls authService.register which returns newUser (no token).
                // So we need to ask user to login or auto-login.

                alert('Registration successful! Please sign in.');
                window.location.reload();
                return;

            } else {
                response = await Api.post('/auth/login', {
                    email, password
                });

                // Save Token
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirect to Dashboard
                window.location.href = 'dashboard.html';
            }

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = isRegister ? 'Register' : 'Sign In';
        }
    });
});
