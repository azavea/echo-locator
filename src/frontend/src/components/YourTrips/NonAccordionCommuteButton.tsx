import { Heading } from "react-aria-components";

import accordionStyles from "../base/Accordion/Accordion.styles";
import type { AccordionItemProps } from "../base/Accordion/AccordionItem";
import Button from "../base/Button/Button";

interface NonAccordionCommuteButton extends AccordionItemProps {
    onPress: () => void;
}

export const NonAccordionCommuteButton = ({
    title,
    subtitle,
    titleContentRight,
    isMobile,
    overridePanelOpen,
    onPress,
    children,
    ...props
}: NonAccordionCommuteButton) => {
    const styles = accordionStyles({ overridePanelOpen: overridePanelOpen });

    return (
        <Button
            variant="unstyled"
            id={props.id}
            className={styles.accordionItemWrapper()}
            onPress={onPress}
        >
            <div
                className={styles.accordionItem({
                    expanded: true,
                    expandedAndMobile: true && isMobile,
                })}
            >
                <Heading className={styles.accordionItemHeading()}>
                    <div className={styles.accordionButton()}>
                        <div className={styles.accordionItemTextWrapper()}>
                            <h2>{title}</h2>
                            <h4 className={styles.accordionItemSubText()}>
                                {subtitle}
                            </h4>
                        </div>
                        <div className={styles.accordionItemTextWrapper()}>
                            {titleContentRight}
                        </div>
                    </div>
                </Heading>
                <div
                    className={styles.accordionItemPanel({
                        expanded: true,
                        expandedAndMobile: true && isMobile,
                    })}
                >
                    {children}
                </div>
            </div>
        </Button>
    );
};
