import React, {Component, createRef} from "react";
import TopProducts from "./TopProducts";
import {Link} from "react-router-dom";
import NoUiSlider from "./NoUiSlider";
import Select from 'react-select'

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
    toDict() {
        if (!this.value) return
        return {
            Title: this.props.attribute.Title,
            Type: "string",
            Value: this.value,
        }
    }

    render() {
        return (
            <div className="common-filter">
                <div className="head">{this.props.attribute.Title}</div>
                <ul>
                    {this.props.attribute.Values.map((variant, index) => (
                        <li className="filter-list"><input className="pixel-radio" type="radio"
                                                           id={variant.Title + index} name={this.props.attribute.Title}
                                                           value={variant.Title}
                                                           onClick={(event) => {
                                                               this.value = event.target.value
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
                Min: this.sliderRef.current.state.min,
                Max: this.sliderRef.current.state.max,
            }
        }

    }

    render() {
        return (
            <div className="common-filter">
                <div className="head">{this.props.attribute.Title}</div>
                <NoUiSlider ref={this.sliderRef}
                            title={this.props.attribute.Title}
                            min={this.props.attribute.MinValue}
                            max={this.props.attribute.MaxValue}/>
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
            min: this.productsPriceElement.current.state.min,
            max: this.productsPriceElement.current.state.max,
        }
        res['attributes'] = this.refsCollection
            .map((value, index) => value.current.toDict())
            .filter((elem) => elem != null)
        return res
    }

    render() {
        this.refsCollection = []
        for (let i = 0; i < this.props.attributes.length; i++) {
            this.refsCollection[i] = React.createRef();
        }
        if (this.productsPriceElement.current) {
            this.productsPriceElement.current.setState({
                min: this.props.price.Min,
                max: this.props.price.Max
            })
        }
        return (
            <div className="sidebar-filter">
                <div className="top-filter-head">Product Filters</div>
                {this.props.attributes.map((attribute, index) => {
                    if (attribute.Type === "string") {
                        return <EnumAttributeFilter attribute={attribute} ref={this.refsCollection[index]}/>
                    } else if (attribute.Type === "number") {
                        if (attribute.MinValue != attribute.MaxValue)
                            return <RangeAttributeFilter attribute={attribute} ref={this.refsCollection[index]}/>
                    }
                })}
                <div className="common-filter">
                    <div className="head">Price</div>
                    <NoUiSlider ref={this.productsPriceElement} title="Price" min={this.props.price.Min}
                                max={this.props.price.Max} symbol="$"/>
                </div>
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
                this.state.products = catalog_json["products"]
                this.forceUpdate()
            })
            .catch((e) => console.log('fetchProducts some error', e));
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
                if (catalog_json.attributes) {
                    this.state.attributes = catalog_json.attributes
                    this.state.price = catalog_json.price
                } else this.state.attributes = []
                this.forceUpdate()
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
