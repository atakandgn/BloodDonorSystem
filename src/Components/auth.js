// auth.js
import { jwtDecode } from 'jwt-decode';

export const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

export const getDecodedToken = () => {
    const token = getToken();
    if (token) {
        const decodedToken = jwtDecode(token);
        // Log the decoded token only when needed
        console.log("decoded token:", decodedToken);
        return decodedToken;
    }
    return null;
};
