import React, {Component} from "react";
import TopProducts from "./TopProducts";
import {Link} from "react-router-dom";
import NoUiSlider from "./NoUiSlider";

class ProductsContainer extends Component {
    render() {
        return (
            <div className="row">
                {this.props.products.map((product, index) => (
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
                                <h4 className="card-product__title"><Link
                                    to={`/product/${product.ID}`}>{product.Title}</Link></h4>
                                <p className="card-product__price">${product.Price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

class EnumAttributeFilter extends Component {
    render() {
        return (
            <div className="common-filter">
                <div className="head">{this.props.attribute.Title}</div>
                <ul>
                    {this.props.attribute.Values.map((variant, index) => (
                        <li className="filter-list"><input className="pixel-radio" type="radio"
                                                           id="apple" name="brand"/><label
                            htmlFor="apple">{variant.Title}<span>({variant.Count})</span></label></li>
                    ))}
                </ul>
            </div>
        )
    }
}

class RangeAttributeFilter extends Component {
    render() {
        return (
            <div className="common-filter">
                <div className="head">{this.props.attribute.Title}</div>
                <div className="filter-list">
                    <NoUiSlider title={this.props.attribute.Title} min={this.props.attribute.MinValue} max={this.props.attribute.MaxValue}/>

                    {/*<input type="range" id="volume" name="volume"*/}
                    {/*       min={this.props.attribute.MinValue} max={this.props.attribute.MaxValue}/>*/}
                </div>
            </div>
        )
    }
}


class AttributesContainer extends Component {
    render() {
        return (
            <div className="sidebar-filter">
                <div className="top-filter-head">Product Filters</div>
                {this.props.attributes.map((attribute, index) => {
                    if (attribute.Type === "string") {
                        return <EnumAttributeFilter attribute={attribute}/>
                    } else if (attribute.Type === "number") {
                        return <RangeAttributeFilter attribute={attribute}/>
                    }
                })}
                <div className="common-filter">
                    <div className="head">Price</div>
                    <div className="price-range-area">
                        <NoUiSlider title="Price" min={1} max={500000}/>
                    </div>
                </div>
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
            attributes: [],
            currentCatalog: ''
        }

        this.updateAllCategories()
        this.fetchProducts()
        this.productsContainerElement = React.createRef();
    }

    handleSearchChange(event) {
        this.fetchProducts(event.target.value, this.state.currentCatalog)
    }

    setCurrentCatalog(catalog) {
        this.state.currentCatalog = catalog
        this.updateFilters()
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

    updateAllCategories() {
        fetch('http://0.0.0.0:8080/catalog')
            .then(response => response.json())
            .then(catalog_json => {
                this.state.catalogs = catalog_json.catalogs
                this.forceUpdate()
            })
            .catch((e) => console.log('some error', e));
    }

    updateFilters() {
        if (this.state.currentCatalog === "") return

        fetch(`http://0.0.0.0:8080/catalog/get_attributes?catalogId=${this.state.currentCatalog}`)
            .then(response => response.json())
            .then(catalog_json => {
                if (catalog_json.attributes) this.state.attributes = catalog_json.attributes
                else this.state.attributes = []
                console.log("attrs", catalog_json.attributes)
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
                                                               onChange={() => this.setCurrentCatalog("")}/><label
                                htmlFor={0}>All</label></li>
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
                                <AttributesContainer attributes={this.state.attributes}/>
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
                                    <ProductsContainer products={this.state.products}
                                                       ref={this.productsContainerElement}/>
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


