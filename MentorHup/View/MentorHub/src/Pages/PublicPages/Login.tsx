import { useNavigate } from "react-router-dom";
import AppForm from "../../components/Form/Form";
import FormFiled from "../../components/Form/FormFiled";
import logo from "/src/assets/MentorHub-logo (1)/vector/default-monochrome.svg";
import { FcGoogle } from "react-icons/fc";
import ModalConfirm from "../../components/Modal/ModalConfirm";
import { useEffect, useState } from "react";

const LoginUser = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleContact = () => {
    console.log("test");
  };

  const handleSignUp = () => {
    navigate("/registration");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
            onSubmit={handleContact}
          >
            <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
              <p className="justify-center text-[var(--gray-dark)] text-base font-medium">
                Please enter your details
              </p>

              {/* inputs */}
              <FormFiled
                type="text"
                label="Email"
                name="email"
                placeholder="example@gmail.com"
              />
              <FormFiled
                type="text"
                label="Password"
                name="password"
                placeholder="***********"
              />

              {/* forget password */}
              <div className="w-full self-stretch inline-flex justify-end items-center">
                <span className="justify-center text-[var(--blue-medium)] text-xs underline font-medium cursor-pointer">
                  forget password?
                </span>
              </div>

              {/* Sign in */}
              <button className="cursor-pointer rounded-full h-auto outline outline-1 outline-offset-[-1px] outline-[var(--accent)] inline-flex justify-center items-center w-full p-[12px] bg-[var(--primary)] justify-center text-[var(--secondary-light)] text-lg font-semibold ">
                Sign in
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
                Don’t have an account?
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

export default LoginUser;
