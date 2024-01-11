function Stacker() {
    var EMPTY = 0, WALL = 1, BLOCK = 2, GOLD = 3;
    var dfs_complete = false;
    var vis = new Set();
    var m = new Map();
    var pathToGrid = new Map();
    var path = '';
    var alwaysReturnToX;
    var alwaysReturnToY;
    var path1 = '';
    var followPath = '';
    var x = 0;
    var y = 0;
    var tx = 0;
    var ty = 0;
    var tlevel = 8;
    var toBeFilled = [];
    var toBeFilledLevel = [];
    var toBeFilledPath = '';
    var toBeFilledIndex = 0;
    var dropped = 0;
    var minHeap = [];
    var filled = false;
    var minHeapIndex = 0;
    var limit = 0;
    function compareNumbers(a, b) {
        // Compare based on the first element of each array
        return a[0] - b[0];
    }
    var Node = /** @class */ (function () {
        function Node(value, next) {
            if (next === void 0) { next = null; }
            this.value = value;
            this.next = next;
        }
        return Node;
    }());
    var NodeS = /** @class */ (function () {
        function NodeS(value, next) {
            if (next === void 0) { next = null; }
            this.value = value;
            this.next = next;
        }
        return NodeS;
    }());
    var Queue = /** @class */ (function () {
        function Queue() {
            this.front = null;
            this.rear = null;
            // print(): void {
            //     let current = this.front;
            //     while (current) {
            //         console.log(current.value);
            //         current = current.next;
            //     }
            // }
        }
        Queue.prototype.enqueue = function (value) {
            var newNode = new Node(value);
            if (this.isEmpty()) {
                this.front = newNode;
                this.rear = newNode;
            }
            else {
                if (this.rear) {
                    this.rear.next = newNode;
                    this.rear = newNode;
                }
            }
        };
        Queue.prototype.dequeue = function () {
            var removedValue = this.front.value;
            this.front = this.front.next;
            if (!this.front) {
                this.rear = null;
            }
            return removedValue;
        };
        Queue.prototype.peek = function () {
            return this.front ? this.front.value : undefined;
        };
        Queue.prototype.isEmpty = function () {
            return this.front === null;
        };
        return Queue;
    }());
    var QueueS = /** @class */ (function () {
        function QueueS() {
            this.front = null;
            this.rear = null;
            // print(): void {
            //     let current = this.front;
            //     while (current) {
            //         console.log(current.value);
            //         current = current.next;
            //     }
            // }
        }
        QueueS.prototype.enqueue = function (value) {
            var newNode = new NodeS(value);
            if (this.isEmpty()) {
                this.front = newNode;
                this.rear = newNode;
            }
            else {
                if (this.rear) {
                    this.rear.next = newNode;
                    this.rear = newNode;
                }
            }
        };
        QueueS.prototype.dequeue = function () {
            var removedValue = this.front.value;
            this.front = this.front.next;
            if (!this.front) {
                this.rear = null;
            }
            return removedValue;
        };
        QueueS.prototype.peek = function () {
            return this.front ? this.front.value : undefined;
        };
        QueueS.prototype.isEmpty = function () {
            return this.front === null;
        };
        return QueueS;
    }());
    function findPath(sx, sy, ex, ey) {
        var q = new Queue();
        // let s: Set<number> = new Set()
        q.enqueue([sx, sy]);
        var parent = new Map();
        parent.set(100 * sx + sy, [-10000, -10000]);
        while (!q.isEmpty()) {
            var cur_1 = q.dequeue();
            if (cur_1[0] == ex && cur_1[1] == ey) {
                break;
            }
            var x1 = cur_1[0], y1 = cur_1[1];
            if (m.has(100 * (x1 + 1) + y1) && !parent.has(100 * (x1 + 1) + y1) && !(tx == x1 + 1 && ty == y1)) {
                q.enqueue([x1 + 1, y1]);
                parent.set(100 * (x1 + 1) + y1, cur_1);
            }
            if (m.has(100 * (x1 - 1) + y1) && !parent.has(100 * (x1 - 1) + y1) && !(tx == x1 - 1 && ty == y1)) {
                q.enqueue([x1 - 1, y1]);
                parent.set(100 * (x1 - 1) + y1, cur_1);
            }
            if (m.has(100 * (x1) + y1 + 1) && !parent.has(100 * (x1) + y1 + 1) && !(tx == x1 && ty == y1 + 1)) {
                q.enqueue([x1, y1 + 1]);
                parent.set(100 * (x1) + y1 + 1, cur_1);
            }
            if (m.has(100 * (x1) + y1 - 1) && !parent.has(100 * (x1) + y1 - 1) && !(tx == x1 && ty == y1 - 1)) {
                q.enqueue([x1, y1 - 1]);
                parent.set(100 * (x1) + y1 - 1, cur_1);
            }
        }
        var cur = [ex, ey];
        while (cur[0] != sx || cur[1] != sy) {
            var p = parent.get(cur[0] * 100 + cur[1]);
            if (p == undefined) {
                var x_1 = 0;
                x_1++;
                x_1 /= 2;
            }
            if (cur[0] == p[0]) {
                if (cur[1] > p[1]) {
                    path += 'D';
                }
                else {
                    path += 'U';
                }
            }
            else {
                if (cur[0] > p[0]) {
                    path += 'R';
                }
                else {
                    path += 'L';
                }
            }
            cur = p;
        }
        path = path.split('').reverse().join('');
        return path;
    }
    function isValid(x1, y1, s1) {
        var q = new Queue();
        q.enqueue([x1, y1]);
        var vis1 = new Set();
        vis1.add((100 * x1) + y1);
        var count = 0;
        var qs = new QueueS();
        var p = '';
        qs.enqueue('');
        s1.forEach(function (value) {
            if (m.get(value) > 0)
                count++;
        });
        while (!q.isEmpty()) {
            x1 = q.peek()[0];
            y1 = q.peek()[1];
            q.dequeue();
            p = qs.dequeue();
            if (m.has(100 * x1 + y1) && m.get(100 * x1 + y1) > 0) {
                count++;
                pathToGrid.set(100 * x1 + y1, p);
            }
            if (m.has(100 * (x1 + 1) + y1) && !s1.has((100 * (x1 + 1)) + y1)) {
                q.enqueue([x1 + 1, y1]);
                s1.add(100 * (x1 + 1) + y1);
                //p+='R'
                qs.enqueue(p + 'R');
            }
            if (m.has(100 * (x1 - 1) + y1) && !s1.has((100 * (x1 - 1)) + y1)) {
                q.enqueue([x1 - 1, y1]);
                s1.add(100 * (x1 - 1) + y1);
                //p+='L'
                qs.enqueue(p + 'L');
            }
            if (m.has(100 * (x1) + y1 - 1) && !s1.has((100 * x1) + y1 - 1)) {
                q.enqueue([x1, y1 - 1]);
                s1.add(100 * (x1) + y1 - 1);
                //p+='R'
                qs.enqueue(p + 'U');
            }
            if (m.has(100 * (x1) + y1 + 1) && !s1.has((100 * x1) + y1 + 1)) {
                q.enqueue([x1, y1 + 1]);
                s1.add(100 * (x1) + y1 + 1);
                // p+='R'
                qs.enqueue(p + 'D');
            }
        }
        if (count < ((tlevel * (tlevel - 1)) / 2)) {
            pathToGrid.clear();
            return false;
        }
        return true;
    }
    function dfs(type, level, ltype, llevel, rtype, rlevel, dtype, dlevel, utype, ulevel) {
        if (ltype !== 1 && ltype !== 3 && !vis.has('' + (x - 1) + '$' + (y))) {
            x--;
            path += 'L';
            return 'left';
        }
        else if (ltype == 1) {
            vis.add('' + (x - 1) + '$' + (y));
        }
        if (rtype !== 1 && rtype !== 3 && !vis.has('' + (x + 1) + '$' + (y))) {
            x++;
            path += 'R';
            return 'right';
        }
        else if (rtype == 1) {
            vis.add('' + (x + 1) + '$' + (y));
        }
        if (utype !== 1 && utype !== 3 && !vis.has('' + (x) + '$' + (y - 1))) {
            y--;
            path += 'U';
            return 'up';
        }
        else if (utype == 1) {
            vis.add('' + (x) + '$' + (y - 1));
        }
        if (dtype !== 1 && dtype !== 3 && !vis.has('' + (x) + '$' + (y + 1))) {
            y++;
            path += 'D';
            return 'down';
        }
        else if (dtype == 1) {
            vis.add('' + (x) + '$' + (y + 1));
        }
        if (path.length == 0) {
            dfs_complete = true;
            console.log(vis.size);
            return "dontReturn";
        }
        else {
            var dir = path.charAt(path.length - 1);
            path = path.slice(0, -1);
            if (dir == 'L') {
                x++;
                return 'right';
            }
            if (dir == 'R') {
                x--;
                return 'left';
            }
            if (dir == 'U') {
                y++;
                return 'down';
            }
            if (dir == 'D') {
                y--;
                return 'up';
            }
        }
        return '';
    }
    function findTLevelContinuous(x1, y1, s) {
        if (toBeFilled.length === tlevel - 1) {
            var temp = false;
            if (isValid(x1, y1, s)) {
                alwaysReturnToX = x1;
                alwaysReturnToY = y1;
                filled = true;
                toBeFilled.reverse();
                var prevX = x1, prevY = y1;
                toBeFilledLevel.push(m.get(100 * x1 + y1));
                for (var i = 1; i < toBeFilled.length; i++) {
                    toBeFilledLevel.push(m.get(toBeFilled[i][0] * 100 + toBeFilled[i][1]));
                    if (prevX + 1 == toBeFilled[i][0]) {
                        toBeFilledPath += 'R';
                    }
                    else if (prevX - 1 == toBeFilled[i][0]) {
                        toBeFilledPath += 'L';
                    }
                    else if (prevY + 1 == toBeFilled[i][1]) {
                        toBeFilledPath += 'D';
                    }
                    else {
                        toBeFilledPath += 'U';
                    }
                    prevX = toBeFilled[i][0];
                    prevY = toBeFilled[i][1];
                }
                dropped = toBeFilled.length - 1;
            }
            return;
        }
        if (m.has(100 * (x1 - 1) + y1) && !s.has(100 * (x1 - 1) + y1)) {
            toBeFilled.push([x1 - 1, y1]);
            s.add(100 * (x1 - 1) + y1);
            findTLevelContinuous(x1 - 1, y1, s);
            if (filled === false) {
                s.delete(100 * (x1 - 1) + y1);
                toBeFilled = toBeFilled.slice(0, -1);
            }
            else
                return;
        }
        if (m.has(100 * (x1 + 1) + y1) && !s.has(100 * (x1 + 1) + y1)) {
            toBeFilled.push([x1 + 1, y1]);
            s.add(100 * (x1 + 1) + y1);
            findTLevelContinuous(x1 + 1, y1, s);
            if (filled === false) {
                s.delete(100 * (x1 + 1) + y1);
                toBeFilled = toBeFilled.slice(0, -1);
            }
            else
                return;
        }
        if (m.has(100 * (x1) + y1 - 1) && !s.has(100 * (x1) + y1 - 1)) {
            toBeFilled.push([x1, y1 - 1]);
            s.add(100 * (x1) + y1 - 1);
            findTLevelContinuous(x1, y1 - 1, s);
            if (filled === false) {
                s.delete(100 * (x1) + y1 - 1);
                toBeFilled = toBeFilled.slice(0, -1);
            }
            else
                return;
        }
        if (m.has(100 * (x1) + y1 + 1) && !s.has(100 * (x1) + y1 + 1)) {
            toBeFilled.push([x1, y1 + 1]);
            s.add(100 * (x1) + y1 + 1);
            findTLevelContinuous(x1, y1 + 1, s);
            if (filled === false) {
                s.delete(100 * (x1) + y1 + 1);
                toBeFilled = toBeFilled.slice(0, -1);
            }
            else
                return;
        }
    }
    function complementAndReverse(s) {
        var n = s.length;
        s += 'P';
        for (var i = n - 1; i >= 0; i--) {
            if (s[i] == 'U')
                s += ('D');
            else if (s[i] == 'L')
                s += ('R');
            else if (s[i] == 'D')
                s += ('U');
            else if (s[i] == 'R')
                s += ('L');
        }
        s += '#';
        return s.split('').reverse().join('');
    }
    var filledLevel = 0;
    function fillToBeFilled() {
        var till = 0;
        for (var i = 1; i < toBeFilled.length; i++) {
            if (toBeFilledLevel[i] - toBeFilledLevel[i - 1] <= 1)
                till++;
            else
                break;
        }
        if (till == toBeFilled.length - 1 && toBeFilledLevel[till] == tlevel - 2) {
        }
        else {
            while (till != 0 && toBeFilledLevel[till] > toBeFilledLevel[till - 1])
                till--;
        }
        for (var i = 0; i < till; i++) {
            path1 += (toBeFilledPath[i]);
        }
        dropped = till;
        path1 += '!';
        for (var i = path1.length - 2; i >= 0; i--) {
            if (path1[i] == 'D')
                path1 += ('U');
            else if (path1[i] == 'L')
                path1 += ('R');
            else if (path1[i] == 'R')
                path1 += ('L');
            else
                path1 += ('D');
        }
        path1 = path1.split('').reverse().join('');
    }
    function findKey(key) {
        var add = 0;
        if (Math.abs(key % 100) > 50) {
            if (key < 0)
                add = -1;
            else
                add = 1;
        }
        return add + ((key - key % 100) / 100);
    }
    function findValue(key) {
        var multiplier = 1;
        if (key < 0)
            multiplier = -1;
        if (Math.abs(key % 100) > 50)
            return -1 * multiplier * (100 - Math.abs(key % 100));
        return multiplier * Math.abs(key % 100);
    }
    // Replace this with your own wizardry
    this.turn = function (cell) {
        // Pick an action randomly
        var type, level, ltype, llevel, rtype, rlevel, dtype, dlevel, utype, ulevel;
        var res = '';
        type = cell.type;
        level = cell.level;
        ltype = cell.left.type;
        llevel = cell.left.level;
        rtype = cell.right.type;
        rlevel = cell.right.level;
        dtype = cell.down.type;
        dlevel = cell.down.level;
        utype = cell.up.type;
        ulevel = cell.up.level;
        if (ltype == 3 && llevel - level == 1) {
            return 'left';
        }
        else if (rtype == 3 && rlevel - level == 1) {
            return 'right';
        }
        else if (dtype == 3 && dlevel - level == 1) {
            return 'down';
        }
        else if (utype == 3 && ulevel - level == 1) {
            return 'up';
        }
        if (!dfs_complete) {
            vis.add('' + (x) + '$' + (y));
            m.set((100 * x) + y, level);
            if (ltype == 3) {
                tx = x - 1;
                ty = y;
                tlevel = llevel;
            }
            else if (rtype == 3) {
                tx = x + 1;
                ty = y;
                tlevel = rlevel;
            }
            else if (utype == 3) {
                tx = x;
                ty = y - 1;
                tlevel = ulevel;
            }
            else if (dtype == 3) {
                tx = x;
                ty = y + 1;
                tlevel = dlevel;
            }
            res = dfs(type, level, ltype, llevel, rtype, rlevel, dtype, dlevel, utype, ulevel);
            if (res != 'dontReturn')
                return res;
        }
        if (res === 'dontReturn') {
            var no_name = new Set();
            no_name.add(100 * tx + ty);
            findTLevelContinuous(tx, ty, no_name);
            pathToGrid.forEach(function (value, key) {
                minHeap.push([value.length, findKey(key), findValue(key)]);
            });
            minHeap.sort(compareNumbers);
            path1 = findPath(0, 0, alwaysReturnToX, alwaysReturnToY);
            path1 = path1.split('').reverse().join('');
        }
        if (path1.length == 0) {
            var xx = minHeap[minHeapIndex];
            if (xx == undefined) {
                console.log(minHeap.length, minHeapIndex);
            }
            var x_2 = [xx[1], xx[2]];
            minHeapIndex++;
            if (xx[1] == tx && xx[2] == ty) {
                xx = minHeap[minHeapIndex];
                x_2 = [xx[1], xx[2]];
                minHeapIndex++;
            }
            path1 = pathToGrid.get(x_2[0] * 100 + x_2[1]);
            path1 = complementAndReverse(path1);
        }
        var c = path1.charAt(path1.length - 1);
        path1 = path1.slice(0, -1);
        if (c == '#') {
            fillToBeFilled();
            c = path1.charAt(path1.length - 1);
            path1 = path1.slice(0, -1);
        }
        if (c == 'L') {
            x--;
            return 'left';
        }
        if (c == 'R') {
            x++;
            return 'right';
        }
        if (c == 'U') {
            y--;
            return 'up';
        }
        if (c == 'D') {
            y++;
            return 'down';
        }
        if (c == 'P')
            return 'pickup';
        if (c == '!') {
            toBeFilledLevel[dropped]++;
            // if(toBeFilledLevel[dropped]==tlevel-1){
            //     if(tx==x){
            //         if(ty==y-1){
            //             path1='U'
            //         }
            //         else path1='D'
            //     }
            //     else{
            //         if(tx==x-1){
            //             path1='L'
            //         }
            //         else path1='R'
            //     }
            // }
            return 'drop';
        }
    };
    // More wizardry here
}
