let btn = document.querySelector(".btn-add");
// console.log("first");
// console.log(btn);

btn.addEventListener("click", function (e) {
  console.log(e.target);
  e.preventDefault();
});
