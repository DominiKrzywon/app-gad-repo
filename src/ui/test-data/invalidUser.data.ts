import { prepareRandomUser } from '@_src/ui/factories/user.factory';
import { RegisterUserModel } from '@_src/ui/models/user.model';

interface InvalidUserUi {
  case: string;
  payload: RegisterUserModel;
  field: string;
  info?: {
    skip: boolean;
    annotation: {
      type: string;
      description: string;
    };
  };
}

export function invalidUserGeneratorUi(): InvalidUserUi[] {
  const invalidUserPayloads: InvalidUserUi[] = [];
  const userPayload = prepareRandomUser();
  const skipKeys: string[] = [];

  Object.keys(userPayload).forEach((key) => {
    const casePayload: InvalidUserUi = {
      case: `${key} empty`,
      payload: {
        ...prepareRandomUser(),
        [key]: '',
      },
      field: key.slice(4),
    };
    if (skipKeys.includes(key)) {
      casePayload.info = {
        skip: true,
        annotation: {
          type: 'issue',
          description: `field ${key} not handle empty rejection issue 6789`,
        },
      };
    }
    invalidUserPayloads.push(casePayload);
  });

  return invalidUserPayloads;
}

export const invalidUserUi: InvalidUserUi[] = [
  {
    case: 'firstname empty',
    payload: {
      ...prepareRandomUser(),
      userFirstName: '',
    },
    field: 'firstname',
  },
  {
    case: 'email empty',
    payload: {
      ...prepareRandomUser(),
      userEmail: '',
    },
    field: 'email',
  },
  {
    case: 'password empty',
    payload: {
      ...prepareRandomUser(),
      userPassword: '',
    },
    field: 'password',
    // info: {
    //   skip: true,
    //   annotation: {
    //     type: 'issue',
    //     description: `field password not handle empty rejection issue 1234`,
    //   },
    // },
  },
];
