var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body)

var index = 0;
var songList;
var audio = new root.audioControl();


function bindEvent() {
    $scope.on("play:change",function (event,index) {
        audio.getAudio(songList[index].audio);
        if(audio.status == "play"){
            audio.play();
            root.processor.start();
        }
        root.processor.renderAllTime(songList[index].duration);
        root.render(songList[index]);
        root.processor.updata(0);
    })

    $scope.on("click",".prev-btn",function () {
        var index = controlManger.prev();
        root.render(songList[index]);
        $scope.trigger("play:change",index)
    })
    $scope.on("click",".next-btn",function () {
       var index =  controlManger.next();
        root.render(songList[index]);
        $scope.trigger("play:change",index)
    })
    $scope.on("click",".play-btn",function () {
        if(audio.status == "play"){
            audio.pause();
            root.processor.stop();
        }else{
            audio.play();
            root.processor.start();
        }
        $(this).toggleClass("playing")
    })
    $scope.on("click",".list-btn",function () {
        root.playList.show(controlManger);
    })
}
function bindTouch() {
    var $sliderPoint = $scope.find(".slider-pointer");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left;
    var width = offset.width;
    $sliderPoint.on("touchstart",function () {
        root.processor.stop();
    }).on("touchmove",function (e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x-left) / width;
        if(percent > 1 || percent < 0 ){
            percent = 0;
        }
        root.processor.updata(percent);
    }).on("touchend",function (e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x-left) / width;
        if(percent > 1|| percent < 0){
            percent = 0
        }
        var curDuration = songList[controlManger.index].duration;
        var curTime = curDuration * percent;
        audio.jumpToplay(curTime);
        root.processor.start(percent);
        $scope.find(".play-btn").addClass("playing");
    })
}
function getData(url) {
    $.ajax({
        type:"GET",
        url:url,
        success:function (data) {
            root.render(data[0])
            songList = data;
            bindEvent();
            bindTouch();
            root.playList.renderList(data);
            controlManger = new root.controlManger(data.length);
            $scope.trigger("play:change",0)
        },
        error:function () {
            console.log("error");
        }
    })
}
getData("../mock/data.json");
