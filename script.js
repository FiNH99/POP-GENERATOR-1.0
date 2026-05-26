const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUe-U9rldjDdU1QZLxgEN5yWF4TwPy8Pv1njDXzYbAj4JC2AtCEJ6brV_XYsTEyAoqvA/exec";

const form = document.getElementById("promoForm");
const resultBox = document.getElementById("result");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  resultBox.className = "";
  resultBox.style.display = "block";
  resultBox.textContent = "Sedang generate PDF...";

  const data = {
    brand: document.getElementById("brand").value,
    deskripsi: document.getElementById("deskripsi").value,
    hargaNormal: document.getElementById("hargaNormal").value,
    hargaPromo: document.getElementById("hargaPromo").value,
    periode: document.getElementById("periode").value,
    layout: document.getElementById("layout").value
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.status === "success") {
      resultBox.className = "success";
      resultBox.innerHTML = `
        <strong>PDF berhasil dibuat!</strong><br><br>
        Request ID: ${result.requestId}<br>
        File: ${result.fileName}<br><br>
        <a href="${result.pdfUrl}" target="_blank">Buka PDF</a>
      `;
    } else {
      resultBox.className = "error";
      resultBox.textContent = "Error: " + result.message;
    }

  } catch (error) {
    resultBox.className = "error";
    resultBox.textContent = "Gagal generate PDF: " + error.message;
  }
});
