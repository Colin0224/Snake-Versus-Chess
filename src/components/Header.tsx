import { useRef } from 'react';

export function Header() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => dialogRef.current?.close();

    return (
        <div className="flex flex-row justify-center border ">
            <h1 className="text-lg px-2">Chess Versus Snake</h1>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 mt-0.5"
                onClick={openModal}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
            </svg>

            {/* 2. The Dialog (Native Modal) */}
            <dialog
                ref={dialogRef}
                onClick={(e) => e.target === dialogRef.current && closeModal()} // Close on backdrop click
                className="rounded-3xl p-0 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm w-full max-w-lg animate-in zoom-in-95 duration-200"
            >
                <div className="p-8 pb-10 relative flex flex-col gap-2 text-left text-slate-800">
                    <button onClick={closeModal} className="absolute top-4 right-5 text-3xl text-gray-400 hover:text-gray-700">×</button>

                    <div className="mb-2">
                        <span className="font-semibold">Inspiration: </span>
                        <a href="https://www.youtube.com/shorts/pOF-uP48eiM" className="text-blue-600 hover:underline">📺 Click here to Watch / Learn Rules</a>
                    </div>

                    <h2 className="text-xl pt-2 font-bold mb-1">⚔️ The Matchup</h2>
                    <p className="ml-1">⚪ White Team: Standard Chess Pieces (No Queen 🚫♕)</p>
                    <p className="ml-1">🟢 Black Team: The King + The Giant Snake 🐍</p>

                    <h2 className="text-xl pt-4 font-bold mb-1">✅ Game is intuitive:</h2>
                    <p className="ml-1">🎯 Goal of Snake: Eat Black King</p>
                    <p className="ml-1">♚ Goal of Black: Traditionally Capture White King</p>

                    <h2 className="text-lg pt-4 font-bold mb-1">⚖️ Unintuitive Rules for Balance:</h2>
                    <p className="ml-1">📏 Snake Grows Longer when it captures a piece</p>
                    <p className="ml-1">♞ Black Pawns can only promote to a knight</p>
                </div>
            </dialog>
        </div>

    )
}
export default Header