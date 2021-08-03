import {useState} from 'react';

export default function useCart() {
    const getCart = () => {
        const cartString = localStorage.getItem('cart');
        if (cartString != null) return JSON.parse(cartString)

        return []
    };

    const [cart, setCart] = useState(getCart());

    const saveCart = userCart => {
        localStorage.setItem('cart', JSON.stringify(userCart));
        setCart(userCart);
    };

    const addToCart = (product, amount) => {
        const productId = product.ID
        const cart = getCart()
        const item = cart.find((element) => element.product.ID === productId)
        if (item === undefined) {
            cart.push({
                product: product,
                amount: amount,
            })
        } else {
            item.amount += amount
        }
        saveCart(cart)
    }

    const setAmount = (productId, amount) => {
        const cart = getCart()
        const item = cart.find((element) => element.product.ID === productId)
        if (item === undefined) return
        console.log(amount)

        item.amount = amount

        saveCart(cart)
    }
    
    const removeProduct = (productId) => {
        let cart = getCart()
        cart = cart.filter((element) => element.product.ID !== productId)
        saveCart(cart)
    }

    const totalAmount = () => {
        const cart = getCart()
        return cart.reduce((previousValue, currentValue, index, array) => {
            return previousValue + currentValue.amount
        }, 0)
    }

    const getAmount = (productId) => {
        console.log(productId)
        const item = cart.find((element) => element.product.ID === productId)
        console.log(item)
        return item?.amount
    }

    return {
        getCart: getCart,
        setCart: saveCart,
        cart: cart,
        addToCart: addToCart,
        setAmount: setAmount,
        totalAmount: totalAmount,
        getAmount: getAmount,
        removeProduct: removeProduct
    }
}
