import {
    NavLink as RouterNavLink,
    type NavLinkProps as RouterNavLinkProps,
} from "react-router";
import { type VariantProps } from "tailwind-variants";
import { navTabStyles, navBadgeStyles } from "./NavTab.styles";

interface NavLinkProps
    extends Omit<RouterNavLinkProps, "className" | "children"> {
    isActive?: boolean;
    count?: number;
    badgeVariant?: VariantProps<typeof navBadgeStyles>["variant"];
    children: React.ReactNode;
}

const NavTab = ({
    count,
    isActive,
    badgeVariant,
    children,
    ...props
}: NavLinkProps) => {
    return (
        <RouterNavLink {...props} className={navTabStyles({ isActive })}>
            <div className="flex items-center gap-2">
                {children}
                {count !== undefined && (
                    <span
                        className={navBadgeStyles({
                            variant: badgeVariant,
                        })}
                    >
                        {count}
                    </span>
                )}
            </div>
        </RouterNavLink>
    );
};

export default NavTab;
