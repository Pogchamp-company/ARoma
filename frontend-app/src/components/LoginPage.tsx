import * as React from "react";
import {Link, useHistory} from "react-router-dom";
import {serverUrl} from "./utils/ServerUrl"
import {PropsContext} from "./Context";
import {useContext, useEffect, useState} from "react";

export default function LoginPage() {
    const context = useContext(PropsContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [hasError, setHasError] = useState(false)

    const history = useHistory()

    useEffect(() => {
        setHasError(false)
    }, [username, password])

    function LoginUser() {
        if (username === '' || password === '') {
            setHasError(true)
            return
        }

        console.log("Valid")
        let url = `${serverUrl}/login`
        const data = new FormData();

        data.set('login', username)
        data.set('password', password)

        fetch(url, {
            method: "POST",
            body: data
        })
            .then((response) => {
                if (!response.ok) {
                    setHasError(true)
                    throw new Error('Network response was not ok');
                }
                return response.json()
            })
            .then((response_json) => {
                console.log(response_json)
                context.setToken(response_json.token, response_json.isAdmin)
                history.go(-1)
            })
            .catch((e) => console.log('Login page some error', e));
    }

    return (
        <section className="login_box_area section-margin">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="login_box_img">
                            <div className="hover">
                                <h4>New to our website?</h4>
                                <p>There are advances being made in science and technology everyday, and a good example of this is the</p>
                                <Link className="button button-account" to="/registration">Create an Account</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="login_form_inner">
                            <h3>Log in to enter</h3>
                            <div className="row login_form" id="contactForm">
                                <div className="col-md-12 form-group">
                                    <input type="text" className={hasError ? "form-control has-error" : "form-control"} id="name" name="name"
                                           placeholder="Username"
                                           onChange={(e) => setUsername(e.target.value)}/>
                                </div>
                                <div className="col-md-12 form-group">
                                    <input type="password" className={hasError ? "form-control has-error" : "form-control"} id="name" name="name"
                                           placeholder="Password"
                                           onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                <div className="col-md-12 form-group">
                                    <div className="creat_account">
                                        <input type="checkbox" id="f-option2" name="selector"/>
                                        <label htmlFor="f-option2">Keep me logged in</label>
                                    </div>
                                </div>
                                <div className="col-md-12 form-group">
                                    <button type="submit" value="button"
                                            className="button button-login w-100" onClick={LoginUser}
                                            disabled={hasError}>Log In
                                    </button>
                                    <a href="#">Forgot Password?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
