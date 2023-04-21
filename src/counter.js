var s_time;

var Frame_Rate = 60;


var NowFrame = 0;
var BeforeFrame = 0;

var DropFrameCnt = 0;

function counter_init(framerate){
	s_time = new Date();
	Frame_Rate = framerate;
}

function get_run_frame_cnt(){
	e_time = new Date();
	
	NowFrame = Math.round((e_time - s_time) / (1000 / Frame_Rate));
	var ans = NowFrame - BeforeFrame;
	DropFrameCnt += ans - 1;
	BeforeFrame = NowFrame;

	return ans;
}

function get_now_frame(){
	return NowFrame;
}

function get_now_time(){
	return new Date() - s_time;
}