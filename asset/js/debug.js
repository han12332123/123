
let keyArry = [];

(function(){
    document.addEventListener('keydown', function(e){
        const keyCode = e.keyCode;
        keyArry[keyArry.length] = e.key //키보드 입력값을 변수에 저장
        // console.log('pushed key ' + e.key)
        // console.log(keyArry.join(""))
        if(keyCode == 13){ // Enter key
        document.dispatchEvent(new KeyboardEvent('keydown', {key: 'e'}));
        // document.dispatchEvent(new KeyboardEvent('keyup', {key: 'e'}));
        } else if(keyCode == 9){ // Tab key
        document.dispatchEvent(new KeyboardEvent('keydown', {key: 't'}));
        // document.dispatchEvent(new KeyboardEvent('keyup', {key: 't'}));
        }

        if(keyArry.join("") == "qwerty"){
            alert("디버그메뉴 기동")
            $(".sc-debug").addClass('on')
        }else if(keyArry.length == 6){
            keyArry.shift();
        }
    })
})();



let globeSpeed = 1;
let zoomCheck =false;
let bloomVal = 1;
let disVal = 0;
function debugFnc(){
    $(".sc-debug .number").on('propertychange change paste input', function(){
        globeSpeed = $(".sc-debug #speed").val();
        bloomVal = $(".sc-debug #bloom").val();
        disVal = $(".sc-debug #dis").val();
        console.log(disVal)
    })
    $(".sc-debug .check").on('propertychange change paste input', function(){
        // console.log($(this).is(":checked"))
        zoomCheck = $("#zoom").is(":checked")
    })

}
export{debugFnc,globeSpeed,zoomCheck,disVal,bloomVal}