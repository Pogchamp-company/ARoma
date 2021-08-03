import React, {Component} from "react";

export default class CartPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="cart_area">
                <div className="container">
                    <div className="cart_inner">
                        <div className="table-responsive">
                            <table className="table">
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
                                    <tr>
                                        <td>
                                            <div className="media">
                                                <div className="d-flex">
                                                    <img src="img/cart/cart1.png" alt=""/>
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
                                                       onChange={(e) => {
                                                           console.log(e.target.value)
                                                           if (e.target.value === '0') {
                                                               this.props.cart.removeProduct(item.product.ID)
                                                               return
                                                           }
                                                           this.props.cart.setAmount(item.product.ID, parseInt(e.target.value))
                                                       }}/>
                                            </div>
                                        </td>
                                        <td>
                                            <h5>${item.amount * item.product.Price}</h5>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bottom_button">
                                    <td>
                                        <a className="button" href="#">Update Cart</a>
                                    </td>
                                    <td>

                                    </td>
                                    <td>

                                    </td>
                                    <td>
                                        <div className="cupon_text d-flex align-items-center">
                                            <input type="text" placeholder="Coupon Code"/>
                                            <a className="primary-btn" href="#">Apply</a>
                                            <a className="button" href="#">Have a Coupon?</a>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>

                                    </td>
                                    <td>

                                    </td>
                                    <td>
                                        <h5>Subtotal</h5>
                                    </td>
                                    <td>
                                        <h5>$2160.00</h5>
                                    </td>
                                </tr>
                                <tr className="shipping_area">
                                    <td className="d-none d-md-block">

                                    </td>
                                    <td>

                                    </td>
                                    <td>
                                        <h5>Shipping</h5>
                                    </td>
                                    <td>
                                        <div className="shipping_box">
                                            <ul className="list">
                                                <li><a href="#">Flat Rate: $5.00</a></li>
                                                <li><a href="#">Free Shipping</a></li>
                                                <li><a href="#">Flat Rate: $10.00</a></li>
                                                <li className="active"><a href="#">Local Delivery: $2.00</a></li>
                                            </ul>
                                            <h6>Calculate Shipping <i className="fa fa-caret-down"
                                                                      aria-hidden="true"></i>
                                            </h6>
                                            <select className="shipping_select">
                                                <option value="1">Bangladesh</option>
                                                <option value="2">India</option>
                                                <option value="4">Pakistan</option>
                                            </select>
                                            <select className="shipping_select">
                                                <option value="1">Select a State</option>
                                                <option value="2">Select a State</option>
                                                <option value="4">Select a State</option>
                                            </select>
                                            <input type="text" placeholder="Postcode/Zipcode"/>
                                            <a className="gray_btn" href="#">Update Details</a>
                                        </div>
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
                                            <a className="gray_btn" href="#">Continue Shopping</a>
                                            <a className="primary-btn ml-2" href="#">Proceed to checkout</a>
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
