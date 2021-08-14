import React, {Component} from "react";
import OrderTotalBox from "./OrderTotalBox";
import {PropsContext} from "./Context";
import {getOrder, sendOrder} from "./utils/api";

export default class OrderStep2Page extends Component {
    static contextType = PropsContext

    constructor(props, context) {
        super(props, context);
        this.state = {
            order: undefined
        }
        this.updateOrder()
        this.references = {
            first: React.createRef(),
            last: React.createRef(),
            number: React.createRef(),
            country: React.createRef(),
            city: React.createRef(),
            route: React.createRef(),
            zip: React.createRef(),
            message: React.createRef(),
        }
    }

    updateOrder() {
        getOrder(this.props.match.params.orderId, this.context, this.props.history, order => this.setState({order: order}))
    }

    isValid() {
        return ['first', 'last', 'number', 'country', 'city', 'route', 'zip', 'message',
        ].every(elem => {
            return Boolean(this.references[elem].current.value)
        })
    }

    handleSendOrder() {
        console.log(this.isValid())
        if (!this.isValid()) return

        const data = new FormData();

        data.set("first", this.references.first.current.value)
        data.set("last", this.references.last.current.value)
        data.set("phoneNumber", this.references.number.current.value)
        data.set("country", this.references.country.current.value)
        data.set("city", this.references.city.current.value)
        data.set("route", this.references.route.current.value)
        data.set("zip", this.references.zip.current.value)
        data.set("message", this.references.message.current.value)

        sendOrder(this.state.order.ID, data, this.context, this.props.history, () => {
            console.log("orderrrrrrrr SenDeD!!!!!!!!")
        })
    }

    render() {
        if (this.state.order === undefined) return ''
        console.log(this.context)
        return (
            <section className="checkout_area section-margin--small">
                <div className="container">
                    <div className="billing_details">
                        <div className="row">
                            <div className="col-lg-8">
                                <h3>Billing Details</h3>
                                <form className="row contact_form" action="#" method="post" noValidate="novalidate">
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="first"
                                               ref={this.references['first']} name="name" placeholder="First name"/>
                                    </div>
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="last"
                                               ref={this.references['last']} name="name" placeholder="Last name"/>
                                    </div>
                                    <div className="col-md-6 form-group p_star">
                                        <input type="text" className="form-control" id="number"
                                               ref={this.references['number']} name="number"
                                               placeholder="Phone number"/>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input type="text" className="form-control" id="country"
                                               ref={this.references['country']} name="country"
                                               placeholder="Country"/>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input type="text" className="form-control" id="city"
                                               ref={this.references['city']} name="city" placeholder="Town/City"/>
                                    </div>
                                    <div className="col-md-12 form-group p_star">
                                        <input type="text" className="form-control" id="route"
                                               ref={this.references['route']} name="route"
                                               placeholder="Street, House"/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <input type="text" className="form-control" id="zip"
                                               ref={this.references['zip']} name="zip"
                                               placeholder="Postcode/ZIP"/>
                                    </div>
                                    <div className="col-md-12 form-group mb-0">
                                        <textarea className="form-control" name="message" id="message"
                                                  ref={this.references['message']} rows="1"
                                                  placeholder="Order Notes"></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-4">
                                <OrderTotalBox order={this.state.order} Total={0}>
                                    <div className="text-center">
                                        <button className="button button-paypal"
                                                onClick={() => this.handleSendOrder()}>Proceed to Оплата
                                        </button>
                                    </div>
                                </OrderTotalBox>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}