var elemento = document.createElement("input");

elemento.setAttribute("type", "number");
elemento.setAttribute("class", "form-control");

document.getElementById("prueba").appendChild(elemento);
console.log(elemento);