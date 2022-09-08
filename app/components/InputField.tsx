import { ErrorMessage, FieldHookConfig, useField } from "formik";
import * as React from "react";

interface InputFieldProps {
  label: string;
}

const InputField: React.FC<
  InputFieldProps &
    FieldHookConfig<InputFieldProps> &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <input {...field} {...props} />
      <label
        htmlFor={label}
        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {label}
      </label>
      {meta.touched && meta.error ? (
        <div className="error text-red-500">{meta.error}</div>
      ) : null}
    </>
  );
};

export default InputField;
