import { deepStrictEqual as eq  } from 'assert';
import { iteratePassword, nextPassword, satisfiesRule1, satisfiesRule3 } from './11';


describe('day 11', () => {
    describe('iteratePassword', () => {
        it('should increment the last character', () => {
            eq(iteratePassword('aa'), 'ab');
        });

        it('should continue if the last character is z', () => {
            eq(iteratePassword('az'), 'ba');
        });

        it('should continue multiple times', () => {
            eq(iteratePassword('azz'), 'baa');
        });
    });

    describe('rule1', () => {
        it('should succeed for example input 1', () => {
            eq(satisfiesRule1('hijklmmn'), true);
        });

        it('should fail for example input 2', () => {
            eq(satisfiesRule1('abbceffg'), false);
        });

        it('should fail for example input 3', () => {
            eq(satisfiesRule1('abbcegjk'), false);
        });

        it('should succeed for example input 4', () => {
            eq(satisfiesRule1('abcdffaa'), true);
        });

        it('should succeed for example input 5', () => {
            eq(satisfiesRule1('ghjaabcc'), true);
        });
    });

    describe('rule3', () => {
        it('should fail for example input 1', () => {
            eq(satisfiesRule3('hijklmmn'), false);
        });

        it('should succeed for example input 2', () => {
            eq(satisfiesRule3('abbceffg'), true);
        });

        it('should fail for example input 3', () => {
            eq(satisfiesRule3('abbcegjk'), false);
        });

        it('should succeed for example input 4', () => {
            eq(satisfiesRule3('abcdffaa'), true);
        });

        it('should succeed for example input 5', () => {
            eq(satisfiesRule3('ghjaabcc'), true);
        });
    });

    describe('nextPassword', () => {
        it('should match the fourth example', () => {
            eq(nextPassword('abcdefgh'), 'abcdffaa');
        });
    })
});