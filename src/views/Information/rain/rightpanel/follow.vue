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
                        title: '降水量(mm)',
                        key: 'drp',
                        align: 'center'
                    }
                ],
                listheight:''
            }
        },
        computed: {
            ...mapGetters('rain', ['followList'])
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