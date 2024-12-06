import { useEffect, useState } from "react";
import { onAuthChange } from "../utils/firebaseFunctions";
import { useRouter } from "next/router";

export const userCheckHook = () => {
    const [user, setUser] = useState(false)
    const router = useRouter()
    useEffect(() => {
      const unsubscribe = onAuthChange((user) => {
        if (user) {
          return(user);
        } else {
          router.push('/log-in')
        }
      });
      return () => unsubscribe();
    }, []);

    return user;
}