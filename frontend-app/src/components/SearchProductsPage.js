import React, {Component, createRef} from "react";
import TopProducts from "./TopProducts";
import {Link} from "react-router-dom";
import NoUiSlider from "./NoUiSlider";
import Select from 'react-select'


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
            <div className="col-md-6 col-lg-4">
                <div key={Math.random()} className="card text-center card-product"
                     style={{'--index': this.props.index}}>
                    <div className="card-product__img">
                        <img className="card-img" src={`https://picsum.photos/id/${this.props.product.ID}/263/280`}
                             alt=""/>
                        <ul className="card-product__imgOverlay">
                            <li>
                                <Link to={`/product/${this.props.product.ID}`}><i className="ti-search"></i></Link>
                            </li>
                            <li>
                                <button onClick={(e) => this.handleAddToCart(e, this.props.product)}><i
                                    className="ti-shopping-cart"></i></button>
                            </li>
                            <li>
                                <button><i className="ti-heart"></i></button>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        <p>Accessories</p>
                        <h4 className="card-product__title"><Link
                            to={`/product/${this.props.product.ID}`}>{this.props.product.Title}</Link></h4>
                        <p className="card-product__price">${this.props.product.Price}</p>
                    </div>
                </div>
            </div>
        )
    }
}

class ProductsContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                {this.props.products.map((product, index) => (
                    <ProductCard product={product} index={index} cart={this.props.cart}/>
                ))}
            </div>
        )
    }
}

class EnumAttributeFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined
        }
    }

    toDict() {
        if (this.state.value === undefined) return
        return {
            Title: this.props.attribute.Title,
            Type: "string",
            Value: this.state.value,
        }
    }

    render() {
        return (
            <div className="common-filter" key={Math.random()} >
                <div className="head">{this.props.attribute.Title}</div>
                <ul>
                    <li className="filter-list"><input className="pixel-radio" type="radio"
                                                       id={"no" + this.props.attribute.Title}
                                                       name={this.props.attribute.Title}
                                                       value={undefined}
                                                       checked={this.state.value === undefined}
                                                       onClick={(event) => {
                                                           this.setState({value: undefined})
                                                       }}/><label
                        htmlFor={"no" + this.props.attribute.Title}>No filter</label>
                    </li>
                    {this.props.attribute.Value.map((variant, index) => (
                        <li className="filter-list"><input className="pixel-radio" type="radio"
                                                           id={variant.Title + index} name={this.props.attribute.Title}
                                                           value={variant.Title}
                                                           checked={this.state.value === variant.Title}
                                                           onClick={(event) => {
                                                               this.setState({value: event.target.value})
                                                           }}/><label
                            htmlFor={variant.Title + index}>{variant.Title}&nbsp;<span>({variant.Count})</span></label>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

class RangeAttributeFilter extends Component {
    constructor(props) {
        super(props);
        this.sliderRef = createRef()
    }

    toDict() {
        return {
            Title: this.props.attribute.Title,
            Type: "number",
            Value: {
                Min: parseFloat(this.sliderRef.current.state.min),
                Max: parseFloat(this.sliderRef.current.state.max),
            }
        }

    }

    render() {
        return (
            <div className="common-filter" key={Math.random()} >
                <div className="head">{this.props.attribute.Title}</div>
                <NoUiSlider ref={this.sliderRef}
                            title={this.props.attribute.Title}
                            min={this.props.attribute.Value.Min}
                            max={this.props.attribute.Value.Max}/>
            </div>
        )
    }
}


class AttributesContainer extends Component {
    constructor(props) {
        super(props);
        this.productsPriceElement = React.createRef();
    }

    generateFiltersDict() {
        const res = {}
        res['price'] = {
            Min: parseFloat(this.productsPriceElement.current.state.min),
            Max: parseFloat(this.productsPriceElement.current.state.max),
        }
        console.log(this.refsCollection)
        if (this.refsCollection) res['attributes'] = this.refsCollection
            .map((value, index) => {
                if (value.current === null) return null
                return value.current.toDict()
            })
            .filter((elem) => elem != null)
        return res
    }

    render() {
        this.refsCollection = []
        for (let i = 0; i < this.props.attributes.length; i++) {
            this.refsCollection[i] = React.createRef();
        }
        if ((this.props.price.Min === this.props.price.Max) && (this.props.attributes.length === 0)) return ''
        return (
            <div className="sidebar-filter">
                <div className="top-filter-head">Product Filters</div>
                {this.props.attributes.map((attribute, index) => {
                    if (attribute.Type === "string") {
                        return <EnumAttributeFilter attribute={attribute} ref={this.refsCollection[index]}/>
                    } else if (attribute.Type === "number") {
                        if (attribute.Value.Min !== attribute.Value.Max)
                            return <RangeAttributeFilter attribute={attribute} ref={this.refsCollection[index]}/>
                    }
                })}
                {
                    this.props.price.Min !== this.props.price.Max ? (
                        <div className="common-filter" key={Math.random()}>
                            <div className="head">Price{this.props.price.Min !== this.props.price.Max}</div>
                            <NoUiSlider ref={this.productsPriceElement} title="Price" min={this.props.price.Min}
                                        max={this.props.price.Max} symbol="$"/>
                        </div>
                    ) : ''
                }
                <div className="common-filter">
                    <button onClick={this.props.applyFilters} className={"button apply-button"}>Apply</button>
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
            price: {
                Min: 0,
                Max: 100,
            },
            attributes: [],
            currentCatalog: ''
        }

        this.updateAllCategories()
        this.fetchProducts()
        this.updateFilters()
        this.productsContainerElement = React.createRef();
        this.filtersContainerElement = React.createRef();
    }

    handleSearchChange(event) {
        const filters_dict = this.filtersContainerElement.current.generateFiltersDict()

        this.fetchProducts(event.target.value, this.state.currentCatalog, filters_dict)
    }

    setCurrentCatalog(catalog) {
        this.state.currentCatalog = catalog
        this.updateFilters()
        this.fetchProducts('', this.state.currentCatalog)
        document.getElementsByClassName("search-input")[0].value = ""
    }

    fetchProducts(productsQuery = '', catalogId = '', filters = {}) {
        let url = 'http://0.0.0.0:8080/product/search'
        const params = {}
        if (productsQuery !== '') params['productQuery'] = productsQuery
        if (catalogId !== '') params['catalogId'] = catalogId
        if (filters !== {}) params['filters'] = JSON.stringify(filters);
        if (params) {
            url += `?${Object.entries(params).map(([n, v]) => `${n}=${v}`).join('&')}`
        }
        fetch(url)
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({
                    products: catalog_json["products"]
                })
            })
            .catch((e) => console.log('fetchProducts some error', e));
    }


    updateAllCategories() {
        fetch('http://0.0.0.0:8080/catalog')
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({
                    catalogs: catalog_json.catalogs
                })
            })
            .catch((e) => console.log('some error', e));
    }

    updateFilters() {
        let url
        if (this.state.currentCatalog === "") {
            url = `http://0.0.0.0:8080/catalog/get_attributes`
        } else {
            url = `http://0.0.0.0:8080/catalog/get_attributes?catalogId=${this.state.currentCatalog}`
        }

        fetch(url)
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({
                    attributes: catalog_json.attributes || [],
                    price: catalog_json.price,
                })
            })
            .catch((e) => console.log('some error', e));
    }

    applyFilters() {
        const filters_dict = this.filtersContainerElement.current.generateFiltersDict()
        this.fetchProducts('', this.state.currentCatalog, filters_dict)
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
        const options = [
            {value: '1', label: 'Show 5'},
            {value: '2', label: 'Show 25'},
            {value: '3', label: 'Show 100'}
        ]

        return (
            <div>
                <section className="section-margin--small mb-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-5">
                                {this.renderCategories()}
                                <AttributesContainer attributes={this.state.attributes}
                                                     price={this.state.price}
                                                     ref={this.filtersContainerElement}
                                                     applyFilters={() => this.applyFilters()}/>
                            </div>
                            <div className="col-xl-9 col-lg-8 col-md-7">
                                <div className="filter-bar d-flex flex-wrap align-items-center">
                                    <div className="sorting" style={{width: '150px'}}>
                                        <Select defaultValue={options[0]} options={options}/>
                                    </div>
                                    <div className="sorting mr-auto" style={{width: '150px'}}>
                                        <Select defaultValue={options[0]} options={options}/>
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
                                    <ProductsContainer cart={this.props.cart}
                                                       products={this.state.products}
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
