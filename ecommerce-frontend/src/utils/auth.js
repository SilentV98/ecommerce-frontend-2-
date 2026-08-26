// Initialize default mock accounts in localStorage if they don't exist
export function initAuth() {
    const users = JSON.parse(localStorage.getItem('users')) || [
        { email: 'customer@test.com', password: '123', role: 'customer', name: 'Test Customer' },
        { email: 'admin@test.com', password: '123', role: 'admin', name: 'Admin User' }
    ];
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Register a new user
export function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        throw new Error('Email already exists!');
    }

    const newUser = { name, email, password, role: 'customer' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}

// Login user
export function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password!');
    }

    const sessionData = { isLoggedIn: true, email: user.email, role: user.role, name: user.name };
    localStorage.setItem('user', JSON.stringify(sessionData));
    return sessionData;
}

// Logout user
export function logoutUser() {
    localStorage.removeItem('user');
}