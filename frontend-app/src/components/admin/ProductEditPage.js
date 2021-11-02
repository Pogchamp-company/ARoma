import React, {Component} from "react";
import {serverUrl} from "../utils/ServerUrl"
import {getProduct, removeProductPhoto, uploadProductPhoto} from "../utils/api";
import {PropsContext} from "../Context";
import TopProducts from "../TopProducts/TopProducts.tsx";

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
            if (isNaN(parsedValue) || isNaN(attrObj.value)) parsedValue = attrObj.value
            attributes[attrObj.key] = parsedValue

        })

        console.log(attributes)

        const data = new FormData();

        data.set('Title', this.state.product.Title)
        data.set('Price', this.state.product.Price.toString())
        data.set('QuantityInStock', this.state.product.QuantityInStock.toString())
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
                this.props.history.push(`/product/${jsonResponse.productID}`)
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
                <button className={"button admin-product-save"} onClick={() => this.setState(prev => {
                    return {
                        attributes: [...prev.attributes, {key: '', value: ''}]
                    }
                })}>Add attribute
                </button>

            </div>
        )
    }

    render() {
        return (
            <div>
                <div className="product_image_area">
                    <div className="container">
                        <div className="row s_product_inner">
                            <div className="col-lg-6">

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

                            </div>
                            <div className="col-lg-5 offset-lg-1">
                                <div className="s_product_text">
                                    <h3>
                                        <textarea onChange={(event) => {
                                            this.state.product.Title = event.target.value
                                            this.forceUpdate()
                                        }} value={this.state.product.Title} placeholder={"Title"}/>
                                    </h3>
                                    <h2>$
                                        <input onChange={(event) => {
                                            this.state.product.Price = parseFloat(event.target.value)
                                            this.forceUpdate()
                                        }} value={this.state.product.Price} type={"number"} placeholder={"Price"}/>
                                    </h2>
                                    <ul className="list">
                                        <li><a
                                            className="active"><span>Category</span> : {this.state.product.Catalog.Title}
                                        </a>
                                        </li>
                                        <li><a><span>Availibility</span> :
                                            <input onChange={(event) => {
                                                this.state.product.QuantityInStock = parseFloat(event.target.value)
                                                this.forceUpdate()
                                            }}
                                                   value={this.state.product.QuantityInStock}
                                                   type={"number"}
                                                   placeholder={"QuantityInStock"}/>

                                        </a></li>
                                    </ul>
                                    <p>
                                        <textarea style={{width: "100%"}} value={this.state.product.Description}
                                                  onChange={(event) => {
                                                      this.state.product.Description = event.target.value
                                                      this.forceUpdate()
                                                  }}/>
                                    </p>
                                    <button className={"button admin-product-save"} onClick={() => this.saveProduct()}>Save</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="product_description_area">
                    <div className="container">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab"
                                   aria-controls="home" aria-selected="true">Description</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                                   aria-controls="profile"
                                   aria-selected="false">Specification</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel"
                                 aria-labelledby="home-tab">
                                <p>
                                    <textarea style={{width: "100%"}} value={this.state.product.LongDescription} onChange={(event) => {
                                        this.state.product.LongDescription = event.target.value
                                        this.forceUpdate()
                                    }}/></p>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                        {this.renderProductAttributes()}
                                        </tbody>
                                    </table>
                                </div>
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        $(".s_Product_carousel").owlCarousel({
            items: 1,
            autoplay: true,
            autoplayTimeout: 5000,
            loop: false,
            nav: false,
            dots: true,
            autoHeight: true,
        });
    }
}