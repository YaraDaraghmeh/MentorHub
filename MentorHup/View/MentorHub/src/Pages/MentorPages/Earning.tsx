import { useTheme } from "../../Context/ThemeContext";
import { useEffect, useState } from "react";
import axios from "axios";
import BarChartDash from "../../components/Charts/BarChart";
import urlDashboard from "../../Utilities/Dashboard/urlDashboard";
import type { earn } from "../../components/Tables/interfaces";

const Earning = () => {
  const { isDark } = useTheme();
  const [earningPerWeek, setEarningPerWeek] = useState<earn[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("Not Authorized");
      return;
    }

    console.log(token);

    const getEarning = async () => {
      try {
        const res = await axios.get(urlDashboard.EARNING_PER_WEEK, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEarningPerWeek(res.data);
        console.log(res.data);
      } catch (err: any) {
        console.log("get earning per week error", err);
      }
    };

    getEarning();
  }, []);

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 py-6">
        <div className="col-span-3">
          <BarChartDash data={earningPerWeek} />
        </div>
      </div>
    </>
  );
};

export default Earning;
