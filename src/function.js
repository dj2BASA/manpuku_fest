

// min以上、max未満の乱数
function get_rand_num(min, max){
	return Math.floor( Math.random() * (max - min) + min);
}

function get_rand_num_float(min, max){
	return (Math.random() * (max - min) + min);
}

function get_rand_num_avoidnum(min, max, avoidnum){
	let ans = Math.floor( Math.random() * (max - 1 - min) ) + min;
	if (ans >= avoidnum) {
		ans += 1;
	}
	return ans;
}



