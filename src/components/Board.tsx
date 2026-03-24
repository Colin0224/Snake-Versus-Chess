import './Board.css'
import { useState, useRef } from 'react';
import { createGameLogic, squareToCoords, coordsToSquare } from '../hooks/gameLogic';
import { type Square } from 'chess.js';


const { chess, getBoardState, chessMoves, move, getSnake, resetGame } = createGameLogic();

const typeMap = {
    p: 'BPawn',
    b: 'BBishop',
    k: 'BKing',
    n: 'BKnight',
    q: 'BQueen',
    r: 'BRook',
    P: 'WPawn',
    B: 'WBishop',
    K: 'WKing',
    N: 'WKnight',
    Q: 'WQueen',
    R: 'WRook'
};

const degMap: Record<string, number> = {
    "1, 1": 270,
    "1, -1": 0,
    "-1, 1": 180,
    "-1, -1": 90,
}

export function Board() {
    const selectedSquare = useRef<Square | ''>('');

    const [snakeData, setSnakeData] = useState(() => getSnake());

    const [cells, setCells] = useState(
        Array(8).fill(null).map(() => Array(8).fill(0))
    );

    const dialogRef = useRef<HTMLDialogElement>(null);
    const openModal = () => dialogRef.current?.showModal();
    const closeModal = () => dialogRef.current?.close();
    //create a 8x8 useState array, 

    const [boardArray, setBoardArray] = useState(() => getBoardState())



    // With this, im able to have a boardArray, that contains, say, piece data, 

    const svgPiece = (val: string, rowIndex: number, index: number) => {
        if (val !== 'S') {
            return {
                src: `/Pieces/${typeMap[val as keyof typeof typeMap]}.svg`,
                style: {}
            }
        } else if (val === 'S') {
            const head = snakeData[0]
            const tail = snakeData.at(-1)!
            if (rowIndex === head[0] && index === head[1]) {
                const headNext = snakeData.at(1)!
                const x = headNext[0] - head[0]
                const y = headNext[1] - head[1]
                const radian = Math.atan2(y, x)
                const degrees = -1 * radian * (180 / Math.PI);

                return {
                    src: '/Pieces/snakeHead.svg',
                    style: { transform: `rotate(${degrees}deg) scale(1.24)` }
                }
            } else if (rowIndex === tail[0] && index === tail[1]) {
                const tailNext = snakeData.at(-2)!
                const x = tailNext[0] - tail[0]
                const y = tailNext[1] - tail[1]
                const radian = Math.atan2(y, x)
                const degrees = -1 * (radian - Math.PI / 2) * (180 / Math.PI);
                return {
                    src: '/Pieces/snakeTail.svg',
                    style: { transform: `rotate(${degrees}deg) scale(1.25)` }
                }
            } else {
                const sindex = snakeData.findIndex(coord =>
                    coord[0] === rowIndex && coord[1] === index
                );
                const currSnake = snakeData.at(sindex)!
                const nextSnake = snakeData.at(sindex + 1)!
                const prevSnake = snakeData.at(sindex - 1)!
                if (nextSnake[0] === prevSnake[0] || nextSnake[1] === prevSnake[1]) {
                    const x = nextSnake[0] - currSnake[0]
                    const y = nextSnake[1] - currSnake[1]
                    const radian = Math.atan2(y, x)
                    const degrees = -1 * (radian) * (180 / Math.PI);
                    return {
                        src: '/Pieces/snakeBody.svg',
                        style: { transform: `rotate(${degrees}deg) scale(1.24)` }
                    }
                } else {
                    const vals = [0, 0]
                    vals[0] += nextSnake[0] - currSnake[0]
                    vals[1] += nextSnake[1] - currSnake[1]
                    vals[0] += prevSnake[0] - currSnake[0]
                    vals[1] += prevSnake[1] - currSnake[1]
                    const strVal = `${vals[0]}, ${vals[1]}`
                    const degrees = degMap[strVal] ?? 0;

                    return {
                        src: '/Pieces/snakeCurve.svg',
                        style: { transform: `rotate(${degrees}deg) scale(1.26)` }
                    }
                }
            }

        }
        return {
            src: `/Pieces/Apple.svg`,
            style: { transform: 'scale(1)' }
        }



    }

    const handleClick = (column: number, row: number) => {

        if (cells[column][row] === 2) {
            const capturingBlackKing = boardArray[column][row] === 'k';
            const m2Square = coordsToSquare(row * 10 + (7 - column));
            move(selectedSquare.current as Square, m2Square);
            setSnakeData(getSnake());

            setCells(Array(8).fill(null).map(() => Array(8).fill(0)));
            setBoardArray(getBoardState());
            if (capturingBlackKing || chess.isCheckmate()) {
                openModal();
            }
        } else if (cells[column][row] === 1) {
            // Clicked on already selected piece - unhighlight
            setCells(Array(8).fill(null).map(() => Array(8).fill(0)));
            selectedSquare.current = '';
        } else {
            selectedSquare.current = updateBoardColor(column, row)
        }

    };

    const gameReset = () => {

        resetGame();
        setSnakeData(getSnake());
        setBoardArray(getBoardState());
        setCells(createEmptyBoard());
        selectedSquare.current = '';
        closeModal();
    };

    const updateBoardColor = (column: number, row: number) => {
        const updatedCell = handleClear()

        const square = coordsToSquare(10 * row + (7 - column))

        const matrix = structuredClone(updatedCell);

        matrix[column][row] = 1;


        const moves = chessMoves(square);

        moves.forEach((move) => {

            const temp = squareToCoords(move.to)

            const v2 = temp[0].valueOf()
            const v1 = temp[1].valueOf()
            if (boardArray[7 - v1][v2] === 'S') {
                matrix[7 - v1][v2] = 1;
            } else {
                matrix[7 - v1][v2] = 2;
            }

        })

        setCells(matrix)

        return square
    }





    const createEmptyBoard = () => {
        return Array(8).fill(null).map(() => Array(8).fill(0));
    };

    const handleClear = () => {
        const emptyBoard = createEmptyBoard();
        setCells(emptyBoard);
        return emptyBoard;  // Return the NEW board, not stale `cells`
    }



    return (
        
        <div>
            
            {/* This is an 8x8 Board */}
            <div className="bg-white rounded-xl shadow-lg p-6 pb-2">

                <div className="grid grid-cols-8">

                    {boardArray?.map((row, rowIndex) => (


                        row.map((val, index) => {
                            const piece = val !== ' ' ? svgPiece(val, rowIndex, index) : null;
                            return (
                                <div key={`${rowIndex}-${index}`}
                                    className={`pd-1 relative size-14 flex items-center justify-center ${cells[rowIndex][index] === 1 ? 'bg-[#B1A7FC]' : (rowIndex + index) % 2 === 1 ? 'bg-[#B7C0D8]' : 'bg-[#E8EDF9]'}`}
                                    onClick={() => handleClick(rowIndex, index)}>
                                    {piece && (
                                        <img
                                            src={piece.src}
                                            style={piece.style}
                                            className="p-[6px]"
                                        />
                                    )}
                                    {cells[rowIndex][index] === 2 && (
                                        <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9990EB]/70" />
                                    )}
                                </div>
                            )
                        }
                        )
                    ))}


                </div>
                <div className="mt-2 flex justify-end">
                    <button className="w-[2.4vw] h-[2.4vw] p-0 bg-blue-200" onClick={gameReset}>
                        <img src="/Pieces/refresh.svg" ></img>
                    </button>
                </div>
            </div>

            <dialog ref={dialogRef}
                onClick={(e) => e.target === dialogRef.current && closeModal()}
                className="rounded-3xl p-0 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm w-full max-w-lg animate-in zoom-in-95 duration-200"
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl font-bold font-['Outfit',sans-serif] tracking-tight text-slate-800">👑 Checkmate</h1>

                    </div>



                    <button
                        onClick={closeModal}
                        className="w-full mt-2 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Close
                    </button>
                </div>

            </dialog>
        </div>
    )
}
