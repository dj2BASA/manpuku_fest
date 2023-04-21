
/*
var script = document.createElement('script'); //変数名は適当なものにでも
script.src = "counter.js"; //ファイルパス
document.head.appendChild(script); //<head>に生成
/**/

var version = "(no data)";
var framerate = 60;

var stage;

// 表示領域の横幅縦幅 (デフォルト値。init()で修正してます)
var disp_w = 1280;
var disp_h = 720;


var shape_white;

var bmp_bg;
var bmp_bg_monitor;

var bmp_bg_monitor_upper;
var bmp_bg_monitor_team = [];

var team_light_data = [];

var bmp_bg_line;
var container_bg_01 = new createjs.Container();
var container_bg_02 = new createjs.Container();

var container_monitor = new createjs.Container();

var band_center_y = disp_h * 3 / 6;

var band_alpha_max = 0.5;
var band_font_single_size = 50;
var band_font_team_size = 50;

var text_band;
var band_single_text_adjust_y = -30;

var container_band = new createjs.Container();

var band_single_h = 120;
var container_band_base_single = new createjs.Container();

var band_team_h = 80;
var band_team_text_adjust_y = -25;
var container_band_base_team = new createjs.Container();

var add_score_img_scale = 0.6;

var team_data;
team_data = [];
/*
team_data[0] = {};
team_data[0]["text_band_num"];
team_data[0]["text_band_add_score"];
team_data[0]["img_num"];
team_data[0]["bmp_num"];
team_data[0]["img_add_score"]
team_data[0]["bmp_add_score"]
team_data[0]["img_result_category"] = [];
team_data[0]["bmp_result_category"] = [];
team_data[0]["container_result_category"] = [];
team_data[0]["container_band"] = new createjs.Container();
/**/

var symbol_data = [];
var symbol_num = 7;
var symbol_scale = 0.6;
var container_symbol = new createjs.Container();

var team_localtion_left = [];
team_localtion_left[0] = 168;
team_localtion_left[1] = 474;
team_localtion_left[2] = 785;
team_localtion_left[3] = 1100;

var container_all_result_score = new createjs.Container();

// 描画の定義
var DisplayEnum = {
	disp_load: 0,
	disp_title: 1,
	disp_category_result: 2,
	disp_all_result: 3,
	disp_end: 99
}
var display_state = DisplayEnum.disp_load

// 各部門を描画するときのステート
var DrawingCategoryEnum = {
	dc_none: 0,
	dc_loop_init: 1,
	dc_explanation: 2,
	dc_snare_roll: 3,
	dc_result: 4
}
var dc_state = DrawingCategoryEnum.dc_none

// 最終結果を描画するときのステート
var DrawingAllResultEnum = {
	dar_none: 0,
	dar_init: 1,
	dar_explanation: 2,
	dar_score_fall_start: 3,
	dar_score_fall_01 : 4,
	dar_score_fall_02 : 5,
	dar_score_stay : 6,
	dar_result : 99,
}
var dar_state = DrawingAllResultEnum.dar_none

var is_display_state_loop = true;


//#region サウンド

var sound_result = [];
var sound_button;
var sound_allresult_score;
var sound_allresult_result;

//#endregion


var settings_result_data = {};
settings_result_data["category_data_list"] = []

var is_initialise = false;
var is_init_running = false;
var init_step = 0;

function main() {
	// counter_init(framerate);
	
	// load_settings();
	
	// canvas_init();
	
	// draw_object_init();
	// debug_init(stage);

	function handleTick(){
		
		if (!is_initialise){
			init_running();
			return;
		}

		debug_clear_list();
		var fcnt = get_run_frame_cnt();
		for (let ff = 0 ; ff<fcnt ; ff++){
			main_loop1();
		}
		main_loop2();
		debug_reflesh();
		stage.update();
	}
	
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.framerate = framerate;
	if (framerate == 60){ createjs.Ticker.timingMode = createjs.Ticker.RAF; }
}

function init_running(){

	if (is_init_running) {
		return;
	}

	is_init_running = true;
	switch(init_step){
		case 0:
			
			counter_init(framerate);
			is_init_running = false;
			init_step++;
			break;

		case 1:
			load_settings();
			break;

		case 2:
			canvas_init();
			break;

		case 3:
			draw_object_init();
			break;

		case 4:
			debug_init(stage);
			init_step++;
			is_init_running = false;
			break;

		case 5:
			is_initialise = true;
			break;
	}
}


function load_settings(){

	var team_count = 3;

	var getxml = $.ajax({
		url: "./settings.xml",
		type: 'GET',
		dataType: 'xml',
		timeout: 5000,
		cache: false
	});

	getxml.done(function (xml) {
		// 1データ読み込み毎にtryする
		function getdata(tagname){
			let ans;
			try{
				ans = xml.getElementsByTagName(tagname)[0].firstChild.nodeValue;
			}
			catch(e){
				ans = "";
			}
			return ans;
		}
		settings_result_data["title"] = xml.getElementsByTagName("title")[0].firstChild.nodeValue;
		xml_data_list = xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass");

		for (var ii_category=0 ; ii_category< xml_data_list.length ; ii_category++){
			// debug_set_message(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("category_name")[0].firstChild.nodeValue);
			
			if (settings_result_data["category_data_list"][ii_category] == null){
				settings_result_data["category_data_list"][ii_category] = {}
				settings_result_data["category_data_list"][ii_category]["team_data"] = []
				for (var ii_team = 0 ; ii_team < team_count ; ii_team++){
					settings_result_data["category_data_list"][ii_category]["team_data"][ii_team] = {};
					settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["num"] = 0;
					settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["add_score"] = 1;
				}
				settings_result_data["category_data_list"][ii_category]["unit"] = "枚";
			}

			settings_result_data["category_data_list"][ii_category]["category_name"] = xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("category_name")[0].firstChild.nodeValue;
			settings_result_data["category_data_list"][ii_category]["decimal_places"] = parseInt(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("decimal_places")[0].firstChild.nodeValue);
			settings_result_data["category_data_list"][ii_category]["team_data"][0]["num"] = parseFloat(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("team_1_data_num")[0].firstChild.nodeValue);
			settings_result_data["category_data_list"][ii_category]["team_data"][0]["add_score"] = parseInt(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("team_1_add_score")[0].firstChild.nodeValue);
			settings_result_data["category_data_list"][ii_category]["team_data"][1]["num"] = parseFloat(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("team_2_data_num")[0].firstChild.nodeValue);
			settings_result_data["category_data_list"][ii_category]["team_data"][1]["add_score"] = parseInt(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("team_2_add_score")[0].firstChild.nodeValue);
			settings_result_data["category_data_list"][ii_category]["team_data"][2]["num"] = parseFloat(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("team_3_data_num")[0].firstChild.nodeValue);
			settings_result_data["category_data_list"][ii_category]["team_data"][2]["add_score"] = parseInt(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("team_3_add_score")[0].firstChild.nodeValue);
			
			try{
				settings_result_data["category_data_list"][ii_category]["unit"] = xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[ii_category].getElementsByTagName("unit")[0].firstChild.nodeValue;
			}
			catch{
				settings_result_data["category_data_list"][ii_category]["unit"] = "";
			}
		}

		// settings_result_data["category_data_list"][0]["category_name"] = xml.getElementsByTagName("category_list")[0]["category_name"].firstChild.nodeValue;
		// debug_set_message(xml.getElementsByTagName("category_list")[0].getElementsByTagName("CategoryClass")[0].getElementsByTagName("category_name")[0].firstChild.nodeValue);

		let tmp;
		tmp = getdata('plugin_version');
		if (tmp != "") { version = tmp; }

		

		init_step++;
		is_init_running = false;
	});

	getxml.fail(function (error) {
		alert("設定ファイルが読み込めませんでした。\n初期値(第10回目結果)で表示します。");

		settings_result_data["title"] = "結果発表！";

		// デフォルト値を入れる
		for (var ii_category = 0; ii_category < 3 ; ii_category++){
			settings_result_data["category_data_list"][ii_category] = {};
			settings_result_data["category_data_list"][ii_category]["team_data"] = [];
			for (var ii_team = 0; ii_team < 3 ; ii_team++){
				settings_result_data["category_data_list"][ii_category]["team_data"][ii_team] = {};
			}	
		}
		
		settings_result_data["category_data_list"][0]["category_name"] = "投票数";
		settings_result_data["category_data_list"][0]["decimal_places"] = 0;
		
		settings_result_data["category_data_list"][0]["team_data"][0]["num"] = 133;
		settings_result_data["category_data_list"][0]["team_data"][0]["add_score"] = 15;
		settings_result_data["category_data_list"][0]["team_data"][1]["num"] = 115;
		settings_result_data["category_data_list"][0]["team_data"][1]["add_score"] = 10;
		settings_result_data["category_data_list"][0]["team_data"][2]["num"] = 56;
		settings_result_data["category_data_list"][0]["team_data"][2]["add_score"] = 5;
		settings_result_data["category_data_list"][0]["unit"] = "チーム";

		settings_result_data["category_data_list"][1]["category_name"] = "金イクラの平均個数";
		settings_result_data["category_data_list"][1]["decimal_places"] = 2;

		settings_result_data["category_data_list"][1]["team_data"][0]["num"] = 391.15;
		settings_result_data["category_data_list"][1]["team_data"][0]["add_score"] = 15;
		settings_result_data["category_data_list"][1]["team_data"][1]["num"] = 383.17;
		settings_result_data["category_data_list"][1]["team_data"][1]["add_score"] = 10;
		settings_result_data["category_data_list"][1]["team_data"][2]["num"] = 330.66;
		settings_result_data["category_data_list"][1]["team_data"][2]["add_score"] = 5;
		settings_result_data["category_data_list"][1]["unit"] = "個";

		settings_result_data["category_data_list"][2]["category_name"] = "金ウロコの総枚数";
		settings_result_data["category_data_list"][2]["decimal_places"] = 0;

		settings_result_data["category_data_list"][2]["team_data"][0]["num"] = 37;
		settings_result_data["category_data_list"][2]["team_data"][0]["add_score"] = 15;
		settings_result_data["category_data_list"][2]["team_data"][1]["num"] = 29;
		settings_result_data["category_data_list"][2]["team_data"][1]["add_score"] = 10;
		settings_result_data["category_data_list"][2]["team_data"][2]["num"] = 9;
		settings_result_data["category_data_list"][2]["team_data"][2]["add_score"] = 5;
		settings_result_data["category_data_list"][2]["unit"] = "枚";

		init_step++;
		is_init_running = false;
	});
}

function canvas_init(){
	/*
	disp_w = window.innerWidth;
	if (disp_w < 200){
		disp_w = 200;
	}
	/**/

	// イベント
	let canvas = document.getElementById('canvas');
	// canvas.addEventListener('click', mouse_click);
	canvas.addEventListener('mousedown', mouse_down);
	canvas.addEventListener('mouseup', mouse_up);
	canvas.addEventListener('mousemove', onMouseMove);

	// Stageオブジェクトを作成します
	stage = new createjs.Stage("canvas");

	init_step++;
	is_init_running = false;
}

function draw_object_init(){
	// 各種描画用オブジェクトの初期化
	team_count = 3
	
	// is_topの設定
	for (var ii_category = 0; ii_category<settings_result_data["category_data_list"].length ; ii_category++){
		var max_score = 0;
		
		for (var ii_team = 0; ii_team<team_count; ii_team++){
			if (max_score < settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["num"]){
				max_score = settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["num"];
			}
		}
		
		for (var ii_team = 0; ii_team<team_count; ii_team++){
			if (max_score == settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["num"]){
				settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["is_top"] = true;
			}
			else{
				settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["is_top"] = false;
			}
		}

		for (var ii_team = 0; ii_team<team_count; ii_team++){
			settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["score_img_path"] = "data/pic/score_img/team_" + (ii_team + 1) + "_0" + (ii_category + 1) + ".png";
		}
	}

	// 背景
	var shape = new createjs.Shape();
	// shape.graphics.beginFill("Blue"); // 赤色で描画するように設定
	shape.graphics.beginFill("Black"); // 赤色で描画するように設定
	shape.graphics.drawRect(0, 0, disp_w, disp_h); // 長方形を描画
	container_bg_01.addChild(shape);

	var img_bg_monitor = new Image();
	img_bg_monitor.onload = function(){
		bmp_bg_monitor.x = disp_w / 2 - img_bg_monitor.width / 2 - 10;
		bmp_bg_monitor.y = disp_h / 2 - img_bg_monitor.height / 2 - 60;
	}
	img_bg_monitor.src = "data/pic/bg_monitor.png";

	
	for (var ii_team = 0 ; ii_team < 3 ; ii_team++){
		team_data[ii_team] = {};
	}

	for (var ii_team = 0 ; ii_team < 3 ; ii_team++){
		team_data[ii_team]["bg"] = {};
		team_data[ii_team]["bg"]["img"] = new Image();
		team_data[ii_team]["bg"]["img"].onload = function(){
			/*
			team_data[ii_team]["bg"]["bmp"].x = team_localtion_left[ii_team];
			team_data[ii_team]["bg"]["bmp"].y = 100;
			// team_data[ii_team]["bg"]["bmp"].scaleX = (team_localtion_left[ii_team + 1] - team_localtion_left[ii_team]) / team_data[ii_team]["bg"]["img"].width;
			// team_data[ii_team]["bg"]["bmp"].scaleY = disp_h / team_data[ii_team]["bg"]["img"].height;
			team_data[ii_team]["bg"]["bmp"].scaleX = 0.5;
			team_data[ii_team]["bg"]["bmp"].scaleY = 0.5;
			/**/
		}
		team_data[ii_team]["bg"]["img"].src = "data/pic/monitor_team_" + (ii_team + 1) + ".png";
		team_data[ii_team]["bg"]["bmp"] = new createjs.Bitmap(team_data[ii_team]["bg"]["img"]);

		container_bg_01.addChild(team_data[ii_team]["bg"]["bmp"]);
	}

	
	for (var ii_team = 0 ; ii_team < 3 ; ii_team++){
		team_data[ii_team]["bg"]["bmp"].x = team_localtion_left[ii_team];
		team_data[ii_team]["bg"]["bmp"].y = 100;
		// team_data[ii_team]["bg"]["bmp"].scaleX = (team_localtion_left[ii_team + 1] - team_localtion_left[ii_team]) / team_data[ii_team]["bg"]["img"].width;
		// team_data[ii_team]["bg"]["bmp"].scaleY = disp_h / team_data[ii_team]["bg"]["img"].height;

		team_data[ii_team]["bg"]["bmp"].scaleX = (team_localtion_left[ii_team + 1] - team_localtion_left[ii_team]) / 640;
		team_data[ii_team]["bg"]["bmp"].scaleY = 525 / 1080;
		
		// team_data[ii_team]["bg"]["bmp"].scaleY = disp_h / team_data[ii_team]["bg"]["img"].height;
	}
	/**/

	for (var ii_team = 0 ; ii_team < 3 ; ii_team++){

		team_data[ii_team]["light_data"] = {}
		team_data[ii_team]["light_data"]["shape"] = new createjs.Shape();
		team_data[ii_team]["light_data"]["shape"].graphics.beginFill("Black");
		team_data[ii_team]["light_data"]["shape"].graphics.drawRect(team_localtion_left[ii_team], 0, team_localtion_left[ii_team + 1] - team_localtion_left[ii_team], disp_h); // 長方形を描画
		team_data[ii_team]["light_data"]["shape"].alpha = 0.4;
		team_data[ii_team]["light_data"]["shape"].visible = false;
		container_bg_01.addChild(team_data[ii_team]["light_data"]["shape"]);
	}

	var img_bg_monitor_upper = new Image();
	img_bg_monitor_upper.onload = function(){
		bmp_bg_monitor_upper.x = 168;
		bmp_bg_monitor_upper.y = 80;
		bmp_bg_monitor_upper.scaleX = 936 / img_bg_monitor_upper.width;
		bmp_bg_monitor_upper.scaleY = bmp_bg_monitor_upper.scaleX;
	}
	img_bg_monitor_upper.src = "data/pic/monitor_upper.png";
	bmp_bg_monitor_upper = new createjs.Bitmap(img_bg_monitor_upper);

	container_bg_01.addChild(bmp_bg_monitor_upper);

	stage.addChild(container_bg_01);
	

	for (var ii_team = 0 ; ii_team < 3 ; ii_team++){
		
		// team_data[0]["text_band_num"];
		// team_data[0]["text_band_add_score"];
		// team_data[0]["img_num"];
		// team_data[0]["bmp_num"];
		// team_data[0]["img_add_score"]
		// team_data[0]["bmp_add_score"]
		team_data[ii_team]["adjust_x"] = (ii_team - 1) * 300;

		team_data[ii_team]["category_data"] = []
		
		// 最終結果
		for (var ii_category = 0; ii_category < settings_result_data["category_data_list"].length; ii_category++){
			team_data[ii_team]["category_data"][ii_category] = {}
			// team_data[ii_team]["category_data"][ii_category]["img_result"]
			// team_data[ii_team]["category_data"][ii_category]["bmp_result"]
			// team_data[ii_team]["category_data"][ii_category]["container_result"]

			try {
				team_data[ii_team]["category_data"][ii_category]["container_result"] = new createjs.Container();
			} catch (error) {
				alert(error);
			}
			
			team_data[ii_team]["category_data"][ii_category]["img_result"] = new Image();
			team_data[ii_team]["category_data"][ii_category]["img_result"].onload = function(){
			};
			team_data[ii_team]["category_data"][ii_category]["img_result"].src = settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["score_img_path"];
			
			team_data[ii_team]["category_data"][ii_category]["bmp_result"] = new createjs.Bitmap(team_data[ii_team]["category_data"][ii_category]["img_result"]);
			team_data[ii_team]["category_data"][ii_category]["bmp_result"].visible = false;
			team_data[ii_team]["category_data"][ii_category]["container_result"].addChild(team_data[ii_team]["category_data"][ii_category]["bmp_result"]);

			container_all_result_score.addChild(team_data[ii_team]["category_data"][ii_category]["container_result"]);
		}
	}
	container_monitor.addChild(container_all_result_score);

	// 黒帯

	// 黒帯 基礎
	var shape_band = new createjs.Shape();
	shape_band.graphics.beginFill("black");
	shape_band.alpha = 0.8;
	shape_band.graphics.drawRect(0, band_center_y - (band_single_h / 2), disp_w, band_single_h);
	container_band_base_single.addChild(shape_band);

	text_band = new createjs.Text("投票数", "50px 'Splatfont'", "white");
	text_band.textAlign = "center";
	text_band.x = disp_w / 2;
	text_band.y = band_center_y + band_single_text_adjust_y;
	container_band_base_single.addChild(text_band);

	container_monitor.addChild(container_band_base_single);

	container_band_base_single.visible = false;

	// 幕 チーム
	var shape_band_team = new createjs.Shape();
	shape_band_team.graphics.beginFill("black");
	shape_band_team.alpha = 0.8;
	shape_band_team.graphics.drawRect(0, band_center_y - (band_team_h / 2), disp_w, band_team_h);
	container_band_base_team.addChild(shape_band_team);

	for (var ii_team = 0 ; ii_team < 3 ; ii_team++){
		// container
		team_data[ii_team]["container_band"] = new createjs.Container();

		// image 実スコア
		team_data[ii_team]["img_num"] = new Image();
		team_data[ii_team]["img_num"].onload = function(){
			// team_data[ii_team]["bmp_num"].x = disp_w / 2 + team_data[ii_team]["adjust_x"] - team_data[ii_team]["img_num"].width / 2;
			// team_data[ii_team]["bmp_num"].y = band_center_y - team_data[ii_team]["img_num"].height / 2;
		}
		team_data[ii_team]["img_num"].src = "./data/pic/splat_0" + (ii_team + 1) + ".png";
		team_data[ii_team]["bmp_num"] = new createjs.Bitmap(team_data[ii_team]["img_num"]);
		team_data[ii_team]["bmp_num"].alpha = 0.0;
		team_data[ii_team]["container_band"].addChild(team_data[ii_team]["bmp_num"]);

		
		

		// image 加算スコア
		team_data[ii_team]["img_add_score"] = new Image();
		team_data[ii_team]["img_add_score"].onload = function(){
			// team_data[ii_team]["bmp_add_score"].x = disp_w / 2 + team_data[ii_team]["adjust_x"] - team_data[ii_team]["img_add_score"].width / 2 * add_score_img_scale;
			// team_data[ii_team]["bmp_add_score"].y = band_center_y - team_data[ii_team]["img_add_score"].height / 2 * add_score_img_scale;
		}
		team_data[ii_team]["img_add_score"].src = "./data/pic/splat_add_score_0" + (ii_team + 1) + ".png";
		team_data[ii_team]["bmp_add_score"] = new createjs.Bitmap(team_data[ii_team]["img_add_score"]);
		team_data[ii_team]["bmp_add_score"].alpha = 0.0;
		team_data[ii_team]["container_band"].addChild(team_data[ii_team]["bmp_add_score"]);


		// text 実スコア
		team_data[ii_team]["text_band_num"] = new createjs.Text("0", band_font_team_size + "px 'Splatfont 2'", "white");
		team_data[ii_team]["text_band_num"].textAlign = "center";
		team_data[ii_team]["text_band_num"].x = disp_w / 2 + team_data[ii_team]["adjust_x"];
		team_data[ii_team]["text_band_num"].y = band_center_y + band_team_text_adjust_y;
		team_data[ii_team]["container_band"].addChild(team_data[ii_team]["text_band_num"]);

		
		// text 加算スコア
		team_data[ii_team]["text_band_add_score"] = new createjs.Text("0", band_font_team_size + "px 'Splatfont 2'", "white");
		team_data[ii_team]["text_band_add_score"].textAlign = "center";
		team_data[ii_team]["text_band_add_score"].x = disp_w / 2 + team_data[ii_team]["adjust_x"];
		team_data[ii_team]["text_band_add_score"].y = band_center_y + band_team_text_adjust_y;
		team_data[ii_team]["text_band_add_score"].visible = false;
		team_data[ii_team]["container_band"].addChild(team_data[ii_team]["text_band_add_score"]);
		

		container_band_base_team.addChild(team_data[ii_team]["container_band"]);
	}
	container_band_base_team.visible = false;
	container_monitor.addChild(container_band_base_team);

	stage.addChild(container_monitor);


	
 	


	var img_bg = new Image();
	img_bg.src = "./data/pic/bg_01.png";
	bmp_bg = new createjs.Bitmap(img_bg);
	container_bg_02.addChild(bmp_bg);
	
	

	var img_bg_line = new Image();
	img_bg_line.src = "./data/pic/bg_line.png";
	bmp_bg_line = new createjs.Bitmap(img_bg_line);
	bmp_bg_line.alpha = 0.0;
	container_bg_02.addChild(bmp_bg_line);

	
	for (var ii = 0; ii < symbol_num ; ii++){
		symbol_data[ii] = {}
		symbol_data[ii]["img"] = new Image();
		symbol_data[ii]["img"].src = "./data/pic/symbol.png";
		symbol_data[ii]["bmp"] = new createjs.Bitmap(symbol_data[ii]["img"]);
		
		symbol_data[ii]["bmp"].scaleX = symbol_scale;
		symbol_data[ii]["bmp"].scaleY = symbol_scale;
		symbol_data[ii]["bmp"].x = (disp_w / (symbol_num + 1)) * (ii + 1) - (symbol_data[ii]["img"].width * symbol_scale / 2);
		symbol_data[ii]["bmp"].y = (disp_h / 4) * ((ii % 2) * 2 + 1) + get_rand_num(-50, 50);
		
		symbol_data[ii]["rotation_add"] = ((ii % 2) * 2 - 1) / 5;
		
		container_symbol.addChild(symbol_data[ii]["bmp"]);
	}

	container_symbol.y = disp_h;
	
	container_bg_02.addChild(container_symbol);

	shape_white = new createjs.Shape();
	shape_white.graphics.beginFill("white"); // 赤色で描画するように設定
	shape_white.graphics.drawRect(0, 0, disp_w, disp_h); // 長方形を描画
	shape_white.alpha = 0.0;
	container_monitor.addChild(shape_white);
	
	mouse_image_init(container_bg_02);

	stage.addChild(container_bg_02);

	sound_button = new SoundClass(createjs, "data/sound/se_button.wav", "button");

	for (var ii = 0 ; ii < 4 ; ii++){
		var tmp = ii + 1;
		sound_result[ii] = new SoundClass(createjs, "data/sound/se_result_0" + String(tmp) + ".wav", "result_0" + String(tmp));
	}

	sound_allresult_score = new SoundClass(createjs, "data/sound/se_allresult_score.wav", "se_all_result_score");
	sound_allresult_result = new SoundClass(createjs, "data/sound/se_allresult_result.wav", "se_all_result_result");

	init_step++;
	is_init_running = false;
}



function debug_reflesh(){
	
	debug_add_list("display_state", debug_get_enum_text(DisplayEnum, display_state));
	debug_add_list("dc_state", debug_get_enum_text(DrawingCategoryEnum, dc_state));
	debug_add_list("dar_state", debug_get_enum_text(DrawingAllResultEnum, dar_state));

	debug_message_reflesh();
}

function reload(){
	location.reload();
}


let mouseX = 0;
let mouseY = 0;
function onMouseMove(event) {
	// mouseX = event.screenX;
	// mouseY = event.screenY;
	mouseX = event.offsetX;
	mouseY = event.offsetY;
	// moveAt(event.pageX, event.pageY);
	// debug_set_message(mouseX + ":" + mouseY);
}