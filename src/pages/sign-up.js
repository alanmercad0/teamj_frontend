import React, { useEffect, useState } from 'react'
import Input from '../../components/Input';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Head from 'next/head';
import { anonymousSignIn, logout, onAuthChange, registerWithEmail } from '../../utils/firebaseFunctions';

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        console.log(user)
      } else {
        console.log("no user");
      }
    });
    return () => unsubscribe();
  }, []);

  async function signup(){
    setLoading(true)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailRegex.test(email)){
      setError('Email format incorrect')
      setLoading(false)
      return;
    }

    if(password != confirmPass){
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const register = await registerWithEmail(
      email,
      password,
      `${firstName} ${lastName}`,
      username
    );
    console.log(register)
    if(!register.error){
      setLoading(false)
      router.push('/')
    }
    else{
      setLoading(false)
      setError('Email already in use.')
    }
  }


  return (
    <>
      <Head>
        <title>Chordmate: Sign Up</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <Header />
      {/* <button onClick={async () => await anonymousSignIn()}>
        {" "}
        CLick MEEREaadw
      </button>
      <button onClick={async () => await logout()}>NOOO</button> */}
      <div className="flex w-full bg-app-signin items-center justify-center bg-gradient-to-tl from-main_bg via-primary to-app-black">
        <div className="flex flex-col items-center p-14 bg-white rounded-xl drop-shadow-lg text-black gap-5 min-w-[533px] my-12">
          <h1 className="font-bold text-[35px]">Sign Up</h1>
          <div className="text-[18px] -mt-4">
            Enter your details and start learning!
          </div>
          <input
            className="border-b-2 p-2 w-full"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => setFirstName(firstName.trim())}
          />
          <input
            className="border-b-2 p-2 w-full"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => setLastName(lastName.trim())}
          />
          <input
            className="border-b-2 p-2 w-full"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => setUsername(username.trim())}
          />
          <input
            className="border-b-2 p-2 w-full"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmail(email.trim())}
          />
          {/* <input
            className="border-b-2 p-2 w-full"
            value={dob}
            placeholder="Date of Birth"
            onChange={(e) => setDOB(e.target.value)}
          /> */}
          <input
            type="password"
            className="border-b-2 p-2 w-full"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            // onBlur={() => setPassword(password.trim())}
          />
          <input
            type="password"
            className="border-b-2 p-2 w-full"
            value={confirmPass}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPass(e.target.value)}
            // onBlur={() => setConfirmPass(confirmPass.trim())}
          />
          {error && error}
          <button
            disabled={loading}
            className={`flex p-3 justify-center text-white font-bold w-full rounded-3xl mt-2 hover:bg-app-black ${
              loading ? "bg-app-black" : "bg-primary"
            }`}
            onClick={async () => await signup()}
          >
            Sign Up
          </button>
          <div className="flex flex-row gap-2">
            <div>Already have an account?</div>
            <button
              className="font-bold underline"
              onClick={() => router.push("/log-in")}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
