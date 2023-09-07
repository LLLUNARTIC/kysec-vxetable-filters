<template>
  <div class="my-filter-number">
    <div class="my-fc-input">
      <vxe-input v-model="min" type="number" placeholder="请输入最小值" />
      <span style="margin:0 4px;">至</span>
      <vxe-input v-model="max" type="number" placeholder="请输入最大值" />
    </div>
    <div class="my-fc-footer">
      <vxe-button status="primary" :disabled="!isEnable" @click="confirmEvent">筛选</vxe-button>
      <vxe-button @click="resetEvent">重置</vxe-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterNumber',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      size: 'mini', // 被所有子组件继承 size
      column: null,
      option: null,
      min: null,
      max: null
    }
  },
  computed: {
    isEnable() {
      return this.min !== '' && this.max !== ''
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      const { column } = this.params
      const option = column.filters[0]
      this.column = column
      this.option = option
      this.min = option?.data?.min || ''
      this.max = option?.data?.max || ''
    },
    confirmEvent(evnt) {
      const { params, option } = this
      const { $panel, $table } = params
      option.data.min = this.min
      option.data.max = this.max

      $table.clearScroll()
      setTimeout(() => {
        $panel.changeOption(evnt, true, option)
        $panel.confirmFilter()
      }, 500)
    },
    resetEvent() {
      const { $panel } = this.params
      $panel.resetFilter()
    }
  }
}
</script>

<style scoped>
.my-filter-number {
  width: 260px;
  padding: 5px 15px 10px 15px;
}
.my-filter-number .my-fc-input {
  display: flex;
  align-items: center;
  padding: 8px 0;
}
.my-filter-number .my-fc-footer {
  text-align: center;
}
</style>
