import AppForm from "../../../components/Form/Form";
import FormFiled from "../../../components/Form/FormFiled";
import video from "../../../assets/videoMentorHub2.mp4";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import urlMentee from "../../../Utilities/Mentee/urlMentee";
import ModalConfirm from "../../../components/Modal/ModalConfirm";

const SignUpMentee = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    gender: "",
    imageLink: null,
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    gender?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setRegisterData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const RegisterMentee = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    const newErrors: typeof errors = {};
    if (!registerData.name.trim()) newErrors.name = "Name is required";
    if (!registerData.gender.trim()) newErrors.gender = "Gender is required";
    if (!registerData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }
    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      // Required fields
      formData.append("Name", registerData.name);
      // Normalize gender capitalization if user typed lowercase
      const normalizedGender = registerData.gender
        ? registerData.gender.trim().toLowerCase() === "male"
          ? "Male"
          : registerData.gender.trim().toLowerCase() === "female"
          ? "Female"
          : registerData.gender
        : "";
      formData.append("Gender", normalizedGender);
      // Do not append Image when empty; many backends reject empty string for file field
      formData.append("Email", registerData.email);
      formData.append("Password", registerData.password);

      const response = await axios.post(urlMentee.REGISTER_USER, formData);

      console.log("Registration successful:", response.data);
      // You can add success handling here (e.g., redirect to login page)
      navigate("/login");
    } catch (error: any) {
      if (error.response) {
        const { status, statusText, data, headers } = error.response;
        console.error("Registration failed - status:", status, statusText);
        console.error("Headers:", headers);
        if (typeof data === "string") {
          console.error("Body (text):", data);
          setErrors((prev) => ({ ...prev, general: data }));
        } else {
          try {
            console.error("Body (json):", JSON.stringify(data));
            // Map backend validation messages to fields when possible
            const mapped: typeof errors = {};
            if (data?.errors) {
              if (data.errors.Password?.length) {
                mapped.password = data.errors.Password[0];
              }
              if (data.errors.Email?.length) {
                mapped.email = data.errors.Email[0];
              }
              if (data.errors.Name?.length) {
                mapped.name = data.errors.Name[0];
              }
              if (data.errors.Gender?.length) {
                mapped.gender = data.errors.Gender[0];
              }
            }
            // Some responses send { message: [ ... ] }
            if (Array.isArray(data?.message) && data.message.length) {
              // Try to infer which field the message is about
              const msg = data.message[0] as string;
              if (/password/i.test(msg)) mapped.password = msg;
              else if (/email/i.test(msg)) mapped.email = msg;
              else if (/user(name)?/i.test(msg)) mapped.name = msg;
              else mapped.general = msg;
            }
            setErrors(mapped);
          } catch {
            console.error("Body (raw):", data);
            setErrors((prev) => ({ ...prev, general: "Registration failed. Please check your inputs." }));
          }
        }
      } else {
        console.error("Registration failed (no response):", error.message);
        setErrors((prev) => ({ ...prev, general: "Network error. Please try again." }));
      }
      // You can add error handling here (e.g., show error message to user)
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-col md:flex-row p-4 w-full bg-white rounded-[16px]">
        {/* video */}
        <div className="relative w-full h-full overflow-hidden lg:block hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={video}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute top-[22px] left-5 p-4 bg-[var(--secondary)] rounded-[16px] text-white">
            ................... Mock Interview
          </div>
          <div className="absolute top-0 left-0 p-4 bg-[var(--primary-light)] rounded-[16px] text-white">
            Booking Now
          </div>
        </div>

        {/* Form */}
        <div className="w-full flex flex-col justify-center items-center">
          <AppForm title="Sign up" span=" as" span2=" Mentee">
            <p className="w-full justify-center text-center text-[var(--gray-dark)] text-sm font-medium">
              Welcome to MentorHub
            </p>
            <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
              {errors.general && (
                <div className="w-full text-red-600 text-sm py-2" role="alert">
                  {errors.general}
                </div>
              )}
              {/* inputs */}
              <div className="flex flex-col md:flex-row gap-3 w-full">
                <div className="flex-1">
                  <FormFiled
                    type="text"
                    label="Name"
                    name="name"
                    placeholder="sara.."
                    value={registerData.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                </div>
                <div className="flex-1">
                  <FormFiled
                    type="text"
                    label="Gender"
                    name="gender"
                    placeholder="Male or Female"
                    value={registerData.gender}
                    onChange={handleChange}
                    error={errors.gender}
                  />
                </div>
              </div>
              <FormFiled
                type="text"
                label="Email"
                name="email"
                placeholder="example@gmail.com"
                value={registerData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormFiled
                type="password"
                label="Password"
                name="password"
                placeholder="***********"
                value={registerData.password}
                onChange={handleChange}
                error={errors.password}
              />

              {/* Sign in */}
              <button
                onClick={RegisterMentee}
                className="cursor-pointer rounded-full h-auto outline outline-1 outline-offset-[-1px] outline-[var(--accent)] inline-flex justify-center items-center w-full p-[12px] bg-[var(--primary)] justify-center text-[var(--secondary-light)] text-lg font-semibold "
              >
                Sign Up
              </button>
            </div>

            {/* or */}
            <div className="self-stretch inline-flex justify-center items-center w-full gap-3.5">
              <div className="flex-1 h-px relative bg-[var(--accent)]"></div>
              <div className="text-center justify-center text-black text-xs font-medium leading-[40px]">
                or
              </div>
              <div className="flex-1 h-px relative bg-[var(--accent)]"></div>
            </div>

            {/* Sign in with Google */}
            <button className="cursor-pointer gap-3 w-4 h-4 rounded-full h-auto outline outline-1 outline-offset-[-1px] outline-[var(--accent)] inline-flex justify-center items-center w-full p-[12px] bg-[var(--secondary-light)] justify-center text-[var(--primary)] text-lg font-semibold ">
              <FcGoogle />
              <span>Sign up with Google</span>
            </button>

            {/* Sign up */}
            <div className="inline-flex w-full justify-center items-start gap-3.5">
              <span className="justify-center text-[var(--gray-dark)] text-xs font-medium">
                Do you have an account?
              </span>
              <span
                onClick={handleSignIn}
                className="justify-center text-[var(--blue-medium)] text-xs underline font-medium cursor-pointer"
              >
                Sign in
              </span>
            </div>
          </AppForm>
        </div>

        {/* Modal */}
        <ModalConfirm
          title="Stripe Account Required"
          message="You need to have an active Stripe account to continue"
          open={show}
          onClose={() => setShow(false)}
          onConfirm={() => setShow(false)}
        />
      </div>
    </div>
  );
};

export default SignUpMentee;
