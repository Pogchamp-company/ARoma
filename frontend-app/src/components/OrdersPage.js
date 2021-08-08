import React, {Component} from "react";

export default class OrdersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            orders: [
                {
                    order: undefined,
                    title: "Order #700",
                    price: "1200.00$",
                    status: "DRAFT",
                },
                {
                    order: undefined,
                    title: "Order #6",
                    price: "1300.90$",
                    status: "NOT_PAID",
                },
                {
                    order: undefined,
                    title: "Order #5",
                    price: "2500.00$",
                    status: "PAID",
                },
                {
                    order: undefined,
                    title: "Order #4",
                    price: "1200.00$",
                    status: "SHIPMENT",
                },
                {
                    order: undefined,
                    title: "Order #3",
                    price: "1300.90$",
                    status: "AWAITING_RECEIPT",
                },
                {
                    order: undefined,
                    title: "Order #2",
                    price: "2500.00$",
                    status: "COMPLETED",
                },
            ]
        }
    }

    render() {
        return (
            <section className={"orders__section"}>
                {
                    this.state.orders.map((value, index) => {
                        return (
                            <div className={this.state.currentIndex === index ? "orders-dropdown opened" : "orders-dropdown"} onClick={(e) => {
                                this.setState({currentIndex: index})
                            }}>
                                <div className={"orders-dropdown-header"}>
                                    <div className={"order-dropdown-left"}>
                                        <span className={"order-dropdown-id"}>
                                            {value.title}
                                        </span>
                                        <span className={"orders-dropdown-status"} data-status={value.status}>{value.status[0].toUpperCase() + value.status.replace("_", " ").toLowerCase().slice(1)}</span>
                                    </div>
                                    <div className={"order-dropdown-right"}>
                                        <span className={"order-dropdown-price"}>{value.price}</span>
                                        <div className={"orders-dropdown-arrow"}>
                                            <i className="ti-angle-right"/>
                                        </div>
                                    </div>
                                </div>
                                <div className={"orders-dropdown-content"}>
                                    <div className="order_box"><h2>Your Order</h2>
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
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </section>
        )
    }
}