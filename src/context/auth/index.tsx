import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import { auth } from "../../helpers/firebase";
import {
    IAuthContextProvider,
    IAuthContextValue
} from "../../common/interfaces/auth";

export const AuthContext = createContext({} as IAuthContextValue);

export const AuthContextProvider = ({ children }: IAuthContextProvider) => {
    const [currentUser, setCurrentUser] = useState<User | null>({} as User);

    useEffect(() => {
        const unsub: Unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        });

        return () => {
            unsub();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
