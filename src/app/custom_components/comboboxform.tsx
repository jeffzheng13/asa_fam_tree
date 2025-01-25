"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  poiName: z.string({
    required_error: "Please select a family member to visualize",
  }),
  poiID: z.string().optional(),
});

type UserID = {
  id: string;
  name: string;
};

export function ComboboxForm({ data = [], updateState }: { data: UserID[], updateState: (arg0: string) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("clicked");
    updateState(data.poiID!);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="poiName"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Name</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? data.find((obj: UserID) => obj.name === field.value)
                            ?.name
                        : "Select ancestor"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search ancestor name..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No person with that name found.
                      </CommandEmpty>
                      <CommandGroup>
                        {data.map((person) => (
                          <CommandItem
                            value={person.name}
                            key={person.id}
                            onSelect={() => {
                              form.setValue("poiName", person.name);
                              form.setValue("poiID", person.id);
                            }}
                          >
                            {person.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                person.name === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Find a relative within your ASA family tree.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Visualize</Button>
      </form>
    </Form>
  );
}
