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
        // todo change props to context
        <PropsContext.Provider value={{
            setToken,
            isAdmin,
            token,
            cart,
        }}>
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
                    <Route path="/orders" render={routeProps => (<OrdersPage {...routeProps}/>)}/>
                    <Route path="/step2/:orderId" render={routeProps => (<OrderStep2Page {...routeProps}/>)}/>
                    <Route path="/step3/:orderId" render={routeProps => (<OrderStep3Page {...routeProps}/>)}/>
                </Switch>
                <Footer/>
            </BrowserRouter>
        </PropsContext.Provider>
    );
}
