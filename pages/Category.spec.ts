import { shallowMount } from "@vue/test-utils";

import Category from "./Category.vue";

const $t = (msg: string) => msg;

describe("Category Component", () => {
  it("should render", async () => {
    const host = shallowMount(Category, {
      propsData: {},
      mocks: { $t }
    });

    expect(host).toBeDefined();
  });
});
