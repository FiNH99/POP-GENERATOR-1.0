const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUe-U9rldjDdU1QZLxgEN5yWF4TwPy8Pv1njDXzYbAj4JC2AtCEJ6brV_XYsTEyAoqvA/exec";

const form = document.getElementById("promoForm");
const layoutSelect = document.getElementById("layout");
const productsContainer = document.getElementById("productsContainer");
const resultBox = document.getElementById("result");
const submitButton = form.querySelector("button");

const responseText = await response.text();

let result;
try {
  result = JSON.parse(responseText);
} catch (err) {
  throw new Error("Backend tidak mengirim JSON. Cek URL Apps Script / permission / deployment. Isi respons: " + responseText.substring(0, 150));
}

function document.addEventListener("DOMContentLoaded", function () {
  renderProductForms();
});
  const totalProducts = Number(layoutSelect.value);
  productsContainer.innerHTML = "";

  for (let i = 1; i <= totalProducts; i++) {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h3>Produk ${i}</h3>

      <label>Brand</label>
      <input type="text" id="brand${i}" placeholder="Contoh: SWEET C" required>

      <label>Deskripsi</label>
      <input type="text" id="deskripsi${i}" placeholder="Contoh: Jeruk Manis Premium" required>

      <div class="grid-2">
        <div>
          <label>Harga Normal</label>
          <input type="text" id="hargaNormal${i}" placeholder="Contoh: 25.000" required>
        </div>

        <div>
          <label>Harga Promo</label>
          <input type="text" id="hargaPromo${i}" placeholder="Contoh: 19.900" required>
        </div>
      </div>
    `;

    productsContainer.appendChild(card);
  }
}

layoutSelect.addEventListener("change", renderProductForms);

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const layout = layoutSelect.value;
  const totalProducts = Number(layout);

  const products = [];

  for (let i = 1; i <= totalProducts; i++) {
    products.push({
      brand: document.getElementById(`brand${i}`).value,
      deskripsi: document.getElementById(`deskripsi${i}`).value,
      hargaNormal: document.getElementById(`hargaNormal${i}`).value,
      hargaPromo: document.getElementById(`hargaPromo${i}`).value
    });
  }

  const data = {
    layout: layout,
    periode: document.getElementById("periode").value,
    products: products,

    // Cadangan supaya backend lama tetap bisa baca produk pertama
    brand: products[0]?.brand || "",
    deskripsi: products[0]?.deskripsi || "",
    hargaNormal: products[0]?.hargaNormal || "",
    hargaPromo: products[0]?.hargaPromo || ""
  };

  resultBox.className = "";
  resultBox.style.display = "block";
  resultBox.textContent = "Sedang generate PDF...";

  submitButton.disabled = true;
  submitButton.textContent = "Memproses...";

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

  submitButton.disabled = false;
  submitButton.textContent = "Generate PDF";
});

renderProductForms();
