import Navbar from "@/components/website/navbarr";

export default function WebsiteLayout({ children }) {
    return (
        <div className="relative">
            <div className="w-full relative flex flex-col gap-5">
                <Navbar />
                <div className="bg- rounded-md sh p-4 md:p-6 pt-0 md:pt-2 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
