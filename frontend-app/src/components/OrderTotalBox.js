import React from "react";

export default function OrderTotalBox(props) {
    function subtotal(order) {
        return order.Products.reduce((prev, curr, index) => {
            return prev + curr.Price * curr.Quantity
        }, 0)
    }

    return (
        <div className="order_box">
            <h2>Your Order</h2>
            {
                props.order.TrackingNumber ? (
                    <ul className="list tracking-number-area">
                        <li><a><h4>Tracking number <span>{props.order.TrackingNumber}</span></h4></a></li>
                    </ul>

                ) : ''
            }
            <ul className="list">
                <li><a><h4>Product <span>Total</span></h4></a></li>
                {props.order.Products.map((product, index) => {
                    return (<li><a>{product.Title} <span
                        className="middle">x {product.Quantity}</span> <span
                        className="last">${product.Price * product.Quantity}</span></a></li>)

                })}
            </ul>
            <ul className="list list_2">
                <li><a>Subtotal <span>${subtotal(props.order)}</span></a></li>
                <li>
                    <a>Shipping <span>{props.order.ShippingMethod.Title}: ${props.order.ShippingMethod.Price}</span></a>
                </li>

                {props.order.Sale ?
                    <li>
                        <a>Discount <span style={{color: 'green'}}>-{props.order.Sale}%</span></a>
                    </li> : ''
                }
                <li>
                    <a>Total <span>${props.Total ? props.Total : subtotal(props.order) * (props.order.Sale ? (100 - props.order.Sale) : 100) / 100 + props.order.ShippingMethod.Price}</span></a>
                </li>
            </ul>
            {props.children}
        </div>

    )
}