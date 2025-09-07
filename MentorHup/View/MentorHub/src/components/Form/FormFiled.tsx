import "./Form.css";

type ListItemProps = {
  label: string;
  name: string;
  placeholder: string;
  type: string;
};

const FormFiled = ({
  label,
  name,
  placeholder,
  type = "text",
}: ListItemProps) => {
  return (
    <div className="flex flex-wrap flex-col items-start justify-center gap-4 self-stretch w-full">
      <label className="text-center justify-center text-[var(--primary)] text-base font-medium">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="flex w-full items-center text-[var(--primary)]"
      />
    </div>
  );
};

export default FormFiled;
