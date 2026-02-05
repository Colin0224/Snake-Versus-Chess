import { Chess, type Square} from 'chess.js'; 
import { useState } from 'react';




// the boardState is not stored in chess.js, rather it is being stored in an array, 
    var board: string[][] = Array.from({length: 8}, () => 
    Array(8).fill('')
);

    var cTurn: 'B' | 'W' = 'W';

var snake = [[6, 3], [6, 2], [6, 1], [6, 0], [7, 0]]
//Okay think about it, does it matter to the snake what the pieces are? like knight or some crap, I think its concerned with itself, all pieces are P, and there is a king, K, own M, the head is H, and S is the rest of the snake, 
export function gameLogic() {

// Done chess.load(fen): Sets the board to a specific state (used at the top with your snake FEN string).

// Done chess.fen(): Returns the FEN string of the current board state (used to update visuals).

// chess.move(move): Attempts to make a move on the internal board logic.


// chess.isCheckmate(): Checks if the game is over by checkmate.

// chess.moves({ square, verbose }): Returns a list of all valid moves for a specific square.

// chess.attackers(square): (Called but currently unused/hanging on line 85). Returns pieces attacking a square.
    
    const chess = new Chess()

    //chess.load
    const loadBoard = (fen: string) => {

        if(cTurn == 'W'){
            chess.load(fen.replace(/S/g, 'N'));  // White's turn = WHITE knight
        }else if(cTurn == 'B'){
            chess.load(fen.replace(/S/g, 'n'));  // Black's turn = BLACK knight
        }
        
        var BoardState = fen.split(' ')[0];
        board = BoardState?.split('/').map(row => {
        return row
            .replace(/\d/g, d => ' '.repeat(Number(d)))
            .split('');
    });
        for(var s of snake){   
            board[s[0]][s[1]] = "S"

        }
    }



    /* 
    Here is the idea, black is snake, white is person, white goes first, 
    when it is whites turn, white will have a set of all white pieces, as the snake, 
    when its blacks turn, black will have nothing on the board, so, chess.js can handle the king moves
    and I handle the snake and so, the chessboard 2 will have a snake going on, 
    */

    // First step is to try to hack this, 
    const move = (square1: Square, square2: Square) => {
        let tempindex = convotoB(square1)
        let val = board[7 - tempindex[1]][tempindex[0]]

        if(val == "S" && cTurn == 'W'){
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

            let sStart = convotoB(square1)
            let sEnd = convotoB(square2)
            let eaten = false
            if(board[7 - sEnd[1]][sEnd[0]] != 'S' && board[7 - sEnd[1]][sEnd[0]] != ' '){
                eaten = true
            }

            board[7 - sStart[1]][sStart[0]] = ' '
            board[7 - sEnd[1]][sEnd[0]] = 'S'
            snake.unshift([7 - sEnd[1], sEnd[0]])
            
            if(eaten == false){
                let temp = snake.pop();
                if (temp) {
                    board[temp[0]][temp[1]] = ' '
                }
            }

            let myFen = boardToFen(board); 
            myFen = myFen + " b - - 0 1"
            cTurn = 'B'
            loadBoard(myFen)

            
        }else{ 
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
            chess.move(square1 + '-' + square2)
            cTurn = cTurn === 'W' ? 'B' : 'W';
            loadBoard(chess.fen())
            var myFen = boardToFen(board)
            // with this board lets convert it into a fen, 
            // now that we have the fen of the board, theres " b - - 0 1" that we need to attached to the back depehnding on cTurn
            if(cTurn == 'W'){
                myFen += " w - - 0 1"
                chess.load(myFen.replace(/S/g, 'N')); 
            }else if(cTurn == 'B'){
                myFen += " b - - 0 1"
                chess.load(myFen.replace(/S/g, 'n')); 
            }

        }
    }
    const fenReturn = () => {
        
    }

    const chessMoves = ( square : Square ) => {
        let arr = convotoB(square)
        let col = arr[0];
        let row = 7 - arr[1];
        if(cTurn == 'B' && board[row][col] != "S"){
            return chess.moves({ square: square, verbose: true });
        }else if(cTurn == 'W'){

            if(board[row][col] == "K"){
                return chess.moves({square: square, verbose: true});
            }else if(snake[0][0] == row && snake[0][1] == col && chess.inCheck() == false){
                // Calculate adjacent squares for snake movement
                let snakeMoves: { to: Square }[] = [];
                

                let file = col;  // 0-7 (a-h)
                let rank = 7 - row;  // 0-7 (1-8)
                
                // Check all 4 directions (up, down, left, right)
                const directions = [[0,1], [0,-1], [1,0], [-1,0]];
                
                for (let [df, dr] of directions) {
                    let newFile = file + df;
                    let newRank = rank + dr;
                    if (newFile >= 0 && newFile < 8 && newRank >= 0 && newRank < 8) {
                        snakeMoves.push({ to: convotoI(newFile * 10 + newRank) });
                    }
                }
                
                return snakeMoves;
            }                
                                
            
        }
        return [];
    }

    loadBoard('rnbqkbnr/pppppppp/8/8/8/8/3S4/7K w - - 0 1');

    


    //var BoardState = chess.fen().split(' ')[0];
    //chess.fen 
    const getBoardState = () => {

        return board;
    }



    return {
        chessMoves,
        move, 
        getBoardState,

        chess,
        initialFen: chess.fen(),
    };

    
}

export function getSnake(): number[][]{
    return snake;
}

export function convotoB(input: string): number[] {

    let char = input[0]
    const input1 = char.toLowerCase().charCodeAt(0) - 97; 


    var input2 = parseInt(input.slice(1)); 
    input2 -= 1; 

    return [input1, input2];
}


export function boardToFen(board: string[][]): string{
    let res = ''
    let counter = 0; 
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[0].length; j++){
            if (board[i][j] != " "){
                if(counter > 0){
                    res = res + counter
                    counter = 0
                }
                res = res + board[i][j]
            }else {
                counter += 1
            }
        }
        if( counter != 0){
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


export function convotoI(input: number): Square {
    let i1 = Math.floor(input / 10);
    let i2 = input % 10 + 1;

    i1 += 97;
    let c1 = String.fromCharCode(i1);

    return (c1 + i2) as Square;
}


