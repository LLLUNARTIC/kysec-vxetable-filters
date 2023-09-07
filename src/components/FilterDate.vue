<template>
  <div class="my-filter-date">
    <div class="my-fc-input">
      <vxe-input v-model="start" placeholder="开始日期" type="date" @change="selStartDate" />
      <span style="margin:0 4px;">至</span>
      <vxe-input
        v-model="end"
        class="datepicker-right"
        :disabled-method="disabledDate"
        placeholder="结束日期"
        type="date"
      />
    </div>
    <div class="my-fc-footer">
      <vxe-button status="primary" :disabled="!isEnable" @click="confirmEvent">筛选</vxe-button>
      <vxe-button @click="resetEvent">重置</vxe-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterDate',
  props: {
    params: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      size: 'mini', // 被所有子组件继承 size
      column: null,
      option: null,
      start: null,
      end: null
    }
  },
  computed: {
    isEnable() {
      return this.start !== '' && this.end !== ''
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
      this.start = option?.data?.start || ''
      this.end = option?.data?.end || ''
    },
    confirmEvent(evnt) {
      const { params, option } = this
      const { $panel, $table } = params
      // 临时补全时间
      option.data.start = this.start + ' 00:00:00'
      option.data.end = this.end + ' 23:59:59'
      $table.clearScroll()
      setTimeout(() => {
        $panel.changeOption(evnt, true, option)
        $panel.confirmFilter()
        // 筛选API调用后还原控件绑定值精度 防止再次筛选时出错
        option.data.start = this.start
        option.data.end = this.end
      }, 500)
    },
    resetEvent() {
      const { $panel } = this.params
      $panel.resetFilter()
    },
    selStartDate() {
      // 选择开始时间置空结束时间
      this.end = ''
    },
    disabledDate({ date }) {
      // 结束时间禁用开始时间之前的日期
      if (this.start) {
        return new Date(this.start).valueOf() - 86400000 > date.valueOf()
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.datepicker-right {
  ::v-deep .vxe-input--panel {
    right: 0 !important;
    left: initial !important;
  }
}
</style>

<style scoped>
.my-filter-date {
  width: 260px;
  padding: 5px 15px 10px 15px;
}
.my-filter-date .my-fc-input {
  display: flex;
  align-items: center;
  padding: 8px 0;
}
.my-filter-date .my-fc-footer {
  text-align: center;
}
</style>
