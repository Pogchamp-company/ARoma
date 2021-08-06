import React, {Component, createRef} from "react";
import TopProducts from "./TopProducts";
import {Link} from "react-router-dom";
import NoUiSlider from "./NoUiSlider";
import Paginator from "./Paginator";
import ProductCard from "./ProductCard";
import ProductsContainer from "./ProductCard";


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
            <div className="common-filter" key={this.props.attribute.Title}>
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
            <div className="common-filter" key={this.props.attribute.Title}>
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
                        <div className="common-filter"
                             key={this.props.price.Min.toString() + this.props.price.Max.toString()}>
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
            currentCatalog: '',
            currentPage: 1,
            pagesCount: 1,
            currentSearchQuery: '',
        }

        this.updateAllCategories()
        this.fetchProducts()
        this.updateFilters()
        this.filtersContainerElement = React.createRef();
    }

    handleSearchChange(event) {
        const filters_dict = this.filtersContainerElement.current.generateFiltersDict()
        this.state.currentPage = 1

        this.fetchProducts(event.target.value, this.state.currentCatalog, filters_dict)
    }

    setCurrentCatalog(catalog) {
        this.state.currentCatalog = catalog
        this.state.currentPage = 1
        this.updateFilters()
        this.fetchProducts('', this.state.currentCatalog)
        document.getElementsByClassName("search-input")[0].value = ""
    }

    fetchProducts(productsQuery = '', catalogId = '', filters = {}) {
        let url = 'http://0.0.0.0:8080/product/search'
        const params = {}
        if (productsQuery !== '') params['productQuery'] = productsQuery
        this.setState({currentSearchQuery: productsQuery})
        if (catalogId !== '') params['catalogId'] = catalogId
        if (filters !== {}) params['filters'] = JSON.stringify(filters);
        params['page'] = this.state.currentPage;
        if (params) {
            url += `?${Object.entries(params).map(([n, v]) => `${n}=${v}`).join('&')}`
        }
        fetch(url)
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({
                    products: catalog_json["products"],
                    pagesCount: catalog_json['pagesCount']
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
        this.state.currentPage = 1
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

    setPage(page) {
        this.state.currentPage = page
        const filters_dict = this.filtersContainerElement.current.generateFiltersDict()
        this.fetchProducts(this.state.currentSearchQuery, this.state.currentCatalog, filters_dict)
    }

    render() {
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
                                    {this.state.pagesCount > 1 ? <Paginator setPage={page => this.setPage(page)} page={this.state.currentPage}
                                                pagesCount={this.state.pagesCount}/> : ''}
                                    <div className="sorting mr-auto"/>
                                    <div>
                                        <div className="input-group filter-bar-search">
                                            <input type="text" placeholder="Search" className="search-input"
                                                   value={this.state.currentSearchQuery}
                                                   onChange={(event) => this.handleSearchChange(event)}/>
                                            <div className="input-group-append">
                                                <button type="button"><i className="ti-search"/></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <section className="lattest-product-area pb-40 category-list">
                                    <ProductsContainer cart={this.props.cart}
                                                       products={this.state.products}
                                                       catalog={this.state.currentCatalog}/>
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
