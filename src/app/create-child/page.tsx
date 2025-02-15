"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChild } from "@/hooks/useChild";

export default function CreateChildPage() {
    const [name, setName] = useState("");
    const router = useRouter();
    const { createChild, isLoading, error } = useChild();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await createChild(name);
            router.push("/select-child");
        } catch (error) {
            console.error("子どもアカウントの作成に失敗しました:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">子どもアカウントの作成</h1>
                    <p className="mt-2 text-gray-600">お子様の名前を入力してください</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            お名前
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading ? "作成中..." : "アカウントを作成"}
                    </button>

                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                </form>
            </div>
        </div>
    );
}
