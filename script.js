const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUe-U9rldjDdU1QZLxgEN5yWF4TwPy8Pv1njDXzYbAj4JC2AtCEJ6brV_XYsTEyAoqvA/exec";

const form = document.getElementById("promoForm");
const resultBox = document.getElementById("result");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  resultBox.className = "";
  resultBox.style.display = "block";
  resultBox.textContent = "Mengirim data...";

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
  resultBox.textContent =
    "Berhasil disimpan!\n\n" +
    "Request ID: " + result.requestId + "\n\n" +
    JSON.stringify(result.receivedData, null, 2);
}

  } catch (error) {
    resultBox.className = "error";
    resultBox.textContent = "Gagal konek ke Apps Script: " + error.message;
  }
});
