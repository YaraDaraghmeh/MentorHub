import CardUser from "./CardUser";
import logo from "../../assets/MentorHub-logo (1)/vector/default-monochrome.svg";
import mentor from "../../assets/mentor.png";
import mentee from "../../assets/mentee.png";
import { RiArrowLeftSLine } from "react-icons/ri";

const ChooseUser = () => {
  return (
    <div
      className="px-8 py-5 w-full h-screen flex flex-col gap-2 justify-center items-center bg-gradient-to-b from-[var(--primary)] from-[0%] via-[var(--teal-950)] via-[80%] 
      to-[var(--cyan-800)] to-[100%] overflow-hidden relative"
    >
      <a
        className="absolute top-5 left-5 text-white cursor-pointer flex flex-row gap-2 underline"
        href="login"
      >
        <RiArrowLeftSLine size={22} /> Sign in
      </a>

      {/* logo */}
      <div className="flex justify-center items-center">
        <img className="w-[492px] h-24 p-2.5" src={logo} />
      </div>

      <h3 className="text-center flex justify-center text-[var(--secondary)] md:text-3xl text-2xl font-semibold leading-[85px]">
        Are you Mentor or Mentee?
      </h3>

      {/* Choose user */}
      <div className="w-full h-auto flex flex-col lg:flex-row gap-6 justify-center items-center">
        <CardUser name="I'm Mentor" picture={mentor} onClick="mentor" />
        <CardUser name="I'm Mentee" picture={mentee} onClick="mentee" />
      </div>
    </div>
  );
};

export default ChooseUser;
