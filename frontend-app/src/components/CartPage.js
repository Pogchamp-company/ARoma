import React, {Component} from "react";
import {Link} from "react-router-dom";
import {checkCoupon, getShippingMethods} from "./utils/api";

export default class CartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shippingMethods: [],
            currentShippingMethod: undefined,
            couponErr: undefined,
            couponStr: '',
            coupon: undefined,
        }
        this.updateShippingMethods()
    }

    updateShippingMethods() {
        getShippingMethods(methods => this.setState({
                shippingMethods: methods,
                currentShippingMethod: methods[0]
            })
        )
    }

    applyCoupon(event) {
        checkCoupon(this.state.couponStr, coupon => {
            this.setState({
                coupon: coupon
            })
            // this.setState({shippingMethods: catalog_json["ShippingMethods"]})
            this.setState({couponErr: null})

        }, error => {
            this.setState({
                coupon: undefined,
                couponErr: error.message
            })
        })
    }

    getTotal() {
        return this.state.coupon === undefined ?
            this.props.cart.totalPrice() + (this.state.currentShippingMethod?.Price || 0) :
            this.props.cart.totalPrice() * (100 - this.state.coupon.Sale) / 100 + (this.state.currentShippingMethod?.Price || 0)
    }

    getDiscount() {
        return this.state.coupon === undefined ? 0 : this.props.cart.totalPrice() * this.state.coupon.Sale / 100
    }

    sendOrder() {
        if (this.props.token === undefined) {
            this.props.history.push("/login");
            return
        }

        const order = {
            "Products": this.props.cart.getCart().map((item, index) => {
                return {
                    ID: item.product.ID,
                    Quantity: item.amount,
                }
            }),
            "CouponCode": this.state.coupon?.Title,
            "ShippingMethod": this.state.currentShippingMethod.ID,
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
                'Authorization': this.props.token
            },
            method: "POST",
        })
            .then(response => response.json())
            .then((response_json) => {
                console.log('response_json', response_json)
                this.props.history.push(`/step2/${response_json.Order}`);
                this.props.cart.clearCart()
            })
            .catch((e) => console.log('TopProducts some error', e));
    }

    render() {
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
                                {this.props.cart.getCart().map((item, index) => (
                                    <tr style={{'--index': index}}>
                                        <td style={{
                                            width: '727px'
                                        }}>
                                            <div className="media">
                                                <div className="d-flex">
                                                    <img src={`https://picsum.photos/id/${item.product.ID}/263/280`}
                                                         style={{"--index": index}} className={"cart-image"} alt=""/>
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
                                                               this.props.cart.removeProduct(item.product.ID)
                                                               return
                                                           }
                                                           let value = parseInt(e.target.value)
                                                           this.props.cart.setAmount(item.product, value)
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
                                        <h5>${this.props.cart.totalPrice()}</h5>
                                    </td>
                                </tr>
                                <tr className="bottom_button">
                                    <td/>
                                    <td colSpan={3}>
                                        <div className="cupon_text d-flex">
                                            <input type="text" placeholder="Coupon Code"
                                                   value={this.state.couponStr}
                                                   onChange={e => {this.setState({couponStr: e.target.value})}}
                                                   className={this.state.couponErr === undefined ? "" : (this.state.couponErr ? "invalid" : "valid")}/>
                                            <button onClick={e => this.applyCoupon(e)} className="primary-btn">Apply
                                            </button>
                                        </div>
                                        <br/>
                                        {this.state.coupon !== undefined ?
                                            (
                                                <div style={{
                                                    whiteSpace: 'nowrap',
                                                    color: 'green',
                                                }}>Your coupon ({this.state.coupon.Title}) gives you
                                                    -{this.state.coupon.Sale}%</div>
                                            ) : ''}
                                        {this.state.couponErr !== undefined ?
                                            (
                                                <div style={{
                                                    whiteSpace: 'nowrap',
                                                    color: 'red',
                                                }}>{this.state.couponErr}</div>
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
                                                {this.state.shippingMethods.map((shippingMethod, index) => {
                                                    return (
                                                        <li><label
                                                            htmlFor={index}>{shippingMethod.Title}:
                                                            ${shippingMethod.Price}</label><input
                                                            className="pixel-radio"
                                                            type="radio" id={index}
                                                            name="catalog"
                                                            value={shippingMethod.ID}
                                                            checked={this.state.currentShippingMethod?.ID === shippingMethod.ID}
                                                            onChange={(e) => {
                                                                const method = this.state.shippingMethods.find((elem) => elem.ID === parseInt(e.target.value))
                                                                this.setState({
                                                                    currentShippingMethod: method
                                                                })
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
                                        <h5>${this.getDiscount()}</h5>
                                    </td>
                                </tr>
                                <tr>
                                    <td/>
                                    <td/>
                                    <td>
                                        <h5>Total</h5>
                                    </td>
                                    <td>
                                        <h5>${this.getTotal()}</h5>
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
                                                    onClick={() => this.sendOrder()}>Proceed to checkout
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
}
