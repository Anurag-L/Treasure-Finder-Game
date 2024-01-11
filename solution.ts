
function Stacker(){

    var
        EMPTY = 0,
        WALL = 1,
        BLOCK = 2,
        GOLD = 3;

    let dfs_complete: boolean = false;
    type Pair = [number, number];
    type MinHeapElement = [number,number,number];
    var vis: Set<string> = new Set();
    var m: Map<number, number> = new Map();
    var pathToGrid: Map<number, string> = new Map();
    var path: string = '';
    var alwaysReturnToX: number;
    var alwaysReturnToY: number;
    var path1: string = '';
    var followPath:string = '';
    var x: number = 0;
    var y: number = 0;
    var tx: number = 0;
    var ty: number = 0;
    var tlevel: number = 8;
    var toBeFilled: Pair[] = [];
    var toBeFilledLevel: number[] = [];
    var toBeFilledPath: string= '';
    var toBeFilledIndex : number = 0;
    var dropped : number = 0;
    var minHeap : MinHeapElement[] = [];
    var filled : boolean = false;
    var minHeapIndex = 0
    var limit = 0

    function compareNumbers(a: [number, number, number], b: [number, number, number]): number {
        // Compare based on the first element of each array
        return a[0] - b[0];
    }
    class Node {
        constructor(public value: Pair, public next: Node | null = null) {}
    }

    class NodeS {
        constructor(public value: string, public next: NodeS | null = null) {}
    }

    class Queue {
        private front: Node | null = null;
        private rear: Node | null = null;

        enqueue(value: Pair): void {
            const newNode = new Node(value);

            if (this.isEmpty()) {
                this.front = newNode;
                this.rear = newNode;
            } else {
                if (this.rear) {
                    this.rear.next = newNode;
                    this.rear = newNode;
                }
            }
        }

        dequeue(): Pair {

            const removedValue = this.front!.value;
            this.front = this.front!.next;

            if (!this.front) {
                this.rear = null;
            }

            return removedValue;
        }

        peek(): Pair {
            return this.front.value;
        }

        isEmpty(): boolean {
            return this.front === null;
        }

        // print(): void {
        //     let current = this.front;
        //     while (current) {
        //         console.log(current.value);
        //         current = current.next;
        //     }
        // }
    }

    class QueueS {
        private front: NodeS | null = null;
        private rear: NodeS | null = null;

        enqueue(value: string): void {
            const newNode = new NodeS(value);

            if (this.isEmpty()) {
                this.front = newNode;
                this.rear = newNode;
            } else {
                if (this.rear) {
                    this.rear.next = newNode;
                    this.rear = newNode;
                }
            }
        }

        dequeue(): string  {

            const removedValue = this.front!.value;
            this.front = this.front!.next;

            if (!this.front) {
                this.rear = null;
            }

            return removedValue;
        }

        peek(): string{
            return this.front.value ;
        }

        isEmpty(): boolean {
            return this.front === null;
        }

        // print(): void {
        //     let current = this.front;
        //     while (current) {
        //         console.log(current.value);
        //         current = current.next;
        //     }
        // }
    }

    function findPath(sx: number, sy: number, ex: number, ey: number){
        let q: Queue = new Queue();
        // let s: Set<number> = new Set()
        q.enqueue([sx,sy])
        let parent: Map<number,Pair> = new Map()
        parent.set(100*sx+sy,[-10000,-10000])
        while(!q.isEmpty()){
            let cur: Pair = q.dequeue()
            if(cur[0]==ex && cur[1]==ey){
                break;
            }
            let x1 = cur[0], y1 = cur[1]
            if(m.has(100*(x1+1)+y1) && !parent.has(100*(x1+1)+y1) && !(tx==x1+1 && ty==y1)){
                q.enqueue([x1+1,y1])
                parent.set(100*(x1+1)+y1,cur)
            }
            if(m.has(100*(x1-1)+y1) && !parent.has(100*(x1-1)+y1) && !(tx==x1-1 && ty==y1)){
                q.enqueue([x1-1,y1])
                parent.set(100*(x1-1)+y1,cur)
            }
            if(m.has(100*(x1)+y1+1) && !parent.has(100*(x1)+y1+1) && !(tx==x1 && ty==y1+1)){
                q.enqueue([x1,y1+1])
                parent.set(100*(x1)+y1+1,cur)
            }
            if(m.has(100*(x1)+y1-1) && !parent.has(100*(x1)+y1-1) && !(tx==x1 && ty==y1-1)){
                q.enqueue([x1,y1-1])
                parent.set(100*(x1)+y1-1,cur)
            }
        }
        let cur: Pair = [ex,ey]
        while(cur[0]!=sx || cur[1]!=sy){
            let p:Pair = parent.get(cur[0]*100+cur[1])
            if(cur[0]==p[0]){
                if(cur[1]>p[1]){
                    path+='D'
                }
                else{
                    path+='U'
                }
            }
            else{
                if(cur[0]>p[0]){
                    path+='R'
                }
                else{
                    path+='L'
                }
            }
            cur = p;
        }
        path = path.split('').reverse().join('')
        return  path
    }


    function isValid(x1: number, y1: number, s1: Set<number>){
        var q: Queue = new Queue();
        q.enqueue([x1,y1]);
        var vis1: Set<number> = new Set();
        vis1.add((100*x1)+y1);
        var count: number=0;
        var qs: QueueS = new QueueS();
        var p: string = '';
        qs.enqueue('');
        s1.forEach(value =>{
            if(m.get(value)>0)count++;
        })
        while(!q.isEmpty()){
            x1 = q.peek()[0]
            y1 = q.peek()[1]
            q.dequeue()
            p = qs.dequeue()
            if(m.has(100*x1+y1) && m.get(100*x1+y1)>0){
                count++;
                pathToGrid.set(100*x1+y1,p);
            }
            if(m.has(100*(x1+1)+y1) && !s1.has((100*(x1+1))+y1)){
                q.enqueue([x1+1,y1])
                s1.add(100*(x1+1)+y1)
                //p+='R'
                qs.enqueue(p+'R')
            }
            if(m.has(100*(x1-1)+y1) && !s1.has((100*(x1-1))+y1)){
                q.enqueue([x1-1,y1])
                s1.add(100*(x1-1)+y1)
                //p+='L'
                qs.enqueue(p+'L')
            }
            if(m.has(100*(x1)+y1-1) && !s1.has((100*x1)+y1-1)){
                q.enqueue([x1,y1-1])
                s1.add(100*(x1)+y1-1)
                //p+='R'
                qs.enqueue(p+'U')
            }
            if(m.has(100*(x1)+y1+1) && !s1.has((100*x1)+y1+1)){
                q.enqueue([x1,y1+1])
                s1.add(100*(x1)+y1+1)
                // p+='R'
                qs.enqueue(p+'D')
            }
        }
        if(count<((tlevel*(tlevel-1))/2)) {
            pathToGrid.clear()
            return false
        }
        return true

    }

    function dfs(type: number, level: number, ltype: number, llevel: number, rtype: number, rlevel: number, dtype: number, dlevel: number, utype: number, ulevel: number):string{
        if(ltype!==1 && ltype!==3 && !vis.has(''+(x-1)+'$'+(y))){
            x--;
            path+='L';
            return 'left';
        }
        else if(ltype==1){
            vis.add(''+(x-1)+'$'+(y));
        }
        if(rtype!==1 && rtype!==3 && !vis.has(''+(x+1)+'$'+(y))){
            x++;
            path+='R';
            return 'right';
        }
        else if(rtype==1){
            vis.add(''+(x+1)+'$'+(y));
        }
        if(utype!==1 && utype!==3 && !vis.has(''+(x)+'$'+(y-1))){
            y--;
            path+='U';
            return 'up';
        }
        else if(utype==1){
            vis.add(''+(x)+'$'+(y-1));
        }
        if(dtype!==1 && dtype!==3 && !vis.has(''+(x)+'$'+(y+1))){
            y++;
            path+='D';
            return 'down';
        }
        else if(dtype==1){
            vis.add(''+(x)+'$'+(y+1));
        }
        if(path.length==0){
            dfs_complete=true;
            console.log(vis.size)
            return "dontReturn";
        }
        else{
            let dir = path.charAt(path.length-1);
            path = path.slice(0,-1);
            if(dir=='L'){
                x++;
                return 'right';
            }
            if(dir=='R'){
                x--;
                return 'left';
            }
            if(dir=='U'){
                y++;
                return 'down';
            }
            if(dir=='D'){
                y--;
                return 'up';
            }
        }
        return '';
    }

    function findTLevelContinuous(x1: number, y1: number, s: Set<number>){
        if(toBeFilled.length===tlevel-1){
            var temp: boolean = false;
            if(isValid(x1,y1,s)){
                alwaysReturnToX=x1;
                alwaysReturnToY=y1;
                filled=true;
                toBeFilled.reverse();
                var prevX:number =x1, prevY:number = y1;
                toBeFilledLevel.push(m.get(100*x1+y1))
                for(var i=1;i<toBeFilled.length;i++){
                    toBeFilledLevel.push(m.get(toBeFilled[i][0]*100+toBeFilled[i][1]));
                    if(prevX+1==toBeFilled[i][0]){
                        toBeFilledPath+='R';
                    }
                    else if(prevX-1==toBeFilled[i][0]){
                        toBeFilledPath+='L';
                    }
                    else if(prevY+1==toBeFilled[i][1]){
                        toBeFilledPath+='D';
                    }
                    else {
                        toBeFilledPath += 'U';
                    }
                    prevX = toBeFilled[i][0]
                    prevY = toBeFilled[i][1]
                }
                dropped = toBeFilled.length-1
            }
            return;
        }
        if(m.has(100*(x1-1)+y1) && !s.has(100*(x1-1)+y1)){
            toBeFilled.push([x1-1,y1])
            s.add(100*(x1-1)+y1)
            findTLevelContinuous(x1-1,y1,s)
            if(filled===false){
                s.delete(100*(x1-1)+y1)
                toBeFilled = toBeFilled.slice(0,-1)
            }
            else return;
        }
        if(m.has(100*(x1+1)+y1) && !s.has(100*(x1+1)+y1)){
            toBeFilled.push([x1+1,y1])
            s.add(100*(x1+1)+y1)
            findTLevelContinuous(x1+1,y1,s)
            if(filled===false){
                s.delete(100*(x1+1)+y1)
                toBeFilled = toBeFilled.slice(0,-1)
            }
            else return;
        }
        if(m.has(100*(x1)+y1-1) && !s.has(100*(x1)+y1-1)){
            toBeFilled.push([x1,y1-1])
            s.add(100*(x1)+y1-1)
            findTLevelContinuous(x1,y1-1,s)
            if(filled===false){
                s.delete(100*(x1)+y1-1)
                toBeFilled = toBeFilled.slice(0,-1)
            }
            else return;
        }
        if(m.has(100*(x1)+y1+1) && !s.has(100*(x1)+y1+1)){
            toBeFilled.push([x1,y1+1])
            s.add(100*(x1)+y1+1)
            findTLevelContinuous(x1,y1+1,s)
            if(filled===false){
                s.delete(100*(x1)+y1+1)
                toBeFilled = toBeFilled.slice(0,-1)
            }
            else return;
        }
    }

    function complementAndReverse(s: string):string{
        let n = s.length
        s+='P'
        for(var i=n-1;i>=0;i--){
            if(s[i]=='U')s+=('D');
            else if(s[i]=='L')s+=('R');
            else if(s[i]=='D')s+=('U');
            else if(s[i]=='R')s+=('L');
        }
        s+='#'
        return s.split('').reverse().join('')
    }

    var filledLevel = 0;

    function fillToBeFilled(){
        let till = 0
        for(let i=1;i<toBeFilled.length;i++){
            if(toBeFilledLevel[i]-toBeFilledLevel[i-1]<=1)till++;
            else break;
        }
        if(till==toBeFilled.length-1 && toBeFilledLevel[till]==tlevel-2){

        }
        else{
            while(till!=0 && toBeFilledLevel[till]>toBeFilledLevel[till-1])till--;
        }
        for(let i=0;i<till;i++){
            path1+=(toBeFilledPath[i]);
        }
        dropped = till
        path1+='!'
        for(let i=path1.length-2;i>=0;i--){
            if(path1[i]=='D')path1+=('U');
            else if(path1[i]=='L')path1+=('R');
            else if(path1[i]=='R')path1+=('L');
            else path1+=('D');
        }
        path1 = path1.split('').reverse().join('')
    }

    function findKey(key: number){
        let add : number =0
        if(Math.abs(key%100)>50){
            if(key <0)
                add=-1
            else add=1
        }
        return add+((key-key%100)/100)
    }
    function findValue(key:number){
        let multiplier: number =1
        if(key<0)multiplier = -1
        if(Math.abs(key%100)>50)return -1*multiplier*(100-Math.abs(key%100))
        return multiplier*Math.abs(key%100)
    }

// Replace this with your own wizardry
    this.turn = function(cell){

        // Pick an action randomly
        let type: number, level: number, ltype: number, llevel: number, rtype: number, rlevel: number, dtype: number, dlevel: number, utype: number, ulevel: number;
        let res: string = '';
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
        if(ltype==3 && llevel-level==1){
            return 'left'
        }
        else if(rtype==3 && rlevel-level==1){
            return 'right'
        }
        else if(dtype==3 && dlevel-level==1){
            return 'down'
        }
        else if(utype==3 && ulevel-level==1){
            return 'up'
        }
        if (!dfs_complete){
            vis.add(''+(x)+'$'+(y));
            m.set((100*x)+y,level);
            if(ltype==3){
                tx = x-1
                ty = y
                tlevel = llevel
            }
            else if(rtype==3){
                tx = x+1
                ty = y
                tlevel = rlevel
            }
            else if(utype==3){
                tx = x
                ty = y-1
                tlevel = ulevel
            }
            else if(dtype==3){
                tx = x
                ty = y+1
                tlevel = dlevel
            }
            res = dfs(type, level, ltype, llevel, rtype, rlevel, dtype, dlevel, utype, ulevel);
            if(res!='dontReturn')return res;
        }
        if(res==='dontReturn'){
            var no_name: Set<number> = new Set();
            no_name.add(100*tx+ty);
            findTLevelContinuous(tx,ty,no_name);
            pathToGrid.forEach((value,key)=>{
                minHeap.push([value.length,findKey(key),findValue(key)])
            })
            minHeap.sort(compareNumbers)
            path1 = findPath(0,0,alwaysReturnToX,alwaysReturnToY);
            path1 = path1.split('').reverse().join('');
        }
        if(path1.length==0){
            let xx:MinHeapElement = minHeap[minHeapIndex]
            let x: Pair = [xx[1],xx[2]]
            minHeapIndex++
            if(xx[1]==tx && xx[2]==ty){
                xx = minHeap[minHeapIndex]
                x = [xx[1],xx[2]]
                minHeapIndex++
            }
            path1 = pathToGrid.get(x[0]*100+x[1])
            path1 = complementAndReverse(path1)
        }
        let c = path1.charAt(path1.length-1)
        path1 = path1.slice(0,-1)
        if(c=='#'){
            fillToBeFilled();
            c = path1.charAt(path1.length - 1);
            path1 = path1.slice(0, -1);
        }
        if(c=='L') {
            x--;
            return 'left';
        }
        if(c=='R') {
            x++;
            return 'right';
        }
        if(c=='U') {
            y--;
            return 'up';
        }
        if(c=='D') {
            y++;
            return 'down';
        }
        if(c=='P')return 'pickup';
        if(c=='!') {
            toBeFilledLevel[dropped]++
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
    }

// More wizardry here

}


