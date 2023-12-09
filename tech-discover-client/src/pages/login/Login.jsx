import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { AiFillGoogleCircle, AiOutlineGithub } from "react-icons/ai";
import { AuthContext } from "../../providers/AuthProvider";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { Helmet } from "react-helmet";

const Login = () => {
    const [captchaError, setCaptchaError] = useState("");
    const currLocation = useLocation();
    // console.log("Login Previous Location (state) ", currLocation.state);
    const { signIn, googleSignIn, githubSignIn, createUserMongoDB } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        loadCaptchaEnginge(6);
    }, [])

    const handlerLogin = e => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;
        const captchaValue = e.target.captcha.value;
        // console.log(email, password);

        if (validateCaptcha(captchaValue) == true) {
            setCaptchaError("");
        }

        else {
            setCaptchaError('Captcha does not match');
            e.target.captcha.value = "";
            return;
        }


        signIn(email, password)
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: 'Login successful.',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(currLocation?.state ? currLocation?.state : "/");
            })
            .catch(error => {
                if (error.code.toString() == "auth/invalid-login-credentials")
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "email or password doesn't match",
                        showConfirmButton: false,
                        timer: 1500
                    });
                else
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `${error.code}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
            })
    }
    const handlerGoogleSignIn = () => {
        googleSignIn()
            .then(() => {
                createUserMongoDB();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: 'Login successful.',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(currLocation?.state ? currLocation?.state : "/");
            })
            .catch(error => {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `${error.code}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            })
    }

    const handlerGithubSignIn = () => {
        githubSignIn()
            .then(() => {
                createUserMongoDB();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: 'Login successful.',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(currLocation?.state ? currLocation?.state : "/");
            })
            .catch(error => {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `${error.code}`,
                    showConfirmButton: false,
                    timer: 1500
                });
            })
    }

    return (
        <div className="min-h-screen py-32">
            <Helmet>
                <title>Tech Discover | Login</title>
            </Helmet>
            <div className="lg:pt-8">
                <div className="flex gap-10">
                    <div className="lg:w-1/2 flex lg:justify-end max-lg:hidden"
                        data-aos="fade-down"
                    >
                        <img src="https://i.ibb.co/jhpsrL6/login.jpg" alt="" className="w-[80%]" />
                    </div>
                    <div className="w-full lg:w-1/2 max-lg:flex max-lg:justify-center max-lg:items-center">
                        <div
                            className="card w-full max-w-sm lg:max-w-md shadow-2xl"
                            data-aos="fade-up"
                        >
                            <h1
                                className="text-4xl mt-8 block mx-auto uppercase bg-clip-text gradient-text font-bold"
                            >Login</h1>
                            <form onSubmit={handlerLogin} className="card-body">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                                    <label className="label">
                                        <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                    </label>
                                </div>
                                <div className="form-control">
                                    <div className="flex justify-between">
                                        <input type="text" name="captcha" placeholder="type captcha here"
                                            className={`input input-bordered ${captchaError && 'border-error'}`} required />
                                        <LoadCanvasTemplate></LoadCanvasTemplate>
                                    </div>
                                    <span className="text-error" >{captchaError}</span>
                                </div>
                                <div className="form-control mt-6">
                                    <button className="button">Login</button>
                                </div>
                                <div className="form-control pt-4">
                                    <div className="w-full space-y-2">
                                        <p className="text-center">log in with one of these options</p>
                                        <div className="flex justify-center text-3xl gap-4">
                                            <span onClick={handlerGoogleSignIn}>
                                                <AiFillGoogleCircle className="text-[#ff6c6c]" ></AiFillGoogleCircle>
                                            </span>
                                            <span onClick={handlerGithubSignIn}>
                                                <AiOutlineGithub className="text-violet-700" ></AiOutlineGithub>
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="form-control">
                                    <label className="text-center">
                                        <div className="label-text-alt">
                                            {`Don't have an account? `}
                                            <Link state={currLocation?.state} to={"/registration"} className="font-bold  link link-hover">Register</Link>
                                        </div>
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;