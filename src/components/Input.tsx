import { ChangeEventHandler } from "react";

interface InputProps {
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  error?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  value?: any;
  inputProps?: any;
  disabled?: any;
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  required,
  ...inputProps
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 flex">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`${label ? "mt-1" : ""} rounded-md shadow-sm`}>
        <input
          id={id}
          {...inputProps}
          className={classNames(
            error
              ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
            "block w-full rounded-md sm:text-sm hover:bg-gray-100 py-2 px-3"
          )}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
