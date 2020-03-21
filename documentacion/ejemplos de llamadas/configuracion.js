// obtener configuracion de una version
const getProperties = async () => {
    try {
        const response = await fetch('http://localhost:3000/configuracion/1_plantilla-file.json', {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const properties = await getProperties();
console.log(properties);

// crear un archivo de configuracion
const createProperties = async () => {
    try {
        const newProperties = {
            "descripcion": "Archivo properties de un archivo custom",
            "version": null,
            "mongo": false,
            "nombre_base_de_datos": null,
            "tablas_base_de_datos": null,
            "atributos_base_de_datos": null,
            "atributos_archivo_creado": [
                {
                    "nombre_atributo": "_id",
                    "tipo_de_dato": "String",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Name",
                    "tipo_de_dato": "String",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Platform",
                    "tipo_de_dato": "String",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Year_of_Release",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Genre",
                    "tipo_de_dato": "String",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Publisher",
                    "tipo_de_dato": "String",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "NA_Sales",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "EU_Sales",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "JP_Sales",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Other_Sales",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Global_Sales",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Critic_Score",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Critic_Count",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "User_Score",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "User_Count",
                    "tipo_de_dato": "Number",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Developer",
                    "tipo_de_dato": "String",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                },
                {
                    "nombre_atributo": "Rating",
                    "tipo_de_dato": "String",
                    "target": false,
                    "expresion_regular": "pendiente_definir"
                }
            ],
            "nombre_archivo_creado": null,
            "valor_nulo": "?"
        }
        const response = await fetch('http://localhost:3000/configuracion', 
            {
                method: 'POST',
                body: newProperties
            });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const result = await createProperties();
console.log(result);