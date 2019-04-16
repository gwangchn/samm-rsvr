<template>
    <div class="followbox" ref="tableheight">
        <Table :height="listheight" :columns="columns1" :data="followList"></Table>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        name: 'follow',
        data() {
            return {
                columns1: [{
                        title: '站名',
                        key: 'stnm',
                        align: 'center'
                    },
                    {
                        title: '水位(m)',
                        key: 'rz',
                        align: "center"
                    },
                    {
                        title: '流量(m³/s)',
                        key: 'inq',
                        align: "center"
                    }
                ],
                listheight:''
            }
        },
        computed: {
            ...mapGetters('water', ['followList'])
        },
        mounted() {
            this.listheight = parseInt(this.$refs.tableheight.offsetHeight);
        },
        methods: {}
    }
</script>
<style lang="scss" scoped>
.followbox{
  height: calc(100vh - 75px - #{$header-height});  
}
</style>