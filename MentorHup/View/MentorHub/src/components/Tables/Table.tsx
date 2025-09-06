import React from "react";

type column = {
  header: string;
  render: (row: any) => React.ReactNode;
};

type Listprops = {
  isDark: boolean;
  data: any[];
  columns: column[];
};

// const Table = ({ isDark = true, data, columns }: Listprops) => {
const Table = ({ isDark = true }) => {
  return (
    <div
      className={`inline-flex flex-col items-center rounded-2xl shadow-[-2px_5px_10px_1px_rgba(0,0,0,0.15)] overflow-hidden ${
        isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
      }`}
    >
      <div className="inline-flex flex-col justify-between items-start w-full h-auto p-4 ">
        <h2
          className={`justify-start text-xl font-semibold ${
            isDark ? "text-[var(--primary)]" : "text-[var(--secondary-light)]"
          }`}
        >
          Users
        </h2>
        <input
          className="self-stretch h-9 p-3.5 bg-[var(--white)] rounded-2xl outline outline-1 outline-offset-[-1px] outline-[var(--gray-light)] inline-flex justify-start items-center overflow-hidden"
          placeholder="Search..."
        />
      </div>
      <table
        className={`inline-flex flex-col items-center rounded-2xl shadow-[-2px_5px_10px_1px_rgba(0,0,0,0.15)] overflow-hidden ${
          isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
        }`}
      >
        <thead className="flex flex-row ">
          <tr>
            <th>user name</th>
            <th>user name</th>

            <th>user name</th>
            <th>user name</th>
          </tr>
        </thead>
        {/* body */}
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;

// <table className="">
{
  /* head */
}
{
  /* <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col.header}</th>
          ))}
        </tr>
      </thead> */
}
{
  /* body */
}
{
  /* <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table> */
}
