export const C = {
    bg: "#000000",
    surface: "#080808",
    card: "#0b0b0b",
    border: "#181818",
    border2: "#242424",
    muted: "#2e2e2e",
    mutedFg: "#555",
    dimFg: "#777",
    fg: "#ddd",
    white: "#fff",
};

export const NAV = [
    { label: "My Escrows", href: "#my-escrows" },
    { label: "Create", href: "#create" },
];

export const SOL = {
    purple: "#9945FF",
    cyan: "#00C2FF",
    green: "#14F195",
    purpleDim: "rgba(153,69,255,0.15)",
    cyanDim: "rgba(0,194,255,0.12)",
    greenDim: "rgba(20,241,149,0.12)",
    purpleBorder: "rgba(153,69,255,0.35)",
    cyanBorder: "rgba(0,194,255,0.3)",
    greenBorder: "rgba(20,241,149,0.3)",
};

export const STATUS: Record<
    string,
    { color: string; bg: string; border: string; label: string }
> = {
    created: {
        color: SOL.cyan,
        bg: SOL.cyanDim,
        border: SOL.cyanBorder,
        label: "Created",
    },
    funded: {
        color: SOL.green,
        bg: SOL.greenDim,
        border: SOL.greenBorder,
        label: "Funded",
    },
    claimed: {
        color: SOL.purple,
        bg: SOL.purpleDim,
        border: SOL.purpleBorder,
        label: "Claimed",
    },
    cancelled: {
        color: "#ef4444",
        bg: "rgba(239,68,68,0.1)",
        border: "rgba(239,68,68,0.3)",
        label: "Cancelled",
    },
};