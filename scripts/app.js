// Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const  cartOverlay = document.querySelector(".cart-overlay");
const  cartItems = document.querySelector(".cart-items");
const  cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const  productsDOM = document.querySelector(".products-center");
const  carouselDOM = document.querySelector(".track");

// Login variable
let logDatabase = [];
let Login = [];
// cart
let cart = [];
//buttons
let buttonsDOM = [];

// getting the products
class Products {
    async getProducts(){
        try{
            let result = await fetch("products.json");
            let data = await result.json(); 

            let products = data.items;
            products = products.map(item =>{
                const {title,price} = item.fields;
                const {id} = item.sys
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image}
            })
            return products;
        } catch (error) {
            console.log(error);
            
        }
    }
}
 
// display products
class UI {
    displayProducts(products){
        let result = '';
        products.forEach (product => {
            result += `
        <!-- Single product -->  
            <article class="product">
            <div id="prod-container" >
                <div class="img-container">
                    <img src="${product.image}" alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to Cart
                    </button>
                </div>
            <h3>${product.title}</h3>
            <h4>GH₵ ${product.price}</h4>
            </div>
    </article>
    <!--end of single product -->
            
            `;
        });
        productsDOM.innerHTML = result;
    

       let carousel = '';
       products.forEach ( product => {
           carousel += `
           <!-- Single Carousel -->
          
           <div class="card-container">
             <div class="card">
               <div class="img img-container"><img  src="${product.image}" alt="product" class="product-img">
                   <button class="bag-btn" data-id=${product.id}>
                       <i class="fas fa-shopping-cart"></i>
                       add to Cart
                   </button></div>
               <div class="info" style="text-align:center;">
                   <h3>${product.title}</h3>
                   <h4>GH₵ ${product.price}</h4>
               </div>
             </div>
           </div>
           <!-- End of single Carousel -->`
       });
       carouselDOM.innerHTML = carousel;
    }

   getBagButtons() {
       const buttons = [...document.querySelectorAll(".bag-btn")];
       buttonsDOM = buttons;
       buttons.forEach( button =>{
           let id = button.dataset.id;
        //    console.log(id);
           let inCart = cart.find(item => item.id === id);
           if( inCart){
               button.innerHTML = " In Cart";
               buttons.disabled = true;
           }
           
               button.addEventListener('click', event => {
                   event.target.innerText = "In Cart";
                   event.target.disabled = true;
                   // get product from products
                   let cartItem = {...Storage.getProduct(id), amount:1};
                  
                   // add product to the cart
                   cart = [...cart, cartItem];
                   
                   // save cart in local storage
                   Storage.saveCart(cart);
                   // set cart value
                   this.setCartValues(cart);
                   // display cart item
                   this.addCartItem(cartItem);
                   // show the cart 
                   this.showCart();
               });
              
             
       })

   }
   setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
    });
    cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
    cartItems.innerHTML = itemsTotal;
    // console.log(cartTotal, cartItems);
}   
addCartItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
    <!-- cart item -->
           
                <img src="${item.image}" alt="product">
                <div>
                    <h4>${item.title}</h4>
                    <h5>GH₵ ${item.price}</h5>
                    <span class="remove-item" data-id = ${item.id}> &nbsp remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id = ${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id =  ${item.id}></i>
                </div>
           
            <!-- end of cart item -->
    `
    cartContent.appendChild(div);
}
showCart(){   cartDOM.classList.add('showCart');
     cartOverlay.classList.add('transparentBcg')};
setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart) ;
        closeCartBtn.addEventListener('click',this.hideCart) ;
        
        
};
populateCart(cart){
    cart.forEach(item => this.addCartItem(item));
}
hideCart(){cartDOM.classList.remove('showCart');
 cartOverlay.classList.remove('transparentBcg')}
cartLogic(){
     //clear cart button
     clearCartBtn.addEventListener('click',()=> {this.clearCart();
     });
     // cart functionality
     cartContent.addEventListener('click', event =>{
         if(event.target.classList.contains('remove-item'))
         {
             let removeItem = event.target;
             let id = removeItem.dataset.id;
             cartContent.removeChild(removeItem.parentElement.parentElement);
             this.removeItem(id);
         }
         else if (event.target.classList.contains("fa-chevron-up")){
            let addAmount = event.target;
            let id = addAmount.dataset.id;
            let tempItem = cart.find(item => item.id === id);
         tempItem.amount = tempItem.amount + 1;
            Storage.saveCart(cart);
            this.setCartValues(cart);
            addAmount.nextElementSibling.innerHTML = tempItem.amount;
         }
         else if (event.target.classList.contains("fa-chevron-down")) {
            let lowerAmount = event.target;
            let id = lowerAmount.dataset.id;
            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount - 1;
            if (tempItem.amount > 0) {
              Storage.saveCart(cart);
              this.setCartValues(cart);
              lowerAmount.previousElementSibling.innerText = tempItem.amount;
            } else {
              cartContent.removeChild(lowerAmount.parentElement.parentElement);
              this.removeItem(id);
            }
         }
         
        
     });
 } 

 clearCart (){
     let cartItems = cart.map(item => item.id);
     cartItems.forEach(id => this.removeItem(id));
    //  console.log (cartContent);
     while(cartContent.children.length > 0){
         cartContent.removeChild(cartContent.children[0]);
         
     }
     this.hideCart();
 } 
 removeItem(id){
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = ` <i class="fas fa-shopping-cart"></i> add to cart`;
 }
 getSingleButton(id){
     return buttonsDOM.find(button => button.dataset.id === id);
 }

}



// local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse (localStorage.getItem('products'));
        return products.find(product =>  product.id === id)
    }
    static saveCart (cart){
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')):[];
    }
    static getUsername(){
        return localStorage.getUsername('Login')? JSON.parse(localStorage.getUsername('Login')):[];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP();
    // get all products
    products.getProducts().then(products => {ui.displayProducts(products);
    Storage.saveProducts(products);

    })
   .then(() => {
       ui.getBagButtons();
       ui.cartLogic();
   });
   
});
 
// Search Filter
function productfilter(){
    //Declare Variables
    var input,filter, table, tr, td, i , txtValue;
    input = document.getElementById("mysearch") ;
    filter = input.value.toUpperCase();
    table = document.getElementById("produ");
    tr = table.getElementsByTagName("article")
 // Loop through all table rows, and hide those who don't match the search query
 for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("h3")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
        document.getElementById("noResult").style.display = "block"
      }
    }
  }
}
   

// LOGIN OR SIGN UP

function login(){cartDOM.classList.remove('showCart');
cartOverlay.classList.remove('transparentBcg');
document.getElementById('id01').style.display='block';
document.getElementById('deliver').style.display='block';
};
function signup(){
    document.getElementById("geky-signup").style.display='block';
    document.getElementById("geky-login").style.display='none';
}
function login2(){
    document.getElementById("geky-signup").style.display='none';
    document.getElementById("geky-login").style.display='block';
}
function myLogOut() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    popup.innerHTML = " Signed Out Sucessfully";
    document.getElementById('login-btn').innerHTML = "Log In";
    document.getElementById('userName').innerHTML = ""
    let buttons = document.getElementById('login-btn');
    buttons.disabled = false;
    document.getElementById('logout').style.display = "none";
    document.getElementById('deliver').style.display = "none";
    closeNav();
    document.getElementById('payment').innerHTML ="Proceed to check-out";
     document.getElementById('payment').innerHTML =  `
     <span class="check-out banner-btn " style="color: white;" id="payment" onclick="login()">Proceed to check-out</span>
     `;
    
  }
const addUser = (ev) =>{
    ev.preventDefault(); // to stop the form from submitting
    let userData = {
        id: Date.now(),
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        repassword: document.getElementById('repassword').value
    }
    logDatabase.push(userData); 
    console.warn('signed Up', {logDatabase});
    
    // Saving database to local storage
    localStorage.setItem("userDatabase", JSON.stringify(logDatabase));
}

document.getElementById("userSignup").addEventListener('click', addUser);

const getUser = (ev) =>{
    ev.preventDefault(); // to stop the form from submitting
    let userLog = {
        email: document.getElementById('logemail').value,
        password: document.getElementById('logpassword').value,
    }
    Login.push(userLog); 
    console.warn('Logedin', {Login});
  document.getElementById('userName').innerHTML = userLog.email;
  document.getElementById('login-btn').innerHTML = "Logged In";
  document.getElementById('payment').onclick = '';
   let buttons = document.getElementById('login-btn');
    buttons.disabled = true;
  document.getElementById('logout').style.display = '';

  document.getElementById('paypal-button-container').style.display = "block";
  document.getElementById('id01').style.display='none';
  document.getElementById('payment').style.display='none';
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
  popup.innerHTML = "Welcome back, " + userLog.email 
// Saving database to local storage
localStorage.setItem("userLogin", JSON.stringify(Login));
}

document.getElementById("userLogin").addEventListener('click', getUser);

// DELIVERY DETAILS
function delivery(){
    cartDOM.classList.remove('showCart');
cartOverlay.classList.remove('transparentBcg');
    document.getElementById("delivery").style.display = "block";
}
const addDetails = (ev) =>{
    ev.preventDefault(); // to stop the form from submitting
    let delivery = {
        country: document.getElementById('country').value,
        region : document.getElementById('region').value,
        town: document.getElementById('town').value,
        houseAddress: document.getElementById('houseAddress').value,
        phoneNumber: document.getElementById('phoneNumber').value
    }
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    popup.innerHTML = "Details Saved Successfully";
    logDatabase.push(delivery); 
    console.warn('Delivery Details Added', {logDatabase});

    document.getElementById('delivery').style.display='none'

// Saving database to local storage
localStorage.setItem("userDatabase", JSON.stringify(logDatabase));
}
document.getElementById("submitDetail").addEventListener('click', addDetails);


//POPUP
function myPop() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
    
  }
  

// SIDE NAV
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}



//Corrosel
const prev  = document.querySelector('.prev');
const next = document.querySelector('.next');

const track = document.querySelector('.track');

let carouselWidth = document.querySelector('.carousel-container').offsetWidth;

window.addEventListener('resize', () => {
  carouselWidth = document.querySelector('.carousel-container').offsetWidth;
})

let index = 0;

next.addEventListener('click', () => {
  index++;
  prev.classList.add('show');
  track.style.transform = `translateX(-${index * carouselWidth}px)`;
  
  if (track.offsetWidth - (index * carouselWidth) < carouselWidth) {
    next.classList.add('hide');
  }
})

prev.addEventListener('click', () => {
  index--;
  next.classList.remove('hide');
  if (index === 0) {
    prev.classList.remove('show');
  }
  track.style.transform = `translateX(-${index * carouselWidth}px)`;
})

// The slide Show
var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 3000); // Change image every 3 seconds
}