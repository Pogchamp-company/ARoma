import React, {Component} from "react";
import OrderTotalBox from "../OrderTotalBox";
import {PropsContext} from "../Context";
import {getOrder, payOrder, sendOrder} from "../utils/api";

export default class OrderStep3Page extends Component {
    static contextType = PropsContext

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <section className="checkout_area section-margin--small">
                <div className="container">
                    <button onClick={
                        event => {
                            payOrder(this.props.match.params.orderId, this.context, this.props.history, result => {
                                console.log(result)
                                this.props.history.push('/orders')
                            })
                        }
                    }>Pay</button>
                </div>
            </section>
        )
    }
}