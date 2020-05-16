import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-kmeans',
  templateUrl: './kmeans.page.html',
  styleUrls: ['./kmeans.page.scss'],
})
export class KmeansPage implements OnInit {
  iteraciones: any;
  epocas: any;
  centroides: any;
  configuracion: any;
  datos: any;
  clusters: any;
  settings: any;
  constructor(private navParams: NavParams, private modalControler: ModalController) {
    // valor obtenido
    this.settings = this.navParams.get('settings');
    console.log(this.settings);
    this.iteraciones = +prompt(`Por favor, ingresa el numero de iteraciones que realizara el algoritmo`, '0');
    this.epocas = +prompt(`Por favor, ingresa el numero de corridas que realizara el algoritmo`, '0');
    this.centroides = +prompt(`Por favor, ingresa el numero de clusteres a clasificar`, '0');
    this.configuracion = this.settings.settings;
    this.datos = this.settings.dataset;
    this.clusters = [];
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.entrenar();
  }

  entrenar() {
    let mejorEpoca = null;
    // repetir el algoritmo 'epocas' veces
    for (let i = 0; i < this.epocas; i++) {
      const epoch = {
        clusters: this.inicializarClusters(),
        epoca: i
      };
      // entrenamiento y recorrido del centroide del cluster
      for (let iteracion = 0; iteracion < this.iteraciones; iteracion++) {
        const epoca = JSON.parse(JSON.stringify(epoch));
        epoca.clusters.forEach((cluster, it) => {
          epoca.clusters[it].elementos = [];
        });
        // para cada dato encontrar cual cluster es mas cercano y agregarlo a dicho cluster
        this.datos.forEach(dato => {
          let distanciaMenor = Number.MAX_VALUE;
          let clstr = 0;
          epoca.clusters.forEach((cluster, clsNumber) => {
            const distancia = this.calcularDistancia(cluster.centro, dato);
            if (distancia < distanciaMenor) {
              distanciaMenor = distancia;
              clstr = clsNumber;
            }
          });
          epoca.clusters[clstr].elementos.push({...dato});
        });

        // teniendo los clusters, calcular el nuevo centro
        const llaves = Object.keys(this.configuracion);
        epoca.clusters.forEach(cluster => {
          const media = {};
          // inicializacion
          llaves.forEach(llave => {
            media[llave] = 0;
          });
          cluster.elementos.forEach(elemento => {
            llaves.forEach(llave => {
              media[llave] += elemento[llave];
            });
          });
          llaves.forEach(llave => {
            media[llave] /= cluster.elementos.length;
          });
          cluster.centro = media;
        });

        epoca.clusters.forEach((cluster, it) => {
          epoch.clusters[it] = JSON.parse(JSON.stringify(cluster));
        });
      }

      // despues del entrenamiento, sigue sacar medidas de siluette y sus errores
      epoch.clusters.forEach((cluster, it) => {
        cluster.silhouettes = this.calcularSilhouettes(epoch.clusters, it);
        cluster.errorMedio = this.calcularMedia(cluster.silhouettes);
      });

      // verificar si los clusters de la epoca actual son los mejores
      if (mejorEpoca) {
        let errorMejorEpoca = 0;
        let errorEpocaActual = 0;
        for (let it = 0; it < mejorEpoca.clusters.length; it++) {
          errorMejorEpoca += mejorEpoca.clusters[it].errorMedio;
          errorEpocaActual += epoch.clusters[it].errorMedio;
        }
        errorMejorEpoca /= mejorEpoca.clusters.length;
        errorEpocaActual /= mejorEpoca.clusters.length;
        if (errorEpocaActual > errorMejorEpoca) {
          mejorEpoca = JSON.parse(JSON.stringify(epoch));
        }
      } else {
        mejorEpoca = JSON.parse(JSON.stringify(epoch));
      }
    }
    this.clusters = mejorEpoca;
    console.log(mejorEpoca);
    document.getElementById('kmeans').innerHTML = JSON.stringify(mejorEpoca, null, 4);
  }

  inicializarClusters() {
    const randomNumbers = [];
    const clusters = [];
    while (randomNumbers.length < this.centroides) {
      const random = Math.round(Math.random() * this.datos.length - 1);
      if (!randomNumbers.includes(random)) {
        randomNumbers.push(random);
      }
    }
    randomNumbers.forEach(randomValue => {
      clusters.push({ centro: JSON.parse(JSON.stringify(this.datos[randomValue])), elementos: [], silhouettes: [], errorMedio: 0 });
    });
    console.log(randomNumbers, clusters);
    return clusters;
  }

  // el cluster tiene forma:  { centro: { ...this.datos[randomValue] }, elementos: [], silhouettes: [], errorMedio: 0 }
  calcularDistancia(centro, dato) {
    const llaves = Object.keys(dato);
    let sum = 0;
    llaves.forEach(llave => {
      sum += Math.pow(centro[llave] - dato[llave], 2);
    });
    return Math.sqrt(sum);
  }

  calcularSilhouettes(clusters, actualCluster) {
    const siluettes = [];
    const clusterActual = clusters[actualCluster];
    const clustersAdyacentes = [];
    for (let i = 0; i < clusters.length; i++) {
      if (i !== actualCluster) {
        clustersAdyacentes.push(clusters[i]);
      }
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < clusterActual.elementos.length; i++) {
      const elemento = clusterActual.elementos[i];
      let distanciaLocal = 0;
      let distanciaGlobal = Number.MAX_VALUE;
      clusterActual.elementos.forEach(ele => {
        distanciaLocal += this.calcularDistancia(elemento, ele);
      });
      distanciaLocal /= clusterActual.elementos.length;
      for (let j = 0; j < clusters.length; j++) {
        if (j !== actualCluster) {
          distanciaGlobal = Math.min(distanciaGlobal, this.calcularDistancia(elemento, clusters[j].centro));
        }
      }
      siluettes.push((distanciaGlobal - distanciaLocal) / Math.max(distanciaGlobal, distanciaLocal));
    }
    return siluettes;
  }

  calcularMedia(arreglo) {
    let sum = 0;
    arreglo.forEach(elemento => {
      sum += elemento;
    });
    return sum / arreglo.length;
  }

}
