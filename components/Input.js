import React from 'react'

export default function Input({ value, placeholder, onChange, type }) {
    let className = "border-b p-2 w-full"

  return (
    <input
      className="border-b-2 p-2 w-full border-primary bg-black"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
