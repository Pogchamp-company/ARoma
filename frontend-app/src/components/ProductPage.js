import React, {Component} from "react";
import TopProducts from "./TopProducts";
import {serverUrl} from "./ServerUrl"
import {getProduct} from "./utils/api";


export default class ProductPage extends Component {
    constructor(props) {
        super(props);
        this.productId = parseInt(this.props.match.params.productId);
        this.state = {
            amount: this.props.cart.getAmount(this.productId),
            product: {
                ID: 0,
                Title: "-----",
                Catalog: {
                    ID: 0,
                    Title: "-----"
                },
                Price: 0,
                Description: "--------------",
                LongDescription: "-----------------------------------------",
                Attributes: {
                    "sus": "amogus",
                    "sus1": "amogus2",
                    "sus2": "amogus3"
                },
                Photos: [],
            }
        }
        getProduct(this.productId, product => this.setState({product: product}))
    }

    renderQuantity() {
        if (this.state.amount === 0) {
            return (
                <div className="product_count">
                    <a className="button primary-btn" onClick={e => this.addToCart(e)}>Add to Cart</a>
                </div>
            )
        }
        return (
            <div className="product_count">
                <label htmlFor="qty">Quantity:</label>
                <input type="number" name="qty" id="sst" size="2" maxLength="12" value={this.state.amount}
                       title="Quantity:" onChange={e => this.onAmountChange(e)}/>
            </div>
        )
    }

    addToCart(e) {
        const amount = 1
        this.setState({
            amount: this.props.cart.addToCart(this.state.product, amount)
        })
        // this.props.cart.addToCart(this.state.product, amount)
    }

    onAmountChange(e) {
        const amount = parseInt(e.target.value)
        this.setState({
            amount: this.props.cart.setAmount(this.state.product, amount)
        })
    }

    renderAttributes() {
        const attributes = this.state.product.Attributes
        return Object.keys(attributes).map((key, index) => (
            <tr>
                <td>
                    <h5>{key}</h5>
                </td>
                <td>
                    <h5>{attributes[key]}</h5>
                </td>
            </tr>
        ))
    }


    productPreviewPhoto() {
        if (this.state.product.Photos.length === 0) return `https://picsum.photos/id/${this.state.product.ID}/263/280`
        return this.state.product.Photos[0].Url
    }

    render() {
        console.log(this.state.product)
        return (
            <div>
                <div className="product_image_area">
                    <div className="container">
                        <div className="row s_product_inner">
                            <div className="col-lg-6">

                                <div className="owl-carousel owl-theme s_Product_carousel">
                                    {
                                        this.state.product.Photos.map((photo) => {
                                            return <img src={photo.Url} style={{width: '500px', height: '500px', margin: '5px'}}/>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="col-lg-5 offset-lg-1">
                                <div className="s_product_text">
                                    <h3>{this.state.product.Title}</h3>
                                    <h2>${this.state.product.Price}</h2>
                                    <ul className="list">
                                        <li><a className="active"
                                               href="#"><span>Category</span> : {this.state.product.Catalog.Title}</a>
                                        </li>
                                        <li><a href="#"><span>Availibility</span> : {this.state.product.QuantityInStock}</a></li>
                                    </ul>
                                    <p>{this.state.product.Description}</p>
                                    {this.renderQuantity()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="product_description_area">
                    <div className="container">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link" id="home-tab" data-toggle="tab" href="#home" role="tab"
                                   aria-controls="home" aria-selected="true">Description</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab"
                                   aria-controls="profile"
                                   aria-selected="false">Specification</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab"
                                   aria-controls="contact"
                                   aria-selected="false">Comments</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" id="review-tab" data-toggle="tab" href="#review"
                                   role="tab" aria-controls="review"
                                   aria-selected="false">Reviews</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <p>{this.state.product.LongDescription}</p>
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                        {this.renderAttributes()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="comment_list">
                                            <div className="review_item">
                                                <div className="media">
                                                    <div className="d-flex">
                                                        {/*<img src= alt=""/>*/}
                                                    </div>
                                                    <div className="media-body">
                                                        <h4>Blake Ruiz</h4>
                                                        <h5>12th Feb, 2018 at 05:56 pm</h5>
                                                        <a className="reply_btn" href="#">Reply</a>
                                                    </div>
                                                </div>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                                    eiusmod tempor incididunt ut labore et
                                                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo</p>
                                            </div>
                                            <div className="review_item reply">
                                                <div className="media">
                                                    <div className="d-flex">
                                                        <img src="/img/product/review-2.png" alt=""/>
                                                    </div>
                                                    <div className="media-body">
                                                        <h4>Blake Ruiz</h4>
                                                        <h5>12th Feb, 2018 at 05:56 pm</h5>
                                                        <a className="reply_btn" href="#">Reply</a>
                                                    </div>
                                                </div>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                                    eiusmod tempor incididunt ut labore et
                                                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo</p>
                                            </div>
                                            <div className="review_item">
                                                <div className="media">
                                                    <div className="d-flex">
                                                        <img src="/img/product/review-3.png" alt=""/>
                                                    </div>
                                                    <div className="media-body">
                                                        <h4>Blake Ruiz</h4>
                                                        <h5>12th Feb, 2018 at 05:56 pm</h5>
                                                        <a className="reply_btn" href="#">Reply</a>
                                                    </div>
                                                </div>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                                    eiusmod tempor incididunt ut labore et
                                                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="review_box">
                                            <h4>Post a comment</h4>
                                            <form className="row contact_form" action="contact_process.php"
                                                  method="post" id="contactForm" noValidate="novalidate">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" id="name"
                                                               name="name" placeholder="Your Full name"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <input type="email" className="form-control" id="email"
                                                               name="email" placeholder="Email Address"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" id="number"
                                                               name="number" placeholder="Phone Number"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <textarea className="form-control" name="message" id="message"
                                                                  rows="1" placeholder="Message"></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 text-right">
                                                    <button type="submit" value="submit"
                                                            className="btn primary-btn">Submit Now
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade show active" id="review" role="tabpanel"
                                 aria-labelledby="review-tab">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="row total_rate">
                                            <div className="col-6">
                                                <div className="box_total">
                                                    <h5>Overall</h5>
                                                    <h4>4.0</h4>
                                                    <h6>(03 Reviews)</h6>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="rating_list">
                                                    <h3>Based on 3 Reviews</h3>
                                                    <ul className="list">
                                                        <li><a href="#">5 Star <i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i> 01</a>
                                                        </li>
                                                        <li><a href="#">4 Star <i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i> 01</a>
                                                        </li>
                                                        <li><a href="#">3 Star <i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i> 01</a>
                                                        </li>
                                                        <li><a href="#">2 Star <i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i> 01</a>
                                                        </li>
                                                        <li><a href="#">1 Star <i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i><i
                                                            className="fa fa-star"></i><i className="fa fa-star"></i> 01</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="review_list">
                                            <div className="review_item">
                                                <div className="media">
                                                    <div className="d-flex">
                                                        <img src="/img/product/review-1.png" alt=""/>
                                                    </div>
                                                    <div className="media-body">
                                                        <h4>Blake Ruiz</h4>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                </div>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                                    eiusmod tempor incididunt ut labore et
                                                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo</p>
                                            </div>
                                            <div className="review_item">
                                                <div className="media">
                                                    <div className="d-flex">
                                                        <img src="/img/product/review-2.png" alt=""/>
                                                    </div>
                                                    <div className="media-body">
                                                        <h4>Blake Ruiz</h4>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                </div>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                                    eiusmod tempor incididunt ut labore et
                                                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo</p>
                                            </div>
                                            <div className="review_item">
                                                <div className="media">
                                                    <div className="d-flex">
                                                        <img src="/img/product/review-3.png" alt=""/>
                                                    </div>
                                                    <div className="media-body">
                                                        <h4>Blake Ruiz</h4>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </div>
                                                </div>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                                    eiusmod tempor incididunt ut labore et
                                                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                                    exercitation ullamco laboris nisi ut aliquip ex ea
                                                    commodo</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="review_box">
                                            <h4>Add a Review</h4>
                                            <p>Your Rating:</p>
                                            <ul className="list">
                                                <li><a href="#"><i className="fa fa-star"></i></a></li>
                                                <li><a href="#"><i className="fa fa-star"></i></a></li>
                                                <li><a href="#"><i className="fa fa-star"></i></a></li>
                                                <li><a href="#"><i className="fa fa-star"></i></a></li>
                                                <li><a href="#"><i className="fa fa-star"></i></a></li>
                                            </ul>
                                            <p>Outstanding</p>
                                            <form action="#/" className="form-contact form-review mt-3">
                                                <div className="form-group">
                                                    <input className="form-control" name="name" type="text"
                                                           placeholder="Enter your name" required/>
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" name="email" type="email"
                                                           placeholder="Enter email address" required/>
                                                </div>
                                                <div className="form-group">
                                                    <input className="form-control" name="subject" type="text"
                                                           placeholder="Enter Subject"/>
                                                </div>
                                                <div className="form-group">
                                                    <textarea className="form-control different-control w-100"
                                                              name="textarea" id="textarea" cols="30" rows="5"
                                                              placeholder="Enter Message"></textarea>
                                                </div>
                                                <div className="form-group text-center text-md-right mt-3">
                                                    <button type="submit"
                                                            className="button button--active button-review">Submit Now
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
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
            items:1,
            autoplay:true,
            autoplayTimeout: 5000,
            loop:false,
            nav:false,
            dots:true,
            autoHeight:true,
        });
    }
}


