package org.water.ex1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.water.ex1.model.PollutionSource;
import org.water.ex1.repository.PollutionSourceRepository;
import org.water.ex1.util.CoordinateConverter;

import java.util.ArrayList;
import java.util.List;

@Service
public class PollutionSourceService {

    @Autowired
    private PollutionSourceRepository pollutionSourceRepository;

    public List<PollutionSource> getAllPollutionSources() {
        List<PollutionSource> pollutionSources = pollutionSourceRepository.findAll();
        
        // WGS84로 변환된 결과를 담을 리스트
        List<PollutionSource> convertedSources = new ArrayList<>();
        
        for (PollutionSource source : pollutionSources) {
            // UTM-K 좌표를 WGS84로 변환
            double[] wgs84Coordinates = CoordinateConverter.convertTMToWGS84(source.getWeb_bplc_x_katec(), source.getWeb_bplc_y_katec());
            
            // 새로운 PollutionSource 객체 생성하여 변환된 좌표로 설정
            PollutionSource convertedSource = new PollutionSource();
            convertedSource.setId(source.getId());
            convertedSource.setBsnm_nm(source.getBsnm_nm()); // 회사명 설정
            convertedSource.setInduty_nm(source.getInduty_nm()); // 산업명 설정
            convertedSource.setBsns_detail_road_addr(source.getBsns_detail_road_addr()); // 주소 설정
            convertedSource.setWeb_bplc_x_katec(wgs84Coordinates[0]); // 변환된 X 좌표
            convertedSource.setWeb_bplc_y_katec(wgs84Coordinates[1]); // 변환된 Y 좌표
            convertedSource.setLongitude(source.getLongitude());
            convertedSource.setLatitude(source.getLatitude());
            
            // 변환된 객체를 리스트에 추가
            convertedSources.add(convertedSource);
        }
        
        return convertedSources; // 변환된 리스트 반환
    }
}