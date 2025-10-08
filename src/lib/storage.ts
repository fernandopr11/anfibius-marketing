import type { User } from '@/types/auth.types';

export const storage = {
    saveToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
        }
    },

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('access_token');
        }
        return null;
    },

    removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
        }
    },

    saveUser(user: User) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    getUser(): User | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    removeUser() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    },

    clearAll() {
        this.removeToken();
        this.removeUser();
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};