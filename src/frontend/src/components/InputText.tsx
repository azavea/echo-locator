import { TextInput, TextField } from "./base/TextField/TextField";

interface Props {
    label: string;
    size?: "medium" | "large";
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

const InputText = ({
    label,
    value,
    onChange,
    placeholder,
    size = "medium",
}: Props) => (
    <TextField value={value} onChange={onChange} aria-label={label}>
        <TextInput inputSize={size} placeholder={placeholder} />
    </TextField>
);

export default InputText;
