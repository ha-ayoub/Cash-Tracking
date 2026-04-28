import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

const EnterOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (value) => {
    setOtp(value);
  };

  console.log(otp);

  async function verifyOTP() {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/user/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, verificationToken: otp }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message || "Verification failed");
        return;
      }
      const data = await response.json();
      localStorage.removeItem("email");
      navigate(`/dashboard/${data.user._id}`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[90vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Verifying your Account</h1>
        <p className="mt-2 text-gray-400 font-thin">Enter the 6 digit code sent to your registered email</p>
      </div>
      <InputOTP maxLength={6} onChange={handleChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        label={"Verify Code"}
        onClick={verifyOTP}
        className="bg-black-2 text-white"
      />
    </div>
  );
};

export default EnterOTP;
