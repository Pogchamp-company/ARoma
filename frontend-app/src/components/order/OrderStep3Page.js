import React, {useContext} from "react";
import {PropsContext} from "../Context.ts";
import {payOrder} from "../utils/api";
import {useHistory, useParams} from "react-router-dom/cjs/react-router-dom";

export default function OrderStep3Page() {
    const context = useContext(PropsContext)
    const {orderId} = useParams()
    history = useHistory()

    return (
        <section className="checkout_area section-margin--small">
            <div className="container">
                <button onClick={() => {
                    payOrder(orderId, context, history, result => {
                        console.log(result)
                        history.push('/orders')
                    })
                }}>
                    Pay
                </button>
            </div>
        </section>
    )
}