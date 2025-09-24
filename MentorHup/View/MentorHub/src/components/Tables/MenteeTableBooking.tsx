import { useEffect, useState } from "react";
import { GetBooking } from "../../hooks/getBooking";
import Table from "./Table";
import type { BookingData } from "./interfaces";
import FormateDate from "./date";
import profile from "../../assets/avatar-profile.png";
import { MdOutlineCancel } from "react-icons/md";
import Duration from "./durationTime";
import ConfirmModal from "../Modal/ModalConfirm";
import { CancelBooking } from "../../hooks/cancelBooking";

const MenteeTableBooking = () => {
  const [booking, setBooking] = useState<BookingData[]>([]);
  const [modalCancel, setModalCancel] = useState({ bookingId: 0, show: false });

  useEffect(() => {
    const getBooking = async () => {
      const data = await GetBooking();
      setBooking(data);
    };

    getBooking();
  }, []);

  // camcel booking
  const handleCancel = (bookingId: number) => {
    setModalCancel({ bookingId: bookingId, show: true });
  };

  const columns = [
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
    {
      id: "actions",
      header: "Action",
      render: (row: BookingData) => (
        <div className="flex justify-center items-center">
          <MdOutlineCancel
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleCancel(row.bookingId)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Table Sessions */}
      <div className="py-7 w-full">
        <Table
          titleTable="My Booked Sessions"
          data={booking}
          columns={columns}
        />
      </div>

      {/* Modal cancel Booking */}
      <ConfirmModal
        open={modalCancel.show}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        onClose={() => setModalCancel((prev) => ({ ...prev, show: false }))}
        onConfirm={async () => {
          const cancel = await CancelBooking(modalCancel.bookingId);

          if (cancel === 200) {
            setBooking((prev) =>
              prev.filter((boo) => boo.bookingId !== modalCancel.bookingId)
            );
            setModalCancel({ bookingId: 0, show: false });
          }
        }}
      />
    </>
  );
};
export default MenteeTableBooking;
