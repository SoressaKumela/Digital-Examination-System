export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/exam-system/api';

export const getHeaders = () => {
    const token = localStorage.getItem('exam_auth')
        ? JSON.parse(localStorage.getItem('exam_auth')!).token
        : null;

    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new Error(error.error || response.statusText);
    }
    // For 204 No Content
    if (response.status === 204) return null;
    return response.json();
};
