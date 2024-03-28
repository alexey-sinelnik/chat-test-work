import { FC, JSX } from "react";
import MessagesComponent from "../messages";
import TextFieldComponent from "../inputs/text-field";

const ChatComponent: FC = (): JSX.Element => {
    return (
        <div className="flex grow">
            <div className="w-full h-full flex flex-col items-center justify-between overflow-hidden">
                <MessagesComponent />
                <TextFieldComponent />
            </div>
        </div>
    );
};

export default ChatComponent;
