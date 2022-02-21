<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSize"
    :page-size="size"
    :layout="pagingLayout"
    :total="total"
    class="pagination"
  >
  </el-pagination>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue';
let props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  // 分页布局
  pagingLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  // 分页选择显示个数
  pageSize: {
    type: Array,
    default: [10, 20, 30, 50],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});
let emits = defineEmits(['handleSizeChange', 'handleCurrentChange']);
// 获取vue实例化对象
const { proxy }: any = getCurrentInstance();
let size = ref(10);
// 切换分页显示个数
let handleSizeChange = (val: any) => {
  size.value = val;
  emits('handleSizeChange', val);
};
// 切换分页当前页数
let handleCurrentChange = (val: any) => {
  emits('handleCurrentChange', val);
};
</script>
<style lang="scss" scoped>
.pagination {
  text-align: right;
}
</style>