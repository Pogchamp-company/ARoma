import React, {Component} from "react";
import {Link} from "react-router-dom";
import {serverUrl} from "../ServerUrl"
import {getProduct} from "../utils/api";

export default class ProductEditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: undefined,
            attributes: []
        }
        this.updateAllProduct()
    }

    updateAllProduct() {
        getProduct(this.props.match.params.productId, product => {
            this.setState({
                product: product,
                attributes: Object.keys(product.Attributes).map(key => {
                    return {key: key, value: product.Attributes[key]}
                })
            })
        })
    }

    uploadProductPhotos(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            console.log(file)

            const data = new FormData();

            data.set('photo', file)

            fetch(`${serverUrl}/product/photo?productID=${this.state.product.ID}`, { // Your POST endpoint
                method: 'POST',
                headers: {
                    'Authorization': this.props.token
                },
                body: data,
            }).then(
                response => response.json() // if the response is a JSON object
            ).then(
                attachment_json => {
                    console.log(attachment_json)
                    this.state.product.Photos.push({
                        ID: attachment_json.attachmentID,
                        Url: attachment_json.attachmentURL,
                    })
                    this.forceUpdate()
                }
            ).catch(
                error => console.log('error', error) // Handle the error response object
            );

        }
        this.forceUpdate()
    }

    removeProductPhoto(photo) {
        fetch(`${serverUrl}/product/photo?productID=${this.state.product.ID}&attachmentID=${photo.ID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': this.props.token
            },
        }).then(
            response => response.json()
        ).then(
            attachment_json => {
                console.log(attachment_json)
                this.state.product.Photos = this.state.product.Photos.filter((value) => value !== photo)
                this.forceUpdate()
            }
        ).catch(
            error => console.log('error', error) // Handle the error response object
        );

    }

    saveProduct() {
        console.log(this.state.product)

        const data = new FormData();

        data.set('Title', this.state.product.Title)
        data.set('Price', this.state.product.Price)
        data.set('QuantityInStock', this.state.product.QuantityInStock)
        data.set('Description', this.state.product.Description)
        data.set('LongDescription', this.state.product.LongDescription)

        fetch(`${serverUrl}/admin/product?productID=${this.state.product.ID}`, {
            method: "POST",
            headers: {
                'Authorization': this.props.token
            },
            body: data
        })
            .then(raw => {
                if (raw.ok) return raw.json()
            })
            .then(jsonResponse => {
                console.log(jsonResponse)
            }).catch(e => console.log(e))
    }

    renderProductAttributes() {
        console.log(this.state.product)
        return (
            <div style={{width: "100%"}}>
                {
                    this.state.attributes.map((obj) => {
                        return (
                            <div className={"admin-product-attribute"}>
                                <input className={"admin-product-input"} onChange={(event) => {
                                    obj.key = event.target.value
                                    this.forceUpdate()
                                }} value={obj.key} placeholder={"Title"}/>:
                                <input className={"admin-product-input"} onChange={(event) => {
                                    obj.value = event.target.value
                                    this.forceUpdate()
                                }} value={obj.value} placeholder={"Title"}/>
                                <button onClick={() => this.setState({attributes: this.state.attributes.filter(value => value !== obj)})}><i className={'ti-trash'}/></button>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        if (this.state.product === undefined) {
            return ''
        }
        return (
            <section className="cart_area">
                <div className="container">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Link className={'admin-table-button'}
                              to={`/edit_catalog_products/${this.state.product.Catalog.ID}`}><i
                            className="ti-angle-left"/></Link>
                        <span className={"admin-catalog-title"}>{this.state.product.Title}</span>
                    </div>
                    <div className="cart_inner admin-product-inner">
                        <div className={'admin-product-wrap'}>
                            <span>Title</span>
                            <input onChange={(event) => {
                                this.state.product.Title = event.target.value
                                this.forceUpdate()
                            }} value={this.state.product.Title} placeholder={"Title"}/>
                        </div>
                        <div className={'admin-product-wrap'}>
                            <span>Price</span>
                            <input onChange={(event) => {
                                this.state.product.Price = parseFloat(event.target.value)
                                this.forceUpdate()
                            }} value={this.state.product.Price} type={"number"} placeholder={"Price"}/>
                        </div>
                        <div className={'admin-product-wrap'}>
                            <span>QuantityInStock</span>
                            <input onChange={(event) => {
                                this.state.product.QuantityInStock = parseFloat(event.target.value)
                                this.forceUpdate()
                            }} value={this.state.product.QuantityInStock} type={"number"}
                                   placeholder={"QuantityInStock"}/>
                        </div>
                        <div className={'admin-product-wrap'}>
                            <span>Description</span>

                            <textarea value={this.state.product.Description} onChange={(event) => {
                                this.state.product.Description = event.target.value
                                this.forceUpdate()
                            }}/>
                        </div>
                        <div className={'admin-product-wrap'}>
                            <span>Long Description</span>

                            <textarea value={this.state.product.LongDescription} onChange={(event) => {
                                this.state.product.LongDescription = event.target.value
                                this.forceUpdate()
                            }}/>
                        </div>
                        {this.renderProductAttributes()}

                        <button className={"button admin-product-save"} onClick={() => this.setState(prev => {
                            return {
                                attributes: [...prev.attributes, {key: '', value: ''}]
                            }
                        })}>Add attribute</button>
                        <div className={"admin-product-image-container"}>
                            {this.state.product.Photos.map((photo) => {
                                return (
                                    <div className={"admin-product-image-item"}>
                                        <i className={"ti-close"}
                                           onClick={() => this.removeProductPhoto(photo)}/>
                                        <img src={photo.Url}/>
                                    </div>
                                )
                            })}
                            <label className="custom-file-upload">
                                <input type="file" accept="image/*" multiple
                                       onChange={(event) => this.uploadProductPhotos(event.target.files)}/>
                                +
                            </label>
                        </div>
                        <button className={"button admin-product-save"} onClick={() => this.saveProduct()}>Save</button>
                    </div>
                </div>
            </section>
        )
    }
}