// إعداد اللعبة
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const backButton = document.getElementById("back");

// ضبط أبعاد ودقة الـ canvas لتحسين جودة الصور
canvas.width = 800; // العرض الداخلي
canvas.height = 800; // الارتفاع الداخلي
canvas.style.width = "400px"; // العرض المرئي
canvas.style.height = "400px"; // الارتفاع المرئي

// استخراج اسم الشخصية من الرابط
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const character = urlParams.get("character");

// تحميل صورة الشخصية المختارة
const characterImg = new Image();
if (character === "abdulaziz") {
  characterImg.src = "abdulaziz.png";
} else if (character === "nouf") {
  characterImg.src = "nouf.png";
} else if (character === "fatma") {
  characterImg.src = "fatma.png";
} else if (character === "alhanouf") {
  characterImg.src = "alhanouf.png";
} else if (character === "emrana") {
  characterImg.src = "emrana.png";
} else if (character === "maha") {
  characterImg.src = "maha.png";
} else if (character === "abdullah") {
  characterImg.src = "abdullah.png";
} else {
  characterImg.src = "default.png"; // صورة افتراضية إذا لم يتم اختيار شخصية
}

// تحميل صورة الهدف
const goalImg = new Image();
goalImg.src = "goal.png"; // صورة الهدف

// إعداد المتغيرات
const tileSize = 80; // حجم الخلية
const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const player = { x: 1, y: 1 }; // موقع البداية
const goal = { x: 8, y: 7 }; // موقع الهدف

// تعطيل التمويه لتحسين جودة الصور
ctx.imageSmoothingEnabled = false;

// رسم المتاهة
function drawMaze() {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      ctx.fillStyle = maze[row][col] === 1 ? "#F9560B" : "#0014FF"; // جدران برتقالية، خلفية زرقاء
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
  }

  // رسم الهدف
  ctx.drawImage(goalImg, goal.x * tileSize + 10, goal.y * tileSize + 10, tileSize - 20, tileSize - 20);
}

// رسم الشخصية
function drawPlayer() {
  ctx.drawImage(characterImg, player.x * tileSize + 10, player.y * tileSize + 10, tileSize - 20, tileSize - 20);
}

// تحديث اللعبة
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPlayer();
}

// التحكم في اللاعب
document.addEventListener("keydown", (e) => {
  let newX = player.x;
  let newY = player.y;

  switch (e.key) {
    case "ArrowUp":
      newY -= 1;
      break;
    case "ArrowDown":
      newY += 1;
      break;
    case "ArrowLeft":
      newX -= 1;
      break;
    case "ArrowRight":
      newX += 1;
      break;
  }

  // التحقق من حدود المتاهة
  if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length && maze[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    updateGame();
    checkWin();
  }
});

// التحقق من الفوز
function checkWin() {
  if (player.x === goal.x && player.y === goal.y) {
    setTimeout(() => {
      const message = document.getElementById("message");
      message.textContent = "مبروك! وصلت إلى الهدف!"; // عرض رسالة الفوز
    }, 100);
    launchFireworks(); // تشغيل الألعاب النارية
  }
}

// زر العودة للصفحة الرئيسية
backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

// الألعاب النارية
function launchFireworks() {
  const particles = [];
  const colors = ["#FF5733", "#FFC300", "#DAF7A6", "#C70039", "#900C3F"];

  function createParticle() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speedX = (Math.random() - 0.5) * 4;
    const speedY = (Math.random() - 0.5) * 4;
    particles.push({ x, y, size, color, speedX, speedY });
  }

  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.size *= 0.96; // تصغير الحجم تدريجيًا
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      if (particle.size < 0.5) {
        particles.splice(index, 1); // إزالة الجسيمات الصغيرة جدًا
      }
    });

    if (particles.length > 0) {
      requestAnimationFrame(updateParticles);
    }
  }

  for (let i = 0; i < 100; i++) {
    createParticle();
  }

  updateParticles();
}

// بدء اللعبة
goalImg.onload = () => {
  updateGame();
};
characterImg.onload = () => {
  updateGame();
};
