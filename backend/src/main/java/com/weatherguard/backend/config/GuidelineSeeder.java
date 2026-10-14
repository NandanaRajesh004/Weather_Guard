package com.weatherguard.backend.config;

import com.weatherguard.backend.model.EmergencyGuideline;
import com.weatherguard.backend.repository.EmergencyGuidelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class GuidelineSeeder implements CommandLineRunner {

    @Autowired
    private EmergencyGuidelineRepository repo;

    @Override
    public void run(String... args) {
        // 1. The risk engine uses MODERATE; older rows used MEDIUM.
        for (EmergencyGuideline g : repo.findAll()) {
            if ("MEDIUM".equalsIgnoreCase(g.getRiskLevel())) {
                g.setRiskLevel("MODERATE");
                repo.save(g);
            }
        }

        // 2. Remove exact duplicates, keeping the oldest row.
        Set<String> seen = new HashSet<>();
        List<EmergencyGuideline> all = new ArrayList<>(repo.findAll());
        all.sort(Comparator.comparing(EmergencyGuideline::getId));
        for (EmergencyGuideline g : all) {
            String key = g.getDisasterType() + "|" + g.getRiskLevel() + "|" + g.getInstructions();
            if (!seen.add(key)) {
                repo.delete(g);
            }
        }

        // 3. Add any missing hazard and level combination.
        seed("FLOOD", "LOW", "Monitor local weather updates. Avoid unnecessary travel near rivers or low-lying areas.");
        seed("FLOOD", "MODERATE", "Move valuables to higher floors. Keep an emergency kit ready. Avoid walking through moving water.");
        seed("FLOOD", "HIGH", "Move to higher ground immediately. Avoid walking through flowing water. Keep emergency kit ready.");
        seed("FLOOD", "SEVERE", "Evacuate now to higher ground or the nearest relief camp. Do not wait for water to rise. Never walk, swim or drive through flood water. Call 112 if you need rescue.");

        seed("CYCLONE", "LOW", "Secure loose outdoor items. Charge phones and keep emergency contacts handy.");
        seed("CYCLONE", "MODERATE", "Stay indoors, away from windows. Stock food, water, and torches for at least 48 hours.");
        seed("CYCLONE", "HIGH", "Move to a designated cyclone shelter immediately. Avoid coastal areas. Do not go outside until officially cleared.");
        seed("CYCLONE", "SEVERE", "Go to the nearest cyclone shelter now. Fishermen must not go to sea. Stay away from the coast, rivers and windows. A calm spell can be the eye of the storm, so stay inside until officially cleared. Call 112 in an emergency.");

        seed("HEATWAVE", "LOW", "Stay hydrated and avoid direct sun during peak afternoon hours.");
        seed("HEATWAVE", "MODERATE", "Limit outdoor activity. Wear light clothing. Watch for signs of heat exhaustion in children and elderly.");
        seed("HEATWAVE", "HIGH", "Avoid all outdoor exposure. Drink water frequently. Seek immediate medical help for heat stroke symptoms.");
        seed("HEATWAVE", "SEVERE", "Stay indoors in the coolest room and avoid outdoor work between 11 am and 3 pm. Drink water even if you are not thirsty. Confusion, fainting or hot dry skin is heat stroke, an emergency: cool the person with water and call 112.");

        seed("LIGHTNING", "LOW", "Thunderstorms are possible. Watch the sky and plan outdoor activity so you can reach shelter quickly.");
        seed("LIGHTNING", "MODERATE", "Thunderstorms are likely. Go indoors when you hear thunder. Avoid open fields, hilltops and isolated trees. Unplug sensitive electrical equipment.");
        seed("LIGHTNING", "HIGH", "Stay inside a closed building or vehicle. Keep away from windows, metal pipes and electrical appliances. Do not shelter under trees and stay out of water, including fishing and bathing.");
        seed("LIGHTNING", "SEVERE", "Severe thunderstorm with hail or frequent lightning. Stay indoors away from windows and wait 30 minutes after the last thunder before going out. Farm workers and fishermen must leave open areas and water now. If someone is struck, call 112 and begin CPR; the person carries no electric charge.");
    }

    private void seed(String hazard, String level, String text) {
        if (repo.findByDisasterTypeAndRiskLevel(hazard, level).isEmpty()) {
            EmergencyGuideline g = new EmergencyGuideline();
            g.setDisasterType(hazard);
            g.setRiskLevel(level);
            g.setInstructions(text);
            repo.save(g);
        }
    }
}