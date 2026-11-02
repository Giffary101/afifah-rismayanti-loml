/**
 * Animasi Partikel Ambient - Kelopak Sakura & Hati Melayang
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ambientParticles = [];
  const burstParticles = [];
  const TOTAL_AMBIENT = 35;

  const colors = [
    'rgba(255, 140, 198, 0.7)',  // Love Pink #ff8cc6
    'rgba(232, 93, 158, 0.65)', // Deep Rose #e85d9e
    'rgba(255, 194, 223, 0.75)', // Soft Blossom
    'rgba(255, 209, 102, 0.6)',  // Warm Gold
    'rgba(255, 230, 240, 0.85)'  // Pale Blush
  ];

  class AmbientPetal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.sin(Math.random() * 50) * 0.8;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.isHeart = Math.random() > 0.65;
      this.opacity = Math.random() * 0.6 + 0.3;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015) * 0.8 + this.speedX * 0.3;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        drawMiniHeart(ctx, 0, 0, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class BurstParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2.5;
      this.size = Math.random() * 9 + 5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.isHeart = Math.random() > 0.4;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.012;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.12;
      this.vx *= 0.98;
      this.rotation += this.rotationSpeed;
      this.alpha -= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;

      if (this.isHeart) {
        drawMiniHeart(ctx, 0, 0, this.size * 0.7);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawMiniHeart(context, x, y, size) {
    context.beginPath();
    const topCurveHeight = size * 0.3;
    context.moveTo(x, y + topCurveHeight);
    context.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    context.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    context.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    context.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    context.closePath();
    context.fill();
  }

  function createBurstParticles(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
      burstParticles.push(new BurstParticle(x, y));
    }
  }

  // Inisialisasi
  for (let i = 0; i < TOTAL_AMBIENT; i++) {
    const petal = new AmbientPetal();
    petal.y = Math.random() * height;
    ambientParticles.push(petal);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    ambientParticles.forEach((petal) => {
      petal.update();
      petal.draw();
    });

    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const p = burstParticles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) {
        burstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Ekspor fungsi trigger partikel burst
  window.createBurstParticles = createBurstParticles;
});
