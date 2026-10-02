import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import Profile from "@/components/Profile.vue";
import Login from "@/components/Login.vue";
import { useAuthStore } from "@/stores/auth";
import Register from "@/components/Register.vue";
import Notification from "@/components/Notification.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import UjiKompetensi from "@/components/UjiKompetensi.vue";
import soal1 from "@/components/soal1.vue";
import soal2 from "@/components/soal2.vue";
import soal3 from "@/components/soal3.vue";
import soal4 from "@/components/soal4.vue";
import soal5 from "@/components/soal5.vue";
import soal6 from "@/components/soal6.vue";
import soal7 from "@/components/soal7.vue";
import soal8 from "@/components/soal8.vue";
import soal9 from "@/components/soal9.vue";
import soal10 from "@/components/soal10.vue";
import soal11 from "@/components/soal11.vue";
import soal12 from "@/components/soal12.vue";
import soal13 from "@/components/soal13.vue";
import soal14 from "@/components/soal14.vue";
import soal15 from "@/components/soal15.vue";
import soal16 from "@/components/soal16.vue";
import soal17 from "@/components/soal17.vue";
import kumpul from "@/components/kumpul.vue";
import AdminDashboard from "@/components/AdminComponents/AdminDashboard.vue";
import UserList from '@/components/AdminComponents/UserList.vue';
import UserDetail from '@/components/AdminComponents/UserDetail.vue';
import SoalDetail from '@/components/AdminComponents/SoalDetail.vue';
import DataGuru from "@/components/AdminComponents/DataGuru.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Admin routes
    {
      path: '/admin',
      component: AdminDashboard,
      meta: { requiresAdmin: true },
      children: [
        { path: '', component: UserList, name: 'user-list' },
        { path: 'users/:userId', component: UserDetail, name: 'user-detail' },
        { path: 'soal/:soalNumber/:userId', component: SoalDetail, name: 'soal-detail' },
        { path: 'dataguru', component: DataGuru, name: 'dataguru' },
      ]
    },
    // Other routes
    { path: "/", name: "home", component: HomePage },
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPassword,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isLoggedIn) {
          next({ name: "home" });
        } else {
          next();
        }
      },
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPassword,
      beforeEnter: (to, from, next) => {
        const email = to.query.email;
        if (!email) {
          next({ name: "forgot-password" });
        } else {
          next();
        }
      },
    },
    {path: '/notifications',name: 'notifications',component: Notification },
    { path: "/users", name: "userlist", component: Profile },
    { path: "/uji-kompetensi", name: "ujikompetensi", component: UjiKompetensi },
    { path: "/kumpul", name: "kumpul", component: kumpul },
    { path: "/soal-1", name: "soal-1", component: soal1 },
    { path: "/soal-2", name: "soal-2", component: soal2 },
    { path: "/soal-3", name: "soal-3", component: soal3 },
    { path: "/soal-4", name: "soal-4", component: soal4 },
    { path: "/soal-5", name: "soal-5", component: soal5 },
    { path: "/soal-6", name: "soal-6", component: soal6 },
    { path: "/soal-7", name: "soal-7", component: soal7 },
    { path: "/soal-8", name: "soal-8", component: soal8 },
    { path: "/soal-9", name: "soal-9", component: soal9 },
    { path: "/soal-10", name: "soal-10", component: soal10 },
    { path: "/soal-11", name: "soal-11", component: soal11 },
    { path: "/soal-12", name: "soal-12", component: soal12 },
    { path: "/soal-13", name: "soal-13", component: soal13 },
    { path: "/soal-14", name: "soal-14", component: soal14 },
    { path: "/soal-15", name: "soal-15", component: soal15 },
    { path: "/soal-16", name: "soal-16", component: soal16 },
    { path: "/soal-17", name: "soal-17", component: soal17 },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const publicPages = ["login", "register", "home", "forgot-password", "reset-password"];
  const authRequired = !publicPages.includes(to.name);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  console.log("Route to:", to.path, "authRequired:", authRequired, "requiresAdmin:", requiresAdmin);
  console.log("authStore state:", {
    isLoggedIn: authStore.isLoggedIn,
    isAdmin: authStore.isAdmin,
    user: authStore.user,
  });

  if (authRequired && !authStore.isLoggedIn) {
    // Set message di query untuk ditampilkan di login page
    return next({ 
      name: "login", 
      query: { redirect: to.path, message: 'Silakan login untuk mengakses halaman ini' }
    });
  }

  if (requiresAdmin && !authStore.isAdmin) {
    // Set message untuk ditampilkan di home page
    return next({ 
      name: "home", 
      query: { message: 'Anda tidak memiliki izin untuk mengakses halaman admin' }
    });
  }

  next();
});

export default router;