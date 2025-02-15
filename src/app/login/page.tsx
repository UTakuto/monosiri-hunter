"use client";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
    const { signInWithGoogle, isLoading, error } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">ものしりハンター</h1>
                    <p className="mt-2">保護者の方でログインしてください</p>
                </div>
                <button
                    onClick={signInWithGoogle}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? "ログイン中..." : "Googleでログイン"}
                </button>
                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
}
