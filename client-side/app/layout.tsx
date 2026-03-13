import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Dinu's Tasty - Kandy's Finest Restaurant",
    description: "Best restaurant in Kandy, Sri Lanka. Online orders, reservations and more!",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        </head>
        <body>{children}</body>
        </html>
    );
}