import { ISampler } from "./types";

export class AlwaysOnSampler implements ISampler {
    shouldSample(): boolean {
        return true;
    }
}

export class ProbabilitySampler implements ISampler {
    constructor(private readonly probability: number) {}

    shouldSample(_name: string, parentSampled?: boolean): boolean {
        if (typeof parentSampled === "boolean") return parentSampled;
        return Math.random() < this.probability;
    }
}
