import { Outlet } from "react-router-dom";
import UserSideBar from "../pages/user_dashboard/user_side_bar/UserSideBar";
import UserDashboardNavBar from "../pages/user_dashboard/user_dashboard_navbar/UserDashboardNavBar";

const UserDashboard = () => {
    return (
        <div>
            <div className="">
                <div className="fixed">
                    <UserSideBar></UserSideBar>
                </div>
                <div className="lg:pl-80">
                    <UserDashboardNavBar></UserDashboardNavBar>
                    <div className="max-lg:pt-16"><Outlet></Outlet></div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;