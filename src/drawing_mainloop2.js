

var unit_pt_height = 25;
var height_max_score = 12;

var band_count = 0;
var band_count_max = 12;

var band_fontsize_count = 0;
var band_fontsize_count_max = 8;

var category_num = 0;

var allresult_fall_start_count_max = 2 * 60;
var allresult_fall_fall_count_max = 16;
var allresult_fall_stay_count_max = 32;

var allresult_count = 0;
var allresult_num_count_max = 1 * 60;
var allresult_stay_count_max = 100;

var line_count = 0;
var line_count_max = 10;

var keta = 3;

var all_result_data_list = []; // ii_team


var scale_mem = 1.0;


var SymbolEnum = {
	none: 0,
	start: 1,
	end: 2
}
var symbol_state = SymbolEnum.none;

var symbol_counter = 0;
var symbol_counter_max_start = 20;
var symbol_counter_max_end = 60;
var symbol_alpha_max = 0.6;





function main_loop2(){

	switch (display_state){
		case DisplayEnum.disp_load:
			if (mouse_get_next_step()){
				sound_button.play();

				display_state = DisplayEnum.disp_title;
				dc_state = DrawingCategoryEnum.dc_loop_init;
			}
			break;
		
		case DisplayEnum.disp_title:
			drawing_title();
			break;

		case DisplayEnum.disp_category_result:
			drawing_category_running();
			break;

		case DisplayEnum.disp_all_result:
			drawing_all_result_running();
			break;

		case DisplayEnum.disp_end:
			drawing_end();
			
			break;
	}
}

function drawing_title(){
	switch (dc_state){
		case DrawingCategoryEnum.dc_none:
			break;

		case DrawingCategoryEnum.dc_loop_init:
			text_band.text = settings_result_data["title"];

			band_count = band_count_max;
			container_band_base_single.visible = true;

			dc_state = DrawingCategoryEnum.dc_explanation;

			drawing_title();

			break;

		case DrawingCategoryEnum.dc_explanation:

			container_band_base_single.alpha = (band_count_max - band_count) / band_count_max;
			
			if (mouse_get_next_step()){
				sound_button.play();

				dc_state = DrawingCategoryEnum.dc_snare_roll;
				container_band_base_single.alpha = 0
				container_band_base_single.visible = false;

				// container_band_base_team.visible = true;

				light_now_team_num = 0;
				team_data[light_now_team_num]["light_data"]["shape"].visible = false;
				light_count = light_count_max;


				display_state = DisplayEnum.disp_category_result;
				dc_state = DrawingCategoryEnum.dc_loop_init;
				category_num = 0;
			}

			break;
		
		case DrawingCategoryEnum.dc_snare_roll:
			break;

		case DrawingCategoryEnum.dc_result:
			break;
	}
}

function drawing_category_running(){
	switch (dc_state){
		case DrawingCategoryEnum.dc_none:
			break;
		
		case DrawingCategoryEnum.dc_loop_init:
			// alert("aaa");
			text_band.text = settings_result_data["category_data_list"][category_num]["category_name"];

			dc_state = DrawingCategoryEnum.dc_explanation;

			keta = 0
			for (var ii_team = 0; ii_team<team_data.length; ii_team++){
				tmp_keta = String(Math.floor(settings_result_data["category_data_list"][category_num]["team_data"][ii_team]["num"])).length;
				if (keta < tmp_keta){
					keta = tmp_keta;
				}
			}
			
			for (var ii_team = 0; ii_team<team_data.length; ii_team++){
				team_data[ii_team]["text_band_add_score"].text = String(settings_result_data["category_data_list"][category_num]["team_data"][ii_team]["add_score"]) + "p"
				
				if (settings_result_data["category_data_list"][category_num]["team_data"][ii_team]["add_score"] > 0){
					team_data[ii_team]["bmp_add_score"].visible = true;
				}else{
					team_data[ii_team]["bmp_add_score"].visible = false;
				}

				team_data[ii_team]["light_data"]["shape"].visible = true;
			}
			band_count = band_count_max;
			container_band_base_single.visible = true;

			drawing_category_running();
			
			break;
		
		case DrawingCategoryEnum.dc_explanation:
			

			//if (band_count > 0){
			//	band_count -= 1;
			//}

			container_band_base_single.alpha = (band_count_max - band_count) / band_count_max;

			if (mouse_get_next_step()){
				sound_button.play();

				dc_state = DrawingCategoryEnum.dc_snare_roll;
				container_band_base_single.alpha = 0
				container_band_base_single.visible = false;

				container_band_base_team.visible = true;

				light_now_team_num = 0;
				team_data[light_now_team_num]["light_data"]["shape"].visible = false;
				light_count = light_count_max;
			}
			
			break;

		case DrawingCategoryEnum.dc_snare_roll:
			
			min = Math.pow(10, keta - 1);
			max = Math.pow(10, keta);
			
			for (var ii_team = 0; ii_team<team_data.length; ii_team++){
				team_data[ii_team]["text_band_num"].text = String(get_rand_num_float(min, max - 1).toFixed(settings_result_data["category_data_list"][category_num]["decimal_places"])) + settings_result_data["category_data_list"][category_num]["unit"];
			}
			
			if (mouse_get_next_step()){
				var tmp = category_num;
				if (tmp >= sound_result.length){
					tmp = sound_result.length - 1;
				}
				sound_result[tmp].play();
				dc_state = DrawingCategoryEnum.dc_result;

				for (var ii_team = 0; ii_team<team_data.length; ii_team++){
					team_data[ii_team]["text_band_num"].text = String(settings_result_data["category_data_list"][category_num]["team_data"][ii_team]["num"].toFixed(settings_result_data["category_data_list"][category_num]["decimal_places"])) + settings_result_data["category_data_list"][category_num]["unit"];
				}
				
				band_fontsize_count = band_fontsize_count_max;
				line_count = line_count_max;

				white_start();
			}
			
			break;

		case DrawingCategoryEnum.dc_result:

			// if (band_fontsize_count > 0){
			// 	band_fontsize_count -= 1;
			// }

			if (band_fontsize_count >= 0) {
				shinkoudo = (band_fontsize_count_max - band_fontsize_count) / band_fontsize_count_max;
				tmp_font_size = ((Math.sin(shinkoudo * Math.PI)) * band_font_team_size) + band_font_team_size;
				
				for (var ii_team = 0; ii_team<team_data.length; ii_team++){
					if (settings_result_data["category_data_list"][category_num]["team_data"][ii_team]["is_top"]){
						team_data[ii_team]["text_band_num"].font = tmp_font_size + "px 'Splatfont 2'";
						team_data[ii_team]["bmp_num"].alpha = shinkoudo;
						team_data[ii_team]["bmp_num"].scaleX = (Math.sin(shinkoudo * Math.PI)) + 1;
						team_data[ii_team]["bmp_num"].x = (disp_w / 2 + team_data[ii_team]["adjust_x"]) - (team_data[ii_team]["img_num"].width * team_data[ii_team]["bmp_num"].scaleX / 2);
						team_data[ii_team]["bmp_num"].scaleY = (Math.sin(shinkoudo * Math.PI)) + 1;
						team_data[ii_team]["bmp_num"].y = (band_center_y) - (team_data[ii_team]["img_num"].height * team_data[ii_team]["bmp_num"].scaleY / 2);

						team_data[ii_team]["light_data"]["shape"].visible = false;
					}
					else{
						team_data[ii_team]["light_data"]["shape"].visible = true;
					}
					
					if (settings_result_data["category_data_list"][category_num]["team_data"][ii_team]["add_score"] > 0){
						team_data[ii_team]["text_band_add_score"].visible = true;
						team_data[ii_team]["text_band_add_score"].font = (tmp_font_size * 1) + "px 'Splatfont 2'";
						team_data[ii_team]["text_band_add_score"].x = (disp_w / 2 + team_data[ii_team]["adjust_x"]) - 100;
						team_data[ii_team]["text_band_add_score"].y = band_center_y - 100;
					
						team_data[ii_team]["bmp_add_score"].alpha = shinkoudo;
						team_data[ii_team]["bmp_add_score"].scaleX = ((Math.sin(shinkoudo * Math.PI)) + 1) * add_score_img_scale;
						team_data[ii_team]["bmp_add_score"].x = team_data[ii_team]["text_band_add_score"].x - (team_data[ii_team]["img_add_score"].width * team_data[ii_team]["bmp_add_score"].scaleX / 2);
						team_data[ii_team]["bmp_add_score"].scaleY = ((Math.sin(shinkoudo * Math.PI)) + 1) * add_score_img_scale;
						team_data[ii_team]["bmp_add_score"].y = team_data[ii_team]["text_band_add_score"].y - (team_data[ii_team]["img_add_score"].height * team_data[ii_team]["bmp_add_score"].scaleY / 2) + 25;
					}
					
				}
			}

			if (mouse_get_next_step()){
				sound_button.play();

				band_fontsize_count = 0;
				shinkoudo = 1.0;
				tmp_font_size = band_font_team_size;

				for (var ii_team = 0; ii_team<team_data.length; ii_team++){
					team_data[ii_team]["text_band_num"].font = tmp_font_size + "px 'Splatfont 2'";
					
					team_data[ii_team]["text_band_add_score"].font = tmp_font_size + "px 'Splatfont 2'";
					team_data[ii_team]["text_band_add_score"].visible = false;

					team_data[ii_team]["bmp_num"].alpha = 0.0;
					team_data[ii_team]["bmp_num"].scaleX = 1;
					team_data[ii_team]["bmp_num"].scaleY = 1;

					team_data[ii_team]["bmp_add_score"].alpha = 0.0;
					team_data[ii_team]["bmp_add_score"].scaleX = 1;
					team_data[ii_team]["bmp_add_score"].scaleY = 1;

					team_data[ii_team]["light_data"]["shape"].visible = true;
				}

				container_band_base_team.visible = false;

				category_num += 1;

				if (category_num < settings_result_data["category_data_list"].length){
					dc_state = DrawingCategoryEnum.dc_loop_init;
				}
				else{
					category_num = 0;

					display_state = DisplayEnum.disp_all_result;
					dar_state = DrawingAllResultEnum.dar_init;
					dc_state = DrawingCategoryEnum.dc_none;
				}
			}
			
			break;
	}
}


function drawing_all_result_running(){
	switch (dar_state){
		case DrawingAllResultEnum.dar_none:
			break;

		case DrawingAllResultEnum.dar_init:
			text_band.text = "最終結果！";

			category_num = 0;

			band_count = band_count_max;
			container_band_base_single.visible = true;

			for(var ii_team =0 ; ii_team < team_data.length ; ii_team++){
				all_result_data_list[ii_team] = {};
				all_result_data_list[ii_team]["scaleY"] = []
				all_result_data_list[ii_team]["top_list"] = []
				all_result_data_list[ii_team]["score"] = 0;
				all_result_data_list[ii_team]["is_top"] = false;
			}

			for (var ii_team = 0; ii_team<team_data.length; ii_team++){
				var mem = 560;

				for (var ii_category = 0; ii_category < settings_result_data["category_data_list"].length ; ii_category++){
					
					hh = settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["add_score"] * unit_pt_height;
					
					team_data[ii_team]["category_data"][ii_category]["bmp_result"].y = -(unit_pt_height * 25);
					team_data[ii_team]["category_data"][ii_category]["bmp_result"].x = team_localtion_left[ii_team];
					team_data[ii_team]["category_data"][ii_category]["bmp_result"].scaleX = ((team_localtion_left[ii_team + 1] - team_localtion_left[ii_team]) / team_data[ii_team]["category_data"][ii_category]["img_result"].width);
					team_data[ii_team]["category_data"][ii_category]["bmp_result"].scaleY = (hh / team_data[ii_team]["category_data"][ii_category]["img_result"].height);
					
					team_data[ii_team]["category_data"][ii_category]["bmp_result"].visible = false;
					
					all_result_data_list[ii_team]["scaleY"][ii_category] = team_data[ii_team]["category_data"][ii_category]["bmp_result"].scaleY;
					all_result_data_list[ii_team]["top_list"][ii_category] = {}
					all_result_data_list[ii_team]["top_list"][ii_category]["top_before"] = team_data[ii_team]["category_data"][ii_category]["bmp_result"].y
					all_result_data_list[ii_team]["top_list"][ii_category]["top_after"] = mem - hh
					mem = all_result_data_list[ii_team]["top_list"][ii_category]["top_after"];
					

					all_result_data_list[ii_team]["score"] += settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["add_score"];

					tmp_font_size = band_font_team_size;

					
				}

				team_data[ii_team]["category_data"][0]["bmp_result"].visible = true;
				team_data[ii_team]["bmp_add_score"].visible = true;

				team_data[ii_team]["text_band_add_score"].text = "勝利！"
				team_data[ii_team]["text_band_add_score"].font = (tmp_font_size * 2) + "px 'Splatfont 2'";
				team_data[ii_team]["text_band_add_score"].x = (disp_w / 2 + team_data[ii_team]["adjust_x"]) - 100;
				team_data[ii_team]["text_band_add_score"].y = band_center_y - 100;
				
			}

			

			max_score = 0
			for(var ii_team = 0 ; ii_team < all_result_data_list.length ; ii_team++){
				if (max_score < all_result_data_list[ii_team]["score"]){
					max_score = all_result_data_list[ii_team]["score"];
				}
			}
			for(var ii_team = 0 ; ii_team < all_result_data_list.length ; ii_team++){
				if (max_score == all_result_data_list[ii_team]["score"]){
					all_result_data_list[ii_team]["is_top"] = true;
				}

				team_data[ii_team]["text_band_num"].text = all_result_data_list[ii_team]["score"] + "p";
			}

			scale_mem = 1.0

			dar_state = DrawingAllResultEnum.dar_explanation;

			drawing_all_result_running();
			break;

		case DrawingAllResultEnum.dar_explanation:
			// if (band_count > 0){
			// 	band_count -= 1;
			// }

			container_band_base_single.alpha = (band_count_max - band_count) / band_count_max;

			if (mouse_get_next_step()){
				sound_button.play();
				dar_state = DrawingAllResultEnum.dar_score_fall_start;
				container_band_base_single.alpha = 0
				container_band_base_single.visible = false;

				allresult_count = allresult_fall_start_count_max;
				category_num = 0;

				mouse_set_allow(false);
			}
			
			break;

		case DrawingAllResultEnum.dar_score_fall_start:
			// allresult_count -= 1;

			if (allresult_count < 0){
				dar_state = DrawingAllResultEnum.dar_score_fall_01;
				allresult_count = allresult_fall_fall_count_max;
			}

			break;

		case DrawingAllResultEnum.dar_score_fall_01:
			// allresult_count -= 1;

			
			
			shinkoudo = (allresult_fall_fall_count_max - allresult_count) / allresult_fall_fall_count_max;

			for (var ii_team = 0; ii_team<team_data.length; ii_team++){
				team_data[ii_team]["category_data"][category_num]["bmp_result"].y = (all_result_data_list[ii_team]["top_list"][category_num]["top_after"] - all_result_data_list[ii_team]["top_list"][category_num]["top_before"]) * shinkoudo + all_result_data_list[ii_team]["top_list"][category_num]["top_before"];
			}
			

			var max_score = 0;
			for (var ii_team = 0; ii_team<team_data.length; ii_team++){
				var score = 0;
				for (var ii_category = 0; ii_category<=category_num ; ii_category++){
					score += settings_result_data["category_data_list"][ii_category]["team_data"][ii_team]["add_score"];
				}
				if (max_score < score){
					max_score = score;
				}
			}
			
			scale = 1.0
			if (max_score > height_max_score){
				scale = (height_max_score / max_score);

				for (var ii_team = 0; ii_team<team_data.length; ii_team++){
					mem = 560;
					for (var ii_category = 0; ii_category <= category_num ; ii_category++){
						team_data[ii_team]["category_data"][ii_category]["bmp_result"].scaleY = all_result_data_list[ii_team]["scaleY"][ii_category] * (shinkoudo * (- scale_mem + 1) + scale_mem) - (all_result_data_list[ii_team]["scaleY"][ii_category] - all_result_data_list[ii_team]["scaleY"][ii_category] * scale) * (shinkoudo);
						hh = team_data[ii_team]["category_data"][ii_category]["img_result"].height * team_data[ii_team]["category_data"][ii_category]["bmp_result"].scaleY;

						team_data[ii_team]["category_data"][ii_category]["bmp_result"].y = mem - hh;
						mem = mem - hh;
					}

					team_data[ii_team]["category_data"][category_num]["bmp_result"].y = (mem - all_result_data_list[ii_team]["top_list"][category_num]["top_before"]) * shinkoudo + all_result_data_list[ii_team]["top_list"][category_num]["top_before"];
				}
			}
			

			if (allresult_count <= 0){
				dar_state = DrawingAllResultEnum.dar_score_fall_02;
				allresult_count = allresult_fall_stay_count_max;

				var tmp = category_num;
				if (tmp >= sound_result.length){
					tmp = sound_result.length - 1;
				}
				sound_result[tmp].play();

				line_count = line_count_max;

				white_start();

				scale_mem = scale;
				
			}

			break;

		case DrawingAllResultEnum.dar_score_fall_02:

			// allresult_count -= 1;

			if (allresult_count < 0){

				category_num += 1;
				
				if (category_num < settings_result_data["category_data_list"].length){
					dar_state = DrawingAllResultEnum.dar_score_fall_01;
					allresult_count = allresult_fall_fall_count_max;

					for (var ii_team = 0; ii_team<team_data.length; ii_team++){
						team_data[ii_team]["category_data"][category_num]["bmp_result"].visible = true;
					}
				}
				else{
					dar_state = DrawingAllResultEnum.dar_score_stay;
					allresult_count = allresult_num_count_max;
				}
			}
			
			break;

		case DrawingAllResultEnum.dar_score_stay:
			// allresult_count -= 1;

			if (allresult_count < 0){
				dar_state = DrawingAllResultEnum.dar_result;
				allresult_count = allresult_stay_count_max;
				sound_allresult_score.play();

				line_count = line_count_max;
				white_start();
				
				container_band_base_team.visible = true;
				band_fontsize_count = band_fontsize_count_max;
			}
			
			break;

		case DrawingAllResultEnum.dar_result:

			// if (band_fontsize_count > 0){
			// 	band_fontsize_count -= 1;
			// }

			if (band_fontsize_count >= 0) {

				shinkoudo = (band_fontsize_count_max - band_fontsize_count) / band_fontsize_count_max;
				tmp_font_size = ((Math.sin(shinkoudo * Math.PI)) * band_font_team_size) + band_font_team_size;


				for (var ii_team = 0; ii_team<team_data.length; ii_team++){
					if (all_result_data_list[ii_team]["is_top"]){
						team_data[ii_team]["text_band_num"].font = tmp_font_size + "px 'Splatfont 2'";
						team_data[ii_team]["bmp_num"].alpha = shinkoudo;
						team_data[ii_team]["bmp_num"].scaleX = (Math.sin(shinkoudo * Math.PI)) + 1;
						team_data[ii_team]["bmp_num"].x = (disp_w / 2 + team_data[ii_team]["adjust_x"]) - (team_data[ii_team]["img_num"].width * team_data[ii_team]["bmp_num"].scaleX / 2);
						team_data[ii_team]["bmp_num"].scaleY = (Math.sin(shinkoudo * Math.PI)) + 1;
						team_data[ii_team]["bmp_num"].y = (band_center_y) - (team_data[ii_team]["img_num"].height * team_data[ii_team]["bmp_num"].scaleY / 2);
					}
				}
			}

			// allresult_count -= 1;

			if (allresult_count < 0){
				sound_allresult_result.play();

				display_state = DisplayEnum.disp_end;
				dar_state = DrawingAllResultEnum.dar_none;
				
				symbol_counter = symbol_counter_max_start;
				symbol_state = SymbolEnum.start;
				container_symbol.alpha = symbol_alpha_max;
				container_symbol.visible = true;
				container_symbol.y = disp_h;

				for (var ii_team = 0; ii_team<team_data.length; ii_team++){
					if (all_result_data_list[ii_team]["is_top"]){
						team_data[ii_team]["text_band_add_score"].visible = true;
					}
				}

				band_fontsize_count = band_fontsize_count_max;

				for (var ii = 0;ii<symbol_num;ii++){
					symbol_data[ii]["bmp"].rotation = get_rand_num(-20, 20);

					symbol_data[ii]["bmp"].regX = symbol_data[ii]["img"].width / 2;
					symbol_data[ii]["bmp"].regY = symbol_data[ii]["img"].height / 2;
				}

				white_start();

				// let canvas = document.getElementById('canvas').getContext("2d");
				// canvas.save();
				mouse_set_allow(true);
			}
			
			break;
	}
}


function drawing_end(){

	switch (symbol_state){
		case SymbolEnum.none:
			break;

		case SymbolEnum.start:
			// symbol_counter -= 1;
			shinkoudo = (symbol_counter_max_start - symbol_counter) / symbol_counter_max_start;
			
			container_symbol.y = disp_h - (Math.sin(shinkoudo * Math.PI / 2) * disp_h);

			for (var ii = 0;ii<symbol_num;ii++){
				symbol_data[ii]["bmp"].rotation += symbol_data[ii]["rotation_add"]
			}

			if (symbol_counter < 0){
				symbol_state = SymbolEnum.end;
				symbol_counter = symbol_counter_max_end;
			}

			break;

		case SymbolEnum.end:
			// symbol_counter -= 1;
			shinkoudo = (symbol_counter_max_end - symbol_counter) / symbol_counter_max_end;

			container_symbol.y -= 1;
			container_symbol.alpha = (1 - shinkoudo) * symbol_alpha_max;

			for (var ii = 0;ii<symbol_num;ii++){
				symbol_data[ii]["bmp"].rotation += symbol_data[ii]["rotation_add"];
			}
			

			if (symbol_counter < 0){
				symbol_state = SymbolEnum.none;
			}

			break;
	}

	if (band_fontsize_count >= 0) {
		shinkoudo = (band_fontsize_count_max - band_fontsize_count) / band_fontsize_count_max;
		tmp_font_size = ((Math.sin(shinkoudo * Math.PI)) * band_font_team_size) + band_font_team_size;

		for (var ii_team = 0; ii_team<team_data.length; ii_team++){
			if (all_result_data_list[ii_team]["is_top"]){
				team_data[ii_team]["text_band_add_score"].visible = true;
				team_data[ii_team]["text_band_add_score"].font = (tmp_font_size * 1.5) + "px 'Splatfont 2'";
				team_data[ii_team]["text_band_add_score"].x = (disp_w / 2 + team_data[ii_team]["adjust_x"]) - 100;
				team_data[ii_team]["text_band_add_score"].y = band_center_y - 100;
			
				team_data[ii_team]["bmp_add_score"].alpha = shinkoudo;
				team_data[ii_team]["bmp_add_score"].scaleX = ((Math.sin(shinkoudo * Math.PI)) + 1) * add_score_img_scale * 2;
				team_data[ii_team]["bmp_add_score"].x = team_data[ii_team]["text_band_add_score"].x - (team_data[ii_team]["img_add_score"].width * team_data[ii_team]["bmp_add_score"].scaleX / 2);
				team_data[ii_team]["bmp_add_score"].scaleY = ((Math.sin(shinkoudo * Math.PI)) + 1) * add_score_img_scale * 2;
				team_data[ii_team]["bmp_add_score"].y = team_data[ii_team]["text_band_add_score"].y - (team_data[ii_team]["img_add_score"].height * team_data[ii_team]["bmp_add_score"].scaleY / 2) + 40;

				team_data[ii_team]["light_data"]["shape"].visible = false;
			}
		}
	}

	if (mouse_get_next_step()){
		sound_button.play();

		if (is_display_state_loop){
			display_state = DisplayEnum.disp_load;

			symbol_state = SymbolEnum.none;
			container_symbol.visible = false;

			band_fontsize_count = 0;
			shinkoudo = 1.0;
			tmp_font_size = band_font_team_size;

			

			for (var ii_team = 0; ii_team<team_data.length; ii_team++){
				for (var ii_category = 0; ii_category<settings_result_data["category_data_list"].length; ii_category++){
					team_data[ii_team]["category_data"][ii_category]["bmp_result"].visible = false;
				}
				team_data[ii_team]["bmp_num"].alpha = 0.0;

				team_data[ii_team]["text_band_num"].font = tmp_font_size + "px 'Splatfont 2'";
				
				team_data[ii_team]["text_band_add_score"].font = tmp_font_size + "px 'Splatfont 2'";
				team_data[ii_team]["text_band_add_score"].visible = false;

				team_data[ii_team]["bmp_add_score"].alpha = 0.0;

				team_data[ii_team]["light_data"]["shape"].visible = false;
			}

			container_band_base_team.visible = false;
		}
	}

}