// public/js/inv-update.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("inv-update.js loaded ✅");

  const form = document.querySelector("#updateForm");
  if (!form) return;

  const updateBtn = form.querySelector("button[type='submit']");
  if (!updateBtn) return;

  // Enable button as soon as user edits something
  form.addEventListener("input", () => {
    console.log("Form input detected → enabling button");
    updateBtn.removeAttribute("disabled");
  });

  form.addEventListener("change", () => {
    console.log("Form change detected → enabling button");
    updateBtn.removeAttribute("disabled");
  });
});
