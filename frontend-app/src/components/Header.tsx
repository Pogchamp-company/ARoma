import * as React from "react";
import {Link} from "react-router-dom";
import {PropsContext} from "./Context";
import {useContext} from "react";


export default function Header() {
    const context = useContext(PropsContext)

    const totalCartAmount = context.cart.totalAmount();
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
                                {
                                    context.isAdmin() ? (
                                        <li className="nav-item">
                                            <Link to={"/edit_catalogs"}><i className="ti-pencil"/></Link>
                                        </li>
                                    ) : (
                                        <li id="cart-icon" className="nav-item">
                                            {totalCartAmount <= 0
                                                ? <a><i className="ti-shopping-cart"/><span
                                                    id={"cart-icon-number"}
                                                    className="nav-shop__circle">{totalCartAmount > 99 ? '99+' : totalCartAmount}</span></a>
                                                : <Link to="/cart"><i className="ti-shopping-cart"/><span
                                                    id={"cart-icon-number"}
                                                    className="nav-shop__circle">{totalCartAmount > 99 ? '99+' : totalCartAmount}</span></Link>
                                            }
                                        </li>

                                    )
                                }
                                <li className="nav-item">
                                    <Link to={"/orders"}><i className="ti-shopping-cart-full"/></Link>
                                </li>
                                {context.token === undefined ?
                                    <li className="nav-item"><Link className="button button-header"
                                                                   to="/login">Login</Link></li> :
                                    <li className="nav-item"><a className="button button-header" href={'#'}
                                                                onClick={() => {
                                                                    console.log("Logging out")
                                                                    context.setToken(undefined)
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
