import { KeyboardEvent, FC, JSX, useState, useContext } from "react";
import {
    query,
    collection,
    where,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../../helpers/firebase";
import { AuthContext } from "../../context/auth";
import { User } from "firebase/auth";
import { DocumentData } from "@firebase/firestore-types";

const SearchComponent: FC = (): JSX.Element => {
    const [userName, setUserName] = useState("");
    const [user, setUser] = useState<DocumentData>({} as User);
    const [error, setError] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const searchQuery = query(
            collection(db, "users"),
            where("displayName", "==", userName)
        );
        try {
            const querySnapshot = await getDocs(searchQuery);
            querySnapshot.forEach(document => setUser(document.data()));
        } catch (error: unknown) {
            setError(true);
        }
    };

    const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        const combinedId: string =
            currentUser && currentUser?.uid > user?.uid
                ? currentUser?.uid + user?.uid
                : user.uid + currentUser?.uid;

        try {
            const response = await getDoc(doc(db, "chats", combinedId));
            if (!response.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(
                    doc(db, "userChats", currentUser ? currentUser.uid : ""),
                    {
                        [combinedId + ".userInfo"]: {
                            uid: user.uid,
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        },
                        [combinedId + ".date"]: serverTimestamp()
                    }
                );

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser && currentUser.uid,
                        displayName: currentUser && currentUser.displayName,
                        photoURL: currentUser && currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="border-b-[1px] border-white px-4">
            <div className="p-2">
                <input
                    type="text"
                    placeholder="Find a user"
                    value={userName}
                    onKeyDown={handleKey}
                    className="bg-transparent border-none outline-none"
                    onChange={e => setUserName(e.target.value)}
                />
            </div>
            {error && (
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-300 transition duration-300">
                    <p>User not found</p>
                </div>
            )}
            {user.photoURL && (
                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-300 transition duration-300"
                    onClick={handleSelect}
                >
                    <div className="flex justify-center items-center h-14 w-14 rounded-full p-2">
                        <img
                            src={user.photoURL ? user.photoURL : ""}
                            alt=""
                            className="h-10 w-10"
                        />
                    </div>
                    <span>{user.displayName}</span>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
