
var white_counter = 0;
var white_counter_max = 20;

var light_now_team_num = 0;
var light_count = 0;
var light_count_max = 10;

function main_loop1(){


	switch (display_state){
		case DisplayEnum.disp_load:
			break;

		case DisplayEnum.disp_title:
			mainloop1_drawing_title_running();

		case DisplayEnum.disp_category_result:
			mainloop1_drawing_category_running();
			break;

		case DisplayEnum.disp_all_result:
			mainloop1_drawing_all_result_running();
			break;

		case DisplayEnum.disp_end:
			mainloop1_drawing_end();
			break;
	}

	if (white_counter > 0){
		white_counter -= 1;
		shinkoudo = (white_counter_max - white_counter) / white_counter_max;
		shape_white.alpha = (1 - shinkoudo) * 0.3;
	}

	if (line_count > 0){
		line_count -= 1;
		shinkoudo = (line_count_max - line_count) / line_count_max;
		bmp_bg_line.alpha = (1 - shinkoudo);
	}

	return;
}

function white_start(){
	white_counter = white_counter_max;
}


function mainloop1_drawing_title_running(){
	switch (dc_state){
		case DrawingCategoryEnum.dc_none:
			break;
		
		case DrawingCategoryEnum.dc_loop_init:
			break;
		
		case DrawingCategoryEnum.dc_explanation:
			
			if (band_count > 0){
				band_count -= 1;
			}
			
			break;

		case DrawingCategoryEnum.dc_snare_roll:
			
			light_count -= 1;

			if (light_count < 0){
				light_count = light_count_max;

				team_data[light_now_team_num]["light_data"]["shape"].visible = true;

				light_now_team_num += 1;
				if (light_now_team_num >= team_data.length){
					light_now_team_num = 0;
				}

				team_data[light_now_team_num]["light_data"]["shape"].visible = false;

			}

			break;

		case DrawingCategoryEnum.dc_result:

			if (band_fontsize_count > 0) {
				band_fontsize_count -= 1;
			}
			
			break;
	}
}


function mainloop1_drawing_category_running(){
	switch (dc_state){
		case DrawingCategoryEnum.dc_none:
			break;
		
		case DrawingCategoryEnum.dc_loop_init:
			break;
		
		case DrawingCategoryEnum.dc_explanation:
			
			if (band_count > 0){
				band_count -= 1;
			}
			
			break;

		case DrawingCategoryEnum.dc_snare_roll:
			
			light_count -= 1;

			if (light_count < 0){
				light_count = light_count_max;

				team_data[light_now_team_num]["light_data"]["shape"].visible = true;

				light_now_team_num += 1;
				if (light_now_team_num >= team_data.length){
					light_now_team_num = 0;
				}

				team_data[light_now_team_num]["light_data"]["shape"].visible = false;

			}

			break;

		case DrawingCategoryEnum.dc_result:

			if (band_fontsize_count > 0) {
				band_fontsize_count -= 1;
			}
			
			break;
	}
}

function mainloop1_drawing_all_result_running(){
	switch (dar_state){
		case DrawingAllResultEnum.dar_none:
			break;

		case DrawingAllResultEnum.dar_init:
			break;

		case DrawingAllResultEnum.dar_explanation:

			if (band_count > 0){
				band_count -= 1;
			}
			
			break;

		case DrawingAllResultEnum.dar_score_fall_start:

			allresult_count -= 1;

			break;

		case DrawingAllResultEnum.dar_score_fall_01:
			allresult_count -= 1;

			if (allresult_count < 0){
				allresult_count = 0;
			}

			break;

		case DrawingAllResultEnum.dar_score_fall_02:

			allresult_count -= 1;
			
			break;

		case DrawingAllResultEnum.dar_score_stay:

			allresult_count -= 1;
			

			break;

		case DrawingAllResultEnum.dar_result:

			if (band_fontsize_count > 0){
				band_fontsize_count -= 1;
			}

			allresult_count -= 1;
			
			break;
	}
}


function mainloop1_drawing_end(){

	switch (symbol_state){
		case SymbolEnum.none:
			break;

		case SymbolEnum.start:
			symbol_counter -= 1;
			break;

		case SymbolEnum.end:
			symbol_counter -= 1;

			break;
	}

	if (band_fontsize_count > 0){
		band_fontsize_count -= 1;
	}
}