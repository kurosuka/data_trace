<!--
 * @Author: your name
 * @Date: 2021-03-24 17:06:43
 * @LastEditTime: 2021-03-25 16:24:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\StantardAuditPeople.vue
-->
<template>
  <div class="stantard-people">
    <el-container>
      <el-aside width="200px">
        <el-tree ref="tree" :data="treeData" node-key="id" :default-expand-all="true" show-checkbox highlight-current @check="checkChange" current-node-key="李四"></el-tree>
      </el-aside>
      <el-main>
          <div v-if="userName.length != 0">
            <el-form :model="tagForm">
              <el-form-item label="用户">
                <el-tag size="small" type="" v-for="item in userName" :key="item.value" :disable-transitions="true">{{item.label}}</el-tag>
              </el-form-item>
            </el-form>
            <div class="line"></div>
          </div>
        <div class="">
          <div class="checkbox-contant" v-for="(item,index) in pointData" :key="item.id">
            <div class="point"><el-checkbox :indeterminate="isIndeterminate[index]" v-model="checked[index]" @change="handleCheckAllChange(checked,index,item)">{{item.label}}</el-checkbox></div>
            <el-checkbox-group v-model="checkBoxForm[index]">
              <el-checkbox :label="ite.id" v-for="(ite) in item.children" :key="ite.id" @change="change(checked,index,item)">{{ite.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="save">
          <el-button type="warning" @click="save">保存</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'StantardAuditPeople',
  data() {
    return {
      treeData: [
        {
          label: '全部',
          id:1,
          children: [{
            label: '部门',
            id:2,
            children: [{
              label: '张三',
              id: 3,
            },{
              label: '李四',
              id: 4
            },]
          }]
        },{
          label: '全部',
          id:5,
          children: [{
            label: '部门',
            id:6,
            children: [{
              label: '张三',
              id: 7,
              children: null
            },{
              label: '李四',
              id: 8,
              children: null
            },]
          }]
        }
      ],
      form: {
        selectValue: [],
      },
      areaData: [
        {
          label: '黄山',
          value: '1'
        }
      ],
      userName: [],
      tagForm: {},
      checkBoxForm: [],
      pointData: [
        {
          id:1,
          label: '黄山',
          children: [
            {
              id:2,
              label: '通仙桥',
              children: null
            },
            {
              id:3,
              label: '通仙桥',
              children: null
            }
          ]
        },
        {
          id:4,
          label: '黄山',
          children: [
            {
              id:5,
              label: '通仙桥',
              children: null
            },
            {
              id:6,
              label: '通仙桥',
              children: null
            }
          ]
        }
      ],
      isIndeterminate: [],
      checked: [],
    }
  },
  created() {
    this.pointData.forEach((item, index)=> {
      this.$set(this.checkBoxForm, index, []);
      this.$set(this.isIndeterminate, index, false);
      this.$set(this.checked, index, false);
    })
  },
  mounted() {
    console.log(window.API);
  },
  methods: {
    save() {
      console.log(this.$refs.tree.getCheckedNodes(true, true));
    },
    checkChange() {
      console.log(this.$refs.tree.getCheckedNodes(true, true));
      this.userName = this.$refs.tree.getCheckedNodes(true, true)
    },
    handleCheckAllChange(data,index,item) {
        this.isIndeterminate[index] = false;
        this.checkBoxForm[index] = this.checked[index] ? item.children.map(item=>item.id) : []
        console.log(item);
      },
    change(data,index,item) {
      console.log(item.children.length);
      this.checked[index] = this.checkBoxForm[index].length === item.children.length;
      this.isIndeterminate[index] = this.checkBoxForm[index].length > 0 && this.checkBoxForm[index].length < item.children.length;
      console.log(this.checkBoxForm[index].length,item.children.length, this.isIndeterminate[index],this.checked[index]);
    },
    getLastChildNode(node, temp = []) {
    let forFn = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].children) {
                temp.push(arr);
                arr = [];
            } else {
                forFn(arr[i].children)
            }
        }
    }
      forFn(node)
      return temp;
    }
  },
}
</script>

<style lang="scss" scoped>
.stantard-people {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      border-right: 1px solid #eee;
    }
  }
  .user {
    font-size: 12px;
  }
  .el-tag {
    margin-right: 15px;
  }
  .line {
    height: 1px;
    width: 100%;
    background-color: #eee;
    margin-bottom: 18px;
  }
  .checkbox-contant {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    .point /deep/ .el-checkbox__label {
      font-size: 16px;
    }
    .el-checkbox {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
  .save {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-divider__text {
    font-size: 18px;
  }
}
</style>