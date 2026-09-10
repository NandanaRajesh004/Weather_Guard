package com.weatherguard.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.repository.WeatherDataRepository;

@Service
public class WeatherService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private WeatherDataRepository weatherDataRepository;

    public WeatherData fetchAndSaveWeather(String locationName, double latitude, double longitude) {
        String url = String.format(
            "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=precipitation_sum&timezone=auto",
            latitude, longitude
        );

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        Map<String, Object> current = (Map<String, Object>) response.get("current");
        Map<String, Object> daily = (Map<String, Object>) response.get("daily");

        Double todayPrecipitation = 0.0;
        if (daily != null) {
            List<Object> precipList = (List<Object>) daily.get("precipitation_sum");
            if (precipList != null && !precipList.isEmpty() && precipList.get(0) != null) {
                todayPrecipitation = ((Number) precipList.get(0)).doubleValue();
            }
        }

        WeatherData weatherData = new WeatherData();
        weatherData.setLocationName(locationName);
        weatherData.setLatitude(latitude);
        weatherData.setLongitude(longitude);
        weatherData.setTemperature(((Number) current.get("temperature_2m")).doubleValue());
        weatherData.setHumidity(((Number) current.get("relative_humidity_2m")).doubleValue());
        weatherData.setPrecipitation(((Number) current.get("precipitation")).doubleValue());
        weatherData.setWindSpeed(((Number) current.get("wind_speed_10m")).doubleValue());
        weatherData.setWeatherCode(((Number) current.get("weather_code")).intValue());
        weatherData.setDailyPrecipitation(todayPrecipitation);
        weatherData.setFetchedAt(LocalDateTime.now());

        return weatherDataRepository.save(weatherData);
    }
}