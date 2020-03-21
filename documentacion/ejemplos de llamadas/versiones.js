// obtener lista de versiones
const getVersions = async () => {
    try {
        const response = await fetch('http://localhost:3000/versiones', {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const versiones = await getVersions();
console.log(versiones);

// obtener ultima version
const getLastVersion = async () => {
    try {
        const response = await fetch('http://localhost:3000/versiones/ultima', {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const ultimaVersion = await getLastVersion();
console.log(ultimaVersion);

// obtener version actual
const getActualVersion = async () => {
    try {
        const response = await fetch('http://localhost:3000/versiones/actual', {method: 'GET'});
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const actualVersion = await getActualVersion();
console.log(actualVersion);
