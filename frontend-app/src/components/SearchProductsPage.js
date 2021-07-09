import React, {Component} from "react";
import TopProducts from "./TopProducts";


export default class SearchProductsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            catalogs: []
        }
        this.getAllCategories()
        this.currentCatalog = ''
        this.fetchProducts()
    }

    handleSearchChange(event) {
        this.fetchProducts(event.target.value, this.currentCatalog)
    }

    handleCatalogSelectChange(event) {
        this.fetchProducts('', event.target.id)
        this.currentCatalog = event.target.id
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
                let new_state = this.state
                new_state.products = catalog_json["products"]
                this.setState({
                    new_state
                })
            })
            .catch((e) => console.log('some error', e));
    }

    getAllCategories() {
        fetch('http://0.0.0.0:8080/catalog')
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({
                    catalogs: catalog_json.catalogs
                })
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
                                                               name="catalog" checked
                                                               onChange={(event) => this.handleCatalogSelectChange(event)}/><label htmlFor={0}>All</label></li>
                            {this.state.catalogs.map(val => (
                                <li className="filter-list"><input className="pixel-radio"
                                                                   type="radio" id={val.ID}
                                                                   name="catalog"
                                                                   onChange={(event) => this.handleCatalogSelectChange(event)}/><label
                                    htmlFor={val.ID}>{val.Title}<span> ({val.Count})</span></label></li>
                            ))}
                        </ul>
                    </form>
                </li>
            </ul>
        </div>
    }

    renderProducts() {
        return this.state.products.map((key, index) => (
            <div className="col-md-6 col-lg-4">
                <div className="card text-center card-product">
                    <div className="card-product__img">
                        <img className="card-img" src="/img/product/product1.png"
                             alt=""/>
                        <ul className="card-product__imgOverlay">
                            <li>
                                <button><i className="ti-search"></i></button>
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
                        <h4 className="card-product__title"><a href="#">{key.Title}</a></h4>
                        <p className="card-product__price">${key.Price}</p>
                    </div>
                </div>
            </div>

        ))
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
                                    <div className="row">
                                        {this.renderProducts()}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="related-product-area">
                    <TopProducts/>
                </section>
                <section className="subscribe-position">
                    <div className="container">
                        <div className="subscribe text-center">
                            <h3 className="subscribe__title">Get Update From Anywhere</h3>
                            <p>Bearing Void gathering light light his eavening unto dont afraid</p>
                            <div id="mc_embed_signup">
                                <form target="_blank"
                                      action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
                                      method="get" className="subscribe-form form-inline mt-5 pt-1">
                                    <div className="form-group ml-sm-auto">
                                        <input className="form-control mb-1" type="email" name="EMAIL"
                                               placeholder="Enter your email" onFocus="this.placeholder = ''"
                                               onBlur="this.placeholder = 'Your Email Address '"/>
                                        <div className="info"></div>
                                    </div>
                                    <button className="button button-subscribe mr-auto mb-1" type="submit">Subscribe
                                        Now
                                    </button>
                                    <div style={{position: "absolute", left: "-5000px"}}>
                                        <input name="b_36c4fd991d266f23781ded980_aefe40901a" tabIndex="-1" value=""
                                               type="text"/>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </div>
                </section>

            </div>
        );
    }
}


