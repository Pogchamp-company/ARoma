import React, {Component, useState} from "react";
import {
    Switch,
    Route,
    Link,
    Redirect,
    BrowserRouter,
} from "react-router-dom";
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


export default function App() {
    const {token, setToken} = useToken()
    const cart = useCart();

    return (
        <BrowserRouter>
            <Header token={token} setToken={setToken} cart={cart}/>
            <Switch>
                <Route exact path="/"><MainPage token={token}/></Route>
                <Route exact path="/registration"><RegistrationPage setToken={setToken}/></Route>
                <Route exact path="/login"><LoginPage setToken={setToken}/></Route>
                <Route exact path="/cart"><CartPage cart={cart}/></Route>
                <Route exact path="/search_products"><SearchProductsPage cart={cart}/></Route>
                <Route path="/product/:productId" render={routeProps => (<ProductPage cart={cart} {...routeProps}/>)}/>
            </Switch>
            <Footer/>
        </BrowserRouter>
    );
}


