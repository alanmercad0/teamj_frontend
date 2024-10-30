import React, { useState } from 'react'
import Input from '../../components/Input';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Head from 'next/head';

export default function LogIn() {
    const router = useRouter()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  async function login(){
    setLoading(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.Error) router.push("/");
      })
      .catch((e) => console.log(e));
    setLoading(false)
  }


  return (
    <>
      <Head>
        <title>Chordmate: Log In</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <Header />
      <div className="flex w-full h-full bg-app-signin items-center justify-center bg-gradient-to-br from-main_bg via-primary to-white">
        <div className="flex flex-col items-center p-14 bg-white rounded-xl drop-shadow-lg text-black gap-7 min-w-[533px]">
          <h1 className="font-bold text-[35px]">Welcome back!</h1>
          <img
            src="/small_chordmate_icon.png"
            alt="logo"
            width={119}
            height={91}
          />
          <input
            className="border-b-2 p-2 w-full"
            value={username}
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
              console.log(e);
            }}
          />
          <input
            className="border-b-2 p-2 w-full"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="flex p-3 justify-center text-white font-bold bg-primary w-full rounded-3xl hover:bg-app-black"
            onClick={async () => await login()}
          >
            Log In
          </button>
          <div className="flex flex-row gap-2">
            <div>Don't have an account?</div>
            <button
              className="font-bold underline"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
