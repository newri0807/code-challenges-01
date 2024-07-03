import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function Home() {
    return (
        <main className="flex h-full w-full flex-col items-center justify-between">
            <div className="items-center justify-between font-mono text-sm lg:flex">
                <LoginForm />
            </div>
        </main>
    );
}
