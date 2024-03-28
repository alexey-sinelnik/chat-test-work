import { FC, JSX, useContext, useEffect, useState } from "react";
import MessageComponent from "../message";
import { ChatContext } from "../../context/chat";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../helpers/firebase";
import { DocumentData } from "@firebase/firestore-types";
import { IMessageType } from "../../common/interfaces/chat";

const MessagesComponent: FC = (): JSX.Element => {
    const [messages, setMessages] = useState<DocumentData>([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "chats", data.chatId),
            document => {
                document.exists() && setMessages(document.data().messages);
            }
        );

        return () => unsubscribe();
    }, [data.chatId]);

    const renderMessages = messages.map((message: IMessageType) => (
        <MessageComponent message={message} key={message.id} />
    ));

    return (
        <div className="bg-gray-300 w-full h-full p-4 overflow-y-scroll">
            {renderMessages}
        </div>
    );
};

export default MessagesComponent;
