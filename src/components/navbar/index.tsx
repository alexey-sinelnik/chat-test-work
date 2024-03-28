import { FC, JSX } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../helpers/firebase";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { IoExit } from "react-icons/io5";
import { FcBusinessman } from "react-icons/fc";

const NavbarComponent: FC = (): JSX.Element => {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Cookies.remove("token");
                navigate("/login");
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    return (
        <div className="w-full h-[70px] flex items-center justify-between px-4 py-2">
            <div className="flex justify-center items-center h-14 w-14 rounded-full p-2 bg-white">
                <FcBusinessman className="text-xl h-10 w-10" />
            </div>
            <div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                >
                    <IoExit className="inline w-5 h-5 me-3 text-white" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default NavbarComponent;
