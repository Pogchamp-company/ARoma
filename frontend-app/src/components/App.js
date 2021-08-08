import React from "react";
import {BrowserRouter, Route, Switch,} from "react-router-dom";
import MainPage from "./MainPage";
import SearchProductsPage from "./SearchProductsPage";
import Header from "./Header";
import Footer from "./Footer";
import ProductPage from "./ProductPage";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import CartPage from "./CartPage";
import useToken from "./useToken";
import useCart from "./useCart";
import ScrollToTop from "./ScrollToTop";
import CatalogsEditPage from "./CatalogsEditPage";
import OrderStep2Page from "./OrderStep2Page";
import ProductsEditPage from "./ProductsEditPage";

export default function App() {
    const {token, setToken} = useToken()
    const cart = useCart();

    return (
        <BrowserRouter>
            <Header token={token} setToken={setToken} cart={cart}/>
            <ScrollToTop/>
            <Switch>
                <Route exact path="/" render={routerProps => (<MainPage token={token} cart={cart} {...routerProps}/>)}/>
                <Route exact path="/registration"
                       render={routerProps => (<RegistrationPage setToken={setToken} {...routerProps}/>)}/>
                <Route exact path="/login" render={routerProps => (<LoginPage setToken={setToken} {...routerProps}/>)}/>
                <Route exact path="/cart" render={routerProps => (<CartPage token={token} cart={cart} {...routerProps}/>)}/>
                <Route exact path="/search_products"
                       render={routerProps => (<SearchProductsPage cart={cart} {...routerProps}/>)}/>
                <Route path="/product/:productId" render={routeProps => (<ProductPage cart={cart} {...routeProps}/>)}/>
                <Route path="/edit_catalogs" render={routeProps => (<CatalogsEditPage {...routeProps}/>)}/>
                <Route path="/edit_catalog_products/:catalogId" render={routeProps => (<ProductsEditPage {...routeProps}/>)}/>
                <Route path="/step2" render={routeProps => (<OrderStep2Page {...routeProps}/>)}/>
            </Switch>
            <Footer/>
        </BrowserRouter>
    );
}
