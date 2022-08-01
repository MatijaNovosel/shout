<template>
  <router-view v-slot="{ Component, route }">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      appear
      :duration="300"
    >
      <div :key="route.path">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>
