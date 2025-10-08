import {
    DisclosureGroup,
    type DisclosureGroupProps,
    type Key,
} from "react-aria-components";
import accordionStyles from "./Accordion.styles";
import { useState } from "react";

type AccordionProps = DisclosureGroupProps & {
    className?: string;
    expandedItemCallback?: ([]) => void;
};

export const Accordion = ({
    children,
    className,
    expandedItemCallback,
    ...props
}: AccordionProps) => {
    const { root } = accordionStyles();
    const [expandedKeys, setExpandedKeys] = useState<Iterable<Key>>(
        props.defaultExpandedKeys ?? new Set([])
    );

    const handleExpandedChange = (keys: Set<Key>) => {
        if (keys.size) {
            setExpandedKeys(keys);
            if (expandedItemCallback) {
                expandedItemCallback([...keys]);
            }
        }
    };
    return (
        <DisclosureGroup
            expandedKeys={expandedKeys}
            onExpandedChange={handleExpandedChange}
            {...props}
            className={root({ className: className as string })}
        >
            {children}
        </DisclosureGroup>
    );
};
