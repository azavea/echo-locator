import type { Config } from "tailwindcss";
import reactAriaComponents from "tailwindcss-react-aria-components";

const config: Config = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    plugins: [reactAriaComponents()],
};

export default config;
