function itemTemplate(item){
   return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
   <span class="item-text">${item.text}</span>
   <div>
   <!-- this data-id is to include the items id from mongodb to find out which item is to be edit -->
     <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
     <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
   </div>
 </li>`
}

//Initial page loader render
let ourHTML=items.map(function(item){
    return itemTemplate(item);
}).join('');//map will return array but we want a string that's why join and we didnt want to seprate them will comma.

document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML);

//Create feature
let createField=document.getElementById("create-field"); 

document.getElementById("create-form").addEventListener("submit",function(e){
    e.preventDefault();
    axios.post("/create-item",{text:createField.value}).then(function(response){
        //a=> where u want to add the new htlm b=>
       document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data));
       createField.value="";
       createField.focus();
    }).catch(function(){
        console.log("please try again later");
    });
});

document.addEventListener("click",function(e){
    //delete feature
    if(e.target.classList.contains("delete-me")){
        //web Browser feature
        if(confirm("Do you really want to delete this item permanently?")){
            axios.post("/delete-item",{id:e.target.getAttribute("data-id")}).then(function(){
                //e.target will select the button that is clicked.
                e.target.parentElement.parentElement.remove();
            }).catch(function(){
                console.log("please try again later");
            });
        }
    }

    //update feature
    if(e.target.classList.contains("edit-me")){
        let userInput=prompt("Enter your desired new text",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
        //On the fly req to the server through browser with the help of axios.
        //asynchronous req to the server without reloading or going to the other page.
        //post method will return a promise.then() will run only when the post method is over.if the action runs into a problem then catch will run
        if(userInput){
            axios.post("/update-item",{text:userInput, id:e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=userInput;
            }).catch(function(){
                console.log("please try again later");
            });
        }
    }
});