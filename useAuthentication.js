import { useState, useEffect } from "react";

import { onAuthStateChanged } from "@firebase/auth";

import {auth} from "./firebase";

export default function useAuthentication() {
	const [user, setUser] = useState(null);

	useEffect(()=>{
		const unsub = onAuthStateChanged(auth, user=>{
			console.log("User details \n",user);
			if(user){
				setUser(user);
			} else {
				setUser(null);
			}
		})
	},[]);
	return {user};
}