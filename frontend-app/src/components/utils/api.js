import {serverUrl} from "./ServerUrl";

function getProduct(productID, successCallback, errorCallback = null) {
    fetch(`${serverUrl}/product/${productID}`)
        .then(response => response.json())
        .then(product_json => successCallback(product_json.obj))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getProduct error: ', e)
        });
}

function getAllCatalogs(successCallback, errorCallback = null) {
    fetch(`${serverUrl}/catalog`)
        .then(response => response.json())
        .then(success_json => successCallback(success_json.catalogs))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getCatalogs error: ', e)
        });
}

function getCatalog(catalogID, successCallback, errorCallback = null) {
    fetch(`${serverUrl}/catalog/${catalogID}`)
        .then(response => response.json())
        .then(success_json => successCallback(success_json.obj))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getCatalog error: ', e)
        });
}

function getTopProducts(successCallback, errorCallback = null) {
    fetch(`${serverUrl}/product/top`)
        .then(response => response.json())
        .then(products_json => successCallback(products_json.products))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getTopProducts error: ', e)
        });

}

function loginRequiredFetch(token, history, setToken, input, init = {}) {
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

function getOrdersList(page, token, history, setToken, successCallback, errorCallback = null) {
    loginRequiredFetch(token, history, setToken, `${serverUrl}/order/all?page=${page}`)
        .then(response => response.json())
        .then(success_json => successCallback(success_json))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('GetOrdersList error: ', e)
        });
}

function getShippingMethods(successCallback, errorCallback = null) {
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

function checkCoupon(coupon, successCallback, errorCallback = null) {
    fetch(`${serverUrl}/order/check_coupon?couponTitle=${coupon}`, {cache: "no-cache"})
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            if (response.status === 404) throw new Error('No coupon found')
            if (response.status === 410) throw new Error('Your coupon expired')
        })
        .then(success_json => successCallback(success_json.Coupon))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('checkCoupon error: ', e)
        });

}

function getOrder(orderId, context, history, successCallback, errorCallback = null) {
    let url = `${serverUrl}/order?orderID=${orderId}`
    loginRequiredFetch(context.token, history, context.setToken, url)
        .then(response => response.json())
        .then(success_json => {
            successCallback(success_json.order)
        })
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('getOrder error: ', e)
        });

}

function sendOrder(orderId, body, context, history, successCallback, errorCallback = null) {
    let url = `${serverUrl}/order/step2?orderID=${orderId}`
    loginRequiredFetch(context.token, history, context.setToken, url, {body: body, method: 'POST'})
        .then(response => response.json())
        .then(success_json => {
            successCallback(success_json)
        })
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('sendOrder error: ', e)
        });

}

function payOrder(orderId, context, history, successCallback, errorCallback = null) {
    let url = `${serverUrl}/order/step3?orderID=${orderId}`
    loginRequiredFetch(context.token, history, context.setToken, url, {method: 'POST'})
        .then(response => response.json())
        .then(success_json => {
            successCallback(success_json)
        })
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('payOrder error: ', e)
        });
}

function trackOrder(orderId, trackingNumber, context, history, successCallback, errorCallback = null) {
    let url = `${serverUrl}/order/update_tracking_number?orderID=${orderId}&trackingNumber=${trackingNumber}`
    loginRequiredFetch(context.token, history, context.setToken, url, {method: 'PUT'})
        .then(response => response.json())
        .then(success_json => {
            successCallback(success_json)
        })
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('trackOrder error: ', e)
        });
}

function deliverOrder(orderId, context, history, successCallback, errorCallback = null) {
    let url = `${serverUrl}/order/to_awaiting_receipt?orderID=${orderId}`
    loginRequiredFetch(context.token, history, context.setToken, url, {method: 'PUT'})
        .then(response => response.json())
        .then(success_json => {
            successCallback(success_json)
        })
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('deliverOrder error: ', e)
        });
}

function completeOrder(orderId, context, history, successCallback, errorCallback = null) {
    let url = `${serverUrl}/order/to_completed?orderID=${orderId}`
    loginRequiredFetch(context.token, history, context.setToken, url, {method: 'PUT'})
        .then(response => response.json())
        .then(success_json => {
            successCallback(success_json)
        })
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('completeOrder error: ', e)
        });
}

function uploadProductPhoto(productId, photo_file, context, history, successCallback, errorCallback = null) {
    const data = new FormData();

    data.set('photo', photo_file)

    loginRequiredFetch(context.token, history, context.setToken, `${serverUrl}/product/photo?productID=${productId}`, {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(attachment_json => successCallback(attachment_json))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('uploadProductPhoto error: ', e)
        });
}

function removeProductPhoto(productId, photoId, context, history, successCallback, errorCallback = null) {

    loginRequiredFetch(context.token, history, context.setToken, `${serverUrl}/product/photo?productID=${productId}&attachmentID=${photoId}`,
        {method: 'DELETE'},
    )
        .then(response => response.json())
        .then(attachment_json => successCallback(attachment_json))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('removeProductPhoto error: ', e)
        });
}

function deleteProduct(productId, context, history, successCallback, errorCallback = null) {
    loginRequiredFetch(context.token, history, context.setToken, `${serverUrl}/admin/product?productID=${productId}`,
        {method: 'DELETE'},
    )
        .then(response => response.json())
        .then(attachment_json => successCallback(attachment_json))
        .catch((e) => {
            if (errorCallback !== null) errorCallback(e)
            else console.log('deleteProduct error: ', e)
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
    getOrder,
    sendOrder,
    payOrder,
    uploadProductPhoto,
    removeProductPhoto,
    deleteProduct,
    trackOrder,
    deliverOrder,
    completeOrder,
}