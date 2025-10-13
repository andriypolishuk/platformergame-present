const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 800;

const targetFPS = 60;
const frameDuration = 1000 / targetFPS;

let level = 1;
let isLevelChanging = false;

const acceleration = 1200;   // Плавний розгін
const maxSpeed = 500;         // Максимальна швидкість
const friction = 0.8;
const player = {
    x: 50, y: 700, width: 30, height: 30,
    dx: 0, dy: 0, speed: 7, gravity: 2000, jumpPower: -800, onGround: false
};

// Платформи
let levels = {
    1: [
        { x: 0, y: 750, width: 1400, height: 50 },
    ],
    2: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 1200, y: 650, width: 100, height: 20 },
    ],
    3: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 250, y: 650, width: 150, height: 20 },
        { x: 500, y: 550, width: 150, height: 20 },
        { x: 800, y: 450, width: 150, height: 20 },
        { x: 1100, y: 350, width: 150, height: 20 }
    ],
    4: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 100, y: 650, width: 100, height: 20 },
        { x: 300, y: 550, width: 100, height: 20 },
        { x: 600, y: 450, width: 100, height: 20 },
        { x: 900, y: 350, width: 100, height: 20 },
        { x: 1200, y: 250, width: 100, height: 20 }
    ],
    5: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 300, y: 650, width: 100, height: 20 },
        { x: 600, y: 550, width: 100, height: 20 },
        { x: 900, y: 450, width: 100, height: 20 },
        { x: 1200, y: 350, width: 100, height: 20 },
        { x: 1000, y: 250, width: 100, height: 20 },
        { x: 800, y: 200, width: 100, height: 20 }
    ],
    6: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 1200, y: 650, width: 100, height: 20 },
        { x: 900, y: 550, width: 100, height: 20 },
        { x: 600, y: 450, width: 100, height: 20 },
        { x: 300, y: 350, width: 150, height: 20 },
        { x: 500, y: 220, width: 100, height: 20 },
        { x: 850, y: 250, width: 100, height: 20 },
        { x: 1300, y: 300, width: 100, height: 20 },
    ],
    7: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 200, y: 650, width: 50, height: 20 },
        { x: 400, y: 550, width: 50, height: 20 },
        { x: 700, y: 450, width: 50, height: 20 },
        { x: 0, y: 300, width: 520, height: 50 },
        { x: 750, y: 200, width: 50, height: 20 },
        { x: 1100, y: 200, width: 50, height: 20 },
        { x: 1350, y: 150, width: 50, height: 20 }
    ],
    8: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 0, y: 650, width: 300, height: 20 },
        { x: 100, y: 550, width: 350, height: 20 },
        { x: 150, y: 500, width: 250, height: 20 },
        { x: 150, y: 400, width: 20, height: 100 },
        { x: 0, y: 400, width: 150, height: 20 },
        { x: 50, y: 480, width: 50, height: 30 },
        { x: 40, y: 440, width: 10, height: 10 },
        { x: 100, y: 440, width: 10, height: 10 },
        { x: 110, y: 420, width: 40, height: 10 },
        { x: 780, y: 600, width: 10, height: 10 },
        { x: 430, y: 570, width: 20, height: 125 },
        { x: 450, y: 675, width: 650, height: 20 },
        { x: 1100, y: 550, width: 10, height: 10 },
        { x: 1320, y: 410, width: 30, height: 340 },
        { x: 1100, y: 600, width: 220, height: 20 },
        { x: 1100, y: 620, width: 20, height: 75 },
        { x: 1175, y: 700, width: 100, height: 10 },
        { x: 1165, y: 675, width: 10, height: 10 },
        { x: 1275, y: 675, width: 10, height: 10 },
        { x: 1000, y: 350, width: 30, height: 20 },
        { x: 650, y: 350, width: 30, height: 20 },
        { x: 350, y: 300, width: 30, height: 20 },
        { x: 0, y: 250, width: 200, height: 20 },
        { x: 200, y: 150, width: 1200, height: 20 },
        { x: 300, y: 100, width: 1000, height: 20 },
        { x: 1360, y: 60, width: 20, height: 90 },
        { x: 400, y: 40, width: 980, height: 20 },
        { x: 300, y: 0, width: 20, height: 100 },

    ],
    9: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 200, y: 650, width: 100, height: 20 },
        { x: 400, y: 550, width: 100, height: 20 },
        { x: 600, y: 450, width: 100, height: 20 },
        { x: 800, y: 350, width: 100, height: 20 },
        { x: 1000, y: 250, width: 100, height: 20 },  
    ],
    10: [
        { x: 0, y: 750, width: 1400, height: 50 },
        { x: 100, y: 600, width: 200, height: 20 },
        { x: 400, y: 500, width: 150, height: 20 },
        { x: 700, y: 400, width: 150, height: 20 },
        { x: 1000, y: 300, width: 150, height: 20 },
        { x: 1200, y: 200, width: 150, height: 20 },
    ],


};
let finishlevel = {
    1: [
        { x: 1380, y: 600, width: 20, height: 150 },
    ],
    2: [
        { x: 1380, y: 400, width: 20, height: 150 },
    ],
    3: [
        { x: 1200, y: 200, width: 20, height: 150 }
    ],
    4: [
        { x: 1280, y: 100, width: 20, height: 150 }
    ],
    5: [
        { x: 800, y: 50, width: 20, height: 150 }
    ],
    6: [
        { x: 1380, y: 150, width: 20, height: 150 }
    ],
    7: [  // новий фініш для 4-го рівня
        { x: 1380, y: 0, width: 20, height: 150 }
    ],

    8: [  // новий фініш для 5-го рівня
        { x: 1380, y: 0, width: 20, height: 150 }
    ],
    9: [
        { x: 1200, y: 100, width: 20, height: 150 }
    ],
    10: [
        { x: 1360, y: 0, width: 20, height: 150 }
    ]

};
let shiplevel = {
    1: [
        { x: 700, y: 725 },
    ],
    2: [
        { x: 400, y: 725 },
        { x: 1000, y: 725 },
    ],
    3: [
        { x: 550, y: 725 },
        { x: 600, y: 725 },
        { x: 650, y: 725 }
    ],
    4: [
        { x: 300, y: 525 },
        { x: 900, y: 325 }
    ],
    5: [
        { x: 600, y: 525 },
        { x: 1200, y: 325 }
    ],
    6: [
        { x: 300, y: 325 },
        { x: 1275, y: 625 },
    ],
    7: [
        { x: 175, y: 725 },
        { x: 200, y: 725 },
        { x: 225, y: 725 },
        { x: 250, y: 725 },
        { x: 275, y: 725 },
        { x: 300, y: 725 },
        { x: 325, y: 725 },
        { x: 350, y: 725 },
        { x: 375, y: 725 },
        { x: 400, y: 725 },
        { x: 425, y: 725 },
        { x: 450, y: 725 },
        { x: 475, y: 725 },
        { x: 500, y: 725 },
        { x: 525, y: 725 },
        { x: 550, y: 725 },
        { x: 575, y: 725 },
        { x: 600, y: 725 },
        { x: 625, y: 725 },
        { x: 650, y: 725 },
        { x: 675, y: 725 },
        { x: 700, y: 725 },
        { x: 725, y: 725 },
        { x: 750, y: 725 },
        { x: 775, y: 725 },
        { x: 800, y: 725 },
        { x: 825, y: 725 },
        { x: 850, y: 725 },
        { x: 875, y: 725 },
        { x: 900, y: 725 },
        { x: 925, y: 725 },
        { x: 950, y: 725 },
        { x: 975, y: 725 },
        { x: 1000, y: 725 },
        { x: 1025, y: 725 },
        { x: 1050, y: 725 },
        { x: 1075, y: 725 },
        { x: 1100, y: 725 },
        { x: 1125, y: 725 },
        { x: 1150, y: 725 },
        { x: 1175, y: 725 },
        { x: 1200, y: 725 },
        { x: 1225, y: 725 },
        { x: 1250, y: 725 },
        { x: 1275, y: 725 },
        { x: 1300, y: 725 },
        { x: 1325, y: 725 },
        { x: 1350, y: 725 },
        { x: 1375, y: 725 },
        { x: 400, y: 275 },
    ],
    8: [  // нові шипи для 5-го рівня
        { x: 450, y: 650 },
        { x: 475, y: 650 },
        { x: 500, y: 650 },
        { x: 525, y: 650 },
        { x: 550, y: 650 },
        { x: 575, y: 650 },
        { x: 600, y: 650 },
        { x: 625, y: 650 },
        { x: 650, y: 650 },
        { x: 675, y: 650 },
        { x: 700, y: 650 },
        { x: 725, y: 650 },
        { x: 750, y: 650 },
        { x: 775, y: 650 },
        { x: 800, y: 650 },
        { x: 825, y: 650 },
        { x: 850, y: 650 },
        { x: 875, y: 650 },
        { x: 900, y: 650 },
        { x: 925, y: 650 },
        { x: 950, y: 650 },
        { x: 975, y: 650 },
        { x: 1000, y: 650 },
        { x: 1025, y: 650 },
        { x: 1050, y: 650 },
        { x: 1075, y: 650 },
        { x: 1350, y: 725 },
        { x: 1375, y: 725 },
        { x: 1100, y: 575 },
        { x: 1130, y: 575 },
        { x: 1160, y: 575 },
        { x: 1190, y: 575 },
        { x: 1220, y: 575 },
        { x: 1250, y: 575 },
        { x: 1280, y: 575 },

    ],
    9: [
        { x: 500, y: 725 },
        { x: 520, y: 725 },
        { x: 540, y: 725 },
    ],
    10: [
        { x: 250, y: 580 },
        { x: 260, y: 580 },
        { x: 270, y: 580 },
        { x: 1000, y: 280 },
        { x: 1020, y: 280 },
    ],

};
let colors = {
    1: [
        { plat: 'grey', background: 'rgb(189, 189, 189)', ship: 'black' }
    ],
    2: [
        { plat: 'grey', background: 'rgb(189, 189, 189)', ship: 'black' }
    ],
    3: [
        { plat: 'blue', background: 'lightblue', ship: 'blue' }
    ],
    4: [  // новий колір для 4-го рівня
        { plat: 'blue', background: 'lightblue', ship: 'blue' }
    ],
    5: [  // новий колір для 5-го рівня
        { plat: 'rgb(6, 177, 0)', background: 'rgb(130, 255, 125)', ship: 'rgb(9, 75, 0)' }
    ],
    6: [
        { plat: 'purple', background: 'rgb(200, 150, 255)', ship: 'purple' }
    ],
    7: [
        { plat: 'red', background: 'rgb(255, 100, 100)', ship: 'darkred' }
    ],
    8: [
        { plat: 'orange', background: 'rgb(255, 200, 100)', ship: 'darkorange' }
    ],
    9: [
        { plat: 'navy', background: 'lightcyan', ship: 'blue' }  
    ],
    10: [
        { plat: 'darkgreen', background: '#ccffcc', ship: 'darkred' }
    ],
};

let platforms = levels[level]

function changeLevel(newLevel) {
    if (level == 8) {
        alert('Перемога!')
    }
    if (levels[newLevel]) {
        level = newLevel;
        level += 1;
        player.x = 50;
        player.y = 700;
        platforms = levels[level];
    }
}


















function changeLevel(newLevel) {
    if (level == 8) {
        alert('Перемога!')
    }
    if (levels[newLevel]) {
        level = newLevel;
        level += 1;
        player.x = 50;
        player.y = 700;
        platforms = levels[level];
    }
}

function update(deltaTime) {
    if (!deltaTime) return;

    player.x += player.dx * deltaTime;
    player.y += player.dy * deltaTime;

    // Гравітація
    player.dy += player.gravity * deltaTime;

    // Плавний розгін при натисканні клавіші (тільки якщо гравець на платформі)
    if (keys.right && player.onGround) {
        player.dx += acceleration * deltaTime;  // Рух вправо
    }
    if (keys.left && player.onGround) {
        player.dx -= acceleration * deltaTime;  // Рух вліво
    }
    // Стрибок (тільки якщо гравець на землі)
    if (keys.up && player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;

    }
    if (player.dy > 0) {
        player.onGround = false;
    }

    // Обмеження максимальної швидкості
    if (player.dx > maxSpeed) player.dx = maxSpeed;
    if (player.dx < -maxSpeed) player.dx = -maxSpeed;

    // Зменшення швидкості за допомогою тертя, якщо клавіша не натиснута
    if (!keys.right && !keys.left) {
        player.dx *= Math.pow(friction, deltaTime * 60);
    }
    if (keys.next && !isLevelChanging) {
        isLevelChanging = true; // Встановлюємо прапор, щоб уникнути кількох спроб змінити рівень
        setTimeout(function () {
            if (keys.next === true) {
                console.log('next level');
                changeLevel(level); // Зміна рівня
            }
            isLevelChanging = false; // Скидаємо прапор після затримки
        }, 1000); // Затримка 1 секунда
    }

    // Перевірка меж
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    // Колізія з платформами
    platforms.forEach(p => {
        // Ліва сторона
        if (player.x + player.width >= p.x && player.x + player.width < p.x + 7 &&
            player.y + player.height > p.y + 1 && player.y < p.y + p.height) {
            if (player.x + player.width > p.x && player.y + player.height > p.y + 1 && player.y < p.y + p.height) {
                player.x = p.x - player.width;
                if (player.dx > 0) player.dx = 0;
            }
            if (player.x < 0) player.x = 0;
        }

        // Права сторона
        if (player.x <= p.x + p.width && player.x > p.x + p.width - 7 &&
            player.y + player.height > p.y + 1 && player.y < p.y + p.height) {
            if (player.x < p.x + p.width && player.y + player.height > p.y + 1 && player.y < p.y + p.height) {
                player.x = p.x + p.width;
                if (player.dx < 0) player.dx = 0;
            }
            if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
        }

        // Зверху (стрибок на платформу)
        if (player.y + player.height > p.y - 1 &&
            player.y + player.height <= p.y + player.dy * deltaTime &&   // <-- ось тут
            player.x + player.width > p.x && player.x < p.x + p.width) {
            player.y = p.y - player.height;
            player.dy = 0;
            player.onGround = true;
        }

        // Знизу (удар головою)
        if (player.y <= p.y + p.height && player.y > p.y &&
            player.x + player.width > p.x && player.x < p.x + p.width) {
            if (player.y < p.y + p.height) {
                player.y = p.y + p.height;
                player.dy = 0;
                player.onGround = false;
            }
        }

        if (player.y < 0) {
            player.dy = 0;
            player.y = 0;
        }
    });






    //Прехід на наступний левел
    if (player.x + player.width > finishlevel[level][0].x &&
        player.x < finishlevel[level][0].x + finishlevel[level][0].width &&
        player.y < finishlevel[level][0].y + finishlevel[level][0].height &&
        player.y > finishlevel[level][0].y) {
        changeLevel(level);
    }

    // Скидання гравця, якщо він вийшов за межі екрану
    if (player.y > canvas.height) player.y = 300;
}














function isPointInTriangle(px, py, triangle) {
    const x1 = triangle[0].x, y1 = triangle[0].y;
    const x2 = triangle[1].x, y2 = triangle[1].y;
    const x3 = triangle[2].x, y3 = triangle[2].y;

    const areaOrig = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    const area1 = Math.abs((px * (y2 - y3) + x2 * (y3 - py) + x3 * (py - y2)) / 2);
    const area2 = Math.abs((x1 * (py - y3) + px * (y3 - y1) + x3 * (y1 - py)) / 2);
    const area3 = Math.abs((x1 * (y2 - py) + x2 * (py - y1) + px * (y1 - y2)) / 2);

    return (area1 + area2 + area3 === areaOrig);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Платформи
    if (levels[level][0] != null) {
        ctx.fillStyle = colors[level][0].plat;
        platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
    }
    // Фініши
    if (finishlevel[level][0] != null) {
        ctx.fillStyle = "yellow";
        finishlevel[level].forEach(f => ctx.fillRect(f.x, f.y, f.width, f.height));
    }
    if (shiplevel[level][0] != null) {
        // Малюємо трикутники з масиву finishlevel
        shiplevel[level].forEach(t => {
            const triangle = [
                { x: t.x, y: t.y + 25 },   // Перша точка
                { x: t.x + 25, y: t.y + 25 }, // Друга точка
                { x: t.x + 12.5, y: t.y }     // Третя точка
            ];

            // Малюємо трикутник
            ctx.fillStyle = colors[level][0].ship;
            ctx.beginPath();
            ctx.moveTo(t.x, t.y + 25);  // Початкова точка
            ctx.lineTo(t.x + 25, t.y + 25);  // Друга точка
            ctx.lineTo(t.x + 12.5, t.y);   // Третя точка
            ctx.closePath();       // Закриваємо шлях
            ctx.fill();

            // Перевірка, чи точка гравця знаходиться всередині трикутника
            const playerCorners = [
                { x: player.x, y: player.y },  // Верхній лівий кут
                { x: player.x + player.width, y: player.y },  // Верхній правий кут
                { x: player.x, y: player.y + player.height },  // Нижній лівий кут
                { x: player.x + player.width, y: player.y + player.height }  // Нижній правий кут
            ];

            let isPlayerInside = false;

            // Перевіряємо кожну точку гравця
            for (let corner of playerCorners) {
                if (isPointInTriangle(corner.x, corner.y, triangle)) {
                    isPlayerInside = true;
                    break;
                }
            }

            // Якщо хоча б одна точка гравця всередині трикутника
            if (isPlayerInside) {
                player.x = 50;
                player.y = 700; // Переміщуємо гравця
            }
        });
    }

    // Гравець
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop(timestamp) {
    let deltaTime = (timestamp - lastTime) / 1000; // Конвертуємо у секунди
    lastTime = timestamp;

    canvas.style.background = colors[level][0].background;
    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
    // console.log(level, player.x, player.y, player.dx, player.dy);
}
let lastTime = 0
let deltaTime = 0

let keys = {
    right: false,
    left: false,
    up: false,
    next: false
};

// Обробка натискання клавіші
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase(); // Перетворюємо натиснуту клавішу на малу літеру
    if (key === "d") keys.right = true;
    if (key === "a") keys.left = true;
    if (key === "w") keys.up = true;
    if (key === "n") keys.next = true
});

// Обробка відпускання клавіші
document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase(); // Перетворюємо натиснуту клавішу на малу літеру
    if (key === "d") keys.right = false;
    if (key === "a") keys.left = false;
    if (key === "w") keys.up = false;
    if (key === "n") keys.next = false
});

gameLoop();

