import React, {Component} from "react";
import TopProducts from "./TopProducts/TopProducts.tsx";
import {getProduct} from "./utils/api";
import {Link} from "react-router-dom";
import {PropsContext} from "./Context.ts";


export default class ProductPage extends Component {
    static contextType = PropsContext;

    constructor(props, context) {
        super(props, context);
        this.productId = parseInt(this.props.match.params.productId);
        this.state = {
            amount: this.props.cart.getAmount(this.productId),
            product: {
                ID: 0,
                Title: "-----",
                Catalog: {
                    ID: 0,
                    Title: "-----"
                },
                Price: 0,
                Description: "--------------",
                LongDescription: "-----------------------------------------",
                Attributes: {
                    "sus": "amogus",
                    "sus1": "amogus2",
                    "sus2": "amogus3"
                },
                Photos: [],
            }
        }
        getProduct(this.productId, product => this.setState({product: product}))
    }

    renderQuantity() {
        if (this.context.isAdmin()) return ''
        if (this.state.amount === 0) {
            return (
                <div className="product_count">
                    <a className="button primary-btn" onClick={e => this.addToCart(e)}>Add to Cart</a>
                </div>
            )
        }
        return (
            <div className="product_count">
                <label htmlFor="qty">Quantity:</label>
                <input type="number" name="qty" id="sst" size="2" maxLength="12" value={this.state.amount}
                       title="Quantity:" onChange={e => this.onAmountChange(e)}/>
            </div>
        )
    }

    addToCart(e) {
        const amount = 1
        this.setState({
            amount: this.props.cart.addToCart(this.state.product, amount)
        })
    }

    onAmountChange(e) {
        const amount = parseInt(e.target.value)
        this.setState({
            amount: this.props.cart.setAmount(this.state.product, amount)
        })
    }

    renderAttributes() {
        const attributes = this.state.product.Attributes
        return Object.keys(attributes).map((key, index) => (
            <tr>
                <td>
                    <h5>{key}</h5>
                </td>
                <td>
                    <h5>{attributes[key]}</h5>
                </td>
            </tr>
        ))
    }

    render() {
        console.log(this.state.product)
        return (
            <div>
                <div className="product_image_area">
                    <div className="container">
                        <div className="row s_product_inner">
                            <div className="col-lg-6">

                                <div className="owl-carousel owl-theme s_Product_carousel">
                                    {
                                        this.state.product.Photos.map((photo) => {
                                            return <img src={photo.Url}
                                                        style={{width: '500px', height: '500px', margin: '5px'}}/>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="col-lg-5 offset-lg-1">
                                <div className="s_product_text">
                                    <h3>
                                        {this.state.product.Title}
                                        <Link to={`/edit_product/${this.state.product.ID}`} style={{margin: "0 5px"}}><i
                                        className="ti-pencil"/></Link>
                                    </h3>
                                    <h2>${this.state.product.Price}</h2>
                                    <ul className="list">
                                        <li><a className="active"
                                               href="#"><span>Category</span> : {this.state.product.Catalog.Title}</a>
                                        </li>
                                        <li><a href="#"><span>Availibility</span> : {this.state.product.QuantityInStock}
                                        </a></li>
                                    </ul>
                                    <p>{this.state.product.Description}</p>
                                    {this.renderQuantity()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="product_description_area">
                    <div className="container">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab"
                                   aria-controls="home" aria-selected="true">Description</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                                   aria-controls="profile"
                                   aria-selected="false">Specification</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel"
                                 aria-labelledby="home-tab">
                                <p>{this.state.product.LongDescription}</p>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                        {this.renderAttributes()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="related-product-area section-margin--small mt-0">
                    <TopProducts/>
                </section>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        $(".s_Product_carousel").owlCarousel({
            items: 1,
            autoplay: true,
            autoplayTimeout: 5000,
            loop: false,
            nav: false,
            dots: true,
            autoHeight: true,
        });
    }
}


