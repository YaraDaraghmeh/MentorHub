import "./Form.css";

type ListItemProps = {
  value?: string;
  label: string;
  name: string;
  placeholder?: string;
  type: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  error?: string;
};

const FormFiled = ({
  value,
  label,
  name,
  placeholder,
  type = "text",
  onChange,
  error,
}: ListItemProps) => {
  return (
    <div className="flex flex-wrap flex-col items-start justify-center gap-2 self-stretch w-full">
      <label className="text-center justify-center text-[var(--primary)] text-base font-medium">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`flex w-full items-center text-[var(--primary)] ${
          error ? "outline outline-1 outline-red-400" : ""
        }`}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormFiled;
