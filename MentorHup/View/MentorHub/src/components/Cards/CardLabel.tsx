import { type ReactNode } from "react";

type ListInfo = {
  picture?: string;
  name: string;
  time: string;
  date: ReactNode;
  isDark: boolean;
};

const CardLabel = ({ isDark, picture, name, time, date }: ListInfo) => {
  return (
    <div className="py-1.5 hover:transition-transform hover:duration-150 hover:scale-95 w-full">
      <div
        className={`w-full h-[86px] flex justify-center items-center gap-2 overflow-hidden rounded-[22px] p-[10px] hover:shadow-[0px_0px_12px_0px_rgba(0,0,0,25%)] shadow-[0px_0px_12px_0px_rgba(0,0,0,25%)] cursor-pointer hover:transition-all hover:duration-300 ${
          isDark ? "bg-[var(--primary-rgba)]" : "bg-[var(--secondary-light)] "
        }`}
      >
        <div className="w-14 h-14 rounded-full">
          <img src={picture} className="w-full h-full" alt={picture} />
        </div>
        <div className="flex-1 text-start self-stretch px-2 flex flex-wrap justify-start items-start gap-2.5 overflow-hidden">
          {/* information person */}
          <div className="self-stretch inline-flex justify-between items-center w-full">
            <h3
              className={`justify-start text-base font-bold leading-normal ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary)]"
              }`}
            >
              {name}
            </h3>
            <span className="p-1.5 inline-flex flex-col justify-start items-start overflow-hidden ">
              <span className="text-[var(--secondary-dark)] text-xs font-semibold leading-none">
                {time}
              </span>
            </span>
          </div>

          {/* date */}
          <div className="justify-start text-[var(--accent)] truncate max-w-[200px] text-sm font-medium leading-tight">
            {date}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLabel;
