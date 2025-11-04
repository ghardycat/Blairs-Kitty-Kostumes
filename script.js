
const CART_KEY = "blair_cart_v1";
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||"[]"); }catch{return []} }
function saveCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); renderCart(); updateFab(); }
function addToCart(item){ const items = getCart(); const idx = items.findIndex(i=>i.id===item.id); if(idx>-1){ items[idx].qty += item.qty; } else { items.push(item); } saveCart(items); }
function removeFromCart(id){ saveCart(getCart().filter(i=>i.id!==id)); }
function updateFab(){
  const items = getCart();
  const count = items.reduce((s,i)=>s+i.qty,0);
  const fab = $(".cart-fab"); if(!fab) return;
  fab.innerText = `Cart (${count})`;
}
function currency(v){ return `$${v.toFixed(2)}`; }
function renderCart(){
  const modal = $("#cart-modal"); if(!modal) return;
  const list = modal.querySelector(".cart-list");
  const items = getCart();
  list.innerHTML = items.length? "" : "<p class='small'>Your cart is emptier than a tuna can after snack time.</p>";
  let total = 0;
  items.forEach(i=>{
    total += i.price * i.qty;
    const row = document.createElement("div");
    row.style.display="grid"; row.style.gridTemplateColumns="2fr 1fr 1fr auto"; row.style.gap="8px"; row.style.alignItems="center"; row.style.margin="6px 0";
    row.innerHTML = `<div><strong>${i.name}</strong><div class="small">${i.size||"One Size"}</div></div>
      <div>${currency(i.price)}</div>
      <div>Qty: ${i.qty}</div>
      <div><button class="close" aria-label="Remove">Remove</button></div>`;
    row.querySelector("button").addEventListener("click",()=>removeFromCart(i.id));
    list.appendChild(row);
  });
  modal.querySelector(".cart-total").innerText = currency(total);
}
function openCart(){ $("#cart-modal").classList.add("open"); renderCart(); }
function closeCart(){ $("#cart-modal").classList.remove("open"); }
document.addEventListener("DOMContentLoaded",()=>{
  updateFab();
  const fab = $(".cart-fab"); if(fab) fab.addEventListener("click", openCart);
  $$("#close-cart").forEach(btn=>btn.addEventListener("click", closeCart));
  // Product buttons
  $$(".add-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const card = btn.closest("[data-product]");
      const id = card.dataset.product;
      const name = card.querySelector(".pname").textContent.trim();
      const price = parseFloat(card.querySelector(".pprice").dataset.amount);
      const sizeSel = card.querySelector("select");
      const size = sizeSel ? sizeSel.value : "One Size";
      addToCart({id, name, price, qty:1, size});
    });
  });
});
