import {serverUrl} from "../ServerUrl";

function getProduct(productID, successCallback, errorCallback=null) {
    fetch(`${serverUrl}/product/${productID}`)
        .then(response => response.json())
        .then(product_json => successCallback(product_json.obj))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getProduct error: ', e)
        });
}

function getAllCatalogs(successCallback, errorCallback=null) {
    fetch(`${serverUrl}/catalog`)
        .then(response => response.json())
        .then(catalog_json => successCallback(catalog_json.catalogs))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getCatalogs error: ', e)
        });
}

function getCatalog(catalogID, successCallback, errorCallback=null) {
    fetch(`${serverUrl}/catalog/${catalogID}`)
        .then(response => response.json())
        .then(catalog_json => successCallback(catalog_json.obj))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getCatalog error: ', e)
        });
}

function getTopProducts(successCallback, errorCallback=null) {
    fetch(`${serverUrl}/product/top`)
        .then(response => response.json())
        .then(products_json => successCallback(products_json.products))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getTopProducts error: ', e)
        });

}

function loginRequiredFetch(token, history, setToken, input, init={}) {
    return fetch(input, {
        ...init,
        headers: {
            'Authorization': token
        }
    }).then((response) => {
        if (response.status === 401) {
            setToken(undefined)
            history.push("/login");
            throw new Error('Unregistered');
        }
        return response
    })
}

function getOrdersList(token, history, setToken, successCallback, errorCallback=null) {
    loginRequiredFetch(token, history, setToken, `${serverUrl}/order/all`)
        .then(response => response.json())
        .then(catalog_json => successCallback(catalog_json.orders))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('GetOrdersList error: ', e)
        });
}

function getShippingMethods(successCallback, errorCallback=null) {
    fetch(`${serverUrl}/order/shipping_methods`)
        .then(response => response.json())
        .then(shipping_methods_json => {
            successCallback(shipping_methods_json.ShippingMethods)
        })
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getShippingMethods error: ', e)
        });

}

function checkCoupon(coupon, successCallback, errorCallback=null) {
    fetch(`${serverUrl}/order/check_coupon?couponTitle=${coupon}`, {cache: "no-cache"})
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            if (response.status === 404) throw new Error('No coupon found')
            if (response.status === 410) throw new Error('Your coupon expired')
        })
        .then(catalog_json => successCallback(catalog_json.Coupon))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('checkCoupon error: ', e)
        });

}

export {
    getProduct,
    getAllCatalogs,
    getCatalog,
    getOrdersList,
    getTopProducts,
    getShippingMethods,
    checkCoupon,
}