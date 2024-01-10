const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                'slate': {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#475569",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#020617"
                },
            },

        },
        screens: {
            'xs': {'min': '470px', 'max': '640px'},
            'pdXs': {'max': '469px'},
            'nbXs': {'max': '500px'},
            'sm-max': {'max': '640px'},
            "sm-phoneMax": {'max': '350px'},
            "sm-phoneMin": {'min': '350px'},

        },
    },
    plugins: [],
});