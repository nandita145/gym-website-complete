function openNav() {
    document.getElementById("mobile__menu").style.width = "100%";
}

function closeNav() {
    document.getElementById("mobile__menu").style.width = "0";
}

// $(document).ready(function () {
//     $('.radio').click(function () {
//         document.getElementById('price').innerHTML = $(this).val();
//     });

// });

function checkRadio(value) {
    if(value == "1"){
    // console.log("Choice: ", value);
        // document.getElementById("one-variable-equations").checked = true;
        // document.getElementById("multiple-variable-equations").checked = false;
        document.getElementById("price-checkout").innerHTML = 'Rs. 4900 only';
        document.getElementById("price-checkout-input").value = 4900;
        // return 4900;
    } else if (value == "6"){
        document.getElementById("price-checkout").innerHTML = 'Rs. 7900 only';
        document.getElementById("price-checkout-input").value = 7900;
    }else if (value == "12"){
        document.getElementById("price-checkout").innerHTML = 'Rs. 9900 only';
        document.getElementById("price-checkout-input").value = 9900;
    }
}

function matchPassword() {  
  var pw1 = document.getElementById("pswd1");  
  var pw2 = document.getElementById("pswd2");  
  // console.log(pw1)
  // console.log(pw2)
  // if(pw1 !== pw2)  
  // {   
  //   alert("Passwords do not match");  
  // } else {  
  //   alert("SignUp successful");  
  // }  
}  




function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
  }




// const signUpButton = document.getElementById('signUp');
// const signInButton = document.getElementById('signIn');
// const container = document.getElementById('container');

// signUpButton.addEventListener('click', () => {
// 	container.classList.add("right-panel-active");
// });

// signInButton.addEventListener('click', () => {
// 	container.classList.remove("right-panel-active");
// });



    
    
// $('.counter').counterUp({
//     delay: 10,
//     time: 2000
// });
// $('.counter').addClass('animated fadeInDownBig');
// $('h3').addClass('animated fadeIn');






