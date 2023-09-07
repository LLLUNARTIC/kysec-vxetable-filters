<template>
  <div class="my-filter-content">
    <div class="my-fc-search">
      <div class="my-fc-search-top">
        <vxe-input
          v-model="option.data.sVal"
          placeholder="搜索"
          suffix-icon="fa fa-search"
          @input="searchEvent"
        />
      </div>
      <div class="my-fc-search-content">
        <template v-if="valList.length">
          <ul class="my-fc-search-list my-fc-search-list-head">
            <li class="my-fc-search-item">
              <vxe-checkbox v-model="isAll" @change="changeAllEvent">全选 ({{ fullCount }})</vxe-checkbox>
            </li>
          </ul>
          <ul class="my-fc-search-list my-fc-search-list-body">
            <li v-for="(item, sIndex) in valList" :key="sIndex" class="my-fc-search-item">
              <vxe-checkbox v-model="item.checked" @change="onCheckboxChange">
                {{ item.value === '' ? '[空白]' : item.value }} ({{
                item.count
                }})
              </vxe-checkbox>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="my-fc-search-empty">无匹配项</div>
        </template>
      </div>
    </div>
    <div class="my-fc-footer">
      <vxe-button
        status="primary"
        :loading="loading"
        :disabled="disabled"
        @click="confirmFilterEvent"
      >筛选</vxe-button>
      <vxe-button @click="resetFilterEvent">重置</vxe-button>
    </div>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
export default {
  name: 'FilterContent',
  props: {
    params: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      size: 'mini',
      isAll: false,
      option: null,
      colValList: [],
      valList: [],
      loading: false
    }
  },
  computed: {
    fullCount() {
      if (this.valList.length === 0) {
        return 0
      } else {
        return this.valList.reduce((total, cur) => {
          return cur.count + total
        }, 0)
      }
    },
    disabled() {
      return this.valList.every((item) => {
        return item.checked === false
      })
    }
  },
  watch: {
    valList() {
      this.updateAllChecked()
    }
  },
  created() {
    this.load()
  },
  methods: {
    updateAllChecked() {
      // 判断是不是全选了
      const isAllChecked = this.valList.every((item) => {
        return item.checked === true
      })
      this.isAll = isAllChecked
    },
    onCheckboxChange() {
      this.updateAllChecked()
    },
    load() {
      const { $table, column } = this.params
      const allData = $table.getTableData()
      const { visibleData } = allData
      const option = column.filters[0]
      const { vals } = option.data
      const groupData = XEUtils.groupBy(visibleData, column.field)
      let colValList = undefined
      // const oriOptions = []
      // let needSplit = undefined


      // for (const key in groupData) {
      //   if (key.includes(',') || key.includes('，')) {
      //     needSplit = true
      //   }
      //   oriOptions.push(key)
      // }

      // if (needSplit) {
      //   let splitedOptions = []
      //   oriOptions.forEach(item => {
      //     if (item.includes(',') || item.includes('，')) {
      //       splitedOptions.push(...item.split(','))
      //     } else {
      //       splitedOptions.push(item)
      //     }
      //   })
      //   splitedOptions = [...new Set(splitedOptions)]
      //   console.log(splitedOptions);
      //   colValList = splitedOptions.map(item => {
      //     return {
      //       count: null,
      //       checked: vals.includes(item),
      //       value: item
      //     }
      //   })
      //   console.log(colValList);


      // } else {
      //   colValList = Object.keys(groupData)
      //     .map((val) => {
      //       return {
      //         count: groupData[val].length,
      //         checked: vals.includes(val),
      //         value: val
      //       }
      //     })
      //     .sort((a, b) => {
      //       return b.count - a.count
      //     })
      // }
      colValList = Object.keys(groupData)
        .map((val) => {
          return {
            count: groupData[val].length,
            checked: vals.includes(val),
            value: val
          }
        })
        .sort((a, b) => {
          return b.count - a.count
        })

      this.option = option
      this.colValList = colValList
      // 如果选中，这里把没选中的再过滤一边，不显示
      if (option.checked) {
        this.valList = colValList.filter((item) => {
          return vals.includes(item.value)
        })
      } else {
        this.valList = colValList
      }

      if (vals.length === this.valList.length) {
        this.isAll = true
      }
    },
    searchEvent() {
      const { option, colValList } = this
      this.valList = option.data.sVal
        ? colValList.filter((item) => item.value.indexOf(option.data.sVal) > -1)
        : colValList
    },
    changeAllEvent() {
      const { isAll } = this
      this.valList.forEach((item) => {
        item.checked = isAll
      })
    },
    confirmFilterEvent(evnt) {
      this.loading = true
      const { params, option, valList } = this
      const { data } = option
      const { $panel, $table } = params
      data.vals = valList
        .filter((item) => item.checked)
        .map((item) => item.value)
      $table.clearScroll()
      setTimeout(() => {
        $panel.changeOption(evnt, true, option)
        $panel.confirmFilter()
        this.loading = false
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
  border: 1px solid #ababab;
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
  display: block;
  overflow: auto;
  max-height: 200px;
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
