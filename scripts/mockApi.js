// Mock API Implementation for Demo Mode (Backend-less)

const MockDB = {
    // Initial Data
    users: [
        { id: 'u1', email: 'admin@ayushcare.com', password: 'password123', fullName: 'System Admin', role: 'ADMIN' },
        { id: 'u2', email: 'ayurveda@demo.com', password: 'password123', fullName: 'Dr. Sharma', role: 'PRACTITIONER' },
        { id: 'u3', email: 'patient@demo.com', password: 'password123', fullName: 'Rajesh Kumar', role: 'PATIENT' }
    ],

    appointments: [
        {
            id: 'a1',
            practitioner: { user: { fullName: 'Dr. Sharma' }, id: 'p1' },
            patient: { user: { fullName: 'Rajesh Kumar' }, id: 'pat1' },
            scheduledAt: new Date(new Date().setHours(10, 0)).toISOString(), // Today 10am
            status: 'CONFIRMED',
            type: 'VIDEO',
            meetingLink: 'https://meet.google.com/abc-defg-hij'
        },
        {
            id: 'a2',
            practitioner: { user: { fullName: 'Dr. Sharma' }, id: 'p1' },
            patient: { user: { fullName: 'Priya Singh' }, id: 'pat2' },
            scheduledAt: new Date(new Date().setHours(14, 30)).toISOString(), // Today 2:30pm
            status: 'PENDING',
            type: 'IN_PERSON'
        },
        {
            id: 'a3',
            practitioner: { user: { fullName: 'Dr. Sharma' }, id: 'p1' },
            patient: { user: { fullName: 'Amit Patel' }, id: 'pat3' },
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
            status: 'CONFIRMED',
            type: 'VIDEO'
        }
    ]
};

// Mock Server Interface
class MockApiHandler {
    static async handleRequest(endpoint, method, body) {
        console.log(`[MockAPI] ${method} ${endpoint}`, body);

        await new Promise(r => setTimeout(r, 600)); // Simulate network latency

        // --- AUTH ROUTES ---
        if (endpoint === '/auth/login') {
            const user = MockDB.users.find(u => u.email === body.email && u.password === body.password);
            if (user) {
                return {
                    status: 'success',
                    token: 'mock-jwt-token-123',
                    data: { user: { ...user, password: undefined } }
                };
            }
            throw new Error('Incorrect email or password');
        }

        if (endpoint === '/auth/register') {
            const existing = MockDB.users.find(u => u.email === body.email);
            if (existing) throw new Error('Email already in use');

            const newUser = {
                id: `u${MockDB.users.length + 1}`,
                ...body
            };
            MockDB.users.push(newUser);
            return { status: 'success', data: { user: newUser } };
        }

        // --- APPOINTMENT ROUTES ---
        if (endpoint === '/appointments' && method === 'GET') {
            // Simplified: Return all appointments for demo
            // In real logic we'd filter by role, but for demo seeing data is better
            return {
                status: 'success',
                results: MockDB.appointments.length,
                data: { appointments: MockDB.appointments }
            };
        }

        // --- PRACTITIONER ROUTES ---
        if (endpoint === '/practitioners' && method === 'GET') {
            const practitioners = MockDB.users
                .filter(u => u.role === 'PRACTITIONER')
                .map(u => ({ id: `p_${u.id}`, user: u, specialities: ['AYURVEDA'] }));

            return {
                status: 'success',
                results: practitioners.length,
                data: { practitioners }
            };
        }

        return { message: 'Mock endpoint not implemented yet' };
    }
}

// Global flag to tell api.js to use this
window.USE_MOCK_API = true;
window.MockApiHandler = MockApiHandler;
console.log('✅ AYUSHCare Mock Backend System initialized');
