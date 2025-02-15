"use client";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ChildList } from "@/components/child/ChildList";

export default function SelectChild() {
    return (
        <RequireAuth>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">お子様を選択してください</h1>
                <ChildList />
            </div>
        </RequireAuth>
    );
}
