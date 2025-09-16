import { useNavigate, Navigate } from "react-router-dom";
import AppForm from "../../components/Form/Form";
import FormFiled from "../../components/Form/FormFiled";
import logo from "/src/assets/MentorHub-logo (1)/vector/default-monochrome.svg";
import { FcGoogle } from "react-icons/fc";
import ModalConfirm from "../../components/Modal/ModalConfirm";
import React, { useEffect, useState } from "react";
import axios from "axios";
import urlAuth from "../../Utilities/Auth/urlAuth";
import { useAuth } from "../../Context/AuthContext";

const LoginContent = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setAuth } = useAuth();

  const handleSignUp = () => {
    navigate("/registration");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // when add data on inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  // fun login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Data I sending .", formData);
      
      const response = await axios.post(urlAuth.LOGIN_USER, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(" Server Response :", response.data);

      const { roles, email, userId, accessToken, refreshToken } = response.data;
      
      // تأكد من أن roles هو array وخذ أول عنصر
      const roleString = Array.isArray(roles) ? roles[0] as "Admin" | "Mentor" | "Mentee" : roles as "Admin" | "Mentor" | "Mentee";
      
      console.log("Role :", roleString);

      
      await setAuth({ 
        userId, 
        roles: roleString, 
        email, 
        accessToken, 
        refreshToken 
      });

      console.log("Authentication data saved successfully.");
      
      // Force a re-render by updating a state (optional)
      setFormData({ email: "", password: "" });
      
    } catch (error: any) {
      console.error("Failed ", error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data) {
        setError(" Failed to login. Please check your credentials.");
      } else {
        setError("   Server Conntction Error  ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex lg:flex-row flex-col justify-between items-center px-8 py-4 bg-gradient-to-b from-[var(--primary)] from-[0%] via-[var(--teal-950)] via-[80%] to-[var(--cyan-800)] to-[100%]">
        <div className="flex-1">
          <div className="self-stretch inline-flex flex-col justify-center items-center">
            <img className="w-[492px] h-24 p-2.5" src={logo} />
          </div>
        </div>
        <div className="flex-1  w-full h-full">
          <AppForm
            title="Welcome back! Ready to ace your next"
            span=" interview"
            span2=" ?"
          >
            <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
              <p className="justify-center text-[var(--gray-dark)] text-base font-medium">
                Please enter your details
              </p>

              {/* Error message */}
              {error && (
                <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* inputs */}
              <FormFiled
                type="text"
                label="Email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
              <FormFiled
                type="password"
                label="Password"
                name="password"
                placeholder="***********"
                value={formData.password}
                onChange={handleChange}
              />

              {/* forget password */}
              <div className="w-full self-stretch inline-flex justify-end items-center">
                <span className="justify-center text-[var(--blue-medium)] text-xs underline font-medium cursor-pointer">
                  forget password?
                </span>
              </div>

              {/* Sign in */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`cursor-pointer rounded-full h-auto outline outline-1 outline-offset-[-1px] outline-[var(--accent)] inline-flex justify-center items-center w-full p-[12px] bg-[var(--primary)] justify-center text-[var(--secondary-light)] text-lg font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? ".................Logging In " : "Sign in"}
              </button>
            </div>

            {/* or */}
            <div className="self-stretch inline-flex justify-center items-center w-full gap-3.5">
              <div className="flex-1 h-px relative bg-[var(--accent)]"></div>
              <div className="text-center justify-center text-black text-xs font-medium leading-[82px]">
                or
              </div>
              <div className="flex-1 h-px relative bg-[var(--accent)]"></div>
            </div>

            {/* Sign in with Google */}
            <button className="cursor-pointer gap-3 w-4 h-4 rounded-full h-auto outline outline-1 outline-offset-[-1px] outline-[var(--accent)] inline-flex justify-center items-center w-full p-[12px] bg-[var(--secondary-light)] justify-center text-[var(--primary)] text-lg font-semibold ">
              <FcGoogle />
              <span>Sign in with Google</span>
            </button>

            {/* Sign up */}
            <div className="inline-flex w-full justify-center items-start gap-3.5">
              <span className="justify-center text-[var(--gray-dark)] text-xs font-medium">
                Don't have an account?
              </span>
              <span
                onClick={handleSignUp}
                className="justify-center text-[var(--blue-medium)] text-xs underline font-medium cursor-pointer"
              >
                Sign up
              </span>
            </div>
          </AppForm>
        </div>
      </div>

      {/* Modal */}
      <ModalConfirm
        title="Stripe Account Required"
        message="You need to have an active Stripe account to continue"
        open={show}
        onClose={() => setShow(false)}
        onConfirm={() => setShow(false)}
      />
    </>
  );
};

// Main component with authentication check
const LoginUser = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginContent />;
};

export default LoginUser;