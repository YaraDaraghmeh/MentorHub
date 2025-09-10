import DashboardMentor from "../../components/Dashboard/dashboard";

const Dashboard = () => {
  return (
    <div
      className="flex-col w-full justify-start items-center overflow-hidden
    "
    >
      <DashboardMentor isDark={false} />
    </div>
  );
};

export default Dashboard;
