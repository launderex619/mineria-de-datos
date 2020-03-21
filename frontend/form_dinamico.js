var div = document.createElement("div");
div.setAttribute("class", "row");
div.setAttribute("class", "mb-3");

var label = document.createElement("label");
var texto = document.createTextNode("Etiqueta");

label.appendChild(texto);

div.appendChild(label);

var elemento = document.createElement("input");
elemento.setAttribute("type", "number");
elemento.setAttribute("class", "form-control");

div.appendChild(elemento);

document.getElementById("prueba").appendChild(div);

var div = document.createElement("div");
div.setAttribute("class", "row");
div.setAttribute("class", "mb-3");


var elemento = document.createElement("input");

elemento.setAttribute("type", "number");
elemento.setAttribute("class", "form-control");

div.appendChild(elemento);

document.getElementById("prueba").appendChild(div);