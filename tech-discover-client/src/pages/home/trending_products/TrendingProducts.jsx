import { useEffect, useState } from "react";
import SectionHeader from "../../../components/section_header/SectionHeader";
import Product from "../../../components/product/Product";
import { Link } from "react-router-dom";
import useSecureAxios from "../../../hooks/useSecureAxios";

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const secureAxios = useSecureAxios();

    useEffect(() => {
        setIsLoading(true);
        secureAxios.get("/trending-products")
            .then(res => {
                setIsLoading(false)
                setProducts(res.data);
            })
    }, [secureAxios])

    return (
        <div className="pb-20 space-y-8">
            <SectionHeader heading={`Trending products`} subHeading={`Top Upvoted Tech`}></SectionHeader>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mx-10 md:mx-24 lg:mx-16">
                {
                    products && products.map((product, index) => <Product key={index} product={product}></Product>)
                }
                {
                    isLoading && <div className="col-span-full text-center"><span className="loading loading-dots loading-lg"></span></div>
                }
            </div>
            <div className="text-center" data-aos="fade-up">
                <Link to={"/products"} className="button">Discover All Products</Link>
            </div>
        </div>
    );
};

export default TrendingProducts;