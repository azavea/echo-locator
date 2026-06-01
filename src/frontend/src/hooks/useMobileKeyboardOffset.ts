import { useEffect, useState } from "react";

const useMobileKeyboardOffset = (): number => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const vh = window.visualViewport?.height || window.innerHeight;
            const fullHeight = window.innerHeight;
            const keyboardHeight = fullHeight - vh;
            setOffset(keyboardHeight);
        };

        window.visualViewport?.addEventListener("resize", handleResize);
        return () =>
            window.visualViewport?.removeEventListener("resize", handleResize);
    }, []);

    return offset;
};

export default useMobileKeyboardOffset;
