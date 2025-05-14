package org.water.ex1.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pollution_sources") // 테이블 이름을 명시적으로 지정
public class PollutionSource {
    @Id
    @Column(name = "id") // 데이터베이스의 칼럼명과 매핑
    private Long id;

    @Column(name = "bsnm_nm") // 데이터베이스의 칼럼명과 매핑
    private String bsnm_nm;

    @Column(name = "induty_nm") // 데이터베이스의 칼럼명과 매핑
    private String induty_nm;

    @Column(name = "bsns_detail_road_addr") // 데이터베이스의 칼럼명과 매핑
    private String bsns_detail_road_addr;

    @Column(name = "web_bplc_x_katec") // 데이터베이스의 칼럼명과 매핑
    private Double web_bplc_x_katec;

    @Column(name = "web_bplc_y_katec") // 데이터베이스의 칼럼명과 매핑
    private Double web_bplc_y_katec;

    // WGS84 좌표 추가
    @Column(name = "longitude") // 데이터베이스의 칼럼명과 매핑
    private Double longitude; // WGS84 X 좌표

    @Column(name = "latitude") // 데이터베이스의 칼럼명과 매핑
    private Double latitude; // WGS84 Y 좌표

    // Getter 및 Setter 추가
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBsnm_nm() {
        return bsnm_nm;
    }

    public void setBsnm_nm(String bsnm_nm) {
        this.bsnm_nm = bsnm_nm;
    }

    public String getInduty_nm() {
        return induty_nm;
    }

    public void setInduty_nm(String induty_nm) {
        this.induty_nm = induty_nm;
    }

    public String getBsns_detail_road_addr() {
        return bsns_detail_road_addr;
    }

    public void setBsns_detail_road_addr(String bsns_detail_road_addr) {
        this.bsns_detail_road_addr = bsns_detail_road_addr;
    }

    public Double getWeb_bplc_x_katec() {
        return web_bplc_x_katec;
    }

    public void setWeb_bplc_x_katec(Double web_bplc_x_katec) {
        this.web_bplc_x_katec = web_bplc_x_katec;
    }

    public Double getWeb_bplc_y_katec() {
        return web_bplc_y_katec;
    }

    public void setWeb_bplc_y_katec(Double web_bplc_y_katec) {
        this.web_bplc_y_katec = web_bplc_y_katec;
    }

    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
}