import { useContext, useState } from 'react';
import MultiInput from '../../../components/multi_input/MultiInput';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import moment from 'moment/moment';
import AddSpecification from '../../../components/add_specification/AddSpecification';
import useSecureAxios from './../../../hooks/useSecureAxios';
import { useNavigate } from 'react-router-dom';



const AddProduct = () => {
    const secureAxios = useSecureAxios();
    const redirectTo = useNavigate();
    const { user } = useContext(AuthContext);
    const { uid, displayName, email, photoURL } = user;
    const suggestTags = ["electronics", "technology", "gadgets", "health", "wearable", "fitness", "audio", "wireless"]
    const [tags, setTags] = useState([]);
    const [tagsError, setTagsError] = useState(false);
    const [imgLinks, setImgLinks] = useState([]);
    const [imgLinksError, setImgLinksError] = useState(false);
    const [externalLinks, setExternalLinks] = useState([]);
    const [specification, setSpecification] = useState({});
    const [specificationError, setSpecificationError] = useState(false);


    // console.log("Getting spec", specification);
    // console.log("Getting links", imgLinks);
    // console.log("Getting tags", tags);

    const handlerAddProduct = (e) => {
        e.preventDefault();
        console.log("handlerAddProduct");

        if (!imgLinks.length) {
            setImgLinksError(true);
            return;
        }
        setImgLinksError(false);

        if (!tags.length) {
            setTagsError(true);
            return;
        }
        setTagsError(false);


        if (!Object.keys(specification).length) {
            setSpecificationError(true)
            return;
        }
        setSpecificationError(false)

        const product = {
            productImage: imgLinks.map(imgObj => imgObj.text),
            productName: e.target.productName.value,
            postDate: moment().format("MM-DD-YYYY"),
            upvote: 0,
            downvote: 0,
            description: e.target.description.value,
            tags: tags.map(tagObj => tagObj.text),
            ownerFirebaseId: uid,
            ownerName: displayName,
            ownerImage: photoURL,
            ownerEmail: email,
            externalLinks: externalLinks.map(externalObj => externalObj.text),
            featured: "notFeatured",
            specifications: specification,
            status: "pending",
        }

        console.log(product);

        secureAxios.post("/product", product)
            .then(res => {
                if (res.data.success) {
                    Swal.fire({
                        title: "Product added successfully",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Ok"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            redirectTo("/user-dashboard/products");
                        }
                    });
                }
                else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Something is wrong..!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    return (
        <div>
            <div className="hero min-h-screen py-8 md:py-16">
                <div className="card shrink-0 w-full max-w-sm md:max-w-xl lg:max-w-2xl shadow-2xl bg-base-100">
                    <h1
                        className="text-4xl mt-8  text-center uppercase bg-clip-text gradient-text font-bold"
                    >add product</h1>
                    <form onSubmit={handlerAddProduct} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Name</span>
                            </label>
                            <input type="text" name="productName" placeholder="Product Name" className="input  input-sm input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Image Links (Press Enter to add)</span>
                            </label>
                            <MultiInput
                                tags={imgLinks}
                                setTags={setImgLinks}
                                suggestTags={[]}
                                placeholderText={"Press enter to add new link"}
                            ></MultiInput>
                            {
                                imgLinksError && <span className="label-text text-error">Minimum one image link is required.</span>
                            }
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <input type="text" name="description" placeholder="Description" className="input input-sm input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Specification</span>
                            </label>
                            <AddSpecification specification={specification} setSpecification={setSpecification}></AddSpecification>
                            {
                                specificationError && <span className="label-text text-error">Minimum one specification is required.</span>
                            }
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Tags (Press Enter to add)</span>
                            </label>
                            <MultiInput
                                tags={tags}
                                setTags={setTags}
                                suggestTags={suggestTags}
                                placeholderText={"Press enter to add new tag"}
                            ></MultiInput>
                            {
                                tagsError && <span className="label-text text-error">Minimum one tag is required.</span>
                            }
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">External Links (Press Enter to add)</span>
                            </label>
                            <MultiInput
                                tags={externalLinks}
                                setTags={setExternalLinks}
                                suggestTags={[]}
                                placeholderText={"Press enter to add new external links"}
                            ></MultiInput>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Owner Info </span>
                            </label>
                            <div className='flex  justify-evenly items-end gap-4'>
                                <img src={photoURL} alt="" className='w-10 h-10 rounded-full' />
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Owner Name</span>
                                    </div>
                                    <input type="text" placeholder="Type here" className="input input-sm input-bordered w-full max-w-xs" readOnly value={displayName} />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Owner Email</span>
                                    </div>
                                    <input type="text" placeholder="Type here" className="input input-sm input-bordered w-full max-w-xs" readOnly value={email} />
                                </label>
                            </div>
                        </div>
                        <div className="form-control mt-6">
                            <button className="button">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;