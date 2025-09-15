import Table from "./Table";
import data from "./dataTable.json";
import Eye from "./eyeicon";

interface BookingData {
  id: number;
  name: string;
  date: string;
  duration: string;
  status: string;
  image: string;
}

const TableBooking = () => {
  const columns = [
    {
      id: "name",
      header: "Name Mentee",
      accessor: "name" as keyof BookingData,
      render: (row: BookingData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.image}
              className="w-full h-full rounded-full"
              alt="profile"
            />
          </div>
          {row.name}
        </div>
      ),
    },
    {
      id: "date",
      header: "Date & time",
      accessor: "date" as keyof BookingData,
    },
    {
      id: "duration",
      header: "Duration",
      accessor: "duration" as keyof BookingData,
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
            onClick={() => console.log("View details for:", row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="pt-7 w-full">
      <Table<BookingData> titleTable="Booking" data={data} columns={columns} />
    </div>
  );
};

export default TableBooking;
