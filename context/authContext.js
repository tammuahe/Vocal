import { Children, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const setAuth = authUser => {
        setUser(authUser)
    }

    const setUserData = userData => {
        setUser({...userData})
    }


    const login = async (email, password) => {
        try{
            supabase.auth.signInWithPassword({
                email,
                password,
            })
        }
        catch(e){

        }
    }


    const logout = async () => {
        try{

        }
        catch(e){
            
        }
    }

    const register = async (email, password, username, profileUrl) => {
        try{

        }
        catch(e){
            
        }
    }

    return (
        <AuthContext.Provider value={{user, setAuth, setUserData, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext)

    if (!value){
        throw new Error('useAuth must be wrapped inside AuthContextProvider')
    }

    return value;
}