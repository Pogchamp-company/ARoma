import React, {Component, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";
import MainPage from "./MainPage";
import SearchProductsPage from "./SearchProductsPage";
import Header from "./Header";
import Footer from "./Footer";
import ProductPage from "./ProductPage";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import CartPage from "./CartPage";

export default function App() {
    const [token, setToken] = useState();

    return (
        <Router>
            <Header token={token}/>
            <Switch>
                <Route exact path="/"><MainPage token={token}/></Route>
                <Route exact path="/registration"><RegistrationPage setToken={setToken}/></Route>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/cart" component={CartPage}/>
                <Route exact path="/search_products" component={SearchProductsPage}/>
                <Route path="/product/:productId" component={ProductPage}/>
            </Switch>
            <Footer/>
        </Router>
    );
}


