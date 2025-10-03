import {
    Disclosure,
    Heading,
    DisclosurePanel,
    type DisclosureProps,
    Button,
} from "react-aria-components";
import accordionStyles from "./Accordion.styles";
import type { ReactNode } from "react";

interface AccordionItemProps extends DisclosureProps {
    id: string;
    title: string;
    subtitle: string;
    titleContentRight: ReactNode;
    isMobile?: boolean;
    overridePanelOpen?: boolean;
    children?: ReactNode;
}

export const AccordionItem = ({
    title,
    subtitle,
    titleContentRight,
    isMobile,
    overridePanelOpen,
    children,
    ...props
}: AccordionItemProps) => {
    const styles = accordionStyles({ overridePanelOpen: overridePanelOpen });

    return (
        <Disclosure id={props.id}>
            {({ isExpanded }) => (
                <>
                    <Heading className="w-full">
                        <Button
                            slot="trigger"
                            className={styles.accordionItem({
                                expanded: isExpanded,
                                expandedAndMobile: isExpanded && isMobile,
                            })}
                        >
                            <div className={styles.accordionItemTextWrapper()}>
                                <h2>{title}</h2>
                                <h4 className={styles.accordionItemSubText()}>
                                    {subtitle}
                                </h4>
                            </div>
                            <div className={styles.accordionItemTextWrapper()}>
                                {titleContentRight}
                            </div>
                        </Button>
                    </Heading>
                    <DisclosurePanel
                        className={styles.accordionItemPanel({
                            expanded: isExpanded,
                            expandedAndMobile: isExpanded && isMobile,
                        })}
                    >
                        {children}
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
};
