import { describe, expect, it } from "vitest";
import { gridNavigator, regularNavigation } from "./navigators.svelte";

describe("bothNavigation", () => {
    it("Should not go beyond the number of columns", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6, 7, 8], 3)
        for (let i = 0; i < 10; i++) navigator.right();
        expect(navigator.selected).toBe(2);
    })

    it("Should not go to a column below 0", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6, 7, 8], 3)
        for (let i = 0; i < 10; i++) navigator.left();
        expect(navigator.selected).toBe(0);
    })

    it("Should not go beyond the number of rows", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6, 7, 8], 3)
        for (let i = 0; i < 10; i++) navigator.down();
        expect(navigator.selected).toBe(6);
    })

    it("Should not go to a row below 0", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6, 7, 8], 3)
        for (let i = 0; i < 10; i++) navigator.up();
        expect(navigator.selected).toBe(0);
    })

    it("Should go up and keep the same column", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6, 7, 8], 3)
        navigator.right();
        navigator.right();
        navigator.down();
        navigator.down();
        navigator.up();
        expect(navigator.selected).toBe(5);
    })

    it("Should go down and keep the same column", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6, 7, 8], 3)
        navigator.right();
        navigator.down();
        expect(navigator.selected).toBe(4);
    })

    it("Should select the first if the row below is incomplete", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6], 3)
        navigator.right();
        navigator.right();
        navigator.down();
        navigator.down();
        expect(navigator.selected).toBe(6);
    })

    it("Should keep the same cell if right cell is empty", () => {
        const navigator = gridNavigator([0, 1, 2, 3, 4, 5, 6], 3)
        navigator.down();
        navigator.down();
        navigator.right();
        navigator.right();
        expect(navigator.selected).toBe(6);
    })

})

describe("regularNavigation", () => {
    it("Should not allow to select beyond N", () => {
        const navigator = regularNavigation([0, 1, 2, 3, 4, 5]);
        for (let i = 0; i < 10; i++) navigator.next();
        expect(navigator.selected).toBe(5);
    })

    it("Should not allow to select before 0", () => {
        const navigator = regularNavigation([0, 1, 2, 3, 4, 5]);
        for (let i = 0; i < 10; i++) navigator.previous();
        expect(navigator.selected).toBe(0);
    })
})
