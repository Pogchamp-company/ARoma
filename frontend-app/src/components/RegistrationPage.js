import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";


export default class RegistrationPage extends Component {
    constructor(props) {
        super(props);
        this.usernameRef = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.keepLoggedInRef = React.createRef();
        this.state = {}
    }

    validateInputs() {
        const hasClass = [this.usernameRef, this.emailRef, this.confirmPasswordRef].some((val) => {
            return val.current.classList.contains('has-error') || val.current.classList.contains('clear')
        })
        if (hasClass) return false

        return true;
    }

    onRegister() {
        console.log("Reg")
        console.log(this.usernameRef.current.value)
        console.log(this.emailRef.current.value)
        console.log(this.passwordRef.current.value)
        console.log(this.confirmPasswordRef.current.value)
        console.log(this.keepLoggedInRef.current.checked)

        if (this.validateInputs()) {
            console.log("Valid")
            let url = 'http://0.0.0.0:8080/register'
            const data = new FormData();

            data.set('username', this.usernameRef.current.value)
            data.set('email', this.emailRef.current.value)
            data.set('password', this.passwordRef.current.value)

            fetch(url, {
                method: "POST",
                body: data
            })
                .then(response => response.json())
                .then((response_json) => {
                    console.log(response_json)
                    // this.props.history.push('/')
                    this.setState({bringBack: true})
                    this.props.setToken(response_json.token)
                })
                .catch((e) => console.log('TopProducts some error', e));
        }
    }

    onDuplicateAbleChange(event, endpoint) {
        if (event.target.value === '') {
            event.target.classList.add("clear");
            return
        }
        event.target.classList.remove("clear");

        fetch(endpoint + event.target.value)
            .then(response => response.json())
            .then(response_json => {
                if (response_json.ok) {
                    event.target.classList.remove("has-error");
                } else {
                    event.target.classList.add("has-error");
                }
            })
            .catch((e) => console.log('TopProducts some error', e));
    }

    onConfirmPasswordChange(event) {
        if (this.confirmPasswordRef.current.value === '') {
            this.confirmPasswordRef.current.classList.add("clear");
            return
        }
        this.confirmPasswordRef.current.classList.remove("clear");

        if (this.confirmPasswordRef.current.value === this.passwordRef.current.value) {
            this.confirmPasswordRef.current.classList.remove("has-error");
            return
        }

        this.confirmPasswordRef.current.classList.add("has-error");
    }

    render() {
        if (this.state.bringBack) return <Redirect to="/"/>
        return (
            <div>
                <section className="blog-banner-area" id="category">
                    <div className="container h-100">
                        <div className="blog-banner">
                            <div className="text-center">
                                <h1>Register</h1>
                                <nav aria-label="breadcrumb" className="banner-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Register</li>
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
                                        <h4>Already have an account?</h4>
                                        <p>There are advances being made in science and technology everyday, and a good
                                            example of this is the</p>
                                        <Link className="button button-account" to="/login">Login Now</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="login_form_inner register_form_inner">
                                    <h3>Create an account</h3>
                                    <div className="row login_form" id="register_form">
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control clear" id="name" name="name"
                                                   placeholder="Username" ref={this.usernameRef}
                                                   onChange={(e) => this.onDuplicateAbleChange(e, 'http://0.0.0.0:8080/check_username?username=')}/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control clear" id="email" name="email"
                                                   placeholder="Email Address" ref={this.emailRef}
                                                   onChange={(e) => this.onDuplicateAbleChange(e, 'http://0.0.0.0:8080/check_email?email=')}/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control clear" id="password"
                                                   name="password"
                                                   placeholder="Password" ref={this.passwordRef}
                                                   onChange={(e) => this.onConfirmPasswordChange(e)}/>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <input type="text" className="form-control clear" id="confirmPassword"
                                                   name="confirmPassword" placeholder="Confirm Password"
                                                   ref={this.confirmPasswordRef}
                                                   onChange={(e) => this.onConfirmPasswordChange(e)}/>

                                        </div>
                                        <div className="col-md-12 form-group">
                                            <div className="creat_account">
                                                <input type="checkbox" id="f-option2" name="selector"
                                                       ref={this.keepLoggedInRef}/>
                                                <label htmlFor="f-option2">Keep me logged in</label>
                                            </div>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <button type="submit" value="button"
                                                    className="button button-register w-100" onClick={() => {
                                                this.onRegister()
                                            }}>Register
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}
