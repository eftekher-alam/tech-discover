import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { MdEmail, MdVerified } from "react-icons/md";

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const { displayName, email, photoURL } = user;


    return (
        <div className="p-10">
            <div className="flex gap-8 ">
                <img src={photoURL} alt="" className="w-52" />
                <div className="space-y-4">
                    <h1 className="gradient-text inline-block text-3xl font-semibold">{displayName}</h1>
                    <h2 className="flex justify-start items-center gap-4"><MdEmail className="text-xl"></MdEmail><span>{email}</span></h2>
                    <h2 className="flex justify-start items-center gap-4"><MdVerified className="text-xl"></MdVerified><span>Subscribed</span></h2>
                    <button className="button">Subscribe</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;