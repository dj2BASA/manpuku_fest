
var is_next_step = false;
var is_mouse_allow = true;
var is_button_display = false;

var button_data = [];


function mouse_image_init(target_container){

    for (var ii = 0; ii<2 ; ii++){
        button_data[ii] = {}
        button_data[ii]["img"] = new Image();
        button_data[ii]["img"].src = "./data/pic/button_0" + (ii + 1) + ".png";
        button_data[ii]["bmp"] = new createjs.Bitmap(button_data[ii]["img"]);
        

        button_data[ii]["bmp"].x = 1200;
        button_data[ii]["bmp"].y = 640;

        // button_data[ii]["bmp"].visible = false;
        button_data[ii]["bmp"].alpha = 1.0;

        target_container.addChild(button_data[ii]["bmp"]);
    }

    button_data[0]["bmp"].alpha = 1.0;
    button_data[1]["bmp"].alpha = 0.0;
}

function mouse_click(event){
    
}

function mouse_down(event){
    button_data[0]["bmp"].alpha = 0.0;
    button_data[1]["bmp"].alpha = 1.0;

    if (!is_mouse_allow){
        return;
    }
    
    if (is_mouse_allow){
        is_next_step = true;
    }
}

function mouse_up(event){
    button_data[0]["bmp"].alpha = 1.0;
    button_data[1]["bmp"].alpha = 0.0;

    return;
}

function mouse_set_allow(is_allow){
    is_mouse_allow = is_allow;

    for (var ii = 0; ii<2 ; ii++){
        button_data[ii]["bmp"].visible = is_mouse_allow;
    }
}

function mouse_get_next_step(){
    if (is_next_step){
        is_next_step = false;
        return true;
    }
    else{
        return false;
    }
}