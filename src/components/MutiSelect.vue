<!--
 * @Author: your name
 * @Date: 2020-11-05 15:27:45
 * @LastEditTime: 2020-11-17 10:03:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \上海审核合并\src\components\MutiSelect.vue
-->
<template>
  <div class="muti-select">
    <el-tooltip :content="addForm.pointName.toString()" placement="top" :disabled="addForm.pointName == ''">
      <el-select v-model="addForm.pointName" placeholder="请选择" multiple value-key="value" @change="selectChange"
        @remove-tag="removeTag" @visible-change="visibleChange" style="max-width:400px">
        <div class="operation">
          <div class="btn-content" v-if="btnSelect">
            <el-button size="mini" type="primary" @click="allSelect">全选</el-button>
            <!-- <el-divider></el-divider> -->
            <el-button size="mini" type="primary" @click="invertSelect">反选</el-button>
            <!-- <el-divider></el-divider> -->
            <el-button size="mini" type="primary" @click="noneSelect">不选</el-button>
          </div>
          <div class="search-content">
            <el-input v-model="filterText" placeholder="输入关键字进行过滤" class="search-input"></el-input>
          </div>
        </div>
        <el-option :value="addForm.mutiPoint" v-if="this.selectData.length !== 0">
          <!--  <el-tree :data="this.selectData" :show-checkbox="multiType" ref="tree" node-key="id"
          @check-change="handleCheckChange" :check-on-click-node="true" :filter-node-method="filterNode"
          :expand-on-click-node="false" @node-click="nodeClick" :props="defaultPropsInner"
          :default-checked-keys="defaultData"></el-tree> -->
          <el-tree :data="this.selectData" :show-checkbox="multiType" ref="tree" node-key="id"
            @check-change="handleCheckChange" :check-on-click-node="true" :filter-node-method="filterNode"
            :expand-on-click-node="false" @node-click="nodeClick" :props="defaultPropsInner"
            :default-checked-keys="defaultData"></el-tree>
        </el-option>
      </el-select>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        addForm: {
          pointName: '',
          mutiPoint: []
          // mutiPoint: this.defaultData
        },
        filterText: '',
        defaultPropsInner: this.defaultProps, // 默认树节点
        pN: [],
        faltData: [], // 扁平化原始数据源,
        factorDefaultData: []
      }
    },
    props: ['selectData', 'multiType', 'defaultData', 'defaultProps', 'btnSelect'],
    mounted() {
      console.log(this.defaultData);

    },
    methods: {
      // 下拉改变
      selectChange(e) {
        console.log(e)
        this.addForm.mutiPoint = this.addForm.mutiPoint.filter(item => {
          return e.includes(item[this.defaultProps.label])
        });
        this.$refs.tree.setCheckedNodes(this.addForm.mutiPoint);
      },
      // 树改变
      handleCheckChange(data, checked, child) {
        let res = this.$refs.tree.getCheckedNodes(true, true);
        console.log(res);
        this.addForm.pointName = res.map(item => {
          return item[this.defaultProps.label]
        });
        this.addForm.mutiPoint = res.map(item => {
          return item
        })
        this.$emit('changeData', this.addForm.mutiPoint)
      },
      removeTag() {
        return false;
      },
      // 节点点击
      nodeClick(data, checked, child) {
        console.log(data);
        setTimeout(() => {
          if (!this.multiType) {
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
        var selectNode = this.$refs.tree.getCheckedKeys(true, true);
        console.log(selectNode, this.faltData)
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
          if (item[this.defaultProps.children] != null) {
            this.flatten(item[this.defaultProps.children])
          } else {
            this.faltData.push(item.id)
          }
        })
      },
      filterNode(value, data) {
        /* console.log(value);//输入的值
        console.log(data);//下拉树中的数据 */
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
        /*  
         console.log(data)
          */
      },
      visibleChange() {
        this.filterText = ''
      }
    },
    watch: {
      filterText(val) {
        // console.log(val)
        this.$refs.tree.filter(val);
      },
      defaultData(newVal) {
        // 在这里选择想要默认展示的数据
        /*     if (this.selectData.length == 1) {
              this.selectData.forEach(item => {
                // console.log(item.children);
                this.addForm.mutiPoint = item.children.filter(itee => {
                  return newVal.includes(itee.id)
                })
                console.log(this.addForm.mutiPoint);
              })
              console.log(this.addForm.mutiPoint);
              this.addForm.pointName = this.addForm.mutiPoint.map(item => {
                console.log(item);
                return item.name
              });
              console.log(this.addForm.pointName);
            } else {
              console.log(this.selectData.map(item => {
                return item.children
              }).flat(Infinity))
              this.addForm.mutiPoint = this.selectData.map(item => {
                return item.children
              }).flat().filter(item1 => {
                return newVal.includes(item1.id)
              });
              this.addForm.pointName = this.addForm.mutiPoint.map(item => item.name)
            } */
        // flat()扁平化，将多维数组扁平化为一维数组
        this.addForm.mutiPoint = this.selectData.map(item => {
          return item.children
        }).flat().filter(item1 => {
          return newVal.includes(item1.id)
        });
        this.addForm.pointName = this.addForm.mutiPoint.map(item => item.name)
        // this.$emit('changeData', this.addForm.mutiPoint)
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

  ul li>>>.el-tree .el-tree-node__content {
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
  .el-tree>>>.is-current .el-tree-node__children .el-tree-node__label {
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
    padding: 0 10px;
    display: flex;
    justify-content: space-around;
  }

  .search-input {
    display: block;
  }

  .search-content {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
</style>
