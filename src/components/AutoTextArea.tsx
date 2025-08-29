import React, { useRef, useEffect } from "react";

const AutoAdjustTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", placeholder = "", ...props }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseClasses =
    "w-full resize-none transition-all duration-150 bg-white border border-gray-400 outline-none";

  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      handleResize();
      textarea.addEventListener("input", handleResize);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof ref === "function") {
      ref(textareaRef.current);
    } else if (ref) {
      ref.current = textareaRef.current;
    }
  }, [ref]);

  return (
    <textarea
      ref={textareaRef}
      className={`${baseClasses} ${className}`}
      rows={1}
      placeholder={placeholder}
      {...props}
    />
  );
});

export default AutoAdjustTextarea;
