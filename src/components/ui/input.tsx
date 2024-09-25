import * as React from "react";

import { cn } from "@/lib/utils";
import { UseFormRegister } from "react-hook-form";
import { FaEye, FaEyeSlash, FaFileUpload } from "react-icons/fa";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            className="absolute bottom-2 right-3 flex items-center px-2 text-neutral-400 transition-all hover:text-neutral-500"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

interface FileInputProps {
  label: string;
  register: UseFormRegister<any>;
  name: string;
  accept: string;
  errorMessage?: string;
  description?: string;
}

const FileField = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, errorMessage, register, name, accept, description }, ref) => {
    const [fileName, setFileName] = React.useState<string>("");
    const { onChange } = register(name);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      onChange(e);
      if (file) {
        setFileName(file.name);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      onChange(e);
      if (file) {
        setFileName(file.name);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
    };

    return (
      <div className="flex w-full flex-col items-center justify-center py-4">
        <p
          className={`mb-2 self-start ${errorMessage ? "text-primary-400" : "text-black"}`}
        >
          {label}
        </p>
        <p
          className="mb-4 self-start text-xs"
          dangerouslySetInnerHTML={{ __html: description || "" }}
        ></p>
        <label
          htmlFor={name}
          className={cn(
            "relative w-full cursor-pointer rounded-lg border-2 border-dashed px-6 py-4 transition-all duration-300 hover:cursor-pointer hover:border-solid focus:outline-none",
            errorMessage ? "border-primary-400" : "border-neutral-400",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <FaFileUpload className="h-12 w-12 text-neutral-400" />
            <span className="font-medium text-neutral-400">
              {fileName ? fileName : "Drag & drop a file here"}
            </span>
          </div>
          <input
            id={name}
            type="file"
            accept={accept}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            {...register(name)}
            onChange={handleFileChange}
          />
        </label>

        {fileName && (
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-700">{fileName}</p>
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-center">
            <p className="text-primary-400 mt-[6px] text-sm text-red-500">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    );
  },
);
FileField.displayName = "FileField";

export { FileField, Input };
