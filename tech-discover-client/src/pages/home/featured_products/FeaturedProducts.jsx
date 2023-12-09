import { useEffect, useState } from "react";
import SectionHeader from "../../../components/section_header/SectionHeader";
import Product from "../../../components/product/Product";
import useSecureAxios from "../../../hooks/useSecureAxios";

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const secureAxios = useSecureAxios();

    useEffect(() => {
        setIsLoading(true);
        secureAxios.get("/featured-products")
            .then(res => {
                // console.log("Featured data ",res.data);
                setIsLoading(false);
                setProducts(res.data);
            });
    }, [secureAxios])
    // console.log(products);

    return (
        <div className="py-20 space-y-8">
            <SectionHeader heading={`Featured products`} subHeading={`Discover the Latest in Tech`}></SectionHeader>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mx-10 md:mx-24 lg:mx-16">
                {
                    products && products?.map((product, index) => <Product key={index} product={product}></Product>)
                }
                {
                    isLoading && <div className="col-span-full text-center"><span className="loading loading-dots loading-lg"></span></div>
                }
            </div>

        </div>
    );
};

export default FeaturedProducts;