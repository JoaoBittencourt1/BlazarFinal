<script setup>
import { ref, toRef, watch } from 'vue';
import { supabase } from 'src/supabase';
import { userAuthStore } from 'stores/userAuthStore';

const prop = defineProps(['path', 'size']);
const avatarPath = toRef(prop, 'path');

const emit = defineEmits(['upload', 'update:path']);
const uploading = ref(false);
const src = ref('');
const files = ref();
const input = ref(null);

const chooseFile = () => {
  input.value.click();
};
const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(avatarPath.value);
    if (error) throw error;
    src.value = URL.createObjectURL(data);
    const store = userAuthStore();
    store.$patch({
      user: {
        user_metadata: {
          avatar_blob: src.value,
        },
      },
    });
    return src;
  } catch (error) {
    console.error('Error downloading image: ', error.message);
  }
};

const uploadAvatar = async (evt) => {
  uploading.value = true;
  files.value = evt.target.files;
  try {
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload. ---');
    }

    const file = files.value[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;

    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    src.value = URL.createObjectURL(file);
    const store = userAuthStore();
    store.$patch({
      user: {
        user_metadata: {
          avatar_blob: src.value,
        },
      },
    });
    await emit('update:path', filePath);
  } catch (error) {
    alert(error.message);
  } finally {
    uploading.value = false;
  }
};

watch(avatarPath, async () => {
  if (avatarPath.value) await downloadImage();
});
</script>

<template>
  <input
    type="file"
    ref="input"
    accept="image/*"
    :disabled="uploading"
    @change="uploadAvatar"
    style="visibility: hidden"
  />
  <q-avatar
    size="150px"
    class="row avatar-filled-container"
    v-if="src && !uploading"
    rounded
    style="border: 1px #cccccc; border-radius: 80px"
  >
    <div class="col">
      <q-img class="avatar-image" :src="src" alt="Avatar" />
      <q-btn
        class="avatar-button"
        @click="chooseFile"
        dense
        color="primary"
        size="sm"
        round
        icon="edit"
      />
    </div>
  </q-avatar>
  <q-avatar
    class="row avatar-empty-container"
    size="150px"
    v-if="!src && !uploading"
    rounded
    style="border: 1px solid grey; border-radius: 80px"
  >
    <div class="col">
      <q-icon class="person-icon q-ml-lg" name="person" round color="primary" />
      <q-btn
        class="avatar-button"
        @click="chooseFile"
        dense
        color="primary"
        size="sm"
        round
        icon="edit"
        style="cursor: pointer"
      />
    </div>
  </q-avatar>

  <div
    class="row"
    v-if="uploading"
    style="
      width: 150px;
      height: 150px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    "
  >
    <q-spinner-orbit class="col" color="primary" size="md" :thickness="2" />
  </div>
</template>
<style lang="scss">
.avatar-empty-container {
  .person-icon {
    margin-left: 35px;
    margin-bottom: 10px;
  }
  .avatar-button {
    margin-bottom: 55px;
    cursor: pointer;
  }
}

.avatar-filled-container {
  .avatar-image {
    height: 150px;
  }
  .avatar-button {
    margin-left: 110px;
    margin-top: -240px;
  }
}
</style>
