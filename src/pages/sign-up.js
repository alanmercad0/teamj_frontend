import React, { useState } from 'react'
import Input from '../../components/Input';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signup(){
    setLoading(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        username: username,
        email: email,
        dob: new Date(),
        password: password,
        type: "user",
      }),
    }).catch((e) => console.log(e));
    setLoading(false)
  }


  return (
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
        />
        <input
          className="border-b-2 p-2 w-full"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="border-b-2 p-2 w-full"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border-b-2 p-2 w-full"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-b-2 p-2 w-full"
          value={dob}
          placeholder="Date of Birth"
          onChange={(e) => setDOB(e.target.value)}
        />
        <input
          className="border-b-2 p-2 w-full"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type='password'
          className="border-b-2 p-2 w-full"
          value={confirmPass}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPass(e.target.value)}
        />
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
  );
}
