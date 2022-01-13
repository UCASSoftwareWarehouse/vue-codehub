<template>
  <div>test()
    <el-button type="primary" @click="test">确 定</el-button>
  </div>
</template>

<script>
import { test } from '@/api/test'
export default {
  name: 'Test',
  methods: {
    test() {
      test().then(response => {
      })
    }
  }
}
</script>
