import { useState } from "react";
import LogoutButton from "./LogoutButton";

interface User {
    id: string;
    name: { givenName: string; familyName: string } | string;
    email: string;
    picture: string;
}

interface MenuProps {
    user: User | null;
}

export default function UserPanel({ user }: MenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const renderUserName = () => {
        if (!user || !user.name) return "";
        if (typeof user.name === "string") return user.name;
        return `${user.name.givenName} ${user.name.familyName}`;
    };

    return (
        <div className="inline-block">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex flex-col bg-stone-100 border-stone-500 hover:bg-stone-200 text-stone-900 button"
            >
                <div className="flex items-center space-x-2 w-full">
                    {user?.picture && (
                        <img
                            src={user.picture}
                            className="w-10 h-10 rounded-full border border-stone-500"
                            alt="User avatar"
                        />
                    )}
                    <span className="font-semibold text-lg">{renderUserName()}</span>
                </div>

                {/* Extra content shown when open */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                        isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    } w-full`}
                >
                    <div className="mt-2">
                        <LogoutButton />
                    </div>
                </div>
            </button>
        </div>
    );
}
