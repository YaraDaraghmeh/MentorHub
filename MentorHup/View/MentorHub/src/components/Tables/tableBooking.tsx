import Table from "./Table";
import data from "./dataTable.json";
import Eye from "./eyeicon";

const TableBooking = () => {
  const colums = [
    {
      header: "Name Mentee",
      accessor: "name",
      render: (row: any) => {
        return (
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
        );
      },
    },
    { header: "Date & time", accessor: "date" },
    { header: "Duration", accessor: "duration" },
    {
      header: "Status",
      accessor: "status",
      render: (row: any) => (
        <span
          className={`font-sembold p-2 rounded-full text-white ${
            row.status === "Confirmed"
              ? "bg-[var(--secondary-dark)]"
              : "bg-[var(--red-light)]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "id",
      render: () => (
        <div className="flex justify-center items-center">
          <Eye className="w-5 h-5 cursor-pointer" />
        </div>
      ),
    },
  ];

  return (
    <div className="py-7 w-full">
      <Table titleTable="Booking" data={data} columns={colums} />
    </div>
  );
};

export default TableBooking;
