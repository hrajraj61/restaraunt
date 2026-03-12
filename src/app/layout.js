import "./globals.css";

// Using system sans-serif fonts for clean, modern typography
const fontVariables = "--font-body: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; --font-display: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export const metadata = {
  title: "Dubey's Dhaba",
  description: "Dubey's Dhaba menu and restaurant home page",
  manifest: "/manifest.json",
  themeColor: "#f59e0b",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dubey's Dhaba"
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#f59e0b",
    "msapplication-config": "/browserconfig.xml"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dubey's Dhaba" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{fontFamily: 'ui-sans-serif, system-ui, sans-serif'}}>{children}</body>
    </html>
  );
}
