import { Link, NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import "./NavBar.css"

const NavBar = () => {

    const { user, loggOut, loading } = useContext(AuthContext);
    const currLocation = useLocation();
    // console.log("User from navbar ", user);

    const handlerLogOut = () => {
        loggOut();
    }

    const navItems = <>
        <li><NavLink to={"/"}>HOME</NavLink></li>
        <li><NavLink to={"/products"}>PRODUCTS</NavLink></li>
    </>

    return (

        <div className="navbar bg-base-100 fixed z-10 shadow-lg max-w-screen-2xl mx-auto">

            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navItems}
                    </ul>
                </div>
                <Link to={"/"}
                    className="font-bold text-xl md:text-3xl tracking-wide md:tracking-widest lg:ml-8 text-[#ff6c6c]"
                >TECH <span className="text-[#7d5fff]">DISCOVER</span></Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>

            <div className="navbar-end lg:mr-8">

                <div>
                    {
                        user ?
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        {
                                            user?.photoURL ?
                                                <img src={user?.photoURL} />
                                                :
                                                <img src="https://i.ibb.co/8sQW4sR/user.png" />
                                        }
                                    </div>
                                </label>
                                <ul tabIndex={0} className="dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52">
                                    <li className="p-2">
                                        <h4 className="font-medium inline-block gradient-text">{user?.displayName}</h4>
                                        <h4 className="text-sm ">{user?.email}</h4>
                                    </li>
                                    <div className="menu menu-sm">
                                        <li> <Link to={"/user-dashboard/profile"} >Dashboard</Link> </li>
                                        <li><button onClick={handlerLogOut}>Logout</button></li>
                                    </div>
                                </ul>
                            </div>
                            :
                            !loading && <div className="max-md:flex max-md:flex-col gap-2 md:space-x-2">
                                <Link state={currLocation?.state} to={"/registration"} className="button">Register</Link>
                                <Link to={"/login"} className="button">Log In</Link>
                            </div>
                    }
                </div>


            </div>
        </div >
    );
};






export default NavBar;