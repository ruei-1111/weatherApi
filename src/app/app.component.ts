
import { Component, inject, ElementRef, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from './@services/http-client.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

httpClientService = inject(HttpClientService);
apiKey:string = 'CWA-BC25F902-A3D6-4877-8FF0-D8D2E71FD50E';

//右上角搜尋欄與選單
/* 下拉選單的開啟狀態 */
isCityDropdownOpen = false;
isDistrictDropdownOpen = false;

/* 暫時使用的選項，之後可以改成 API 資料 */
// 縣市名稱
cityOptions: string[] = [
//北部
  '臺北市',
  '新北市',
  '桃園市',
  '基隆市',
  '新竹縣',
  '宜蘭縣',
  '新竹市',
//中部
  '臺中市',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
//南部
  '高雄市',
  '臺南市',
  '嘉義市',
  '嘉義縣',
  '屏東縣',
//東部
  '花蓮縣',
  '臺東縣',
//離島
  '澎湖縣',
  '金門縣',
  '連江縣',
];

// 對應的 API 編號
apiCodes: string[] = [
//北部
  '063',
  '071',
  '007',
  '051',
  '011',
  '003',
  '055',
//中部
  '075',
  '015',
  '019',
  '023',
  '027',
// 南部
  '067',
  '079',
  '059',
  '031',
  '035',
//東部
  '043',
  '039',
//離島
  '047',
  '087',
  '083',
];

districtOptions: string[] = [];
// 儲存目前縣市的所有地區資料
districtData: any[] = [];

/* 目前選取的縣市與地區 */
selectedCity = '';
selectedDistrict = '';

/* 開啟或關閉下拉選單 */
toggleDropdown(type: 'city' | 'district'): void {
  if (type === 'city') {
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
    this.isDistrictDropdownOpen = false;
  } else {
    this.isDistrictDropdownOpen = !this.isDistrictDropdownOpen;
    this.isCityDropdownOpen = false;
  }
}

/* 選擇縣市 */
selectCity(cityName: string, openDistrictAfterLoad: boolean = false): void {
  // 儲存選擇的縣市
  this.selectedCity = cityName;

  // 關閉縣市選單
  this.isCityDropdownOpen = false;

  // 清除原本選擇的地區
  this.selectedDistrict = '';

  // 找出縣市在陣列中的位置
  const index = this.cityOptions.indexOf(cityName);

  // 確認是否找到縣市
  if (index === -1) {
    return;
  }

  // 取得相同位置的 API 編號
  const apiCode = this.apiCodes[index];
  this.getWeather(apiCode,openDistrictAfterLoad);

  console.log('選擇的縣市：', cityName);
  console.log('對應的 API 編號：', apiCode);
}

/* 搜尋縣市 */
searchLocation(): void {
   // 取得搜尋文字，去除空白，並將「台」統一替換成「臺」
  const keyword = this.searchCity.trim().replace(/台/g, '臺');

  // 沒有輸入文字就不執行搜尋
  if (!keyword) {
    return;
  }

  // 尋找符合輸入文字的縣市
  const matchedCity = this.cityOptions.find(
    (cityName) => cityName.includes(keyword)
  );

  // 如果找不到符合的縣市
  if (!matchedCity) {
    console.log('找不到符合的縣市：', keyword);
    return;
  }

  // 找到縣市後，呼叫原本的縣市選擇方法
  this.selectCity(matchedCity, true);
}

/* 選擇地區 */
selectDistrict(districtName: string): void {
  // 儲存選取的地區名稱
  this.selectedDistrict = districtName;

  // 關閉地區選單
  this.isDistrictDropdownOpen = false;

  // 找出使用者選取的地區資料
  const locationData = this.districtData.find(
    (location: any) => location.LocationName === districtName
  );

  // 如果找不到地區，就停止執行
  if (!locationData) {
    console.error('找不到地區資料：', districtName);
    return;
  }

  // 取得該地區的天氣資料
  const weather = locationData.WeatherElement;

  // 更新目前地區名稱
  this.location = locationData.LocationName;

  // 更新目前溫度
  this.temperature =
    weather[0].Time[0].ElementValue[0].Temperature;

  // 更新天氣現象
  this.description =
    weather[12].Time[0].ElementValue[0].Weather;

  // 更新今日最高溫、最低溫
  this.maxTemperature =
    weather[1].Time[0].ElementValue[0].MaxTemperature;

  this.minTemperature =
    weather[2].Time[0].ElementValue[0].MinTemperature;

  // 更新降雨機率
  this.rainProbability =
    weather[11].Time[0].ElementValue[0].ProbabilityOfPrecipitation;

  // 更新風速
  this.windSpeed =
    weather[9].Time[0].ElementValue[0].WindSpeed;

  // 更新相對濕度
  this.humidity =
    weather[4].Time[0].ElementValue[0].RelativeHumidity;

  // 更新體感溫度
  this.maxfeelsLike =
    weather[5].Time[0].ElementValue[0].MaxApparentTemperature;

  this.minfeelsLike =
    weather[6].Time[0].ElementValue[0].MinApparentTemperature;
}

 // 目前天氣
  city:string = '臺南市';
  location :string =  '永康區';
  temperature :string =  '_ _';
  description :string =  '窩不知道';

  // 今日天氣
  maxTemperature: string | null = '_ _';
  minTemperature: string | null = '_ _';

  // 天氣詳細資訊
  rainProbability: string | null = '_ _';
  windSpeed: string | null = '_ _';
  humidity: string | null = '_ _';
  maxfeelsLike: string | null = '_ _';
  minfeelsLike: string | null = '_ _';


  // 搜尋城市
  searchCity = '';

// 取得指定縣市的天氣資料
getWeather(apiCode: string, openDistrictAfterLoad: boolean = false): void {
  // 使用反引號組合 API 網址
  const apiUrl =
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-${apiCode}?Authorization=${this.apiKey}&format=JSON`;

  this.httpClientService.getApi(apiUrl).subscribe({
    next: (res: any) => {
      console.log(res);

      // 取得縣市資料
      const cityData = res.records.Locations[0];

      // 取得目前選取縣市的名稱
      this.city = cityData.LocationsName;
      this.selectedDistrict = '';
      this.isDistrictDropdownOpen = false;

      // 儲存該縣市的所有地區資料
      this.districtData = cityData.Location;

      // 取得所有地區名稱，提供下拉選單使用
      this.districtOptions = this.districtData.map(
        (location: any) => location.LocationName
      );

      // 先取得第一個地區的天氣資料
      const locationData = cityData.Location[0];
      const weather = locationData.WeatherElement;

      this.location = locationData.LocationName;

      // 平均溫度
      this.temperature =
        weather[0].Time[0].ElementValue[0].Temperature;

      // 天氣現象
      this.description =
        weather[12].Time[0].ElementValue[0].Weather;

      // 今日最高溫、最低溫
      this.maxTemperature =
        weather[1].Time[0].ElementValue[0].MaxTemperature;

      this.minTemperature =
        weather[2].Time[0].ElementValue[0].MinTemperature;

      // 降雨機率
      this.rainProbability =
        weather[11].Time[0].ElementValue[0].ProbabilityOfPrecipitation;

      // 風速
      this.windSpeed =
        weather[9].Time[0].ElementValue[0].WindSpeed;

      // 相對濕度
      this.humidity =
        weather[4].Time[0].ElementValue[0].RelativeHumidity;

      // 體感溫度
      this.maxfeelsLike =
        weather[5].Time[0].ElementValue[0].MaxApparentTemperature;

      this.minfeelsLike =
        weather[6].Time[0].ElementValue[0].MinApparentTemperature;
    },

    error: (err) => {
      console.error('取得天氣資料失敗：', err);
    }
  });
}

// 取得 HTML 裡的音效元素
@ViewChild('logoAudio')
logoAudio!: ElementRef<HTMLAudioElement>;


// 共用音效播放方法
playSound(src: string, volume: number = 0.2): void {
  const audio = new Audio(src);

  // 限制音量在 0～1 之間
  audio.volume = Math.max(0, Math.min(1, volume));

  // 播放音效
  audio.play().catch((error) => {
    console.error('音效播放失敗：', error);
  });
}
// 側邊選單狀態改變時觸發
onMenuToggle(event: Event): void {
  const menu = event.target as HTMLDetailsElement;

  // 只有選單打開時才播放音效
  if (menu.open) {
    this.playSound('/windows-xp-.mp3', 0.1);
  }
}

ngOnInit(): void {
  // 預設載入臺南市
  const index = this.cityOptions.indexOf('臺南市');

  if (index !== -1) {
    this.selectedCity = '臺南市';
    this.getWeather(this.apiCodes[index]);
  }
}

}
