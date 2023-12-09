import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import { useContext } from "react";
import { FaHome, FaList } from "react-icons/fa";
import { IoBagAddSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { MdList, MdLocalOffer, MdOutlineQueryStats, MdReport } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import useRole from "../../../hooks/useRole";


const UserSideBar = () => {
    const { user, loggOut } = useContext(AuthContext);

    const handlerLogOut = () => {
        loggOut();
    }

    const userRole = useRole();

    const linkItems = <>
        {
            (userRole === "User") && <div>
                <li><NavLink to={"/user-dashboard/profile"}>
                    <CgProfile className="text-xl"></CgProfile> My Profile</NavLink>
                </li>
                <li><NavLink to={"/user-dashboard/product"}>
                    <IoBagAddSharp className="text-xl"></IoBagAddSharp> Add Product</NavLink>
                </li>
                <li><NavLink to={"/user-dashboard/products"}>
                    <FaList></FaList> My Products</NavLink>
                </li>
            </div>
        }
        {
            (userRole === "Admin") && <div>
                <li><NavLink to={"/user-dashboard/profile"}>
                    <CgProfile className="text-xl"></CgProfile> My Profile</NavLink>
                </li>
                <li><NavLink to={"/user-dashboard/Statistics"}>
                    <MdOutlineQueryStats className="text-xl"></MdOutlineQueryStats>Statistics</NavLink>
                </li>
                <li><NavLink to={"/user-dashboard/manage-users"}>
                    <FaUsersGear className="text-xl"></FaUsersGear> Manage Users</NavLink>
                </li>
                <li><NavLink to={"/user-dashboard/manage-coupons"}>
                    <MdLocalOffer className="text-xl"></MdLocalOffer> Manage Coupons</NavLink>
                </li>
            </div>
        }
        {
            (userRole === "Moderator") && <div>
                <li><NavLink to={"/user-dashboard/profile"}>
                    <CgProfile className="text-xl"></CgProfile> My Profile</NavLink>
                </li>
                <li><NavLink to={"/user-dashboard/product-review-queue"}>
                    <MdList className="text-xl"></MdList> Product Review Queue</NavLink>
                </li>
                <li><NavLink to={"/user-dashboard/reported-contents"}>
                    <MdReport className="text-xl"></MdReport>Reported Contents</NavLink>
                </li>
            </div>
        }
    </>
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-side">
                    <ul className="menu p-4 w-80 min-h-full bg-violet-200 text-base-content">
                        <div className="space-y-2 mb-3">
                            <Link to={"/"} className="font-bold text-3xl text-[#ff6c6c]"                            >TECH <span className="text-[#542eff]">DISCOVER</span></Link>
                            <div className="flex justify-start items-center gap-2 border-b border-pink-300 pb-4">
                                <div >
                                    {
                                        user?.photoURL ?
                                            <img src={user?.photoURL} className="w-10 rounded-full" />
                                            :
                                            <img src="https://i.ibb.co/8sQW4sR/user.png" className="w-10 rounded-full" />
                                    }
                                </div>
                                <h4 className="font-medium inline-block gradient-text text-xl">{user?.displayName}</h4>
                            </div>
                        </div>

                        {/* Sidebar content here */}
                        <div className="side-bar-items font-semibold border-b border-pink-300 pb-4">
                            {linkItems}
                        </div>
                        <div className="pt-2">
                            <li><NavLink to={"/"}>
                                <FaHome className="text-xl"></FaHome>Home</NavLink>
                            </li>
                        </div>
                        <div className="pt-2">
                            <li><a onClick={handlerLogOut}>
                                <CiLogout className="text-xl"></CiLogout>Log Out</a>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserSideBar;