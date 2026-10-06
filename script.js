const weddingDate = new Date("December 10, 2026 19:00:00").getTime();

const $ = (selector) => document.querySelector(selector);

// Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loader").classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }, 700);
});

document.body.classList.add("no-scroll");

// Countdown
function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  if (distance <= 0) {
    $("#days").textContent = "00";
    $("#hours").textContent = "00";
    $("#minutes").textContent = "00";
    $("#seconds").textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  $("#days").textContent = String(days).padStart(2, "0");
  $("#hours").textContent = String(hours).padStart(2, "0");
  $("#minutes").textContent = String(minutes).padStart(2, "0");
  $("#seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Music
const music = $("#weddingMusic");
const musicBtn = $("#musicBtn");

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicBtn.innerHTML = '<span class="music-icon">Ⅱ</span>';
    } catch (error) {
      alert("Add your wedding.mp3 file inside the music folder first.");
    }
  } else {
    music.pause();
    musicBtn.innerHTML = '<span class="music-icon">♪</span>';
  }
});

// Share
$("#shareBtn").addEventListener("click", async () => {
  const shareData = {
    title: "Uday & Priya — Wedding Invitation",
    text: "You are invited to celebrate our special day. ♡",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (_) {}
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Invitation link copied!");
    } catch (_) {
      alert("Copy this page URL and share it with your guests.");
    }
  }
});

// RSVP
$("#rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#guestName").value.trim();
  const attendance = document.querySelector('input[name="attendance"]:checked');

  if (!name || !attendance) return;

  $("#formSuccess").classList.add("show");

  // Demo behavior:
  // To make this a real full-stack RSVP, connect this form
  // to your Node.js/Express/MongoDB backend.
  event.target.reset();

  setTimeout(() => {
    $("#formSuccess").scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
});

// Gallery lightbox
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");

document.querySelectorAll(".gallery-item img").forEach((image) => {
  image.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    document.body.classList.add("no-scroll");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

$("#lightboxClose").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});


// Premium scratch-to-reveal card
const scratchCanvas = $("#scratchCanvas");
const scratchCard = $("#scratchCard");
const scratchHint = $("#scratchHint");
const scratchPercent = $("#scratchPercent");
const scratchReset = $("#scratchReset");

if (scratchCanvas && scratchCard) {
  const ctx = scratchCanvas.getContext("2d", { willReadFrequently: true });
  let drawing = false;
  let lastPoint = null;
  let revealed = false;

  function sizeScratchCanvas() {
    const rect = scratchCard.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    scratchCanvas.width = Math.round(rect.width * dpr);
    scratchCanvas.height = Math.round(rect.height * dpr);
    scratchCanvas.style.width = rect.width + "px";
    scratchCanvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintScratchLayer(rect.width, rect.height);
  }

  function paintScratchLayer(w, h) {
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#b99555");
    gradient.addColorStop(.5, "#d8b979");
    gradient.addColorStop(1, "#a77d3f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Elegant foil-like pattern
    for (let x = -h; x < w + h; x += 24) {
      ctx.strokeStyle = "rgba(255,255,255,.10)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(74,45,52,.25)";
    ctx.font = "600 11px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "2px";
    ctx.fillText("LOVE • LUCK • CELEBRATION", w / 2, h / 2 + 52);

    ctx.globalCompositeOperation = "destination-out";
  }

  function getPoint(event) {
    const rect = scratchCanvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top
    };
  }

  function scratchAt(point) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 42;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    if (lastPoint) {
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
    } else {
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + .1, point.y + .1);
    }
    ctx.stroke();
    lastPoint = point;

    scratchHint.classList.add("hide");
    updateScratchPercent();
  }

  function startScratch(event) {
    event.preventDefault();
    drawing = true;
    lastPoint = getPoint(event);
    scratchAt(lastPoint);
  }

  function moveScratch(event) {
    if (!drawing) return;
    event.preventDefault();
    scratchAt(getPoint(event));
  }

  function endScratch() {
    drawing = false;
    lastPoint = null;
  }

  function updateScratchPercent() {
    const rect = scratchCard.getBoundingClientRect();
    const sampleW = 100;
    const sampleH = Math.max(60, Math.round(sampleW * rect.height / rect.width));
    const pixels = ctx.getImageData(
      0, 0,
      Math.min(scratchCanvas.width, sampleW),
      Math.min(scratchCanvas.height, sampleH)
    ).data;

    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 90) transparent++;
    }
    const total = pixels.length / 4;
    const percent = Math.min(100, Math.round((transparent / total) * 100));
    scratchPercent.textContent = percent + "%";

    if (percent > 62 && !revealed) {
      revealed = true;
      ctx.clearRect(0, 0, rect.width, rect.height);
      scratchPercent.textContent = "100%";
    }
  }

  function resetScratch() {
    revealed = false;
    scratchHint.classList.remove("hide");
    scratchPercent.textContent = "0%";
    const rect = scratchCard.getBoundingClientRect();
    paintScratchLayer(rect.width, rect.height);
  }

  scratchCanvas.addEventListener("mousedown", startScratch);
  scratchCanvas.addEventListener("mousemove", moveScratch);
  window.addEventListener("mouseup", endScratch);
  scratchCanvas.addEventListener("touchstart", startScratch, { passive: false });
  scratchCanvas.addEventListener("touchmove", moveScratch, { passive: false });
  scratchCanvas.addEventListener("touchend", endScratch);
  scratchReset.addEventListener("click", resetScratch);
  window.addEventListener("resize", sizeScratchCanvas);

  setTimeout(sizeScratchCanvas, 100);
}

/* Premium scratch interaction */
(()=>{const c=document.getElementById('scratchCanvas'),card=document.getElementById('scratchCard'),hint=document.getElementById('scratchHint'),bar=document.getElementById('scratchBar'),pct=document.getElementById('scratchPct'),reset=document.getElementById('scratchReset');if(!c)return;const x=c.getContext('2d',{willReadFrequently:true});let down=false,done=false;function init(){let r=card.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=r.width*d;c.height=r.height*d;x.setTransform(d,0,0,d,0,0);let g=x.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#8c5d30');g.addColorStop(.5,'#d6ae64');g.addColorStop(1,'#81512b');x.globalCompositeOperation='source-over';x.fillStyle=g;x.fillRect(0,0,r.width,r.height);for(let i=0;i<100;i++){x.fillStyle='rgba(255,255,255,.1)';x.beginPath();x.arc(Math.random()*r.width,Math.random()*r.height,Math.random()*1.5,0,7);x.fill()}x.globalCompositeOperation='destination-out';hint.style.opacity=1;bar.style.width='0%';pct.textContent='0% revealed';done=false}function pos(e){let r=c.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return{x:p.clientX-r.left,y:p.clientY-r.top}}function draw(e){if(!down)return;e.preventDefault();let p=pos(e);x.beginPath();x.arc(p.x,p.y,24,0,7);x.fill();let d=x.getImageData(0,0,c.width,c.height).data,n=0;for(let i=3;i<d.length;i+=16)if(d[i]===0)n++;let q=Math.min(100,Math.round(n/(d.length/16)*100));bar.style.width=q+'%';pct.textContent=q+'% revealed';if(q>=55&&!done){done=true;hint.style.opacity=0;}}c.onmousedown=e=>{down=true;draw(e)};c.onmousemove=draw;onmouseup=()=>down=false;c.ontouchstart=e=>{down=true;draw(e)};c.ontouchmove=draw;c.ontouchend=()=>down=false;reset.onclick=init;onresize=()=>setTimeout(init,100);init()})();
