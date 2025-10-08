import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.PUBLIC_CRYPTO_SECRET || 'anfibius-secret-key-2025';

export const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): string | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error al desencriptar:', error);
        return null;
    }
};

export const encryptForUrl = (data: string): string => {
    const encrypted = encryptData(data);
    return encodeURIComponent(encrypted);
};

export const decryptFromUrl = (encryptedData: string): string | null => {
    try {
        const decoded = decodeURIComponent(encryptedData);
        return decryptData(decoded);
    } catch (error) {
        console.error('Error al decodificar:', error);
        return null;
    }
};