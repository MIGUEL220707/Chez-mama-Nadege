/* =========================================================
   Chez Mama Nadège
   Interactions du restaurant : carte filtrable, panier et demande de commande WhatsApp.
   Les numéros de téléphone de démonstration doivent être remplacés.
   ========================================================= */

// Catalogue des plats : prix indicatifs à confirmer.
const products=[
{
    name:"Ndolé & plantain",desc:"Le grand classique aux feuilles de ndolé et arachides.",price:3500,cat:"Traditionnel",img:"./ndole.jpg",fallbackImg:"photo-1547592180-85f173990554"
}
,
{
    name:"Eru & water fufu",desc:"Une spécialité généreuse inspirée du Sud-Ouest.",price:3000,cat:"Traditionnel",img:"./eru.jpg",fallbackImg:"photo-1547592180-85f173990554"
}
,
{
    name:"Poulet braisé",desc:"Marinade maison, cuisson lente et accompagnement.",price:4500,cat:"Grillades",img:"./poulet-braise.jpg",fallbackImg:"photo-1555939594-58d7cb561ad1"
}
,
{
    name:"Poisson braisé",desc:"Poisson grillé, épices maison et plantain.",price:5000,cat:"Grillades",img:"./poisson-braise.jpg",fallbackImg:"photo-1519708227418-c8fd9a32b7a2"
}
,
{
    name:"Koki & macabo",desc:"Une recette traditionnelle douce et savoureuse.",price:2500,cat:"Traditionnel",img:"./koki-plantain.jpg",fallbackImg:"photo-1547592180-85f173990554"
}
,
{
    name:"Jus de foléré",desc:"Infusion fraîche d'hibiscus, légèrement acidulée.",price:1000,cat:"Boissons",img:"./jus-folere.jpg",fallbackImg:"photo-1546173159-315724a31696"
}
];
// Panier temporaire conservé pendant la visite.
let cart=[];
const money=n=>n.toLocaleString("fr-FR")+" FCFA";
const waNumber="2376XXXXXXXX";
// Accepte une image locale (images/nom.jpg), une URL complète ou un identifiant Unsplash.
function getImageUrl(image) {
    if (/^(https?:\/\/|images\/)/i.test(image)) return image;
    return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=800&q=80`;
}

// Affiche les plats selon la catégorie sélectionnée.
function render(cat = "Tous") {
    const dishesContainer = document.querySelector("#dishes");

    dishesContainer.innerHTML = products
        .filter(product => cat === "Tous" || product.cat === cat)
        .map(product => {
            const imageUrl = getImageUrl(product.img);
            const fallbackUrl = getImageUrl(product.fallbackImg || "photo-1547592180-85f173990554");

            return `
                <article class="dish">
                    <img
                        loading="lazy"
                        src="${imageUrl}"
                        alt="${product.name}"
                        onerror="this.onerror=null; this.src='${fallbackUrl}'"
                    >
                    <div class="dish-body">
                        <div class="dish-top">
                            <h3>${product.name}</h3>
                            <span class="price">${money(product.price)}</span>
                        </div>
                        <p>${product.desc}</p>
                        <button class="add" data-name="${product.name}">＋ Ajouter à ma commande</button>
                    </div>
                </article>`;
        })
        .join("");
}
document.querySelector("#filters").addEventListener("click",e=> {
    const b=e.target.closest("button[data-cat]");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render(b.dataset.cat)
}
);
document.querySelector("#dishes").addEventListener("click",e=> {
    const b=e.target.closest("[data-name]");if(!b)return;const p=products.find(x=>x.name===b.dataset.name);const found=cart.find(x=>x.name===p.name);found?found.qty++:cart.push( {
        ...p,qty:1
    }
    );document.querySelector("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);const t=document.querySelector("#toast");t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1500)
}
);
const modal=document.querySelector("#modal");
function openCart() {
    document.querySelector("#cartLines").innerHTML=cart.length?cart.map(p=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee"><span>${p.qty} × ${p.name}</span><b>${money(p.qty*p.price)}</b></div>`).join("")+`<p><b>Total estimé : ${money(cart.reduce((a,p)=>a+p.qty*p.price,0))}</b></p>`:"Votre panier est vide.";
    modal.classList.add("open")
}
document.querySelector("#cartBtn").onclick=openCart;
document.querySelector("#close").onclick=()=>modal.classList.remove("open");
modal.addEventListener("click",e=> {
    if(e.target===modal)modal.classList.remove("open")
}
);
document.querySelector("#clearCart").onclick=()=> {
    cart=[];
    document.querySelector("#cartCount").textContent="0";
    openCart()
}
;
// Prépare une demande de commande dans WhatsApp.
function sendWhatsApp(text) {
    if(waNumber.includes("679884015")) {
        alert("Configurez d'abord le numéro WhatsApp réel dans le code (variable waNumber).");
        return
    }
    window.open("https://wa.me/"+waNumber+"?text="+encodeURIComponent(text),"_blank","noopener")
}
document.querySelector("#sendOrder").onclick=()=> {
    if(!cart.length) {
        alert("Ajoutez d'abord un plat à votre commande.");
        return
    }
    const name=document.querySelector("#customer").value.trim();
    if(!name) {
        alert("Veuillez renseigner votre nom.");
        return
    }
    const delivery=document.querySelector("#delivery").value,address=document.querySelector("#address").value.trim();
    sendWhatsApp("Bonjour Chez Mama Nadège ! Je m'appelle "+name+".\nCommande :\n"+cart.map(p=>"- "+p.qty+" × "+p.name+" : "+money(p.qty*p.price)).join("\n")+"\nTotal estimé : "+money(cart.reduce((a,p)=>a+p.qty*p.price,0))+"\nMode : "+delivery+(address?"\nAdresse : "+address:""));
}
;
document.querySelector("#orderInfo").onclick=()=>sendWhatsApp("Bonjour, je souhaite obtenir des informations sur vos plats et vos horaires.");
document.querySelector("#year").textContent=new Date().getFullYear();
render();

/* Diagnostic qualité : F12 > Console indique si une photo source est trop petite.
   Ce contrôle ne modifie pas l’image ; il aide à repérer les fichiers à remplacer. */
document.addEventListener("load", function (event) {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    const renderedWidth = Math.round(image.getBoundingClientRect().width);
    const renderedHeight = Math.round(image.getBoundingClientRect().height);
    if (image.naturalWidth && (image.naturalWidth < renderedWidth || image.naturalHeight < renderedHeight)) {
        console.warn("Photo potentiellement floue : fichier source plus petit que l’affichage.", {
            fichier: image.currentSrc || image.src,
            resolutionSource: `${image.naturalWidth} × ${image.naturalHeight}`,
            tailleAffichee: `${renderedWidth} × ${renderedHeight}`
        });
    }
}, true);
