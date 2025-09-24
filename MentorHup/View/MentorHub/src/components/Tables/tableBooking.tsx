import { useEffect, useState } from "react";
import Table from "./Table";
import Eye from "./eyeicon";
import { GetBooking } from "../../hooks/getBooking";
import FormateDate from "./date";
import type { BookingData } from "./interfaces";
import profile from "../../assets/avatar-profile.png";

const TableBooking = () => {
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
      header: "Name Mentee",
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
      header: "Name Mentor",
      accessor: "mentorName" as keyof BookingData,
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
      id: "status",
      header: "Status",
      accessor: "status" as keyof BookingData,
      render: (row: BookingData) => {
        const status = row.status?.trim().toLowerCase();

        const statusColors: Record<string, string> = {
          confirmed: "bg-[var(--secondary-dark)]",
          cancelled: "bg-[var(--red-light)]",
          pending: "bg-[#f59e0b]",
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
    {
      id: "actions",
      header: "Action",
      render: (row: BookingData) => (
        <div className="flex justify-center items-center">
          <Eye
            className="w-5 h-5 cursor-pointer"
            onClick={() => console.log("View details for:", row.bookingId)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="pt-7 w-full">
      <Table<BookingData>
        titleTable="Booking"
        data={booking}
        columns={columns}
      />
    </div>
  );
};

export default TableBooking;
