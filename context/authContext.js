import { Children, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);


    useEffect(() => {
    const {data} = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user;
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
  
    return () => {
      data.subscription.unsubscribe()
    };
    }, []);

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
        const {error} = await supabase.auth.signOut()
        if(error){
            Alert.alert('Đăng xuất','Không thể đăng xuất.')
        }
        else{
            setAuth(null);
        }
    }

    const register = async (email, password, username) => {
        const {data: {session}, error} = await supabase.auth.signUp(
            {
              email,
              password,
              options:
                {
                  data: {
                    userName: username,
                  }
                }
            }
        )
        return {data}
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