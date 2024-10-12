import { DeciderSpecification } from '@event-driven-io/emmett';
import { Chance } from 'chance';
import { describe, it } from 'node:test';
import { evolve, initialState } from './loanApplication';
import { decide, type ApplyForLoan } from './loanbusinessLogic';

// Initialize Chance
const chance = new Chance();

const given = DeciderSpecification.for({
  decide,
  evolve,
  initialState: initialState,
});

const now = new Date();

// Generate and log a sample
const sampleApplyForLoan = generateSampleApplyForLoan();
// console.log(JSON.stringify(sampleApplyForLoan, null, 2));

const {
  data: { loanRequestId, client, address, nationalId },
} = sampleApplyForLoan;

void describe('Loan Application', () => {
  void describe('When empty', () => {
    void it('should accept a new loan application', () => {
      given([])
        .when(sampleApplyForLoan)
        .then([
          {
            type: 'LoanRequested',
            data: {
              loanRequestId,
              client,
              address,
              nationalId,
              requestedAt: now,
            },
          },
        ]);
    });
  });
});

// Function to generate sample data
function generateSampleApplyForLoan(): ApplyForLoan {
  return {
    type: 'ApplyForLoan',
    data: {
      loanRequestId: chance.guid(),
      client: chance.name(),
      nationalId: chance.string({
        length: 10,
        pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      }),
      address: {
        line1: chance.address(),
        city: chance.city(),
        region: chance.state(),
        country: chance.country({ full: true }),
        postCode: chance.postcode(),
      },
    },
    metadata: { now: now },
  };
}
