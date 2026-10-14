package com.weatherguard.backend.service;

import com.weatherguard.backend.model.WeatherData;
import com.weatherguard.backend.repository.WeatherDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.OptionalDouble;
import java.util.Set;
import java.util.TreeMap;
import java.util.function.Function;

@Service
public class KeralaTrendService {

    private static final Set<String> DISTRICTS = Set.of(
            "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
            "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
            "Kozhikode", "Wayanad", "Kannur", "Kasaragod");

    @Autowired
    private WeatherDataRepository weatherDataRepository;

    public List<Map<String, Object>> getTrend(String range) {
        boolean hourly = "24h".equals(range);
        LocalDateTime since;
        if (hourly) {
            since = LocalDateTime.now().minusHours(24);
        } else if ("30d".equals(range)) {
            since = LocalDateTime.now().minusDays(30);
        } else {
            since = LocalDateTime.now().minusDays(7);
        }
        ChronoUnit unit = hourly ? ChronoUnit.HOURS : ChronoUnit.DAYS;

        TreeMap<LocalDateTime, Map<String, List<WeatherData>>> buckets = new TreeMap<>();
        for (WeatherData w : weatherDataRepository.findByFetchedAtAfter(since)) {
            if (w.getFetchedAt() == null || !DISTRICTS.contains(w.getLocationName())) {
                continue;
            }
            LocalDateTime bucket = w.getFetchedAt().truncatedTo(unit);
            buckets.computeIfAbsent(bucket, k -> new HashMap<>())
                    .computeIfAbsent(w.getLocationName(), k -> new ArrayList<>())
                    .add(w);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<LocalDateTime, Map<String, List<WeatherData>>> entry : buckets.entrySet()) {
            Map<String, List<WeatherData>> byDistrict = entry.getValue();
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("bucket", entry.getKey().toString());
            point.put("districts", byDistrict.size());
            point.put("avgTemperature", averageAcrossDistricts(byDistrict, WeatherData::getTemperature));
            point.put("avgHumidity", averageAcrossDistricts(byDistrict, WeatherData::getHumidity));
            point.put("avgWindSpeed", averageAcrossDistricts(byDistrict, WeatherData::getWindSpeed));
            point.put("avgRainToday", averageAcrossDistricts(byDistrict, WeatherData::getDailyPrecipitation));
            result.add(point);
        }
        return result;
    }

    private Double averageAcrossDistricts(Map<String, List<WeatherData>> byDistrict,
                                          Function<WeatherData, Double> getter) {
        List<Double> perDistrict = new ArrayList<>();
        for (List<WeatherData> readings : byDistrict.values()) {
            OptionalDouble avg = readings.stream()
                    .map(getter)
                    .filter(Objects::nonNull)
                    .mapToDouble(Double::doubleValue)
                    .average();
            if (avg.isPresent()) {
                perDistrict.add(avg.getAsDouble());
            }
        }
        if (perDistrict.isEmpty()) {
            return null;
        }
        double mean = perDistrict.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        return Math.round(mean * 10.0) / 10.0;
    }
}