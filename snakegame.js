const game = document.getElementById("game");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");


const size = 20;
const cell = 20;


let snake = [
    {x:10,y:10},
    {x:9,y:10},
    {x:8,y:10},
    {x:7,y:10}
];


let food = {
    x:5,
    y:5
};


let direction = "right";
let nextDirection = "right";


let score = 0;

let running = true;


let lastMove = 0;

const speed = 120;



// ============================
// DESENHO COMPLETO
// ============================

function draw(){

    game.innerHTML="";


    let svg=document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );


    svg.setAttribute("width","400");
    svg.setAttribute("height","400");

    svg.style.position="absolute";



    // ============================
    // COMIDA
    // ============================

    let foodCircle=document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );


    foodCircle.setAttribute(
        "cx",
        food.x*cell+10
    );


    foodCircle.setAttribute(
        "cy",
        food.y*cell+10
    );


    foodCircle.setAttribute(
        "r",
        "8"
    );


    foodCircle.setAttribute(
        "fill",
        "#ff3030"
    );


    svg.appendChild(foodCircle);





    // ============================
    // CORPO CONTÍNUO
    // ============================


    let body=document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );


    let path="";


    snake.forEach((p,index)=>{

        let x=p.x*cell+10;
        let y=p.y*cell+10;


        if(index===0){

            path+=`M ${x} ${y}`;

        }else{

            path+=` L ${x} ${y}`;

        }

    });



    body.setAttribute("d",path);


    body.setAttribute(
        "fill",
        "none"
    );


    body.setAttribute(
        "stroke",
        "#55ff00"
    );


    body.setAttribute(
        "stroke-width",
        "18"
    );


    body.setAttribute(
        "stroke-linecap",
        "round"
    );


    body.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(body);





    // ============================
    // CABEÇA RETANGULAR CARTOON
    // ============================


    let head = snake[0];


    let hx=head.x*cell+10;
    let hy=head.y*cell+10;



    let headShape=document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );


    let headWidth=34;
    let headHeight=24;



    headShape.setAttribute(
        "x",
        hx-headWidth/2
    );


    headShape.setAttribute(
        "y",
        hy-headHeight/2
    );


    headShape.setAttribute(
        "width",
        headWidth
    );


    headShape.setAttribute(
        "height",
        headHeight
    );


    headShape.setAttribute(
        "rx",
        "12"
    );


    headShape.setAttribute(
        "ry",
        "12"
    );


    headShape.setAttribute(
        "fill",
        "#7dff35"
    );



    let rotation=0;


    if(direction==="right")
        rotation=0;

    if(direction==="down")
        rotation=90;

    if(direction==="left")
        rotation=180;

    if(direction==="up")
        rotation=270;



    headShape.setAttribute(
        "transform",
        `rotate(${rotation} ${hx} ${hy})`
    );


    svg.appendChild(headShape);





    // ============================
    // OLHOS
    // ============================


    let eyes=[];


    if(direction==="right"){

        eyes=[
            [hx+8,hy-6],
            [hx+8,hy+6]
        ];

    }


    if(direction==="left"){

        eyes=[
            [hx-8,hy-6],
            [hx-8,hy+6]
        ];

    }


    if(direction==="up"){

        eyes=[
            [hx-6,hy-8],
            [hx+6,hy-8]
        ];

    }


    if(direction==="down"){

        eyes=[
            [hx-6,hy+8],
            [hx+6,hy+8]
        ];

    }



    eyes.forEach(e=>{


        let eye=document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


        eye.setAttribute("cx",e[0]);

        eye.setAttribute("cy",e[1]);

        eye.setAttribute("r","3");

        eye.setAttribute(
            "fill",
            "black"
        );


        svg.appendChild(eye);


    });






    // ============================
    // LÍNGUA RETA + BIFURCADA
    // ============================


    let tongue=document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );


    let tonguePath="";


    if(direction==="right"){

        tonguePath=
        `
        M ${hx+17} ${hy}
        L ${hx+35} ${hy}
        M ${hx+35} ${hy}
        L ${hx+42} ${hy-5}
        M ${hx+35} ${hy}
        L ${hx+42} ${hy+5}
        `;

    }



    if(direction==="left"){

        tonguePath=
        `
        M ${hx-17} ${hy}
        L ${hx-35} ${hy}
        M ${hx-35} ${hy}
        L ${hx-42} ${hy-5}
        M ${hx-35} ${hy}
        L ${hx-42} ${hy+5}
        `;

    }



    if(direction==="up"){

        tonguePath=
        `
        M ${hx} ${hy-17}
        L ${hx} ${hy-35}
        M ${hx} ${hy-35}
        L ${hx-5} ${hy-42}
        M ${hx} ${hy-35}
        L ${hx+5} ${hy-42}
        `;

    }



    if(direction==="down"){

        tonguePath=
        `
        M ${hx} ${hy+17}
        L ${hx} ${hy+35}
        M ${hx} ${hy+35}
        L ${hx-5} ${hy+42}
        M ${hx} ${hy+35}
        L ${hx+5} ${hy+42}
        `;

    }



    tongue.setAttribute(
        "d",
        tonguePath
    );


    tongue.setAttribute(
        "stroke",
        "#ff416c"
    );


    tongue.setAttribute(
        "stroke-width",
        "3"
    );


    tongue.setAttribute(
        "fill",
        "none"
    );


    tongue.setAttribute(
        "stroke-linecap",
        "round"
    );


    svg.appendChild(tongue);



    game.appendChild(svg);

}






// ============================
// MOVIMENTO
// ============================


function update(){


    direction=nextDirection;



    let head={
        ...snake[0]
    };



    if(direction==="right")
        head.x++;


    if(direction==="left")
        head.x--;


    if(direction==="up")
        head.y--;


    if(direction==="down")
        head.y++;




    if(
        head.x<0 ||
        head.y<0 ||
        head.x>=size ||
        head.y>=size
    ){

        endGame();
        return;

    }




    // CORREÇÃO DO BUG DE COLISÃO

    for(
        let i=0;
        i<snake.length-1;
        i++
    ){

        if(
            snake[i].x===head.x &&
            snake[i].y===head.y
        ){

            endGame();
            return;

        }

    }





    snake.unshift(head);



    if(
        head.x===food.x &&
        head.y===food.y
    ){

        score++;

        scoreText.textContent=score;

        createFood();

    }
    else{

        snake.pop();

    }



    draw();


}






function loop(time){


    if(
        time-lastMove > speed &&
        running
    ){

        update();

        lastMove=time;

    }


    requestAnimationFrame(loop);

}



requestAnimationFrame(loop);







// ============================
// COMIDA
// ============================


function createFood(){


    do{


        food={

            x:Math.floor(Math.random()*size),

            y:Math.floor(Math.random()*size)

        };


    }
    while(

        snake.some(
            p=>p.x===food.x &&
            p.y===food.y
        )

    );


}






// ============================
// CONTROLES
// ============================


function changeDirection(dir){


    const opposite={

        right:"left",
        left:"right",
        up:"down",
        down:"up"

    };


    if(
        dir!==opposite[direction]
    ){

        nextDirection=dir;

    }

}




document.addEventListener(
"keydown",
e=>{


const keys={

ArrowUp:"up",
ArrowDown:"down",
ArrowLeft:"left",
ArrowRight:"right",

w:"up",
W:"up",

s:"down",
S:"down",

a:"left",
A:"left",

d:"right",
D:"right"

};


if(keys[e.key]){

    changeDirection(keys[e.key]);

}


});







function endGame(){

    running=false;

    gameOverText.style.display="block";

}





createFood();

draw();