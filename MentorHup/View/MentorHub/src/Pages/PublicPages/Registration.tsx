import CardUser from "../../components/Cards/CardUser";
import logo from "../../assets/MentorHub-logo (1)/vector/default-monochrome.svg";
import mentor from "../../assets/mentor.png";
import mentee from "../../assets/mentee.png";

const SignUp = () => {
  return (
    <div className="px-8 py-5 w-full h-screen flex flex-col gap-2 justify-center items-center bg-gradient-to-b from-[var(--primary)] from-[0%] via-[var(--teal-950)] via-[80%] to-[var(--cyan-800)] to-[100%] overflow-hidden">
      {/* logo */}
      <div className="flex justify-center items-center">
        <img className="w-[492px] h-24 p-2.5" src={logo} />
      </div>

      <h3 className="text-center flex justify-center text-[var(--secondary)] md:text-3xl text-2xl font-semibold leading-[85px]">
        Are you Mentor or Mentee?
      </h3>

      {/* Choose user */}
      <div className="w-full h-auto flex flex-col lg:flex-row gap-6 justify-center items-center">
        <CardUser name="I'm Mentor" picture={mentor} />
        <CardUser name="I'm Mentee" picture={mentee} />
      </div>
    </div>
  );
};

export default SignUp;
