
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">10年一遇洪水:</span>
      </Col>
      <Col span="8">
        <span class="expand-value">{{ this.$util.convertQ(row.bwq1) }}</span>
      </Col>
      <Col span="8">
        <span class="expand-value">{{ this.$util.convertZ(row.rsarea1) }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">溃坝洪水:</span>
      </Col>
      <Col span="8">
        <span class="expand-value">{{ this.$util.convertQ(row.bwq) }}</span>
      </Col>
      <Col span="8">
        <span class="expand-value">{{ this.$util.convertZ(row.rsarea) }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>