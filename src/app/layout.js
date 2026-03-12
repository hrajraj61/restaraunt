import "./globals.css";

// Using system sans-serif fonts for clean, modern typography
const fontVariables = "--font-body: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; --font-display: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export const metadata = {
  title: "Dubey's Dhaba",
  description: "Dubey's Dhaba menu and restaurant home page"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{fontFamily: 'ui-sans-serif, system-ui, sans-serif'}}>{children}</body>
    </html>
  );
}
