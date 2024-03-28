import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../../helpers/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AuthImageBlockComponent from "../../components/auth-image-block";
import Cookies from "js-cookie";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const response: any = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            Cookies.set("token", response.user.accessToken);

            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);

            await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async downloadURL => {
                    try {
                        await updateProfile(response.user, {
                            displayName,
                            photoURL: downloadURL
                        });
                        await setDoc(doc(db, "users", response.user.uid), {
                            uid: response.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });

                        await setDoc(
                            doc(db, "userChats", response.user.uid),
                            {}
                        );
                        navigate("/");
                    } catch (err) {
                        console.log(err);
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex h-screen">
            <AuthImageBlockComponent />

            <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
                <div className="max-w-md w-full p-6">
                    <h1 className="text-3xl font-semibold mb-6 text-black text-center">
                        Sign Up
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-12 relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-12 relative">
                            <label
                                htmlFor="avatar"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Avatar
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-sm text-gray-600 text-center">
                        <p>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-black hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;
