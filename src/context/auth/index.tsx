import { createContext, ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../helpers/firebase";

interface IAuthContextProvider {
    children: ReactNode;
}

interface IAuthContextValue {
    currentUser: User | null;
}

export const AuthContext = createContext({} as IAuthContextValue);

export const AuthContextProvider = ({ children }: IAuthContextProvider) => {
    const [currentUser, setCurrentUser] = useState<User | null>({} as User);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
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
