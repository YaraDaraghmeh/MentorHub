import { MdOutlineAttachMoney } from "react-icons/md";
import {
  BsFillCalendar2CheckFill,
  BsStarHalf,
  BsFillPeopleFill,
} from "react-icons/bs";
import CardDash from "../Cards/CardDashboard";
import CardLabel from "../Cards/CardLabel";
import picture from "../../assets/avatar-profile.png";
import { useTheme } from "../../Context/ThemeContext";
import BarChartDash from "../Charts/BarChart";

const DashboardMentor = () => {
  const { isDark } = useTheme();
  const state = [
    { title: "Mentees", value: "12", icon: <BsFillPeopleFill />, color: "" },
    {
      title: "Upcoming Sessions",
      value: "33",
      icon: <BsFillCalendar2CheckFill />,
      color: "",
    },
    { title: "Rating", value: "4.8", icon: <BsStarHalf />, color: "" },
    {
      title: "Earnings",
      value: "$160",
      icon: <MdOutlineAttachMoney />,
      color: "",
    },
  ];

  const sessions = [
    { label: "Week 1", value: 3 },
    { label: "Week 2", value: 7 },
    { label: "Week 3", value: 6 },
    { label: "Week 4", value: 8 },
    { label: "Week 5", value: 5 },
    { label: "Week 5", value: 3 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
        {state.map((state, index) => (
          <CardDash
            key={index}
            title={state.title}
            icon={state.icon}
            value={state.value}
            // bgColor={state.color}
            isDark={isDark}
          />
        ))}
      </div>

      {/*  & Upcoming Secssion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        <div className="col-span-2">
          <BarChartDash data={sessions} />
        </div>
        <div className="col-span-1">
          <div className="py-2 flex">
            <h2
              className={`justify-start text-base font-bold leading-normal ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary)]"
              }`}
            >
              Interview Schedule
            </h2>
          </div>
          <CardLabel
            name="Mr Jone"
            date="12/11/2025"
            picture={picture}
            time="12:00 AM"
            isDark={isDark}
          />
          <CardLabel
            name="Mr Jone"
            date="12/11/2025"
            picture={picture}
            time="12:00 AM"
            isDark={isDark}
          />
          <CardLabel
            name="Mr Jone"
            date="12/11/2025"
            picture={picture}
            time="12:00 AM"
            isDark={isDark}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardMentor;
