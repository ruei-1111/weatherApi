
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientService } from './@services/http-client.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

httpClientService = inject(HttpClientService);

 // 目前天氣
  location = '台南市・永康區';
  temperature = 28;
  description = '多雲時晴';

  // 今日天氣
  maxTemperature: number | null = null;
  minTemperature: number | null = null;

  // 天氣詳細資訊
  rainProbability: number | null = null;
  windSpeed: number | null = null;
  humidity: number | null = null;
  feelsLike: number | null = null;

  // 統一格式化數值，保留小數點後一位
formatNumber(value: number | null): string {
  return value === null ? '--' : value.toFixed(1);
}

  // 搜尋城市
  searchCity = '';

  ngOnInit(): void {
this.httpClientService.getApi('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-083?Authorization=CWA-BC25F902-A3D6-4877-8FF0-D8D2E71FD50E&format=JSON')
.subscribe((res: any) => {
  console.log(res);
  console.log(res.records.Locations[0].Location[0].LocationName);
});

}

}
