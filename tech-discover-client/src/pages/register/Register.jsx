import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillGoogleCircle, AiOutlineGithub } from "react-icons/ai";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { AuthContext } from "../../providers/AuthProvider";
import { Helmet } from "react-helmet";

const Register = () => {

    const { createUser, googleSignIn, githubSignIn, updateUserProfile, createUserMongoDB } = useContext(AuthContext);
    const navigate = useNavigate();
    const currLocation = useLocation();

    console.log("Previous location ", currLocation.state);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const handlerRegister = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const photourl = e.target.photourl.value ? e.target.photourl.value : null;
        const email = e.target.email.value;
        const password = e.target.password.value;


        // validations
        if (password.length < 6) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Password can't be less than 6 characters",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        if (!(/[A-Z]/.test(password))) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Password doesn't have capital letter",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (!(/\W|_/g.test(password))) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Password doesn't have a special character",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        createUser(email, password)
            .then(() => {
                updateUserProfile(name, photourl)
                    .then(() => {
                        createUserMongoDB();
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: 'Account created successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate(currLocation?.state ? currLocation?.state : "/");
                        window.location.reload();
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

    const handlerGoogleSignIn = () => {
        googleSignIn()
            .then(() => {
                createUserMongoDB();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: 'Account created successfully',
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
                    title: 'Account created successfully',
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
                <title>Tech Discover | Registration</title>
            </Helmet>
            <div className="flex gap-10">
                <div
                    className="lg:w-1/2 flex lg:justify-end max-lg:hidden"
                    data-aos="fade-down"
                >
                    <img src="https://i.ibb.co/p2bRrZv/signup.jpg" alt="" className="w-[80%]" />
                </div>
                <div className="w-full lg:w-1/2 max-lg:flex max-lg:justify-center max-lg:items-center">
                    <div
                        className="card w-full max-w-sm lg:max-w-md shadow-2xl"
                        data-aos="fade-up"
                    >
                        <h1
                            className="text-4xl mt-8  text-center uppercase bg-clip-text gradient-text font-bold"
                        >Registration</h1>
                        <form onSubmit={handlerRegister} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" name="name" placeholder="name" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Photo Url (optional)</span>
                                </label>
                                <input type="text" name="photourl" placeholder="photo url" className="input input-bordered" />
                            </div>
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
                            </div>
                            <div className="form-control mt-6">
                                <button className="button">Register</button>
                            </div>
                            <div className="form-control pt-4">
                                <div className="w-full space-y-2">
                                    <p className="text-center">or use one of these options</p>
                                    <div className="flex justify-center text-3xl gap-4">
                                        <span onClick={handlerGoogleSignIn}>
                                            <AiFillGoogleCircle ></AiFillGoogleCircle>
                                        </span>
                                        <span onClick={handlerGithubSignIn}>
                                            <AiOutlineGithub ></AiOutlineGithub>
                                        </span>
                                    </div>
                                </div>

                            </div>
                            <div className="form-control pt-4">
                                <label className="text-center">
                                    <div className="label-text-alt">
                                        {`Don't have an account? `}
                                        <Link to={"/login"} className="font-bold  link link-hover">Log In</Link>
                                    </div>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;