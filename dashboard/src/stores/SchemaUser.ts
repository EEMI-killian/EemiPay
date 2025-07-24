import type { Schema } from "@/types/Schema";
import { ref } from "@vue/runtime-dom";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
const user = ref<Schema | null>(null);

function setUser(newUser: Schema | null) {
  user.value = newUser;
}

function clearUser() {
  user.value = null;
}

return {
  user,
  setUser,
  clearUser,
};
}
);