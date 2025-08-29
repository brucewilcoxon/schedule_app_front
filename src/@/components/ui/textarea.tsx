import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ShadTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
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

    React.useImperativeHandle(
      ref,
      () => textareaRef.current as HTMLTextAreaElement
    );

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-2",
          className
        )}
        ref={textareaRef}
        {...props}
      />
    );
  }
);

ShadTextarea.displayName = "Textarea";

export { ShadTextarea };
