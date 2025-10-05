import { UserRegisterPayload } from '@_src/api/models/user.api.model';
import { prepareRandomUser } from '@_src/ui/factories/user.factory';
import { faker } from '@faker-js/faker/locale/en';

export function prepareUserPayload(): UserRegisterPayload {
  const registerUserDataUi = prepareRandomUser();

  const registerUserData: UserRegisterPayload = {
    email: registerUserDataUi.userEmail,
    firstname: registerUserDataUi.userFirstName,
    lastname: registerUserDataUi.userLastName,
    password: registerUserDataUi.userPassword,
    avatar: faker.image.avatar(),
  };
  return registerUserData;
}
