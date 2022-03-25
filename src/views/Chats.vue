<template>

</template>

<script>


export default {
  components: {
  },
  mixins: [],
  props: {
  },
  data: () => ({
    
  }),
  computed: {
}
}
</script>

<style lang="stylus" scoped>
@import '~vuetify/src/stylus/settings/_colors.styl'
@import '../assets/stylus/settings/_colors.styl'

.chats-view
  &__tile
    >>> .v-list__tile
      justify-content: flex-end
      height: 56px
    >>> .v-list__tile__avatar
      min-width: 28px
  &__title
    font-weight: 300
    font-size: 14px

/** Themes **/
.theme--light
  .chats-view
    &__tile
      >>> .v-list__tile
        background-color: $adm-colors.secondary2-transparent
    &__title
      color: $adm-colors.muted
    &__icon
      color: $adm-colors.regular

.theme--dark
  .chats-view
    &__icon
      color: $shades.white

/** Animations **/
.messages-move
  transition: transform 0.5s
</style>
