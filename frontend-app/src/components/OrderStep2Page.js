import React, {Component} from "react";
import {serverUrl} from "./ServerUrl"

export default class OrderStep2Page extends Component{
    constructor(props) {
        super(props);
        this.state = {
            order: undefined
        }
        this.updateOrder()
    }

    updateOrder() {
        let url = `${serverUrl}/order?orderID=${this.props.match.params.orderId}`
        fetch(url)
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({
                    order: catalog_json["order"],
                })
            })
            .catch((e) => console.log('fetchProducts some error', e));
    }

    render() {
        if (this.state.order === undefined) return ''
        console.log(this.state)
        return (
            <section className="checkout_area section-margin--small">
                <div className="container">
                    <div className="billing_details">
                        <div className="row">
                            <div className="col-lg-8">
                                <h3>Billing Details</h3>
                                <form className="row contact_form" action="#" method="post" noValidate="novalidate">
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="first" name="name"/>
                                            <span className="placeholder" data-placeholder="First name"></span>
                                    </div>
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="last" name="name"/>
                                            <span className="placeholder" data-placeholder="Last name"></span>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <input type="text" className="form-control" id="company" name="company"
                                               placeholder="Company name"/>
                                    </div>
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="number" name="number"/>
                                            <span className="placeholder" data-placeholder="Phone number"></span>
                                    </div>
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="email" name="compemailany"/>
                                            <span className="placeholder" data-placeholder="Email Address"></span>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <select className="country_select">
                                            <option value="1">Country</option>
                                            <option value="2">Country</option>
                                            <option value="4">Country</option>
                                        </select>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input type="text" className="form-control" id="add1" name="add1"/>
                                            <span className="placeholder" data-placeholder="Address line 01"></span>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input type="text" className="form-control" id="add2" name="add2"/>
                                            <span className="placeholder" data-placeholder="Address line 02"></span>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input type="text" className="form-control" id="city" name="city"/>
                                            <span className="placeholder" data-placeholder="Town/City"></span>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <select className="country_select">
                                            <option value="1">District</option>
                                            <option value="2">District</option>
                                            <option value="4">District</option>
                                        </select>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <input type="text" className="form-control" id="zip" name="zip"
                                               placeholder="Postcode/ZIP"/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <div className="creat_account">
                                            <input type="checkbox" id="f-option2" name="selector"/>
                                                <label htmlFor="f-option2">Create an account?</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 form-group mb-0">
                                        <div className="creat_account">
                                            <h3>Shipping Details</h3>
                                            <input type="checkbox" id="f-option3" name="selector"/>
                                                <label htmlFor="f-option3">Ship to a different address?</label>
                                        </div>
                                        <textarea className="form-control" name="message" id="message" rows="1"
                                                  placeholder="Order Notes"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-4">
                                <div className="order_box">
                                    <h2>Your Order</h2>
                                    <ul className="list">
                                        <li><a href="#"><h4>Product <span>Total</span></h4></a></li>
                                        <li><a href="#">Fresh Blackberry <span className="middle">x 02</span> <span
                                            className="last">$720.00</span></a></li>
                                        <li><a href="#">Fresh Tomatoes <span className="middle">x 02</span> <span
                                            className="last">$720.00</span></a></li>
                                        <li><a href="#">Fresh Brocoli <span className="middle">x 02</span> <span
                                            className="last">$720.00</span></a></li>
                                    </ul>
                                    <ul className="list list_2">
                                        <li><a href="#">Subtotal <span>$2160.00</span></a></li>
                                        <li><a href="#">Shipping <span>Flat rate: $50.00</span></a></li>
                                        <li><a href="#">Total <span>$2210.00</span></a></li>
                                    </ul>
                                    <div className="payment_item">
                                        <div className="radion_btn">
                                            <input type="radio" id="f-option5" name="selector"/>
                                                <label htmlFor="f-option5">Check payments</label>
                                                <div className="check"></div>
                                        </div>
                                        <p>Please send a check to Store Name, Store Street, Store Town, Store State /
                                            County,
                                            Store Postcode.</p>
                                    </div>
                                    <div className="payment_item active">
                                        <div className="radion_btn">
                                            <input type="radio" id="f-option6" name="selector"/>
                                                <label htmlFor="f-option6">Paypal </label>
                                                <img src="img/product/card.jpg" alt=""/>
                                                    <div className="check"></div>
                                        </div>
                                        <p>Pay via PayPal; you can pay with your credit card if you don’t have a PayPal
                                            account.</p>
                                    </div>
                                    <div className="creat_account">
                                        <input type="checkbox" id="f-option4" name="selector"/>
                                            <label htmlFor="f-option4">I’ve read and accept the </label>
                                            <a href="#">terms & conditions*</a>
                                    </div>
                                    <div className="text-center">
                                        <a className="button button-paypal" href="#">Proceed to Paypal</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    )
    }
}