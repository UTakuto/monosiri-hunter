import { AuthProvider } from "@/providers/AuthProvider";
import { Kosugi } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

const kosugi = Kosugi({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-kosugi",
});

export const metadata: Metadata = {
    title: "ものしりハンター",
    description: "ものしりハンターは、写真から物体を認識し、その名前を当てるゲームです。",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <head>
                {/* iOS用 */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                {/* Android用 */}
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className={kosugi.className}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
