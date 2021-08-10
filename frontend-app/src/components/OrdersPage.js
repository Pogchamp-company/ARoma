import React, {Component} from "react";
import {serverUrl} from "./ServerUrl";
import OrderTotalBox from "./OrderTotalBox";

export default class OrdersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: -1,
            orders: []
        }
        this.updateOrders()
    }

    updateOrders() {
        let url = `${serverUrl}/order/all`
        fetch(url, {
            headers: {
                'Authorization': this.props.token
            }
        })
            .then(response => response.json())
            .then(catalog_json => {
                console.log(catalog_json)
                this.setState({
                    orders: catalog_json["orders"],
                })
            })
            .catch((e) => console.log('fetchProducts some error', e));
    }

    setCurrentOrder(order) {
        console.log(order)
        let url = `${serverUrl}/order?orderID=${order.ID}`
        if (order.order === undefined) {
            fetch(url, {
                headers: {
                    'Authorization': this.props.token
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
            console.log("akldssfksdkf")
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