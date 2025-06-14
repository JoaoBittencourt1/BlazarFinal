<template>
  <span class="material-icons" :class="{ size, family }" translate="no">{{ icon }}</span>
</template>

<script lang="ts" setup>
type FontIcon = {
  icon:
    | 'search'
    | 'travel_explore'
    | 'dashboard'
    | 'bookmarks'
    | 'history'
    | 'settings'
    | 'logout'
    | 'bookmark_add'
    | 'edit'
    | 'picture_as_pdf'
    | 'delete'
    | 'filter_alt'
    | 'link'
    | 'keyboard_arrow_left'
    | 'keyboard_arrow_right'
    | 'more_vert'
    | 'close'
    | 'done'
    | 'add';
  family?: 'md-outlined' | 'md-rounded' | 'md-sharp' | 'md-twotone' | undefined;
  size?: 'md-16' | 'md-24' | 'md-48' | undefined;
};

defineProps<FontIcon>();
</script>
