import { createContext, useContext, useState } from "react";

interface UserContextProps {
    user: {
        username: string;
        email: string;
        role: string;
    } | null;
    setUser: (user: { username: string; email: string; role: string }) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<{ username: string; email: string; role: string } | null>(null);

    const setUser = (user: { username: string; email: string; role: string }) => {
        setUserState(user);
        console.log("UserContext setUser(): ",user);
        }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useDbUser = () => {
    const context = useContext(UserContext);
    if (!context){
        throw new Error("useDbUser must be used within UserProvider");
    }
    return context;
}
import { useEffect } from "react";

export const useFetchUser = (userId: string) => {
    const { user, setUser } = useDbUser();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId, setUser]);

    return user;
};