import {useState} from 'react';

export default function useToken() {
    const getToken = () => {
        return localStorage.getItem('token') || undefined
    };
    const [token, setToken] = useState(getToken());

    const saveToken = (userToken, isAdmin=false) => {
        if (userToken === undefined) {
            localStorage.removeItem('token')
            localStorage.removeItem('admin')
        } else {
            localStorage.setItem('token', userToken)
            localStorage.setItem('admin', isAdmin ? 'true' : 'false')
        }
        setToken(userToken);
    }

    const isAdmin = () => {
        const admin = localStorage.getItem('admin')
        if (admin === undefined) return false

        return admin === 'true'
    }

    return {
        setToken: saveToken,
        isAdmin,
        token
    }
}
