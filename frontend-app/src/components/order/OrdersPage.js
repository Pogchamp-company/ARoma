import React, {Component} from "react";
import OrderTotalBox from "../OrderTotalBox";
import {completeOrder, deliverOrder, getOrder, getOrdersList, trackOrder} from "../utils/api";
import {PropsContext} from "../Context.ts";
import {Link} from "react-router-dom";
import Paginator from "../Paginator/Paginator";


class TrackNumberForm extends Component {
    static contextType = PropsContext;

    constructor(props, content) {
        super(props, content);
        this.numberRef = React.createRef()
    }

    render() {
        return (
            <>
                <input placeholder={"Tracking number"} ref={this.numberRef}/>
                <button onClick={e => {
                    trackOrder(this.props.orderID, this.numberRef.current.value, this.context, this.props.history, success_json => {
                        console.log(success_json)
                        window.location.reload()
                    })
                }}>Save
                </button>
            </>
        )
    }
}

export default class OrdersPage extends Component {
    static contextType = PropsContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            currentIndex: -1,
            orders: [],
            currentPage: 1,
            pagesCount: 1
        }
        this.updateOrders()
    }

    updateOrders() {
        getOrdersList(this.state.currentPage, this.context.token, this.props.history, this.context.setToken, orders_json => {
            console.log(orders_json)
            this.setState({
                orders: orders_json.orders,
                pagesCount: orders_json.pagesCount
            })
        })
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

    setPage(page) {
        this.state.currentPage = page
        this.updateOrders()
    }


    render() {
        return (
            <section className={"orders__section"}>
                {this.state.pagesCount > 1 ?
                    <Paginator setPage={page => this.setPage(page)} page={this.state.currentPage}
                               pagesCount={this.state.pagesCount}/> : ''}
                {
                    this.state.orders.map((value, index) => {
                        return (
                            <div
                                className={this.state.currentIndex === value.ID ? "orders-dropdown opened" : "orders-dropdown"}>
                                <div className={"orders-dropdown-header"}
                                     onClick={(e) => {
                                         this.setCurrentOrder(value)
                                     }}>

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
                                        value.Status === 'PAID' ? (
                                            <TrackNumberForm orderID={value.ID}/>
                                        ) : ''
                                    }
                                    {
                                        value.order !== undefined ?
                                            <OrderTotalBox order={value.order} Total={value.Total}/> : ''
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
        if (value.Status === 'DRAFT') return (
            <Link to={`/step2/${value.ID}`} className={"order-button"}>Step2</Link>
        )
        if (value.Status === 'NOT_PAID') return (
            <Link to={`/step3/${value.ID}`} className={"order-button"}>Pay</Link>
        )
        if (value.Status === 'SHIPMENT') return (
            <a href={"#"} className={"order-button"} onClick={e => {
                deliverOrder(value.ID, this.context, this.props.history, success_json => {
                    console.log(success_json)
                    window.location.reload()
                })
            }}>Delivered</a>
        )
        if (value.Status === 'AWAITING_RECEIPT') return (
            <a href={"#"} className={"order-button"} onClick={e => {
                completeOrder(value.ID, this.context, this.props.history, success_json => {
                    console.log(success_json)
                    window.location.reload()
                })
            }}>Received</a>
        )
    }
}
