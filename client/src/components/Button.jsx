import React from "react";

const Button = ({ label, className = "", ...props }) => {
  return (
    <button
      className={`min-w-[120px] text-sm md:text-md px-2 md:px-4 py-2 rounded-md ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
