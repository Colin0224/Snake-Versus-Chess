import { Chess, type Square} from 'chess.js'; 
import { useState } from 'react';



//Okay think about it, does it matter to the snake what the pieces are? like knight or some crap, I think its concerned with itself, all pieces are P, and there is a king, K, own M, the head is H, and S is the rest of the snake, 
export function gameLogic() {
    const chess = new Chess()





    return {
        chess,
        initialFen: chess.fen(),
    };
}


export function convotoB(input: string): Number[] {
    console.log(input)
    let char = input[0]
    const input1 = char.toLowerCase().charCodeAt(0) - 97; 
    console.log (input1);

    var input2 = parseInt(input.slice(1)); 
    input2 -= 1; 
    console.log (input2);
    return [input1, input2];
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

    return c1 + i2 as Square;
}


