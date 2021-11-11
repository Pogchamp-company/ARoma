import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {checkCoupon, getShippingMethods} from "./utils/api";
import {PropsContext} from "./Context";
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import useCoupon from "./hooks/useCoupon";
import {ProductPreviewImage} from "./ProductPreviewImage";


export default function CartPage(props) {
    const context = useContext(PropsContext)
    const history = useHistory()

    const [shippingMethods, setShippingMethods] = useState([])
    const [currentShippingMethod, setCurrentShippingMethod] = useState(undefined)
    const [couponErr, setCouponErr] = useState(undefined)
    const [couponStr, setCouponStr] = useState('')

    const {coupon, saveCoupon, clearCoupon} = useCoupon()

    useEffect(() => {
        getShippingMethods(methods => {
            setShippingMethods(methods)
            setCurrentShippingMethod(methods[0])
        })
    }, [])

    function applyCoupon() {
        checkCoupon(couponStr, coupon => {
            // setCoupon(coupon)
            saveCoupon(coupon)
            setCouponErr(null)
        }, error => {
            // setCoupon(undefined)
            setCouponErr(error.message)
        })
    }

    function getTotal() {
        return coupon === undefined ?
            context.cart.totalPrice() + (currentShippingMethod?.Price || 0) :
            context.cart.totalPrice() * (100 - coupon.Sale) / 100 + (currentShippingMethod?.Price || 0)
    }

    function getDiscount() {
        return coupon === undefined ? 0 : context.cart.totalPrice() * coupon.Sale / 100
    }

    function sendOrder() {
        if (context.token === undefined) {
            history.push("/login");
            return
        }

        const order = {
            "Products": context.cart.getCart().map((item, index) => {
                return {
                    ID: item.product.ID,
                    Quantity: item.amount,
                }
            }),
            "CouponCode": coupon?.Title,
            "ShippingMethod": currentShippingMethod.ID,
        }
        console.log(order)

        let url = `${serverUrl}/order/step1`
        const data = new FormData();

        data.set('Products', JSON.stringify(order.Products))
        if (order.CouponCode !== undefined) data.set('CouponCode', order.CouponCode)
        data.set('ShippingMethod', order.ShippingMethod)

        fetch(url, {
            body: data,
            headers: {
                'Authorization': context.token
            },
            method: "POST",
        })
            .then(response => response.json())
            .then((response_json) => {
                console.log('response_json', response_json)
                history.push(`/step2/${response_json.Order}`);
                clearCoupon()
                context.cart.clearCart()
            })
            .catch((e) => console.log('TopProducts some error', e));
    }


    return (
        <section className="cart_area">
            <div className="container">
                <div className="cart_inner">
                    <div className="table-responsive">
                        <table className="table cart-table">
                            <thead>
                            <tr>
                                <th scope="col">Product</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {context.cart.getCart().map((item, index) => (
                                <tr style={{'--index': index}}>
                                    <td style={{
                                        width: '727px'
                                    }}>
                                        <div className="media">
                                            <div className="d-flex">
                                                <ProductPreviewImage product={item.product}
                                                                     style={{"--index": index}}
                                                                     className={"cart-image"}/>
                                            </div>
                                            <div className="media-body">
                                                <p>{item.product.Title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5>${item.product.Price}</h5>
                                    </td>
                                    <td>
                                        <div className="product_count">
                                            <input type="number" name="qty" id="sst" maxLength="12"
                                                   value={item.amount}
                                                   title="Quantity:"
                                                   className="input-text qty"
                                                   min={0}
                                                   max={999}
                                                   onChange={(e) => {
                                                       if (e.target.value === '0') {
                                                           context.cart.removeProduct(item.product.ID)
                                                           return
                                                       }
                                                       let value = parseInt(e.target.value)
                                                       context.cart.setAmount(item.product, value)
                                                   }}/>
                                        </div>
                                    </td>
                                    <td>
                                        <h5>${item.amount * item.product.Price}</h5>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td/>
                                <td/>
                                <td>
                                    <h5>Subtotal</h5>
                                </td>
                                <td>
                                    <h5>${context.cart.totalPrice()}</h5>
                                </td>
                            </tr>
                            <tr className="bottom_button">
                                <td/>
                                <td colSpan={3}>
                                    <div className="cupon_text d-flex">
                                        <input type="text" placeholder="Coupon Code"
                                               value={couponStr}
                                               onChange={e => setCouponStr(e.target.value)}
                                               className={couponErr === undefined ? "" : (couponErr ? "invalid" : "valid")}/>

                                        <button onClick={e => applyCoupon(e)} className="primary-btn">Apply</button>
                                    </div>
                                    <br/>
                                    {coupon !== undefined ?
                                        (
                                            <div style={{
                                                whiteSpace: 'nowrap',
                                                color: 'green',
                                            }}>Your coupon ({coupon.Title}) gives you
                                                -{coupon.Sale}%</div>
                                        ) : ''}
                                    {couponErr !== undefined ?
                                        (
                                            <div style={{
                                                whiteSpace: 'nowrap',
                                                color: 'red',
                                            }}>{couponErr}</div>
                                        ) : ''
                                    }
                                </td>
                            </tr>
                            <tr className="shipping_area">
                                <td className="d-none d-md-block"/>
                                <td/>
                                <td>
                                    <h5>Shipping</h5>
                                </td>
                                <td>
                                    <div className="shipping_box">
                                        <ul className="list">
                                            {shippingMethods.map((shippingMethod, index) => {
                                                return (
                                                    <li><label
                                                        htmlFor={index}>{shippingMethod.Title}:
                                                        ${shippingMethod.Price}</label><input
                                                        className="pixel-radio"
                                                        type="radio" id={index}
                                                        name="catalog"
                                                        value={shippingMethod.ID}
                                                        checked={currentShippingMethod?.ID === shippingMethod.ID}
                                                        onChange={(e) => {
                                                            const method = shippingMethods.find((elem) => elem.ID === parseInt(e.target.value))
                                                            setCurrentShippingMethod(method)
                                                        }}/></li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td/>
                                <td/>
                                <td>
                                    <h5>Discount</h5>
                                </td>
                                <td>
                                    <h5>${getDiscount()}</h5>
                                </td>
                            </tr>
                            <tr>
                                <td/>
                                <td/>
                                <td>
                                    <h5>Total</h5>
                                </td>
                                <td>
                                    <h5>${getTotal()}</h5>
                                </td>
                            </tr>
                            <tr className="out_button_area">
                                <td className="d-none-l">

                                </td>
                                <td className="">

                                </td>
                                <td>

                                </td>
                                <td>
                                    <div className="checkout_btn_inner d-flex align-items-center">
                                        <Link className="gray_btn" to="/search_products/#">Continue Shopping</Link>
                                        <button className="primary-btn ml-2"
                                                onClick={() => sendOrder()}>Proceed to checkout
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )

}
