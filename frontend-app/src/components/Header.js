import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header className="header_area">
                <div className="main_menu">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container">
                            <a className="navbar-brand logo_h" href="index.html"><img src="img/logo.png" alt=""/></a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
                                <ul className="nav navbar-nav menu_nav ml-auto mr-auto">
                                    <li className="nav-item active"><Link className="nav-link" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item submenu dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown"
                                           role="button" aria-haspopup="true"
                                           aria-expanded="false">Shop</a>
                                        <ul className="dropdown-menu">
                                            <li className="nav-item"><Link className="nav-link" to="search_products">Shop
                                                Category</Link></li>
                                            <li className="nav-item"><a className="nav-link" href="single-product.html">Product
                                                Details</a></li>
                                            <li className="nav-item"><a className="nav-link" href="checkout.html">Product
                                                Checkout</a></li>
                                            <li className="nav-item"><a className="nav-link"
                                                                        href="confirmation.html">Confirmation</a></li>
                                            <li className="nav-item"><a className="nav-link" href="cart.html">Shopping
                                                Cart</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item submenu dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown"
                                           role="button" aria-haspopup="true"
                                           aria-expanded="false">Blog</a>
                                        <ul className="dropdown-menu">
                                            <li className="nav-item"><a className="nav-link" href="blog.html">Blog</a>
                                            </li>
                                            <li className="nav-item"><a className="nav-link" href="single-blog.html">Blog
                                                Details</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item submenu dropdown">
                                        <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown"
                                           role="button" aria-haspopup="true"
                                           aria-expanded="false">Pages</a>
                                        <ul className="dropdown-menu">
                                            <li className="nav-item"><a className="nav-link" href="login.html">Login</a>
                                            </li>
                                            <li className="nav-item"><a className="nav-link"
                                                                        href="register.html">Register</a></li>
                                            <li className="nav-item"><a className="nav-link"
                                                                        href="tracking-order.html">Tracking</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item"><a className="nav-link" href="contact.html">Contact</a>
                                    </li>
                                </ul>

                                <ul className="nav-shop">
                                    <li className="nav-item">
                                        <button><i className="ti-search"></i></button>
                                    </li>
                                    <li className="nav-item">
                                        <button><i className="ti-shopping-cart"></i><span
                                            className="nav-shop__circle">3</span></button>
                                    </li>
                                    <li className="nav-item"><a className="button button-header" href="#">Buy Now</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}
