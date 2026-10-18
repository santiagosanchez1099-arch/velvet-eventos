/* Welcome, optional synthesized ambience and a gentle testimonial carousel. */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let audio = null,
    master = null,
    notesTimer = null,
    active = false,
    working = false;
  const soundButton = document.createElement("button");
  soundButton.type = "button";
  soundButton.className = "ambient-control";
  soundButton.id = "ambientToggle";
  soundButton.setAttribute("aria-pressed", "false");
  soundButton.innerHTML = "♪ <span>Activar ambiente</span>";
  document
    .querySelector(".hero-bottom")
    .insertBefore(soundButton, document.querySelector(".hero-bottom a"));
  function paintAudio() {
    soundButton.setAttribute("aria-pressed", String(active));
    soundButton.innerHTML = active
      ? "♫ <span>Silenciar ambiente</span>"
      : "♪ <span>Activar ambiente</span>";
  }
  async function stop() {
    if (working) return;
    working = true;
    soundButton.disabled = true;
    clearInterval(notesTimer);
    notesTimer = null;
    if (audio) {
      const current = audio;
      audio = null;
      try {
        if (current.state === "running") {
          master.gain.setTargetAtTime(0, current.currentTime, 0.05);
          await new Promise((r) => setTimeout(r, 160));
        }
        await current.close();
      } catch {}
    }
    active = false;
    Demo.state.ambienceEnabled = false;
    Demo.save();
    paintAudio();
    working = false;
    soundButton.disabled = false;
  }
  async function start() {
    if (active || working) return;
    working = true;
    soundButton.disabled = true;
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw Error("unsupported");
      audio = new Context();
      await audio.resume();
      master = audio.createGain();
      master.gain.value = 0.055;
      master.connect(audio.destination);
      [130.81, 164.81, 196].forEach((frequency, i) => {
        const osc = audio.createOscillator(),
          gain = audio.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.value = 0.13;
        osc.connect(gain);
        gain.connect(master);
        osc.start();
      });
      let step = 0;
      const melody = [
        523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880, 659.25,
      ];
      const chime = () => {
        if (!audio || audio.state !== "running") return;
        const now = audio.currentTime,
          osc = audio.createOscillator(),
          gain = audio.createGain();
        osc.type = "sine";
        osc.frequency.value = melody[step++ % melody.length];
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.7);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 3);
      };
      chime();
      notesTimer = setInterval(chime, 3200);
      active = true;
      Demo.state.ambienceEnabled = true;
      Demo.save();
      paintAudio();
    } catch {
      if (audio) {
        audio.close().catch(() => {});
        audio = null;
      }
      Demo.toast(
        "No se pudo activar el sonido. Inténtalo de nuevo desde el botón de ambiente.",
      );
    } finally {
      working = false;
      soundButton.disabled = false;
    }
  }
  soundButton.onclick = () => {
    if (!working) active ? stop() : start();
  };
  document.addEventListener("visibilitychange", () => {
    if (!audio || !active) return;
    if (document.hidden) audio.suspend().catch(() => {});
    else
      audio.resume().catch(() => {
        active = false;
        paintAudio();
      });
  });
  window.VelvetAmbience = { start, stop, isPlaying: () => active };
  {
    const welcome = document.createElement("dialog");
    welcome.id = "welcomeDialog";
    welcome.className = "welcome-dialog";
    welcome.setAttribute("aria-labelledby", "welcomeTitle");
    welcome.innerHTML = `<div class="welcome-confetti" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<i style="--i:${i};--left:${(i * 37) % 100}%">${i % 3 ? "✦" : "❋"}</i>`).join("")}</div><button class="welcome-skip" id="skipWelcome" aria-label="Saltar bienvenida">Saltar ×</button><p class="eyebrow">BIENVENIDO A VELVET STUDIO</p><div class="welcome-emblem" aria-hidden="true">✦</div><h2 id="welcomeTitle">Que empiece<br><em>la magia.</em></h2><p>De pequeños cumpleaños a grandes historias.<br>Tu próxima celebración comienza aquí.</p><div class="button-row"><button class="button" id="enterWelcome">Explorar el estudio ↗</button><button class="button outline" id="enterWithAudio">Entrar con ambiente ♪</button></div><small>La bienvenida se cierra automáticamente. El sonido solo se activa si lo eliges.</small>`;
    document.body.append(welcome);
    let closing = false;
    const dismiss = () => {
      if (closing) return;
      closing = true;
      clearTimeout(timer);
      welcome.close();
      welcome.remove();
    };
    const timer = setTimeout(dismiss, reduced.matches ? 1800 : 4200);
    document.getElementById("skipWelcome").onclick = dismiss;
    document.getElementById("enterWelcome").onclick = dismiss;
    document.getElementById("enterWithAudio").onclick = () => {
      start();
      dismiss();
    };
    welcome.addEventListener("cancel", (e) => {
      e.preventDefault();
      dismiss();
    });
    welcome.showModal();
  }
  const section = document.querySelector(".testimonials"),
    grid = section.querySelector(".review-grid"),
    reviews = [...grid.children];
  let reviewIndex = 0;
  section.classList.add("reviews-soft");
  grid.classList.add("reviews-track");
  grid.setAttribute("aria-label", "Opiniones de clientes de demostración");
  reviews.forEach((card, i) => {
    card.setAttribute("role", "group");
    card.setAttribute("aria-label", `Opinión ${i + 1} de ${reviews.length}`);
    card.tabIndex = 0;
    const avatar = document.createElement("div");
    avatar.className = "review-avatar";
    avatar.textContent = ["LA", "VM", "CR"][i];
    avatar.setAttribute("aria-hidden", "true");
    card.prepend(avatar);
  });
  const controls = document.createElement("div");
  controls.className = "review-controls";
  controls.innerHTML = `<button class="review-arrow" id="previousReview" aria-label="Opinión anterior">←</button><div class="review-dots">${reviews.map((r, i) => `<button data-review="${i}" aria-label="Ver opinión ${i + 1}" ${i === 0 ? 'aria-current="true"' : ""}></button>`).join("")}</div><button class="review-arrow" id="nextReview" aria-label="Opinión siguiente">→</button>`;
  section.append(controls);
  function mark() {
    controls.querySelectorAll("[data-review]").forEach((b) => {
      if (Number(b.dataset.review) === reviewIndex)
        b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  }
  function show(index) {
    reviewIndex = (index + reviews.length) % reviews.length;
    grid.scrollTo({
      left: reviews[reviewIndex].offsetLeft - grid.offsetLeft,
      behavior: reduced.matches ? "instant" : "smooth",
    });
    mark();
  }
  document.getElementById("previousReview").onclick = () =>
    show(reviewIndex - 1);
  document.getElementById("nextReview").onclick = () => show(reviewIndex + 1);
  controls
    .querySelectorAll("[data-review]")
    .forEach((b) => (b.onclick = () => show(Number(b.dataset.review))));
  grid.addEventListener(
    "scroll",
    () => {
      reviewIndex = Math.max(
        0,
        Math.min(
          reviews.length - 1,
          Math.round(grid.scrollLeft / grid.clientWidth),
        ),
      );
      mark();
    },
    { passive: true },
  );
  grid.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      show(reviewIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(reviewIndex - 1);
    }
  });
})();
