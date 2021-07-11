import React, {Component, useState} from "react";
import TopProducts from "./TopProducts";
import {Link} from "react-router-dom";

class ProductsContainer extends Component {
    constructor(props) {
        super(props);
    }

    renderProducts() {
        return this.props.products.map((product, index) => (
            <div className="col-md-6 col-lg-4">
                <div className="card text-center card-product">
                    <div className="card-product__img">
                        <img className="card-img" src="/img/product/product1.png"
                             alt=""/>
                        <ul className="card-product__imgOverlay">
                            <li>
                                <Link to={`/product/${product.ID}`}><i className="ti-search"></i></Link>
                            </li>
                            <li>
                                <button><i className="ti-shopping-cart"></i></button>
                            </li>
                            <li>
                                <button><i className="ti-heart"></i></button>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        <p>Accessories</p>
                        <h4 className="card-product__title"><Link to={`/product/${product.ID}`}>{product.Title}</Link></h4>
                        <p className="card-product__price">${product.Price}</p>
                    </div>
                </div>
            </div>
        ))
    }

    render() {
        return (
            <div className="row">
                {this.renderProducts()}
            </div>
        )
    }
}


export default class SearchProductsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            catalogs: [],
            currentCatalog: ''
        }

        this.getAllCategories()
        this.fetchProducts()
        this.productsContainerElement = React.createRef();
    }

    handleSearchChange(event) {
        this.fetchProducts(event.target.value, this.state.currentCatalog)
    }

    setCurrentCatalog(catalog) {
        this.state.currentCatalog = catalog
        this.fetchProducts('', this.state.currentCatalog)
        document.getElementsByClassName("search-input")[0].value = ""
    }

    fetchProducts(productsQuery = '', catalogId = '') {
        let url = 'http://0.0.0.0:8080/product/search'
        const params = {}
        if (productsQuery !== '') params['productQuery'] = productsQuery
        if (catalogId !== '') params['catalogId'] = catalogId
        if (params) {
            url += `?${Object.entries(params).map(([n, v]) => `${n}=${v}`).join('&')}`
        }
        fetch(url)
            .then(response => response.json())
            .then(catalog_json => {
                this.state.products = catalog_json["products"]
                this.forceUpdate()
            })
            .catch((e) => console.log('some error', e));
    }

    getAllCategories() {
        fetch('http://0.0.0.0:8080/catalog')
            .then(response => response.json())
            .then(catalog_json => {
                this.state.catalogs = catalog_json.catalogs
                this.forceUpdate()
            })
            .catch((e) => console.log('some error', e));
    }

    renderCategories() {
        return <div className="sidebar-categories">
            <div className="head">Browse Categories</div>
            <ul className="main-categories">
                <li className="common-filter">
                    <form action="#">
                        <ul>
                            <li className="filter-list"><input className="pixel-radio"
                                                               type="radio" id="0"
                                                               name="catalog"
                                                               checked={this.state.currentCatalog === ""}
                                                               onChange={() => this.setCurrentCatalog("")}/><label htmlFor={0}>All</label></li>
                            {this.state.catalogs.map(catalog => (
                                <li className="filter-list"><input className="pixel-radio"
                                                                   type="radio" id={catalog.ID}
                                                                   name="catalog"
                                                                   checked={this.state.currentCatalog === catalog.ID.toString()}
                                                                   onChange={(event) => this.setCurrentCatalog(event.target.id)}/><label
                                    htmlFor={catalog.ID}>{catalog.Title}<span> ({catalog.Count})</span></label></li>
                            ))}
                        </ul>
                    </form>
                </li>
            </ul>
        </div>
    }

    render() {
        return (
            <div>
                <section className="section-margin--small mb-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-5">
                                {this.renderCategories()}
                                <div className="sidebar-filter">
                                    <div className="top-filter-head">Product Filters</div>
                                    <div className="common-filter">
                                        <div className="head">Brands</div>
                                        <form action="#">
                                            <ul>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="apple" name="brand"/><label
                                                    htmlFor="apple">Apple<span>(29)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="asus" name="brand"/><label
                                                    htmlFor="asus">Asus<span>(29)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="gionee" name="brand"/><label
                                                    htmlFor="gionee">Gionee<span>(19)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="micromax" name="brand"/><label
                                                    htmlFor="micromax">Micromax<span>(19)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="samsung" name="brand"/><label
                                                    htmlFor="samsung">Samsung<span>(19)</span></label></li>
                                            </ul>
                                        </form>
                                    </div>
                                    <div className="common-filter">
                                        <div className="head">Color</div>
                                        <form action="#">
                                            <ul>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="black" name="color"/><label
                                                    htmlFor="black">Black<span>(29)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="balckleather"
                                                                                   name="color"/><label
                                                    htmlFor="balckleather">Black
                                                    Leather<span>(29)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="blackred" name="color"/><label
                                                    htmlFor="blackred">Black
                                                    with red<span>(19)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="gold" name="color"/><label
                                                    htmlFor="gold">Gold<span>(19)</span></label></li>
                                                <li className="filter-list"><input className="pixel-radio" type="radio"
                                                                                   id="spacegrey" name="color"/><label
                                                    htmlFor="spacegrey">Spacegrey<span>(19)</span></label></li>
                                            </ul>
                                        </form>
                                    </div>
                                    <div className="common-filter">
                                        <div className="head">Price</div>
                                        <div className="price-range-area">
                                            <div id="price-range"></div>
                                            <div className="value-wrapper d-flex">
                                                <div className="price">Price:</div>
                                                <span>$</span>
                                                <div id="lower-value"></div>
                                                <div className="to">to</div>
                                                <span>$</span>
                                                <div id="upper-value"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-8 col-md-7">
                                <div className="filter-bar d-flex flex-wrap align-items-center">
                                    <div className="sorting">
                                        <select>
                                            <option value="1">Default sorting</option>
                                            <option value="1">Default sorting</option>
                                            <option value="1">Default sorting</option>
                                        </select>
                                    </div>
                                    <div className="sorting mr-auto">
                                        <select>
                                            <option value="1">Show 12</option>
                                            <option value="1">Show 12</option>
                                            <option value="1">Show 12</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="input-group filter-bar-search">
                                            <input type="text" placeholder="Search" className="search-input"
                                                   onChange={(event) => this.handleSearchChange(event)}/>
                                            <div className="input-group-append">
                                                <button type="button"><i className="ti-search"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <section className="lattest-product-area pb-40 category-list">
                                    <ProductsContainer products={this.state.products} ref={this.productsContainerElement}/>
                                </section>
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
}


