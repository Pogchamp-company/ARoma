import React, {Component} from "react";
import {Link} from "react-router-dom";
import {serverUrl} from "../utils/ServerUrl";
import {getAllCatalogs} from "../utils/api";

export default class CatalogsEditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            catalogs: []
        }
        this.updateAllCategories()
    }

    updateAllCategories() {
        getAllCatalogs(catalogs => this.setState({
            catalogs: catalogs.map((catalog) => {
                return {
                    ...catalog,
                    saved: true
                }
            })
        }))
    }

    saveCategory(catalog) {
        console.log(catalog)
        const data = new FormData();

        data.set('Title', catalog.Title)

        fetch(catalog.ID !== undefined ? `${serverUrl}/admin/catalog?catalogID=${catalog.ID}` : `${serverUrl}/admin/catalog`, {
            method: "POST",
            headers: {
                'Authorization': this.props.token
            },
            body: data
        })
            .then(raw => {
                if (raw.ok) {
                    return raw.json()
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then((json) => {
                console.log(json)
                if (catalog.ID === undefined) catalog.ID = json.ID
                catalog.saved = true
                this.forceUpdate()
            }).catch(e => console.log(e))

    }

    deleteCatalog(catalog) {
        if (catalog.ID === undefined) {
            this.setState({
                catalogs: this.state.catalogs.filter((value) => value !== catalog)
            })
            return
        }
        fetch(`${serverUrl}/admin/catalog?catalogID=${catalog.ID}`, {
            method: "DELETE",
            headers: {
                'Authorization': this.props.token
            },
        })
            .then(raw => {
                if (raw.ok) {
                    return raw.json()
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .then((json) => {
                console.log(json)
                this.setState({
                    catalogs: this.state.catalogs.filter((value) => value !== catalog)
                })
            }).catch(e => console.log(e))
    }

    render() {
        return (
            <section className="cart_area">
                <div className="container">
                    <div className="cart_inner">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Title</th>
                                    <th scope="col"/>
                                    <th scope="col"/>
                                    <th scope="col"/>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.catalogs.map((catalog, index) => {
                                    return (
                                        <tr>
                                            <td>{catalog.ID !== undefined ? catalog.ID : '-'}</td>
                                            <td><input value={catalog.Title} type={"text"}
                                                // key={catalog.Title + catalog.saved}
                                                       className={catalog.saved ? "admin-text-input" : "admin-text-input updated"}
                                                       onChange={(e) => {
                                                           catalog.Title = e.target.value
                                                           catalog.saved = false
                                                           this.forceUpdate()
                                                       }}/></td>
                                            <td>
                                                <button className={'admin-table-button'} onClick={
                                                    (e) => {
                                                        this.saveCategory(catalog)
                                                    }
                                                }><i className="ti-save"/>
                                                </button>
                                            </td>
                                            <td>
                                                <Link className={'admin-table-button'}
                                                      to={`/edit_catalog_products/${catalog.ID}`}><i
                                                    className="ti-menu-alt"/>
                                                </Link>
                                            </td>
                                            <td>
                                                <button className={'admin-table-button'} onClick={() => this.deleteCatalog(catalog)}><i className="ti-trash"/></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td colSpan={4}/>
                                    <td>
                                        <button className={'admin-table-button'} onClick={() => {
                                            this.state.catalogs.push({ID: undefined, Title: '', saved: false})
                                            this.forceUpdate()
                                        }}><i className="ti-plus"/>
                                        </button>
                                    </td>
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