import "./Form.css";

type ListItemProps = {
  value?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

const FormFiled = ({
  value,
  label,
  name,
  placeholder,
  type = "text",
  onChange,
}: ListItemProps) => {
  return (
    <div className="flex flex-wrap flex-col items-start justify-center gap-4 self-stretch w-full">
      <label className="text-center justify-center text-[var(--primary)] text-base font-medium">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        name={name}
        type={type}
        placeholder={placeholder}
        className="flex w-full items-center text-[var(--primary)]"
      />
    </div>
  );
};

export default FormFiled;
