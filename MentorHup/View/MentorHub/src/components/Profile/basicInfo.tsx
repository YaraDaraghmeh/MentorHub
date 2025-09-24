import { useTheme } from "../../Context/ThemeContext";

interface info {
  role: string;
  createdAt: string;
  sessions?: number;
  description?: string;
}

export const BasicInfo = ({ role, createdAt, sessions, description }: info) => {
  const { isDark } = useTheme();
  return (
    <>
      {role === "Admin" && (
        <>
          <div className="flex flex-col py-2 px-3 gap-2 text-center">
            <h3
              className={`text-sm ${
                isDark
                  ? "text-[var(--aqua-green)]"
                  : "text-[var(--gray-medium)]"
              }`}
            >
              Created
            </h3>
            <span
              className={`${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {createdAt}
            </span>
          </div>
        </>
      )}

      {role === "Mentee" && (
        <>
          <div className="flex flex-col p-2 gap-2 text-start">
            <h3
              className={`text-sm ${
                isDark
                  ? "text-[var(--aqua-green)]"
                  : "text-[var(--gray-medium)]"
              }`}
            >
              Created
            </h3>
            <span
              className={`${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {createdAt}
            </span>
          </div>
          <div
            className={`border border-r-1 h-14 m-2  ${
              isDark ? "border-[#383e4085]" : "border-[#8e999d85]"
            }`}
          ></div>
          <div className="flex flex-col p-2 gap-2 text-start">
            <h3
              className={`text-sm ${
                isDark
                  ? "text-[var(--aqua-green)]"
                  : "text-[var(--gray-medium)]"
              }`}
            >
              Sessions
            </h3>
            <span
              className={`text-center ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {sessions}
            </span>
          </div>
        </>
      )}

      {role === "Mentor" && (
        <>
          <div className="flex flex-col p-2 gap-2 text-start">
            <h3
              className={`text-sm ${
                isDark
                  ? "text-[var(--aqua-green)]"
                  : "text-[var(--gray-medium)]"
              }`}
            >
              Created
            </h3>
            <span
              className={`${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {createdAt}
            </span>
          </div>
          <div
            className={`border border-r-1 h-14 m-2  ${
              isDark ? "border-[#383e4085]" : "border-[#8e999d85]"
            }`}
          ></div>
          <div className="flex flex-col p-2 gap-2 text-start">
            <h3
              className={`text-sm ${
                isDark
                  ? "text-[var(--aqua-green)]"
                  : "text-[var(--gray-medium)]"
              }`}
            >
              Sessions
            </h3>
            <span
              className={`text-center ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              {sessions}
            </span>
          </div>
        </>
      )}
    </>
  );
};
