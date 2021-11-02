import * as React from "react";
import {Link} from "react-router-dom";
import {getTopProducts} from "../utils/api";
import {useEffect, useState} from "react";
import "./TopProducts.scss"

export default function TopProducts() {
    const [products, setProducts] = useState([])

    function updateProducts() {
        getTopProducts(products => setProducts(products))
    }

    function renderProducts() {
        if (!products) return ''
        const items = []

        for (let i = 0; i < 4; i++) {
            const item = []
            for (let j = 0; j < 3; j++) {
                item.push(renderProductCard(i * 3 + j))
            }
            items.push(
                <div className="col-sm-6 col-xl-3 mb-4 mb-xl-0">
                    <div className="single-search-product-wrapper">
                        {item}
                    </div>
                </div>
            )
        }

        return (
            <div className="row mt-30">
                {items}
            </div>
        )
    }

    function renderProductCard(index) {
        const product = products[parseInt(index)]
        if (!product) return ''
        return (
            <div className="single-search-product d-flex">
                <a onClick={() => {window.location.href=`/product/${product.ID}`}}><img src="/img/product/product-sm-1.png" alt=""/></a>
                <div className="desc">
                    <a onClick={() => {window.location.href=`/product/${product.ID}`}} className="title">{product.Title}</a>
                    <div className="price">${product.Price}</div>
                </div>
            </div>
        )
    }


    useEffect(updateProducts, [])

    return (
        <div className="container">
            <div className="section-intro pb-60px">
                <p>Popular Item in the market</p>
                <h2>Top <span className="section-intro__style">Products</span></h2>
            </div>
            {renderProducts()}
        </div>
    )
}
