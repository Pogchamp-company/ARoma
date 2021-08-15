import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {serverUrl} from "./utils/ServerUrl"


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.state = {
            disabled: true
        }
    }

    validateInputs() {
        if (this.usernameRef.current.value === '') return false
        if (this.passwordRef.current.value === '') return false
        return true
    }

    onLogin() {
        console.log("Log")

        if (this.validateInputs()) {
            console.log("Valid")
            let url = `${serverUrl}/login`
            const data = new FormData();

            data.set('login', this.usernameRef.current.value)
            data.set('password', this.passwordRef.current.value)

            fetch(url, {
                method: "POST",
                body: data
            })
                .then((response) => {
                    if (!response.ok) {
                        this.usernameRef.current.classList.add('has-error')
                        this.passwordRef.current.classList.add('has-error')
                        throw new Error('Network response was not ok');
                    }
                    return response.json()
                })
                .then((response_json) => {
                    console.log(response_json)
                    // this.props.history.push('/')
                    this.setState({bringBack: true})
                    this.props.setToken(response_json.token)
                })
                .catch((e) => console.log('TopProducts some error', e));
        }
    }

    onInputUpdate() {
        this.setState({disabled: this.usernameRef.current.value === '' || this.passwordRef.current.value === ''})
        this.usernameRef.current.classList.remove('has-error')
        this.passwordRef.current.classList.remove('has-error')
    }

    render() {
        if (this.state.bringBack) return <Redirect to="/"/>
        return (
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
                                <div className="row login_form" id="contactForm">
                                    <div className="col-md-12 form-group">
                                        <input type="text" className="form-control" id="name" name="name"
                                               placeholder="Username" ref={this.usernameRef} onChange={() => this.onInputUpdate()}/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <input type="password" className="form-control" id="name" name="name"
                                               placeholder="Password" ref={this.passwordRef} onChange={() => this.onInputUpdate()}/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <div className="creat_account">
                                            <input type="checkbox" id="f-option2" name="selector"/>
                                            <label htmlFor="f-option2">Keep me logged in</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <button type="submit" value="button"
                                                className="button button-login w-100" onClick={() => this.onLogin()} disabled={(this.state.disabled)? "disabled" : ""}>Log
                                            In
                                        </button>
                                        <a href="#">Forgot Password?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
