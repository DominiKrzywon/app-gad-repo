import { prepareUserPayload } from '@_src/api/factories/user-register.factory';
import { UserRegisterPayload } from '@_src/api/models/user.api.model';

interface InvalidUserPayload {
  case: string;
  payload: UserRegisterPayload;
  info?: {
    skip: boolean;
    annotation: {
      type: string;
      description: string;
    };
  };
}

export function invalidUserPayloadsGenerator(): InvalidUserPayload[] {
  const invalidUserPayloads: InvalidUserPayload[] = [];
  const userPayload = prepareUserPayload();
  const skipKeys = ['password'];

  Object.keys(userPayload).forEach((key) => {
    const casePayload: InvalidUserPayload = {
      case: `${key} empty`,
      payload: {
        ...prepareUserPayload(),
        [key]: '',
      },
    };
    if (skipKeys.includes(key)) {
      casePayload.info = {
        skip: true,
        annotation: {
          type: 'issue',
          description: `field ${key} not handle empty rejection issue 1234`,
        },
      };
    }
    invalidUserPayloads.push(casePayload);
  });

  return invalidUserPayloads;
}

export const invalidUserPayloads: InvalidUserPayload[] = [
  {
    case: 'firstname empty',
    payload: {
      ...prepareUserPayload(),
      firstname: '',
    },
  },
  {
    case: 'email empty',
    payload: {
      ...prepareUserPayload(),
      email: '',
    },
  },
  {
    case: 'password empty',
    payload: {
      ...prepareUserPayload(),
      password: '',
    },
    info: {
      skip: true,
      annotation: {
        type: 'issue',
        description: `field password not handle empty rejection issue 1234`,
      },
    },
  },
];
