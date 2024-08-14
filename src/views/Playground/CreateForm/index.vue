<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formData.id === undefined ? '新建' : '编辑'"
    destroy-on-close
    center
    width="380px"
    modal-class="mtk-dialog"
    @closed="handleDialogClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="top">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item class="mb-30px" prop="name" label="示例名称">
            <el-input v-model="formData.name" clearable placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="mb-30px" prop="playgroundType" label="示例类型">
            <el-select v-model="formData.playgroundType" clearable placeholder="请选择">
              <el-option
                v-for="playgroundType in playgroundTypes"
                :key="playgroundType.id"
                :label="playgroundType.label"
                :value="playgroundType.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { extend } from 'lodash-es';
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import { playgroundTypes } from '@/api/common';
  import { createFolder, updateFolder } from '@/api/github';

  interface ICreateReq {
    name: string;
    playgroundType: string;
    id?: string;
  }

  const props = withDefaults(
    defineProps<{
      visible: boolean;
      data?: any;
    }>(),
    {
      visible: false,
    },
  );

  const DEFAULT_FORM_DATA = {
    name: '',
    playgroundType: '',
  };
  const dialogVisible = ref<boolean>(props.visible);
  const [loading, setLoading] = useState(false);
  const formRef = ref<FormInstance | null>(null);
  const formData = ref<ICreateReq>(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)));
  const formRules: FormRules<Pick<ICreateReq, 'name' | 'playgroundType'>> = {
    name: [{ required: true, trigger: 'blur', message: '请输入示例名称' }],
    playgroundType: [{ required: true, trigger: 'change', message: '请选择示例类型' }],
  };

  const emits = defineEmits(['update:visible', 'change']);

  const resetForm = () => {
    formRef.value?.clearValidate();
    formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA));
  };

  const handleCancel = () => {
    dialogVisible.value = false;
    resetForm();
    emits('update:visible', false);
    emits('change', false);
  };

  const handleDialogClose = () => {
    handleCancel();
  };

  const handleCreateOrUpdate = () => {
    formRef.value?.validate((valid: boolean, fields) => {
      if (!valid) return console.error('表单校验不通过', fields);
      setLoading(true);
      const api = formData.value.id === undefined ? createFolder : updateFolder;
      api(formData.value as any)
        .then(() => {
          ElMessage.success('操作成功');
          handleCancel();
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  watch(
    () => props.visible,
    (v: boolean) => {
      dialogVisible.value = v;
      if (v && props.data) {
        const data = JSON.parse(JSON.stringify(props.data));
        extend(DEFAULT_FORM_DATA, data);
        formData.value = data;
      }
    },
  );
</script>

<style lang="less" scoped>
  .form-wrap {
    display: flex;

    .disable-flex {
      :deep(.el-form-item__content) {
        display: block;
      }
    }
  }
</style>
