import * as React from "react";
import { addDays, format } from "date-fns";
import { ja } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { createPortal } from "react-dom";

import { cn } from "../@/lib/utils";
import { Button } from "../@/components/ui/button";
import { Calendar } from "../@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../@/components/ui/popover";

export function DatePickerDemo({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [fromDate, setFromDate] = React.useState<string | undefined>(
    date?.from?.toISOString()
  );
  const [toDate, setToDate] = React.useState<string | undefined>(
    date?.to?.toISOString()
  );
  const [popoverContainer, setPopoverContainer] =
    React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    setPopoverContainer(container);

    return () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    setFromDate(range?.from?.toISOString());
    setToDate(range?.to?.toISOString());
  };

  console.log(toDate);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
            {fromDate ? (
              toDate ? (
                <>
                  {format(new Date(fromDate), "M月d日", { locale: ja })} -{" "}
                  {format(new Date(toDate), "M月d日", { locale: ja })}
                </>
              ) : (
                format(new Date(fromDate), "M月d日", { locale: ja })
              )
            ) : (
              <span>日付</span>
            )}
          </Button>
        </PopoverTrigger>
        {popoverContainer &&
          createPortal(
            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={2}
              />
            </PopoverContent>,
            popoverContainer
          )}
      </Popover>
      <div>
        <p>
          From:{" "}
          {fromDate
            ? format(new Date(fromDate), "PPP", { locale: ja })
            : "Not selected"}
        </p>
        <p>
          To:{" "}
          {toDate
            ? format(new Date(toDate), "PPP", { locale: ja })
            : "Not selected"}
        </p>
      </div>
    </div>
  );
}
