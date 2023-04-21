
var is_all_mute = false;

// サウンド管理クラス
class SoundClass{
	constructor(cjs, soundfilepath, soundlabel) { /* コンストラクタ */
		this.cjs = cjs;
		this.voice_instance = null; // インスタンス、Stopするときに必要

		//this.filepath = soundfilepath; // ファイルパス
		this.sound_label = soundlabel; // サウンドを再生する時のラベル
		
		this.is_file = false; // 読み込み完了できたらtrueになります
		
		try{
			this.cjs.Sound.registerSound(soundfilepath, this.sound_label);
			this.is_file = true;
		}
		catch(e){
			//alert(e);
			this.is_file = false;
		}
	}

	play(){
		if (is_all_mute){
			return null;
		}
		if (!this.is_file) { return null; }

		this.voice_instance = this.cjs.Sound.play(this.sound_label);
		return this.voice_instance;
	}

	stop(){
		if (!this.is_file) { return; }
		if (this.voice_instance == null){ return;}

		this.voice_instance.stop();
	}
}