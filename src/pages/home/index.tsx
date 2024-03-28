import SidebarComponent from "../../components/sidebar";
import ChatComponent from "../../components/chat";

const HomePage = () => {
    return (
        <div className="bg-gray-300 h-full flex justify-center items-center overflow-hidden">
            <div className="flex border-2 border-white rounded-lg w-[65%] h-[80%]">
                <ChatComponent />
                <SidebarComponent />
            </div>
        </div>
    );
};

export default HomePage;
