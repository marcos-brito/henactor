import { describe, expect, it } from "vitest";
import { GridNavigator, RegularNavigator } from "./navigator.svelte";

describe("GridNavigator", () => {
    it("Should not go beyond the number of columns", () => {
        const navigator = new GridNavigator(9, 3);
        for (let i = 0; i < 10; i++) navigator.right();
        expect(navigator.selected).toBe(2);
    });

    it("Should not go to a column below 0", () => {
        const navigator = new GridNavigator(9, 3);
        for (let i = 0; i < 10; i++) navigator.left();
        expect(navigator.selected).toBe(0);
    });

    it("Should not go beyond the number of rows", () => {
        const navigator = new GridNavigator(9, 3);
        for (let i = 0; i < 15; i++) navigator.down();
        expect(navigator.selected).toBe(6);
    });

    it("Should not go to a row below 0", () => {
        const navigator = new GridNavigator(9, 3);
        for (let i = 0; i < 10; i++) navigator.up();
        expect(navigator.selected).toBe(0);
    });

    it("Should go up and keep the same column", () => {
        const navigator = new GridNavigator(9, 3);
        navigator.right();
        navigator.right();
        navigator.down();
        navigator.down();
        navigator.up();
        expect(navigator.selected).toBe(5);
    });

    it("should select the last", () => {
        const navigator = new GridNavigator(10, 3);
        navigator.last();
        expect(navigator.selected).toBe(9);
    });

    it("should select the first", () => {
        const navigator = new GridNavigator(9, 3);
        navigator.last();
        navigator.first();
        expect(navigator.selected).toBe(0);
    });

    it("Should go down and keep the same column", () => {
        const navigator = new GridNavigator(9, 3);
        navigator.right();
        navigator.down();
        expect(navigator.selected).toBe(4);
    });

    it("shoud keep the col if right cell is empty", () => {
        const navigator = new GridNavigator(10, 3);
        navigator.last();
        navigator.right();
        navigator.right();
        expect(navigator.selected).toBe(9);
    });

    it("should go to the first col if bellow cell is emtpy", () => {
        const navigator = new GridNavigator(10, 3);
        navigator.last();
        navigator.up();
        navigator.right();
        navigator.down();
        expect(navigator.selected).toBe(9);
    });
});

describe("RegularNavigator", () => {
    it("Should not allow to select beyond N", () => {
        const navigator = new RegularNavigator(6);
        for (let i = 0; i < 10; i++) navigator.next();
        expect(navigator.selected).toBe(6);
    });

    it("Should not allow to select before 0", () => {
        const navigator = new RegularNavigator(6);
        for (let i = 0; i < 10; i++) navigator.previous();
        expect(navigator.selected).toBe(0);
    });

    it("should select the last", () => {
        const navigator = new RegularNavigator(6);
        navigator.last();
        expect(navigator.selected).toBe(6);
    });

    it("should select the first", () => {
        const navigator = new RegularNavigator(6);
        navigator.last();
        navigator.first();
        expect(navigator.selected).toBe(0);
    });
});
