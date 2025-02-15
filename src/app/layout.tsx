import { AuthProvider } from "@/components/auth/AuthProvider";
import { Kosugi } from "next/font/google";
import "./globals.css";

const kosugi = Kosugi({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-kosugi",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <AuthProvider>
                <body className={`${kosugi.variable}`}>{children}</body>
            </AuthProvider>
        </html>
    );
}
