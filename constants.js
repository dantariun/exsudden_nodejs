module.exports = {
    //미검지
    Detection_not : '001',
    //정검지
    Detection_normal : '002',
    //오검지
    Detection_wrong : '003',
    //확인불가
    Detection_unverifiable : '009',
    //정지차량
    ScanType_stop_car : '001',
    //역주행
    ScanType_reverse_run : '002',
    //보행자
    ScanType_walker : '003',
    //CCTV
    ScanType_cctv : '004',
    //환경
    ScanType_environment : '005',
    //도로상황
    ScanType_road_condition : '006',

    // cctv 영상 미수신
    CCTV_sttus_not_working : '005',

    // cctv 화각 틀어짐
    CCTV_sttus_angle_wrong : '006',


    /*
        T.SCAN_STTUS_CODE	"001"	정상                :정상
        T.SCAN_STTUS_CODE	"002"	검지오류				:정상
        T.SCAN_STTUS_CODE	"003"	검지제외				:정상`
        T.SCAN_STTUS_CODE	"004"	시정거리미확보		:정상
        T.SCAN_STTUS_CODE	"005"	영상미수신				: 수신상태 n , 화각: 정상
        T.SCAN_STTUS_CODE	"006"	검지영역틀어짐 			: 수신상태 y , 화각: N
        T.SCAN_STTUS_CODE	"007"	교통정체			    ㅣ정상

    */
}