Igeek.animate = {
	animate_hc:function(obj, json, fn) {
		var iCurrent = 0; //目标属性的当前值

		//如果timer存在，就把它清除掉，为什么？防止重复创建定时器
		if(obj.timer) {
			clearInterval(obj.timer);
		}

		//只有所有的样式值都已经变化到目标点，才能关闭定时器
		obj.timer = setInterval(function() {
			for(var styleName in json) {
				var iSpeed = 6; //速度

				//将样式是否非opacity区分
				if('opacity' === styleName) {
					iCurrent = +Igeek.util.getComputedStyleValue(obj, 'opacity');
					iSpeed = (json[styleName] - iCurrent) * 100 / 8;
					if(iSpeed > 0) {
						iSpeed = Math.ceil(iSpeed) / 100;
					} else {
						iSpeed = Math.floor(iSpeed) / 100;
					}
					//			console.log(iCurrent, iTarget, iSpeed);
					//当正向运动的时候如果当前值大于或等于目标值说明已经实现目标，定时器可以关闭：iSpeed > 0 && iCurrent >= iTarget
					//当逆向运动的时候如果当前值小于或等于目标值说明已经实现目标，定时器可以关闭：iSpeed < 0 && iCurrent <= iTarget
					if((iSpeed > 0 && iCurrent >= json[styleName]) || (iSpeed < 0 && iCurrent <= json[styleName])) {
						//					//如果这个属性已经达到终点，就把这个属性给删除
						delete json[styleName];
					} else {
						iContinue = false;
						obj.style.opacity = iCurrent + iSpeed; //DOM浏览器支持
						obj.style.filter = 'alpha(opacity=' + (iCurrent + iSpeed) * 100 + ')'; //非标准浏览器支持
					}
				} else {
					iCurrent = parseInt(Igeek.util.getComputedStyleValue(obj, styleName));
					//获取新的临时速度，根据速度的正负决定使用不同的取整的方法
					iSpeed = (json[styleName] - iCurrent) / 8;
					if(iSpeed > 0) {
						iSpeed = Math.ceil(iSpeed);
					} else {
						iSpeed = Math.floor(iSpeed);
					}
					//						console.log(iCurrent,iTarget,iSpeed);
					if((iCurrent >= json[styleName] && iSpeed > 0) || (iCurrent <= json[styleName] && iSpeed < 0)) { //停止定时器
						delete json[styleName];
					} else { //动画修改样式
						if((iCurrent + iSpeed > json[styleName] && iSpeed > 0) || (iCurrent + iSpeed < json[styleName] && iSpeed < 0)) {
							obj.style[styleName] = json[styleName] + 'px';
						} else {
							obj.style[styleName] = iCurrent + iSpeed + 'px';
						}
					}
				}
			}
			//如果所有的属性都达到终点，iContinue是false
			//Object.getOwnPropertyNames(json).length获取json对象的属性名称数组的长度，如果长度为0，说明定时器可以关掉了
			//		if(!Object.getOwnPropertyNames(json).length){
			if(!Object.keys(json).length) {
				clearInterval(obj.timer);
				if(fn) {
					fn();
				}
			}
		}, 30);
	}
}