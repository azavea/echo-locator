import { TextInput, TextField } from "./base/TextField/TextField";

interface Props {
    label: string;
    size?: "medium" | "large";
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
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
