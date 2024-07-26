import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";

export const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const navigate = useNavigate();
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <div className="font-bold text-4xl pt-6">Sign in</div>
                    <div className="text-slate-500 text-md pt-1 px-4 pb-4">Enter your credentials to access your account</div>
                    <InputBox
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="test@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
          <Button
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/login",
                  {
                    
                    email,
                    password
                  }
                );
                // localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }}
              label={"Sign in"}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
                </div>
            </div>
        </div>
    )
}