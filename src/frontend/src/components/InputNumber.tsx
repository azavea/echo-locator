import Button from "./base/Button/Button";
import { NumberField, NumberInput } from "./base/NumberField/NumberField";

import PlusIcon from "assets/icons/plus.svg?react";
import MinusIcon from "assets/icons/minus.svg?react";

interface Props {
    label: string;
    value: number;
    onChange: React.Dispatch<React.SetStateAction<number>>;
}

const InputNumber = ({ label, value, onChange }: Props) => (
    <NumberField
        aria-label={label}
        value={value}
        onChange={onChange}
        minValue={0}
    >
        <Button
            size="large"
            slot="decrement"
            variant="secondary"
            leftIcon={
                <MinusIcon className="font-normal h-[14px] w-[14px] fill fill-teal-800" />
            }
        />
        <NumberInput />
        <Button
            size="large"
            slot="increment"
            variant="secondary"
            leftIcon={
                <PlusIcon className="font-normal h-[14px] w-[14px] fill fill-teal-800" />
            }
        />
    </NumberField>
);

export default InputNumber;
