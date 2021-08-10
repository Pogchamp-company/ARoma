import React, {Component} from "react";
import {Link} from "react-router-dom";
import {serverUrl} from "./ServerUrl"

export default class ProductEditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: undefined,
        }
        this.updateAllProduct()
    }

    updateAllProduct() {
        fetch(`${serverUrl}/product/${this.props.match.params.productId}`)
            .then(response => response.json())
            .then(catalog_json => {
                // catalog_json.obj.Photos = [
                //     {
                //         "url": "https://picsum.photos/id/1/263/280",
                //     }
                // ]
                this.setState({
                    product: catalog_json.obj
                })
            })
            .catch((e) => console.log('some error', e));
    }

    uploadProductPhotos(files) {
        console.log(files);
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
                        <input className={"admin-product-input"} placeholder={"Title"}/>
                        <input className={"admin-product-input"} placeholder={"Price"}/>
                        <input className={"admin-product-input"} placeholder={"QuantityInStock"}/>
                        <div className={"admin-product-image-container"}>
                            {this.state.product.Photos.map((photo) => {
                                return (
                                    <div className={"admin-product-image-item"}><i className={"ti-close"} onClick={(event) => {
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
                                    }}/><img src={photo.Url}/></div>
                                )
                            })}
                            <label className="custom-file-upload">
                                <input className={"admin-product-input"} type="file" accept="image/*" multiple onChange={(event) => this.uploadProductPhotos(event.target.files)}/>
                                +
                            </label>
                        </div>
                        <button className={"button admin-product-save"}>Save</button>
                    </div>
                </div>
            </section>
        )
    }
}