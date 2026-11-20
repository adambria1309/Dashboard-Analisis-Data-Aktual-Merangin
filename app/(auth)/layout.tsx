import ThemeToggler from "@/components/ui/ThemeToggler";

const AuthLayout =({ children }: { children: React.ReactNode }) => {
    return (
        <div className='relative flex min-h-svh w-full items-center justify-center overflow-y-auto px-4 py-10'>
            {children}
            <div className="fixed bottom-5 right-5 z-10 text-white">
                <ThemeToggler />
            </div>
        </div>
    );
};

export default AuthLayout;
