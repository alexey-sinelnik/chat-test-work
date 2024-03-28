import { FC, JSX, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../helpers/firebase";
import { AuthContext } from "../../context/auth";
import { ChatContext } from "../../context/chat";
import { DocumentData } from "@firebase/firestore-types";
import { Unsubscribe, User } from "firebase/auth";

const ChatListComponent: FC = (): JSX.Element => {
    const [chats, setChats] = useState<DocumentData | undefined>([]);
    const [onlineUsers] = useState("");
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getUserChats = () => {
            const unsubscribe: Unsubscribe = onSnapshot(
                doc(db, "userChats", currentUser ? currentUser.uid : ""),
                document => {
                    setChats(document.data());
                }
            );
            return () => unsubscribe();
        };
        currentUser && currentUser.uid && getUserChats();
    }, [currentUser]);

    const handleSelect = (user: User): void => {
        dispatch({ type: "CHANGE_USER", payload: user });
    };

    const renderChats: JSX.Element[] = Object.entries(chats ? chats : {})
        ?.sort((a, b) => b[1]?.date?.seconds - a[1]?.date?.seconds)
        .map(chat => {
            return (
                <div
                    className="relative flex items-center gap-2 cursor-pointer hover:bg-gray-300 transition duration-300"
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1].userInfo)}
                >
                    <div className="flex justify-center items-center h-14 w-14 rounded-full p-2 bg-white">
                        {onlineUsers === chat[1].userInfo.uid && (
                            <div className="w-2 h-2 rounded-full bg-green-600 absolute top-7 right-3" />
                        )}
                        <img src={chat[1].userInfo.photoURL} alt="" />
                    </div>
                    <div className="">
                        <span className="text-lg font-medium">
                            {chat[1].userInfo.displayName}
                        </span>
                        <p className="text-sm font-light">
                            {chat[1].lastMessage?.text}
                        </p>
                    </div>
                </div>
            );
        });

    return <div className="flex flex-col gap-4 p-4">{renderChats}</div>;
};

export default ChatListComponent;
