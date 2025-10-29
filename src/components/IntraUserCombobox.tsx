import { Popover } from "@radix-ui/react-popover";
import React from "react";
import { PopoverContent, PopoverTrigger } from "../@/components/popover";
import { Button } from "../@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../@/components/ui/command";
import { cn } from "../@/lib/utils";
import { useGetSeniorUsers } from "../queries/UserQuery";
import { User } from "../types/user";

interface IntraUserComboboxProps {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

const IntraUserCombobox: React.FC<IntraUserComboboxProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false);
  const { data: users } = useGetSeniorUsers() as {
    data: User[] | undefined;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
          disabled={disabled}
        >
          {value !== null
            ? users?.find((user) => user.id === value)?.user_profile?.name
            : "イントラユーザを選んでください"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="ユーザーを検索..."
            className="h-9 w-full"
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id?.toString()}
                  onSelect={(currentValue) => {
                    const selectedId = parseInt(currentValue, 10);
                    onChange(selectedId === value ? null : selectedId);
                    setOpen(false);
                  }}
                >
                  {user.user_profile?.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IntraUserCombobox;
