import { describe, it, expect } from "vitest";
import { StatusRegistry, type StatusProvider } from "./registry";

class MockProvider implements StatusProvider {
    public status = "";

    constructor(public name: string) {}
}

describe("StatusRegistry", () => {
    it("should keep the order when finding", () => {
        const query = ["C", "A", "B"];
        const registry = new StatusRegistry();

        registry
            .register(new MockProvider("A"))
            .register(new MockProvider("B"))
            .register(new MockProvider("C"))
            .register(new MockProvider("D"));

        expect(registry.find(...query).map((provider) => provider.name)).toEqual(query);
    });

    it("should return all providers if there is only the blob", () => {
        const query = ["*"];
        const registry = new StatusRegistry();

        registry
            .register(new MockProvider("A"))
            .register(new MockProvider("B"))
            .register(new MockProvider("C"))
            .register(new MockProvider("D"))
            .register(new MockProvider("E"));

        expect(registry.find(...query).map((provider) => provider.name)).toEqual([
            "A",
            "B",
            "C",
            "D",
            "E",
        ]);
    });

    it("should expand providers at the blob's index", () => {
        const query = ["C", "A", "*", "B"];
        const registry = new StatusRegistry();

        registry
            .register(new MockProvider("A"))
            .register(new MockProvider("B"))
            .register(new MockProvider("C"))
            .register(new MockProvider("D"))
            .register(new MockProvider("E"));

        expect(registry.find(...query).map((provider) => provider.name)).toEqual([
            "C",
            "A",
            "D",
            "E",
            "B",
        ]);
    });
});
