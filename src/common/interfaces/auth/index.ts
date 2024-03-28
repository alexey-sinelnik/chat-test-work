import { ReactNode } from "react";
import { User } from "firebase/auth";

export interface IAuthContextProvider {
    children: ReactNode;
}

export interface IAuthContextValue {
    currentUser: User | null;
}
