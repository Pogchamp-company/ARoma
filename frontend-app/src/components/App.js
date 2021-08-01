import React, {Component} from "react";
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

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props)
        return (
            <Router>
                <Header/>
                <Switch>
                    <Route exact path="/" component={MainPage}/>
                    <Route exact path="/registration" component={RegistrationPage}/>
                    <Route exact path="/login" component={LoginPage}/>
                    <Route exact path="/cart" component={CartPage}/>
                    <Route exact path="/search_products" component={SearchProductsPage}/>
                    <Route path="/product/:productId" component={ProductPage}/>
                </Switch>
                <Footer/>
            </Router>
        );
    }
}


