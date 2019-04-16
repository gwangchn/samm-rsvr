<template>
    <div class="warnnum"  :style="style">
        <ul class="overview-warnMap-message">
            <li>
                <header class="text-title message-real">漫顶 {{overTotal}}</header>
                <section class="message-list">
                <span v-for="(item, index) in overList"
                        :key="'realList' + index">{{item.dsnm}}({{item.total}})</span>
                </section>
            </li>
            <li>
                <header class="text-title message-forecast">超设计 {{foreTotal}}</header>
                <section class="message-list">
                <span v-for="(item, index) in foreList"
                        :key="'foreList' + index">{{item.dsnm}}({{item.total}})</span>
                </section>
            </li>
            <li>
                <header class="text-title message-overtop">超汛限 {{realTotal}}</header>
                <section class="message-list">
                <span v-for="(item, index) in realList"
                        :key="'overList' + index">{{item.dsnm}}({{item.total}})</span>
                </section>
            </li>
        </ul>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapMutations,
        mapActions
    } from 'vuex'
    export default {
        name: 'warnnum',
        data() {
            return {
                realTotal: 0,
                foreTotal: 0,
                overTotal: 0,
                realList: [],
                foreList: [],
                overList: []
            }
        },
        computed: {
            style() {
            let {initWidth,showFlag} = this;
            return {
                right: initWidth + 30 +'px',
                transform: `translateX(${showFlag ? 0 : initWidth}px)`
                }
            },
            ...mapGetters(['initWidth','showFlag']),
            ...mapGetters('warning',['warnNumdata'])
        },
        watch:{
            warnNumdata:{
                deep: true,
                handler(val) {
                    this.realTotal = 0
                    this.foreTotal = 0
                    this.overTotal = 0
                    this.realList = []
                    this.foreList = []
                    this.overList = []
                    this.init(val);
                }
            }
        },
        mounted() {},
        methods: {
            ...mapActions('warning',["getWarnNum"]),
            init(data){
                this.realList = data[1] ? data[1] : []
                this.foreList = data[2] ? data[2] : []
                this.overList = data[3] ? data[3] : []
                this.realList.forEach(({ total }) => {
                this.realTotal += total
                })
                this.foreList.forEach(({ total }) => {
                    this.foreTotal += total
                })
                this.overList.forEach(({ total }) => {
                    this.overTotal += total
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.warnnum{
    transition: all 0.5s ease;
    position: absolute;
    width: 200px;
    height: 200px;
     background: rgba($color: #fff, $alpha: 1);
    bottom: 20px;
    display: flex;
    border-radius: 5px;
    .overview-warnMap-message {
        width: 100%;
        font-size: 14px;
        padding: 0 10px;
        overflow-y: auto;
        li {
            padding: 10px 0;
        }
        .text-title {
            border-bottom: 1px dashed black;
            font-size: 14px;
            font-weight: bold;
            height: 22px;
            line-height: 22px;
        }
        .message-list {
            display: flex;
            flex-wrap: wrap;
            span {
                width: 50%;
                line-height: 22px;
            }
        }
        .message-real {
            color: red;
        }
        .message-forecast {
            color: gold;
        }
        .message-overtop {
            color: blue;
        }
    }
}
</style>