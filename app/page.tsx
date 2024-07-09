import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center ">
            <div className="text-center mb-12">
                <h1 className="text-8xl font-bold text-gray-900">🖤</h1>
                <p className="text-2xl py-2 text-gray-600">Welcome to @@@</p>
                <p className="text-xl text-gray-500">Join us at @@@ and enjoy!</p>
            </div>
            <div className="text-center">
                <Link
                    href="/create-account"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-center inline-block transition duration-200 ease-in-out"
                >
                    Get Started
                </Link>
                <p className="mt-4 text-gray-600">
                    Already have an account?
                    <Link href="/log-in" className="ml-1 text-blue-500 hover:text-blue-600">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
