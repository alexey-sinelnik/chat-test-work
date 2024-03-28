import { FC, JSX, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/auth";
import { ChatContext } from "../../context/chat";
import { IMessageProps } from "../../common/interfaces/chat";

const MessageComponent: FC<IMessageProps> = ({ message }): JSX.Element => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const ref = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div
            ref={ref}
            className={`flex gap-4 mb-4 ${currentUser && message.senderId === currentUser.uid && "owner"}`}
        >
            <div className="flex flex-col justify-center">
                <div>
                    <div className="flex justify-center items-center h-14 w-14 rounded-full p-2 bg-white">
                        <img
                            src={
                                currentUser &&
                                message.senderId === currentUser.uid
                                    ? currentUser.photoURL
                                    : data.user.photoURL
                            }
                            alt=""
                            className=" h-10 w-10"
                        />
                    </div>
                    <span>just now</span>
                </div>
            </div>
            <div className="max-w-[90%] md:max-w-[50%] flex flex-col">
                <p className="bg-white p-4 rounded-xl max-w-max">
                    {message.text}
                </p>
            </div>
        </div>
    );
};

export default MessageComponent;
