import React, {Component} from "react";
import {Link} from "react-router-dom";


class ProductCard extends Component {
    constructor(props) {
        super(props);
    }

    handleAddToCart(e, productId) {
        const spanElem = document.getElementById('cart-icon-number')

        const btnRect = e.target.getBoundingClientRect()
        const rect = spanElem.parentElement.getBoundingClientRect()
        spanElem.style.transform = `translateX(${btnRect.left - rect.left}px) translateY(${btnRect.top - rect.top}px)`;

        spanElem.animate([
            // keyframes
            {
                transform: `translateX(${btnRect.left - rect.left}px) translateY(${btnRect.top - rect.top}px) scale(0.5)`,
            },
            {
                transform: 'translateX(0) translateY(0)  scale(1)',
            },
        ], {
            // timing options
            duration: 400,
            iterations: 1,
            easing: "ease-out",
            fill: "forwards",
        })
        document.getElementById('cart-icon').animate([
            // keyframes
            {transform: 'scale(0.7)'},
            {transform: 'scale(1)'},
            {transform: 'scale(1.1)'},
            {transform: 'scale(1)'},
        ], {
            // timing options
            duration: 400,
            iterations: 1,
            easing: "ease-in",
            delay: 450,
        })
        this.props.cart.addToCart(productId, 1)
    }


    render() {
        return (
            <div className={this.props.classList !== undefined ? this.props.classList : "col-md-6 col-lg-4"}>
                <div key={this.props.product.ID.toString() + this.props.catalog}
                     className="card text-center card-product"
                     style={{'--index': this.props.index}}>
                    <div className="card-product__img">
                        <div className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <img src={`https://picsum.photos/id/${this.props.product.ID}/263/280`}
                                         alt="Avatar"/>
                                </div>
                                <div className="flip-card-back">
                                    <img className={"card-back-img"}
                                         src={`https://picsum.photos/id/${this.props.product.ID}/263/280`}
                                         alt="Avatar"/>
                                    <ul className="card-product__imgOverlay">
                                        <li>
                                            <Link to={`/product/${this.props.product.ID}`}><i className="ti-search"></i></Link>
                                        </li>
                                        <li>
                                            <button onClick={(e) => this.handleAddToCart(e, this.props.product)}>
                                                <i className="ti-shopping-cart"/></button>
                                        </li>
                                        <li>
                                            <button><i className="ti-heart"/></button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <p>{this.props.product.Catalog.Title}</p>
                        <h4 className="card-product__title"><Link
                            to={`/product/${this.props.product.ID}`}>{this.props.product.Title}</Link></h4>
                        <p className="card-product__price">${this.props.product.Price}</p>
                    </div>
                </div>
            </div>
        )
    }
}


export default class ProductsContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                {this.props.products.map((product, index) => (
                    <ProductCard catalog={this.props.catalog} classList={this.props.classList} product={product} index={index} cart={this.props.cart}/>
                ))}
            </div>
        )
    }
}
