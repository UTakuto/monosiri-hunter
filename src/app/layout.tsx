import { AuthProvider } from "@/providers/AuthProvider";
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
            <body className={kosugi.className}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
