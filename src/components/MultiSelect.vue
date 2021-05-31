<!--
 * @Author: your name
 * @Date: 2020-11-05 15:27:45
 * @LastEditTime: 2021-05-08 15:15:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \上海审核合并\src\components\MutiSelect.vue
-->
<template>
  <div class="muti-select">
    <el-tooltip :content="addForm.pointName.toString()" placement="top" :disabled="addForm.pointName == ''">
      <el-select
      v-model="addForm.pointName"
      placeholder="请选择"
      multiple
      collapse-tags
      value-key="value"
      @change="selectChange"
      clearable
      @remove-tag="removeTag"
      @visible-change="visibleChange"
      @clear="clear"
      style="max-width:400px"
    >
      <div class="operation">
        <div class="btn-content" v-if="btnSelect">
          <el-button-group>
            <el-button type="primary" @click="allSelect" size="mini">全选</el-button>
            <el-button type="primary" @click="invertSelect" size="mini">反选</el-button>
            <el-button type="primary" @click="noneSelect" size="mini">不选</el-button>
          </el-button-group>
        </div>
        <div class="search-content">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="search-input"></el-input>
        </div>
      </div>
      <el-option :value="addForm.mutiPoint" v-if="this.selectData.length !== 0">
        <el-tree :data="this.selectData"
        :show-checkbox="multiType" ref="tree" node-key="id"
        @check-change="handleCheckChange"
        :check-on-click-node="true"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
<<<<<<< HEAD
        :default-checked-keys="this.defaultData"
=======
        :default-checked-keys="defaultData"
>>>>>>> dd7c6ac97f4531d1521b5638be92c64419e3e96e
        @node-click="nodeClick" :props="defaultPropsInner"></el-tree>
      </el-option>
      </el-select>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  data() {
    return {
      addForm:{
        pointName: '',
        mutiPoint: this.defaultData
      },
      filterText: '',
      defaultPropsInner: this.defaultProps, // 默认树节点
      pN: [],
      faltData:[] // 扁平化原始数据源
    }
  },
  props: {
    selectData: {
      type: Array,
      required: false,
      default: ()=>[]
    },
    multiType: {
      type: Boolean,
      required: false,
      default: false
    },
    defaultData: {
      type: Array,
      required: false,
      default: ()=>[]
    },
    defaultProps: {
      type: Object,
      required: false,
      default: ()=> {
        return {
        children: 'children',
        label: 'label'
      }
      }
    },
    btnSelect: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    // 下拉改变
    selectChange(e) {
      console.log(e)
      this.addForm.mutiPoint = this.addForm.mutiPoint.filter(item => {
        return e.includes(item[this.defaultProps.label])
      });
      this.$refs.tree.setCheckedNodes(this.addForm.mutiPoint);
      this.$emit('changeData', this.addForm.mutiPoint)
    },
    // 树改变
    handleCheckChange() {
      let res = this.$refs.tree.getCheckedNodes(true,true);
      console.log(res);
      this.addForm.pointName = res.map(item => {
        return item[this.defaultProps.label]
      });
      this.addForm.mutiPoint = res.map(item => {
        return item
      })
      this.$emit('changeData', this.addForm.mutiPoint)
      console.log(this.addForm.mutiPoint);
    },
    removeTag() {
      return false;
    },
    clear() {
      console.log(123);
      this.addForm.mutiPoint = [];
    },
    // 节点点击
    nodeClick(data) {
      console.log(data);
      setTimeout(()=> {
        if(!this.multiType) {
          this.$refs.tree.setCheckedNodes([data])
        }
      })
    },
    // 全选
    allSelect() {
      this.faltData = [];
      this.flatten(this.selectData);
      this.$refs.tree.setCheckedKeys(this.faltData);
    },
    // 反选
    invertSelect() {
      this.faltData = [];
      this.flatten(this.selectData);
      var selectNode = this.$refs.tree.getCheckedKeys(true,true);
      console.log(selectNode,this.faltData)
      var invertData = this.faltData.filter(item => {
        return selectNode.indexOf(item) == -1
      });
      console.log(invertData)
      this.$refs.tree.setCheckedKeys(invertData);
    },
    noneSelect() {
       this.$refs.tree.setCheckedKeys([]);
    },
    // 扁平化
    flatten(obj) {
      obj.map(item => {
        if(item[this.defaultProps.children] !=null) {
          this.flatten(item[this.defaultProps.children])
        } else {
          this.faltData.push(item.id)
        }
      })
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
     filterNode(value, data) {
        if (!value) return true;
        console.log(data)
        return data.title.indexOf(value) !== -1;
    },
    visibleChange() {
      this.filterText = ''
    }
  },
  watch: {
    filterText(val) {
      console.log(val)
      this.$refs.tree.filter(val);
    },
    defaultData: {
      deep: true,
      handler(newval) {
        console.log(newval);
        const flatList = this._flatter(this.selectData);
        this.addForm.pointName = flatList.filter(item=> {
         return newval.includes(item.id);
        }).map(item=> {
          return item.title
        });
        console.log(this.addForm.pointName);
      },
      // immediate: true
    }
  }
};
</script>

<style scoped>

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
  display: none !important;
}
.is-checked .el-tree-node__label {
  color: #606266;
}
.btn-content {
  display: flex;
  justify-content: center;
}
.search-input {
  display: block;
}
.search-content {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.muti-select >>> .el-select .el-select__tags>span {
  display: flex;
  overflow: hidden;
}
.muti-select >>> span.el-tag {
  display: inline;
}
</style>
