/**
 * Modular validation utilities for AYUSHCare forms.
 */
export const Validation = {
    /**
     * Validates an email address.
     * @param {string} email 
     * @returns {boolean}
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validates password strength (min 8 chars).
     * @param {string} password 
     * @returns {boolean}
     */
    isStrongPassword(password) {
        return password && password.length >= 8;
    },

    /**
     * Validates if a string is not empty.
     * @param {string} str 
     * @returns {boolean}
     */
    isNotEmpty(str) {
        return str && str.trim().length > 0;
    }
};

window.Validation = Validation;
