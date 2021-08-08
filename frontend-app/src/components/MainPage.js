import React, {Component} from "react";
import {Link} from "react-router-dom";
import ProductsContainer from "./ProductCard";
import {serverUrl} from "./ServerUrl"

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trendingProducts: []
        }
        this.updateProducts()
    }

    updateProducts() {
        fetch(`${serverUrl}/product/top`)
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({trendingProducts: catalog_json["products"]})
                console.log(this.state)
            })
            .catch((e) => console.log('TopProducts some error', e));
    }

    render() {
        return (
            <main className="site-main">
                <section className="hero-banner">
                    <div className="container">
                        <div className="row no-gutters align-items-center pt-60px">
                            <div className="col-5 d-none d-sm-block">
                                <div className="hero-banner__img">
                                    <img className="img-fluid" src="img/home/hero-banner.png" alt=""/>
                                </div>
                            </div>
                            <div className="col-sm-7 col-lg-6 offset-lg-1 pl-4 pl-md-5 pl-lg-0">
                                <div className="hero-banner__content">
                                    <h4>Shop is fun</h4>
                                    <h1>Browse Our Premium Product</h1>
                                    <p>Us which over of signs divide dominion deep fill bring they're meat beho upon own
                                        earth without morning over third. Their male dry. They are great appear whose
                                        land fly grass.</p>
                                    <Link className="button button-hero" to="/search_products">Browse Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section-margin mt-0">
                    <div className="owl-carousel owl-theme hero-carousel">
                        <div className="hero-carousel__slide">
                            <img src="img/home/hero-slide1.png" alt="" className="img-fluid"/>
                            <a href="#" className="hero-carousel__slideOverlay">
                                <h3>Wireless Headphone</h3>
                                <p>Accessories Item</p>
                            </a>
                        </div>
                        <div className="hero-carousel__slide">
                            <img src="img/home/hero-slide2.png" alt="" className="img-fluid"/>
                            <a href="#" className="hero-carousel__slideOverlay">
                                <h3>Wireless Headphone</h3>
                                <p>Accessories Item</p>
                            </a>
                        </div>
                        <div className="hero-carousel__slide">
                            <img src="img/home/hero-slide3.png" alt="" className="img-fluid"/>
                            <a href="#" className="hero-carousel__slideOverlay">
                                <h3>Wireless Headphone</h3>
                                <p>Accessories Item</p>
                            </a>
                        </div>
                    </div>
                </section>
                <section className="section-margin calc-60px">
                    <div className="container">
                        <div className="section-intro pb-60px">
                            <p>Popular Item in the market</p>
                            <h2>Trending <span className="section-intro__style">Product</span></h2>
                        </div>
                        <ProductsContainer cart={this.props.cart}
                                           products={this.state.trendingProducts}
                                           catalog={0}
                                           classList={"col-md-6 col-lg-4 col-xl-3"}/>
                    </div>
                </section>
            </main>
        )
    }
}
