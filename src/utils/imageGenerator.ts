import { Faculty } from '../types';

export async function generateInvitationImage(faculty: Faculty): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Failed to create canvas context'));
    }

    // High resolution card dimensions (1200 x 1600 px)
    canvas.width = 1200;
    canvas.height = 1600;

    // Background Gradient (Dark Cyber Velvet)
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 1600);
    bgGradient.addColorStop(0, '#040711');
    bgGradient.addColorStop(0.5, '#0d1322');
    bgGradient.addColorStop(1, '#060913');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 1600);

    // Decorative Futuristic Grid & Borders
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1600);
      ctx.stroke();
    }
    for (let y = 0; y < 1600; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Outer Glow Border
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1120, 1520);

    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 1100, 1500);

    // Header Tag
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING', 600, 120);

    // Main Title: B!T-C 2K26
    ctx.fillStyle = '#00f0ff';
    ctx.font = '900 90px Orbitron, sans-serif';
    ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
    ctx.shadowBlur = 30;
    ctx.fillText('B!T-C 2K26', 600, 230);
    ctx.shadowBlur = 0;

    // Subtitle: INVITATION
    ctx.fillStyle = '#ff007f';
    ctx.font = '700 48px Cinzel, serif';
    ctx.letterSpacing = '8px';
    ctx.fillText('EXCLUSIVE FACULTY INVITATION', 600, 310);

    // Draw Faculty Photo (or Avatar placeholder if blank)
    const drawContentAfterPhoto = () => {
      // Photo frame glow
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(470, 360, 260, 260);

      ctx.strokeStyle = '#ff007f';
      ctx.strokeRect(460, 350, 280, 280);

      // Faculty Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 44px Inter, sans-serif';
      ctx.fillText(faculty.name, 600, 685);

      // Faculty Designation
      ctx.fillStyle = '#00f0ff';
      ctx.font = '600 26px Inter, sans-serif';
      ctx.fillText(faculty.designation || 'Faculty Member', 600, 725);

      // Divider line
      const lineGradient = ctx.createLinearGradient(300, 0, 900, 0);
      lineGradient.addColorStop(0, 'transparent');
      lineGradient.addColorStop(0.5, '#00f0ff');
      lineGradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(300, 755);
      ctx.lineTo(900, 755);
      ctx.stroke();

      // Developer Invitation Message (Word Wrapped)
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '400 32px Inter, sans-serif';
      ctx.textAlign = 'center';

      const lines = faculty.invitationMessage.split('\n');
      let currentY = 820;

      lines.forEach((line) => {
        const words = line.split(' ');
        let currentLine = '';

        words.forEach((word) => {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 900 && currentLine !== '') {
            ctx.fillText(currentLine.trim(), 600, currentY);
            currentLine = word + ' ';
            currentY += 48;
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine.trim() !== '') {
          ctx.fillText(currentLine.trim(), 600, currentY);
          currentY += 48;
        } else {
          currentY += 24; // empty line spacing
        }
      });

      // Footer
      ctx.fillStyle = '#00f0ff';
      ctx.font = '700 28px Orbitron, sans-serif';
      ctx.fillText('B!T-C 2K26 SYSTEM', 600, 1500);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas blob generation failed'));
      }, 'image/png');
    };

    if (faculty.photo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(470, 360, 260, 260);
        ctx.clip();
        ctx.drawImage(img, 470, 360, 260, 260);
        ctx.restore();
        drawContentAfterPhoto();
      };
      img.onerror = () => {
        // Fallback default avatar box
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(470, 360, 260, 260);
        ctx.fillStyle = '#00f0ff';
        ctx.font = '900 80px Orbitron, sans-serif';
        ctx.fillText(faculty.name.charAt(0).toUpperCase(), 600, 520);
        drawContentAfterPhoto();
      };
      img.src = faculty.photo;
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(470, 360, 260, 260);
      ctx.fillStyle = '#00f0ff';
      ctx.font = '900 80px Orbitron, sans-serif';
      ctx.fillText(faculty.name.charAt(0).toUpperCase(), 600, 520);
      drawContentAfterPhoto();
    }
  });
}
