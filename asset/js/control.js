


// 컨트롤 요소 스크립트 선언
let pauseTimeCon = 2000; // 전체 큐 길이값
let intervalTimeCon = 20; //틱 시간값 1000ms = 1s
let earthOpacityCon = 1; //지구본 녹화 값 0~1
let tempNow = 60; //시작 온도값
let tempCon = 20; //목표 온도값
let limitDate = new Date(); //종료일 기본값 오늘날짜
let startDate = '2024-2-1' //시작일
let notifTrigger = 8000; //알람지속시간



//  -----------------프로젝트명기술-----------------
let notifArry = [ //프로젝트명 기술
    "프로젝트명어쩌구저쩌구",
]


// -----------------알람타이밍작성-----------------
let notifTriggerNum = [ //알림 트리거 설정
100,
]
// 배열 내림차순 정렬 ※※※※건들지마시오※※※※
notifTriggerNum.sort(function(a,b){
    return a-b;
});


// 변수 내보내기 ※※※※건들지마시오※※※※
export{
    pauseTimeCon,
    intervalTimeCon,
    earthOpacityCon,
    tempNow,
    tempCon,
    notifArry,
    notifTriggerNum,
    startDate,
    limitDate,
    notifTrigger,
}