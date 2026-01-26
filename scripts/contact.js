// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Validate form
            if (!data.firstName || !data.lastName || !data.email || !data.userType) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Simulate form submission
            console.log('Form submitted:', data);

            // Hide form and show success message
            contactForm.style.display = 'none';
            formSuccess.classList.add('active');

            // Optional: Reset form after 5 seconds and show it again
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                formSuccess.classList.remove('active');
            }, 5000);

            // In a real application, you would send this data to your backend:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                contactForm.style.display = 'none';
                formSuccess.classList.add('active');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
            */
        });
    }

    // Dynamic speciality field visibility
    const userTypeSelect = document.getElementById('userType');
    const specialityGroup = document.getElementById('speciality');

    if (userTypeSelect && specialityGroup) {
        userTypeSelect.addEventListener('change', function () {
            if (this.value === 'practitioner') {
                specialityGroup.parentElement.style.display = 'flex';
            } else {
                specialityGroup.parentElement.style.display = 'none';
                specialityGroup.value = '';
            }
        });
    }
});
