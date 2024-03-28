import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "../auth";
import { User } from "firebase/auth";
import {
    IChatContextProvider,
    IChatContextState,
    IChatContextValue
} from "../../common/interfaces/chat";

export const ChatContext = createContext({} as IChatContextValue);

export const ChatContextProvider = ({ children }: IChatContextProvider) => {
    const { currentUser } = useContext(AuthContext);
    const initialState: IChatContextState = {
        chatId: "null",
        user: {} as User
    };

    const chatReducer = (
        state: IChatContextState,
        action: { type: string; payload: { uid: string } }
    ) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser && currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser?.uid
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, initialState);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};
