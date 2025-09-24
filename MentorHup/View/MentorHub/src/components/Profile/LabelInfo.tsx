import { useTheme } from "../../Context/ThemeContext";

interface info {
  label: string;
  value: string;
}

export const LabelsInfo = ({ label, value }: info) => {
  const { isDark } = useTheme();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <h4 className="col-span-1 text-start font-semibold">{label}</h4>
        <h5 className="col-span-1 text-start">{value}</h5>
      </div>
      <hr
        className={`${isDark ? "text-[#282d2e85]" : "text-[#8e999d85]"}`}
      ></hr>
    </>
  );
};
