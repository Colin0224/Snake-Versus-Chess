import './Board.css'
import React, { useState } from 'react';
import { gameLogic, convotoB, convotoI, boardToFen, getSnake} from '../hooks/gameLogic';
import { type Square } from 'chess.js';


const { chess, initialFen, getBoardState , chessMoves, move} = gameLogic();

var mSquare: Square | '' = ''

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

const degMap = {
    "1, 1" :  270, 
    "1, -1" : 0, 
    "-1, 1" : 180, 
    "-1, -1" : 90, 
}

export function Board() {

    const [snakeData, setSnakeData] = useState(getSnake());
    var BoardState = getBoardState();

    const [cells, setCells] = useState(
        Array(8).fill(null).map(() => Array(8).fill(0))
    );

    //create a 8x8 useState array, 



    var boardArray = BoardState

    // With this, im able to have a boardArray, that contains, say, piece data, 

    const svgPiece = (val:String, rowIndex: Number, index: Number) => {
        if(val != 'S'){
            return {
                src: `/Pieces/${typeMap[val as keyof typeof typeMap]}.svg`, 
                style: {}
        }
        }else if(val == 'S'){
            let head = snakeData[0]
            let tail = snakeData.at(-1)
            if(rowIndex == head[0] && index == head[1]){
                let headNext = snakeData.at(1)
                let x = headNext[0] - head[0]
                let y = headNext[1] - head[1]
                let radian = Math.atan2(y, x)
                const degrees = -1 * radian * (180 / Math.PI);

                return{
                    src: '/Pieces/snakeHead.svg', 
                    style: {transform: `rotate(${degrees}deg) scale(1.24)`}
                }
            }else if (rowIndex == tail[0] && index == tail[1]){
                let tailNext = snakeData.at(-2)
                let x = tailNext[0] - tail[0]
                let y = tailNext[1] - tail[1]
                let radian = Math.atan2(y, x)
                const degrees = -1 * (radian - Math.PI / 2) * (180/ Math.PI);
                return{
                    src: '/Pieces/snakeTail.svg', 
                    style: {transform: `rotate(${degrees}deg) scale(1.25)`}
                }
            }else{ 
                const sindex = snakeData.findIndex(coord => 
                    coord[0] === rowIndex && coord[1] === index
                );
                let currSnake = snakeData.at(sindex)
                let nextSnake = snakeData.at(sindex + 1)
                let prevSnake = snakeData.at(sindex - 1)
                if(nextSnake[0] == prevSnake[0] || nextSnake[1] == prevSnake[1]){
                    let x = nextSnake[0] - currSnake[0]
                    let y = nextSnake[1] - currSnake[1]
                    let radian = Math.atan2(y, x)
                    const degrees = -1 * (radian) * (180/ Math.PI);
                    return { 
                        src: 'Pieces/snakeBody.svg',
                        style: {transform: `rotate(${degrees}deg) scale(1.24)`}
                    }
                }else{ 
                    let vals = [0, 0]
                    vals[0] += nextSnake[0] - currSnake[0]
                    vals[1] += nextSnake[1] - currSnake[1] 
                    vals[0] += prevSnake[0] - currSnake[0]
                    vals[1] += prevSnake[1] - currSnake[1]
                    let strVal = `${vals[0]}, ${vals[1]}`
                    const degrees = (degMap as any)[strVal] || 0; 

                    return {
                        src: 'Pieces/snakeCurve.svg', 
                        style: {transform: `rotate(${degrees}deg) scale(1.26)`}
                    }
                }
            }
            
        }
            return {
                src: `/Pieces/Apple.svg`,  
                style: {transform: 'scale(1)'}
            }

        

    }

    const handleClick = (column: number, row: number, event: any) => {
        setSnakeData(getSnake());

        if (cells[column][row] == 2) {
            
            let m2Square = convotoI(row * 10 + (7 - column))
            move(mSquare as Square, m2Square);

            setCells(Array(8).fill(null).map(() => Array(8).fill(0)));
            BoardState = getBoardState();
            boardArray = BoardState
            if (chess.isCheckmate() == true) {

                console.log("Checkmate")
            }
        } else if (cells[column][row] == 1) {
            // Clicked on already selected piece - unhighlight
            setCells(Array(8).fill(null).map(() => Array(8).fill(0)));
            mSquare = '';
        } else {
            mSquare = updateBoardColor(column, row)
        }

    };



    const updateBoardColor = (column: number, row: number) => {
        let updatedCell = handleClear()

        let square = convotoI(10 * row + (7 - column))

        let matrix = structuredClone(updatedCell);

        matrix[column][row] = 1;


        const moves = chessMoves(square); 

        moves.forEach((move, index) => {
            
            let temp = convotoB(move.to)

            let v2 = temp[0].valueOf()
            let v1 = temp[1].valueOf()
            if(boardArray[7 - v1][v2] == 'S'){
                matrix[7 - v1][v2] = 1; 
            }else{
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
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-8">

                    {boardArray?.map((row, rowIndex) => (

                        
                        row.map((val, index) => {
                            const {src, style} = svgPiece(val, rowIndex, index);
                            return(
                            <div key={`${rowIndex}-${index}`}
                                className={`pd-1 size-14 flex items-center justify-center ${cells[rowIndex][index] == 1 ? 'bg-[#B1A7FC]' : (rowIndex + index) % 2 == 1 ? 'bg-[#B7C0D8]' : 'bg-[#E8EDF9]'}`}
                                onClick={() => handleClick(rowIndex, index, event)}>{
                                    (val != ' ' || cells[rowIndex][index] == 2) && (<img src={src} style = {style}
                                        className={` p-[6px] ${cells[rowIndex][index] == 2 ? 'h-4 w-4 bg-[#9990EB] rounded-full' : ''}
                                `
                                        } />


                                    )}</div>
                            //className={`pd-1 size-14 flex items-center justify-center ${cells[rowIndex][index] == 1 ? 'bg-[#B1A7FC]' : cells[rowIndex][index] == 2 ? 'bg-yellow-200' : (rowIndex + index) % 2 == 1 ? 'bg-[#B7C0D8]' : 'bg-[#E8EDF9]' }`} onClick={() => handleClick(rowIndex, index, event)}>{val != ' ' && (<img src = {`/Pieces/${typeMap[val as keyof typeof typeMap]}.svg`} className = "p-[6px]" /> ) }</div>
                        )
                    }
                    )
                    ))}


                </div>
            </div>
        </div>
    )
}