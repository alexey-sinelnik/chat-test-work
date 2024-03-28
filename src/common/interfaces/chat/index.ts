import React, { ReactNode } from "react";

interface IActionType {
    type: string;
    payload: { uid: string };
}

export interface IChatContextProvider {
    children: ReactNode;
}

export interface IChatContextValue {
    data: IChatContextState;
    dispatch: React.Dispatch<IActionType>;
}

export interface IChatContextState {
    chatId: string;
    user: any;
}

export interface IMessageProps {
    message: {
        date: {
            nanoseconds: number;
            seconds: number;
        };
        id: string;
        senderId: string;
        text: string;
    };
}

export interface IMessageType {
    date: { nanoseconds: number; seconds: number };
    id: string;
    senderId: string;
    text: string;
}
