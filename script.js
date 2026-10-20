const STORAGE_KEY = "street_tag_products_v1";

const originalProducts = [
  {
    id: 1, name: "DTagZz Signature", category: "Jacket",
    price: 499000, color: "Black / Grey / Purple",
    description: "Oversized hiphop jacket với graphic DTagZz, panel phản quang và utility pocket.",
    image: "assets/a_clean_product_style_design_board_lookbook_coll.png",
    pos: "center center"
  },
  {
    id: 2, name: "Realize Jacket", category: "Jacket",
    price: 499000, color: "Black",
    description: "Form oversized màu đen, piping tương phản và graphic Realize ở mặt lưng.",
    image: "assets/Cl02/CL02.png",
    pos: "left top"
  },
  {
    id: 3, name: "Rough Jacket", category: "Jacket",
    price: 529000, color: "Cream / Green",
    description: "Thiết kế color-block mạnh, logo Rough và tinh thần street culture.",
    image: "assets/Cl03/CL03.png",
    pos: "right top"
  },
  {
    id: 4, name: "Denim Hiphop", category: "Denim",
    price: 979000, color: "Washed Black",
    description: "Denim bụi bặm với graphic lớn, phù hợp outfit hiphop cổ điển pha hiện đại.",
    image: "assets/Cl04/CL04.png",
    pos: "left bottom"
  },
  {
    id: 5, name: "Night Puffer", category: "Puffer",
    price: 1099000, color: "Black",
    description: "Puffer oversized, giữ nhiệt tốt, graphic mặt lưng và chi tiết phản quang.",
    image: "assets/Cl05/CL05.png",
    pos: "center bottom"
  },
  {
    id: 6, name: "Camo Chaos", category: "Utility",
    price: 999000, color: "Camo / Beige",
    description: "Họa tiết camo kết hợp graphic graffiti, tạo vẻ phóng khoáng và khác biệt.",
    image: "assets/Cl06/CL06.png",
    pos: "right bottom"
  }
];

let products = loadProducts();

function loadProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : structuredClone(originalProducts);
  } catch {
    return structuredClone(originalProducts);
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫";
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const sort = document.getElementById("sortSelect").value;

  let list = products.filter(p =>
    `${p.name} ${p.category} ${p.color} ${p.description}`.toLowerCase().includes(query)
  );

  if (sort === "priceAsc") list.sort((a,b) => a.price - b.price);
  if (sort === "priceDesc") list.sort((a,b) => b.price - a.price);
  if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name));

  grid.innerHTML = list.map((p, i) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}"
             style="object-position:${escapeAttr(p.pos || "center")}" />
        <span class="product-index">${String(i + 1).padStart(2, "0")}</span>
      </div>
      <div class="product-info">
        <span class="product-cat">${escapeHtml(p.category)} / ${escapeHtml(p.color)}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description || "")}</p>
        <div class="product-bottom">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="view-btn" onclick="openDetail(${p.id})">XEM CHI TIẾT →</button>
        </div>
      </div>
    </article>
  `).join("");

  empty.classList.toggle("hidden", list.length !== 0);
  document.getElementById("productCount").textContent = products.length;
  renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById("adminList");
  list.innerHTML = products.map(p => `
    <div class="admin-row">
      <div class="admin-row-info">
        <strong>${escapeHtml(p.name)}</strong>
        <span>${formatPrice(p.price)} · ${escapeHtml(p.category)}</span>
      </div>
      <button class="delete-btn" onclick="deleteProduct(${p.id})">XOÁ</button>
    </div>
  `).join("");
}

function openDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById("detailContent").innerHTML = `
    <div class="detail-layout">
      <div class="detail-image">
        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}"
             style="object-position:${escapeAttr(p.pos || "center")}" />
      </div>
      <div class="detail-copy">
        <span class="eyebrow">${escapeHtml(p.category)} / ${escapeHtml(p.color)}</span>
        <h2>${escapeHtml(p.name)}</h2>
        <p>${escapeHtml(p.description || "Thiết kế streetwear độc quyền.")}</p>
        <div class="detail-price">${formatPrice(p.price)}</div>
      </div>
    </div>
  `;
  document.getElementById("detailModal").classList.remove("hidden");
}

function deleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Xoá "${p.name}" khỏi danh sách?`)) return;
  products = products.filter(x => x.id !== id);
  saveProducts();
  renderProducts();
}

function openAdmin() {
  document.getElementById("adminModal").classList.remove("hidden");
  renderAdminList();
}

function closeModal(which) {
  document.getElementById(which === "admin" ? "adminModal" : "detailModal").classList.add("hidden");
}

document.getElementById("openAdmin").addEventListener("click", openAdmin);
document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("sortSelect").addEventListener("change", renderProducts);

document.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", () => closeModal(el.dataset.close));
});

document.getElementById("productForm").addEventListener("submit", e => {
  e.preventDefault();

  const newProduct = {
    id: Date.now(),
    name: document.getElementById("name").value.trim(),
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    color: document.getElementById("color").value.trim(),
    description: document.getElementById("description").value.trim() || "Thiết kế streetwear mới.",
    image: document.getElementById("image").value.trim() || "assets/a_clean_product_style_design_board_lookbook_coll.png",
    pos: "center center"
  };

  products.unshift(newProduct);
  saveProducts();
  renderProducts();
  e.target.reset();
  alert("Đã thêm sản phẩm.");
});

document.getElementById("resetProducts").addEventListener("click", () => {
  if (!confirm("Khôi phục lại 6 sản phẩm gốc?")) return;
  products = structuredClone(originalProducts);
  saveProducts();
  renderProducts();
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}
function escapeAttr(value) { return escapeHtml(value); }

renderProducts();
