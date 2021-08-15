import React, {Component} from "react";
import {Link} from "react-router-dom";
import {PropsContext} from "./Context";

export default class Header extends Component {
    static contextType = PropsContext;

    changeThemeToDark = () => {
        document.documentElement.setAttribute("data-theme", "dark") // set theme to dark
        localStorage.setItem("data-theme", "dark") // save theme to local storage
    }

    changeThemeToLight = () => {
        document.documentElement.setAttribute("data-theme", "light") // set theme light
        localStorage.setItem("data-theme", 'light') // save theme to local storage
    }

    render() {
        const tolalCartAmount = this.context.cart.totalAmount();
        return (
            <header className="header_area">
                <div className="main_menu">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container">
                            <Link className="navbar-brand logo_h" to="/"><img src="/img/logo.png" alt=""/></Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                                <span className="icon-bar"/>
                            </button>
                            <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
                                <ul className="nav navbar-nav menu_nav ml-auto mr-auto menu-bar">

                                    <li className={"nav-item"}><Link className="nav-link" to="/">Home</Link>
                                    </li>
                                    <li className={"nav-item"}><Link className="nav-link"
                                                                     to="/search_products">Shop</Link>
                                    </li>
                                </ul>

                                <ul className="nav-shop">
                                    <li id="cart-icon" className="nav-item">
                                        {
                                            tolalCartAmount <= 0
                                                ? <a><i className="ti-shopping-cart"></i><span
                                                    id={"cart-icon-number"}
                                                    className="nav-shop__circle">{tolalCartAmount > 99 ? '99+' : tolalCartAmount}</span></a>
                                                : <Link to="/cart"><i className="ti-shopping-cart"/><span
                                                    id={"cart-icon-number"}
                                                    className="nav-shop__circle">{tolalCartAmount > 99 ? '99+' : tolalCartAmount}</span></Link>
                                        }
                                    </li>
                                    <li className="nav-item">
                                        <Link to={"/orders"}><i className="ti-shopping-cart-full"/></Link>
                                    </li>
                                    {
                                        this.context.isAdmin() ? (
                                            <li className="nav-item">
                                                <Link to={"/edit_catalogs"}><i className="ti-pencil"/></Link>
                                            </li>
                                        ) : ''
                                    }
                                    {this.context.token === undefined ?
                                        <li className="nav-item"><Link className="button button-header"
                                                                       to="/login">Login</Link></li> :
                                        <li className="nav-item"><a className="button button-header" onClick={(e) => {
                                            console.log("dsdasdasdasd")
                                            this.context.setToken(undefined)
                                            document.getElementsByClassName('menu-bar')[0].classList.add('play')
                                        }
                                        }>Logout</a></li>}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}
