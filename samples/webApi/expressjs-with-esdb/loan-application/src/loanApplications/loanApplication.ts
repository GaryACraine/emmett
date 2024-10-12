import type { Event } from '@event-driven-io/emmett';

/////////////////////////////////////////
////////// Types
/////////////////////////////////////////

export type Address = {
  line1: string;
  city: string;
  region: string;
  country: string;
  postCode: string;
};

/////////////////////////////////////////
////////// Events
/////////////////////////////////////////

export type LoanRequested = Event<
  'LoanRequested',
  {
    loanRequestId: string;
    client: string;
    nationalId: string;
    address: Address;
    requestedAt: Date;
  }
>;

export type CreditChecked = Event<
  'CreditChecked',
  {
    loanRequestId: string;
    nationalId: string;
    creditscore: Address;
    creditCheckedAt: Date;
  }
>;

export type LoanAutomaticallyApproved = Event<
  'LoanAutomaticallyApproved',
  {
    loanRequestId: string;
    nationalId: string;
    creditscore: Address;
    creditCheckedAt: Date;
  }
>;

export type LoanAutomaticallyDenied = Event<
  'LoanAutomaticallyDenied',
  {
    loanRequestId: string;
    nationalId: string;
    creditscore: Address;
    creditCheckedAt: Date;
  }
>;

export type LoanApprovalNeeded = Event<
  'LoanApprovalNeeded',
  {
    loanRequestId: string;
    nationalId: string;
    creditscore: Address;
    creditCheckedAt: Date;
  }
>;

export type LoanManuallyApproved = Event<
  'LoanManuallyApproved',
  {
    loanRequestId: string;
    nationalId: string;
    creditscore: Address;
    creditCheckedAt: Date;
  }
>;
export type LoanManuallyDenied = Event<
  'LoanManuallyDenied',
  {
    loanRequestId: string;
    nationalId: string;
    creditscore: Address;
    creditCheckedAt: Date;
  }
>;

export type LoanApplicationEvent =
  | LoanRequested
  | CreditChecked
  | LoanAutomaticallyApproved
  | LoanAutomaticallyDenied
  | LoanApprovalNeeded
  | LoanManuallyApproved
  | LoanManuallyDenied;

/////////////////////////////////////////
////////// Loan Application
/////////////////////////////////////////

export type EmptyLoanApplication = {
  status: 'Empty';
};

export type RequestedLoanApplication = {
  status: 'Requested';
  nationalId: string;
};

export type CreditCheckedLoanApplication = {
  status: 'CreditChecked';
  score: string;
};

export type CompletedLoanApplication = {
  status: 'Completed';
};

export type LoanApplication =
  | EmptyLoanApplication
  | RequestedLoanApplication
  | CreditCheckedLoanApplication
  | CompletedLoanApplication;

export const initialState = (): LoanApplication => {
  return {
    status: 'Empty',
  };
};

/////////////////////////////////////////
////////// Evolve
/////////////////////////////////////////

export const evolve = (
  state: LoanApplication,
  event: LoanApplicationEvent,
): LoanApplication => {
  const { type, data } = event;

  switch (type) {
    case 'LoanRequested': {
      if (state.status !== 'Empty') return state;

      const { nationalId } = data;

      return {
        status: 'Requested',
        nationalId: nationalId,
      };
    }

    default:
      return state;
  }
};
