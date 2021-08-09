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
        if (product.QuantityInStock === 0) return
        const productId = product.ID
        const cart = getCart()
        let item = cart.find((element) => element.product.ID === productId)
        console.log(product)
        if (item === undefined) {
            item = {
                product: product,
                amount: amount,
            }
            cart.push(item)
        } else {
            item.amount += amount
        }
        if (item.amount > product.QuantityInStock) item.amount = product.QuantityInStock
        saveCart(cart)
        return item.amount
    }

    const setAmount = (product, amount) => {
        if (product.QuantityInStock === 0) return
        const cart = getCart()
        const item = cart.find((element) => element.product.ID === product.ID)
        if (item === undefined) return

        item.amount = amount
        if (item.amount > product.QuantityInStock) item.amount = product.QuantityInStock

        saveCart(cart)
        return item.amount
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

    const totalPrice = () => {
        const cart = getCart()
        return cart.reduce((previousValue, currentValue, index, array) => {
            return previousValue + currentValue.product.Price * currentValue.amount
        }, 0)
    }

    const getAmount = (productId) => {
        const item = cart.find((element) => element.product.ID === productId)
        return item?.amount || 0
    }

    const clearCart = () => {
        saveCart([])
    }

    return {
        getCart: getCart,
        setCart: saveCart,
        cart: cart,
        addToCart: addToCart,
        setAmount: setAmount,
        totalAmount: totalAmount,
        getAmount: getAmount,
        removeProduct: removeProduct,
        totalPrice: totalPrice,
        clearCart: clearCart,
    }
}
