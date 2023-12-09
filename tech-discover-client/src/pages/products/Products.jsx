import { useEffect } from "react";
import useSecureAxios from "../../hooks/useSecureAxios";
import { useState } from "react";
import Product from "../../components/product/Product";
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import "./products.css"
import { IoSearch } from "react-icons/io5";
import { Helmet } from "react-helmet";

const Products = () => {
    const secureAxios = useSecureAxios();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchSummery, setSearchSummery] = useState("");

    useEffect(() => {
        window.scrollTo(1, 1);
        setIsLoading(true);
        secureAxios.get("/products")
            .then(res => {
                setIsLoading(false);
                setProducts(res.data)
            });
    }, [secureAxios])


    // Pagination 
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + 20;
    const currentItems = products.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(products.length / 20);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        window.scrollTo(1, 1);
        const newOffset = (event.selected * 20) % products.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };


    const handlerSearch = () => {
        setIsLoading(true);
        const searchText = document.getElementById("search").value;
        secureAxios(`/search-products?search=${searchText}`)
            .then(res => {
                setIsLoading(false);
                if (res?.data.length) {
                    if (searchText)
                        setSearchSummery(`Results for ${searchText}, ${res?.data.length} items found.`);
                    else
                        setSearchSummery("");
                    document.getElementById("search").value = "";
                    setProducts(res?.data);
                }
                else {
                    if (searchText)
                        setSearchSummery(`No data found for ${searchText}`);
                    else
                        setSearchSummery("");
                    setProducts([]);
                }
            })
    }


    return (
        <div className="min-h-screen pt-20">
            <Helmet>
                <title>Tech Discover | Products</title>
            </Helmet>
            <div className="">
                <div className="pt-4 pb-6 flex justify-center">
                    <input type="text" id="search" placeholder="Search by tags or product name" className="input input-bordered w-full max-w-xs rounded-l-full" />
                    <button className="btn rounded-r-full" onClick={handlerSearch}><IoSearch />Search</button>
                </div>
                {
                    searchSummery && <div className="w-full text-center pb-6 font-semibold text-gray-400">{searchSummery}</div>
                }
                {
                    isLoading && <div className="w-full min-h-screen text-center pt-[30vh]"><span className="loading loading-dots loading-lg"></span></div>
                }
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mx-10 md:mx-24 lg:mx-16">
                    {
                        !isLoading && <Items currentItems={currentItems} />
                    }
                </div>
                <div className="myPagination my-8">
                    {
                        !isLoading && <ReactPaginate
                            breakLabel="..."
                            nextLabel="Next"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="Previous"
                            renderOnZeroPageCount={null}
                        />
                    }
                </div>
            </div>

        </div>
    );
};

function Items({ currentItems }) {
    return (
        <>
            {
                currentItems && currentItems?.map((product, index) => <Product key={index} product={product}></Product>)}
        </>
    );
}

Items.propTypes = {
    currentItems: PropTypes.array
}



export default Products;