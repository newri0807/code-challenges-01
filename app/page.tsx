import LoginForm from "@/components/LoginForm";

export default function Home() {
    return (
        <main className="flex h-screen w-full flex-col items-center justify-center align-middle">
            <div className="items-center justify-between font-mono text-sm lg:flex">
                <LoginForm />
            </div>
        </main>
    );
}
