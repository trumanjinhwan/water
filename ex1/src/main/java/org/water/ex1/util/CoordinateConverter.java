package org.water.ex1.util;

public class CoordinateConverter {

    public static double[] convertTMToWGS84(double tmN, double tmE) {
        // 기준점
        double baseTmN = 1987120.384596034;
        double baseTmE = 1020233.8001620844;
        double baseLat = 37.88369036216385;
        double baseLon = 127.73009760812818;

        // 스케일
        double scaleLat = 0.0000090122;
        double scaleLon = 0.0000113755;

        // 변환
        double wgs84Lat = (tmN - baseTmN) * scaleLat + baseLat;
        double wgs84Lon = (tmE - baseTmE) * scaleLon + baseLon;

        return new double[]{wgs84Lat, wgs84Lon};
    }
}