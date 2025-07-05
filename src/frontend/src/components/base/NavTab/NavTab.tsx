import {
    Link as AriaLink,
    composeRenderProps,
    type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";

import { navTabStyles, navBadgeStyles } from "./NavTab.styles";

interface NavLinkProps
    extends AriaLinkProps,
        VariantProps<typeof navBadgeStyles> {
    isActive?: boolean;
    count?: number;
    children?: React.ReactNode;
    badgeVariant?: VariantProps<typeof navBadgeStyles>["variant"];
}

const NavTab = ({
    isActive,
    count,
    className,
    children,
    badgeVariant,
    ...props
}: NavLinkProps) => (
    <AriaLink
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
            navTabStyles({
                ...renderProps,
                className,
                isActive,
            })
        )}
    >
        <div className="flex items-center gap-2">
            {children}
            {count !== undefined && (
                <span className={navBadgeStyles({ variant: badgeVariant })}>
                    {count}
                </span>
            )}
        </div>
    </AriaLink>
);

export { NavTab };
