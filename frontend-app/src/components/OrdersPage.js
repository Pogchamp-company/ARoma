import React, {Component} from "react";
import {serverUrl} from "./ServerUrl";
import OrderTotalBox from "./OrderTotalBox";
import {getOrdersList} from "./utils/api";
import {PropsContext} from "./Context";

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

    setCurrentOrder(order) {
        if (order.ID === this.state.currentIndex) {
            this.setState({currentIndex: -1})
            return
        }
        let url = `${serverUrl}/order?orderID=${order.ID}`
        if (order.order === undefined) {
            fetch(url, {
                headers: {
                    'Authorization': this.context.token
                }
            })
                .then(response => response.json())
                .then(catalog_json => {
                    order.order = catalog_json["order"]
                    this.setState({
                        currentIndex: order.ID
                    })
                })
                .catch((e) => console.log('fetchProducts some error', e));

        } else {
            this.setState({
                currentIndex: order.ID
            })

        }

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
}
