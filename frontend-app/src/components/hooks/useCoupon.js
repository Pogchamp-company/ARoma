import {useState} from "react";

export default function useCoupon() {
    const getCoupon = () => {
        console.log('getting coupon')
        const couponString = localStorage.getItem('coupon')
        if (couponString != null) return JSON.parse(couponString)

        return undefined
    };

    const [coupon, setCoupon] = useState(getCoupon);

    const saveCoupon = couponCode => {
        console.log('saving', couponCode)
        localStorage.setItem('coupon', JSON.stringify(couponCode))
        setCoupon(couponCode);
    };

    const clearCoupon = () => {
        console.log('removing coupon')
        localStorage.removeItem('coupon')
    };

    return {coupon, saveCoupon, clearCoupon}

}