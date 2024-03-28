import { FC, JSX } from "react";
import NavbarComponent from "../navbar";
import SearchComponent from "../search";
import ChatListComponent from "../chat-list";

const SidebarComponent: FC = (): JSX.Element => {
    return (
        <div className="flex flex-col basis-1/4 border-l-2 bg-gray-200 shadow-lg">
            <NavbarComponent />
            <SearchComponent />
            <ChatListComponent />
        </div>
    );
};

export default SidebarComponent;
