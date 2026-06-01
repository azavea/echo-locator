import type { Config } from "tailwindcss";
import reactAriaComponents from "tailwindcss-react-aria-components";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    plugins: [reactAriaComponents(), animatePlugin],
};

export default config;
