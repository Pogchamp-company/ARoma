import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class TopProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
        this.updateProducts()
    }

    updateProducts() {
        fetch("http://0.0.0.0:8080/product/top")
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({products: catalog_json["products"]})
                console.log(this.state)
            })
            .catch((e) => console.log('TopProducts some error', e));
    }

    renderProducts() {
        if (!this.state.products) return ''
        const items = []

        for (let i = 0; i < 4; i++) {
            const item = []
            for (let j = 0; j < 3; j++) {
                item.push(this.renderProductCard(i * 3 + j))
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

    renderProductCard(index) {
        const product = this.state.products[parseInt(index)]
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

    render() {
        return (
            <div className="container">
                <div className="section-intro pb-60px">
                    <p>Popular Item in the market</p>
                    <h2>Top <span className="section-intro__style">Products</span></h2>
                </div>
                {this.renderProducts()}
            </div>
        )
    }
}
