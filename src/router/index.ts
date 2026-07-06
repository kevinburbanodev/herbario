import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/features/home/presentation/views/HomeView.vue'
import CatalogView from '@/features/plants/presentation/views/CatalogView.vue'
import DetailView from '@/features/plants/presentation/views/DetailView.vue'
import GuidesView from '@/features/care-guides/presentation/views/GuidesView.vue'
import PestsView from '@/features/pests/presentation/views/PestsView.vue'
import GardenView from '@/features/garden/presentation/views/GardenView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/catalog', name: 'catalog', component: CatalogView },
    { path: '/plants/:id', name: 'plant-detail', component: DetailView },
    { path: '/guides', name: 'guides', component: GuidesView },
    { path: '/pests', name: 'pests', component: PestsView },
    { path: '/garden', name: 'garden', component: GardenView },
  ],
})
