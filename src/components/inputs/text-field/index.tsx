import { FC, FormEvent, JSX, useContext, useState } from "react";
import { IoSend } from "react-icons/io5";
import { AuthContext } from "../../../context/auth";
import { ChatContext } from "../../../context/chat";
import {
    Timestamp,
    arrayUnion,
    doc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { db, storage } from "../../../helpers/firebase";
import { v4 as uuid } from "uuid";
import {
    TaskEvent,
    getDownloadURL,
    ref,
    uploadBytesResumable
} from "firebase/storage";

const TextFieldComponent: FC = (): JSX.Element => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!text) return;
        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on("error" as TaskEvent, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    async downloadURL => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser && currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        });
                    }
                );
            });
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser && currentUser.uid,
                    date: Timestamp.now()
                })
            });
        }

        await updateDoc(
            doc(db, "userChats", currentUser ? currentUser.uid : ""),
            {
                [data.chatId + ".lastMessage"]: {
                    text
                },
                [data.chatId + ".date"]: serverTimestamp()
            }
        );

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + ".date"]: serverTimestamp()
        });

        setText("");
        setImg(null);
    };

    return (
        <form
            className="w-full h-16 p-2.5 bg-white flex items-center justify-between"
            onSubmit={handleSend}
        >
            <input
                type="text"
                onChange={e => setText(e.target.value)}
                placeholder="type something..."
                value={text}
                className="w-full border-none outline-none px-4"
            />
            <div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                >
                    <IoSend className="inline w-5 h-5 me-3 text-white" />
                    Send
                </button>
            </div>
        </form>
    );
};

export default TextFieldComponent;
