import { FieldHookConfig, useField } from "formik";
import * as React from "react";

interface InputFieldProps {
  label: string;
  isInput?: boolean;
}

const InputField: React.FC<
  InputFieldProps &
    FieldHookConfig<InputFieldProps> &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > &
    React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >
> = ({ label, isInput = true, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      {isInput ? (
        <input {...field} {...props} />
      ) : (
        <textarea {...field} {...props}></textarea>
      )}

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
