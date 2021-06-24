import ResponsiveValues, { ResponsiveValue } from './responsive-values';
import { expect } from 'chai';

const rv = new ResponsiveValues({});

describe('Should test the methods of the ResponsiveValues component', () => {
    it('Should unify length of the arrays', () => {
        const arrs = rv.unifyArraysLength(
            rv.state.examples.arr1 as ResponsiveValue[],
            rv.state.examples.arr2 as ResponsiveValue[]
        );

        expect(arrs[0]).to.have.lengthOf(arrs[1].length);
    });

    it('Should fill the gaps in the array with nearest neighbour', () => {
        const arr = rv.fillGaps(rv.state.examples.arr2 as ResponsiveValue[]);

        expect(arr[2]).to.be.equal(arr[3]);
        expect(arr[6]).to.be.equal(arr[5]);
    });

    it('Should fill the gaps and sum the arrays of responsive values', () => {
        const sum = rv.sum(...[
            rv.state.examples.arr1 as ResponsiveValue[],
            rv.state.examples.arr3 as ResponsiveValue[]
        ].map(arr => rv.fillGaps(arr)));

        expect(sum).to.have.all.members([16, 74, 74, 28, 5, 99]);
    });

    it('Should sum single responsive values', () => {
        const sum = rv.sum(rv.state.examples.val1 as ResponsiveValue, rv.state.examples.val2 as ResponsiveValue);

        expect(sum).to.be.equal(13);
    });

    it('Should compress an array of responsive values', () => {
        const arr = rv.compress(rv.state.examples.arr2 as ResponsiveValue[]);

        expect(arr).to.have.all.members([
            (rv.state.examples.arr2 as ResponsiveValue[])[0],
            (rv.state.examples.arr2 as ResponsiveValue[])[1],
            null,
            (rv.state.examples.arr2 as ResponsiveValue[])[3],
            null,
            (rv.state.examples.arr2 as ResponsiveValue[])[5],
        ]);
    });

    it('Should get the maximum value key in the object', () => {
        const key = rv.maxValueKey(rv.state.examples.val3 as ResponsiveValue[]);

        expect(key).to.be.equal('alice');
    });

    it('Should get an array of keys of maximum values in objects', () => {
        const keys = rv.maxValueKey(rv.state.examples.arr5 as ResponsiveValue[]);

        expect(keys).to.have.all.members(['b', 'd', null, 'd']);
    });

    describe('Should fill the gaps and get the width of the containers', () => {
        it('Two arrays', () => {
            const widths = rv.getContainerWidth(
                ...rv.unifyArraysLength(
                    rv.state.examples.arr1 as ResponsiveValue[],
                    rv.state.examples.arr6 as ResponsiveValue[]
                ).map((arr) => {
                    return rv.fillGaps(arr as ResponsiveValue[]) as (number | null)[]
                }) as [(number | null)[], (boolean | null)[]]
            );

            expect(widths).to.have.all.members(['100%', 'calc(100% - 15px)', 'calc(100% - 15px)', '100%', 'calc(100% - 10px)']);

            rv.getContainerWidth(rv.fillGaps(rv.state.examples.arr1 as ResponsiveValue[]) as (number | null)[], false);
        });

        it('containerMargin is array, isSnappedToEdge is value', () => {
            const widths = rv.getContainerWidth(rv.fillGaps(rv.state.examples.arr1 as ResponsiveValue[]) as (number | null)[], false);

            expect(widths).to.have.all.members(['calc(100% - 5px)', 'calc(100% - 15px)', 'calc(100% - 15px)', 'calc(100% - 10px)']);
        });

        it('containerMargin is value, isSnappedToEdge is array', () => {
            const widths = rv.getContainerWidth(10, rv.fillGaps(rv.state.examples.arr6 as ResponsiveValue[]) as (boolean | null)[]);

            expect(widths).to.have.all.members(['100%', 'calc(100% - 5px)', 'calc(100% - 5px)', '100%','calc(100% - 5px)']);
        });

        it('containerMargin is value, isSnappedToEdge is value', () => {
            const widths = rv.getContainerWidth(10, false);

            expect(widths).to.have.be.equal('calc(100% - 5px)');
        });
    });
});
