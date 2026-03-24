import { Chess, type Square } from 'chess.js';


//having a gamereset funct()

type SnakeSegment = [number, number];

const INITIAL_FEN = 'rnb1kbnr/pppppppp/8/8/8/8/3S4/7K w kq - 0 1';
const snakeReset: SnakeSegment[] = [[6, 3], [6, 2], [6, 1], [6, 0], [7, 0]];
const cloneSnake = (segments: SnakeSegment[]): SnakeSegment[] =>
    segments.map(([row, col]) => [row, col]);
const cloneBoard = (state: string[][]): string[][] =>
    state.map((row) => [...row]);



// the boardState is not stored in chess.js, rather it is being stored in an array, 
let board: string[][] = Array.from({ length: 8 }, () =>
    Array(8).fill('')
);

let currentTurn: 'B' | 'W' = 'W';

let snake: SnakeSegment[] = cloneSnake(snakeReset);
let gameOver = false;
//Okay think about it, does it matter to the snake what the pieces are? like knight or some crap, I think its concerned with itself, all pieces are P, and there is a king, K, own M, the head is H, and S is the rest of the snake, 
export function createGameLogic() {

    // Done chess.load(fen): Sets the board to a specific state (used at the top with your snake FEN string).

    // Done chess.fen(): Returns the FEN string of the current board state (used to update visuals).

    // chess.move(move): Attempts to make a move on the internal board logic.


    // chess.isCheckmate(): Checks if the game is over by checkmate.

    // chess.moves({ square, verbose }): Returns a list of all valid moves for a specific square.

    // chess.attackers(square): (Called but currently unused/hanging on line 85). Returns pieces attacking a square.

    const chess = new Chess()

    //chess.load
    const loadBoard = (fen: string) => {

        if (currentTurn === 'W') {
            chess.load(fen.replace(/S/g, 'N'));  // White's turn = WHITE knight
        } else if (currentTurn === 'B') {
            chess.load(fen.replace(/S/g, 'n'));  // Black's turn = BLACK knight
        }

        const boardState = fen.split(' ')[0];
        board = boardState?.split('/').map(row => {
            return row
                .replace(/\d/g, d => ' '.repeat(Number(d)))
                .split('');
        });
        for (const s of snake) {
            board[s[0]][s[1]] = "S"

        }
    }


    const resetGame = () => {
        currentTurn = 'W';
        snake = cloneSnake(snakeReset);
        gameOver = false;
        loadBoard(INITIAL_FEN);
    }

    /* 
    Here is the idea, black is snake, white is person, white goes first, 
    when it is whites turn, white will have a set of all white pieces, as the snake, 
    when its blacks turn, black will have nothing on the board, so, chess.js can handle the king moves
    and I handle the snake and so, the chessboard 2 will have a snake going on, 
    */

    // First step is to try to hack this, 
    const move = (square1: Square, square2: Square) => {
        if (gameOver) {
            return;
        }

        const tempindex = squareToCoords(square1)
        const val = board[7 - tempindex[1]][tempindex[0]]

        if (val === "S" && currentTurn === 'W') {
            // // Calculate adjacent squares for snake movement
            // let snakeMoves: { to: Square }[] = [];

            // // Get current position as numbers
            // let file = col;  // 0-7 (a-h)
            // let rank = 7 - row;  // 0-7 (1-8)

            // // Check all 4 directions (up, down, left, right)
            // const directions = [[0,1], [0,-1], [1,0], [-1,0]];

            // for (let [df, dr] of directions) {
            //     let newFile = file + df;
            //     let newRank = rank + dr;
            //     if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
            //         snakeMoves.push({ to: convotoI(newFile * 10 + newRank) });
            //     }
            // }

            // return snakeMoves;

            const sStart = squareToCoords(square1)
            const sEnd = squareToCoords(square2)
            const capturedPiece = board[7 - sEnd[1]][sEnd[0]];
            let eaten = false
            if (capturedPiece !== 'S' && capturedPiece !== ' ') {
                eaten = true
            }

            board[7 - sStart[1]][sStart[0]] = ' '
            board[7 - sEnd[1]][sEnd[0]] = 'S'
            snake.unshift([7 - sEnd[1], sEnd[0]])

            if (!eaten) {
                const temp = snake.pop();
                if (temp) {
                    board[temp[0]][temp[1]] = ' '
                }
            }

            if (capturedPiece === 'k') {
                currentTurn = 'B';
                gameOver = true;
            } else {
                const p = chess.fen().split(' ');
                currentTurn = 'B';
                loadBoard(`${boardToFen(board)} b ${p[2]} ${p[3]} ${p[4]} ${p[5]}`);
            }


        } else {
            const srcCoords = squareToCoords(square1);
            const destCoords = squareToCoords(square2);
            const destVal = board[7 - destCoords[1]][destCoords[0]];

            // I need a way to clean up my ideas, 
            // Okay so before someone does chess.move
            // I need to clean up my board, 
            // Snake stores where the pieces will be
            // so we need to generate a FEN, that matches, 
            // 1) okay so we wanna grab, the board

            // now the biggest thing is that i dont believe that the snake itself participates in this, 
            // but i believe that it shouldnt matter, because its only in relation the white king, and 
            // now that i think about it, 
            // im not sure, 
            // because 
            if (destVal === 'k') {
                board[7 - destCoords[1]][destCoords[0]] = val;
                board[7 - srcCoords[1]][srcCoords[0]] = ' ';
                currentTurn = 'B';
                gameOver = true;
            } else {
                chess.move({ from: square1, to: square2, promotion: 'q' });

                const p = chess.fen().split(' ');
                currentTurn = currentTurn === 'W' ? 'B' : 'W';
                loadBoard(chess.fen());
                chess.load(`${boardToFen(board)} ${currentTurn.toLowerCase()} ${p[2]} ${p[3]} ${p[4]} ${p[5]}`.replace(/S/g, currentTurn === 'W' ? 'N' : 'n'));
                gameOver = chess.isCheckmate();
            }

        }
    }
    const getSnake = () => {
        return cloneSnake(snake);
    }
    const chessMoves = (square: Square) => {
        if (gameOver) {
            return [];
        }

        const arr = squareToCoords(square)
        const col = arr[0];
        const row = 7 - arr[1];
        if (currentTurn === 'B' && board[row][col] !== "S") {
            return chess.moves({ square: square, verbose: true });
        } else if (currentTurn === 'W') {

            if (board[row][col] === "K") {
                return chess.moves({ square: square, verbose: true });
            } else if (snake[0][0] === row && snake[0][1] === col) {
                // Calculate adjacent squares for snake movement
                let snakeMoves: { to: Square }[] = [];


                const file = col;  // 0-7 (a-h)
                const rank = 7 - row;  // 0-7 (1-8)

                // Check all 4 directions (up, down, left, right)
                const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

                for (const [df, dr] of directions) {
                    const newFile = file + df;
                    const newRank = rank + dr;
                    if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
                        snakeMoves.push({ to: coordsToSquare(newFile * 10 + newRank) });
                    }
                }

                if (chess.inCheck()) {
                    const savedFen = chess.fen();
                    const savedFenParts = savedFen.split(' ');

                    snakeMoves = snakeMoves.filter(({ to }) => {
                        const [destCol, destRank] = squareToCoords(to);
                        const destRow = 7 - destRank;
                        const destVal = board[destRow][destCol];

                        if (destVal === 'k') {
                            return true;
                        }

                        const testBoard = cloneBoard(board);
                        const testSnake = cloneSnake(snake);
                        const [headRow, headCol] = testSnake[0];
                        const eaten = destVal !== ' ' && destVal !== 'S';

                        testBoard[headRow][headCol] = ' ';
                        testBoard[destRow][destCol] = 'S';
                        testSnake.unshift([destRow, destCol]);

                        if (!eaten) {
                            const tail = testSnake.pop();
                            if (tail) {
                                testBoard[tail[0]][tail[1]] = ' ';
                            }
                        }

                        try {
                            chess.load(`${boardToFen(testBoard).replace(/S/g, 'N')} ${savedFenParts[1]} ${savedFenParts[2]} ${savedFenParts[3]} ${savedFenParts[4]} ${savedFenParts[5]}`);
                            return !chess.inCheck();
                        } catch {
                            return false;
                        }
                    });

                    chess.load(savedFen);
                }

                return snakeMoves;
            }


        }
        return [];
    }

    loadBoard(INITIAL_FEN);




    //var BoardState = chess.fen().split(' ')[0];
    //chess.fen 
    const getBoardState = () => {
        return board.map((row) => [...row]);
    }



    return {
        chessMoves,
        resetGame, 
        move,
        getBoardState,
        loadBoard, 
        getSnake,
        chess,
        initialFen: chess.fen(),
    };


}
export function squareToCoords(input: string): number[] {

    const char = input[0]
    const input1 = char.toLowerCase().charCodeAt(0) - 97;


    let input2 = parseInt(input.slice(1));
    input2 -= 1;

    return [input1, input2];
}


export function boardToFen(board: string[][]): string {
    let res = ''
    let counter = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] !== " ") {
                if (counter > 0) {
                    res = res + counter
                    counter = 0
                }
                res = res + board[i][j]
            } else {
                counter += 1
            }
        }
        if (counter !== 0) {
            res = res + counter
            counter = 0
        }
        res += "/"
    }
    res = res.slice(0, -1);

    return res;
}

// let res = ""

// let char = input[0]; 
// char = char.toLowerCase();
// let charint = char.charCodeAt(0);

// charint = charint - 97 
// console.log(`this is ${charint}`)
// let intput = Number(input[1]); 
// intput + 1;
// console.log(`FINAL = ${ charint} ${intput}`)
// return [charint, Number(intput)];


export function coordsToSquare(input: number): Square {
    let i1 = Math.floor(input / 10);
    const i2 = input % 10 + 1;

    i1 += 97;
    const c1 = String.fromCharCode(i1);

    return (c1 + i2) as Square;
}
