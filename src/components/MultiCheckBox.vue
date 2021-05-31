<!--
 * @Author: your name
 * @Date: 2021-04-12 10:03:52
 * @LastEditTime: 2021-04-30 17:20:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \stopsite\src\components\MultiCheckBox.vue
-->
<template>
  <div class="multi-checkbox">
    <el-tooltip :content="checkBoxDataLabel.toString()" placement="top" :disabled="checkBoxDataLabel.length == 0">
      <el-select v-model="checkBoxDataLabel" placeholder="请选择" multiple :clearable="false" :collapse-tags="true" style="width: 100%" :disabled="disabled">
      <el-option :value="defaultData" style="display:none; width: 800px"></el-option>
      <!--全选，不选,反选-->
      <div class="operation" v-if="this.sourceData.length != 0">
        <el-checkbox label="" :indeterminate="isIndeterminate" v-model="checkAll" style="margin-right: 5px" @change="checkAllchange" v-if="multiType"></el-checkbox>
        <el-link type="primary" @click="checkAllClick" v-if="multiType">全选</el-link>
        <el-divider direction="vertical" v-if="multiType"></el-divider>
        <el-link type="primary" @click="inverseClick" v-if="multiType">反选</el-link>
        <el-divider direction="vertical" v-if="multiType"></el-divider>
        <el-link type="primary" @click="unCheckClick" v-if="multiType">不选</el-link>
        <el-divider direction="vertical" v-if="multiType"></el-divider>
        <div class="search-input"><el-input v-model="filterText" placeholder="输入关键字过滤"></el-input></div>
      </div>
      <el-checkbox-group v-model="checkBoxData" style="max-width: 600px" v-if="multiType">
        <div class="check-box-contain" v-for="item in data" :key="item.id">
          <p v-if="_isParentVisible(filterText, item)">{{item.title}}</p>
          <div class="">
            <el-checkbox style="margin-top: 10px;" v-show="_isVisible(filterText, ite.title) && _isParentVisible(filterText, item)" :label="ite.id" v-for="ite in item.children" :key="ite.id">{{ite.title}}</el-checkbox>
          </div>
          <el-divider direction="horizontal"></el-divider>
        </div>
      </el-checkbox-group>
      <el-radio-group v-model="checkBoxData" style="max-width: 600px" v-if="!multiType">
        <div class="check-box-contain" v-for="item in data" :key="item.id">
          <p v-if="_isParentVisible(filterText, item)">{{item.title}}</p>
          <div class="">
            <el-radio style="margin-top: 10px;" v-show="_isVisible(filterText, ite.title) && _isParentVisible(filterText, item)" :label="ite.id" v-for="ite in item.children" :key="ite.id">{{ite.title}}</el-radio>
          </div>
          <el-divider direction="horizontal"></el-divider>
        </div>
      </el-radio-group>
        <div class="no-data" v-if="this.data.length === 0">暂无数据</div>
    </el-select>
    </el-tooltip>
  </div>
</template>

<script>
// import { getPoints } from '../pages/siteApplication/request.js';
import _ from 'lodash'
export default {
  name: 'MultiCheckBox',
  data() {
    return {
      checkBoxData: this.defaultSelect,
      data: this.sourceData,
      defaultData: [],
      allData: [],
      filterText: '',
      isIndeterminate: false,
      checkAll: false
    }
  },
  props: {
    defaultSelect: {
      type: Array,
      required: false,
      default: ()=>{return []}
    },
    sourceData: {
      type: Array,
      required: false,
      default: () => {return []}
    },
    multiType: {
      type: Boolean,
      required: false,
      default: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  mounted() {
    this.data = _.cloneDeep(this.sourceData)
  },
  methods: {
    // 全选
    checkAllClick() {
      this.checkAll = true;
      this.isIndeterminate = false;
      this.checkBoxData = this._flatter(this.data).map(item=>item.id);
    },
    // 反选
    inverseClick() {
      var obj = this.checkBoxData.map(item=> {
        return item
      })
      this.checkBoxData = this._flatter(this.data).map(item=>item.id).filter(item=> {
        return !obj.includes(item)
      })
    },
    // 不选
    unCheckClick() {
      this.checkBoxData = []
    },
    // 点击按钮
    checkAllchange(data) {
      console.log(data);
      if(data) {
        this.checkBoxData = this._flatter(this.data).map(item=> item.id)
      } else {
        this.checkBoxData = [];
      }
    },
    // 树数据扁平化
    _flatter(data) {
      let cloneData = JSON.parse(JSON.stringify(data))   //先将原来的数组深拷贝一份，防止影响到原来的数据
      let obj = [];
      var fn = (cloneData)=> {
        cloneData.map(item=> {
          if(item.children == null) {
            obj.push(item)
          } else {
            fn(item.children)
          }
        })
      }
      fn(cloneData);
      return obj
    },
    _isVisible(text,data) {
      return data.includes(text)
    },
    _isParentVisible(text, data) {
      return ( data.children.some(item=> {
        return item.title.includes(text)
      }) || data.title.includes(text))
    }
  },
  computed: {
    checkBoxDataLabel: {
      get() {
        const checkArr = _.isArray(this.checkBoxData) ? this.checkBoxData : [this.checkBoxData]
        return this._flatter(this.sourceData).filter(item=>checkArr.includes(item.id)).map(item=>item.title)
      },
      set() {
        
      }
    }
  },
  watch: {
    checkBoxData: {
      handler(newVal) {
        if(newVal.length === this._flatter(this.sourceData).length) {
          this.isIndeterminate = false;
          this.checkAll = true;
          console.log(123);
        } else if(newVal.length == 0) {
          this.checkAll = false;
          this.isIndeterminate = false;
        } else {
          this.isIndeterminate = true;
          this.checkAll = false;
        }
        console.log(newVal);
        this.$emit('selectValue',newVal)
      }
    },
    filterText(newVal) {
      if(newVal === '') {
        this.data = JSON.parse(JSON.stringify(this.sourceData));
      } else {
        this.data = _.cloneDeep(this.sourceData).filter(item=> {
          item.children = _.cloneDeep(item.children).filter(item=> {
            return item.title.includes(newVal)
          })
          return (item.title.includes(newVal) || item.children.some(item=> {
              return item.title.includes(newVal)
          }));
        })
      }
      // console.log(this.data);
    },
    sourceData: {
      deep: true,
      handler(newVal) {
        this.data = _.cloneDeep(newVal)
      }
    },
    defaultSelect: {
      deep: true,
      handler(newVal) {
        this.checkBoxData = _.cloneDeep(newVal)
      }
    },
    checkAll(newVal) {
      if(newVal === false) {
        //this.checkBoxData = []
      }/*  else {
        this.checkBoxData =  this._flatter(this.data).map(item=>item.id)
      } */
    }
  },
}
</script>

<style scoped>
p {
 line-height: 30px;
 color: #606266;
 font-size: 16px;
 padding: 0;
 margin: 0;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
}
 
.el-select-dropdown__item.selected {
   font-weight: normal;
}
 
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
 
.el-tree-node__label {
  font-weight: normal;
}
/* .el-tree >>> .is-current .el-tree-node__label {
  color: #409EFF;
  font-weight: 700;
} */
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.el-popper {
  z-index: 9999;
}
.ification_col {
  width: 20px;
  height: 10px;
  display: inline-block;
}
.el-tag__close {
  display: none;
}
.multi-checkbox >>> .el-tag .el-icon-close{
  display: none;
}
.multi-checkbox >>> span.el-select__tags-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.multi-checkbox >>> .el-select__tags>span {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.multi-checkbox >>> .el-select__tags>span>span:first-child {
  flex: 1;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
.operation >>> .el-radio{
  margin-top: 10px !important;
}
.is-checked .el-tree-node__label {
  color: #606266;
}
.btn-content {
  display: flex;
  justify-content: center;
}
.search-input {
  display: inline-block;
}
.search-content {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.check-box-contain {
  margin: 10px;
  min-width: 350px;
}
.operation {
  border-bottom: 1px solid #eee;
  padding: 6px 10px 10px 10px;
  position: absolute;
  background-color: #fff;
  width: 100%;
  min-width: 300px;
  top: 0;
  left: 0;
  z-index: 99;
}
.el-checkbox-group, .el-radio-group {
  margin-top: 40px;
}
.no-data {
  padding: 50px 150px;
  color: #C0C4CC;
  font-size: 14px;
}
</style>
