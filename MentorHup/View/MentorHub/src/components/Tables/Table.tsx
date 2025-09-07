import React from "react";
import pictureProfile from "../../assets/avatar-girl-with-glasses.png";
import Eye from "./eyeicon";

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
const Table = ({ isDark = false }) => {
  return (
    <div
      className={`inline-flex flex-col items-center rounded-2xl shadow-[-2px_5px_10px_1px_rgba(0,0,0,0.15)] overflow-hidden ${
        isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
      }`}
    >
      <div className="inline-flex flex-col justify-between items-start w-full gap-3 h-auto p-4 ">
        <h2
          className={`justify-start text-xl font-bold ${
            isDark ? "text-[var(--secondary-light)]" : "text-[bg-dark]"
          }`}
        >
          Users
        </h2>
        <input
          className={`self-stretch h-9 p-3.5 rounded-2xl placeholder-[var(--gray-light)] outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center overflow-hidden ${
            isDark
              ? "bg-[var(--primary-rgba)] outline-[var(--gray-dark)]"
              : "bg-[var(--white)] outline-[var(--gray-light)] "
          }`}
          placeholder="Search..."
        />
      </div>
      <table
        className={`inline-flex flex-col items-center w-full ${
          isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
        }`}
      >
        <thead
          className={`self-stretch p-3.5 inline-flex overflow-hidden w-full justify-center items-center ${
            isDark
              ? "bg-[var(--primary-light)]"
              : "bg-[var(--primary-green-light)]"
          }`}
        >
          <tr className="inline-flex w-full justify-between items-center gap-4">
            {}
            <th
              className={`justify-center text-base font-semibold px-4 ${
                isDark
                  ? "text-[var(--gray-light)]"
                  : "text-[var(----primary-light)]"
              }`}
            >
              User Name
            </th>
            <th
              className={`justify-center text-base font-semibold px-4 ${
                isDark
                  ? "text-[var(--gray-light)]"
                  : "text-[var(----primary-light)]"
              }`}
            >
              Role
            </th>
            <th
              className={`justify-center text-base font-semibold px-4 ${
                isDark
                  ? "text-[var(--gray-light)]"
                  : "text-[var(----primary-light)]"
              }`}
            >
              Email
            </th>
            <th
              className={`justify-center text-base font-semibold px-4 ${
                isDark
                  ? "text-[var(--gray-light)]"
                  : "text-[var(----primary-light)]"
              }`}
            >
              Status
            </th>
            <th
              className={`justify-center text-base font-semibold px-4 ${
                isDark
                  ? "text-[var(--gray-light)]"
                  : "text-[var(----primary-light)]"
              }`}
            >
              Effective
            </th>
            <th
              className={`justify-center text-base font-semibold px-4 ${
                isDark
                  ? "text-[var(--gray-light)]"
                  : "text-[var(----primary-light)]"
              }`}
            >
              Actions
            </th>
          </tr>
        </thead>
        {/* body */}
        <tbody
          className={`self-stretch h-[468px] inline-flex flex-col overflow-hidden w-full justify-start items-start ${
            isDark
              ? "text-[var(--primary-green-light)]"
              : "text-[var(--primary-rgba)]"
          }`}
        >
          <tr
            className={`inline-flex w-full h-20 p-3 border-b justify-between items-center gap-1 ${
              isDark
                ? "border-[var(--gray-dark)]"
                : "border-[var(--gray-light)]"
            }`}
          >
            <td className="w-[13rem] py-1 gap-3 inline-flex justify-center items-center overflow-hidden">
              <div className="w-14 h-14 rounded-full">
                <img
                  src={pictureProfile}
                  className="w-full h-full"
                  alt={pictureProfile}
                />
              </div>
              Sara Sayed Ahmad
            </td>
            <td className="w-32 py-1 inline-flex justify-center items-center overflow-hidden">
              Mentor
            </td>
            <td className="w-[14rem] py-1 inline-flex justify-center items-center overflow-hidden">
              example@yaho.com
            </td>
            <td className="w-[9rem] py-1 inline-flex justify-center items-center overflow-hidden">
              Active
            </td>
            <td className="w-[16rem] py-1 inline-flex justify-center items-center overflow-hidden">
              example@y
            </td>
            <td className="w-32 py-1 gap-3 inline-flex justify-center items-center overflow-hidden">
              <Eye />
            </td>
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
