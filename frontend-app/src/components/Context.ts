import * as React from "react";

interface PropsTypes {
    cart: any
    token: string | undefined
    setToken: (token: string) => void
    isAdmin: () => boolean
}

export const PropsContext = React.createContext({} as PropsTypes)
