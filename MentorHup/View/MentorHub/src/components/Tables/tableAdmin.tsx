import { useEffect, useState } from "react";
import { GetBooking } from "../../hooks/getBooking";
import Table from "./Table";
import type { BookingData } from "./interfaces";
import FormateDate from "./date";
import profile from "../../assets/avatar-profile.png";
import Duration from "./durationTime";
import { useNavigate } from "react-router-dom";
import ToSend from "../Chatting/iconsToSend";

const TableAdminBooking = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingData[]>([]);

  useEffect(() => {
    const getBooking = async () => {
      const data = await GetBooking();
      setBooking(data);
    };

    getBooking();
  }, []);

  const columns = [
    {
      id: "menteeName",
      header: "Mentee Name",
      accessor: "menteeName" as keyof BookingData,
      render: (row: BookingData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.menteeImageLink || profile}
              className="hidden lg:block w-full h-full rounded-full"
              alt={profile}
            />
          </div>
          {row.menteeName}
        </div>
      ),
    },
    {
      id: "mentorName",
      header: "Mentor Name",
      accessor: "menteeName" as keyof BookingData,
      render: (row: BookingData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.mentorImageLink || profile}
              className="hidden lg:block w-full h-full rounded-full"
              alt={profile}
            />
          </div>
          {row.mentorName}
        </div>
      ),
    },
    {
      id: "startTime",
      header: "Date",
      accessor: "startTime" as keyof BookingData,
      render: (row: any) => <>{FormateDate(row.startTime)}</>,
    },
    {
      id: "startTime",
      header: "Duration",
      accessor: "startTime" as keyof BookingData,
      render: (row: any) => <>{Duration(row.startTime, row.endTime)}</>,
    },
    {
      id: "status",
      header: "Status",
      accessor: "status" as keyof BookingData,
      render: (row: BookingData) => {
        const status = row.status?.trim().toLowerCase();

        const statusColors: Record<string, string> = {
          confirmed: "bg-[var(--secondary-dark)]",
          cancelled: "bg-[var(--red-light)]",
        };

        const bgColor = statusColors[status] || "bg-gray-200";

        return (
          <span
            className={`font-semibold p-2 rounded-full text-white ${bgColor}`}
          >
            {row.status}
          </span>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: "Action",
    //   render: (row: BookingData) => (
    //     <div className="flex justify-center items-center gap-2">
    //       {row.menteeUserId != null && (
    //         <ToSend
    //           onClick={() =>
    //             handleMessageClick(
    //               row.menteeUserId,
    //               row.menteeName,
    //               row.menteeImageLink || profile
    //             )
    //           }
    //         />
    //       )}
    //     </div>
    //   ),
    // },
  ];

  //   const handleMessageClick = (id: string, name: string, image: string) => {
  //     localStorage.setItem("MessageIdUser", id);
  //     localStorage.setItem("MessageUserName", name);
  //     localStorage.setItem("imageUser", image);

  //     navigate("/mentee/chatting");
  //   };

  return (
    <>
      {/* Table Sessions */}
      <div className="py-7 w-full">
        <Table titleTable="Booking" data={booking} columns={columns} />
      </div>
    </>
  );
};
export default TableAdminBooking;
