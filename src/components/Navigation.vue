<template>
    <v-navigation-drawer location="left" flat app>
        <v-list>
            <v-list-item prepend-avatar="../assets/logo.png" title="ADMIN TABLE">
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list nav density="compact" :lines="false" >
            <v-list-item 
                v-for="(navItem, index) in navItems" 
                :key="index" 
                :value="navItem"
                :to="navItem.path"
            >
                <template v-slot:prepend>
                    <v-icon>{{ navItem.icon }}</v-icon>
                </template>
                <v-list-item class="no-select">{{ navItem.text }}</v-list-item>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script setup>
const navItems = [
    {text: "Home", icon: "mdi-home", path: "/"},
    {text: "Import", icon: "mdi-import", path: "/import"},
    {text: "Export", icon: "mdi-export", path: "/export"},
]
</script>
<style>
.no-select {
    user-select: none;
}
</style>