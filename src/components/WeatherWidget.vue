<template>
  <b-container>
    <b-form-input class="mb-4" type="text" id="location-input" placeholder="Search Location.." />

    <b-card class="main-card">
      <b-row align-v="center">
        <b-col>
          <b-row align-v="center">
            <b-col cols="auto">
              <div class="display-4">{{ currentTemperature.actual }}℃</div>
              <div class="small">Feels like {{ currentTemperature.feels }}℃</div>
            </b-col>
            <b-col cols="8">
              <div class="font-weight-bold small">{{ currentTemperature.summary }}</div>
              <div class="small">{{ location.name }}</div>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="auto">
          <skycon :condition="currentTemperature.icon" />
        </b-col>
      </b-row>
    </b-card>
    <b-row>
      <b-col cols="12" md="6">
        <h4 class="my-4">Daily</h4>
        <b-card class="secondry-card">
          <b-row
            align-v="center"
            align-h="center"
            v-for="(day, idx) in daily"
            :key="day.time"
            :class="{ 'mt-3': idx > 0 }"
          >
            <b-col cols="3">
              <div class="font-weight-bold small">{{ toDayOfWeek(day.time) }}</div>
            </b-col>
            <b-col cols="6">
              <b-row class="small" align-v="center" align-h="center">
                <skycon :condition="day.icon" :width="24" :height="24" />

                <div class="ml-1">{{ day.summary }}</div>
              </b-row>
            </b-col>
            <b-col class="text-right small" cols="3">
              <div>{{ Math.round(day.temperatureHigh) }} ℃</div>
              <div>{{ Math.round(day.temperatureLow) }} ℃</div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="12" md="6">
        <h4 v-b-toggle.collapse-1 variant="dark" class="my-4">
          Extras
        </h4>

        <b-collapse id="collapse-1" class="my-2" visible>
          <b-card class="secondry-card">
            <b-row align-v="center" align-h="between">
              <b-col cols="4">
                <div class="font-weight-bold small">Wind Speed:</div>
                <div class="font-weight-bold small">Humidity:</div>
                <div class="font-weight-bold small">Pressure:</div>
              </b-col>
              <b-col cols="4">
                <div class="text-right small">{{ Math.round(currentTemperature.windSpeed) }}</div>
                <div class="text-right small">{{ Math.round(currentTemperature.humidity) }}</div>
                <div class="text-right small">{{ Math.round(currentTemperature.pressure) }}</div>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import places from 'places.js';

import API from '@/lib/API';
import toKebabCase from '@/utils/toKebabCase';

export default {
  name: 'WeatherWidget',
  data() {
    return {
      currentTemperature: {
        actual: '',
        feels: '',
        summary: '',
        icon: '',
        windSpeed: '',
        humidity: '',
        pressure: '',
      },
      location: {
        name: 'New York, USA',
        lat: 37.8267,
        lng: -122.4233,
      },
      daily: [],
    };
  },
  mounted() {
    this.loadWeather();

    const placesAutocomplete = places({
      appId: 'pl1DWMFRTQ3D',
      apiKey: '5000455f6c075684f8b923e57d0ba945',
      container: document.querySelector('#location-input'),
    }).configure({
      type: 'city',
      aroundLatLngViaIP: false,
    });

    const $location = document.querySelector('#location-value');

    placesAutocomplete.on('change', event => {
      this.location = {
        name: `${event.suggestion.name}, ${event.suggestion.country}`,
        lat: event.suggestion.latlng.lat,
        lng: event.suggestion.latlng.lng,
      };
    });

    placesAutocomplete.on('clear', () => {
      $location.textContent = 'none';
    });
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    location(newValue, oldValue) {
      this.loadWeather();
    },
    deep: true,
  },
  methods: {
    loadWeather() {
      API.getForecast(this.location.lat, this.location.lng).then(result => {
        this.currentTemperature = {
          actual: Math.round(result.currently.temperature),
          feels: Math.round(result.currently.apparentTemperature),
          summary: result.currently.summary,
          windSpeed: result.currently.windSpeed,
          humidity: result.currently.humidity,
          pressure: result.currently.pressure,
          icon: toKebabCase(result.currently.icon),
        };
        this.daily = result.daily.data;
      });
    },
    toDayOfWeek(timestamp) {
      const newDate = new Date(timestamp * 1000);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      return days[newDate.getDay()];
    },
  },
};
</script>

<style lang="scss">
.ap-input-icon {
  width: 40px;
  height: 40px;
}
.card.main-card {
  background-color: #1a202c;
  color: #ffffff;
}
.card.secondry-card {
  background-color: #2d3748;
  color: #edf2f7;
}
</style>
