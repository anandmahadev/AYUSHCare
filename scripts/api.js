const API_URL = 'http://localhost:3000/api';

class Api {
    static get token() {
        return localStorage.getItem('token');
    }

    static get headers() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    static async request(endpoint, options = {}) {
        // --- MOCK MODE INTERCEPTOR ---
        if (window.USE_MOCK_API && window.MockApiHandler) {
            try {
                const method = options.method || 'GET';
                const body = options.body ? JSON.parse(options.body) : null;
                const data = await window.MockApiHandler.handleRequest(endpoint, method, body);
                return data;
            } catch (error) {
                console.error('Mock API Error:', error);
                // Simulate fetch error structure
                throw error;
            }
        }
        // -----------------------------

        const url = `${API_URL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized (Token expired/invalid)
            if (response.status === 401) {
                this.logout();
                return null; // Stop processing
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    static async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    static async patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    static isAuthenticated() {
        return !!this.token;
    }
}

// Check auth on protected pages
function requireAuth() {
    if (!Api.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
