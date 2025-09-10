import { MdOutlineAttachMoney } from "react-icons/md";
import {
  BsFillCalendar2CheckFill,
  BsStarHalf,
  BsFillPeopleFill,
} from "react-icons/bs";
import CardDash from "../Cards/CardDashboard";

const DashboardMentor = () => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {state.map((state, index) => (
        <CardDash
          key={index}
          title={state.title}
          icon={state.icon}
          value={state.value}
          bgColor={state.color}
          isDark={false}
        />
      ))}
    </div>
  );
};

export default DashboardMentor;
