package org.water.ex1.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/naver")
public class NaverPlaceController {

    private final String CLIENT_ID = "FPAwVEmmUu52Kt3TVGXG";
    private final String CLIENT_SECRET = "JAe6cIC3kb";

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchPlace(@RequestParam String query) throws IOException, InterruptedException {
        String apiUrl = "https://openapi.naver.com/v1/search/local.json?query=" +
                URLEncoder.encode(query, StandardCharsets.UTF_8) +
                "&display=10&start=1&sort=random";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("X-Naver-Client-Id", CLIENT_ID)
                .header("X-Naver-Client-Secret", CLIENT_SECRET)
                .GET()
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject json = new JSONObject(response.body());
        JSONArray items = json.getJSONArray("items");

        List<Map<String, Object>> results = new ArrayList<>();

        for (int i = 0; i < items.length(); i++) {
            JSONObject item = items.getJSONObject(i);
            double mapx = item.getDouble("mapx");
            double mapy = item.getDouble("mapy");

            double[] wgsCoords = tmToWgs(mapx, mapy);

            Map<String, Object> place = new HashMap<>();
            place.put("title", item.getString("title"));
            place.put("address", item.getString("address"));
            place.put("lat", wgsCoords[1]);
            place.put("lng", wgsCoords[0]);
            results.add(place);
        }

        return ResponseEntity.ok(results);
    }

    // TM → WGS84 간단 변환 (실제 환경에 맞게 API 활용 권장)
    private double[] tmToWgs(double x, double y) {
        double lon = x / 10000000.0;  // 정확한 변환
        double lat = y / 10000000.0;
        return new double[]{lon, lat};
    }
}
