import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class CatalogsEditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            catalogs: []
        }
        this.updateAllCategories()
    }

    updateAllCategories() {
        fetch(`${serverUrl}/catalog`)
            .then(response => response.json())
            .then(catalog_json => {
                this.setState({
                    catalogs: catalog_json.catalogs
                })
            })
            .catch((e) => console.log('some error', e));
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
                                    catalog.inputRef = React.createRef()
                                    return (
                                        <tr>
                                            <td>{catalog.ID !== undefined ? catalog.ID : '-'}</td>
                                            <td><input value={catalog.Title} type={"text"}
                                                       className={catalog.ID === undefined ? "admin-text-input updated" : "admin-text-input"}
                                                       onChange={(e) => {
                                                           catalog.Title = e.target.value
                                                           e.target.classList.add('updated')
                                                           this.forceUpdate()
                                                       }} ref={catalog.inputRef}/></td>
                                            <td>
                                                <button className={'admin-table-button'} onClick={
                                                    (e) => {
                                                        console.log(catalog)
                                                        if (catalog.ID === undefined) catalog.ID = 666
                                                        catalog.inputRef.current?.classList?.remove?.('updated')
                                                        this.forceUpdate()
                                                    }
                                                }><i className="ti-save"/>
                                                </button>
                                            </td>
                                            <td>
                                                <Link className={'admin-table-button'} to={`/edit_catalog_products/${catalog.ID}`}><i className="ti-menu-alt"/>
                                                </Link>
                                            </td>
                                            <td>
                                                <button className={'admin-table-button'} onClick={() => {
                                                    this.setState({
                                                        catalogs: this.state.catalogs.filter((value) => value !== catalog)
                                                    })
                                                }}><i className="ti-trash"/></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td>
                                        <button className={'admin-table-button'} onClick={() => {
                                            this.state.catalogs.push({ID: undefined, Title: ''})
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