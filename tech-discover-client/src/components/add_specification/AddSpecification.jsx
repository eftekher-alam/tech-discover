import { MdAdd } from "react-icons/md";
import PropTypes from 'prop-types';
import { RxCross2 } from "react-icons/rx";

const AddSpecification = ({ specification, setSpecification }) => {

    const handlerSpecificationAdd = () => {
        const property = document.getElementById("property").value;
        const value = document.getElementById("value").value;

        if (property.length && value.length) {
            const newSpecification = {}
            newSpecification[property] = value;
            setSpecification({ ...specification, ...newSpecification });
            document.getElementById("property").value = "";
            document.getElementById("value").value = "";
            return;
        }
    }

    const handlerDeleteSpec = (removeKey) => {

        const updateSpecification = Object.fromEntries(
            Object.entries(specification).filter(([key, value]) => key !== removeKey && value === value)
            //value === value this part just to use remove "Never read error eslin"
        )
        setSpecification(updateSpecification);
    }

    return (
        <div>
            <div className="pb-2 flex  flex-wrap gap-1">
                {
                    specification && Object.entries(specification).map(([key, value], index) =>
                        <div key={index} className="inline-block text-sm">
                            <p className="flex gap-2 items-center py-1 px-3 text-white bg-gradient-to-r from-[#ff6c6c] to-[#7d5fff]">{key} : {value}
                                <span className="hover:cursor-pointer" onClick={() => handlerDeleteSpec(key, value)} > <RxCross2 ></RxCross2> </span>
                            </p>
                        </div>
                    )
                }
            </div>
            <div className="flex max-md:flex-col max-lg:gap-2 justify-between">
                <label className="flex p-0 input input-sm input-bordered bg-transparent">
                    <div className=" px-2 bg-gray-300">Property</div>
                    <div className="col-span-5 flex items-center justify-center">
                        <input type="text" id="property" placeholder="Type here..." className="h-7 px-2" />
                    </div>
                </label>
                <label className="flex p-0 input input-sm input-bordered bg-transparent">
                    <div className=" px-2 bg-gray-300">Value</div>
                    <div className="col-span-5 flex items-center justify-center">
                        <input type="text" id="value" placeholder="Type here..." className="h-7 px-2" />
                    </div>
                </label>
                <a onClick={handlerSpecificationAdd} className="btn btn-sm btn-square">
                    <MdAdd></MdAdd>
                </a>
            </div>
        </div>
    );
};

AddSpecification.propTypes = {
    specification: PropTypes.object,
    setSpecification: PropTypes.func
}


export default AddSpecification;