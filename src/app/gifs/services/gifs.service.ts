import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:string = 'NQrWF19NTfplO0vdK1ck09RyO79aIF9m';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  private _historial: string[]=[];

  // Cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];


    get historial(){
      return [...this._historial];
    }


    constructor( private http: HttpClient){

      // Obtenienod historial y resultados de local storage
      this._historial = JSON.parse(localStorage.getItem('historial')! )|| [];

      this.resultados = JSON.parse(localStorage.getItem('resultados')! )|| [];
     }

    searchGifs ( query: string =''){

      query = query.trim().toLocaleLowerCase();


        // validar si no hay repetidos
        if ( !this._historial.includes( query)) {
          this._historial.unshift( query);
          // limitar a 10 resultados
       this._historial= this._historial.splice(0,9);


 localStorage.setItem('historial', JSON.stringify( this._historial )  );
        }



        const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', query)



        // haciendo la peticion con observable y modulo http
        // Observable HTPP
        this.http.get<SearchGifsResponse>(`
        ${this.servicioUrl}/search`, { params })
        .subscribe(
          (res) => {
              console.log(res.data);
              this.resultados = res.data;
               localStorage.setItem('resultados', JSON.stringify(this.resultados));
          }
        );


        // fetch(' https://api.giphy.com/v1/gifs/search?api_key=NQrWF19NTfplO0vdK1ck09RyO79aIF9m&q=dragon ball z&limit=10')
        // .then( resp =>{
        //     resp.json().then(data => console.log(data)
        //     )
        // });

      console.log(this._historial);

    }

}
