/* Bad Company — landing page interactions */

/* Chrome Web Store listing — swap in the real extension ID before launch */
const CHROME_WEB_STORE_URL =
  "https://chromewebstore.google.com/detail/bad-company/REPLACE_WITH_EXTENSION_ID";

document.querySelectorAll(".js-cta").forEach((el) => {
  el.href = CHROME_WEB_STORE_URL;
});

/* Scroll reveal */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* Report panel: collapsible Summary section */
document.querySelectorAll("[data-toggle]").forEach((btn) => {
  const body = document.getElementById(btn.dataset.toggle);
  if (!body) return;
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    body.classList.toggle("collapsed", expanded);
  });
});

/* Report panel: thumbs are a toy — one can be "voted" at a time */
const thumbs = document.querySelectorAll(".thumb");
thumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const wasVoted = thumb.classList.contains("voted");
    thumbs.forEach((t) => t.classList.remove("voted"));
    if (!wasVoted) thumb.classList.add("voted");
  });
});
