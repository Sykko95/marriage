// ===== Proposal logic =====
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const buttonArea = document.getElementById("buttonArea");
const proposalCard = document.getElementById("proposalCard");
const countdownCard = document.getElementById("countdownCard");

let escapeCount = 0;
let yesScale = 1;

function moveNoButton() {
    const areaRect = buttonArea.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = areaRect.width - btnRect.width;
    const maxY = areaRect.height - btnRect.height;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.bottom = `unset`;
    noBtn.style.position = `absolute`;
    escapeCount++;
    yesScale += 0.12;
    yesBtn.style.transform = `scale(${yesScale})`;

    if (escapeCount >= 50) {
        noBtn.textContent = "Desisto 😭";
    }
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton);
yesBtn.addEventListener("click", () => {
    proposalCard.classList.add("hidden");
    countdownCard.classList.remove("hidden");
    startConfetti();
});

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const confetti = [];

function startConfetti() {
    for (let i = 0; i < 200; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: -20,
            r: Math.random() * 6 + 4,
            d: Math.random() * 100,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            tilt: Math.random() * 10
        });
    }
    requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.y += Math.cos(p.d) + 3;
        p.x += Math.sin(p.d);
    });

    if (confetti.some(p => p.y < canvas.height)) {
        requestAnimationFrame(updateConfetti);
    }
}

function timeUntil(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);

    let months =
        (target.getFullYear() - now.getFullYear()) * 12 +
        (target.getMonth() - now.getMonth());

    let days = target.getDate() - now.getDate();

    if (days < 0) {
        months--;
        const daysInPrevMonth = new Date(
            target.getFullYear(),
            target.getMonth(),
            0
        ).getDate();
        days += daysInPrevMonth;
    }

    // If time-of-day already passed, borrow 1 day
    if (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() > target.getHours() * 3600 + target.getMinutes() * 60 + target.getSeconds()) {
        days--;
        if (days < 0) {
            months--;

            const prevMonth = new Date(
                target.getFullYear(),
                target.getMonth() - 1,
                0
            );

            days = prevMonth.getDate();
        }
    };

    const refDate = new Date(now);
    refDate.setMonth(refDate.getMonth() + months);
    refDate.setDate(refDate.getDate() + days);

    let diffMs = target - refDate;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs %= 1000 * 60 * 60;

    const minutes = Math.floor(diffMs / (1000 * 60));
    diffMs %= 1000 * 60;

    const seconds = Math.floor(diffMs / 1000);

    return { months, days, hours, minutes, seconds };
}

function plural(v, s, p) {
    return v === 1 ? s : p;
}

function updateCountdown() {
    const r = timeUntil("2026-07-25T16:30:00.000-03:00");
    document.getElementById("countdown").innerHTML = `
        ${r.months} ${plural(r.months, "mês", "meses")}<br>
        ${r.days} ${plural(r.days, "dia", "dias")}<br>
        ${r.hours} ${plural(r.hours, "hora", "horas")}<br>
        ${r.minutes} ${plural(r.minutes, "minuto", "minutos")}<br>
        ${r.seconds} ${plural(r.seconds, "segundo", "segundos")}
    `;
}

updateCountdown();

setInterval(updateCountdown, 1000);
