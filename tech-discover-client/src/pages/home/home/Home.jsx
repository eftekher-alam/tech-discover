import Banner from "../banner/Banner";
import { Helmet } from "react-helmet";
import FeaturedProducts from "../featured_products/FeaturedProducts";
import TrendingProducts from "../trending_products/TrendingProducts";
import { useEffect } from "react";


const Home = () => {
    useEffect(() => {
        window.scrollTo(1, 1);
    }, [])
    return (
        <div className="min-h-screen">
            <Helmet>
                <title>Tech Discover | Home</title>
            </Helmet>
            <Banner></Banner>
            <FeaturedProducts></FeaturedProducts>
            <TrendingProducts></TrendingProducts>
        </div>
    );
};

export default Home;