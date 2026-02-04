const header = document.querySelector(".site-header");

const setHeaderState = () => {
  if (!header) {
    return;
  }
  header.classList.toggle("is-scrolled", window.scrollY > 40);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState);

const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const accordionTriggers = document.querySelectorAll(".accordion__trigger");
accordionTriggers.forEach((trigger) => {
  const item = trigger.closest(".accordion__item");
  const panel = item.querySelector(".accordion__panel");
  const expanded = trigger.getAttribute("aria-expanded") === "true";
  panel.setAttribute("aria-hidden", String(!expanded));
  panel.style.maxHeight = expanded ? `${panel.scrollHeight}px` : "0px";

  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";

    trigger.setAttribute("aria-expanded", String(!expanded));
    item.classList.toggle("is-open", !expanded);
    panel.setAttribute("aria-hidden", String(expanded));

    if (!expanded) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    } else {
      panel.style.maxHeight = "0px";
    }
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      trigger.click();
    }
  });
});

const lightboxItems = Array.from(document.querySelectorAll("[data-lightbox]"));
if (lightboxItems.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox__content">
      <div class="lightbox__media">
        <img src="" alt="" />
      </div>
      <div class="lightbox__controls">
        <button class="lightbox__btn" data-lightbox-prev type="button">Previous</button>
        <span class="lightbox__caption"></span>
        <button class="lightbox__btn" data-lightbox-next type="button">Next</button>
        <button class="lightbox__btn" data-lightbox-close type="button">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".lightbox__caption");
  let currentIndex = 0;

  const updateLightbox = (index) => {
    const item = lightboxItems[index];
    if (!item) {
      return;
    }
    const img = item.querySelector("img");
    const src = item.getAttribute("href") || img?.getAttribute("src");
    const alt = img?.getAttribute("alt") || "Gallery image";
    const dataCaption = item.getAttribute("data-caption");
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    caption.textContent = dataCaption || alt;
  };

  const openLightbox = (index) => {
    currentIndex = index;
    updateLightbox(currentIndex);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % lightboxItems.length;
    updateLightbox(currentIndex);
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightbox(currentIndex);
  };

  lightboxItems.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(index);
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lightbox-next]").addEventListener("click", showNext);
  lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", showPrev);

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
    }
    if (event.key === "ArrowRight") {
      showNext();
    }
    if (event.key === "ArrowLeft") {
      showPrev();
    }
  });
}
