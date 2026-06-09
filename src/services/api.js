// API service helper
export const API_URL =
    import.meta.env.VITE_API_URL || '/api';

const handleResponse = async(response) => {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(data?.error || data?.message || 'API request failed');
    }

    return data;
};

export const apiCall = async(endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        return handleResponse(response);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Backend returned an invalid response. Restart the server with npm run dev.');
        }

        if (error.message && error.message !== 'Failed to fetch') {
            throw error;
        }

        throw new Error('Backend server is not running. Start it with npm run dev.');
    }
};

// Auth API
export const authAPI = {
    login: (userId, password) =>
        apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ userId, password }),
        }),
    signup: (userId, password, name, role) =>
        apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ userId, password, name, role }),
        }),
};

// Students API
export const studentsAPI = {
    getAll: () => apiCall('/students'),
    getOne: (id) => apiCall(`/students/${id}`),
    create: (student) =>
        apiCall('/students', {
            method: 'POST',
            body: JSON.stringify(student),
        }),
    updateMarks: (id, marks) =>
        apiCall(`/students/${id}/marks`, {
            method: 'PUT',
            body: JSON.stringify(marks),
        }),
    updateAttendance: (id, attendance) =>
        apiCall(`/students/${id}/attendance`, {
            method: 'PUT',
            body: JSON.stringify({ attendance }),
        }),
    updateFees: (id, paid) =>
        apiCall(`/students/${id}/fees`, {
            method: 'PUT',
            body: JSON.stringify({ paid }),
        }),
    addAttendanceLog: (id, month, value) =>
        apiCall(`/students/${id}/attendance-log`, {
            method: 'POST',
            body: JSON.stringify({ month, value }),
        }),
};

// Teachers API
export const teachersAPI = {
    getAll: () => apiCall('/teachers'),
    getOne: (id) => apiCall(`/teachers/${id}`),
    update: (id, data) =>
        apiCall(`/teachers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    addSchedule: (id, schedule) =>
        apiCall(`/teachers/${id}/schedule`, {
            method: 'POST',
            body: JSON.stringify(schedule),
        }),
    deleteSchedule: (id, scheduleId) =>
        apiCall(`/teachers/${id}/schedule/${scheduleId}`, {
            method: 'DELETE',
        }),
};
