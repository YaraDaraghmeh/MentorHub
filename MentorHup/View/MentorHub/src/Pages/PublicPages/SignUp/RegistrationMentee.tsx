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
  };

  const RegisterMentee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", registerData.name);
      formData.append("gender", registerData.gender);
      formData.append("email", registerData.email);
      formData.append("password", registerData.password);

      const response = await axios.post(urlMentee.REGISTER_USER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("respo", response);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
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
              />
              <FormFiled
                type="password"
                label="Password"
                name="password"
                placeholder="***********"
                value={registerData.password}
                onChange={handleChange}
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
