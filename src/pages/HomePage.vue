<template>
  <header>
    <span>Github Users</span>
    <a-input-search :style="{width:'320px',height: '32px'}"
                    placeholder="请输入用户名"
                    disabled
                    search-button/>
  </header>
  <a-input-search :style="{width:'50%',marginTop:'300px'}"
                  @search="handleSearch"
                  placeholder="请输入用户名"
                  size="large"
                  search-button>
    <template #button-default>
      确认
    </template>
  </a-input-search>
</template>

<script>
import API from "@/api";

export default {
  name: "HomePage",
  methods: {
    handleSearch(value) {
      if (value === "") {
        this.$message.info("请勿输入空值")
      } else {
        API.findUser(value).then(res => {
          console.log(res);
          if (res.data === null) {
            this.$message.error(`用户${value}不存在`);
          } else {
            this.$router.push(`/user/${res.data}`);
          }
        });
      }
    }
  },
}
</script>

<style scoped>
header {
  width: 100%;
  height: 80px;
  background-color: #24292F;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

span {
  font-size: xx-large;
  font-weight: bolder;
  color: #ffffff;
}
</style>