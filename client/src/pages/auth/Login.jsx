import React from "react";
import { useState } from "react";

const Login = () => {
  const [formInput, setFormInput] = useState({});
  const inputStyle = "border block my-2 ml-5 px-4 py-2";

  const handleFormChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault()
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
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
        console.log('Errrrrrrrrrr', err);
      });
  };

  console.log(formInput);
  return (
    <div>
      <form onSubmit={handleFormSubmit} action="" method="post">
        <input
          className={inputStyle}
          type="text"
          name="identity"
          id="email"
          placeholder="email"
          onChange={(e) => handleFormChange(e)}
          required
        />
        <input
          className={inputStyle}
          type="password"
          name="password"
          id="password"
          placeholder="password"
          onChange={(e) => handleFormChange(e)}
          required
        />
        {/* <input
          className={inputStyle}
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          placeholder="D-O-B"
          onChange={(e) => handleFormChange(e)}
          required
        /> */}

        <input className={inputStyle} type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
