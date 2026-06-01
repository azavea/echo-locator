import { useState, type ReactNode } from "react";
import {
    Button,
    Disclosure,
    DisclosurePanel,
    Heading,
    type DisclosureProps,
} from "react-aria-components";

import accordionStyles from "./Accordion.styles";

export interface AccordionItemProps extends DisclosureProps {
    id: string;
    title: string;
    subtitle: string;
    titleContentRight?: ReactNode;
    isMobile?: boolean;
    overridePanelOpen?: boolean;
    lazyLoad?: boolean;
    children?: ReactNode;
}

export const AccordionItem = ({
    title,
    subtitle,
    titleContentRight,
    isMobile,
    overridePanelOpen,
    children,
    lazyLoad,
    ...props
}: AccordionItemProps) => {
    const styles = accordionStyles({ overridePanelOpen: overridePanelOpen });
    // If lazyLoad enabled, prevet rendering children in panel until expanded.
    // Once expanded, sets isLazyLoaded to prevent re-rendering on every
    // expansion change call.
    const [isLazyLoaded, setIsLazyLoaded] = useState(false);

    return (
        <Disclosure
            id={props.id}
            className={styles.accordionItemWrapper()}
            onExpandedChange={isExpanded =>
                lazyLoad && isExpanded && !isLazyLoaded && setIsLazyLoaded(true)
            }
        >
            {({ isExpanded }) => (
                <div
                    className={styles.accordionItem({
                        expanded: isExpanded,
                        expandedAndMobile: isExpanded && isMobile,
                    })}
                >
                    <Heading className={styles.accordionItemHeading()}>
                        <Button
                            slot="trigger"
                            className={styles.accordionButton()}
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
                        {!lazyLoad || isLazyLoaded ? children : <></>}
                    </DisclosurePanel>
                </div>
            )}
        </Disclosure>
    );
};
