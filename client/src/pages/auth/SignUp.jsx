import React from "react";
import { useState } from "react";
import Google from "/public/images/google.svg";

const SignUp = () => {
  const [formInput, setFormInput] = useState({});
  const inputStyle =
    "border block px-3 py-2 rounded-md w-72 md:w-96 outline-none text-black text-opacity-80 text-sm";
  const buttonStyle =
    "bg-button p-3 rounded-md shadow-md hover:bg-opacity-80 transition-all";

  const handleFormChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/auth", {
      method: "POST",
      credentials: "include", // not recommended
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInput),
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Error!!!");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
      })
      .catch((err) => {
        console.log("Errrrrrrrrrr", err);
      });
  };

  console.log(formInput);
  return (
    <section className="bg-[url('/public/images/bgImage.svg')] bg-cover bg-no-repeat h-screen px-5 md:px-10 py-5 text-white">
      <article className="flex justify-between items-center">
        <div className="w-24 h-10 bg-[#D9D9D9]"></div>
        <button className={`${buttonStyle} w-24`}>Login</button>
      </article>

      <article>
        <h2 className="text-3xl md:text-5xl text-center font-bold mt-5 md:mt-0">
          Sign Up
        </h2>
        <div className="flex justify-center mt-6">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                className={inputStyle}
                type="text"
                name="firstName"
                id="firstName"
                placeholder="John"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </div>

            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                className={inputStyle}
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Doe"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                className={inputStyle}
                type="email"
                name="email"
                id="email"
                placeholder="johndoe@gmail.com"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                className={inputStyle}
                type="password"
                name="password"
                id="password"
                placeholder="********"
                onChange={(e) => handleFormChange(e)}
                required
              />
            </div>

            <button className={`${buttonStyle} w-full`}>Sign Up</button>

            <div className="flex items-center w-full gap-5 opacity-50">
              <div className="border w-full"></div>
              <p>OR</p>
              <div className="border w-full"></div>
            </div>

            <button
              className={`${buttonStyle} bg-white text-black w-full flex items-center justify-center gap-5`}
            >
              <img src={Google} alt="" className="inline w-5" />
              Continue with Google
            </button>
          </form>
        </div>
      </article>
    </section>
  );
};

export default SignUp;
