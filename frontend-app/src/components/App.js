import React, {Component} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";
import MainPage from "./MainPage";
import SearchProducts from "./SearchProducts";
import Header from "./Header";
import Footer from "./Footer";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Header/>
                <Switch>
                    <Route exact path="/" component={MainPage}/>
                    <Route exact path="/search_products" component={SearchProducts}/>
                </Switch>
                <Footer/>
            </Router>
        );
    }
}


