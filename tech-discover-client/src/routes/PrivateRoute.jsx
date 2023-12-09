import PropTypes from "prop-types"
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const currLocation = useLocation();

    if (loading)
        return <div className="flex justify-center h-screen">
            <span className="loading loading-dots loading-lg"></span>
        </div>
    if (user)
        return children;

    return <Navigate state={currLocation.pathname} to={"/login"}></Navigate>
};

PrivateRoute.propTypes = {
    children: PropTypes.node
}


export default PrivateRoute;