import { IUser } from "@/types";
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { set } from "zod";

export const INITIAL_USER = {
	id: "",
	name: "",
	username: "",
	email: "",
	imageUrl: "",
	bio: "",
};

const INITIAL_STATE = {
	user: INITIAL_USER,
	isAuthenticated: false,
	isLoading: false,
	setUser: () => {},
	setIsAuthenticated: () => {},
	checkAuthUser: async () => false as boolean,
};

type IContextType = {
	user: IUser;
	isAuthenticated: boolean;
	isLoading: boolean;
	setUser: React.Dispatch<React.SetStateAction<IUser>>;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const Navigate = useNavigate();
	const [user, setUser] = useState<IUser>(INITIAL_USER);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const checkAuthUser = async () => {
		setIsLoading(true);
		try {
			const currentAccout = await getCurrentUser();
			if (currentAccount) {
				setUser({
					id: currentAccount.id,
					name: currentAccount.name,
					username: currentAccount.username,
					email: currentAccount.email,
					imageUrl: currentAccount.imageUrl,
					bio: currentAccount.bio,
				});
				setIsAuthenticated(true);
			}
		}
	}
}


export const userUserContext = () => useContext(AuthContext);