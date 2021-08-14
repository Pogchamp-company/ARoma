import React, {Component} from "react";
import {Link} from "react-router-dom";
import {serverUrl} from "../ServerUrl"
import {getProduct, removeProductPhoto, uploadProductPhoto} from "../utils/api";
import {PropsContext} from "../Context";

export default class ProductEditPage extends Component {
    static contextType = PropsContext

    constructor(props, context) {
        super(props, context);
        this.state = {
            product: {
                "Attributes": {},
                "Catalog": {
                    "ID": this.props.match.params.catalogId,
                    "Products": null,
                    "Title": "ПК в сборе",
                },
                "Description": "",
                "ID": null,
                "LongDescription": "",
                "Photos": [],
                "Price": 0,
                "QuantityInStock": 0,
                "Title": "",
                "ViewsCount": 0
            },
            attributes: []
        }
        this.updateAllProduct()
    }

    updateAllProduct() {
        if (this.props.match.params.productId == null) {
            return
        }
        console.log(this.props.match.params.productId)
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
            uploadProductPhoto(this.state.product.ID, file, this.context, this.props.history, attachment_json => {
                this.state.product.Photos.push({
                    ID: attachment_json.attachmentID,
                    Url: attachment_json.attachmentURL,
                })
                this.forceUpdate()
            })
        }
    }

    removeProductPhoto(photo) {
        removeProductPhoto(this.state.product.ID, photo.ID, this.context, this.props.history, attachment_json => {
            this.state.product.Photos = this.state.product.Photos.filter((value) => value !== photo)
            this.forceUpdate()
        })
    }

    saveProduct() {
        const attributes = {}
        console.log(this.state.attributes)

        this.state.attributes.forEach(attrObj => {
            let parsedValue = parseFloat(attrObj.value)
            if (isNaN(parsedValue)) parsedValue = attrObj.value
            attributes[attrObj.key] = parsedValue

        })

        console.log(attributes)

        const data = new FormData();

        data.set('Title', this.state.product.Title)
        data.set('Price', this.state.product.Price)
        data.set('QuantityInStock', this.state.product.QuantityInStock)
        data.set('Description', this.state.product.Description)
        data.set('LongDescription', this.state.product.LongDescription)
        data.set('Attributes', JSON.stringify(attributes))

        fetch(this.state.product.ID !== null ? `${serverUrl}/admin/product?productID=${this.state.product.ID}` : `${serverUrl}/admin/product?catalogID=${this.state.product.Catalog.ID}`, {
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
                if (this.state.product.ID === null) this.props.history.push(`/edit_product/${jsonResponse.productID}`)
            }).catch(e => console.log(e))
    }

    renderProductAttributes() {
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
                                <button
                                    onClick={() => this.setState({attributes: this.state.attributes.filter(value => value !== obj)})}>
                                    <i className={'ti-trash'}/></button>
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
                        })}>Add attribute
                        </button>
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
                            {
                                this.state.product.ID !== null ? (
                                    <label className="custom-file-upload">
                                        <input type="file" accept="image/*" multiple
                                               onChange={(event) => this.uploadProductPhotos(event.target.files)}/>
                                        +
                                    </label>
                                ) : ''
                            }
                        </div>
                        <button className={"button admin-product-save"} onClick={() => this.saveProduct()}>Save</button>
                    </div>
                </div>
            </section>
        )
    }
}