// obtener archivo csv asociado a un archivo properties:
const getCSVFile = async () => {
    try {
        // para descargarlo como csv
        window.open('http://localhost:3000/archivo/2_nuevo-archivo-configuracion.json', '_blank');
        // para obtenerlo como texto
        const response = await fetch('http://localhost:3000/archivo/2_nuevo-archivo-configuracion.json', 
        {
            method: 'GET'
        });
        const data = await response.text();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const file = await getCSVFile();
console.log(file);

// subir archivo csv al servidor a un determinado archivo properties
/**
 * RECOMIENDO PROFUNDAMENTE VER EL EJEMPLO HTML ANEXO CON EL MISMO NOMBRE DE ESTE ARCHIVO
 */
const getCSVFile = async () => {
    try {
        const formData = new FormData(); // esto se saca del html
        formData.append("archivo", "ruta/ejemplo.csv");
        const response = await fetch('http://localhost:3000/archivo/2_nuevo-archivo-configuracion.json', 
        {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const resp = await getCSVFile();
console.log(resp);