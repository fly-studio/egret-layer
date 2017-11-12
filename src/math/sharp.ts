//http://www.jeffreythompson.org/collision-detection/

namespace layer.math {
	export enum DIRECTION {
		N, //Noth
		NE, //NothEast
		E, //East
		SE, //SouthEast
		S, //South
		SW, //SouthWest
		W, //West
		NW //NothWest
	}; 
	export enum POSITION {
		TOP,
		RIGHT,
		BOTTOM,
		LEFT
	};

	/**
	 * 计算两点之间的斜率(坐标1的x轴正方向的夹角弧度（顺时针）)
	 * http://keisan.casio.com/exec/system/1223508685
	 * @param  {egret.Point} p1 点1
	 * @param  {egret.Point} p2 点2
	 * @return {number}         斜率
	 */
	export function slope(p1:egret.Point, p2:egret.Point):number {
		return Math.atan2(p2.y - p1.y, p2.x - p1.x);
	};

	export function slopeDegree(p1: egret.Point, p2: egret.Point):number {
		let angel: number = slope(p1, p2);
		return (angel > 0 ? angel : (2 * Math.PI + angel)) * 360 / (2 * Math.PI);
	};
	/**
	 * 计算计算p2相对p1的方向，东、南、西、北
	 * 如果设置directionsCount为8，则会返回东北、东南、西南、西北
	 * @param p1 点1
	 * @param p2 点2
	 * @param directionsCount 4方向 或 8方向
	 */
	export function direction(p1: egret.Point, p2: egret.Point, directionsCount:number = 4) : DIRECTION {
		if (directionsCount != 4 && directionsCount != 8)
			throw new Error('directCount must be 4 / 8');

		let degree:number = slopeDegree(p1, p2);
		let theta = 360 / directionsCount;
		let d: number = DIRECTION.E; // 0度是 East方向
		let step = 8 / directionsCount; // 四方向跳2 八方向跳1
		for (let i: number = 0, m:number = 0 ;i < 360; i+= theta / 2, m++) { //按照平分角度的一半递增
			if (m % 2) d = (d + step) % 8; //进入新的区块则加方向
			if (degree >= i && degree < i + theta / 2) {
				return d;
			}
		}
		return d;
	};
	/**
	 * 计算p2相对p1的方位，上 右 下 左
	 * @param p1 点1
	 * @param p2 点2
	 */
	export function position(p1: egret.Point, p2: egret.Point) : POSITION {
		let d: number = direction(p1, p2, 4);
		return d / 2;
	};

	/**
	 * 计算两点之间的距离
	 * http://keisan.casio.com/exec/system/1223508685
	 * @param  {egret.Point} p1 点1
	 * @param  {egret.Point} p2 点2
	 * @return {number}         距离
	 */
	export function distance(p1:egret.Point, p2:egret.Point):number {
		return Math.pow(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2), 0.5);
	};
	/**
	 * 3D坐标系的距离
	 * https://www.mathsisfun.com/algebra/distance-2-points.html
	 * @param {egret3d.Vector3D} p1 3D坐标1
	 * @param {egret3d.Vector3D} p2 3D坐标2
	 * @return {}
	 */
/* 	export function distance3D(p1:egret3d.Vector3D, p2:egret3d.Vector3D) {
		return Math.pow(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2) + Math.pow(Math.abs(p2.z - p1.z), 2), 0.5);
	}; */
	/**
	 * 计算点旋转之后的新坐标
	 * http://keisan.casio.com/exec/system/1223522781
	 * @param  {egret.Point} p 点
	 * @param  {number} rotation     旋转的(弧度)
	 * @return {egret.Point}   新坐标
	 */
	export function rotatedPoint(p:egret.Point, rotation:number):egret.Point {
		rotation = -rotation; //下面的公式是逆时针为正，电脑的坐标是顺时针为正，所以需要取反
		return new egret.Point(p.x * Math.cos(rotation) + p.y * Math.sin(rotation), -p.x * Math.sin(rotation) + p.y * Math.cos(rotation));
	};
	/**
	 * 角度 to 弧度
	 * @param  {number} d 角度(-360~360)
	 * @return {number}   弧度
	 */
	export function d2r(d:number):number {
		return (d * Math.PI) / 180;
	};
	/**
	 * 弧度 to 角度
	 * @param  {number} r 弧度
	 * @return {number}   角度(-360~360)
	 */
	export function r2d(r:number):number {
		return (180 * r) / Math.PI;
	};
	/**
	 * 计算「点」与「点」是否相同
	 * @param  {egret.Point} p1 [description]
	 * @param  {egret.Point} p2 [description]
	 * @return {boolean}
	 */
	export function pointHitPoint(p1:egret.Point, p2:egret.Point):boolean {
		return p1.equals(p2);
	};
	/**
	 * 测试「点」是否在「圆」中
	 * http://www.jeffreythompson.org/collision-detection/point-circle.php
	 * @param  {egret.Point} p         待测试的点
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @return {boolean}
	 */
	export function pointHitCircle(p:egret.Point, circlePos:egret.Point, radius:number) {
		let distX:number = p.x - circlePos.x;
		let distY:number = p.y - circlePos.y;
		let distance:number = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the circle's
		// radius the point is inside!
		return distance <= radius;
	};
	/**
	 * 测试「点」是否在「圆」中
	 * 同上
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @param  {egret.Point} p         待测试的点
	 * @return {boolean}
	 */
	export function circleHitPoint(circlePos:egret.Point, radius:number, p:egret.Point):boolean {
		return pointHitCircle(p, circlePos, radius);
	};
	/**
	 * 测试「点」是否在「矩形」中
	 * http://www.jeffreythompson.org/collision-detection/point-rect.php
	 * @param  {egret.Point}     p    待测试的点
	 * @param  {egret.Rectangle} rect 待测试的矩形
	 * @return {boolean}
	 */
	export function pointHitRect(p:egret.Point, rect:egret.Rectangle):boolean {
		return p.x >= rect.left && // right of the left edge AND
			p.x <= rect.right &&   // left of the right edge AND
			p.y >= rect.top &&     // below the top AND
			p.y <= rect.bottom;    // above the bottom
	};
	/**
	 * 测试「点」是否在「矩形」中
	 * 同上
	 * @param  {egret.Rectangle} rect 待测试的矩形
	 * @param  {egret.Point}     p    待测试的点
	 * @return {boolean}
	 */
	export function rectHitPoint(rect:egret.Rectangle, p:egret.Point):boolean {
		return pointHitRect(p, rect);
	};
	/**
	 * 测试两「矩形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/rect-rect.php
	 * @param  {egret.Rectangle} rect1 待测试的矩形1
	 * @param  {egret.Rectangle} rect2 待测试的矩形2
	 * @return {boolean}
	 */
	export function rectHitRect(rect1:egret.Rectangle, rect2:egret.Rectangle):boolean {
		return rect1.right >= rect2.left && // r1 right edge past r2 left
			rect1.left <= rect2.right &&    // r1 left edge past r2 right
			rect1.bottom >= rect2.top &&    // r1 bottom edge past r2 top
			rect1.top <= rect2.bottom;      // r1 top edge past r2 bottom
	};
	/**
	 * 测试两「圆」是否相交
	 * http://www.jeffreythompson.org/collision-detection/circle-circle.php
	 * @param  {egret.Point} circlePos1 圆1圆心
	 * @param  {number}      radius1    圆1半径
	 * @param  {egret.Point} circlePos2 圆2圆心
	 * @param  {number}      radius2    圆2半径
	 * @return {boolean}
	 */
	export function circleHitCircle(circlePos1:egret.Point, radius1:number, circlePos2:egret.Point, radius2:number):boolean {
		let distX:number = circlePos1.x - circlePos2.x;
		let distY:number = circlePos1.y - circlePos2.y;
		let distance:number = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the sum of the circle's
		// radii, the circles are touching!
		return distance <= radius1 + radius2;
	};
	/**
	 * 测试「圆」与「矩形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/circle-rect.php
	 * @param  {egret.Point}     circlePos 圆心
	 * @param  {number}          radius    半径
	 * @param  {egret.Rectangle} rect      矩形
	 * @return {boolean}
	 */
	export function circleHitRect(circlePos:egret.Point, radius:number, rect:egret.Rectangle):boolean {
		// temporary letiables to set edges for testing
		let testX:number = circlePos.x;
		let testY:number = circlePos.y;

		// which edge is closest?
		if (circlePos.x < rect.left)        testX = rect.left;      // test left edge
		else if (circlePos.x > rect.right)  testX = rect.right;   // right edge
		if (circlePos.y < rect.top)         testY = rect.top;      // top edge
		else if (circlePos.y > rect.bottom) testY = rect.bottom;   // bottom edge

		// get distance from closest edges
		let distX:number = circlePos.x - testX;
		let distY:number = circlePos.y - testY;
		let distance:number = Math.sqrt( (distX * distX) + (distY * distY) );

		// if the distance is less than the radius, collision!
		return distance <= radius;
	};
	/**
	 * 测试「圆」与「矩形」是否相交
	 * 同上
	 * @param  {egret.Rectangle} rect      矩形
	 * @param  {egret.Point}     circlePos 圆心
	 * @param  {number}          radius    半径
	 * @return {boolean}
	 */
	export function rectHitCircle(rect:egret.Rectangle, circlePos:egret.Point, radius:number):boolean {
		return circleHitRect(circlePos, radius, rect);
	};
	/**
	 * 测试「点」是否在「线」中
	 * http://www.jeffreythompson.org/collision-detection/line-point.php
	 * @param  {egret.Point} p        待测试点
	 * @param  {egret.Point} linePos1 线起始点
	 * @param  {egret.Point} linePos2 线结束点
	 * @return {boolean}
	 */
	export function pointHitLine(p:egret.Point, linePos1:egret.Point, linePos2:egret.Point):boolean {
		// get distance from the point to the two ends of the line
		let d1:number = distance(p, linePos1);
		let d2:number = distance(p, linePos2);

		// get the length of the line
		let lineLen:number = distance(linePos1, linePos2);

		// since floats are so minutely accurate, add
		// a little buffer zone that will give collision
		let buffer:number = 0.1;    // higher # = less accurate

		// if the two distances are equal to the line's
		// length, the point is on the line!
		// note we use the buffer here to give a range,
		// rather than one #
		return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
	};
	/**
	 * 测试「点」是否在「线」中
	 * 同上
	 * @param  {egret.Point} linePos1 线起始点
	 * @param  {egret.Point} linePos2 线结束点
	 * @param  {egret.Point} p        待测试点
	 * @return {boolean}
	 */
	export function lineHitPoint(linePos1:egret.Point, linePos2:egret.Point, p:egret.Point):boolean {
		return pointHitLine(p, linePos1, linePos2);
	};
	/**
	 * 返回「点」与「线」垂直相交的那个「点」，没有则返回false
	 * @param  {egret.Point} p        待测试点
	 * @param  {egret.Point} linePos1 线起始点
	 * @param  {egret.Point} linePos2 线结束点
	 * @return {egret.Point/boolean}
	 */
	export function pointLineClosest(p:egret.Point, linePos1:egret.Point, linePos2:egret.Point):egret.Point|boolean {
		// get length of the line
		let distX:number = linePos1.x - linePos2.x;
		let distY:number = linePos1.y - linePos2.y;
		let len:number = Math.sqrt( (distX * distX) + (distY * distY) );
		// get dot product of the line and point
		let dot:number = ( ((p.x - linePos1.x) * (linePos2.x - linePos1.x)) + ((p.y - linePos1.y) * (linePos2.y - linePos1.y)) ) / Math.pow(len, 2);

		// find the closest point on the line
		let closestX:number = linePos1.x + (dot * (linePos2.x - linePos1.x));
		let closestY:number = linePos1.y + (dot * (linePos2.y - linePos1.y));

		// is this point actually on the line segment?
		// if so keep going, but if not, return false
		let onSegment:boolean = lineHitPoint(linePos1, linePos2, new egret.Point(closestX, closestY));

		return onSegment ? new egret.Point(closestX, closestY) : false;
	};
	/**
	 * 测试「线」与「圆」是否相交
	 * http://www.jeffreythompson.org/collision-detection/line-circle.php
	 * @param  {egret.Point} linePos1  线起始点
	 * @param  {egret.Point} linePos2  线结束点
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @return {boolean}
	 */
	export function lineHitCircle(linePos1:egret.Point, linePos2:egret.Point, circlePos:egret.Point, radius:number):boolean {
		// is either end INSIDE the circle?
		// if so, return true immediately
		let inside1:boolean = pointHitCircle(linePos1, circlePos, radius);
		let inside2:boolean = pointHitCircle(linePos2, circlePos, radius);
		if (inside1 || inside2) return true;

		let closest:any = pointLineClosest(circlePos, linePos1, linePos2);
		if (closest === false) return false;

		// get distance to closest point
		let distX:number = closest.x - circlePos.x;
		let distY:number = closest.y - circlePos.y;
		let distance = Math.sqrt( (distX * distX) + (distY * distY) );

		return distance <= radius;
	};
	/**
	 * 测试「线」与「圆」是否相交
	 * 同上
	 * @param  {egret.Point} circlePos 圆心
	 * @param  {number}      radius    半径
	 * @param  {egret.Point} linePos1  线起始点
	 * @param  {egret.Point} linePos2  线结束点
	 * @return {boolean}               [description]
	 */
	export function circleHitLine(circlePos:egret.Point, radius:number, linePos1:egret.Point, linePos2:egret.Point):boolean {
		return lineHitCircle(linePos1, linePos2, circlePos, radius);
	};
	/**
	 * 获取两「线」相交的「交点」，无交点返回false
	 * @param  {egret.Point} line1Pos1 线1起始点
	 * @param  {egret.Point} line1Pos2 线1结束点
	 * @param  {egret.Point} line2Pos1 线2起始点
	 * @param  {egret.Point} line2Pos2 线2结束点
	 * @return {egret.Point/boolean}
	 */
	export function lineLineIntersect(line1Pos1:egret.Point, line1Pos2:egret.Point, line2Pos1:egret.Point, line2Pos2:egret.Point):egret.Point|boolean {
		let p1:egret.Point = line1Pos1, p2:egret.Point = line1Pos2, p3:egret.Point = line2Pos1, p4:egret.Point = line2Pos2;
		let uA:number = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));
		let uB:number = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));

		// collision?
		if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
			let intersectionX:number = p1.x + (uA * (p2.x - p1.x));
			let intersectionY:number = p1.y + (uA * (p2.y - p1.y));
			return new egret.Point(intersectionX, intersectionY);
		} else
			return false;
	};
	/**
	 * 测试两「线」是否相交
	 * http://www.jeffreythompson.org/collision-detection/line-line.php
	 * @param  {egret.Point} line1Pos1 线1起始点
	 * @param  {egret.Point} line1Pos2 线1结束点
	 * @param  {egret.Point} line2Pos1 线2起始点
	 * @param  {egret.Point} line2Pos2 线2结束点
	 * @return {boolean}
	 */
	export function lineHitLine(line1Pos1:egret.Point, line1Pos2:egret.Point, line2Pos1:egret.Point, line2Pos2:egret.Point):boolean {
		let r:any = lineLineIntersect(line1Pos1, line1Pos2, line2Pos1, line2Pos2);
		return r !== false;
	};
	/**
	 * 测试「线」与「矩形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/line-rect.php
	 * @param  {egret.Point}     linePos1 线起始点
	 * @param  {egret.Point}     linePos2 线结束点
	 * @param  {egret.Rectangle} rect     矩形
	 * @return {boolean}                  [description]
	 */
	export function lineHitRect(linePos1:egret.Point, linePos2:egret.Point, rect:egret.Rectangle):boolean {
		let p1:egret.Point = linePos1, p2:egret.Point = linePos2;
		let left:boolean = lineHitLine(p1, p2, new egret.Point(rect.left, rect.top), new egret.Point(rect.left, rect.bottom));
		let right:boolean = lineHitLine(p1, p2, new egret.Point(rect.right, rect.top), new egret.Point(rect.right, rect.bottom));
		let top:boolean = lineHitLine(p1, p2, new egret.Point(rect.left, rect.top), new egret.Point(rect.right , rect.top));
		let bottom:boolean = lineHitLine(p1, p2, new egret.Point(rect.left, rect.bottom), new egret.Point(rect.right, rect.bottom));

		// collision?
		return left || right || top || bottom;
	};
	/**
	 * 测试「线」与「矩形」是否相交
	 * 同上
	 * @param  {egret.Rectangle} rect     矩形
	 * @param  {egret.Point}     linePos1 线起始点
	 * @param  {egret.Point}     linePos2 线结束点
	 * @return {boolean}                  [description]
	 */
	export function rectHitLine(rect:egret.Rectangle, linePos1:egret.Point, linePos2:egret.Point):boolean {
		return lineHitRect(linePos1, linePos2, rect);
	};
	/**
	 * 测试「点」是否在「多边形」中
	 * http://www.jeffreythompson.org/collision-detection/poly-point.php
	 * @param  {egret.Point}        p        待测试点
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function pointHitPolygon(p:egret.Point, vertices:Array<egret.Point>):boolean {
		let collision:boolean = false;

		// go through each of the vertices, plus
		// the next vertex in the list
		let next:number = 0;
		for (let current:number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc:egret.Point = vertices[current];    // c for "current"
			let vn:egret.Point = vertices[next];       // n for "next"

			// compare position, flip 'collision' letiable
			// back and forth
			if (((vc.y > p.y && vn.y < p.y) || (vc.y < p.y && vn.y > p.y)) &&
				(p.x < (vn.x - vc.x) * (p.y-vc.y) / (vn.y - vc.y) + vc.x)) {
			 		collision = !collision;
			}
		}
		return collision;
	};
	/**
	 * 测试「点」是否在「多边形」中
	 * 同上
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @param  {egret.Point}        p        待测试点
	 * @return {boolean}
	 */
	export function polygonHitPoint(vertices:Array<egret.Point>, p:egret.Point):boolean {
		return pointHitPolygon(p, vertices);
	};
	/**
	 * 测试「圆」与「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-circle.php
	 * @param  {egret.Point}        circlePos 圆心
	 * @param  {number}             radius    半径
	 * @param  {Array<egret.Point>} vertices  多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function circleHitPolygon(circlePos:egret.Point, radius:number, vertices:Array<egret.Point>):boolean {
		// go through each of the vertices, plus
		// the next vertex in the list
		let next:number = 0;
		for (let current:number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc:egret.Point = vertices[current];    // c for "current"
			let vn:egret.Point = vertices[next];       // n for "next"

			// check for collision between the circle and
			// a line formed between the two vertices
			let collision:boolean = lineHitCircle(vc, vn, circlePos, radius);
			if (collision) return true;
		}

		// the above algorithm only checks if the circle
		// is touching the edges of the polygon – in most
		// cases this is enough, but you can un-comment the
		// following code to also test if the center of the
		// circle is inside the polygon

		// boolean centerInside = polygonPoint(vertices, cx,cy);
		// if (centerInside) return true;

		// otherwise, after all that, return false
		return false;
	};
	/**
	 * 测试「圆」与「多边形」是否相交
	 * 同上
	 * @param  {Array<egret.Point>} vertices  多边形各个顶点的数组
	 * @param  {egret.Point}        circlePos 圆心
	 * @param  {number}             radius    半径
	 * @return {boolean}
	 */
	export function polygonHitCircle(vertices:Array<egret.Point>, circlePos:egret.Point, radius:number):boolean {
		return circleHitPolygon(circlePos, radius, vertices);
	};
	/**
	 * 测试「矩形」与「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-rect.php
	 * @param  {egret.Rectangle}    rect     矩形
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function rectHitPolygon(rect:egret.Rectangle, vertices:Array<egret.Point>):boolean {
		// go through each of the vertices, plus the next
		// vertex in the list
		let next:number = 0;
		for (let current:number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc:egret.Point = vertices[current];    // c for "current"
			let vn:egret.Point = vertices[next];       // n for "next"

			// check against all four sides of the rectangle
			let collision:boolean = lineHitRect(vc, vn, rect);
			if (collision) return true;

			// optional: test if the rectangle is INSIDE the polygon
			// note that this iterates all sides of the polygon
			// again, so only use this if you need to
			let inside:boolean = polygonHitPoint(vertices, rect.topLeft);
			if (inside) return true;
		}
		return false;
	};
	/**
	 * 测试「矩形」与「多边形」是否相交
	 * 同上
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @param  {egret.Rectangle}    rect     矩形
	 * @return {boolean}
	 */
	export function polygonHitRect(vertices:Array<egret.Point>, rect:egret.Rectangle):boolean {
		return rectHitPolygon(rect, vertices);
	};
	/**
	 * 测试「线」与「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-line.php
	 * @param  {egret.Point}        linePos1 线起始点
	 * @param  {egret.Point}        linePos2 线结束点
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @return {boolean}
	 */
	export function lineHitPolygon(linePos1:egret.Point, linePos2:egret.Point, vertices:Array<egret.Point>):boolean {
		// go through each of the vertices, plus the next
		// vertex in the list
		let next:number = 0;
		for (let current:number = 0; current < vertices.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc:egret.Point = vertices[current];    // c for "current"
			let vn:egret.Point = vertices[next];       // n for "next"

			// do a Line/Line comparison
			// if true, return 'true' immediately and
			// stop testing (faster)
			let hit:boolean = lineHitLine(linePos1, linePos2, vc, vn);
			if (hit) return true;
		}

		// never got a hit
		return false;
	};
	/**
	 * 测试「线」与「多边形」是否相交
	 * @param  {Array<egret.Point>} vertices 多边形各个顶点的数组
	 * @param  {egret.Point}        linePos1 线起始点
	 * @param  {egret.Point}        linePos2 线结束点
	 * @return {boolean}
	 */
	export function polygonHitLine(vertices:Array<egret.Point>, linePos1:egret.Point, linePos2:egret.Point):boolean {
		return lineHitPolygon(linePos1, linePos2, vertices);
	};
	/**
	 * 测试两「多边形」是否相交
	 * http://www.jeffreythompson.org/collision-detection/poly-poly.php
	 * @param  {Array<egret.Point>} vertices1 多边形1各个顶点的数组
	 * @param  {Array<egret.Point>} vertices2 多边形2各个顶点的数组
	 * @return {boolean}
	 */
	export function polygonHitPolygon(vertices1:Array<egret.Point>, vertices2:Array<egret.Point>):boolean {
		// go through each of the vertices, plus the next
		// vertex in the list
		let next:number = 0;
		for (let current:number = 0; current < vertices1.length; current++) {

			// get next vertex in list
			// if we've hit the end, wrap around to 0
			next = current + 1;
			if (next == vertices1.length) next = 0;

			// get the PVectors at our current position
			// this makes our if statement a little cleaner
			let vc:egret.Point = vertices1[current];    // c for "current"
			let vn:egret.Point = vertices1[next];       // n for "next"

			// now we can use these two points (a line) to compare
			// to the other polygon's vertices using polyLine()
			let collision:boolean = polygonHitLine(vertices2, vc, vn);
			if (collision) return true;

			// optional: check if the 2nd polygon is INSIDE the first
			collision = polygonHitPoint(vertices1, vertices2[0]);
			if (collision) return true;
		}

		return false;
	};
	/**
	 * 测试「点」是否在「三角形」中
	 * http://www.jeffreythompson.org/collision-detection/tri-point.php
	 * @param  {egret.Point}        p        待测试点
	 * @param  {Array<egret.Point>} vertices 三角形各个顶点的数组
	 * @return {boolean}
	 */
	export function pointHitTriangle(p:egret.Point, vertices:Array<egret.Point>):boolean {
		let x1:number = vertices[1].x, x2:number = vertices[2].x, x3:number = vertices[3].x;
		let y1:number = vertices[1].y, y2:number = vertices[2].y, y3:number = vertices[3].y;
		// get the area of the triangle
		let areaOrig:number = Math.abs( (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1) );

		// get the area of 3 triangles made between the point
		// and the corners of the triangle
		let area1:number = Math.abs( (x1 - p.x) * (y2 - p.y) - (x2 - p.x) * (y1 - p.y) );
		let area2:number = Math.abs( (x2 - p.x) * (y3 - p.y) - (x3 - p.x) * (y2 - p.y) );
		let area3:number = Math.abs( (x3 - p.x) * (y1 - p.y) - (x1 - p.x) * (y3 - p.y) );

		// if the sum of the three areas equals the original,
		// we're inside the triangle!
		return area1 + area2 + area3 == areaOrig;
	};
	/**
	 * 测试「点」是否在「三角形」中
	 * 同上
	 * @param  {Array<egret.Point>} vertices 三角形各个顶点的数组
	 * @param  {egret.Point}        p        待测试点
	 * @return {boolean}
	 */
	export function triangleHitPoint(vertices:Array<egret.Point>, p:egret.Point):boolean {
		return pointHitTriangle(p, vertices);
	};
}
