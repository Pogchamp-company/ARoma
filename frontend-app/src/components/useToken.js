import {useState} from 'react';

export default function useToken() {
    const getToken = () => {
        return localStorage.getItem('token') || undefined
    };
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        console.log(localStorage)
        if (userToken === undefined) {
            console.log('dmakldjdakfjsdkfjsdfjsdjfjjfklsdjf')
            localStorage.removeItem('token')
        } else {
            localStorage.setItem('token', userToken)
        }
        console.log(localStorage)
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token
    }
}
