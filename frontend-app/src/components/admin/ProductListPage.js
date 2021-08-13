import React, {Component} from "react";
import {Link} from "react-router-dom";
import {serverUrl} from "../ServerUrl"
import {getCatalog, getAllCatalogs} from "../utils/api";

export default class ProductListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            catalog: {
                Title: '-',
                Products: [],
                ID: 0
            },
        }
        this.updateAllProduct()
    }

    updateAllProduct() {
        getCatalog(this.props.match.params.catalogId, catalog => this.setState({catalog: catalog}))
    }

    render() {
        return (
            <section className="cart_area">
                <div className="container">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Link className={'admin-table-button'} to={"/edit_catalogs"}><i className="ti-angle-left"/></Link>
                        <span className={"admin-catalog-title"}>{this.state.catalog.Title}</span>
                    </div>
                    <div className="cart_inner">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity In Stock</th>
                                    <th scope="col">Views Count</th>
                                    <th scope="col"/>
                                    <th scope="col"/>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.catalog.Products.map((product, index) => {
                                    return (
                                        <tr>
                                            <td>{product.ID !== undefined ? product.ID : '-'}</td>
                                            <td>{product.Title}</td>
                                            <td>{product.Price}$</td>
                                            <td>{product.QuantityInStock}</td>
                                            <td>{product.ViewsCount}</td>
                                            <td><Link className={'admin-table-button'} to={`/edit_product/${product.ID}`}><i className="ti-pencil"/></Link></td>
                                            <td><button className={'admin-table-button'}><i className="ti-trash"/></button></td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td/>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}