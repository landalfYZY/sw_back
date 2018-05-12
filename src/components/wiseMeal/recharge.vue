<template>
  <transition name="fade" mode="out-in">
      <div>
        <Form :model="form" label-position="right" :label-width="100">
            <FormItem label="充值金额">
                <Input v-model="form.charge"></Input>
            </FormItem>
            <FormItem label="赠送金额">
                <Input v-model="form.send"></Input>
            </FormItem>
            <FormItem >
                <Button type="primary" @click="submitForm()">确认并提交</Button>
            </FormItem>
        </Form>
      </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      form: {
        charge: "",
        type: "充值",
        appid: localStorage.getItem("miniId"),
        send: 0
      }
    };
  },
  mounted() {},
  methods: {
    submitForm() {
      var that = this;
      if (this.form.price == "") {
        that.$Message.error("充值金额不能为空");
      } else {
        $.ajax({
          url: sessionStorage.getItem("API") + "charge/add",
          type: "POST",
          data: this.form,
          dataType: "json",
          success(res) {
            if (res.code) {
              that.$Modal.confirm({
                title: "添加成功",
                content: "是否要继续添加？",
                okText: "前往列表",
                cancelText: "继续添加",
                onOk: () => {
                  that.$router.push({
                    path: "/wiseMealRechargeRule"
                  });
                },
                onCancel: () => {}
              });
            } else {
              that.$Message.error(res.msg);
            }
          },
          complete() {}
        });
      }
    }
  }
};
</script>
