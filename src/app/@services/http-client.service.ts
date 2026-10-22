import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

httpClient = inject(HttpClient);

  constructor() { }

  //get 撈取
  getApi(url: string){
    return this.httpClient.get(url);
  }

  //post 新增 (需要傳資料給後端)
  postApi(url: string, data:any){
    return this.httpClient.post(url,data);
  }

  //put 更新 (需要傳資料給後端)
  putApi(url: string, data:any){
    return this.httpClient.put(url,data);
  }

  //delete 刪除
  delApi(url: string){
    return this.httpClient.delete(url);
  }
}
