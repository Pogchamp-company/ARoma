import * as React from "react";
import {useEffect, useState} from "react";
import {getTopProducts} from "../utils/api";
import "./TopProducts.scss"
import {TextWithSizeLimit} from "../TextWithSizeLimit";
import {ProductPreviewImage} from "../ProductPreviewImage";

function TopProductCard({product, index}: { product: any, index: number }) {
    return (
        <a onClick={() => {
            window.location.href = `/product/${product.ID}`
        }}>
            <div className="top-product-item">
                <ProductPreviewImage product={product} style={{width: '75px', height: '75px'}}/>
                <div className="desc">
                    <p className={'title'}>
                        <TextWithSizeLimit text={product.Title} limit={35}/>
                    </p>
                    <div className="price">${product.Price}</div>
                </div>
            </div>
        </a>
    )
}

export default function TopProducts() {
    const [products, setProducts] = useState([])

    function updateProducts() {
        getTopProducts(products => setProducts(products))
    }

    useEffect(updateProducts, [])

    return (
        <div className="container">
            <div className="section-intro pb-60px">
                <p>Popular Item in the market</p>
                <h2>Top <span className="section-intro__style">Products</span></h2>
            </div>
            <div className={'top-product-container'}>
                {
                    products.map((value, index) => <TopProductCard product={value} index={index}/>)
                }
            </div>
        </div>
    )
}
