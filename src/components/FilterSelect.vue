<template>
  <div class="my-filter-content">
    <div class="my-fc-search">
      <div class="my-fc-search-content">
        <template>
          <ul class="my-fc-search-list my-fc-search-list-head">
            <li class="my-fc-search-item">
              <vxe-checkbox v-model="isAll" @change="changeAllEvent">全选</vxe-checkbox>
            </li>
          </ul>
          <ul class="my-fc-search-list my-fc-search-list-body">
            <li v-for="(item, sIndex) in valList" :key="sIndex" class="my-fc-search-item">
              <vxe-checkbox v-model="item.checked">{{ item.value }}</vxe-checkbox>
            </li>
          </ul>
        </template>
      </div>
    </div>
    <div class="my-fc-footer">
      <vxe-button status="primary" @click="confirmFilterEvent">筛选</vxe-button>
      <vxe-button @click="resetFilterEvent">重置</vxe-button>
    </div>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
export default {
  name: 'FilterSelect',
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      size: 'mini',
      isAll: false,
      option: null,
      colValList: [],
      valList: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      const { $table, column } = this.params
      const { fullData } = $table.getTableData()
      const option = column.filters[0]
      const { vals } = option.data
      const notEmptyDate = fullData.filter(item => {
        const filed = item[column.field]
        return filed !== null && filed !== undefined && filed !== ''
      })

      const colValList = Object.keys(XEUtils.groupBy(notEmptyDate, column.field)).map(val => {
        return {
          checked: vals.includes(val),
          value: val
        }
      })
      this.option = option
      this.colValList = colValList
      // 如果选中，这里把没选中的再过滤一边，不显示
      if (option.checked) {
        this.valList = colValList.filter(item => {
          return vals.includes(item.value)
        })
      } else {
        this.valList = colValList
      }
    },
    searchEvent() {
      const { option, colValList } = this
      this.valList = option.data.sVal ? colValList.filter(item => item.value.indexOf(option.data.sVal) > -1) : colValList
    },
    changeAllEvent() {
      const { isAll } = this
      this.valList.forEach(item => {
        item.checked = isAll
      })
    },
    confirmFilterEvent(evnt) {
      const { params, option, valList } = this
      const { data } = option
      const { $panel, $table } = params
      data.vals = valList.filter(item => item.checked).map(item => item.value)

      $table.clearScroll()
      setTimeout(() => {
        $panel.changeOption(evnt, true, option)
        $panel.confirmFilter()
      }, 500)
    },
    resetFilterEvent() {
      const { $panel } = this.params
      $panel.resetFilter()
    }
  }
}
</script>

<style scoped>
.my-filter-content {
  padding: 10px;
  user-select: none;
}
.my-filter-content .my-fc-search .my-fc-search-top {
  position: relative;
  padding: 5px 0;
}
.my-filter-content .my-fc-search .my-fc-search-top > input {
  border: 1px solid #ABABAB;
  padding: 0 20px 0 2px;
  width: 200px;
  height: 22px;
  line-height: 22px;
}
.my-filter-content .my-fc-search .my-fc-search-content {
  padding: 2px 10px;
}
.my-filter-content .my-fc-search-empty {
  text-align: center;
  padding: 20px 0;
}
.my-filter-content .my-fc-search-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.my-filter-content .my-fc-search-list-body {
  overflow: auto;
  height: 120px;
}
.my-filter-content .my-fc-search-list .my-fc-search-item {
  padding: 2px 0;
  display: block;
}
.my-filter-content .my-fc-footer {
  text-align: right;
  padding-top: 10px;
}
.my-filter-content .my-fc-footer button {
  padding: 0 15px;
  margin-left: 15px;
}
</style>
