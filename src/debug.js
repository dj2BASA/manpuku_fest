
var debug_is_display = false;

// デバッグ用テキスト
var container_debug;
var debug_shape;
var debug_text;
var debug_text_mem;
var debug_text_list;

var debug_font_str = "16px serif"

var debug_ctx;

function debug_init(stage){
	debug_ctx = document.createElement('canvas').getContext('2d');

    container_debug = new createjs.Container();

	debug_shape = new createjs.Shape();
	debug_shape.graphics.beginFill("black"); // 赤色で描画するように設定
	debug_shape.graphics.drawRect(0, 0, 100, 100); // 長方形を描画
	debug_shape.alpha = 0.5;
	container_debug.addChild(debug_shape);

    debug_text = new createjs.Text("", debug_font_str, "white");
	container_debug.addChild(debug_text);

	stage.addChild(container_debug);

	// デバッグのときはtrueに、そうでないときはfalseにしてください
	container_debug.visible = debug_is_display;
}

function debug_message_reflesh(){
	debug_text.text = ""
	debug_text.text += "count: " + get_now_frame() + "\n";
	debug_text.text += "message: " + debug_text_mem + "\n";
	debug_text.text += debug_text_list

	var rect = debug_text.getBounds();
	debug_shape.graphics.clear();
	debug_shape.graphics.beginFill("black");
	debug_shape.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
}

function debug_set_message(msg){
	debug_text_mem = msg;
}

function debug_clear_list(){
	debug_text_list = ""
}

function debug_add_list(label, msg){
	debug_text_list += label + ": " + msg + "\n";
}

function debug_get_enum_text(enumdata, enumvalue){
	key = Object.keys(enumdata).reduce((r, k) => {
		return enumdata[k] == enumvalue ? k : r
	}, null);

	return "{ " + enumvalue + ", " + key + " }";
}