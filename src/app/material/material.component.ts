import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../_servicios/rest-api.service';
import * as _ from 'lodash';

@Component({
  selector: 'algo1-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {

  teoricas: any;
	practicas: any;
  tps: any;
	apuntes: any;
  allApuntes: any;
	allClases: any;
  allTps: any;
  clases: any;
  clasesSearch: string = "";
  clasesCategory: string = "";
  apuntesSearch: string = "";
  tpsSearch: string = "";

  constructor(
    public restApi: RestApiService
  ) { }

  ngOnInit(): void {
    this.getApuntes();
		this.getClases();
    this.getTps();
  }

  getApuntes() {
		this.restApi.getFiles("apuntes").subscribe((data: {}) => {
			this.apuntes = data;
			for (var i = 0; i < this.apuntes.length; i++) {
				let nombre = this.apuntes[i].name.split("_");
				this.apuntes[i].nombre = nombre.join(" ").replace('.pdf', '');
				this.apuntes[i].url = this.restApi.getApiUrl() + '/apuntes/' + this.apuntes[i].name;
			}
      this.allApuntes = this.apuntes
		});
	}

	getClases() {
		this.restApi.getFiles("clases").subscribe((data: any) => {
			var clases = data;
			for (var i = 0; i < clases.length; i++) {
				let nombre = clases[i].name.split("_");
				clases[i].tipo = nombre[2];
				nombre.splice(2,2);
				clases[i].nombre = nombre.join(" ").split(".")[0];
				clases[i].url = this.restApi.getApiUrl() + '/clases/' + clases[i].name;
			}
			this.allClases = _.orderBy(clases, ['tipo', 'nombre'], ['desc', 'desc']);
      this.clases = this.allClases;
		});
	}

  getTps() {
		this.restApi.getFiles("tps").subscribe((data: any) => {
      var tps = data;
			for (var i = 0; i < tps.length; i++) {
				let nombre = tps[i].name.split("_");
				tps[i].nombre = `${nombre.slice(0,2).join(" ").split(".")[0]} - ${nombre.slice(2).join(" ").split(".")[0]}`;
				tps[i].url = this.restApi.getApiUrl() + '/tps/' + tps[i].name;
			}
      this.allTps = tps;
      this.tps = this.allTps;
		});
	}

  changeCategory(category: string){
    this.clasesCategory = category;
    this.filtrarClases(this.clasesCategory, this.clasesSearch);
  }

  filtrarClases(category, search){
    this.clases = _.filter(this.allClases, function(obj) {
      return ((search.length == 0 || obj.nombre.toLowerCase().indexOf(search.toLowerCase()) !== -1) && (category.length == 0 || obj.tipo == category));
    });

  }
  
  filtrarApuntes(search){
    this.apuntes = _.filter(this.allApuntes, function(obj) {
      return (search.length == 0 || obj.nombre.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    });
  }

  filtrarTps(search){
    this.tps = _.filter(this.allTps, function(obj) {
      return (search.length == 0 || obj.nombre.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    });
  }
}
