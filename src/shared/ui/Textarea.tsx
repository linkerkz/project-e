import { Input, type InputProps } from "./Input";

export function Textarea(props: InputProps) {
  return (
    <Input multiline numberOfLines={4} textAlignVertical="top" {...props} />
  );
}
