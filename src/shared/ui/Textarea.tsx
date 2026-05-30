import { Input, type InputProps } from "./Input";

export function Textarea(props: InputProps) {
  return (
    <Input {...props} multiline numberOfLines={4} textAlignVertical="top" />
  );
}
