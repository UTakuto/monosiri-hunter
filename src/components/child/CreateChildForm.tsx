"use client";
import { useState } from "react";
import { useChild } from "@/hooks/useChild";

export const CreateChildForm = () => {
    const [name, setName] = useState("");
    const { createChild, isLoading, error } = useChild();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await createChild(name);
            window.location.href = "/select-child";
        } catch (error) {
            console.error("子どもアカウントの作成に失敗しました:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium">
                    お子様のお名前
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
                {isLoading ? "作成中..." : "アカウントを作成"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};
