import React, {Component, createRef} from "react";
import {Link} from "react-router-dom";


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <section className="blog-banner-area" id="category">
                    <div className="container h-100">
                        <div className="blog-banner">
                            <div className="text-center">
                                <h1>Login / Register</h1>
                                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Login/Register</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="login_box_area section-margin">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="login_box_img">
                                    <div className="hover">
                                        <h4>New to our website?</h4>
                                        <p>There are advances being made in science and technology everyday, and a good
                                            example of this is the</p>
                                        <Link className="button button-account" to="/registration">Create an Account</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="login_form_inner">
                                    <h3>Log in to enter</h3>
                                    <form className="row login_form" action="#/" id="contactForm">
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control" id="name" name="name"
                                                   placeholder="Username" onFocus="this.placeholder = ''"
                                                   onBlur="this.placeholder = 'Username'"/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control" id="name" name="name"
                                                   placeholder="Password" onFocus="this.placeholder = ''"
                                                   onBlur="this.placeholder = 'Password'"/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <div className="creat_account">
                                                <input type="checkbox" id="f-option2" name="selector"/>
                                                    <label htmlFor="f-option2">Keep me logged in</label>
                                            </div>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <button type="submit" value="submit"
                                                    className="button button-login w-100">Log In
                                            </button>
                                            <a href="#">Forgot Password?</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
