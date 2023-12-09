import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import ProductDetails from "../pages/product_details/ProductDetails";
import Products from "../pages/products/Products";
import PrivateRoute from './PrivateRoute';
import UserDashboard from "../layout/UserDashboard";
import UserProfile from "../pages/user_dashboard/user_profile/UserProfile";
import AddProduct from "../pages/user_dashboard/add_product/AddProduct";
import MyProducts from "../pages/user_dashboard/my-products/MyProducts";
import UpdateProduct from "../pages/user_dashboard/update_product/UpdateProduct";
import ManageUsers from "../pages/user_dashboard/manage_users/ManageUsers";
import Error_Page from "../pages/error_page/Error_Page";
import ProdReviewQueue from "../pages/user_dashboard/prod_review_queue/ProdReviewQueue";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement: <Error_Page></Error_Page>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "login",
                element: <Login></Login>
            },
            {
                path: "registration",
                element: <Register></Register>
            },
            {
                path: "product-details/:id",
                element: <PrivateRoute><ProductDetails></ProductDetails></PrivateRoute>
            },
            {
                path: "products",
                element: <Products></Products>
            }
        ]
    },
    {
        path: "user-dashboard",
        element: <PrivateRoute><UserDashboard></UserDashboard></PrivateRoute>,
        errorElement: <Error_Page></Error_Page>,
        children: [
            // Normal users routes
            {
                path: "profile",
                element: <UserProfile></UserProfile>
            },
            {
                path: "product",
                element: <AddProduct></AddProduct>
            },
            {
                path: "products",
                element: <MyProducts></MyProducts>
            },
            {
                path: "product/:id",
                element: <UpdateProduct></UpdateProduct>
            },

            // Admin routes
            {
                path: "Statistics",
                element: <div>Stats</div>
            },
            {
                path: "manage-users",
                element: <ManageUsers></ManageUsers>
            },
            {
                path: "manage-coupons",
                element: <div>Coupons manage</div>
            },

            //Moderator routes
            {
                path: "product-review-queue",
                element: <ProdReviewQueue></ProdReviewQueue>
            },
            {
                path: "reported-contents",
                element: <div>Reported content</div>
            }
        ]

    }
]);