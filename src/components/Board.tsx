import './Board.css'
import React, { useState } from 'react';
import { gameLogic, convotoB, convotoI } from '../hooks/gameLogic';


const { chess, initialFen } = gameLogic();

var mSquare = ''

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

chess.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/NNNNNNNK w KQkq - 0 1');

export function Board() {

    var fenArr = chess.fen().split(' ');
    var BoardState = fenArr[0]

    const [cells, setCells] = useState(
        Array(8).fill(null).map(() => Array(8).fill(0))
    );

    //create a 8x8 useState array, 



    var boardArray = BoardState?.split('/').map(row => {

        return row
            .replace(/\d/g, d => ' '.repeat(Number(d)))
            .split('');
    });

    // With this, im able to have a boardArray, that contains, say, piece data, 



    const handleClick = (column: number, row: number, event: any) => {

        if (cells[column][row] == 2) {
            let m2Square = convotoI(row * 10 + (7 - column))
            chess.move(mSquare + '-' + m2Square)

            setCells(Array(8).fill(null).map(() => Array(8).fill(0)));
            fenArr = chess.fen().split(' ');
            BoardState = fenArr[0]
            boardArray = BoardState?.split('/').map(row => {
                return row
                    .replace(/\d/g, d => ' '.repeat(Number(d)))
                    .split('');
            });
            if (chess.isCheckmate() == true) {
                console.log("Checkmate")
            }
        } else {
            mSquare = updateBoardColor(column, row)
        }

    };



    const updateBoardColor = (column: number, row: number) => {
        let updatedCell = handleClear()

        let square = convotoI(10 * row + (7 - column))

        let matrix = structuredClone(updatedCell);
        console.log(column, row)
        matrix[column][row] = 1;

        chess.attackers(square)

        const moves = chess.moves({ square: square, verbose: true })

        moves.forEach((move, index) => {
            console.log(move.to)
            let temp = convotoB(move.to)

            let v2 = temp[0].valueOf()
            let v1 = temp[1].valueOf()
            console.log(v1, v2)
            matrix[7 - v1][v2] = 2;

        })
        console.log(matrix)
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
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-8">

                    {boardArray?.map((row, rowIndex) => (
                        row.map((val, index) => (
                            <div key={`${rowIndex}-${index}`}
                                className={`pd-1 size-14 flex items-center justify-center ${cells[rowIndex][index] == 1 ? 'bg-[#B1A7FC]' : (rowIndex + index) % 2 == 1 ? 'bg-[#B7C0D8]' : 'bg-[#E8EDF9]'}`}
                                onClick={() => handleClick(rowIndex, index, event)}>{
                                    (val != ' ' || cells[rowIndex][index] == 2) && (<img src={`/Pieces/${typeMap[val as keyof typeof typeMap]}.svg`}
                                        className={` p-[6px] ${cells[rowIndex][index] == 2 ? 'h-4 w-4 bg-[#9990EB] rounded-full' : ''}
                                `
                                        } />


                                    )}</div>
                            //                            className={`pd-1 size-14 flex items-center justify-center ${cells[rowIndex][index] == 1 ? 'bg-[#B1A7FC]' : cells[rowIndex][index] == 2 ? 'bg-yellow-200' : (rowIndex + index) % 2 == 1 ? 'bg-[#B7C0D8]' : 'bg-[#E8EDF9]' }`} onClick={() => handleClick(rowIndex, index, event)}>{val != ' ' && (<img src = {`/Pieces/${typeMap[val as keyof typeof typeMap]}.svg`} className = "p-[6px]" /> ) }</div>
                        )
                        )
                    ))}


                </div>
            </div>
        </div>
    )
}