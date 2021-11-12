import * as React from "react";
import {BrowserRouter, Route, Switch,} from "react-router-dom";
import MainPage from "./MainPage";
import SearchProductsPage from "./SearchProductsPage";
import Header from "./Header";
import Footer from "./Footer";
import ProductPage from "./ProductPage";
import RegistrationPage from "./RegistrationPage";
import LoginPage from "./LoginPage";
import CartPage from "./CartPage";
import useToken from "./hooks/useToken.js";
import useCart from "./hooks/useCart.js";
import ScrollToTop from "./ScrollToTop";
import CatalogsEditPage from "./admin/CatalogsEditPage";
import OrderStep2Page from "./order/OrderStep2Page";
import ProductListPage from "./admin/ProductListPage";
import OrdersPage from "./order/OrdersPage";
import ProductEditPage from "./admin/ProductEditPage";
import {PropsContext} from "./Context";
import OrderStep3Page from "./order/OrderStep3Page";

export default function App() {
    const {token, setToken, isAdmin} = useToken()
    const cart = useCart();

    return (
        <PropsContext.Provider value={{
            setToken,
            isAdmin,
            token,
            cart,
        }}>
            <BrowserRouter>
                <Header/>
                <ScrollToTop/>
                <Switch>
                    <Route exact path="/" component={MainPage}/>
                    <Route exact path="/registration"
                           render={routerProps => (<RegistrationPage setToken={setToken} {...routerProps}/>)}/>
                    <Route exact path="/login" component={LoginPage}/>
                    <Route exact path="/cart" component={CartPage}/>
                    <Route exact path="/search_products"
                           render={routerProps => (<SearchProductsPage cart={cart} {...routerProps}/>)}/>
                    <Route path="/product/:productId" render={routeProps => (<ProductPage cart={cart} {...routeProps}/>)}/>
                    <Route path="/orders" component={OrdersPage}/>
                    <Route path="/step2/:orderId" component={OrderStep2Page}/>
                    <Route path="/step3/:orderId" component={OrderStep3Page}/>
                    {
                        isAdmin() ? (
                            <>
                                <Route path="/edit_catalogs" render={routeProps => (<CatalogsEditPage token={token} {...routeProps}/>)}/>
                                <Route path="/edit_catalog_products/:catalogId" render={routeProps => (<ProductListPage {...routeProps}/>)}/>
                                <Route path="/edit_product/:productId" render={routeProps => (<ProductEditPage token={token} {...routeProps}/>)}/>
                                <Route path="/new_product/:catalogId" render={routeProps => (<ProductEditPage token={token} {...routeProps}/>)}/>
                            </>
                        ) : ''
                    }
                </Switch>
                <Footer/>
            </BrowserRouter>
        </PropsContext.Provider>
    );
}
