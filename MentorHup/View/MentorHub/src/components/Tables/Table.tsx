import React from "react";
import { useTheme } from "../../Context/ThemeContext";

type ColumnDef<T> = {
  header: string;
  accessor?: keyof T; 
  render?: (row: T) => React.ReactNode;
  id?: string; 
};

type TableProps<T> = {
  titleTable: string;
  data: T[];
  columns: ColumnDef<T>[];
};

function Table<T extends { id: number | string }>({
  titleTable,
  data,
  columns,
}: TableProps<T>) {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col items-center rounded-2xl shadow-[-2px_5px_10px_1px_rgba(0,0,0,0.15)] overflow-hidden ${
        isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
      }`}
    >
      {/* Header Section */}
      <div className="inline-flex flex-col justify-between items-start w-full gap-3 h-auto p-4">
        <h2
          className={`justify-start text-xl font-bold ${
            isDark ? "text-[var(--secondary-light)]" : "text-[bg-dark]"
          }`}
        >
          {titleTable}
        </h2>
        <input
          className={`self-stretch h-9 p-3.5 rounded-2xl placeholder-[var(--gray-light)] outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center overflow-hidden ${
            isDark
              ? "bg-[var(--primary-rgba)] outline-[var(--gray-dark)]"
              : "bg-[var(--white)] outline-[var(--gray-light)]"
          }`}
          placeholder="Search..."
        />
      </div>

      {/* Table */}
      <table
        className={`w-full table-fixed border-collapse ${
          isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)]"
        }`}
      >
        <thead
          className={`${
            isDark
              ? "bg-[var(--primary-light)]"
              : "bg-[var(--primary-green-light)]"
          }`}
        >
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.id || col.accessor?.toString() || index}
                className={`px-4 py-2 text-center text-base font-semibold ${
                  isDark
                    ? "text-[var(--gray-light)]"
                    : "text-[var(--primary-dark)]"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          className={`${
            isDark
              ? "text-[var(--primary-green-light)]"
              : "text-[var(--primary-rgba)]"
          }`}
        >
          {data.map((row) => (
            <tr
              key={row.id}
              className={`h-20 border-b ${
                isDark
                  ? "border-[var(--gray-dark)] text-[var(--primary-green-light)]"
                  : "border-[var(--gray-light)] text-[var(--primary-rgba)]"
              }`}
            >
              {columns.map((col, index) => (
                <td 
                  key={col.id || col.accessor?.toString() || index} 
                  className="px-4 py-2 text-center"
                >
                  {col.render
                    ? col.render(row)
                    : col.accessor
                    ? (row[col.accessor] as React.ReactNode)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;