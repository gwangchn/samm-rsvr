<template>
  <div class="TimeBar" :style="{width:barwidth}">
    <div class="play" @click="oPaly">
        <Icon :type="this.pasuePlay?'ios-play':'ios-pause'"></Icon>
    </div>
    <div class="showTime">{{oName}}</div>
    <div class="line">
        <ul>
            <li ref="li" :style="{ width: cellWidth }" v-for="(item,index) in barData" :key="index"
            :class="{active:item.isActive}" @click="jump(index,item)"></li>
        </ul>
    </div>
  </div>
</template>
<script>
export default {
    name: 'TimeBar',
    props: {
        barwidth:{
            type:String,
            default:'calc(100vw  - 380px)'
        },
        passTime:{
            type:Object,
            default() {
                return {}
            }
        }
    },
    components:{},
    data() {
        return {
            pasuePlay:false,
            oName:'2018-11-08',
            barData:[],
            oIndex: 0, //正在播放的下标
        };
    },
    watch:{
        passTime(value){
            this.creatTimeSet(value.value);
        }
    },
    mounted(){},
    methods:{
        oPaly(){
            if (this.pasuePlay) {
                this.pasuePlay = !this.pasuePlay
                clearInterval(this.addPercent);
            } else {
                this.pasuePlay = !this.pasuePlay
                this.addPercent = setInterval(() => {
                    this.creatBarline(this.oIndex);
                    this.oIndex++;
                }, 1000);
            }
        },
        //生成timebar时间数组
        creatTimeSet(num){
            let _this = this;
            let start = new Date().formatDate('yyyy-MM-dd 08:00:00').toDate().getTime();//开始时间毫秒数
            let timeSet = [];
            for (let i = 0; i < 169 - num; i++) {
                timeSet.push({
                    name: this.$util.formatDate(new Date(start), 'yyyy-MM-dd HH'),
                    isActive:false
                });
                start = start + 3600000;
            };
            _this.barData = timeSet;
            _this.oIndex = 0;//格式化索引
            _this.creatBarline(0);
        },
        //timebar逻辑
        creatBarline(index){
            if(index  ==  this.barData.length || index  >  this.barData.length){
                 clearInterval(this.addPercent);
                 this.pasuePlay = false;//改变开始停止按钮样式
            }else{
                let nowTime = this.barData[index];
                this.oName = nowTime.name;
                this.$emit('passbarTime',nowTime.name);//数据传回父组件调服务
                //timebar样式
                this.barData.forEach(x=>{
                    x.isActive = false;
                });
                nowTime.isActive = !nowTime.isActive;
            }
            
        },
        //点击timebar上的点
        jump(e,value){
            clearInterval(this.addPercent);
            this.pasuePlay = false;//改变开始停止按钮样式
            this.oIndex = e + 1;
            //点击时间轴上点  改变颜色
            this.barData.forEach(x=>{
                x.isActive = false;
            });
            value.isActive = !value.isActive;
            this.oName = value.name;
            this.$emit('passbarTime',value.name);//数据传回父组件
        }
    },
    computed: {
      cellWidth() {
        let {barData} = this
        let length = barData.length === 0 ? 1 : barData.length
        return 1 / length * 100 + '%'
      }
    },
    beforeDestroy(){
        this.$eventBus.$off('initTimeSet');
    }
}
</script>

<style scoped lang="scss">
    $bar-height: 20px;
    .TimeBar{
        transition: all 0.4s ease;
        -webkit-transition: all 0.4s ease; /* Safari 和 Chrome */
        -o-transition: all 0.4s ease; /* Opera */
        position: absolute;
        bottom: 0px;
        left: $menu-width;
        height: $bar-height;
        background: #fff;
        .play {
            width: 40px;
            height: 100%;
            text-align: center;
            line-height: 20px;
            float: left;
            cursor: pointer;
            background: #3aa5fe;
        }
        .showTime {
            width: 100px;
            height: 100%;
            float: left;
            text-align: center;
            line-height: 20px;
            border-right: 1px solid #ddd;
            background: #ddd;
            font-size: 10px;
            font-weight: 900;
        }
        .line{
            width: calc(100% - 140px);
            height: 100%;
            float: right;
            position: relative;
            ul {
                right: 0;
                width: 100%;
                z-index: 4;
                position: absolute;
                li {
                    float: left;
                    width: 30px;
                    height: $bar-height;
                    line-height: $bar-height;
                    text-align: center;
                    cursor: pointer;
                    border-right: 1px solid #ddd;
                    font-size: 10px;
                    font-weight: 600;
                    position: relative;
                }
                li.active{
                     background: #409EFF;
                }
            }
            ul li:hover {
                background: #409EFF;
            }
        }
    }
</style>
