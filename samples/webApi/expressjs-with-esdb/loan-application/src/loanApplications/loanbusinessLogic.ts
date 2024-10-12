import {
  EmmettError,
  IllegalStateError,
  type Command,
  type Decider,
} from '@event-driven-io/emmett';
import {
  evolve,
  initialState,
  type Address,
  type LoanApplication,
  type LoanApplicationEvent,
  type LoanRequested,
} from './loanApplication';

/////////////////////////////////////////
////////// Commands
/////////////////////////////////////////

export type ApplyForLoan = Command<
  'ApplyForLoan',
  {
    loanRequestId: string;
    client: string;
    nationalId: string;
    address: Address;
  }
>;

export type LoanApplicationCommand = ApplyForLoan;

/////////////////////////////////////////
////////// Business Logic
/////////////////////////////////////////

export const applyForLoan = (
  command: ApplyForLoan,
  state: LoanApplication,
): LoanRequested => {
  if (state.status !== 'Empty')
    throw new IllegalStateError('Loan application is already in progress');

  const {
    data: { loanRequestId, client, nationalId, address },
    metadata,
  } = command;

  return {
    type: 'LoanRequested',
    data: {
      loanRequestId,
      client,
      nationalId,
      address,
      requestedAt: metadata?.now ?? new Date(),
    },
  };
};

export const decide = (
  command: LoanApplicationCommand,
  state: LoanApplication,
) => {
  const { type } = command;

  switch (type) {
    case 'ApplyForLoan':
      return applyForLoan(command, state);
    default: {
      const _notExistingCommandType: never = type;
      throw new EmmettError(`Unknown command type`);
    }
  }
};

export const decider: Decider<
  LoanApplication,
  LoanApplicationCommand,
  LoanApplicationEvent
> = {
  decide,
  evolve,
  initialState,
};
