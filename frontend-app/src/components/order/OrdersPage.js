import React, {Component} from "react";
import {serverUrl} from "../utils/ServerUrl";
import OrderTotalBox from "../OrderTotalBox";
import {getOrder, getOrdersList} from "../utils/api";
import {PropsContext} from "../Context";
import {Link} from "react-router-dom";

export default class OrdersPage extends Component {
    static contextType = PropsContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            currentIndex: -1,
            orders: []
        }
        this.updateOrders()
    }

    updateOrders() {
        getOrdersList(this.context.token, this.props.history, this.context.setToken, orders => this.setState({orders: orders}))
    }

    setCurrentOrder(order_obj) {
        if (order_obj.ID === this.state.currentIndex) {
            this.setState({currentIndex: -1})
            return
        }
        if (order_obj.order === undefined) {
            getOrder(order_obj.ID, this.context, this.props.history, order => {
                order_obj.order = order
                this.setState({
                    currentIndex: order_obj.ID
                })
            })
        } else this.setState({currentIndex: order_obj.ID})


    }

    render() {
        return (
            <section className={"orders__section"}>
                {
                    this.state.orders.map((value, index) => {
                        return (
                            <div
                                className={this.state.currentIndex === value.ID ? "orders-dropdown opened" : "orders-dropdown"}
                                onClick={(e) => {
                                    this.setCurrentOrder(value)
                                }}>
                                <div className={"orders-dropdown-header"}>
                                    <div className={"order-dropdown-left"}>
                                        <span className={"order-dropdown-id"}>
                                            Order #{value.ID}
                                        </span>
                                        <span className={"orders-dropdown-status"}
                                              data-status={value.Status}>{value.Status[0].toUpperCase() + value.Status.replace("_", " ").toLowerCase().slice(1)}</span>
                                    </div>
                                    <div className={"order-dropdown-right"}>
                                        {this.renderRightButton(value)}
                                        <span className={"order-dropdown-price"}>${value.Total}</span>
                                        <div className={"orders-dropdown-arrow"}>
                                            <i className="ti-angle-right"/>
                                        </div>
                                    </div>
                                </div>
                                <div className={"orders-dropdown-content"}>
                                    {
                                        value.order !== undefined ? <OrderTotalBox order={value.order} Total={value.Total}></OrderTotalBox> : ''
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </section>
        )
    }

    renderRightButton(value) {
        console.log(value)
        if (value.Status === 'DRAFT') return (
            <Link to={`/step2/${value.ID}`} className={"order-button"}>Step2</Link>
        )
        if (value.Status === 'NOT_PAID') return (
            <Link to={`/step3/${value.ID}`} className={"order-button"}>Pay</Link>
        )

    }
}
