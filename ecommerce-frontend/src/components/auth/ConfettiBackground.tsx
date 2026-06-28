import { useEffect, useRef } from 'react';

export function ConfettiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#ff7a00', '#ffb68b', '#95ccff', '#00a8ff', '#fd8b18'];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      decay: number;
      angle: number;
      spin: number;

      constructor() {
        this.x = canvas!.width / 2;
        this.y = canvas!.height / 2 + 50;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 1) * 15;
        this.size = Math.random() * 8 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 10;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // gravity
        this.life -= this.decay;
        this.angle += this.spin;
      }
      
      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate((this.angle * Math.PI) / 180);
        ctx!.globalAlpha = Math.max(0, this.life);
        ctx!.fillStyle = this.color;
        ctx!.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx!.restore();
      }
    }

    // Burst initial particles with stagger
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        particles.push(new Particle());
      }, Math.random() * 300);
    }

    let animationFrameId: number;
    
    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0 || particles[i].y > canvas!.height) {
          particles.splice(i, 1);
          i--;
        }
      }
      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    // Delay animation slightly to sync with checkmark
    const timeoutId = setTimeout(() => {
      animate();
    }, 300);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      id="confetti-canvas"
    />
  );
}
