import React, {
    createContext,
    useState
} from "react";

interface AuthContextType {
    token: string | null;
    id: string | null;
    role: string | null;
    login: (
        token: string,
        id: string,
        role: string
    ) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [id, setId] = useState<string | null>(
        localStorage.getItem("id")
    );

    const [role, setRole] = useState<string | null>(
        localStorage.getItem("role")
    );


    // Se escribe en localStorage de forma sincrona, en el mismo momento
    // en el que se llama login()/logout() -- NO dentro de un useEffect.
    // AuthProvider envuelve todas las rutas, y React ejecuta los efectos
    // de los hijos antes que los del padre en el mismo commit: si el
    // token se guardara en un useEffect aqui, el primer fetch de la
    // pagina a la que se navega despues del login podia dispararse
    // antes de que el token existiera en localStorage.

    const login = (
        newToken: string,
        userId: string,
        userRole: string
    ) => {

        localStorage.setItem("token", newToken);
        localStorage.setItem("id", userId);
        localStorage.setItem("role", userRole);

        setToken(newToken);
        setId(userId);
        setRole(userRole);

    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("role");

        setToken(null);
        setId(null);
        setRole(null);

    };


    return (
        <AuthContext.Provider
            value={{
                token,
                id,
                role,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
