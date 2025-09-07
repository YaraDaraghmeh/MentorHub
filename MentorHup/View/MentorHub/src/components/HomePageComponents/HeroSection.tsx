import Typewriter from "typewriter-effect";
import image from "../../assets/Home.png";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ isDark }: { isDark: boolean }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-between h-screen bg-gradient-to-b ${
        isDark ? "from-teal-950 to-teal-500" : "from-teal-950 to-teal-200"
      } text-center p-5 overflow-visible`}
    >
      {/* Text Section */}
      <div className="relative z-10 flex flex-col items-center mt-20 pt-16 animate-fadeIn">
        <h1
          className={`text-6xl font-bold mb-4 ${
            isDark ? "text-white" : "text-white"
          }`}
        >
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString("Prepare for your ")
                .pauseFor(500)
                .typeString('<span class="text-[#27B467]">interview</span>')
                .start();
            }}
            options={{
              delay: 75,
            }}
          />
        </h1>
        <p className={`mb-6 ${isDark ? "text-gray-200" : "text-gray-200"}`}>
          Mock Interviews with experts · Real feedback · More than one chance ·
          Live chat with Trainers
        </p>
        <button
          onClick={handleClick}
          className={`py-2 px-10 rounded-full bg-[var(--primary)] outline outline-1 outline-offset-[-1px] outline-[var(--gray-medium)] shadow-[0_1px_9px_rgba(0,0,0,0.28)] text-white font-semibold ${
            isDark ? "hover:bg-[var(--green-dark)]" : "hover:bg-gray-700"
          }`}
        >
          Mock Interview Now
        </button>
      </div>

      {/* Image Section */}
      <img
        src={image}
        alt="Interview Setup"
        style={{ width: "690px", height: "548px", zIndex: 2 }}
        className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 object-cover animate-slideIn"
      />
    </div>
  );
};

export default HeroSection;
