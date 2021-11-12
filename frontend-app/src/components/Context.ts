import * as React from "react";

interface PropsTypes {
    cart: any
    token: string | undefined
    setToken: (userToken: string, isAdmin?: boolean) => void
    isAdmin: () => boolean
}

export const PropsContext = React.createContext({} as PropsTypes)
