import { Link } from "react-router-dom";

const Error_Page = () => {
    return (
        <div className="h-screen flex justify-center items-center flex-col">
            <img src="https://cdn.svgator.com/images/2022/01/404-page-animation-example.gif" className="w-[30%]"></img>
            <Link to={"/"} className="btn btn-outline btn-warning  font-marcellus">
                <span className='text-black'>BACK TO HOME</span>
            </Link>
        </div>
    );
};

export default Error_Page;