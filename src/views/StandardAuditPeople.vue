<!--
 * @Author: your name
 * @Date: 2021-03-24 17:06:43
 * @LastEditTime: 2021-04-06 15:46:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data_trace\src\views\StantardAuditPeople.vue
-->
<template>
  <div class="stantard-people">
    <el-container>
      <el-aside width="200px">
        <el-input
          placeholder="输入用户名进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree ref="tree" :data="treeData" node-key="reviewerId" :props="{label: 'reviewerName', children: 'children'}" :default-expand-all="true" :expand-on-click-node="false" highlight-current @node-click="checkChange" :check-on-click-node	="true" :current-node-key="currentKey"
        :filter-node-method="filterNode"
        ></el-tree>
      </el-aside>
      <el-main>
          <no-data v-if="userName.length == 0" size="medium"></no-data>
          <div v-if="userName.length != 0">
            <div>
              <el-form :model="tagForm" :inline="true">
                <!-- <el-form-item label="已选择的用户">
                  <el-tag size="medium" type="info" effect="dark" v-for="item in userName" :key="item.reviewerId" :disable-transitions="true">{{item.reviewerName}}</el-tag>
                </el-form-item> -->
                <el-form-item label=""><el-button type="warning" @click="save">保存</el-button></el-form-item>
              </el-form>
              <div class="line"></div>
            </div>
            <div v-loading="loading">
              <el-checkbox-group v-model="checkBoxForm">
                <el-checkbox :label="item.pointId" v-for="item in pointData" :key="item.pointId">{{item.pointName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import NoData from '../components/NoData.vue';
import { getLocalstorage } from '../js/utils.js'
export default {
  components: { NoData },
  name: 'StandardAuditPeople',
  data() {
    return {
      treeData: [], // 用户列表
      areaData: [
        {
          label: '黄山',
          value: '1'
        }
      ],
      userName: [], // 选择的用户
      tagForm: {}, // form 表单
      checkBoxForm: [], // 授权的点位
      pointData: [], // 点位列表
      mutiSelection: {}, // 选择的用户
      loading: false,    // loading加载
      filterText: '', // 左侧树输入框
      currentKey: '', // 左侧树默认值
      base: 'http://192.168.90.41:8024/api', //window.API api接口地址
    }
  },
  mounted() {
    console.log(window.API);
    this.getUserList();
  },
  methods: {
    /**
     * 根据用户获取点位信息
     */
    getPoints(params = {}) {
      this.loading = true;
      this.$axios({
          method: "get",
          url: `${this.base}/spanValuesReview/getByReviewerId`,
          params,
      }).then(res=> {
          
          console.log(res);
          this.pointData = res.data.data;
          this.checkBoxForm = this.pointData.filter(item=> {
            return item.checkStatus == 1
          })
            .map(item=> {
              return item.pointId
            })
            setTimeout(() => {
              this.loading = false;
            }, 500);
      }).catch(err=> {
        this.loading = false;
        this.$notify({
          title: '提示',
          message: err,
          type: 'danger'
        })
      })
    },
    /**
     * 获取用户列表
     */
    getUserList() {
      this.$axios({
        method: 'get',
        url: `${this.base}/spanValuesReview/getReviewerList`,
        params: null
      }).then(res=> {
        this.treeData = res.data.data;
        if(this.treeData.length !== 0) {
          this.currentKey = this.treeData[0].reviewerId;
          this.userName =this.treeData.filter((item, index)=> {
            return index == 0
          })
          this.mutiSelection = this.treeData[0];
          this.$nextTick(()=> {
            this.$refs.tree.setCurrentKey(this.treeData[0].reviewerId)
          })
        }
        // 根据默认点位获取点位信息
        this.getPoints({reviewerId: this.currentKey})
      }).catch(err=> {
        console.log(err);
      })
    },
    /**
     * 保存数据
     */
    save() {
      let userId = getLocalstorage('UserGuid') || '4aea3f54-4e3e-4c4e-b283-a90cc0c16873'
      const data = this.checkBoxForm.map(item=> {
        return {
          pointId: item,
          creatorId: userId,
          reviewerId: this.mutiSelection.reviewerId,
          reviewerName: this.mutiSelection.reviewerName,
          pointName: this.pointData.filter(ite=> {
            return ite.pointId == item
          })[0].pointName
        }
      })
      this.saveApi(data);
    },
    saveApi(data = {}) {
      this.loading = true;
      this.$axios({
        method: 'post',
        url: `${this.base}/spanValuesReview/save`,
        headers: {'content-type' : 'application/json;chartset=utf-8'},
        data
      }).then(res=> {
        console.log(res);
        setTimeout(() => {
          this.loading = false
        }, 500);
        this.$notify({
          title: '提示',
          message: '保存成功',
          type: 'success'
        })
      })
    },
    checkChange(data) {
      console.log(data);
      this.mutiSelection = data;
      this.userName = data.children ? [] : [data];
      this.getPoints({reviewerId: data.reviewerId})
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.reviewerName.indexOf(value) !== -1;
    }
  },
  watch: {
    userName(newVal) {
      if(newVal.length == 0) {
        this.$notify({
          title: '提示',
          message: '请选择用户',
          type: 'warning'
        })
      }
    },
    filterText(val) {
      console.log(val);
      this.$refs.tree.filter(val);
    }
  }
}
</script>

<style lang="scss" scoped>
.stantard-people {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      border-right: 1px solid #eee;
      .el-input {
        margin: 10px;
        display: block;
        width: auto;
      }
    }
  }
  .el-checkbox {
    margin-bottom: 15px;
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
  .save {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-divider__text {
    font-size: 18px;
  }
  /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {    background-color: #409EFF;
  color: #fff;
}
}
</style>