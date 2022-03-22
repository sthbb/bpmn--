<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="toWorkFlow">去工作流页面</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '工作流项目-首页'
    }
  },
  methods:{
    toWorkFlow(){
      console.log('可以去了');
      this.$router.push('/workFlow')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
