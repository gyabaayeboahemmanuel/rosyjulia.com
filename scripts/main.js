
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
// // JSON
// let suscription = [];
// //
// const addSuscription = (ev)=> {
//     en.preventDefault();
//     let suscription = {
//         id: Date.now(),
//         name: document.getElementById("name").Value,
//         email: document.getElementById("email").Value
//     }
//     suscription.push(movie);
//     document.forms[a].reset(); // to clear the form for the next entries

//     // for display purposes only
//     console.warn("suscribed", {suscription});
//     let pre = document.querySelector [ '#msg pre'];
//     pre.textContent = '\n' + JSON.stringify(suscription, '\t', 2);
// }
// document.addEventListener('DOMContentLoaded', () =>(
//     document.getElementById('suscribe').addEventListener('click', addSuscription)
// ))
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

//Our Farms Script
function farmsfilter(){
  //Declare Variables
  var input,filter, table, tr, td, i , txtValue;
  input = document.getElementById("mysearch") ;
  filter = input.value.toUpperCase();
  table = document.getElementById("farmsTable");
  tr = table.getElementsByTagName("tr")
// Loop through all table rows, and hide those who don't match the search query
for (i = 0; i < tr.length; i++) {
  td = tr[i].getElementsByTagName("td")[0];
  if (td) {
    txtValue = td.textContent || td.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
}

